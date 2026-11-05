import { describe, expect, it } from "vitest"
import { expectedSnapshotWeek, ledgerStatus, markPreliminary, mergeDaily, nextCollectDate, parseBingDate, parseSourceStatus, planOwnerWeek, trendRead, type DayPoint, type Recommendation } from "./seo-model"
import { pageScore, rollup, upsertHistory } from "./seo-score.mjs"

describe("parseSourceStatus", () => {
  it("reads the three forms collect.mjs writes", () => {
    expect(parseSourceStatus("ok (12s)")).toEqual({ state: "ok", detail: "12s" })
    expect(parseSourceStatus("skipped: GSC_SA_JSON missing")).toEqual({ state: "skipped", detail: "GSC_SA_JSON missing" })
    expect(parseSourceStatus("error: 502")).toEqual({ state: "error", detail: "502" })
    expect(parseSourceStatus(undefined).state).toBe("missing")
  })
})

describe("mergeDaily", () => {
  it("lets the newest Google run win and keeps Bing beside it", () => {
    const old = [{ date: "2026-11-01", clicks: 1, impressions: 10 }]
    const fresh = [{ date: "2026-11-01", clicks: 2, impressions: 12 }, { date: "2026-11-02", clicks: 0, impressions: 5 }]
    const bing = [{ Date: "/Date(1793577600000)/", Clicks: 1, Impressions: 3 }]
    const out = mergeDaily([old, fresh], bing)
    expect(out.map((p) => p.date)).toEqual(["2026-11-01", "2026-11-02"])
    expect(out[0]).toMatchObject({ google: 12, googleClicks: 2 })
    expect(parseBingDate(bing[0].Date)).toBe("2026-11-02")
    expect(out[1].bing).toBe(3)
  })
})

describe("trendRead", () => {
  const days = (n: number, v: (i: number) => number): DayPoint[] =>
    Array.from({ length: n }, (_, i) => ({ date: new Date(Date.UTC(2026, 9, 1 + i)).toISOString().slice(0, 10), google: v(i), googleClicks: 0, bing: null, bingClicks: null }))
  it("is unknown with fewer than 28 days", () => {
    expect(trendRead(days(20, () => 10)).tone).toBe("unknown")
  })
  it("is calm when the last week holds the peak level", () => {
    expect(trendRead(days(40, () => 100)).tone).toBe("calm")
  })
  it("alarms when the last week is under half the best two weeks", () => {
    const r = trendRead(days(40, (i) => (i < 30 ? 100 : 20)))
    expect(r.tone).toBe("alarm")
    expect(r.cause).toBeNull()
  })
})

describe("ledgerStatus", () => {
  it("runs, then waits for a verdict", () => {
    expect(ledgerStatus({ date: "2026-11-01", window_end: "2026-12-06", verdict: null }, "2026-11-08")).toMatchObject({ kind: "running", daysLeft: 28 })
    expect(ledgerStatus({ date: "2026-11-01", window_end: "2026-12-06", verdict: null }, "2026-12-07").kind).toBe("verdict-due")
    expect(ledgerStatus({ date: "2026-11-01", window_end: "2026-12-06", verdict: "worked" }, "2026-12-07").kind).toBe("worked")
  })
})

describe("snapshot calendar", () => {
  it("expects last Friday's week and names the next Friday", () => {
    expect(expectedSnapshotWeek(new Date("2026-11-05T10:00:00Z"))).toBe("2026-W44")
    expect(expectedSnapshotWeek(new Date("2026-11-07T10:00:00Z"))).toBe("2026-W45")
    expect(nextCollectDate(new Date("2026-11-05T10:00:00Z"))).toBe("2026-11-06")
    expect(nextCollectDate(new Date("2026-11-06T22:00:00Z"))).toBe("2026-11-13")
  })
  it("marks the last three days preliminary", () => {
    const pts = markPreliminary([{ date: "2026-11-02" }, { date: "2026-11-03" }, { date: "2026-11-05" }].map((p) => ({ ...p, google: 1, googleClicks: 0, bing: null, bingClicks: null })), "2026-11-05")
    expect(pts.map((p) => p.preliminary)).toEqual([false, true, true])
  })
})

describe("planOwnerWeek", () => {
  const rec = (id: string, minutes: number, priority: Recommendation["priority"]): Recommendation => ({
    id, created: "2026-11-05", site: "deutschtest", owner: "hannes", kind: "measurement", priority, task: id, why: "", steps: [], expect: "", minutes, source: "", status: "open",
  })
  it("fills the budget in priority order and shifts the rest", () => {
    const plan = planOwnerWeek([rec("c", 30, "later"), rec("a", 60, "now"), rec("b", 60, "next")], 90)
    expect(plan.thisWeek.map((r) => r.id)).toEqual(["a"])
    expect(plan.later.map((r) => r.id)).toEqual(["b", "c"])
  })
})

describe("pageScore", () => {
  const base = { path: "/x", section: "core", verdict: "healthy" as const, demand: 0, now: null, issues: [] }
  it("starts at 10 and ignores visibility without data", () => {
    expect(pageScore(base).score).toBe(10)
  })
  it("deducts for a snippet length and a technical error", () => {
    const r = pageScore({ ...base, issues: ["title 72 chars", "status 404"] })
    expect(r.score).toBe(6)
    expect(r.factors.map((f) => f.key).sort()).toEqual(["snippet", "technical"])
  })
  it("compares this window with the one before", () => {
    expect(pageScore({ ...base, demand: 100, now: { impressions: 10, position: 8 } }).factors[0]).toMatchObject({ key: "visibility", delta: -3 })
    expect(pageScore({ ...base, demand: 100, now: { impressions: 100, position: 25 } }).factors[0]).toMatchObject({ key: "position", delta: -2 })
  })
  it("weights the site by demand and upserts one row per week", () => {
    const { site, sections } = rollup([{ ...base, demand: 100, now: { impressions: 100, position: 3 } }, { ...base, path: "/y", section: "legal", issues: ["status 500"] }])
    expect(site).toBeGreaterThan(90)
    expect(sections.legal).toBe(7)
    const rows = upsertHistory([{ week: "2026-W44", date: "", site: 50, sections: {}, pages: 1, gsc: false, triage: "" }], { week: "2026-W44", date: "", site: 60, sections: {}, pages: 1, gsc: true, triage: "" })
    expect(rows).toHaveLength(1)
    expect(rows[0].site).toBe(60)
  })
})
