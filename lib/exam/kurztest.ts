// Kurztest draft files (data/kurztest/drafts/*.json).
// `display` renders straight into components/exam. `key` is the scoring key and the
// transcript: server-only, it reaches the UI only as a `review` prop after unlocking.

import type { ExamId } from "@/lib/exams"
import type { AudioClip, ChoiceData, Evidence, GapData, MatchData, PartId, Person, PictureData, ReadingData, SpeakingData, TrueFalse, TrueFalseData, Turn, WritingOption } from "./types"

export type KurztestItem =
  | { type: "choice"; item: ChoiceData }
  | { type: "picture"; item: PictureData }
  | { type: "rf"; item: TrueFalseData }
  | { type: "match"; data: MatchData; noMatch: boolean }
  | { type: "gap"; data: GapData }

/** `explanationDe` is the German original, set when `explanation` was swapped for a translation. */
export type ItemKey = { n: number; correct: string | TrueFalse; explanation: string; explanationDe?: string; evidence?: Evidence }

/** `item`: in a Modelltest Hören Teil 4, the statement this turn is (0 = Beispiel); unset for the host intro. */
export type ScriptTurn = { speaker: string; voice: string; text: string; delivery?: string; item?: number }

export type SpeakingTurn = Turn & { src?: string; duration?: number }

export type KurztestBlock = {
  id: string
  /** Absent on the DTZ drafts in data/kurztest/drafts. */
  exam?: ExamId
  skill: PartId
  teil: number
  status: "draft" | "reviewed"
  generated: { model: string; at: string; textType: string }
  display: {
    instruction: string
    reading?: ReadingData
    clip?: AudioClip
    items: KurztestItem[]
    writing?: WritingOption[]
    speaking?: { data: SpeakingData; people: Record<Turn["who"], Person>; turns: SpeakingTurn[] }
  }
  key: {
    answers: ItemKey[]
    script?: ScriptTurn[]
    writing?: { key: string; register: "formell" | "informell"; modelAnswer: string }[]
    speaking?: { voices: { pruefer: string; partner: string }; sampleAnswers: string[]; pictureBrief?: string }
    tts?: { model: string; characters: number; at: string }
  }
}

/** Item numbers a block carries, in order. */
export const itemNumbers = (items: KurztestItem[]) =>
  items.flatMap((it) =>
    it.type === "match" ? it.data.situations.map((s) => s.n) : it.type === "gap" ? it.data.parts.flatMap((p) => (typeof p === "string" ? [] : [p.n])) : [it.item.n]
  )
