import "server-only"
import { requireAdmin } from "@/lib/admin/guard"
import { ownsExam } from "@/lib/entitlements"
import { indicativeLevel } from "@/lib/exam/band"
import type { ItemKey } from "@/lib/exam/kurztest"
import type { PartId } from "@/lib/exam/types"
import type { ExamId } from "@/lib/exams"
import { createAdminClient } from "@/lib/supabase/admin"
import { ROW_COLUMNS, rowToBlock, tableOf, trackWithUrl, type Row } from "./rows"
import type { HoerTrack, MtBlock } from "./types"

/** What the browser may see during the test: no answers, evidence, transcripts, model answers or live material. */
export type PublicMtBlock = Pick<MtBlock, "id" | "skill" | "teil" | "display" | "example" | "exampleAnswers">

export type RunnerSet = { id: string; exam: ExamId; skill: PartId; number: number; seconds: number; preview: boolean; free: boolean; track: HoerTrack | null; blocks: PublicMtBlock[] }

export type Access = { ok: true; set: RunnerSet } | { ok: false; reason: "missing" | "locked" }

type SetRow = { id: string; is_free: boolean; published: boolean; duration_seconds: number | null; track: HoerTrack | null }

async function setRow(exam: ExamId, skill: PartId, n: number) {
  const { data, error } = await createAdminClient().from("mt_sets").select("id, is_free, published, duration_seconds, track").eq("exam", exam).eq("skill", skill).eq("number", n).maybeSingle()
  if (error) throw error
  return data as SetRow | null
}

/** A published set the user may open (free, owned, or an admin preview of an unpublished one), stripped for the browser. */
export async function loadRunnerSet(exam: ExamId, skill: PartId, n: number, userId: string): Promise<Access> {
  const [set, admin] = await Promise.all([setRow(exam, skill, n), requireAdmin()])
  if (!set || (!set.published && !admin)) return { ok: false, reason: "missing" }
  if (!set.is_free && !admin && !(await ownsExam(userId, exam))) return { ok: false, reason: "locked" }
  const { data, error } = await createAdminClient().from(tableOf(skill)).select(ROW_COLUMNS).eq("set_id", set.id).order("teil").order("sort_order")
  if (error) throw error
  const blocks = (data as Row[]).map((r) => rowToBlock(r, exam, skill)).map(({ id, skill, teil, display, example, exampleAnswers }) => ({ id, skill, teil, display, ...(example ? { example } : {}), ...(exampleAnswers ? { exampleAnswers } : {}) }))
  return {
    ok: true,
    set: { id: set.id, exam, skill, number: n, seconds: set.duration_seconds ?? 0, preview: !set.published, free: set.is_free, track: trackWithUrl(set.track), blocks },
  }
}

/** Full blocks with keys, for scoring and grading on the server only. */
export async function loadKeyedBlocks(setId: string, exam: ExamId, skill: PartId): Promise<{ rowId: string; block: MtBlock }[]> {
  const { data, error } = await createAdminClient().from(tableOf(skill)).select(ROW_COLUMNS).eq("set_id", setId).order("teil").order("sort_order")
  if (error) throw error
  return (data as Row[]).map((r) => ({ rowId: r.id, block: rowToBlock(r, exam, skill) }))
}

export type MtClosedResult = {
  kind: "closed"
  level: ReturnType<typeof indicativeLevel>
  correct: number
  total: number
  teile: { label: string; items: { n: number; right: boolean }[] }[]
  keys: ItemKey[]
  transcripts: Record<string, { speaker: string; text: string }[]>
}

type QuestionRow = { id: string; n: number; example: boolean; explanation: string | null; evidence: ItemKey["evidence"] | null; mt_stimuli: { teil: number }; mt_options: { label: string; is_correct: boolean }[] }

/**
 * Scores against mt_options (the reviewed truth), writes one mt_answers row per scored item and returns the result
 * with keys, explanations and transcripts: shown only after handing in.
 */
export async function scoreClosed(attemptId: string, setId: string, exam: ExamId, skill: PartId, answers: Record<number, string>): Promise<MtClosedResult> {
  const db = createAdminClient()
  const { data, error } = await db.from("mt_questions").select("id, n, example, explanation, evidence, mt_stimuli!inner(teil), mt_options(label, is_correct)").eq("set_id", setId).eq("example", false).order("n")
  if (error) throw error
  const qs = data as unknown as QuestionRow[]
  const keys: ItemKey[] = qs.map((q) => ({ n: q.n, correct: q.mt_options.find((o) => o.is_correct)?.label ?? "", explanation: q.explanation ?? "", ...(q.evidence ? { evidence: q.evidence } : {}) }))
  const right = (n: number) => answers[n] !== undefined && answers[n] === keys.find((k) => k.n === n)?.correct
  const { error: insErr } = await db.from("mt_answers").upsert(qs.map((q) => ({ attempt_id: attemptId, question_id: q.id, chosen: answers[q.n] ?? null, correct: right(q.n) })), { onConflict: "attempt_id,question_id" })
  if (insErr) throw insErr
  const teile = [...new Set(qs.map((q) => q.mt_stimuli.teil))].map((teil) => ({ label: `Teil ${teil}`, items: qs.filter((q) => q.mt_stimuli.teil === teil).map((q) => ({ n: q.n, right: right(q.n) })) }))
  const correct = keys.filter((k) => right(k.n)).length
  const transcripts = Object.fromEntries(
    (await loadKeyedBlocks(setId, exam, skill)).filter(({ block: b }) => b.key.script && b.display.clip).map(({ block: b }) => [b.id, b.key.script!.map((t) => ({ speaker: b.display.clip!.speakers[t.speaker]?.name ?? (t.speaker === "moderation" ? "Moderation" : t.speaker), text: t.text }))])
  )
  return { kind: "closed", level: indicativeLevel(correct, keys.length), correct, total: keys.length, teile, keys, transcripts }
}
