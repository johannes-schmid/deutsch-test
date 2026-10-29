import "server-only"
import { createAdminClient } from "@/lib/supabase/admin"
import { sendEmail } from "@/lib/email/resend"
import { lifecycleEmail, type LifecycleContext } from "@/lib/email/templates/lifecycle"
import { SITE_URL } from "@/lib/seo"
import type { Due } from "./rules"

export const emailConfigured = () => !!process.env.RESEND_API_KEY

export const unsubscribeUrl = (token: string) => `${SITE_URL}/api/lifecycle/abmelden?t=${encodeURIComponent(token)}`

/** Name and address from the Google profile; null when the account has no email. */
export async function recipient(userId: string) {
  const { data } = await createAdminClient().auth.admin.getUserById(userId)
  const u = data.user
  if (!u?.email) return null
  const m = u.user_metadata ?? {}
  const name: string | null = m.full_name ?? m.name ?? null
  return { email: u.email, firstName: (m.given_name as string | undefined) ?? name?.split(" ")[0] ?? null }
}

/** One lifecycle email. Moments with consent carry RFC 8058 one-click unsubscribe headers. Throws on a Resend error. */
export async function sendLifecycleEmail(userId: string, to: string, due: Due, ctx: LifecycleContext) {
  const headers = ctx.unsubscribeUrl ? { "List-Unsubscribe": `<${ctx.unsubscribeUrl}>`, "List-Unsubscribe-Post": "List-Unsubscribe=One-Click" } : undefined
  return sendEmail({ to, email: lifecycleEmail(due, ctx), idempotencyKey: `lifecycle-${userId}-${due.kind}`, headers })
}

/**
 * The welcome service email, right after the first sign-up, to everyone (Hannes, 2026-10-27). Claimed in
 * lifecycle_messages (unique per kind) first, so a repeated callback never sends it twice; the claim is dropped when
 * nothing went out, and the daily cron can then still send it to learners with consent. Never throws; logs ids only.
 */
export async function sendWelcome(userId: string) {
  if (!emailConfigured()) return
  const db = createAdminClient()
  const { data: claim } = await db.from("lifecycle_messages").insert({ user_id: userId, kind: "willkommen", channels: ["email"] }).select("id")
  if (!claim?.length) return
  try {
    const to = await recipient(userId)
    const sent = to ? await sendLifecycleEmail(userId, to.email, { kind: "willkommen", variant: null }, { firstName: to.firstName, exam: null, examDate: null, daysLeft: null, done: [], unsubscribeUrl: null }) : false
    if (!sent) await db.from("lifecycle_messages").delete().eq("id", claim[0].id)
  } catch (err) {
    await db.from("lifecycle_messages").delete().eq("id", claim[0].id)
    console.error("[lifecycle] welcome failed", userId, err instanceof Error ? err.message : err)
  }
}
