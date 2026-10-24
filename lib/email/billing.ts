import "server-only"
import { createAdminClient } from "@/lib/supabase/admin"
import { PLANS, RENEWAL } from "@/lib/pricing"
import { OPERATOR } from "@/lib/seo"
import { activationEmail, cancellationEmail, type Email } from "@/lib/email/templates/billing"

/**
 * Sends the billing emails through Resend's REST API (drafts approved by Hannes 2026-10-24; changes to the wording need
 * his approval again). Without RESEND_API_KEY nothing is sent (local runs, and until the sending domain is verified).
 * Never throws: the payment or cancellation has already happened, so a mail outage must not turn it into an error.
 * Logs ids only, never addresses.
 */

const FROM = process.env.EMAIL_FROM ?? "deutschtest üben <kontakt@deutschtest-ueben.de>"

async function send(to: string, email: Email, idempotencyKey: string) {
  const key = process.env.RESEND_API_KEY
  if (!key) return false
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json", "Idempotency-Key": idempotencyKey },
    body: JSON.stringify({ from: FROM, to, reply_to: OPERATOR.email, subject: email.subject, html: email.html, text: email.text }),
  })
  if (!res.ok) throw new Error(`resend ${res.status}`)
  return true
}

async function recipient(userId: string) {
  const { data } = await createAdminClient().auth.admin.getUserById(userId)
  const u = data.user
  if (!u?.email) return null
  const m = u.user_metadata ?? {}
  const name: string | null = m.full_name ?? m.name ?? null
  return { email: u.email, firstName: (m.given_name as string | undefined) ?? name?.split(" ")[0] ?? null }
}

/** Once per first payment: the `activation_email_sent` claim wins for exactly one of webhook, return poll and cron. */
export async function sendActivationEmail(molliePaymentId: string, userId: string) {
  if (!process.env.RESEND_API_KEY) return
  try {
    const db = createAdminClient()
    const { data: claim } = await db
      .from("payments")
      .update({ activation_email_sent: true })
      .eq("mollie_payment_id", molliePaymentId)
      .eq("activation_email_sent", false)
      .select("plan_id, amount_cents, period_ends_at, consent_at")
    const row = claim?.[0]
    const to = row ? await recipient(userId) : null
    if (!row || !to) return
    const plan = PLANS.find((p) => p.id === row.plan_id)
    await send(
      to.email,
      activationEmail({ firstName: to.firstName, planName: plan?.name ?? row.plan_id, paidCents: row.amount_cents, until: new Date(row.period_ends_at), renewalCents: RENEWAL.cents, consentAt: row.consent_at ? new Date(row.consent_at) : null }),
      `activation-${molliePaymentId}`
    )
  } catch (err) {
    console.error("[billing-email] activation failed", molliePaymentId, err instanceof Error ? err.message : err)
  }
}

/** The confirmation § 312k Abs. 4 BGB requires: what was cancelled, when it was received, when the contract ends. */
export async function sendCancellationEmail(to: string, receivedAt: Date, until: Date | null, firstName: string | null = null) {
  try {
    await send(to, cancellationEmail({ firstName, receivedAt, until }), `cancel-${receivedAt.getTime()}-${to.length}`)
  } catch (err) {
    console.error("[billing-email] cancellation failed", err instanceof Error ? err.message : err)
  }
}

