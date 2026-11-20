import { describe, expect, it } from "vitest"
import { landingPath, parseOnboarding, welcomePath } from "./onboarding"

const now = new Date("2026-11-20T10:00:00Z")
const q = (s: string) => new URLSearchParams(s)

describe("welcomePath", () => {
  it("carries every answer through the Google round trip", () => {
    expect(welcomePath({ exam: "dtz", skill: "lesen", examDate: "2027-02-14", goal: "einbuergerung" })).toBe("/auth/willkommen?exam=dtz&skill=lesen&date=2027-02-14&goal=einbuergerung")
  })

  it("leaves out skipped answers", () => {
    expect(welcomePath({ exam: "telc-b1", skill: null, examDate: null, goal: null })).toBe("/auth/willkommen?exam=telc-b1")
  })

  it("round-trips through parseOnboarding", () => {
    const o = { exam: "goethe-b1", skill: "hoeren", examDate: "2027-01-05", goal: "arbeit" } as const
    expect(parseOnboarding(q(welcomePath(o).split("?")[1]), now)).toEqual(o)
  })
})

describe("parseOnboarding", () => {
  it("needs a known exam", () => {
    expect(parseOnboarding(q(""), now)).toBeNull()
    expect(parseOnboarding(q("exam=toefl"), now)).toBeNull()
  })

  it("drops a skill, goal or date it does not know instead of failing", () => {
    expect(parseOnboarding(q("exam=dtz&skill=tanzen&goal=urlaub&date=morgen"), now)).toEqual({ exam: "dtz", skill: null, examDate: null, goal: null })
  })

  it("keeps a date from today up to three years ahead", () => {
    expect(parseOnboarding(q("exam=dtz&date=2026-11-20"), now)?.examDate).toBe("2026-11-20")
    expect(parseOnboarding(q("exam=dtz&date=2029-11-01"), now)?.examDate).toBe("2029-11-01")
  })

  it("drops a past date, one too far ahead, and an impossible one", () => {
    expect(parseOnboarding(q("exam=dtz&date=2026-11-19"), now)?.examDate).toBeNull()
    expect(parseOnboarding(q("exam=dtz&date=2030-01-01"), now)?.examDate).toBeNull()
    expect(parseOnboarding(q("exam=dtz&date=2027-02-31"), now)?.examDate).toBeNull()
  })
})

describe("landingPath", () => {
  it("opens the skill the free test was about", () => {
    expect(landingPath({ exam: "dtz", skill: "lesen", examDate: null, goal: null })).toBe("/dashboard/dtz/lesen")
  })

  it("opens the exam without a skill", () => {
    expect(landingPath({ exam: "dtz", skill: null, examDate: null, goal: null })).toBe("/dashboard/dtz")
  })
})
