import { NextResponse } from "next/server"
import { transcribe } from "@/lib/kurztest/stt"
import { loadKeyedBlocks } from "@/lib/modelltest/runner"
import { followup, partnerLine, speak, SPEAKING_RUBRIC_VERSION } from "@/lib/modelltest/speaking"
import { rescueLine, telcFollowup, telcPartnerLine, TELC_SPEAKING_RUBRIC_VERSION } from "@/lib/modelltest/speaking-telc"
import { startFollowup, startPartnerLine, START_SPEAKING_RUBRIC_VERSION } from "@/lib/modelltest/speaking-start"
import { isStartExam } from "@/lib/exam/scoring/start"
import type { ExamId } from "@/lib/exams"
import { capped, emptyState, FREE_SPEAKING_SECONDS, freeSecondsUsed, playedBefore, type RunState } from "@/lib/modelltest/sprechen-run"
import { createAdminClient } from "@/lib/supabase/admin"
import { getSessionUser } from "@/lib/supabase/server"

const MAX_FILE = 2_000_000
const fail = (error: string, status = 400) => NextResponse.json({ error }, { status })

type Attempt = { id: string; user_id: string; set_id: string; exam: ExamId; skill: string; completed_at: string | null; conversation: RunState | null }

/**
 * One candidate turn of a live Sprechen Modelltest: store the recording (private bucket, own folder), transcribe it,
 * and when the next turn is live, write and voice it. Returns the transcript and, if any, the next line as audio.
 */
export async function POST(req: Request) {
  const user = await getSessionUser()
  if (!user) return fail("auth", 401)
  const form = await req.formData().catch(() => null)
  if (!form) return fail("bad_request")
  const attemptId = String(form.get("attemptId") ?? "")
  const teil = Number(form.get("teil"))
  const turn = Number(form.get("turn"))
  const seconds = Math.min(120, Math.max(0, Number(form.get("seconds")) || 0))
  // Seconds left in this Teil (telc keeps time per Teil): the partner wraps up when it runs short.
  const left = form.has("left") ? Number(form.get("left")) : NaN
  const file = form.get("audio")
  if (!/^[0-9a-f-]{36}$/.test(attemptId) || !Number.isInteger(teil) || !Number.isInteger(turn) || !(file instanceof File)) return fail("bad_request")
  if (file.size > MAX_FILE) return fail("too_large", 413)

  const db = createAdminClient()
  const { data } = await db.from("mt_attempts").select("id, user_id, set_id, exam, skill, completed_at, conversation").eq("id", attemptId).maybeSingle()
  const attempt = data as Attempt | null
  if (!attempt || attempt.user_id !== user.id || attempt.skill !== "sprechen" || attempt.completed_at) return fail("attempt", 403)

  const { data: set } = await db.from("mt_sets").select("is_free").eq("id", attempt.set_id).single()
  if (await capped(!!set?.is_free)) {
    const used = await freeSecondsUsed(user.id)
    if (used + seconds > FREE_SPEAKING_SECONDS) return fail("free_limit", 402)
  }

  const keyed = await loadKeyedBlocks(attempt.set_id, attempt.exam, "sprechen")
  const entry = keyed.find((k) => k.block.teil === teil)
  const turns = entry?.block.display.speaking?.turns
  if (!entry || !turns || turns[turn]?.who !== "du") return fail("bad_turn")
  const block = entry.block

  const path = `${user.id}/${attempt.id}/t${teil}-${turn}.${file.type.includes("mp4") ? "m4a" : "webm"}`
  const up = await db.storage.from("sprechen-recordings").upload(path, file, { contentType: file.type.split(";")[0] || "audio/webm", upsert: true })
  if (up.error) console.error("recording upload failed", up.error.message)

  let text = ""
  try {
    text = file.size > 1000 ? await transcribe(file) : ""
  } catch (e) {
    console.error("sprechen transcribe failed", e instanceof Error ? e.message : e)
    return fail("transcribe_failed", 502)
  }

  const telc = attempt.exam === "telc-b1"
  const start = isStartExam(attempt.exam) ? attempt.exam : null
  const state: RunState = attempt.conversation ?? emptyState()
  state.lines.push(...playedBefore(state, block, turn), { teil, phase: turns[turn].phase, who: "du", text })
  state.upTo[teil] = turn

  await db.from("mt_submissions").upsert({ attempt_id: attempt.id, task_id: entry.rowId, turn, audio_path: up.error ? null : path, audio_seconds: seconds, transcript: text, rubric_version: telc ? TELC_SPEAKING_RUBRIC_VERSION : start ? START_SPEAKING_RUBRIC_VERSION : SPEAKING_RUBRIC_VERSION }, { onConflict: "attempt_id,task_id,turn" })

  // telc: the Interlokutor steps in once per turn when the candidate said (almost) nothing; the turn is then repeated.
  const rescueKey = `${teil}-${turn}`
  if (telc && text.trim().split(/\s+/).filter(Boolean).length < 3 && !(state.rescued ?? []).includes(rescueKey) && !(left <= 20)) {
    const ask = rescueLine(teil, turn)
    const voice = block.key.speaking?.voices.pruefer
    const audio = voice ? await speak(voice, ask) : null
    if (audio) {
      state.rescued = [...(state.rescued ?? []), rescueKey]
      state.lines.push({ teil, phase: turns[turn].phase, who: "pruefer", text: ask })
      await db.from("mt_attempts").update({ conversation: state }).eq("id", attempt.id)
      return NextResponse.json({ transcript: text, next: null, rescue: { text: ask, audio: `data:audio/mpeg;base64,${audio.toString("base64")}` } })
    }
  }

  // The next turn, when it is generated live: the examiner's follow-up (1B/2B) or the partner in Teil 3.
  const nextIndex = turn + 1
  const next = turns[nextIndex]
  let line: { index: number; text: string; audio: string } | null = null
  if (next?.live) {
    const lastPartner = next.live === "partner" && !turns.slice(nextIndex + 1).some((t) => t.live === "partner")
    const duAfter = turns.slice(nextIndex + 1).some((t) => t.who === "du")
    const nextText = start
      ? next.live === "followup"
        ? await startFollowup(start, block, state.lines, text)
        : await startPartnerLine(start, block, state.lines, text, { cue: turns[turn].text, last: lastPartner })
      : telc
        ? next.live === "followup"
          ? await telcFollowup(block, state.lines, text)
          : await telcPartnerLine(block, state.lines, text, { last: lastPartner, duAfter, hurry: Number.isFinite(left) && left < 50 })
        : next.live === "followup"
          ? await followup(block, state.lines, text)
          : await partnerLine(block, state.lines, text, lastPartner)
    const voice = block.key.speaking?.voices[next.who as "pruefer" | "partner"]
    const audio = nextText && voice ? await speak(voice, nextText) : null
    if (nextText && audio) {
      state.live[`${teil}-${nextIndex}`] = nextText
      line = { index: nextIndex, text: nextText, audio: `data:audio/mpeg;base64,${audio.toString("base64")}` }
    }
  }
  await db.from("mt_attempts").update({ conversation: state }).eq("id", attempt.id)
  return NextResponse.json({ transcript: text, next: line })
}
