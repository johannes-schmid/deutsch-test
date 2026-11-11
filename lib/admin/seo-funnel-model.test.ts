import { describe, expect, it } from "vitest"
import { aiEngine, buildFunnel, indexState, kindOfSection, normalisePath, rollupByKind, weakestStep, type EventRow, type SessionRow } from "./seo-funnel-model"

const s = (page: string, channel: string, source: string, sessions: number): SessionRow => ({ page, channel, source, sessions })
const e = (page: string, event: string, users: number, value = 0, channel = "Organic Search", source = "google"): EventRow => ({ page, channel, source, event, users, value })

describe("buildFunnel", () => {
  it("counts only search and AI sessions, per landing page", () => {
    const f = buildFunnel(
      [s("/gratis-test", "Organic Search", "google", 40), s("/gratis-test", "Direct", "(direct)", 99), s("/blog/dtz-pruefung", "Unassigned", "perplexity.ai", 5)],
      [e("/gratis-test", "test_start", 12), e("/gratis-test", "test_start", 50, 0, "Direct", "(direct)"), e("/gratis-test", "sign_up", 3)],
    )
    expect(f.total.visits).toBe(45)
    expect(f.byPage["/gratis-test"]).toMatchObject({ visits: 40, practice: 12, account: 3 })
    expect(f.ai).toEqual([{ engine: "Perplexity", sessions: 5 }])
  })

  it("adds both practice events and sums revenue to the cent", () => {
    const f = buildFunnel([], [e("/", "test_start", 2), e("/", "modeltest_start", 1), e("/", "purchase", 1, 29.85), e("/", "purchase", 1, 9.95)])
    expect(f.byPage["/"].practice).toBe(3)
    expect(f.total.revenue).toBe(39.8)
  })

  it("ignores events outside the funnel", () => {
    expect(buildFunnel([], [e("/", "cta_click", 7)]).total).toMatchObject({ practice: 0, account: 0 })
  })
})

describe("normalisePath", () => {
  it("drops the query and trailing slash and decodes", () => {
    expect(normalisePath("/uk/%D1%82%D0%B5%D1%81%D1%82/?x=1")).toBe("/uk/тест")
    expect(normalisePath("/")).toBe("/")
    expect(normalisePath("(not set)")).toBeNull()
  })
})

describe("kinds", () => {
  it("folds the triage sections into four kinds", () => {
    expect(["practice", "landing", "blog", "core", "translations", "legal"].map(kindOfSection)).toEqual(["practice", "landing", "blog", "other", "other", "other"])
  })

  it("rolls pages up, unknown pages into other", () => {
    const f = buildFunnel([s("/gratis-test", "Organic Search", "google", 10), s("/x", "Organic Search", "google", 4)], [])
    const k = rollupByKind(f.byPage, (p) => (p === "/gratis-test" ? "practice" : null))
    expect(k.practice.visits).toBe(10)
    expect(k.other.visits).toBe(4)
  })
})

describe("weakestStep", () => {
  it("needs 20 visits and finds the lowest step rate", () => {
    expect(weakestStep({ visits: 19, practice: 0, account: 0, checkout: 0, paid: 0, revenue: 0 })).toBeNull()
    expect(weakestStep({ visits: 100, practice: 40, account: 4, checkout: 2, paid: 1, revenue: 0 })).toBe("account")
  })

  it("stops at an empty step", () => {
    expect(weakestStep({ visits: 50, practice: 0, account: 0, checkout: 0, paid: 0, revenue: 0 })).toBe("practice")
  })
})

describe("aiEngine", () => {
  it("names the assistant behind a source", () => {
    expect(aiEngine("chatgpt.com")).toBe("ChatGPT")
    expect(aiEngine("google")).toBeNull()
  })
})

describe("indexState", () => {
  it("reads URL Inspection results", () => {
    expect(indexState(undefined)).toBe("unknown")
    expect(indexState({ verdict: "PASS", coverage: "Submitted and indexed" })).toBe("indexed")
    expect(indexState({ verdict: "NEUTRAL", coverage: "Discovered - currently not indexed" })).toBe("discovered")
    expect(indexState({ verdict: "NEUTRAL", coverage: "URL is unknown to Google" })).toBe("not-indexed")
    expect(indexState({ verdict: "NEUTRAL", coverage: "Alternate page with proper canonical tag" })).toBe("canonical")
  })
})
