// Modelltest content files (data/modelltest/<exam>/<skill>-NN.json). Blocks reuse the free-test block shape, so the
// exam components render them unchanged; `key` stays server-only exactly as in lib/exam/kurztest.ts.

import type { KurztestBlock, SpeakingTurn } from "@/lib/exam/kurztest"
import type { PartId } from "@/lib/exam/types"
import type { ExamId } from "@/lib/exams"

/** Sound design under or before a clip (research/dtz-blueprint.md §2.1). */
export type SoundKey = "beep" | "gong" | "station" | "store" | "radio" | "train"

/**
 * `example`: the block is a Teil's Beispiel with its own clip or text.
 * `exampleAnswers`: the solutions of the block's Beispiel items (n = 0), in order. A Beispiel is printed solved in the
 * real exam, so its answer is not part of the server-only key.
 */
export type MtBlock = Omit<KurztestBlock, "display" | "key"> & {
  example?: boolean
  sound?: SoundKey
  exampleAnswers?: string[]
  display: Omit<KurztestBlock["display"], "speaking"> & { speaking?: MtSpeaking }
  key: KurztestBlock["key"] & { live?: MtLive }
}

/** Sprechen: the official order of a pair exam. DTZ: 1A–3 (research/dtz-blueprint.md §5); telc B1: one phase per Teil. */
export type SpeakPhase = "1A" | "1B" | "2A" | "2B" | "3" | "1" | "2"
/**
 * One turn of the Sprechen run. `du` turns carry a hint in `text` and a speaking time in `seconds`.
 * `live`: generated during the run (examiner follow-up, Teil 3 partner); `text`/`src` are the pre-rendered fallback.
 */
export type MtSpeakTurn = SpeakingTurn & { phase: SpeakPhase; live?: "followup" | "partner"; seconds?: number }
/** A Pexels photo, re-encoded into our Storage. Pexels asks for a photographer credit and a link. */
export type MtPhoto = { query: string; alt: string; src?: string; credit?: { name: string; url: string; pexelsId: number } }
export type MtSpeaking = Omit<NonNullable<KurztestBlock["display"]["speaking"]>, "turns"> & {
  turns: MtSpeakTurn[]
  photos?: { du: MtPhoto; partner: MtPhoto }
}
/** Server-only material for the live turns: the follow-up bank, the partner's persona and fallback lines. */
export type MtLiveLine = { text: string; level?: "A2" | "B1"; sample?: string; src?: string; duration?: number }
export type MtLive = { followups?: MtLiveLine[]; persona?: string; partnerLines?: MtLiveLine[] }

/** Hören: one continuous track per set, as in the real exam. `cues` tell the runner which items to show when. */
export type TrackCue = { teil: number; phase: "instruction" | "reading" | "clip" | "answer"; items: number[]; from: number; to: number }
export type HoerTrack = { src: string; duration: number; cues: TrackCue[] }

export type MtSet = {
  exam: ExamId
  skill: PartId
  number: number
  title: string
  blocks: MtBlock[]
  track?: HoerTrack
}
