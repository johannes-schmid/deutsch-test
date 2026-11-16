/**
 * Backlink outreach, pure (Hannes, 2026-11-16): who we asked for a link, and what's next. Every step is a row in
 * `backlink_outreach`; the state follows from those rows, never from a stored status. One first email, at most one
 * follow-up after FOLLOW_UP_AFTER_DAYS of silence, then "no reply". Bing seeing the link beats everything.
 */

import type { ProspectStatus } from "./seo-backlinks-model"

export type OutreachKind = "sent" | "follow_up" | "replied" | "listed" | "declined" | "note"
export type OutreachChannel = "email" | "form" | "manual"
export type OutreachEvent = {
  kind: OutreachKind
  at: string
  channel?: OutreachChannel
  to?: string | null
  subject?: string | null
  body?: string | null
  by?: string | null
}

export type OutreachState = "todo" | "asked" | "follow_up_due" | "followed_up" | "no_reply" | "replied" | "listed" | "declined"

export const FOLLOW_UP_AFTER_DAYS = 10
export const NO_REPLY_AFTER_DAYS = 14

const DAY = 86_400_000
type Ctx = { now: Date; bingListed?: boolean; fileStatus?: ProspectStatus }

const first = (events: OutreachEvent[], kind: OutreachKind) => events.filter((e) => e.kind === kind).sort((a, b) => a.at.localeCompare(b.at))[0]
const has = (events: OutreachEvent[], kind: OutreachKind) => events.some((e) => e.kind === kind)
const daysSince = (iso: string, now: Date) => (now.getTime() - new Date(iso).getTime()) / DAY

export function outreachState(events: OutreachEvent[], { now, bingListed, fileStatus }: Ctx): OutreachState {
  if (bingListed || has(events, "listed")) return "listed"
  if (has(events, "declined")) return "declined"
  if (has(events, "replied")) return "replied"
  const followUp = first(events, "follow_up")
  if (followUp) return daysSince(followUp.at, now) >= NO_REPLY_AFTER_DAYS ? "no_reply" : "followed_up"
  const sent = first(events, "sent")
  if (sent) return daysSince(sent.at, now) >= FOLLOW_UP_AFTER_DAYS ? "follow_up_due" : "asked"
  return fileStatus && fileStatus !== "todo" ? fileStatus : "todo"
}

export function followUpDueAt(events: OutreachEvent[]): string | null {
  const sent = first(events, "sent")
  if (!sent || has(events, "follow_up")) return null
  return new Date(new Date(sent.at).getTime() + FOLLOW_UP_AFTER_DAYS * DAY).toISOString()
}

/** The server's gate for a send or "mark as sent": the same rules the drawer shows. */
export function canSend(kind: "sent" | "follow_up", events: OutreachEvent[], ctx: Ctx): { ok: true } | { ok: false; reason: string } {
  const state = outreachState(events, ctx)
  if (state === "listed") return { ok: false, reason: "This site already links to us." }
  if (state === "declined") return { ok: false, reason: "This site declined." }
  if (kind === "sent") return has(events, "sent") ? { ok: false, reason: "Already asked." } : { ok: true }
  if (!has(events, "sent")) return { ok: false, reason: "Send the first email first." }
  if (state === "replied") return { ok: false, reason: "They replied: answer in your inbox instead." }
  if (has(events, "follow_up")) return { ok: false, reason: "Already followed up once." }
  if (state !== "follow_up_due") return { ok: false, reason: `A follow-up is due ${FOLLOW_UP_AFTER_DAYS} days after the first email.` }
  return { ok: true }
}

export function replySubject(subject: string): string {
  return /^(re|aw):/i.test(subject.trim()) ? subject.trim() : `Re: ${subject.trim()}`
}

/** A candidate's state: `state` is the Bing/JSON status from seo-backlinks-model (listed once Bing sees the link). */
export function prospectOutreachState(p: { state: ProspectStatus; status?: ProspectStatus }, events: OutreachEvent[], now: Date): OutreachState {
  return outreachState(events, { now, bingListed: p.state === "listed", fileStatus: p.status })
}
