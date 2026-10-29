import { describe, expect, it } from "vitest"
import { mostPracticed } from "./default-skill"

const at = (skill: string, day: number) => ({ skill, completedAt: `2026-10-${String(day).padStart(2, "0")}T10:00:00Z` })

describe("mostPracticed", () => {
  it("picks the skill with the most finished Modelltests", () => {
    expect(mostPracticed([at("lesen", 1), at("sprechen", 2), at("sprechen", 3)])).toBe("sprechen")
  })

  it("breaks a tie by the most recent attempt", () => {
    expect(mostPracticed([at("lesen", 5), at("sprechen", 2), at("hoeren", 1)])).toBe("lesen")
    expect(mostPracticed([at("lesen", 1), at("lesen", 2), at("hoeren", 3), at("hoeren", 4)])).toBe("hoeren")
  })

  it("picks nothing without attempts, so the page preselects all four", () => {
    expect(mostPracticed([])).toBeNull()
  })

  it("picks nothing when all four are practised equally", () => {
    expect(mostPracticed([at("hoeren", 1), at("lesen", 2), at("schreiben", 3), at("sprechen", 4)])).toBeNull()
  })

  it("ignores rows that are not a skill", () => {
    expect(mostPracticed([at("kochen", 9), at("lesen", 1)])).toBe("lesen")
  })
})
