import { describe, expect, it } from "vitest"
import { nextSkill, pushMessage } from "./push-copy"

describe("nextSkill", () => {
  it("returns the first skill without a finished free Modelltest", () => {
    expect(nextSkill([])).toBe("hoeren")
    expect(nextSkill(["hoeren", "schreiben"])).toBe("lesen")
    expect(nextSkill(["hoeren", "lesen", "schreiben", "sprechen"])).toBeNull()
  })
})

describe("pushMessage", () => {
  it("counts down in the welcome when a date is set, and opens Hören Modelltest 1", () => {
    const m = pushMessage({ kind: "willkommen", variant: null }, { exam: "dtz", daysLeft: 46, done: [] })
    expect(m.title).toBe("Noch 46 Tage bis zum DTZ")
    expect(m.url).toBe("/dashboard/dtz/hoeren/1")
  })

  it("points Dein Stand B at the next open skill", () => {
    const m = pushMessage({ kind: "stand", variant: "b" }, { exam: "dtz", daysLeft: null, done: ["hoeren"] })
    expect(m.title).toBe("Weiter mit Lesen")
    expect(m.url).toBe("/dashboard/dtz/lesen/1")
  })

  it("sends Dein Stand C and the abandoned payment to the pass", () => {
    expect(pushMessage({ kind: "stand", variant: "c" }, { exam: "dtz", daysLeft: 30, done: ["hoeren", "lesen", "schreiben", "sprechen"] }).url).toBe("/dashboard/preise")
    expect(pushMessage({ kind: "zahlung", variant: null }, { exam: null, daysLeft: null, done: [] }).url).toBe("/dashboard/preise")
  })

  it("never shows a countdown without days left", () => {
    expect(pushMessage({ kind: "endspurt", variant: "a" }, { exam: "dtz", daysLeft: 0, done: [] }).title).toBe("Endspurt")
    expect(pushMessage({ kind: "willkommen", variant: null }, { exam: null, daysLeft: null, done: [] }).title).toBe("Schön, dass du da bist")
  })
})
