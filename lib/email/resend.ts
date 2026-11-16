import "server-only"
import { OPERATOR } from "@/lib/seo"
import type { Email } from "@/lib/email/templates/billing"

const FROM = process.env.EMAIL_FROM ?? "deutschtest üben <support@deutschtest-ueben.de>"

/** One Resend REST call. false = no RESEND_API_KEY (nothing sent), else Resend's id; an empty `html` sends plain text only. Throws on a Resend error (e.g. 403 domain not verified). */
export async function sendEmail({ to, email, idempotencyKey, replyTo = OPERATOR.email, headers, from = FROM }: { to: string; email: Email; idempotencyKey: string; replyTo?: string; headers?: Record<string, string>; from?: string }): Promise<false | { id: string }> {
  const key = process.env.RESEND_API_KEY
  if (!key) return false
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json", "Idempotency-Key": idempotencyKey },
    body: JSON.stringify({ from, to, reply_to: replyTo, subject: email.subject, ...(email.html ? { html: email.html } : {}), text: email.text, ...(headers ? { headers } : {}) }),
  })
  if (!res.ok) throw new Error(`resend ${res.status}`)
  return { id: String(((await res.json().catch(() => ({}))) as { id?: unknown }).id ?? "") }
}
