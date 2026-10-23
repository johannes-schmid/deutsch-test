// The official telc Deutsch B1 scoring (telc Übungstest 1 Zertifikat Deutsch, 2020, p. 32–40; research/telc-b1.md §4).
// Points per item come from the official weights; the result is bestanden / nicht bestanden with a grade, never a level.

import type { PartId } from "@/lib/exam/types"

type Teil = { skill: "lesen" | "hoeren"; teil: number; label: string; first: number; items: number; perItem: number }

/** Each Teil is worth 25 points (Sprachbausteine 15); per-item points are the official weights. */
export const TELC_B1_TEILE: Teil[] = [
  { skill: "lesen", teil: 1, label: "Leseverstehen Teil 1", first: 1, items: 5, perItem: 5 },
  { skill: "lesen", teil: 2, label: "Leseverstehen Teil 2", first: 6, items: 5, perItem: 5 },
  { skill: "lesen", teil: 3, label: "Leseverstehen Teil 3", first: 11, items: 10, perItem: 2.5 },
  { skill: "lesen", teil: 4, label: "Sprachbausteine Teil 1", first: 21, items: 10, perItem: 1.5 },
  { skill: "lesen", teil: 5, label: "Sprachbausteine Teil 2", first: 31, items: 10, perItem: 1.5 },
  { skill: "hoeren", teil: 1, label: "Hörverstehen Teil 1", first: 41, items: 5, perItem: 5 },
  { skill: "hoeren", teil: 2, label: "Hörverstehen Teil 2", first: 46, items: 10, perItem: 2.5 },
  { skill: "hoeren", teil: 3, label: "Hörverstehen Teil 3", first: 56, items: 5, perItem: 5 },
]

export type PartPoints = { label: string; points: number; max: number }

/** Points of a closed subtest from the item numbers answered right. */
export function closedScore(skill: PartId, right: Set<number>) {
  const parts: PartPoints[] = TELC_B1_TEILE.filter((t) => t.skill === skill).map((t) => {
    const hits = Array.from({ length: t.items }, (_, i) => t.first + i).filter((n) => right.has(n)).length
    return { label: t.label, points: hits * t.perItem, max: t.items * t.perItem }
  })
  return { points: parts.reduce((n, p) => n + p.points, 0), max: parts.reduce((n, p) => n + p.max, 0), parts }
}

export type Step = "A" | "B" | "C" | "D"

/** Schreiben criteria (p. 36–38): I Aufgabenbewältigung, II Kommunikative Gestaltung, III Formale Richtigkeit. */
export const TELC_B1_WRITING_CRITERIA = ["Aufgabenbewältigung", "Kommunikative Gestaltung", "Formale Richtigkeit"] as const
const WRITING_POINTS: Record<Step, number> = { A: 5, B: 3, C: 1, D: 0 }

/** Criterion I counts the Leitpunkte handled adequately: 4 → A, 3 → B, 2 → C, fewer → D. */
export const aufgabeStep = (leitpunkte: number): Step => (leitpunkte >= 4 ? "A" : leitpunkte === 3 ? "B" : leitpunkte === 2 ? "C" : "D")

/** Sum of the three criteria × 3 (max 45). "Thema verfehlt" is D on every criterion. */
export function writingScore(steps: [Step, Step, Step], offTopic = false) {
  const sum = offTopic ? 0 : steps.reduce((n, s) => n + WRITING_POINTS[s], 0)
  return { points: sum * 3, max: 45 }
}

/** Sprechen criteria per Teil (p. 32–35). */
export type SpeakingSteps = { ausdruck: Step; aufgabe: Step; formal: Step; aussprache: Step }
export const TELC_B1_SPEAKING_CRITERIA: Record<keyof SpeakingSteps, string> = {
  ausdruck: "Ausdrucksfähigkeit",
  aufgabe: "Aufgabenbewältigung",
  formal: "Formale Richtigkeit",
  aussprache: "Aussprache / Intonation",
}
const SPEAKING_POINTS: Record<1 | 2 | 3, { main: Record<Step, number>; aussprache: Record<Step, number> }> = {
  1: { main: { A: 4, B: 3, C: 1, D: 0 }, aussprache: { A: 3, B: 2, C: 1, D: 0 } },
  2: { main: { A: 8, B: 6, C: 2, D: 0 }, aussprache: { A: 6, B: 4, C: 2, D: 0 } },
  3: { main: { A: 8, B: 6, C: 2, D: 0 }, aussprache: { A: 6, B: 4, C: 2, D: 0 } },
}
/** Max per Teil: 15 / 30 / 30 = 75. */
export const TELC_B1_SPEAKING_MAX: Record<1 | 2 | 3, number> = { 1: 15, 2: 30, 3: 30 }

export function speakingTeilScore(teil: 1 | 2 | 3, s: SpeakingSteps) {
  const t = SPEAKING_POINTS[teil]
  return t.main[s.ausdruck] + t.main[s.aufgabe] + t.main[s.formal] + t.aussprache[s.aussprache]
}

/** Teilergebnis I (written) and II (oral). */
export const TELC_B1_MAX = { written: 225, oral: 75, total: 300 } as const
export const TELC_B1_PASS = { written: 135, oral: 45 } as const

export type TelcGrade = "sehr gut" | "gut" | "befriedigend" | "ausreichend" | "nicht bestanden"

/** p. 40: both parts need 60 %; only then the total is graded. */
export function telcB1Result({ written, oral }: { written: number; oral: number }) {
  const writtenPassed = written >= TELC_B1_PASS.written
  const oralPassed = oral >= TELC_B1_PASS.oral
  const total = written + oral
  const passed = writtenPassed && oralPassed
  const grade: TelcGrade = !passed ? "nicht bestanden" : total >= 270 ? "sehr gut" : total >= 240 ? "gut" : total >= 210 ? "befriedigend" : "ausreichend"
  return { written, oral, total, writtenPassed, oralPassed, passed, grade }
}
