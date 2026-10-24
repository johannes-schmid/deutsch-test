import { NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { mollieConfigured, syncPayment } from "@/lib/billing/mollie"

/**
 * Daily Vercel Cron (vercel.json): re-syncs purchases whose webhook and return poll were both lost, and paid first
 * payments whose subscription was never created. Fails closed without CRON_SECRET.
 */
export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET
  if (!secret || req.headers.get("authorization") !== `Bearer ${secret}`) return NextResponse.json({ error: "unauthorized" }, { status: 401 })
  if (!mollieConfigured()) return NextResponse.json({ error: "not_configured" }, { status: 503 })

  const db = createAdminClient()
  const since = new Date(Date.now() - 7 * 24 * 3600_000).toISOString()
  const [open, unsubscribed] = await Promise.all([
    db.from("payments").select("mollie_payment_id").in("status", ["open", "pending", "authorized"]).gte("created_at", since).limit(500),
    db.from("payments").select("mollie_payment_id").eq("kind", "first").eq("status", "paid").is("subscription_id", null).is("revoked_at", null).limit(500),
  ])
  if (open.error || unsubscribed.error) return NextResponse.json({ error: (open.error ?? unsubscribed.error)!.message }, { status: 500 })

  const ids = [...new Set([...open.data, ...unsubscribed.data].map((r) => r.mollie_payment_id as string))]
  let synced = 0
  let errors = 0
  for (const id of ids) {
    try {
      await syncPayment(id)
      synced++
    } catch (err) {
      errors++
      console.error("[reconcile-payments]", id, err instanceof Error ? err.message : err)
    }
  }
  return NextResponse.json({ checked: ids.length, synced, errors })
}
