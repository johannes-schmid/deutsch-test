"use server"

import { isExam } from "@/lib/kurztest/data"
import type { PartId } from "@/lib/exam/types"
import { gradeDtzWriting, gradeTelcWriting, RUBRIC_VERSION, TELC_RUBRIC_VERSION, type MtGradedResult } from "@/lib/modelltest/grade"
import { loadKeyedBlocks, loadRunnerSet, scoreClosed, type MtClosedResult } from "@/lib/modelltest/runner"
import { gradeSpeaking, type MtSpeakingResult } from "@/lib/modelltest/speaking"
import { emptyState, phasesDone, playedBefore, type RunState } from "@/lib/modelltest/sprechen-run"
import { createAdminClient } from "@/lib/supabase/admin"
import { getSessionUser } from "@/lib/supabase/server"

type Fail = { ok: false; error: "auth" | "access" | "attempt" | "limit" | "failed" }
export type StartResult = { ok: true; attemptId: string } | Fail
export type ClosedSubmit = { ok: true; result: MtClosedResult } | Fail
export type WritingSubmit = { ok: true; result: MtGradedResult } | Fail
export type SpeakingSubmit = { ok: true; result: MtSpeakingResult } | Fail

const SKILLS: PartId[] = ["hoeren", "lesen", "schreiben", "sprechen"]
const MAX_TEXT = 3000
/** Graded Schreiben runs per user per UTC day (Claude credits, CLAUDE.md §8). */
const WRITING_PER_DAY = Number(process.env.MT_WRITING_PER_DAY ?? 6)
/** Graded Sprechen runs per user per UTC day. */
const SPEAKING_PER_DAY = Number(process.env.MT_SPEAKING_PER_DAY ?? 3)

export async function startAttempt(exam: string, skill: string, n: number): Promise<StartResult> {
  const user = await getSessionUser()
  if (!user) return { ok: false, error: "auth" }
  if (!isExam(exam) || !SKILLS.includes(skill as PartId) || !Number.isInteger(n)) return { ok: false, error: "access" }
  const access = await loadRunnerSet(exam, skill as PartId, n, user.id)
  if (!access.ok) return { ok: false, error: "access" }
  const { data, error } = await createAdminClient().from("mt_attempts").insert({ user_id: user.id, set_id: access.set.id, exam, skill, number: n }).select("id").single()
  if (error) return { ok: false, error: "failed" }
  return { ok: true, attemptId: data.id }
}

type Attempt = { id: string; user_id: string; set_id: string; exam: string; skill: PartId; completed_at: string | null }

/** The caller's own attempt, still open. */
async function openAttempt(attemptId: string, skill: PartId[]) {
  const user = await getSessionUser()
  if (!user) return { error: "auth" as const }
  if (!/^[0-9a-f-]{36}$/.test(attemptId)) return { error: "attempt" as const }
  const { data } = await createAdminClient().from("mt_attempts").select("id, user_id, set_id, exam, skill, completed_at").eq("id", attemptId).maybeSingle()
  const a = data as Attempt | null
  if (!a || a.user_id !== user.id || a.completed_at || !skill.includes(a.skill) || !isExam(a.exam)) return { error: "attempt" as const }
  return { attempt: a as Attempt & { exam: Parameters<typeof scoreClosed>[2] }, user }
}

export async function submitClosed(attemptId: string, answers: Record<string, string>): Promise<ClosedSubmit> {
  const o = await openAttempt(attemptId, ["lesen", "hoeren"])
  if ("error" in o) return { ok: false, error: o.error! }
  const clean: Record<number, string> = {}
  for (const [k, v] of Object.entries(answers ?? {})) if (/^\d{1,2}$/.test(k) && Number(k) > 0 && typeof v === "string" && v.length <= 60) clean[Number(k)] = v
  try {
    const result = await scoreClosed(o.attempt.id, o.attempt.set_id, o.attempt.exam, o.attempt.skill, clean)
    const { error } = await createAdminClient().from("mt_attempts").update({ completed_at: new Date().toISOString(), score: result.points?.points ?? result.correct, max_score: result.points?.max ?? result.total, result: { level: result.level, correct: result.correct, total: result.total, ...(result.points ? { points: result.points } : {}) } }).eq("id", o.attempt.id)
    if (error) throw error
    return { ok: true, result }
  } catch (e) {
    console.error("modelltest scoring failed", e instanceof Error ? e.message : e)
    return { ok: false, error: "failed" }
  }
}

