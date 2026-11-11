"use server"

import { isExam } from "@/lib/kurztest/data"
import type { PartId } from "@/lib/exam/types"
import { isGoetheExam } from "@/lib/exam/scoring/goethe"
import { isOesdExam } from "@/lib/exam/scoring/oesd"
import { isStartExam, typedRight } from "@/lib/exam/scoring/start"
import { gradeDtzWriting, gradeStartWriting, gradeTelcWriting, RUBRIC_VERSION, START_RUBRIC_VERSION, TELC_RUBRIC_VERSION, type MtGradedResult } from "@/lib/modelltest/grade"
import { canOpen } from "@/lib/entitlements"
import { itemNumbers } from "@/lib/exam/kurztest"
import { keepFreeAnswers, lockGrade, type LockedGrade } from "@/lib/modelltest/half"
import { halfOfAttempt, loadKeyedBlocks, loadRunnerSet, scoreClosed, scoreHalf, type MtClosedResult, type Paused } from "@/lib/modelltest/runner"
import { gradeSpeaking, type MtSpeakingResult } from "@/lib/modelltest/speaking"
import { gradeTelcSpeaking } from "@/lib/modelltest/speaking-telc"
import { gradeStartSpeaking } from "@/lib/modelltest/speaking-start"
import { gradeGoetheSpeaking } from "@/lib/modelltest/speaking-goethe"
import { gradeOesdSpeaking } from "@/lib/modelltest/speaking-oesd"
import { GOETHE_WRITING_RUBRIC_VERSION } from "@/lib/modelltest/grade-goethe"
import { OESD_WRITING_RUBRIC_VERSION } from "@/lib/modelltest/grade-oesd"
import { gradeModule } from "@/lib/modelltest/grade-module"
import { emptyState, phasesDone, playedBefore, skipTo, type RunState } from "@/lib/modelltest/sprechen-run"
import { createAdminClient } from "@/lib/supabase/admin"
import { getSessionUser } from "@/lib/supabase/server"

type Fail = { ok: false; error: "auth" | "access" | "attempt" | "limit" | "failed" }
export type StartResult = { ok: true; attemptId: string } | Fail
export type ClosedSubmit = { ok: true; result: MtClosedResult } | Fail
export type WritingSubmit = { ok: true; result: MtGradedResult } | { ok: true; locked: LockedGrade } | Fail
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
  if (await halfOfAttempt(o.attempt, o.user.id)) return { ok: false, error: "access" }
  const clean: Record<number, string> = {}
  for (const [k, v] of Object.entries(answers ?? {})) if (/^\d{1,2}$/.test(k) && Number(k) > 0 && typeof v === "string" && v.length <= 60) clean[Number(k)] = v
  try {
    const result = await scoreClosed(o.attempt.id, o.attempt.set_id, o.attempt.exam, o.attempt.skill, clean)
    const { error } = await createAdminClient().from("mt_attempts").update({ completed_at: new Date().toISOString(), paused: null, score: result.points?.points ?? result.correct, max_score: result.points?.max ?? result.total, result: { level: result.level, correct: result.correct, total: result.total, ...(result.points ? { points: result.points } : {}) } }).eq("id", o.attempt.id)
    if (error) throw error
    return { ok: true, result }
  } catch (e) {
    console.error("modelltest scoring failed", e instanceof Error ? e.message : e)
    return { ok: false, error: "failed" }
  }
}

export type WritingAnswer = { block: string; task: string; text: string }

/**
 * `answers`: one text per letter block (DTZ and telc: one letter with a choice of task; Goethe A2 two, B1 three).
 * `form`: the typed form fields by item number (Start Deutsch 1 / telc A2 Teil 1, ÖSD A1 Aufgabe 1).
 */
