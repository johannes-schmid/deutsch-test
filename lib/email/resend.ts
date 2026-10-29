import "server-only"
import { OPERATOR } from "@/lib/seo"
import type { Email } from "@/lib/email/templates/billing"

const FROM = process.env.EMAIL_FROM ?? "deutschtest üben <support@deutschtest-ueben.de>"

/** One Resend REST call. false = no RESEND_API_KEY (nothing sent); throws on a Resend error (e.g. 403 domain not verified). */
export async function sendEmail({ to, email, idempotencyKey, replyTo = OPERATOR.email, headers }: { to: string; email: Email; idempotencyKey: string; replyTo?: string; headers?: Record<string, string> }) {
  const key = process.env.RESEND_API_KEY
  if (!key) return false
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json", "Idempotency-Key": idempotencyKey },
    body: JSON.stringify({ from: FROM, to, reply_to: replyTo, subject: email.subject, html: email.html, text: email.text, ...(headers ? { headers } : {}) }),
  })
  if (!res.ok) throw new Error(`resend ${res.status}`)
  return true
}
