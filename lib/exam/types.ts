// Shapes the exam components render. Solutions never live on an item: they reach the UI
// only as a `review` prop after grading (CLAUDE.md §8, scoring keys stay server-side).

import type { LucideIcon } from "lucide-react"

export type PartId = "hoeren" | "lesen" | "schreiben" | "sprechen"
export type Scene = PartId | "intro" | "ergebnis"
export type Level = "B1" | "A2" | "unter A2"

export type Option = { key: string; label: string }
/** A picture option: an image, an icon, or a pictogram key from lib/exam/pictos.ts. */
export type PictureOption = Option & { image?: string; icon?: LucideIcon; picto?: string }

export type Speaker = { name: string; tone: string }
export type AudioClip = {
  src?: string
  duration: number
  plays: 1 | 2
  situation: string
  speakers: Record<string, Speaker>
  segments: { speaker: string; from: number; to: number }[]
  /** A narrator sentence that sets the scene before the clip (telc Hören Teil 3: "Sie rufen in einer Praxis an."). */
  lead?: string
}

export type ChoiceData = { n: number; prompt: string; options: Option[] }
/** `labels`: the two answers as the exam prints them (Goethe Hören Teil 4, Lesen Teil 4: "Ja" / "Nein"); stored as richtig / falsch. */
export type TrueFalseData = { n: number; statement: string; labels?: [string, string] }
export type PictureData = { n: number; prompt: string; options: PictureOption[] }
/** `image` on an option: a photo to match (Goethe A2 Hören Teil 2). `noMatchLabel`: how the exam prints "no match"
 * (Goethe B1 "0", Goethe A2 "X"); the answer is stored as "x". */
export type MatchData = {
  /** `picto` on an ad: a pictogram or sign to match (ÖSD A1 Lesen Aufgabe 3), printed without its label. */
  ads: { key: string; title: string; text: string; image?: string; picto?: string }[]
  /** `origin`: the source line printed above a text ("aus einer österreichischen Zeitung", ÖSD A2 Lesen Aufgabe 1);
   * `table`: a small table inside the text, as rows of cells (first row = header). */
  situations: { n: number; text: string; origin?: string; table?: string[][] }[]
  noMatchLabel?: string
  /** "textNumber": the photos are printed and the candidate writes the text number under one (ÖSD A1 Hören Aufgabe 1). */
  layout?: "textNumber"
}
/** A gap with no options is typed (forms, phone notes); `sheet` names a form or note instead of a letter.
 * `pick` on a gap with options: tick that many boxes (ÖSD A1 form, 2 of 4); the answer is the ticked options joined by
 * "," in option order, and the group is worth `pick` points. */
export type GapData = { parts: (string | { n: number; options: string[]; pick?: number })[]; sheet?: "Formular" | "Notiz" }
/** A tick grid (ÖSD Hören Aufgabe 3): one row per item, the same columns for every row. `multi`: several ticks per row
 * (ÖSD A2), stored as the column keys joined by "," in column order. */
export type GridData = { title?: string; columns: Option[]; rows: { n: number; text: string }[]; multi?: boolean }
/** Mark exactly `pick` of the boxes (ÖSD A2 Hören Aufgabe 1); the boxes carry the items `ns`. Every item of the group
 * stores the same value: the marked keys joined by "," in box order. */
export type MarkData = { title: string; options: Option[]; pick: number; ns: number[] }
/** Joined multi-tick answers ("b,d") and back. */
export const ticks =(v?: string | null) => (v ? v.split(",").map((s) => s.trim()).filter(Boolean) : [])

export type TrueFalse = "richtig" | "falsch"

export type Evidence = { text: string; hit: string }

export type ReadingData = { sender: string; source: string; paragraphs: string[] }

/** `opener`: what the answer sheet already prints before the candidate writes (ÖSD: "AW: …", salutation, first lines). */
export type WritingOption = { key: string; title: string; situation: string; points: string[]; opener?: string }

export type Person = { name: string; initial: string; tone: string }
export type Turn = { who: "pruefer" | "partner" | "du"; text: string }
/** `cards`: the drawn task cards (Start Deutsch: topic + keyword, or a pictogram for a request). */
export type SpeakingData = {
  part: string
  title: string
  task: string
  points: string[]
  cards?: { label: string; picto?: string }[]
  /** ÖSD: talk about `choose` of the `points` (A1 4 of 6, A2 5 of 6). */
  choose?: number
  /** ÖSD A1 Aufgabe 2–3: photos to choose one from, each with the two roles of its role-play. */
  scenes?: { key: string; label: string; image?: string; roles?: [string, string] }[]
  /** ÖSD A2 Aufgabe 2: the picture sheet the plan is made on. */
  sheet?: PlanSheet
}
/** A planning sheet with picture prompts per question row (ÖSD A2 Sprechen Aufgabe 2) and an open "noch etwas?" box. */
export type PlanSheet = { title: string; rows: { label: string; pictures: { label: string; picto?: string; image?: string }[] }[]; more?: string }

export type OverviewItem = { n: number; state: "open" | "done" | "current" }

export type ItemMark = { n: number; right: boolean }
/** Points scored against a maximum, for exams that report points and pass/fail (Goethe, telc, ÖSD). */
export type Score = { points: number; max: number }
/** A criterion carries a level (DTZ) or points (exams scored in points). */
export type CriterionResult = { name: string; level?: Level; points?: Score; comment: string; quote?: { yours: string; better: string } }
export type PartResult = {
  part: PartId
  name: string
  /** DTZ: the scaled level. Points-scored exams set `score` and `passed` instead. */
  level?: Level
  score?: Score
  passed?: boolean
  teile?: { label: string; items: ItemMark[] }[]
  criteria?: CriterionResult[]
}
export type ReviewEntry = { n: number; part: string; prompt: string; yours: string; solution: string; href?: string }
