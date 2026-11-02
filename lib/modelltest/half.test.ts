import { describe, expect, it } from "vitest"
import type { MtGradedResult } from "./grade"
import { freePart, keepFreeAnswers, lockGrade, resumeFrom, trimTrack } from "./half"
import type { HoerTrack } from "./types"

describe("freePart", () => {
  it("frees the first half of the Teile, rounded down", () => {
    expect(freePart([1, 2, 3, 4])).toEqual({ mode: "teile", upTo: 2 })
    expect(freePart([1, 2, 3, 4, 5])).toEqual({ mode: "teile", upTo: 2 })
    expect(freePart([1, 2, 3])).toEqual({ mode: "teile", upTo: 1 })
    expect(freePart([1, 2])).toEqual({ mode: "teile", upTo: 1 })
  })

  it("counts each Teil once, in order, whatever the block order", () => {
    expect(freePart([3, 1, 1, 2, 4, 2])).toEqual({ mode: "teile", upTo: 2 })
  })

  it("keeps a single task whole and locks half of its feedback instead", () => {
    expect(freePart([1])).toEqual({ mode: "feedback" })
  })
})

describe("keepFreeAnswers", () => {
  it("drops answers to items outside the free Teile", () => {
    expect(keepFreeAnswers({ 1: "a", 2: "b", 9: "c" }, new Set([1, 2]))).toEqual({ 1: "a", 2: "b" })
  })
})

const crit = (name: string, points: number) => ({ name, points: { points, max: 5 }, comment: `${name} ok` })
const graded: MtGradedResult = {
  kind: "graded",
  level: "B1",
  score: { points: 16, max: 20 },
  summary: "Gut gemacht, das ist B1.",
  criteria: [crit("Aufgabe", 4), crit("Kommunikation", 4), crit("Wortschatz", 4), crit("Strukturen", 4)],
  modelAnswer: "Liebe Frau …",
  offTopic: false,
}

describe("lockGrade", () => {
  it("shows the first half of the criteria and only names the rest", () => {
    const locked = lockGrade(graded)
    expect(locked.shown.map((c) => c.name)).toEqual(["Aufgabe", "Kommunikation"])
    expect(locked.shown[0].comment).toBe("Aufgabe ok")
    expect(locked.locked).toEqual(["Wortschatz", "Strukturen"])
  })

  it("leaves out the level, the total, the summary and the model answer", () => {
    const text = JSON.stringify(lockGrade(graded))
    expect(text).not.toContain("B1")
    expect(text).not.toContain("16")
    expect(text).not.toContain("Liebe Frau")
  })

  it("shows at least one criterion", () => {
    expect(lockGrade({ ...graded, criteria: [crit("Aufgabe", 3)] }).shown).toHaveLength(1)
  })
})

const track: HoerTrack = {
  src: "x.mp3",
  duration: 1500,
  cues: [
    { teil: 1, phase: "instruction", items: [], from: 0, to: 30 },
    { teil: 1, phase: "clip", items: [1], from: 30, to: 300 },
    { teil: 2, phase: "clip", items: [6], from: 300, to: 700 },
    { teil: 3, phase: "instruction", items: [], from: 700, to: 720 },
    { teil: 3, phase: "clip", items: [11], from: 720, to: 1100 },
    { teil: 4, phase: "clip", items: [16], from: 1100, to: 1500 },
  ],
}

describe("trimTrack", () => {
  it("ends the track where the first locked Teil begins", () => {
    const t = trimTrack(track, 2)
    expect(t.cues.map((c) => c.teil)).toEqual([1, 1, 2])
    expect(t.duration).toBe(700)
  })
})

describe("resumeFrom", () => {
  it("starts the track at the first cue after the free Teile", () => {
    expect(resumeFrom(track, 2)).toBe(700)
  })
})
