import "server-only"
import { requireAdmin } from "@/lib/admin/guard"
import { createAdminClient } from "@/lib/supabase/admin"
import type { ConvoLine } from "./speaking"
import type { MtBlock, SpeakPhase } from "./types"

// Server state of one Sprechen run, kept in mt_attempts.conversation: the lines as played (pre-rendered or live)
// and the candidate's transcripts, in order. The browser never sends text that ends up in the transcript.

/** `rescued`: turns where the examiner already stepped in (telc), as "teil-turn". */
export type RunState = { lines: ConvoLine[]; live: Record<string, string>; upTo: Record<string, number>; rescued?: string[] }

export const emptyState = (): RunState => ({ lines: [], live: {}, upTo: {} })

/** The lines between the last recorded turn and turn `i` of a block, using live text where one was generated. */
export function playedBefore(state: RunState, block: MtBlock, i: number): ConvoLine[] {
  const turns = block.display.speaking!.turns
  const from = (state.upTo[block.teil] ?? -1) + 1
  return turns.slice(from, i).filter((t) => t.who !== "du").map((t, j) => ({ teil: block.teil, phase: t.phase, who: t.who, text: state.live[`${block.teil}-${from + j}`] ?? t.text }))
}

/**
 * The Teil's time is up (telc): records the lines played before turn `from`, then skips to the examiner's closing line,
 * so the transcript never contains turns that were not played.
 */
export function skipTo(state: RunState, block: MtBlock, from: number) {
  const turns = block.display.speaking!.turns
  const close = turns.length - 1
  if (from >= close) return
  state.lines.push(...playedBefore(state, block, from))
  state.upTo[block.teil] = close - 1
}

/** Free Modelltest Sprechen: seconds recorded so far by this user on free sets (FREE_SPEAKING_SECONDS caps it). */
export async function freeSecondsUsed(userId: string) {
  const db = createAdminClient()
  const { data, error } = await db.from("mt_submissions").select("audio_seconds, mt_attempts!inner(user_id, mt_sets!inner(is_free, skill))").eq("mt_attempts.user_id", userId).eq("mt_attempts.mt_sets.is_free", true).eq("mt_attempts.mt_sets.skill", "sprechen")
  if (error) throw error
  return (data as { audio_seconds: number | null }[]).reduce((n, r) => n + Number(r.audio_seconds ?? 0), 0)
}

export const FREE_SPEAKING_SECONDS = Number(process.env.FREE_SPEAKING_SECONDS ?? 300)

/** Admins test without the free cap. */
export const capped = async (free: boolean) => free && !(await requireAdmin())

export const phasesDone = (lines: ConvoLine[]): SpeakPhase[] => [...new Set(lines.filter((l) => l.who === "du" && l.text.trim()).map((l) => l.phase))]
