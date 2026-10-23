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
export type TrueFalseData = { n: number; statement: string }
export type PictureData = { n: number; prompt: string; options: PictureOption[] }
export type MatchData = {
  ads: { key: string; title: string; text: string }[]
  situations: { n: number; text: string }[]
}
/** A gap with no options is typed (forms, phone notes); `sheet` names a form or note instead of a letter. */
export type GapData = { parts: (string | { n: number; options: string[] })[]; sheet?: "Formular" | "Notiz" }

export type TrueFalse = "richtig" | "falsch"

export type Evidence = { text: string; hit: string }

export type ReadingData = { sender: string; source: string; paragraphs: string[] }

export type WritingOption = { key: string; title: string; situation: string; points: string[] }

export type Person = { name: string; initial: string; tone: string }
export type Turn = { who: "pruefer" | "partner" | "du"; text: string }
/** `cards`: the drawn task cards (Start Deutsch: topic + keyword, or a pictogram for a request). */
export type SpeakingData = { part: string; title: string; task: string; points: string[]; cards?: { label: string; picto?: string }[] }

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
