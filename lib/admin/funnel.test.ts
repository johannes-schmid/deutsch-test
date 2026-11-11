import { describe, expect, it } from "vitest"
import { computeFunnel, type FunnelAttempt, type FunnelPayment } from "./funnel"

// Wednesday 4 Nov 2026, 10:00 Berlin. This week = Mon 2 Nov, last week = Mon 26 Oct.
const now = new Date("2026-11-04T09:00:00Z")

const attempt = (a: Partial<FunnelAttempt> & Pick<FunnelAttempt, "user_id" | "started_at">): FunnelAttempt => ({ exam: "dtz", skill: "lesen", number: 1, paused: null, ...a })
const payment = (p: Partial<FunnelPayment> & Pick<FunnelPayment, "user_id" | "created_at">): FunnelPayment => ({ kind: "first", status: "open", paid_at: null, ...p })

describe("computeFunnel", () => {
  it("counts people per stage of the current week, each person once", () => {
    const f = computeFunnel({
      now,
      signups: [{ week: "2026-11-02", signups: 3 }, { week: "2026-10-26", signups: 10 }],
      attempts: [
        attempt({ user_id: "a", started_at: "2026-11-02T10:00:00Z" }),
        attempt({ user_id: "a", started_at: "2026-11-03T10:00:00Z", skill: "hoeren", paused: { at: "2026-11-03T10:20:00Z" } }),
        attempt({ user_id: "a", started_at: "2026-11-03T11:00:00Z", paused: { at: "2026-11-03T11:20:00Z" } }),
        attempt({ user_id: "b", started_at: "2026-11-03T12:00:00Z", paused: { at: "2026-11-03T12:30:00Z" } }),
        attempt({ user_id: "c", started_at: "2026-10-28T12:00:00Z", paused: { at: "2026-10-28T12:30:00Z" } }),
      ],
      payments: [
        payment({ user_id: "b", created_at: "2026-11-03T12:40:00Z" }),
        payment({ user_id: "b", created_at: "2026-11-03T12:50:00Z", status: "paid", paid_at: "2026-11-03T12:51:00Z" }),
        payment({ user_id: "x", created_at: "2026-11-03T13:00:00Z", kind: "renewal", status: "paid", paid_at: "2026-11-03T13:00:00Z" }),
      ],
    })
    expect(f.thisWeek).toMatchObject({ week: "2026-11-02", signups: 3, started: 2, paywall: 2, checkout: 1, paid: 1 })
    expect(f.thisWeek.paywallAttempts).toBe(3)
    expect(f.lastWeek).toMatchObject({ week: "2026-10-26", signups: 10, started: 1, paywall: 1, checkout: 0, paid: 0 })
  })

  it("keeps a buyer in the paywall stage after paying cleared the pause", () => {
    const f = computeFunnel({
      now,
      signups: [],
      attempts: [attempt({ user_id: "d", started_at: "2026-11-02T10:00:00Z" })],
      payments: [payment({ user_id: "d", created_at: "2026-11-02T10:30:00Z", status: "paid", paid_at: "2026-11-02T10:31:00Z" })],
    })
    expect(f.thisWeek).toMatchObject({ paywall: 1, paywallAttempts: 0, checkout: 1, paid: 1 })
  })

  it("ignores a buyer who never opened a Modelltest 1 as a paywall sighting", () => {
    const f = computeFunnel({
      now,
      signups: [],
      attempts: [attempt({ user_id: "e", started_at: "2026-11-02T10:00:00Z", number: 2 })],
      payments: [payment({ user_id: "e", created_at: "2026-11-02T09:00:00Z", status: "paid", paid_at: "2026-11-02T09:01:00Z" })],
    })
    expect(f.thisWeek).toMatchObject({ paywall: 0, checkout: 1, paid: 1 })
  })

  it("breaks the week's paywall sightings down by exam and skill, most first", () => {
    const f = computeFunnel({
      now,
      signups: [],
      attempts: [
        attempt({ user_id: "a", started_at: "2026-11-02T10:00:00Z", exam: "dtz", skill: "hoeren", paused: { at: "2026-11-02T10:20:00Z" } }),
        attempt({ user_id: "b", started_at: "2026-11-02T10:00:00Z", exam: "dtz", skill: "hoeren", paused: { at: "2026-11-02T10:20:00Z" } }),
        attempt({ user_id: "c", started_at: "2026-11-02T10:00:00Z", exam: "telc-b1", skill: "lesen", paused: { at: "2026-11-02T10:20:00Z" } }),
        attempt({ user_id: "c", started_at: "2026-10-27T10:00:00Z", exam: "telc-b1", skill: "lesen", paused: { at: "2026-10-27T10:20:00Z" } }),
      ],
      payments: [],
    })
    expect(f.paywallBySkill).toEqual([
      { exam: "dtz", skill: "hoeren", thisWeek: 2, lastWeek: 0, total: 2 },
      { exam: "telc-b1", skill: "lesen", thisWeek: 1, lastWeek: 1, total: 2 },
    ])
    expect(f.total.paywallAttempts).toBe(4)
  })
})

describe("computeFunnel with paywall_at", () => {
  it("counts a sighting by its own timestamp, also after paying cleared the pause", () => {
    const f = computeFunnel({
      now,
      signups: [],
      attempts: [
        attempt({ user_id: "g", started_at: "2026-10-27T10:00:00Z", exam: "dtz", skill: "hoeren", paywall_at: "2026-11-02T08:00:00Z" }),
        attempt({ user_id: "h", started_at: "2026-11-02T10:00:00Z", number: 2, paywall_at: null }),
      ],
      payments: [],
    })
    expect(f.thisWeek).toMatchObject({ paywall: 1, paywallAttempts: 1 })
    expect(f.lastWeek).toMatchObject({ paywall: 0, started: 1 })
    expect(f.paywallBySkill).toEqual([{ exam: "dtz", skill: "hoeren", thisWeek: 1, lastWeek: 0, total: 1 }])
  })

  it("does not count one person twice when the timestamp and the old pause both exist", () => {
    const f = computeFunnel({
      now,
      signups: [],
      attempts: [attempt({ user_id: "i", started_at: "2026-11-02T10:00:00Z", paused: { at: "2026-11-02T10:20:00Z" }, paywall_at: "2026-11-02T10:20:00Z" })],
      payments: [payment({ user_id: "i", created_at: "2026-11-02T10:30:00Z" })],
    })
    expect(f.thisWeek).toMatchObject({ paywall: 1, paywallAttempts: 1, checkout: 1 })
  })
})
