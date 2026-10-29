import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { mollieConfigured, syncPayment } from "@/lib/billing/mollie"

/**
 * Polled by /dashboard/zahlung after Mollie's redirect. Looks up the signed-in user's latest purchase and syncs it, so a
 * slow or missing webhook (always missing locally) never leaves a paying learner without access.
 */
export async function GET() {
  const supabase = await createClient()
  const { data } = await supabase.auth.getUser()
  if (!data.user) return NextResponse.json({ error: "signed_out" }, { status: 401 })
  if (!mollieConfigured()) return NextResponse.json({ error: "not_configured" }, { status: 503 })

  const since = new Date(Date.now() - 24 * 3600_000).toISOString()
  const { data: row } = await createAdminClient()
    .from("payments")
    .select("mollie_payment_id, status, period_ends_at, plan_id, amount_cents")
    .eq("user_id", data.user.id)
    .in("kind", ["first", "upgrade"])
    .gte("created_at", since)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle()
  if (!row) return NextResponse.json({ status: "none" })

  try {
    const r = row.status === "paid" ? null : await syncPayment(row.mollie_payment_id)
    const until = r?.until?.toISOString() ?? row.period_ends_at
    if (r?.outcome === "revoked") return NextResponse.json({ status: "failed" })
    if (row.status === "paid" || r?.outcome === "paid" || r?.outcome === "already") return NextResponse.json({ status: "paid", until, planId: row.plan_id, paymentId: row.mollie_payment_id, amountCents: row.amount_cents })
    const { data: now } = await createAdminClient().from("payments").select("status").eq("mollie_payment_id", row.mollie_payment_id).single()
    return NextResponse.json({ status: ["failed", "canceled", "expired"].includes(now?.status) ? "failed" : "pending" })
  } catch (err) {
    console.error("[mollie-status]", row.mollie_payment_id, err instanceof Error ? err.message : err)
    return NextResponse.json({ status: "pending" })
  }
}
