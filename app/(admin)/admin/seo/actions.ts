"use server"

import { randomUUID } from "node:crypto"
import { refresh } from "next/cache"
import { requireAdmin } from "@/lib/admin/guard"
import { canSend, outreachState, replySubject, type OutreachKind } from "@/lib/admin/backlink-outreach-model"
import { draftingConfigured, draftOutreach, loadDomainOutreach } from "@/lib/admin/backlink-outreach"
import { REPLY_TO, SENDER_FROM } from "@/lib/admin/backlink-outreach-prompt"
import { loadBacklinks } from "@/lib/admin/seo-backlinks"
import { sendEmail } from "@/lib/email/resend"
import { createAdminClient } from "@/lib/supabase/admin"

/**
 * Backlink outreach from /admin/seo?tab=backlinks. Each action checks the admin, reads the candidate from
 * seo-agent/backlink-prospects.json (the recipient comes from there, never from the browser) and the logged
 * steps, and applies the rules of backlink-outreach-model.ts on the server.
 * TODO(hannes): a cold email to an organisation is a § 7 UWG question; Caritas invites suggestions, the others don't.
 */

export type ActionResult<T = undefined> = { ok: true; data?: T; message?: string } | { ok: false; error: string }
type Draft = { subject: string; body: string }

const MAX_BODY = 4000

async function context(domain: string) {
  const data = await loadBacklinks()
  const prospect = data.prospects.find((p) => p.domain === domain)
  if (!prospect) return null
  const events = await loadDomainOutreach(domain)
  return { prospect, events, ctx: { now: new Date(), bingListed: prospect.state === "listed", fileStatus: prospect.status } }
}

const clean = (d: Draft): Draft | null => {
  const subject = d.subject.replace(/[\r\n]+/g, " ").trim()
  const body = d.body.replace(/\r\n/g, "\n").trim()
  return subject && body && subject.length <= 200 && body.length <= MAX_BODY ? { subject, body } : null
}

/** A German draft for the first email or the follow-up. Nothing is stored; the drawer keeps it while Hannes edits. */
export async function draftRequest(domain: string, kind: "sent" | "follow_up"): Promise<ActionResult<Draft>> {
  const admin = await requireAdmin()
  if (!admin) return { ok: false, error: "No access." }
  if (!draftingConfigured()) return { ok: false, error: "ANTHROPIC_API_KEY is not set, so there is no draft. Write it yourself." }
  try {
    const c = await context(domain)
    if (!c) return { ok: false, error: "Unknown candidate." }
    const gate = canSend(kind, c.events, c.ctx)
    if (!gate.ok) return { ok: false, error: gate.reason }
    const first = c.events.find((e) => e.kind === "sent")
    const draft = await draftOutreach(c.prospect, kind === "follow_up" && first ? { kind, previous: { subject: first.subject ?? "", body: first.body ?? "", at: first.at } } : { kind: "sent" })
    return { ok: true, data: kind === "follow_up" && first?.subject ? { ...draft, subject: replySubject(first.subject) } : draft }
  } catch (e) {
    console.error("[outreach] draft failed", domain, e instanceof Error ? e.message : e)
    return { ok: false, error: "The draft failed. Try again or write it yourself." }
  }
}

/** Sends the email through Resend and logs it. The follow-up threads under the first email (In-Reply-To). */
export async function sendRequest(domain: string, kind: "sent" | "follow_up", input: Draft): Promise<ActionResult> {
  const admin = await requireAdmin()
  if (!admin) return { ok: false, error: "No access." }
  const draft = clean(input)
  if (!draft) return { ok: false, error: "Subject and text are required (text up to 4,000 characters)." }
  const c = await context(domain).catch(() => null)
  if (!c) return { ok: false, error: "Unknown candidate, or the outreach log can't be read." }
  const to = c.prospect.contact?.channel === "email" ? c.prospect.contact.email : undefined
  if (!to) return { ok: false, error: "This site has no email address. Use its form and mark it as sent." }
  const gate = canSend(kind, c.events, c.ctx)
  if (!gate.ok) return { ok: false, error: gate.reason }

  const first = c.events.find((e) => e.kind === "sent")
  const firstId = first?.messageId ?? null
  const messageId = `<outreach-${randomUUID()}@deutschtest-ueben.de>`
  const headers: Record<string, string> = { "Message-ID": messageId }
  if (kind === "follow_up" && firstId) Object.assign(headers, { "In-Reply-To": firstId, References: firstId })

  let resendId: string
  try {
    const sent = await sendEmail({ to, from: SENDER_FROM, replyTo: REPLY_TO, email: { subject: draft.subject, html: "", text: draft.body }, idempotencyKey: `outreach-${domain}-${kind}`, headers })
    if (!sent) return { ok: false, error: "RESEND_API_KEY is not set, so nothing was sent." }
    resendId = sent.id
  } catch (e) {
    console.error("[outreach] send failed", domain, e instanceof Error ? e.message : e)
    return { ok: false, error: "Resend refused the email. Nothing was logged." }
  }

  const { error } = await createAdminClient().from("backlink_outreach").insert({ domain, kind, channel: "email", to_email: to, subject: draft.subject, body: draft.body, message_id: messageId, resend_id: resendId, sent_by: admin })
  refresh()
  if (error) {
    console.error("[outreach] sent but not logged", domain, error.message)
    return { ok: true, message: `Sent to ${to}, but the log failed (${error.message}).` }
  }
  return { ok: true, message: `Sent to ${to}.` }
}

const MARKS: OutreachKind[] = ["sent", "follow_up", "replied", "listed", "declined", "note"]

/** Logs a step without sending: a draft pasted into their form, a reply in the inbox, a listing, a note. */
export async function logStep(domain: string, kind: OutreachKind, input?: Partial<Draft>): Promise<ActionResult> {
  const admin = await requireAdmin()
  if (!admin) return { ok: false, error: "No access." }
  if (!MARKS.includes(kind)) return { ok: false, error: "Unknown step." }
  const c = await context(domain).catch(() => null)
  if (!c) return { ok: false, error: "Unknown candidate, or the outreach log can't be read." }
  if (kind === "sent" || kind === "follow_up") {
    const gate = canSend(kind, c.events, c.ctx)
    if (!gate.ok) return { ok: false, error: gate.reason }
  }
  if (kind === "replied" && !c.events.some((e) => e.kind === "sent")) return { ok: false, error: "Nothing was sent yet." }
  const note = input?.body?.trim().slice(0, MAX_BODY) || null
  if (kind === "note" && !note) return { ok: false, error: "Write the note first." }
  const state = outreachState(c.events, c.ctx)
  if (kind === state) return { ok: false, error: "Already logged." }

  const { error } = await createAdminClient().from("backlink_outreach").insert({
    domain,
    kind,
    channel: kind === "sent" || kind === "follow_up" ? (c.prospect.contact?.channel === "email" ? "manual" : "form") : null,
    subject: input?.subject?.trim().slice(0, 200) || null,
    body: note,
    sent_by: admin,
  })
  if (error) return { ok: false, error: error.code === "23505" ? "Already logged." : error.message }
  refresh()
  return { ok: true }
}