export async function submitWriting(attemptId: string, answers: WritingAnswer[], form?: Record<string, string>): Promise<WritingSubmit> {
  const o = await openAttempt(attemptId, ["schreiben"])
  if ("error" in o) return { ok: false, error: o.error! }
  // A single letter without a pass is graded in full; the learner sees half the criteria until they own Schreiben.
  const half = await halfOfAttempt(o.attempt, o.user.id)
  if (half?.mode === "teile") return { ok: false, error: "access" }
  const db = createAdminClient()
  const since = `${new Date().toISOString().slice(0, 10)}T00:00:00Z`
  const { count } = await db.from("mt_attempts").select("id", { count: "exact", head: true }).eq("user_id", o.user.id).eq("skill", "schreiben").gte("graded_at", since)
  if ((count ?? 0) >= WRITING_PER_DAY) return { ok: false, error: "limit" }
  try {
    const keyed = await loadKeyedBlocks(o.attempt.set_id, o.attempt.exam, "schreiben")
    const letters = keyed
      .filter((k) => k.block.display.writing?.length)
      .map((k) => {
        const given = (Array.isArray(answers) ? answers : []).find((a) => a?.block === k.block.id)
        const options = k.block.display.writing!
        const task = options.length === 1 ? options[0] : options.find((t) => t.key === given?.task)
        const model = k.block.key.writing?.find((m) => m.key === task?.key)
        return { k, task, model, text: String(given?.text ?? "").slice(0, MAX_TEXT) }
      })
    if (!letters.length || letters.some((l) => !l.task || !l.model)) return { ok: false, error: "attempt" }
    const exam = o.attempt.exam
    const start = isStartExam(exam)
    const telc = exam === "telc-b1"
    const goethe = isGoetheExam(exam)
    const oesd = isOesdExam(exam)
    const version = start ? START_RUBRIC_VERSION : telc ? TELC_RUBRIC_VERSION : goethe ? GOETHE_WRITING_RUBRIC_VERSION : oesd ? OESD_WRITING_RUBRIC_VERSION : RUBRIC_VERSION
    const rows: { attempt_id: string; task_id: string; turn: number; text: string; rubric_version: string }[] = letters.map((l) => ({ attempt_id: o.attempt.id, task_id: l.k.rowId, turn: 0, text: l.text, rubric_version: version }))
    const sheet = keyed.find((k) => k.block.display.items.some((it) => it.type === "gap") && !k.block.display.writing?.length)
    let result: MtGradedResult
    if (goethe || oesd) {
      const graded = await gradeModule(exam, letters.map((l) => ({ block: l.k.block, task: l.task!, modelAnswer: l.model!.modelAnswer, register: l.model!.register, text: l.text })), sheet && { block: sheet.block, form: form ?? {} })
      result = graded.result
      if (sheet && graded.formGiven) rows.push({ attempt_id: o.attempt.id, task_id: sheet.rowId, turn: 0, text: JSON.stringify(graded.formGiven), rubric_version: version })
    } else {
      const [{ k: letter, task, model, text: body }] = letters
      result = await (start ? gradeStartWriting.bind(null, exam === "telc-a2" ? "A2" : "A1") : telc ? gradeTelcWriting : gradeDtzWriting)(task!, model!.modelAnswer, model!.register, body)
      // Teil 1 (form): one point per field, typed fields with spelling tolerance, numbers exact.
      if (start && sheet) {
        const fields = sheet.block.display.items.flatMap((it) => (it.type === "gap" ? it.data.parts.flatMap((p) => (typeof p !== "string" && p.n > 0 ? [p] : [])) : []))
        const given = Object.fromEntries(fields.map((f) => [f.n, String(form?.[f.n] ?? "").slice(0, 60)]))
        const keys = sheet.block.key.answers.filter((a) => fields.some((f) => f.n === a.n))
        const right = keys.filter((k) => (fields.find((f) => f.n === k.n)!.options.length ? given[k.n] === k.correct : typedRight(given[k.n], String(k.correct), k.accept))).length
        rows.push({ attempt_id: o.attempt.id, task_id: sheet.rowId, turn: 0, text: JSON.stringify(given), rubric_version: version })
        const parts = [
          { label: `Teil ${sheet.block.teil}: Formular`, points: right, max: keys.length },
          { label: `Teil ${letter.block.teil}: ${task!.title}`, points: result.score.points, max: result.score.max },
        ]
        result = { ...result, parts, form: { keys }, score: { points: right + result.score.points, max: keys.length + result.score.max } }
      }
    }
    const sub = await db.from("mt_submissions").insert(rows)
    if (sub.error) throw sub.error
    const now = new Date().toISOString()
    const locked = half ? lockGrade(result) : null
    const paused: Paused | null = locked ? { at: now, grade: locked } : null
    const { error } = await db.from("mt_attempts").update({ completed_at: now, graded_at: now, paused, score: result.score.points, max_score: result.score.max, result: { level: result.level ?? null, score: result.score, task: letters.map((l) => l.task!.key).join(","), grade: result } }).eq("id", o.attempt.id)
    if (error) throw error
    if (locked) await markPaywall(o.attempt.id, now)
    return locked ? { ok: true, locked } : { ok: true, result }
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
  if (await halfOfAttempt(o.attempt, o.user.id)) return { ok: false, error: "access" }
  const db = createAdminClient()
  const since = `${new Date().toISOString().slice(0, 10)}T00:00:00Z`
  const { count } = await db.from("mt_attempts").select("id", { count: "exact", head: true }).eq("user_id", o.user.id).eq("skill", "sprechen").gte("graded_at", since)
  if ((count ?? 0) >= SPEAKING_PER_DAY) return { ok: false, error: "limit" }
  try {
    const { data } = await db.from("mt_attempts").select("conversation").eq("id", o.attempt.id).single()
    const state = (data?.conversation as RunState | null) ?? emptyState()
    const keyed = await loadKeyedBlocks(o.attempt.set_id, o.attempt.exam, "sprechen")
    for (const { block } of keyed) if (state.upTo[block.teil] !== undefined) state.lines.push(...playedBefore(state, block, block.display.speaking!.turns.length))
    // Closing lines of Teile that ran out of time are added here; keep each Teil's lines together, in order.
    state.lines = state.lines.map((l, i) => ({ l, i })).sort((a, b) => a.l.teil - b.l.teil || a.i - b.i).map(({ l }) => l)
    const partner = keyed[0]?.block.display.speaking?.people.partner.name ?? "Partner"
    const teileDone = [...new Set(state.lines.filter((l) => l.who === "du" && l.text.trim()).map((l) => l.teil))]
    const exam = o.attempt.exam
    const result =
      exam === "telc-b1"
        ? await gradeTelcSpeaking(state.lines, partner, teileDone)
        : isStartExam(exam)
          ? await gradeStartSpeaking(exam, state.lines, partner, teileDone)
          : isGoetheExam(exam)
            ? await gradeGoetheSpeaking(exam, state.lines, partner, teileDone)
            : isOesdExam(exam)
              ? await gradeOesdSpeaking(exam, state.lines, keyed.map((k) => k.block), teileDone, state.choice ?? {})
              : await gradeSpeaking(state.lines, partner, phasesDone(state.lines))
    const now = new Date().toISOString()
    const { error } = await db.from("mt_attempts").update({ completed_at: now, graded_at: now, paused: null, score: result.score.points, max_score: result.score.max, conversation: state, result: { level: result.level ?? null, score: result.score, grade: result } }).eq("id", o.attempt.id)
    if (error) throw error
    return { ok: true, result }
  } catch (e) {
    console.error("modelltest speaking grade failed", e instanceof Error ? e.message : e)
    await db.from("mt_attempts").update({ grade_error: e instanceof Error ? e.message.slice(0, 200) : "failed" }).eq("id", o.attempt.id)
    return { ok: false, error: "failed" }
  }
}

/** telc: the Teil's time is up before its last turn. The runner jumps to the examiner's closing line. */
export async function skipSpeaking(attemptId: string, teil: number, from: number): Promise<{ ok: boolean }> {
  const o = await openAttempt(attemptId, ["sprechen"])
  if ("error" in o || !Number.isInteger(teil) || !Number.isInteger(from)) return { ok: false }
  const db = createAdminClient()
  const keyed = await loadKeyedBlocks(o.attempt.set_id, o.attempt.exam, "sprechen")
  const block = keyed.find((k) => k.block.teil === teil)?.block
  if (!block?.display.speaking) return { ok: false }
  const { data } = await db.from("mt_attempts").select("conversation").eq("id", o.attempt.id).single()
  const state = (data?.conversation as RunState | null) ?? emptyState()
  if (from <= (state.upTo[teil] ?? -1)) return { ok: true }
  skipTo(state, block, from)
  const { error } = await db.from("mt_attempts").update({ conversation: state }).eq("id", o.attempt.id)
  return { ok: !error }
}

/**
 * The first time a learner stands at the halfway stop of an attempt, for /admin/funnel. Its own timestamp, because
 * `paused` is cleared once they pay. Never fails the pause itself: a stop that works matters more than the count.
 */
async function markPaywall(attemptId: string, at: string) {
  const { error } = await createAdminClient().from("mt_attempts").update({ paywall_at: at }).eq("id", attemptId).is("paywall_at", null)
  if (error) console.error("modelltest paywall_at failed", error.message)
}

export type PauseInput = { values?: Record<string, string>; texts?: Record<string, string>; chosen?: Record<string, string>; left?: number }
export type PauseResult = { ok: true; paused: Paused } | Fail

/**
 * The learner reached the end of the free half: keeps their answers for the free Teile on the attempt (Lesen/Hören
 * also get their right answers per Teil), so they go on at the next Teil once they own the skill. Sprechen keeps its
 * talk on the attempt already; only the ÖSD picks are copied.
 */
export async function pauseAttempt(attemptId: string, input: PauseInput): Promise<PauseResult> {
  const o = await openAttempt(attemptId, SKILLS)
  if ("error" in o) return { ok: false, error: o.error! }
  const half = await halfOfAttempt(o.attempt, o.user.id)
  if (half?.mode !== "teile") return { ok: false, error: "access" }
  const db = createAdminClient()
  const { exam, skill } = o.attempt
  const free = (await loadKeyedBlocks(o.attempt.set_id, exam, skill)).filter((k) => k.block.teil <= half.upTo)
  const items = new Set(free.flatMap((k) => itemNumbers(k.block.display.items)).filter((n) => n > 0))
  const blockIds = new Set(free.map((k) => k.block.id))
  const values: Record<number, string> = {}
  for (const [k, v] of Object.entries(input?.values ?? {})) if (/^\d{1,2}$/.test(k) && typeof v === "string" && v.length <= 60) values[Number(k)] = v
  const pick = (m: Record<string, string> | undefined, max: number) => Object.fromEntries(Object.entries(m ?? {}).filter(([k, v]) => blockIds.has(k) && typeof v === "string").map(([k, v]) => [k, v.slice(0, max)]))
  const left = Number.isFinite(input?.left) ? Math.max(0, Math.min(7200, Math.round(input!.left!))) : undefined
  const kept = keepFreeAnswers(values, items)
  const paused: Paused = {
    at: new Date().toISOString(),
    upTo: half.upTo,
    values: Object.fromEntries(Object.entries(kept).map(([k, v]) => [k, v])),
    ...(skill === "schreiben" ? { texts: pick(input?.texts, MAX_TEXT), chosen: pick(input?.chosen, 20) } : {}),
    ...(left !== undefined ? { left } : {}),
  }
  try {
    if (skill === "lesen" || skill === "hoeren") paused.teile = await scoreHalf(o.attempt.set_id, exam, skill, kept, half.upTo)
    if (skill === "sprechen") {
      const { data } = await db.from("mt_attempts").select("conversation").eq("id", o.attempt.id).single()
      const choice = (data?.conversation as RunState | null)?.choice
      if (choice) paused.choice = choice
    }
    const { error } = await db.from("mt_attempts").update({ paused }).eq("id", o.attempt.id)
    if (error) throw error
    await markPaywall(o.attempt.id, paused.at)
    return { ok: true, paused }
  } catch (e) {
    console.error("modelltest pause failed", e instanceof Error ? e.message : e)
    return { ok: false, error: "failed" }
  }
}

/** A letter graded before the pass: the full feedback, once the learner owns Schreiben. Clears the wait. */
export async function revealGrade(attemptId: string): Promise<WritingSubmit> {
  const user = await getSessionUser()
  if (!user) return { ok: false, error: "auth" }
  if (!/^[0-9a-f-]{36}$/.test(attemptId)) return { ok: false, error: "attempt" }
  const db = createAdminClient()
  const { data } = await db.from("mt_attempts").select("id, user_id, exam, skill, result, paused").eq("id", attemptId).maybeSingle()
  const grade = (data?.result as { grade?: MtGradedResult } | null)?.grade
  if (!data || data.user_id !== user.id || !(data.paused as Paused | null)?.grade || !grade || !isExam(data.exam)) return { ok: false, error: "attempt" }
  if (!(await canOpen(user.id, data.exam, data.skill as PartId))) return { ok: false, error: "access" }
  const { error } = await db.from("mt_attempts").update({ paused: null }).eq("id", data.id)
  if (error) return { ok: false, error: "failed" }
  return { ok: true, result: grade }
}
