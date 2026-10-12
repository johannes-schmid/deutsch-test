// Payloads between the Kurztest pages and /api/kurztest. Client-safe.

import type { ItemKey } from "@/lib/exam/kurztest"
import type { CriterionResult, ItemMark, Level, Score } from "@/lib/exam/types"
import type { ExamId } from "@/lib/exams"

type Base = { exam: ExamId; startedAt: string; utm?: Record<string, string> }

export type SubmitBody =
  | (Base & { skill: "lesen" | "hoeren"; answers: Record<number, string> })
  | (Base & { skill: "schreiben"; task: string; text: string })
  | (Base & { skill: "sprechen"; recorded: number })

/** DTZ results carry a level; points-scored exams carry a score and whether it reaches the pass mark. */
export type Outcome = { level?: Level; score?: Score; passed?: boolean }

export type ClosedResult = Outcome & {
  kind: "closed"
  correct: number
  total: number
  teile: { label: string; items: ItemMark[] }[]
  keys: ItemKey[]
  transcripts: Record<string, { speaker: string; text: string }[]>
}

export type GradedResult = Outcome & {
  kind: "graded"
  summary: string
  criteria: CriterionResult[]
  /** The model answer for the chosen task. */
  modelAnswer?: string
}

/** Sprechen: transcribed only, never scored. */
export type TranscriptResult = { kind: "transcript"; heard: { cue: string; text: string; sample: string }[] }

export type KurztestResult = ClosedResult | GradedResult | TranscriptResult

/** The label stored with an attempt and counted in the admin funnel. */
export const outcomeLabel = (o: Outcome) => o.level ?? (o.passed === undefined ? "offen" : o.passed ? "bestanden" : "nicht bestanden")

export const MAX_TEXT = 3000
export const MAX_RECORDING_SECONDS = 75
