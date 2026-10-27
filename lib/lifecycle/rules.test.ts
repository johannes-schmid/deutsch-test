import { describe, expect, it } from "vitest"
import { daysUntil, nextEmail, type LifecycleState } from "./rules"

const at = (iso: string) => new Date(iso)
const H = 3600_000
const D = 24 * H

const NOW = at("2026-11-10T07:00:00Z")

function state(over: Partial<LifecycleState> = {}): LifecycleState {
  return { consentAt: at("2026-10-27T10:00:00Z"), unsubscribedAt: null, examDate: "2026-12-12", skillsDone: 0, ownsPass: false, abandonedAt: null, sent: [], ...over }
}
const sent = (kind: LifecycleState["sent"][number]["kind"], ago: number) => ({ kind, at: new Date(NOW.getTime() - ago) })

describe("daysUntil", () => {
  it("counts Berlin calendar days", () => {
    expect(daysUntil("2026-12-12", at("2026-11-28T07:00:00Z"))).toBe(14)
    expect(daysUntil("2026-12-12", at("2026-12-11T23:30:00Z"))).toBe(0)
    expect(daysUntil("2026-12-12", at("2026-12-15T07:00:00Z"))).toBe(-3)
  })
})

describe("nextEmail", () => {
  it("sends nothing without consent or after unsubscribing", () => {
    expect(nextEmail(state({ consentAt: null }), NOW)).toBeNull()
    expect(nextEmail(state({ unsubscribedAt: at("2026-11-01T00:00:00Z") }), NOW)).toBeNull()
  })

  it("welcomes first", () => {
    expect(nextEmail(state(), NOW)).toEqual({ kind: "willkommen", variant: null })
  })

  it("keeps 48 hours between two emails", () => {
    expect(nextEmail(state({ sent: [sent("willkommen", 47 * H)], abandonedAt: new Date(NOW.getTime() - 3 * H) }), NOW)).toBeNull()
  })

  it("sends Dein Stand 3 days after the welcome, variant by progress", () => {
    expect(nextEmail(state({ sent: [sent("willkommen", 2.5 * D)] }), NOW)).toBeNull()
    expect(nextEmail(state({ sent: [sent("willkommen", 3 * D)] }), NOW)).toEqual({ kind: "stand", variant: "a" })
    expect(nextEmail(state({ sent: [sent("willkommen", 3 * D)], skillsDone: 2 }), NOW)).toEqual({ kind: "stand", variant: "b" })
    expect(nextEmail(state({ sent: [sent("willkommen", 3 * D)], skillsDone: 4 }), NOW)).toEqual({ kind: "stand", variant: "c" })
  })

  it("follows up an abandoned payment between 2 and 72 hours, once", () => {
    const base = { sent: [sent("willkommen", 5 * D)] }
    expect(nextEmail(state({ ...base, abandonedAt: new Date(NOW.getTime() - 1 * H) }), NOW)).toEqual({ kind: "stand", variant: "a" })
    expect(nextEmail(state({ ...base, abandonedAt: new Date(NOW.getTime() - 2 * H) }), NOW)).toEqual({ kind: "zahlung", variant: null })
    expect(nextEmail(state({ ...base, abandonedAt: new Date(NOW.getTime() - 73 * H) }), NOW)).toEqual({ kind: "stand", variant: "a" })
    expect(nextEmail(state({ sent: [sent("willkommen", 9 * D), sent("zahlung", 6 * D), sent("stand", 3 * D)], abandonedAt: new Date(NOW.getTime() - 3 * H) }), at("2026-11-28T07:00:00Z"))).toEqual({ kind: "endspurt", variant: "a" })
  })

  it("sends the Endspurt 14 days before the exam, not earlier, not in the last 3 days", () => {
    const done = [sent("willkommen", 20 * D), sent("stand", 17 * D)]
    expect(nextEmail(state({ sent: done }), at("2026-11-27T07:00:00Z"))).toBeNull()
    expect(nextEmail(state({ sent: done }), at("2026-11-28T07:00:00Z"))).toEqual({ kind: "endspurt", variant: "a" })
    expect(nextEmail(state({ sent: done }), at("2026-12-08T07:00:00Z"))).toEqual({ kind: "endspurt", variant: "a" })
    expect(nextEmail(state({ sent: done }), at("2026-12-09T07:00:00Z"))).toBeNull()
  })

  it("waits 3 days after Dein Stand before the Endspurt", () => {
    const now = at("2026-11-30T07:00:00Z")
    const sentAt = (kind: "willkommen" | "stand", days: number) => ({ kind, at: new Date(now.getTime() - days * D) })
    expect(nextEmail(state({ sent: [sentAt("willkommen", 5 * 1), sentAt("stand", 2)] }), now)).toBeNull()
    expect(nextEmail(state({ sent: [sentAt("willkommen", 6), sentAt("stand", 3)] }), now)).toEqual({ kind: "endspurt", variant: "a" })
  })

  it("asks for a date 14 days after consent when there is none", () => {
    const s = state({ examDate: null, consentAt: at("2026-10-27T10:00:00Z"), sent: [sent("willkommen", 14 * D), sent("stand", 11 * D)] })
    expect(nextEmail(s, at("2026-11-10T07:00:00Z"))).toEqual({ kind: "endspurt", variant: "b" })
    expect(nextEmail({ ...s, consentAt: at("2026-10-28T10:00:00Z") }, at("2026-11-10T07:00:00Z"))).toBeNull()
  })

  it("skips Dein Stand once the exam is over", () => {
    expect(nextEmail(state({ examDate: "2026-11-09", sent: [sent("willkommen", 4 * D)] }), NOW)).toBeNull()
  })

  it("asks how it went 3 to 14 days after the exam", () => {
    const s = state({ examDate: "2026-12-12", sent: [sent("willkommen", 40 * D), sent("stand", 37 * D), sent("endspurt", 14 * D)] })
    expect(nextEmail(s, at("2026-12-14T07:00:00Z"))).toBeNull()
    expect(nextEmail(s, at("2026-12-15T07:00:00Z"))).toEqual({ kind: "nach_pruefung", variant: null })
    expect(nextEmail(s, at("2026-12-27T07:00:00Z"))).toBeNull()
  })

  it("sends a pass owner only the after-exam email", () => {
    expect(nextEmail(state({ ownsPass: true }), NOW)).toBeNull()
    expect(nextEmail(state({ ownsPass: true, sent: [sent("willkommen", 5 * D)], abandonedAt: new Date(NOW.getTime() - 3 * H) }), NOW)).toBeNull()
    expect(nextEmail(state({ ownsPass: true, examDate: "2026-11-06" }), NOW)).toEqual({ kind: "nach_pruefung", variant: null })
  })

  it("never sends a kind twice, so five is the most anyone gets", () => {
    const all = state({ examDate: "2026-11-01", sent: [sent("willkommen", 30 * D), sent("zahlung", 25 * D), sent("stand", 20 * D), sent("endspurt", 15 * D), sent("nach_pruefung", 5 * D)], abandonedAt: new Date(NOW.getTime() - 3 * H) })
    expect(nextEmail(all, NOW)).toBeNull()
  })
})
