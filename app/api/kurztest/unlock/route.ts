import { NextResponse } from "next/server"
import { gradeWriting, speakingTranscript } from "@/lib/kurztest/grade"
import { checkLimit, clientIp, hashIp } from "@/lib/kurztest/limits"
import { scoreClosed } from "@/lib/kurztest/score"
import { claimLead, getAttempt, updateAttempt } from "@/lib/kurztest/store"
import { transcribe } from "@/lib/kurztest/stt"
import { isExam } from "@/lib/kurztest/data"
import { getSessionUser } from "@/lib/supabase/server"
import { outcomeLabel, type GradedResult, type TranscriptResult } from "@/lib/kurztest/types"

const MAX_FILE = 1_500_000
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

const fail = (error: string, status = 400) => NextResponse.json({ error }, { status })

/** Email in (the account's email when signed in), full result out. Every skill needs an account: Lesen/Hören guests meet the sign-up wall after Teil 1, Schreiben/Sprechen guests before they start. Writing is graded and speaking transcribed here, once per attempt, within the limits. */
export async function POST(req: Request) {
  const form = req.headers.get("content-type")?.includes("multipart/form-data") ? await req.formData() : null
  const json = form ? null : ((await req.json().catch(() => null)) as Record<string, unknown> | null)
  const field = (k: string) => (form ? form.get(k) : json?.[k])

  const attemptId = String(field("attemptId") ?? "")
  const user = await getSessionUser()
  if (!user) return fail("auth_required", 401)
  const email = user.email.trim().toLowerCase()
  const marketing = field("marketing") === true || field("marketing") === "true"
  if (!/^[0-9a-f-]{36}$/.test(attemptId)) return fail("bad_attempt")
  if (email.length > 254 || !EMAIL.test(email)) return fail("bad_email")

  const attempt = await getAttempt(attemptId)
  if (!attempt) return fail("not_found", 404)
  const exam = attempt.exam
  if (!isExam(exam)) return fail("bad_exam")

  const files = form ? form.getAll("recordings").filter((f): f is File => typeof f !== "string") : []
  if (attempt.skill === "sprechen") {
    if (!files.length) return fail("no_recordings")
    if (files.length > 20 || files.some((f) => f.size > MAX_FILE)) return fail("too_large", 413)
  }

  if (!attempt.email) await claimLead(attemptId, email, marketing)

  if (attempt.skill === "lesen" || attempt.skill === "hoeren") {
    const locale = field("locale")
    return NextResponse.json(scoreClosed(exam, attempt.skill, attempt.answers ?? {}, locale === "uk" || locale === "ru" ? locale : "de"))
  }

  if (attempt.grade) return NextResponse.json(attempt.grade)

  const ip = clientIp(req)
  const limited = await checkLimit(ip, user, attempt.skill === "schreiben" ? "schreiben" : "sprechen")
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
    return fail("grading_failed", 502)
  }

  await updateAttempt(attemptId, { grade: result, graded_at: new Date().toISOString(), ip_hash: hashIp(ip), level: result.kind === "transcript" ? "transkript" : outcomeLabel(result) })
  return NextResponse.json(result)
}
