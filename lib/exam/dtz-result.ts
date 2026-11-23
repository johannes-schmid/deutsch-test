import { speakingLevel, writingLevel } from "./band"
import type { Level } from "./types"

// DTZ Gesamtergebnis. B1 follows § 10 Abs. 1 IntTestV as amended in 11/2026: Sprechen B1, B1 in Hören/Lesen or
// Schreiben, and at least A2 in the remaining area. A2 and "no certificate" follow g.a.s.t. (research/dtz-blueprint.md §6).

export type DtzAreas = { sprechen: Level; hoerenLesen: Level; schreiben: Level }
export type DtzPoints = { hoerenLesen: number; schreiben: number; sprechen: number }

export const DTZ_MAX: DtzPoints = { hoerenLesen: 45, schreiben: 20, sprechen: 100 }
export const DTZ_B1_FROM: DtzPoints = { hoerenLesen: 33, schreiben: 15, sprechen: 75 }
export const DTZ_A2_FROM: DtzPoints = { hoerenLesen: 20, schreiben: 7, sprechen: 35 }

export const hoerenLesenLevel = (points: number): Level => (points >= DTZ_B1_FROM.hoerenLesen ? "B1" : points >= DTZ_A2_FROM.hoerenLesen ? "A2" : "unter A2")

export const dtzAreaLevels = (p: DtzPoints): DtzAreas => ({
  hoerenLesen: hoerenLesenLevel(p.hoerenLesen),
  schreiben: writingLevel(p.schreiben),
  sprechen: speakingLevel(p.sprechen),
})

const atLeastA2 = (l: Level) => l !== "unter A2"

export function dtzOverall({ sprechen, hoerenLesen, schreiben }: DtzAreas): Level {
  if (!atLeastA2(sprechen)) return "unter A2"
  const oneB1 = hoerenLesen === "B1" || schreiben === "B1"
  if (sprechen === "B1" && oneB1 && atLeastA2(hoerenLesen) && atLeastA2(schreiben)) return "B1"
  return atLeastA2(hoerenLesen) || atLeastA2(schreiben) ? "A2" : "unter A2"
}

/** What keeps a result from B1, in the order a learner should fix it. Empty when the result is B1. */
export function dtzMissingForB1(a: DtzAreas): (keyof DtzAreas)[] {
  if (dtzOverall(a) === "B1") return []
  const missing: (keyof DtzAreas)[] = []
  if (a.sprechen !== "B1") missing.push("sprechen")
  if (a.hoerenLesen !== "B1" && a.schreiben !== "B1") missing.push("hoerenLesen", "schreiben")
  else {
    if (!atLeastA2(a.hoerenLesen)) missing.push("hoerenLesen")
    if (!atLeastA2(a.schreiben)) missing.push("schreiben")
  }
  return missing
}
