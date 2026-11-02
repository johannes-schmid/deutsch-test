// Modelltest 1 without a pass: the first half is free (Hannes, 2026-11-02). Pure rules, shared by server and runner.
import type { CriterionResult } from "@/lib/exam/types"
import type { HoerTrack } from "./types"

/** `teile`: the first `upTo` Teile are free. `feedback`: a single task (DTZ/telc B1 letter) is written in full; half of its criteria show. */
export type FreePart = { mode: "teile"; upTo: number } | { mode: "feedback" }

/** The free share of a set from its blocks' Teil numbers: the first half of the Teile, rounded down. */
export function freePart(teile: number[]): FreePart {
  const sorted = [...new Set(teile)].sort((a, b) => a - b)
  if (sorted.length < 2) return { mode: "feedback" }
  return { mode: "teile", upTo: sorted[Math.floor(sorted.length / 2) - 1] }
}

export function keepFreeAnswers(answers: Record<number, string>, free: Set<number>): Record<number, string> {
  return Object.fromEntries(Object.entries(answers).filter(([n]) => free.has(Number(n))))
}

/** What a learner without a pass sees of a graded letter: the first half of the criteria; no level, total, summary or model answer. */
export type LockedGrade = { shown: CriterionResult[]; locked: string[] }

export function lockGrade(result: { criteria: CriterionResult[] }): LockedGrade {
  const k = Math.max(1, Math.floor(result.criteria.length / 2))
  return { shown: result.criteria.slice(0, k).map(({ name, points, comment, quote }) => ({ name, comment, ...(points ? { points } : {}), ...(quote ? { quote } : {}) })), locked: result.criteria.slice(k).map((c) => c.name) }
}

/** The Hören track up to the end of the free Teile. */
export function trimTrack(track: HoerTrack, upTo: number): HoerTrack {
  const cues = track.cues.filter((c) => c.teil <= upTo)
  return { ...track, cues, duration: resumeFrom(track, upTo) }
}

/** Where the track goes on after the free Teile. */
export function resumeFrom(track: HoerTrack, upTo: number): number {
  return track.cues.find((c) => c.teil > upTo)?.from ?? track.duration
}
