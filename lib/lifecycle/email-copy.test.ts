import { describe, expect, it } from "vitest"
import { lifecycleEmail, type LifecycleContext } from "@/lib/email/templates/lifecycle"
import type { Due } from "./rules"

const ctx = (over: Partial<LifecycleContext> = {}): LifecycleContext => ({
  firstName: "Olena",
  exam: "dtz",
  examDate: "2026-12-12",
  daysLeft: 14,
  done: [],
  unsubscribeUrl: "https://deutschtest-ueben.de/api/lifecycle/abmelden?t=00000000-0000-0000-0000-000000000000",
  ...over,
})

const CONSENT: Due[] = [
  { kind: "stand", variant: "a" },
  { kind: "stand", variant: "b" },
  { kind: "stand", variant: "c" },
  { kind: "zahlung", variant: null },
  { kind: "endspurt", variant: "a" },
  { kind: "endspurt", variant: "b" },
  { kind: "nach_pruefung", variant: null },
]

describe("lifecycle emails", () => {
  it("keeps the welcome free of offers, since it goes out without consent", () => {
    const m = lifecycleEmail({ kind: "willkommen", variant: null }, ctx({ unsubscribeUrl: null, exam: null, examDate: null, daysLeft: null }))
    for (const s of [m.subject, m.html, m.text]) {
      expect(s).not.toMatch(/€|Prüfungspass|Preis|Rabatt|kaufen|\/preise/)
    }
    expect(m.html).toContain("Konto bei deutschtest-ueben.de angelegt")
  })

  it("puts the unsubscribe link in every email with consent", () => {
    for (const due of CONSENT) {
      const m = lifecycleEmail(due, ctx({ done: due.variant === "b" ? ["hoeren"] : due.variant === "c" ? ["hoeren", "lesen", "schreiben", "sprechen"] : [] }))
      expect(m.html, `${due.kind}/${due.variant}`).toContain("/api/lifecycle/abmelden?t=")
      expect(m.text, `${due.kind}/${due.variant}`).toContain("/api/lifecycle/abmelden?t=")
    }
  })

  it("suggests the next skill in Dein Stand B", () => {
    const m = lifecycleEmail({ kind: "stand", variant: "b" }, ctx({ done: ["hoeren"] }))
    expect(m.subject).toBe("Als Nächstes: Lesen")
    expect(m.html).toContain("/dashboard/dtz/lesen/1")
  })

  it("escapes the learner's name", () => {
    const m = lifecycleEmail({ kind: "willkommen", variant: null }, ctx({ firstName: "<b>x</b>", unsubscribeUrl: null }))
    expect(m.html).not.toContain("<b>x</b>")
  })
})
