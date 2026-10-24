import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { mollieConfigured } from "@/lib/billing/mollie"
import { cancelForUser } from "@/lib/billing/cancel"
import { sendCancellationEmail } from "@/lib/email/billing"

/**
 * The "jetzt kündigen" step in the portal (/dashboard/konto/kuendigen): one authenticated POST, no retention step.
 * The confirmation email is sent right away (§ 312k Abs. 4 BGB).
 */
export async function POST() {
  const supabase = await createClient()
  const { data } = await supabase.auth.getUser()
  const user = data.user
  if (!user) return NextResponse.json({ error: "signed_out" }, { status: 401 })
  if (!mollieConfigured()) return NextResponse.json({ error: "not_configured" }, { status: 503 })

  try {
    const r = await cancelForUser(user.id)
    if (r.status === "none") return NextResponse.json({ error: "no_contract" }, { status: 400 })
    if (r.status === "failed") return NextResponse.json({ error: "partial" }, { status: 502 })
    if (r.status === "canceled" && user.email) await sendCancellationEmail(user.email, r.receivedAt, r.until)
    return NextResponse.json({ ok: true, until: r.until?.toISOString() ?? null, receivedAt: r.receivedAt.toISOString() })
  } catch (err) {
    console.error("[cancel]", err instanceof Error ? err.message : err)
    return NextResponse.json({ error: "mollie_failed" }, { status: 502 })
  }
}
