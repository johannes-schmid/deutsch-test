import { describe, expect, it } from "vitest"
import { ACTIVE_CATALOGUE, CATALOGUES, PLANS, coveringOffer, mollieInterval, offerById, sellableOffer, upgradeCost } from "@/lib/pricing"
import { ALL_GRANTS } from "./grants"

const offers = Object.values(CATALOGUES).flatMap((c) => c.offers)

describe("catalogues", () => {
  it("never reuses an offer id, since renewals and old payments resolve offers by id", () => {
    const ids = offers.map((o) => o.id)
    expect(new Set(ids).size).toBe(ids.length)
    expect(ids).not.toContain("renewal")
  })

  it("files every offer under the catalogue that lists it", () => {
    for (const c of Object.values(CATALOGUES)) for (const o of c.offers) expect(o.catalogue).toBe(c.id)
  })

  it("keeps the offers sold since 2026-10-24 resolvable", () => {
    expect(offerById("1m")).toMatchObject({ months: 1, cents: 1995, renews: { months: 1, cents: 1995 }, grants: ALL_GRANTS })
    expect(offerById("3m")).toMatchObject({ months: 3, cents: 4495, renews: { months: 1, cents: 1995 }, grants: ALL_GRANTS })
  })

  it("reads the old subscriptions' planId 'renewal' as the monthly full pass", () => {
    expect(offerById("renewal")).toMatchObject({ renews: { months: 1, cents: 1995 }, grants: ALL_GRANTS })
  })

  it("sells only the active catalogue", () => {
    expect(PLANS).toBe(CATALOGUES[ACTIVE_CATALOGUE].offers)
    expect(sellableOffer("renewal")).toBeNull()
    expect(sellableOffer({})).toBeNull()
    for (const o of PLANS) expect(sellableOffer(o.id)).toBe(o)
  })

  it("sells any one or two skills at 9.95 each, and all four for the price of three", () => {
    const teil = CATALOGUES["teil-2026-11"].offers
    for (const o of teil.filter((o) => o.grants.skills.length < 4))
      expect(o).toMatchObject({ months: 1, cents: 995 * o.grants.skills.length, renews: { months: 1, cents: 995 * o.grants.skills.length }, grants: { exams: "*", simulation: false } })
    expect(teil.filter((o) => o.grants.skills.length === 1)).toHaveLength(4)
    expect(teil.filter((o) => o.grants.skills.length === 2)).toHaveLength(6)
    expect(offerById("teil-alle")).toMatchObject({ cents: 3 * 995, renews: { months: 1, cents: 3 * 995 }, grants: ALL_GRANTS, featured: true })
  })

  it("resolves any pick of skills to the cheapest offer that covers it", () => {
    const teil = CATALOGUES["teil-2026-11"].offers
    expect(coveringOffer(["sprechen"], teil)?.id).toBe("teil-sprechen")
    expect(coveringOffer(["sprechen", "schreiben"], teil)?.id).toBe("teil-schreiben-sprechen")
    expect(coveringOffer(["hoeren", "lesen", "sprechen"], teil)?.id).toBe("teil-alle")
    expect(coveringOffer(["hoeren", "lesen", "schreiben", "sprechen"], teil)?.id).toBe("teil-alle")
    expect(coveringOffer([], teil)).toBeNull()
  })

  it("lets a learner add skills for the monthly difference, never remove them", () => {
    const o = (id: string) => offerById(id)!
    expect(upgradeCost(o("teil-sprechen"), o("teil-alle"))).toBe(1990)
    expect(upgradeCost(o("teil-sprechen"), o("teil-schreiben-sprechen"))).toBe(995)
    expect(upgradeCost(o("teil-schreiben-sprechen"), o("teil-alle"))).toBe(995)
    expect(upgradeCost(o("teil-lesen"), o("teil-schreiben-sprechen"))).toBeNull()
    expect(upgradeCost(o("teil-schreiben-sprechen"), o("teil-sprechen"))).toBeNull()
    expect(upgradeCost(o("teil-alle"), o("teil-alle"))).toBeNull()
    expect(upgradeCost(o("1m"), o("3m"))).toBeNull()
    expect(upgradeCost(o("1m"), o("teil-alle"))).toBeNull()
  })

  it("keeps an inactive catalogue resolvable but not sellable", () => {
    for (const c of Object.values(CATALOGUES).filter((c) => c.id !== ACTIVE_CATALOGUE))
      for (const o of c.offers) {
        expect(offerById(o.id)).toBe(o)
        expect(sellableOffer(o.id)).toBeNull()
      }
  })

  it("speaks Mollie's interval format", () => {
    expect(mollieInterval({ months: 1, cents: 0 })).toBe("1 month")
    expect(mollieInterval({ months: 3, cents: 0 })).toBe("3 months")
  })
})
