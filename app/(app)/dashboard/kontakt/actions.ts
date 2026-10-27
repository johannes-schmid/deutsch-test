"use server"

import { createHash } from "node:crypto"
import { passStatus } from "@/lib/entitlements"
import { sendEmail } from "@/lib/email/resend"
import { contactEmail } from "@/lib/email/templates/contact"
import { formatDay } from "@/lib/email/templates/billing"
import { PORTAL_COPY } from "@/lib/i18n/portal"
import { OPERATOR } from "@/lib/seo"
import { createAdminClient } from "@/lib/supabase/admin"
import { getSessionUser } from "@/lib/supabase/server"

export type ContactResult = { ok: true } | { ok: false; error: "auth" | "topic" | "short" | "long" | "limit" | "failed" }

const T = PORTAL_COPY.contact
const MIN = 10
const MAX = 4000
const PER_DAY = 5

const berlinDay = () => new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Berlin", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date())

/**
 * Sends a learner's message to the support inbox (reply-to = the account email, so a reply in Outlook reaches them).
 * Capped at PER_DAY per account via app_metadata.contact (server-writable only). Nothing else is stored; logs no content.
 */
export async function sendContactMessage(input: { topic: string; message: string }): Promise<ContactResult> {
  const user = await getSessionUser()
  if (!user?.email) return { ok: false, error: "auth" }
  if (typeof input.topic !== "string" || !Object.hasOwn(T.topics, input.topic)) return { ok: false, error: "topic" }
  const message = typeof input.message === "string" ? input.message.trim() : ""
  if (message.length < MIN) return { ok: false, error: "short" }
  if (message.length > MAX) return { ok: false, error: "long" }

  const db = createAdminClient()
  const { data, error } = await db.auth.admin.getUserById(user.id)
  if (error || !data.user) return { ok: false, error: "failed" }
  const day = berlinDay()
  const prev = data.user.app_metadata?.contact as { day?: string; n?: number } | undefined
  const sent = prev?.day === day ? (prev.n ?? 0) : 0
  if (sent >= PER_DAY) return { ok: false, error: "limit" }

  const status = await passStatus(user.id).catch(() => null)
  const pass = !status ? "unbekannt" : status.until && status.until > new Date() ? `aktiv bis ${formatDay(status.until)}${status.renewing ? ", verlängert sich" : ", gekündigt"}` : "gratis"

  try {
    const delivered = await sendEmail({
      to: OPERATOR.email,
      replyTo: user.email,
      email: contactEmail({ topic: T.topics[input.topic as keyof typeof T.topics], message, name: user.name, email: user.email, userId: user.id, pass }),
      idempotencyKey: `contact-${user.id}-${createHash("sha256").update(message).digest("hex").slice(0, 24)}`,
    })
    if (!delivered) return { ok: false, error: "failed" }
  } catch (err) {
    console.error("[contact] send failed", err instanceof Error ? err.message : err)
    return { ok: false, error: "failed" }
  }

  await db.auth.admin.updateUserById(user.id, { app_metadata: { ...data.user.app_metadata, contact: { day, n: sent + 1 } } })
  return { ok: true }
}
