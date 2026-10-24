import { NextResponse } from "next/server"
import { Locale, SequenceType } from "@mollie/api-client"
import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { liveSubscriptions, mollie, mollieConfigured, webhookUrl } from "@/lib/billing/mollie"
import { planById } from "@/lib/pricing"
import { SITE_URL } from "@/lib/seo"

/**
 * Starts a Prüfungspass purchase. The client posts only the plan id and the consent; the price comes from
 * lib/pricing.ts here, never from the request. A `first` payment on a Mollie customer creates the mandate the monthly
 * renewal charges later; the subscription itself is created once the payment is paid (lib/billing/process.ts).
 */
export async function POST(req: Request) {
  const supabase = await createClient()
  const { data } = await supabase.auth.getUser()
  const user = data.user
  if (!user) return NextResponse.json({ error: "signed_out" }, { status: 401 })
  if (!mollieConfigured()) return NextResponse.json({ error: "not_configured" }, { status: 503 })

  let body: { planId?: unknown; consent?: unknown }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: "bad_json" }, { status: 400 })
  }
  const plan = planById(body.planId)
  if (!plan) return NextResponse.json({ error: "bad_plan" }, { status: 400 })
  if (body.consent !== true) return NextResponse.json({ error: "consent_required" }, { status: 400 })

  const db = createAdminClient()
  const client = mollie()
  try {
    const { data: cust } = await db.from("mollie_customers").select("customer_id").eq("user_id", user.id).maybeSingle()
    let customerId = cust?.customer_id as string | undefined
    if (customerId && (await liveSubscriptions(customerId)).length > 0) return NextResponse.json({ error: "renewing" }, { status: 409 })
    if (!customerId) {
      const m = user.user_metadata ?? {}
      const created = await client.customers.create({ name: m.full_name ?? m.name ?? undefined, email: user.email ?? undefined, locale: Locale.de_DE, metadata: { userId: user.id }, idempotencyKey: `cust-${user.id}` })
      customerId = created.id
      const { error } = await db.from("mollie_customers").upsert({ user_id: user.id, customer_id: customerId }, { onConflict: "user_id", ignoreDuplicates: true })
      if (error) throw new Error(error.message)
      const { data: stored } = await db.from("mollie_customers").select("customer_id").eq("user_id", user.id).single()
      customerId = stored!.customer_id as string
    }

    const origin = process.env.VERCEL_ENV === "production" ? SITE_URL : new URL(req.url).origin
    const hook = webhookUrl()
    const payment = await client.payments.create({
      amount: { currency: "EUR", value: (plan.cents / 100).toFixed(2) },
      description: `deutschtest üben Prüfungspass, ${plan.name}`,
      redirectUrl: `${origin}/dashboard/zahlung`,
      cancelUrl: `${origin}/dashboard/preise`,
      ...(hook ? { webhookUrl: hook } : {}),
      customerId,
      sequenceType: SequenceType.first,
      locale: Locale.de_DE,
      metadata: { kind: "pass", userId: user.id, planId: plan.id },
    })

    // Written before the redirect: the return poll finds the purchase by this row.
    const { error } = await db.from("payments").insert({
      mollie_payment_id: payment.id,
      user_id: user.id,
      plan_id: plan.id,
      kind: "first",
      amount_cents: plan.cents,
      status: payment.status,
      consent_at: new Date().toISOString(),
    })
    if (error) console.error("[checkout] payments insert failed", payment.id, error.message)

    const url = payment.getCheckoutUrl()
    if (!url) throw new Error("no checkout url")
    return NextResponse.json({ checkoutUrl: url })
  } catch (err) {
    console.error("[checkout]", err instanceof Error ? err.message : err)
    return NextResponse.json({ error: "mollie_failed" }, { status: 502 })
  }
}
