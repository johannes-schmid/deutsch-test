import { RENEWAL, planById } from "@/lib/pricing"
import { periodFor, ymd } from "@/lib/billing/period"

/**
 * One Mollie payment → our state. Called from the webhook, the return poll (/api/mollie/status) and the reconcile
 * cron, in any order and any number of times, so every step is idempotent:
 * - `claimPaid` flips a row to paid once; only that call activates (and sends the activation email).
 * - the subscription is created only from a paid *first* payment that has none recorded yet, never from a payment a
 *   subscription generated (that would add a subscription every month), and with an idempotency key.
 * - a failed subscription create throws, so the webhook answers 500 and Mollie retries; the claim makes the retry safe.
 * Pure: storage and Mollie come in as `deps`, so the rules are unit-tested (process.test.ts).
 */

export type PassMeta = { kind: "pass"; userId: string; planId: string }

export type MolliePayment = {
  id: string
  status: string
  sequenceType: string
  customerId?: string
  subscriptionId?: string
  paidAt?: string
  countryCode?: string
  amount: { value: string }
  amountChargedBack?: { value: string }
  amountRefunded?: { value: string }
  metadata: unknown
}

export type PaymentRow = {
  molliePaymentId: string
  userId: string
  planId: string
  kind: "first" | "renewal"
  amountCents: number
  status: string
  subscriptionId: string | null
}

export interface BillingStore {
  findPayment(id: string): Promise<PaymentRow | null>
  /** Inserts the row unless one with this payment id exists. */
  insertPayment(row: Omit<PaymentRow, "subscriptionId">): Promise<void>
  /** Never moves a paid row back to another status. */
  setStatus(id: string, status: string): Promise<void>
  /** Latest end of this user's paid, unrevoked periods, other than `excluding`. */
  latestPeriodEnd(userId: string, excluding: string): Promise<Date | null>
  /** Marks the row paid with its period, only if it is not paid yet. True when this call did it. */
  claimPaid(id: string, p: { start: Date; end: Date; paidAt: Date; country: string | null }): Promise<boolean>
  revoke(id: string): Promise<void>
  setSubscription(id: string, userId: string, subscriptionId: string): Promise<void>
}

export interface BillingApi {
  liveSubscriptionIds(customerId: string): Promise<string[]>
  createSubscription(p: {
    customerId: string
    amountCents: number
    interval: string
    startDate: string
    description: string
    webhookUrl: string | null
    metadata: PassMeta
    idempotencyKey: string
  }): Promise<string>
  cancelSubscriptions(customerId: string): Promise<void>
}

export type ProcessResult = {
  outcome: "ignored" | "paid" | "already" | "status" | "revoked"
  /** True once per first payment: the call that granted it. Send the activation email on this. */
  activated: boolean
  userId?: string
  planId?: string
  until?: Date
}

export const toCents = (value: string) => Math.round(parseFloat(value) * 100)

export function passMeta(meta: unknown): PassMeta | null {
  const m = meta as Partial<PassMeta> | null
  return m && m.kind === "pass" && typeof m.userId === "string" && typeof m.planId === "string" ? (m as PassMeta) : null
}

export const subscriptionDescription = (userId: string) => `deutschtest üben Prüfungspass (${userId.slice(0, 8)})`

export async function processPayment(
  p: MolliePayment,
  { store, api, webhookUrl, now }: { store: BillingStore; api: BillingApi; webhookUrl: string | null; now: Date }
): Promise<ProcessResult> {
  const meta = passMeta(p.metadata)
  if (!meta) return { outcome: "ignored", activated: false }
  const renewal = !!p.subscriptionId
  const plan = renewal ? RENEWAL : planById(meta.planId)
  if (!plan) return { outcome: "ignored", activated: false }
  const base = { userId: meta.userId, planId: plan.id }

  let row = await store.findPayment(p.id)
  if (!row) {
    await store.insertPayment({ molliePaymentId: p.id, userId: meta.userId, planId: plan.id, kind: renewal ? "renewal" : "first", amountCents: toCents(p.amount.value), status: "open" })
    row = (await store.findPayment(p.id))!
  }

  const amount = toCents(p.amount.value)
  if ((p.amountChargedBack && toCents(p.amountChargedBack.value) > 0) || (p.amountRefunded && toCents(p.amountRefunded.value) >= amount)) {
    await store.revoke(p.id)
    if (p.customerId) await api.cancelSubscriptions(p.customerId)
    return { outcome: "revoked", activated: false, ...base }
  }

  if (p.status !== "paid") {
    await store.setStatus(p.id, p.status)
    return { outcome: "status", activated: false, ...base }
  }

  const paidAt = p.paidAt ? new Date(p.paidAt) : now
  const latestEnd = await store.latestPeriodEnd(meta.userId, p.id)
  const period = periodFor({ months: plan.months, paidAt, latestEnd, continuous: renewal })
  const claimed = await store.claimPaid(p.id, { ...period, paidAt, country: p.countryCode ?? null })

  if (!renewal && p.customerId && !row.subscriptionId) {
    const live = await api.liveSubscriptionIds(p.customerId)
    const subscriptionId =
      live[0] ??
      (await api.createSubscription({
        customerId: p.customerId,
        amountCents: RENEWAL.cents,
        interval: RENEWAL.interval,
        // The first payment covers its own months; collecting today would charge the first month twice.
        startDate: ymd(period.end),
        description: subscriptionDescription(meta.userId),
        webhookUrl,
        metadata: { kind: "pass", userId: meta.userId, planId: RENEWAL.id },
        idempotencyKey: `pass-sub-${p.id}`,
      }))
    await store.setSubscription(p.id, meta.userId, subscriptionId)
  }

  return { outcome: claimed ? "paid" : "already", activated: claimed && !renewal, ...base, until: period.end }
}
