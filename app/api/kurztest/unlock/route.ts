import { NextResponse } from "next/server"
import { gradeWriting, speakingTranscript } from "@/lib/kurztest/grade"
import { checkLimit, clientIp, countRun } from "@/lib/kurztest/limits"
import { scoreClosed } from "@/lib/kurztest/score"
import { getJson, putJson } from "@/lib/kurztest/store"
import { transcribe } from "@/lib/kurztest/stt"
import { isExam } from "@/lib/kurztest/data"
import { outcomeLabel, type GradedResult, type TranscriptResult } from "@/lib/kurztest/types"

const MAX_FILE = 1_500_000
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

type Attempt = { id: string; exam?: string; skill: string; answers?: Record<number, string>; task?: string; text?: string; level?: string }

const fail = (error: string, status = 400) => NextResponse.json({ error }, { status })

/** Email in, full result out. Writing is graded and speaking transcribed here, once per attempt, within the limits. */
export async function POST(req: Request) {
  const form = req.headers.get("content-type")?.includes("multipart/form-data") ? await req.formData() : null
  const json = form ? null : ((await req.json().catch(() => null)) as Record<string, unknown> | null)
  const field = (k: string) => (form ? form.get(k) : json?.[k])

  const attemptId = String(field("attemptId") ?? "")
  const email = String(field("email") ?? "").trim().toLowerCase()
  const marketing = field("marketing") === true || field("marketing") === "true"
  if (!/^[0-9a-f-]{36}$/.test(attemptId)) return fail("bad_attempt")
  if (email.length > 254 || !EMAIL.test(email)) return fail("bad_email")

  const attempt = await getJson<Attempt>(`attempts/${attemptId}.json`)
  if (!attempt) return fail("not_found", 404)
  const exam = attempt.exam ?? "dtz"
  if (!isExam(exam)) return fail("bad_exam")

  const files = form ? form.getAll("recordings").filter((f): f is File => typeof f !== "string") : []
  if (attempt.skill === "sprechen") {
    if (!files.length) return fail("no_recordings")
    if (files.length > 20 || files.some((f) => f.size > MAX_FILE)) return fail("too_large", 413)
  }

  const leadPath = `leads/${attemptId}.json`
  const existing = await getJson<Record<string, unknown>>(leadPath)
  const lead = existing ?? { id: attemptId, email, marketing, exam, skill: attempt.skill, level: attempt.level ?? null, at: new Date().toISOString() }
  if (!existing) await putJson(leadPath, lead)
  const markLevel = async (level: string) => {
    await putJson(leadPath, { ...lead, level })
    await putJson(`stats/lead/${exam}/${attempt.skill}/${level}/${attemptId}`, {})
  }

  if (attempt.skill === "lesen" || attempt.skill === "hoeren") {
    const result = scoreClosed(exam, attempt.skill, attempt.answers ?? {})
    await markLevel(outcomeLabel(result))
    return NextResponse.json(result)
  }

  const cached = await getJson<GradedResult | TranscriptResult>(`grades/${attemptId}.json`)
  if (cached) return NextResponse.json(cached)

  const ip = clientIp(req)
  const limited = await checkLimit(ip, email)
  if (limited) return fail(limited, 429)

  let result: GradedResult | TranscriptResult
  try {
    if (attempt.skill === "schreiben") {
      result = await gradeWriting(exam, attempt.task ?? "", attempt.text ?? "")
    } else {
      const heard = await Promise.all(files.map((f) => (f.size > 1000 ? transcribe(f) : Promise.resolve(""))))
      result = speakingTranscript(exam, heard)
    }
  } catch (e) {
    console.error("kurztest grading failed", attempt.skill, e instanceof Error ? e.message : e)
    await markLevel("offen")
    return fail("grading_failed", 502)
  }

  await putJson(`grades/${attemptId}.json`, result)
  await countRun(ip, email, attemptId)
  await markLevel(result.kind === "transcript" ? "transkript" : outcomeLabel(result))
  return NextResponse.json(result)
}
