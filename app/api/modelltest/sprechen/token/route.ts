import { NextResponse } from "next/server"
import { gateway } from "@ai-sdk/gateway"
import { LIVE_STT_MODEL } from "@/lib/exam/live-transcript"
import { halfOfAttempt } from "@/lib/modelltest/runner"
import { capped, emptyState, FREE_SPEAKING_SECONDS, freeSecondsUsed, MAX_LIVE_TOKENS, type RunState } from "@/lib/modelltest/sprechen-run"
import type { ExamId } from "@/lib/exams"
import { createAdminClient } from "@/lib/supabase/admin"
import { getSessionUser } from "@/lib/supabase/server"

const fail = (error: string, status = 400) => NextResponse.json({ error }, { status })

/**
 * A short-lived AI Gateway token for one live transcript (the words the learner sees while speaking). The browser
 * streams the microphone to the Gateway with it; grading still uses the uploaded recording (../turn).
 */
export async function POST(req: Request) {
  const user = await getSessionUser()
  if (!user) return fail("auth", 401)
  const { attemptId } = (await req.json().catch(() => ({}))) as { attemptId?: string }
  if (!attemptId || !/^[0-9a-f-]{36}$/.test(attemptId)) return fail("bad_request")

  const db = createAdminClient()
  const { data } = await db.from("mt_attempts").select("id, user_id, set_id, exam, skill, completed_at, conversation").eq("id", attemptId).maybeSingle()
  const attempt = data as { id: string; user_id: string; set_id: string; exam: ExamId; skill: string; completed_at: string | null; conversation: RunState | null } | null
  if (!attempt || attempt.user_id !== user.id || attempt.skill !== "sprechen" || attempt.completed_at) return fail("attempt", 403)

  const half = await halfOfAttempt({ ...attempt, skill: "sprechen" }, user.id)
  if (half && (await capped(true)) && (await freeSecondsUsed(user.id)) >= FREE_SPEAKING_SECONDS) return fail("free_limit", 402)

  const state = attempt.conversation ?? emptyState()
  if ((state.liveTokens ?? 0) >= MAX_LIVE_TOKENS) return fail("limit", 429)

  try {
    const { token, expiresAt } = await gateway.experimental_transcription.getToken({ model: LIVE_STT_MODEL, expiresAfterSeconds: 300 })
    await db.from("mt_attempts").update({ conversation: { ...state, liveTokens: (state.liveTokens ?? 0) + 1 } }).eq("id", attempt.id)
    return NextResponse.json({ token, expiresAt })
  } catch (e) {
    console.error("live transcript token failed", e instanceof Error ? e.message : e)
    return fail("unavailable", 503)
  }
}
