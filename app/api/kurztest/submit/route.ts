import { NextResponse } from "next/server"
import { isExam, isSkill } from "@/lib/kurztest/data"
import { scoreClosed } from "@/lib/kurztest/score"
import { insertAttempt, type Attempt } from "@/lib/kurztest/store"
import { MAX_TEXT, outcomeLabel, type SubmitBody } from "@/lib/kurztest/types"

const cleanUtm = (utm: unknown) =>
  utm && typeof utm === "object"
    ? Object.fromEntries(Object.entries(utm as Record<string, unknown>).filter(([k, v]) => /^utm_[a-z]+$/.test(k) && typeof v === "string").map(([k, v]) => [k, (v as string).slice(0, 100)]))
    : undefined

/** Stores a finished attempt and returns only its id. The result stays locked until /unlock. */
export async function POST(req: Request) {
  const raw = await req.text()
  if (raw.length > 20_000) return NextResponse.json({ error: "too_large" }, { status: 413 })
  let body: SubmitBody
  try {
    body = JSON.parse(raw)
  } catch {
    return NextResponse.json({ error: "bad_json" }, { status: 400 })
  }
  if (!isSkill(body?.skill)) return NextResponse.json({ error: "bad_skill" }, { status: 400 })
  const exam = body.exam ?? "dtz"
  if (!isExam(exam)) return NextResponse.json({ error: "bad_exam" }, { status: 400 })

  const id = crypto.randomUUID()
  const base = { id, exam, skill: body.skill, started_at: String(body.startedAt ?? "").slice(0, 40), utm: cleanUtm(body.utm) ?? null }
  let record: Partial<Attempt> & Pick<Attempt, "id" | "exam" | "skill">

  if (body.skill === "lesen" || body.skill === "hoeren") {
    const answers = Object.fromEntries(Object.entries(body.answers ?? {}).filter(([n, v]) => /^\d+$/.test(n) && typeof v === "string").map(([n, v]) => [n, v.slice(0, 40)]))
    const result = scoreClosed(exam, body.skill, answers)
    record = { ...base, answers, level: outcomeLabel(result) }
  } else if (body.skill === "schreiben") {
    if (!/^[AB]$/.test(body.task) || typeof body.text !== "string") return NextResponse.json({ error: "bad_writing" }, { status: 400 })
    record = { ...base, task: body.task, text: body.text.slice(0, MAX_TEXT) }
  } else {
    record = { ...base, recorded: Math.max(0, Math.min(20, Number((body as { recorded?: unknown }).recorded) || 0)) }
  }

  await insertAttempt(record)
  return NextResponse.json({ attemptId: id })
}
