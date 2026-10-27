"use server"

import { isExam } from "@/lib/kurztest/data"
import { daysUntil } from "@/lib/lifecycle/rules"
import { CONSENT_VERSION } from "@/lib/lifecycle/prefs"
import { createAdminClient } from "@/lib/supabase/admin"
import { getSessionUser } from "@/lib/supabase/server"

export type GoalResult = { ok: true } | { ok: false; error: "auth" | "date" | "failed" }

const YMD = /^\d{4}-\d{2}-\d{2}$/
const MAX_DAYS_AHEAD = 3 * 366

/**
 * Saves exam, date and, when given, email consent (the dashboard widget leaves consent alone; /dashboard/konto sets it).
 * Ticking the box records a fresh consent with the wording version; unticking an active consent records the opt-out and
 * keeps the proof of the earlier consent.
 * TODO(hannes): no double opt-in click, because Google sign-in already proves the address; confirm with a lawyer.
 */
export async function saveExamGoal(input: { exam: string; examDate: string | null; consent?: boolean }): Promise<GoalResult> {
  const user = await getSessionUser()
  if (!user) return { ok: false, error: "auth" }
  if (!isExam(input.exam) || (input.consent !== undefined && typeof input.consent !== "boolean")) return { ok: false, error: "failed" }

  const db = createAdminClient()
  const { data: row, error: readError } = await db.from("lifecycle_prefs").select("exam_date, consent_at, unsubscribed_at").eq("user_id", user.id).maybeSingle()
  if (readError) return { ok: false, error: "failed" }

  const date = input.examDate
  if (date !== null) {
    if (typeof date !== "string" || !YMD.test(date) || Number.isNaN(Date.parse(date))) return { ok: false, error: "date" }
    const left = daysUntil(date, new Date())
    if (date !== row?.exam_date && (left < 0 || left > MAX_DAYS_AHEAD)) return { ok: false, error: "date" }
  }

  const now = new Date().toISOString()
  const active = !!row?.consent_at && !row.unsubscribed_at
  const consent =
    input.consent === undefined
      ? {}
      : input.consent && !active
        ? { consent_at: now, consent_version: CONSENT_VERSION, unsubscribed_at: null }
        : !input.consent && active
          ? { unsubscribed_at: now }
          : {}

  const { data, error } = await db
    .from("lifecycle_prefs")
    .upsert({ user_id: user.id, exam: input.exam, exam_date: date, updated_at: now, ...consent }, { onConflict: "user_id" })
    .select("user_id")
  if (error || !data?.length) {
    console.error("[lifecycle] save failed", error?.message)
    return { ok: false, error: "failed" }
  }
  return { ok: true }
}
