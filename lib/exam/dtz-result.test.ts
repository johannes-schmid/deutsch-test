import { describe, expect, it } from "vitest"
import { dtzAreaLevels, dtzOverall, hoerenLesenLevel } from "./dtz-result"

describe("DTZ overall result (§ 10 Abs. 1 IntTestV, as amended 11/2026)", () => {
  it("bands Hören + Lesen on 45 points", () => {
    expect(hoerenLesenLevel(33)).toBe("B1")
    expect(hoerenLesenLevel(32)).toBe("A2")
    expect(hoerenLesenLevel(20)).toBe("A2")
    expect(hoerenLesenLevel(19)).toBe("unter A2")
  })

  it("gives B1 with Sprechen B1, one written area B1 and the other at least A2", () => {
    expect(dtzOverall({ sprechen: "B1", hoerenLesen: "B1", schreiben: "A2" })).toBe("B1")
    expect(dtzOverall({ sprechen: "B1", hoerenLesen: "A2", schreiben: "B1" })).toBe("B1")
    expect(dtzOverall({ sprechen: "B1", hoerenLesen: "B1", schreiben: "B1" })).toBe("B1")
  })

  it("no longer gives B1 when the remaining area is under A2", () => {
    expect(dtzOverall({ sprechen: "B1", hoerenLesen: "B1", schreiben: "unter A2" })).toBe("A2")
    expect(dtzOverall({ sprechen: "B1", hoerenLesen: "unter A2", schreiben: "B1" })).toBe("A2")
  })

  it("never gives B1 without B1 in Sprechen", () => {
    expect(dtzOverall({ sprechen: "A2", hoerenLesen: "B1", schreiben: "B1" })).toBe("A2")
  })

  it("gives A2 with Sprechen at least A2 and one written area at least A2", () => {
    expect(dtzOverall({ sprechen: "B1", hoerenLesen: "A2", schreiben: "A2" })).toBe("A2")
    expect(dtzOverall({ sprechen: "A2", hoerenLesen: "A2", schreiben: "unter A2" })).toBe("A2")
    expect(dtzOverall({ sprechen: "A2", hoerenLesen: "unter A2", schreiben: "unter A2" })).toBe("unter A2")
  })

  it("gives no certificate level when Sprechen is under A2", () => {
    expect(dtzOverall({ sprechen: "unter A2", hoerenLesen: "B1", schreiben: "B1" })).toBe("unter A2")
  })

  it("turns points into area levels", () => {
    expect(dtzAreaLevels({ hoerenLesen: 33, schreiben: 14, sprechen: 75 })).toEqual({ hoerenLesen: "B1", schreiben: "A2", sprechen: "B1" })
    expect(dtzAreaLevels({ hoerenLesen: 19, schreiben: 15, sprechen: 74.5 })).toEqual({ hoerenLesen: "unter A2", schreiben: "B1", sprechen: "A2" })
  })
})
