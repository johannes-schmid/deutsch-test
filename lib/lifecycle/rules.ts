/**
 * Which lifecycle email a learner is due, if any (Hannes, 2026-10-27: at most five per person, each once).
 * Pure and rule-based: the daily cron and the onboarding action feed it the state, it never reads the database.
 * Order: welcome → abandoned payment → after the exam → Dein Stand → Endspurt.
 */

export type LifecycleKind = "willkommen" | "zahlung" | "stand" | "endspurt" | "nach_pruefung"
export type LifecycleVariant = "a" | "b" | "c" | null
export type Due = { kind: LifecycleKind; variant: LifecycleVariant }

export type LifecycleState = {
  /** Marketing consent from onboarding; null = never given, nothing is sent. */
  consentAt: Date | null
  unsubscribedAt: Date | null
  /** Berlin calendar day of the exam (YYYY-MM-DD); null = "Noch kein Termin". */
  examDate: string | null
  /** Free Modelltests finished for the chosen exam, one per skill (0–4). */
  skillsDone: number
  ownsPass: boolean
  /** Latest first payment that never got paid, with no paid payment after it. */
  abandonedAt: Date | null
  sent: { kind: LifecycleKind; at: Date }[]
}

const H = 3600_000
const D = 24 * H

const GAP = 48 * H
const STAND_AFTER = 3 * D
const ENDSPURT_AFTER_STAND = 3 * D
const ENDSPURT_FROM = 14
const ENDSPURT_UNTIL = 4
const NO_DATE_AFTER = 14
const ABANDON_FROM = 2 * H
const ABANDON_UNTIL = 72 * H
const AFTER_EXAM_FROM = 3
const AFTER_EXAM_UNTIL = 14

const berlinDay = (d: Date) => new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Berlin", year: "numeric", month: "2-digit", day: "2-digit" }).format(d)
const utcDay = (ymd: string) => {
  const [y, m, d] = ymd.split("-").map(Number)
  return Date.UTC(y, m - 1, d)
}

/** Calendar days from today in Berlin to `ymd`; negative once the day has passed. */
export function daysUntil(ymd: string, now: Date) {
  return Math.round((utcDay(ymd) - utcDay(berlinDay(now))) / D)
}

export function nextEmail(s: LifecycleState, now: Date): Due | null {
  if (!s.consentAt || s.unsubscribedAt) return null
  const sentAt = (k: LifecycleKind) => s.sent.find((x) => x.kind === k)?.at ?? null
  const last = Math.max(0, ...s.sent.map((x) => x.at.getTime()))
  if (s.sent.length && now.getTime() - last < GAP) return null

  const left = s.examDate ? daysUntil(s.examDate, now) : null
  const afterExam = left !== null && -left >= AFTER_EXAM_FROM && -left <= AFTER_EXAM_UNTIL && !sentAt("nach_pruefung")
  if (s.ownsPass) return afterExam ? { kind: "nach_pruefung", variant: null } : null

  const welcome = sentAt("willkommen")
  if (!welcome) return { kind: "willkommen", variant: null }

  if (s.abandonedAt && !sentAt("zahlung")) {
    const since = now.getTime() - s.abandonedAt.getTime()
    if (since >= ABANDON_FROM && since <= ABANDON_UNTIL) return { kind: "zahlung", variant: null }
  }

  if (afterExam) return { kind: "nach_pruefung", variant: null }

  const stand = sentAt("stand")
  if (!stand) {
    if (now.getTime() - welcome.getTime() < STAND_AFTER || (left !== null && left < 1)) return null
    return { kind: "stand", variant: s.skillsDone >= 4 ? "c" : s.skillsDone > 0 ? "b" : "a" }
  }

  if (!sentAt("endspurt") && now.getTime() - stand.getTime() >= ENDSPURT_AFTER_STAND) {
    if (left !== null) return left <= ENDSPURT_FROM && left >= ENDSPURT_UNTIL ? { kind: "endspurt", variant: "a" } : null
    if (-daysUntil(berlinDay(s.consentAt), now) >= NO_DATE_AFTER) return { kind: "endspurt", variant: "b" }
  }
  return null
}
