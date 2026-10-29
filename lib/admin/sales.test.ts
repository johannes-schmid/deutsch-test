import { describe, expect, it } from "vitest"
import { berlinWeek, computeSales, type SaleCustomer, type SalePayment } from "./sales"

// Tuesday 27 Oct 2026, 10:00 Berlin (CET after the DST switch on 25 Oct).
const now = new Date("2026-10-27T09:00:00Z")

const pay = (p: Partial<SalePayment> & Pick<SalePayment, "paid_at">): SalePayment => ({
  user_id: "u1",
  plan_id: "1m",
  kind: "first",
  term_months: 1,
  renewal_cents: 1995,
  amount_cents: 1995,
  period_ends_at: null,
  revoked_at: null,
  ...p,
})

describe("berlinWeek", () => {
  it("buckets by the Berlin Monday, not the UTC one", () => {
    // Sunday 23:30 UTC on 25 Oct is already Monday 26 Oct in Berlin.
    expect(berlinWeek("2026-10-25T23:30:00Z")).toBe("2026-10-26")
    expect(berlinWeek("2026-10-25T22:30:00Z")).toBe("2026-10-19")
  })
})

describe("computeSales", () => {
  it("sums revenue per Berlin day and week and leaves refunds out", () => {
    const s = computeSales({
      now,
      customers: [],
      signups: [],
      payments: [
        pay({ paid_at: "2026-10-27T08:00:00Z" }),
        pay({ paid_at: "2026-10-26T22:30:00Z", amount_cents: 4495, plan_id: "3m", term_months: 3 }),
        pay({ paid_at: "2026-10-20T12:00:00Z" }),
        pay({ paid_at: "2026-10-27T07:00:00Z", revoked_at: "2026-10-27T08:00:00Z" }),
      ],
    })
    expect(s.today).toEqual({ cents: 1995, count: 1 })
    expect(s.yesterday).toEqual({ cents: 4495, count: 1 })
    expect(s.thisWeek).toEqual({ cents: 6490, count: 2 })
    expect(s.lastWeek).toEqual({ cents: 1995, count: 1 })
    expect(s.total).toEqual({ cents: 8485, count: 3 })
    expect(s.revenueWeeks).toHaveLength(12)
    expect(s.revenueWeeks.at(-1)).toEqual({ week: "2026-10-26", cents: 6490, count: 2 })
  })

  it("counts MRR per month of the running term and splits off cancelled passes", () => {
    const customers: SaleCustomer[] = [
      { user_id: "a", subscription_id: "sub_a", canceled_at: null },
      { user_id: "b", subscription_id: "sub_b", canceled_at: null },
      { user_id: "c", subscription_id: "sub_c", canceled_at: "2026-10-20T10:00:00Z" },
      { user_id: "d", subscription_id: "sub_d", canceled_at: null },
    ]
    const s = computeSales({
      now,
      customers,
      signups: [],
      payments: [
        pay({ user_id: "a", paid_at: "2026-10-10T10:00:00Z", period_ends_at: "2026-11-10T10:00:00Z" }),
        pay({ user_id: "b", plan_id: "3m", term_months: 3, amount_cents: 4495, paid_at: "2026-09-01T10:00:00Z", period_ends_at: "2026-12-01T10:00:00Z" }),
        pay({ user_id: "c", paid_at: "2026-10-15T10:00:00Z", period_ends_at: "2026-11-15T10:00:00Z" }),
        // Lapsed beyond the grace days: no longer recurring.
        pay({ user_id: "d", paid_at: "2026-08-01T10:00:00Z", period_ends_at: "2026-09-01T10:00:00Z" }),
      ],
    })
    expect(s.active).toBe(2)
    expect(s.mrrCents).toBe(1995 + 1498)
    expect(s.ending).toBe(1)
    expect(s.endingCents).toBe(1995)
    expect(s.canceled30).toBe(1)
    expect(s.churnPct).toBeCloseTo(100 / 3)
    expect(s.cancellations).toEqual([{ userId: "c", canceledAt: "2026-10-20T10:00:00Z", until: "2026-11-15T10:00:00Z" }])
  })

  it("counts an upgraded pass at its new monthly price, not at the one-off difference", () => {
    const s = computeSales({
      now,
      signups: [],
      customers: [{ user_id: "a", subscription_id: "sub_a", canceled_at: null }],
      payments: [
        pay({ user_id: "a", plan_id: "teil-sprechen", amount_cents: 995, renewal_cents: 995, paid_at: "2026-10-10T10:00:00Z", period_ends_at: "2026-11-10T10:00:00Z" }),
        pay({ user_id: "a", plan_id: "teil-alle", kind: "upgrade", amount_cents: 1990, renewal_cents: 2985, paid_at: "2026-10-20T10:00:00Z", period_ends_at: "2026-11-10T10:00:00Z" }),
      ],
    })
    expect(s.mrrCents).toBe(2985)
    expect(s.total).toEqual({ cents: 2985, count: 2 })
  })

  it("keeps a renewing pass in the MRR during the grace days", () => {
    const s = computeSales({
      now,
      signups: [],
      customers: [{ user_id: "a", subscription_id: "sub_a", canceled_at: null }],
      payments: [pay({ user_id: "a", paid_at: "2026-09-24T10:00:00Z", period_ends_at: "2026-10-24T10:00:00Z" })],
    })
    expect(s.active).toBe(1)
  })

  it("converts sign-ups to first payments per week; renewals don't count", () => {
    const s = computeSales({
      now,
      customers: [],
      signups: [
        { week: "2026-10-26", signups: 4 },
        { week: "2026-10-19", signups: 0 },
      ],
      payments: [
        pay({ paid_at: "2026-10-27T08:00:00Z" }),
        pay({ paid_at: "2026-10-27T08:30:00Z", kind: "renewal", plan_id: "renewal" }),
        pay({ paid_at: "2026-10-21T08:00:00Z" }),
      ],
    })
    expect(s.conversionWeeks.at(-1)).toEqual({ week: "2026-10-26", signups: 4, buyers: 1, pct: 25 })
    expect(s.conversionWeeks.at(-2)).toEqual({ week: "2026-10-19", signups: 0, buyers: 1, pct: null })
  })

  it("has no churn rate without customers", () => {
    expect(computeSales({ now, payments: [], customers: [], signups: [] }).churnPct).toBeNull()
  })
})
