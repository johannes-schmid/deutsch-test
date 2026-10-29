import { describe, expect, it } from "vitest"
import { ALL_GRANTS, activeGrants, allows, parseGrants, type Grants } from "./grants"
import { GRACE_DAYS } from "./period"

const DAY = 86_400_000
const now = new Date("2026-11-10T10:00:00Z")
const sprechen: Grants = { skills: ["sprechen"], exams: "*", simulation: false }
const lesenDtz: Grants = { skills: ["lesen"], exams: ["dtz"], simulation: false }
const ends = (days: number) => new Date(now.getTime() + days * DAY)

describe("allows", () => {
  it("opens every skill and exam with the full pass", () => {
    expect(allows([ALL_GRANTS], "telc-b1", "hoeren")).toBe(true)
    expect(allows([ALL_GRANTS], "dtz", "sprechen")).toBe(true)
  })

  it("opens only the granted skill", () => {
    expect(allows([sprechen], "goethe-b1", "sprechen")).toBe(true)
    expect(allows([sprechen], "goethe-b1", "lesen")).toBe(false)
  })

  it("opens only the granted exams", () => {
    expect(allows([lesenDtz], "dtz", "lesen")).toBe(true)
    expect(allows([lesenDtz], "telc-b1", "lesen")).toBe(false)
  })

  it("checks each grant on its own, so scopes never mix", () => {
    const both = [sprechen, lesenDtz]
    expect(allows(both, "telc-b1", "sprechen")).toBe(true)
    expect(allows(both, "telc-b1", "lesen")).toBe(false)
    expect(allows(both, "dtz", "lesen")).toBe(true)
  })

  it("opens nothing without grants", () => {
    expect(allows([], "dtz", "lesen")).toBe(false)
  })
})

describe("activeGrants", () => {
  it("keeps the grants of every period that still gives access", () => {
    expect(activeGrants([{ end: ends(5), grants: sprechen }, { end: ends(20), grants: lesenDtz }], false, now)).toEqual([sprechen, lesenDtz])
  })

  it("drops ended periods, but keeps the grace days while the subscription renews", () => {
    const rows = [{ end: ends(-2), grants: sprechen }]
    expect(activeGrants(rows, false, now)).toEqual([])
    expect(activeGrants(rows, true, now)).toEqual([sprechen])
    expect(activeGrants([{ end: ends(-GRACE_DAYS - 1), grants: sprechen }], true, now)).toEqual([])
  })
})

describe("parseGrants", () => {
  it("reads a stored snapshot", () => {
    expect(parseGrants({ skills: ["lesen"], exams: ["dtz"], simulation: false })).toEqual(lesenDtz)
    expect(parseGrants({ skills: ["hoeren", "lesen", "schreiben", "sprechen"], exams: "*", simulation: true })).toEqual(ALL_GRANTS)
  })

  it("rejects anything that is not a snapshot, so a bad row grants nothing", () => {
    expect(parseGrants(null)).toBeNull()
    expect(parseGrants({ skills: ["kochen"], exams: "*", simulation: false })).toBeNull()
    expect(parseGrants({ skills: ["lesen"], exams: ["nope"], simulation: false })).toBeNull()
    expect(parseGrants({ skills: ["lesen"], exams: "*" })).toBeNull()
  })
})