export async function submitWriting(attemptId: string, taskKey: string, text: string): Promise<WritingSubmit> {
  const o = await openAttempt(attemptId, ["schreiben"])
  if ("error" in o) return { ok: false, error: o.error! }
  const db = createAdminClient()
  const since = `${new Date().toISOString().slice(0, 10)}T00:00:00Z`
  const { count } = await db.from("mt_attempts").select("id", { count: "exact", head: true }).eq("user_id", o.user.id).eq("skill", "schreiben").gte("graded_at", since)
  if ((count ?? 0) >= WRITING_PER_DAY) return { ok: false, error: "limit" }
  try {
    const [{ rowId, block }] = await loadKeyedBlocks(o.attempt.set_id, o.attempt.exam, "schreiben")
    const task = block.display.writing?.find((t) => t.key === taskKey)
    const model = block.key.writing?.find((m) => m.key === taskKey)
    if (!task || !model) return { ok: false, error: "attempt" }
    const body = String(text ?? "").slice(0, MAX_TEXT)
    const telc = o.attempt.exam === "telc-b1"
    const result = await (telc ? gradeTelcWriting : gradeDtzWriting)(task, model.modelAnswer, model.register, body)
    const now = new Date().toISOString()
    const sub = await db.from("mt_submissions").insert({ attempt_id: o.attempt.id, task_id: rowId, turn: 0, text: body, rubric_version: telc ? TELC_RUBRIC_VERSION : RUBRIC_VERSION })
    if (sub.error) throw sub.error
    const { error } = await db.from("mt_attempts").update({ completed_at: now, graded_at: now, score: result.score.points, max_score: result.score.max, result: { level: result.level, score: result.score, task: taskKey, grade: result } }).eq("id", o.attempt.id)
    if (error) throw error
    return { ok: true, result }
  } catch (e) {
    console.error("modelltest writing grade failed", e instanceof Error ? e.message : e)
    await db.from("mt_attempts").update({ grade_error: e instanceof Error ? e.message.slice(0, 200) : "failed" }).eq("id", o.attempt.id)
    return { ok: false, error: "failed" }
  }
}

/** Ends a Sprechen run: adds the lines played after the last answer, grades the whole talk on the official points. */
export async function finishSpeaking(attemptId: string): Promise<SpeakingSubmit> {
  const o = await openAttempt(attemptId, ["sprechen"])
  if ("error" in o) return { ok: false, error: o.error! }
  const db = createAdminClient()
  const since = `${new Date().toISOString().slice(0, 10)}T00:00:00Z`
  const { count } = await db.from("mt_attempts").select("id", { count: "exact", head: true }).eq("user_id", o.user.id).eq("skill", "sprechen").gte("graded_at", since)
  if ((count ?? 0) >= SPEAKING_PER_DAY) return { ok: false, error: "limit" }
  try {
    const { data } = await db.from("mt_attempts").select("conversation").eq("id", o.attempt.id).single()
    const state = (data?.conversation as RunState | null) ?? emptyState()
    const keyed = await loadKeyedBlocks(o.attempt.set_id, o.attempt.exam, "sprechen")
    for (const { block } of keyed) if (state.upTo[block.teil] !== undefined) state.lines.push(...playedBefore(state, block, block.display.speaking!.turns.length))
    const partner = keyed[0]?.block.display.speaking?.people.partner.name ?? "Partner"
    const result = await gradeSpeaking(state.lines, partner, phasesDone(state.lines))
    const now = new Date().toISOString()
    const { error } = await db.from("mt_attempts").update({ completed_at: now, graded_at: now, score: result.score.points, max_score: result.score.max, conversation: state, result: { level: result.level, score: result.score, grade: result } }).eq("id", o.attempt.id)
    if (error) throw error
    return { ok: true, result }
  } catch (e) {
    console.error("modelltest speaking grade failed", e instanceof Error ? e.message : e)
    await db.from("mt_attempts").update({ grade_error: e instanceof Error ? e.message.slice(0, 200) : "failed" }).eq("id", o.attempt.id)
    return { ok: false, error: "failed" }
  }
}
