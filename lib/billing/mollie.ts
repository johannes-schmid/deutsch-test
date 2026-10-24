import "server-only"
import createMollieClient, { SubscriptionStatus } from "@mollie/api-client"
import { createAdminClient } from "@/lib/supabase/admin"
import { SITE_URL } from "@/lib/seo"
import { sendActivationEmail } from "@/lib/email/billing"
import { processPayment, toCents, type BillingApi, type BillingStore, type PaymentRow } from "@/lib/billing/process"

/** Server-only Mollie + Supabase adapters for lib/billing/process.ts. MOLLIE_API_KEY is a `test_` key locally, `live_` only on Vercel. */

export const mollieConfigured = () => !!process.env.MOLLIE_API_KEY

export function mollie() {
  const apiKey = process.env.MOLLIE_API_KEY
  if (!apiKey) throw new Error("MOLLIE_API_KEY missing")
  return createMollieClient({ apiKey })
}

/** Where Mollie posts status changes. Mollie rejects localhost, so a local run has none and relies on the return poll. */
export function webhookUrl() {
  const base = process.env.MOLLIE_WEBHOOK_URL ?? (process.env.VERCEL_ENV === "production" ? SITE_URL : null)
  return base && !/localhost|127\.0\.0\.1/.test(base) ? `${base}/api/mollie/webhook` : null
}

const euro = (cents: number) => ({ currency: "EUR", value: (cents / 100).toFixed(2) })

/** Active, pending (waiting on a mandate) and suspended subscriptions can still charge, so they count as live. */
const LIVE: string[] = [SubscriptionStatus.active, SubscriptionStatus.pending, SubscriptionStatus.suspended]

type Row = { mollie_payment_id: string; user_id: string; plan_id: string; kind: "first" | "renewal"; amount_cents: number; status: string; subscription_id: string | null }

const toRow = (r: Row): PaymentRow => ({
  molliePaymentId: r.mollie_payment_id,
  userId: r.user_id,
  planId: r.plan_id,
  kind: r.kind,
  amountCents: r.amount_cents,
  status: r.status,
  subscriptionId: r.subscription_id,
})

function throwOn<T extends { error: { message: string } | null }>(res: T): T {
  if (res.error) throw new Error(`[billing] ${res.error.message}`)
  return res
}

export function supabaseStore(): BillingStore {
  const db = createAdminClient()
  const touch = () => ({ updated_at: new Date().toISOString() })
  return {
    async findPayment(id) {
      const { data } = throwOn(await db.from("payments").select("mollie_payment_id, user_id, plan_id, kind, amount_cents, status, subscription_id").eq("mollie_payment_id", id).maybeSingle())
      return data ? toRow(data as Row) : null
    },
    async insertPayment(r) {
      throwOn(
        await db
          .from("payments")
          .upsert({ mollie_payment_id: r.molliePaymentId, user_id: r.userId, plan_id: r.planId, kind: r.kind, amount_cents: r.amountCents, status: r.status }, { onConflict: "mollie_payment_id", ignoreDuplicates: true })
      )
    },
    async setStatus(id, status) {
      throwOn(await db.from("payments").update({ status, ...touch() }).eq("mollie_payment_id", id).neq("status", "paid"))
    },
    async latestPeriodEnd(userId, excluding) {
      const { data } = throwOn(
        await db
          .from("payments")
          .select("period_ends_at")
          .eq("user_id", userId)
          .eq("status", "paid")
          .is("revoked_at", null)
          .neq("mollie_payment_id", excluding)
          .order("period_ends_at", { ascending: false })
          .limit(1)
          .maybeSingle()
      )
      return data?.period_ends_at ? new Date(data.period_ends_at) : null
    },
    async claimPaid(id, p) {
      const { data } = throwOn(
        await db
          .from("payments")
          .update({ status: "paid", period_starts_at: p.start.toISOString(), period_ends_at: p.end.toISOString(), paid_at: p.paidAt.toISOString(), country: p.country, ...touch() })
          .eq("mollie_payment_id", id)
          .neq("status", "paid")
          .select("id")
      )
      return (data?.length ?? 0) > 0
    },
    async revoke(id) {
      throwOn(await db.from("payments").update({ revoked_at: new Date().toISOString(), ...touch() }).eq("mollie_payment_id", id).is("revoked_at", null))
    },
    async setSubscription(id, userId, subscriptionId) {
      throwOn(await db.from("payments").update({ subscription_id: subscriptionId, ...touch() }).eq("mollie_payment_id", id))
      throwOn(await db.from("mollie_customers").update({ subscription_id: subscriptionId, canceled_at: null, ...touch() }).eq("user_id", userId))
    },
  }
}

export async function liveSubscriptions(customerId: string) {
  const page = await mollie().customerSubscriptions.page({ customerId, limit: 50 })
  return page.filter((s) => LIVE.includes(s.status))
}

export function mollieApi(): BillingApi {
  const client = mollie()
  return {
    async liveSubscriptionIds(customerId) {
      return (await liveSubscriptions(customerId)).map((s) => s.id)
    },
    async createSubscription(p) {
      const sub = await client.customerSubscriptions.create({
        customerId: p.customerId,
        amount: euro(p.amountCents),
        interval: p.interval,
        startDate: p.startDate,
        description: p.description,
        webhookUrl: p.webhookUrl ?? undefined,
        metadata: p.metadata,
        idempotencyKey: p.idempotencyKey,
      })
      return sub.id
    },
    async cancelSubscriptions(customerId) {
      for (const s of await liveSubscriptions(customerId)) await client.customerSubscriptions.cancel(s.id, { customerId })
    },
  }
}

/** Fetch one payment from Mollie (never trust a posted status) and apply it; sends the activation email once. */
export async function syncPayment(id: string) {
  const payment = await mollie().payments.get(id)
  const result = await processPayment(
    {
      id: payment.id,
      status: payment.status,
      sequenceType: payment.sequenceType,
      customerId: payment.customerId,
      subscriptionId: payment.subscriptionId,
      paidAt: payment.paidAt,
      countryCode: payment.countryCode,
      amount: payment.amount,
      amountChargedBack: payment.amountChargedBack,
      amountRefunded: payment.amountRefunded,
      metadata: payment.metadata,
    },
    { store: supabaseStore(), api: mollieApi(), webhookUrl: webhookUrl(), now: new Date() }
  )
  if (result.activated && result.userId) await sendActivationEmail(id, result.userId)
  return { ...result, amountCents: toCents(payment.amount.value) }
}
