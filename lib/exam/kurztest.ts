// Kurztest draft files (data/kurztest/drafts/*.json).
// `display` renders straight into components/exam. `key` is the scoring key and the
// transcript: server-only, it reaches the UI only as a `review` prop after unlocking.

import type { ExamId } from "@/lib/exams"
import type { AudioClip, ChoiceData, Evidence, GapData, GridData, MarkData, MatchData, PartId, Person, PictureData, ReadingData, SpeakingData, TrueFalse, TrueFalseData, Turn, WritingOption } from "./types"

export type KurztestItem =
  | { type: "choice"; item: ChoiceData }
  | { type: "picture"; item: PictureData }
  | { type: "rf"; item: TrueFalseData }
  | { type: "match"; data: MatchData; noMatch: boolean }
  | { type: "gap"; data: GapData }
  | { type: "grid"; data: GridData }
  | { type: "marks"; data: MarkData }

/** `explanationDe` is the German original, set when `explanation` was swapped for a translation. `accept`: other right forms of a typed answer.
 * `exact`: a typed answer that must be spelled exactly (ÖSD: a spelled name, a phone number). */
export type ItemKey = { n: number; correct: string | TrueFalse; explanation: string; explanationDe?: string; evidence?: Evidence; accept?: string[]; exact?: boolean }

/** `item`: in a Modelltest Hören Teil 4, the statement this turn is (0 = Beispiel); unset for the host intro. */
/** `clip`: in a block that carries several clips (ÖSD Hören: five dialogues, five interview answers, two radio texts), the
 * clip this turn belongs to (1…n); unset for a turn outside the clips (the interviewer's question). `sound`: the sound
 * cue that opens this clip (a SoundKey of lib/modelltest/types.ts). */
export type ScriptTurn = { speaker: string; voice: string; text: string; delivery?: string; item?: number; clip?: number; sound?: string }

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
    /** Start Deutsch 1 Hören Teil 1: what each picture option should show, for the drawings that replace the pictograms. */
    pictureBrief?: string
  }
}

/** Item numbers a block carries, in order. */
export const itemNumbers = (items: KurztestItem[]) =>
  items.flatMap((it) =>
    it.type === "match" ? it.data.situations.map((s) => s.n)
    : it.type === "gap" ? it.data.parts.flatMap((p) => (typeof p === "string" ? [] : [p.n]))
    : it.type === "grid" ? it.data.rows.map((r) => r.n)
    : it.type === "marks" ? it.data.ns
    : [it.item.n]
  )
