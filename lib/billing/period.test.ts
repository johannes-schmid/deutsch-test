import { describe, expect, it } from "vitest"
import { addMonths, hasAccess, periodFor, GRACE_DAYS } from "./period"

const d = (iso: string) => new Date(iso)
const DAY = 86_400_000

describe("addMonths", () => {
  it("keeps the day of month", () => {
    expect(addMonths(d("2026-10-24T10:00:00Z"), 1).toISOString()).toBe("2026-11-24T10:00:00.000Z")
    expect(addMonths(d("2026-10-24T10:00:00Z"), 3).toISOString()).toBe("2027-01-24T10:00:00.000Z")
  })

  it("clamps to the last day of a shorter month", () => {
    expect(addMonths(d("2027-01-31T08:00:00Z"), 1).toISOString()).toBe("2027-02-28T08:00:00.000Z")
    expect(addMonths(d("2028-01-31T08:00:00Z"), 1).toISOString()).toBe("2028-02-29T08:00:00.000Z")
    expect(addMonths(d("2026-11-30T08:00:00Z"), 3).toISOString()).toBe("2027-02-28T08:00:00.000Z")
  })
})

describe("periodFor", () => {
  const paidAt = d("2026-10-24T10:00:00Z")

  it("starts at payment when nothing was owned", () => {
    expect(periodFor({ months: 3, paidAt, latestEnd: null, continuous: false })).toEqual({ start: paidAt, end: d("2027-01-24T10:00:00Z") })
  })

  it("stacks on a pass that is still running", () => {
    const latestEnd = d("2026-11-10T00:00:00Z")
    expect(periodFor({ months: 1, paidAt, latestEnd, continuous: false })).toEqual({ start: latestEnd, end: d("2026-12-10T00:00:00Z") })
  })

  it("never backdates a new purchase onto an expired pass", () => {
    const latestEnd = d("2026-10-21T10:00:00Z")
    expect(periodFor({ months: 1, paidAt, latestEnd, continuous: false }).start).toEqual(paidAt)
  })

  it("lets a renewal that settles late continue from the old end (SEPA takes days)", () => {
    const latestEnd = new Date(paidAt.getTime() - 4 * DAY)
    expect(periodFor({ months: 1, paidAt, latestEnd, continuous: true })).toEqual({ start: latestEnd, end: addMonths(latestEnd, 1) })
  })

  it("restarts a renewal that arrives long after the pass lapsed", () => {
    const latestEnd = new Date(paidAt.getTime() - (GRACE_DAYS + 1) * DAY)
    expect(periodFor({ months: 1, paidAt, latestEnd, continuous: true }).start).toEqual(paidAt)
  })
})

describe("hasAccess", () => {
  const until = d("2026-11-24T10:00:00Z")

  it("is true until the period ends", () => {
    expect(hasAccess({ until, renewing: false }, d("2026-11-24T09:59:59Z"))).toBe(true)
    expect(hasAccess({ until, renewing: false }, d("2026-11-24T10:00:01Z"))).toBe(false)
  })

  it("covers the grace days only while the subscription renews", () => {
    const inGrace = new Date(until.getTime() + (GRACE_DAYS - 1) * DAY)
    expect(hasAccess({ until, renewing: true }, inGrace)).toBe(true)
    expect(hasAccess({ until, renewing: false }, inGrace)).toBe(false)
    expect(hasAccess({ until, renewing: true }, new Date(until.getTime() + (GRACE_DAYS + 1) * DAY))).toBe(false)
  })

  it("is false without any paid period", () => {
    expect(hasAccess({ until: null, renewing: true }, d("2026-10-24T10:00:00Z"))).toBe(false)
  })
})
