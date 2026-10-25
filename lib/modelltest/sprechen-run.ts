import "server-only"
import { requireAdmin } from "@/lib/admin/guard"
import { createAdminClient } from "@/lib/supabase/admin"
import type { ConvoLine } from "./speaking"
import type { MtBlock, SpeakPhase } from "./types"

// Server state of one Sprechen run, kept in mt_attempts.conversation: the lines as played (pre-rendered or live)
// and the candidate's transcripts, in order. The browser never sends text that ends up in the transcript.

/** What the candidate picked on the sheets: the topics to talk about (ÖSD), the photo and the role (ÖSD A1). */
export type RunChoice = { topics?: string[]; scene?: string; role?: string }

/** `rescued`: turns where the examiner already stepped in (telc), as "teil-turn". */
export type RunState = { lines: ConvoLine[]; live: Record<string, string>; upTo: Record<string, number>; rescued?: string[]; choice?: RunChoice }

export const emptyState = (): RunState => ({ lines: [], live: {}, upTo: {} })

/** The lines between the last recorded turn and turn `i` of a block, using live text where one was generated. */
export function playedBefore(state: RunState, block: MtBlock, i: number): ConvoLine[] {
  const turns = block.display.speaking!.turns
  const from = (state.upTo[block.teil] ?? -1) + 1
  return turns.slice(from, i).filter((t) => t.who !== "du").map((t, j) => ({ teil: block.teil, phase: t.phase, who: t.who, text: state.live[`${block.teil}-${from + j}`] ?? t.text }))
}

/**
 * The first live turn after candidate turn `turn` of `teil`, before the candidate speaks again. With `cross` it may sit in
 * the next Teil (Goethe/ÖSD B1: the partner's feedback on the presentation comes after the examiner's lines between the
 * Teile); elsewhere a new Teil opens with its pre-rendered line, never with a reaction to the last Teil.
 */
export function nextLive(blocks: MtBlock[], teil: number, turn: number, cross = false): { block: MtBlock; index: number } | null {
  const at = blocks.findIndex((b) => b.teil === teil)
  for (let j = at; j >= 0 && j < blocks.length && (j === at || cross); j++) {
    const turns = blocks[j].display.speaking?.turns ?? []
    for (let i = j === at ? turn + 1 : 0; i < turns.length; i++) {
      if (turns[i].who === "du") return null
      if (turns[i].live) return { block: blocks[j], index: i }
    }
  }
  return null
}

/** Keeps only picks that exist on the set's sheets. */
export function cleanChoice(blocks: MtBlock[], raw: { topics?: unknown; scene?: unknown; role?: unknown }, prev: RunChoice = {}): RunChoice {
  const data = blocks.map((b) => b.display.speaking?.data)
  const topics = Array.isArray(raw.topics) ? raw.topics.filter((t): t is string => typeof t === "string" && data.some((d) => d?.points.includes(t))).slice(0, 6) : prev.topics
  const scenes = data.flatMap((d) => d?.scenes ?? [])
  const scene = typeof raw.scene === "string" && scenes.some((s) => s.key === raw.scene) ? raw.scene : prev.scene
  const roles = scenes.find((s) => s.key === scene)?.roles ?? []
  const role = typeof raw.role === "string" && (roles as string[]).includes(raw.role) ? raw.role : prev.role && (roles as string[]).includes(prev.role) ? prev.role : undefined
  return { ...(topics?.length ? { topics } : {}), ...(scene ? { scene } : {}), ...(role ? { role } : {}) }
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

/** Scribe tags sounds in brackets ("[Ticken]", "[outro jingle]"); they are not speech and never reach a prompt. */
export const spokenOnly = (text: string) => text.replace(/\[[^\]]*\]/g, " ").replace(/\s+/g, " ").trim()

export const phasesDone = (lines: ConvoLine[]): SpeakPhase[] => [...new Set(lines.filter((l) => l.who === "du" && l.text.trim()).map((l) => l.phase))]
