import "server-only"
import { requireAdmin } from "@/lib/admin/guard"
import { ownsExam } from "@/lib/entitlements"
import { indicativeLevel } from "@/lib/exam/band"
import { isStartExam, typedRight } from "@/lib/exam/scoring/start"
import { closedScore, type PartPoints } from "@/lib/exam/scoring/telc-b1"
import { isOesdExam, scoreOesdClosed, type OesdItem } from "@/lib/exam/scoring/oesd"
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

/** A published set the user may open (free or owned; admins too need the pass), or an admin preview of an unpublished one, stripped for the browser. */
export async function loadRunnerSet(exam: ExamId, skill: PartId, n: number, userId: string): Promise<Access> {
  const [set, admin] = await Promise.all([setRow(exam, skill, n), requireAdmin()])
  if (!set || (!set.published && !admin)) return { ok: false, reason: "missing" }
  if (set.published && !set.is_free && !(await ownsExam(userId, exam))) return { ok: false, reason: "locked" }
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
  /** Exams scored in points (telc B1 weighted; Start Deutsch 1 and telc A2 one point per item): per Teil and in all. */
  points?: { points: number; max: number; parts: PartPoints[] }
  transcripts: Record<string, { speaker: string; text: string }[]>
}

type QuestionRow = { id: string; n: number; example: boolean; explanation: string | null; evidence: ItemKey["evidence"] | null; mt_stimuli: { teil: number }; mt_options: { label: string; is_correct: boolean }[] }

/**
 * Scores against mt_options (the reviewed truth), writes one mt_answers row per scored item and returns the result
 * with keys, explanations and transcripts: shown only after handing in.
 */
export async function scoreClosed(attemptId: string, setId: string, exam: ExamId, skill: PartId, answers: Record<number, string>): Promise<MtClosedResult> {
  const db = createAdminClient()
  const [{ data, error }, blocks] = await Promise.all([
    db.from("mt_questions").select("id, n, example, explanation, evidence, mt_stimuli!inner(teil), mt_options(label, is_correct)").eq("set_id", setId).eq("example", false).order("n"),
    loadKeyedBlocks(setId, exam, skill),
  ])
  if (error) throw error
  const qs = data as unknown as QuestionRow[]
  // Typed answers (gaps without options) are scored with spelling tolerance against the key and its accepted forms.
  const typed = new Map<number, string[]>()
  for (const { block: b } of blocks)
    for (const it of b.display.items)
      if (it.type === "gap") for (const p of it.data.parts) if (typeof p !== "string" && !p.options.length) typed.set(p.n, b.key.answers.find((a) => a.n === p.n)?.accept ?? [])
  const keys: ItemKey[] = qs.map((q) => ({ n: q.n, correct: q.mt_options.find((o) => o.is_correct)?.label ?? "", explanation: q.explanation ?? "", ...(q.evidence ? { evidence: q.evidence } : {}), ...(typed.get(q.n)?.length ? { accept: typed.get(q.n) } : {}) }))
  // ÖSD: exact typed answers, multi-tick rows and mark-N-of-M groups, scored with the official tables.
  const oesd = isOesdExam(exam) && (skill === "lesen" || skill === "hoeren")
    ? (() => {
        const items: OesdItem[] = []
        const exact = new Set<number>()
        for (const { block: b } of blocks) {
          for (const a of b.key.answers) if (a.exact) exact.add(a.n)
          for (const it of b.display.items) {
            if (it.type === "grid") for (const r of it.data.rows) items.push({ n: r.n, kind: it.data.multi ? "row" : "plain", columns: it.data.columns.length })
            if (it.type === "marks") for (const n of it.data.ns) items.push({ n, kind: "marks", group: it.data.ns })
          }
        }
        for (const n of typed.keys()) items.push({ n, kind: "plain", typed: true })
        for (const k of keys) if (exact.has(k.n)) k.exact = true
        return scoreOesdClosed(exam, skill, items, keys, answers)
      })()
    : undefined
  const right = (n: number) => {
    if (oesd) return oesd.right.get(n) ?? false
    const k = keys.find((x) => x.n === n)
    if (answers[n] === undefined || !k) return false
    return typed.has(n) ? typedRight(answers[n], String(k.correct), typed.get(n)) : answers[n] === k.correct
  }
  const { error: insErr } = await db.from("mt_answers").upsert(qs.map((q) => ({ attempt_id: attemptId, question_id: q.id, chosen: answers[q.n] ?? null, correct: right(q.n) })), { onConflict: "attempt_id,question_id" })
  if (insErr) throw insErr
  const correct = keys.filter((k) => right(k.n)).length
  const byTeil = [...new Set(qs.map((q) => q.mt_stimuli.teil))].map((teil) => ({ teil, items: qs.filter((q) => q.mt_stimuli.teil === teil).map((q) => ({ n: q.n, right: right(q.n) })) }))
  const points = oesd
    ? { points: oesd.points, max: oesd.max, parts: oesd.parts }
    : exam === "telc-b1"
      ? closedScore(skill, new Set(keys.filter((k) => right(k.n)).map((k) => k.n)))
      : isStartExam(exam)
        ? (() => {
            const parts = byTeil.map((t) => ({ label: `Teil ${t.teil}`, points: t.items.filter((i) => i.right).length, max: t.items.length }))
            return { points: correct, max: keys.length, parts }
          })()
        : undefined
  const teile = byTeil.map((t, i) => ({ label: points?.parts[i]?.label ?? `Teil ${t.teil}`, items: t.items }))
  const transcripts = Object.fromEntries(
    blocks.filter(({ block: b }) => b.key.script && b.display.clip).map(({ block: b }) => [b.id, b.key.script!.map((t) => ({ speaker: b.display.clip!.speakers[t.speaker]?.name ?? (t.speaker === "moderation" ? "Moderation" : t.speaker), text: t.text }))])
  )
  return { kind: "closed", level: indicativeLevel(correct, keys.length), correct, total: keys.length, teile, keys, ...(points ? { points } : {}), transcripts }
}
