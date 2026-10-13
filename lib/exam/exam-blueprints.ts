// Part specs for the non-DTZ free tests, one file per exam in ./exams (from research/<exam>.md).
// Each exam file holds what its free test needs: context for the generator, part specs, the drafted plan,
// Schreiben/Sprechen tasks, the Schreiben rubric and the 5-minute taster.

import type { ExamId } from "@/lib/exams"
import type { KurztestPlan, OpenSpec, PartSpec, Taster } from "./blueprint"
import { spec as startDeutsch1 } from "./exams/start-deutsch-1"
import { spec as oesdA1 } from "./exams/oesd-a1"
import { spec as goetheA2 } from "./exams/goethe-a2"
import { spec as telcA2 } from "./exams/telc-a2"
import { spec as oesdA2 } from "./exams/oesd-a2"
import { spec as goetheB1 } from "./exams/goethe-b1"
import { spec as oesdB1 } from "./exams/oesd-b1"
import { spec as telcB1 } from "./exams/telc-b1"

export type ExamContext = { name: string; level: string; setting: string; copyright: string }

/** One rubric line. `steps`: the allowed scores as shares of `max`, highest first (default full / half / zero). */
export type RubricLine = { name: string; max: number; teil?: number; steps?: number[] }

export type ExamSpec = {
  context: ExamContext
  parts: PartSpec[]
  /** What the generator drafts per Teil; at least what the taster shows. */
  kurztest?: KurztestPlan
  open?: OpenSpec[]
  rubric?: { schreiben: RubricLine[] }
  taster?: Taster
}

type OtherExam = Exclude<ExamId, "dtz">

const SPECS: Record<OtherExam, ExamSpec> = {
  "start-deutsch-1": startDeutsch1,
  "oesd-a1": oesdA1,
  "goethe-a2": goetheA2,
  "telc-a2": telcA2,
  "oesd-a2": oesdA2,
  "goethe-b1": goetheB1,
  "oesd-b1": oesdB1,
  "telc-b1": telcB1,
}

const pick = <K extends keyof ExamSpec>(k: K) =>
  Object.fromEntries(Object.entries(SPECS).filter(([, s]) => s[k]).map(([id, s]) => [id, s[k]])) as Partial<Record<ExamId, NonNullable<ExamSpec[K]>>>

export const EXAM_CONTEXT = Object.fromEntries(Object.entries(SPECS).map(([id, s]) => [id, s.context])) as Record<OtherExam, ExamContext>
export const EXAM_PARTS = pick("parts")
export const EXAM_KURZTEST = pick("kurztest")
export const EXAM_OPEN = pick("open")
/** Points-scored rubrics (research/<exam>.md). Sprechen is not scored in the free test: answers are only transcribed,
 * next to a sample answer (Hannes, 2026-10-12: cheapest option). */
export const EXAM_RUBRICS = pick("rubric")
export const EXAM_TASTER = pick("taster")
