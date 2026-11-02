"use server"

import { isExam } from "@/lib/kurztest/data"
import { daysUntil } from "@/lib/lifecycle/rules"
import { createAdminClient } from "@/lib/supabase/admin"
import { getSessionUser } from "@/lib/supabase/server"

export type GoalResult = { ok: true } | { ok: false; error: "auth" | "date" | "failed" }

const YMD = /^\d{4}-\d{2}-\d{2}$/
const MAX_DAYS_AHEAD = 3 * 366

/**
 * Saves exam, date and, when given, the lifecycle-email switch (the dashboard widget leaves it alone; /dashboard/konto sets it).
 * Emails are on for every account (§ 7 Abs. 3 UWG); switching off records the objection, switching on clears it.
 * consent_at and the notice proof stay untouched.
 */
export async function saveExamGoal(input: { exam: string; examDate: string | null; emails?: boolean }): Promise<GoalResult> {
  const user = await getSessionUser()
  if (!user) return { ok: false, error: "auth" }
  if (!isExam(input.exam) || (input.emails !== undefined && typeof input.emails !== "boolean")) return { ok: false, error: "failed" }

  const db = createAdminClient()
  const { data: row, error: readError } = await db.from("lifecycle_prefs").select("exam_date, unsubscribed_at").eq("user_id", user.id).maybeSingle()
  if (readError) return { ok: false, error: "failed" }

  const date = input.examDate
  if (date !== null) {
    if (typeof date !== "string" || !YMD.test(date) || Number.isNaN(Date.parse(date))) return { ok: false, error: "date" }
    const left = daysUntil(date, new Date())
    if (date !== row?.exam_date && (left < 0 || left > MAX_DAYS_AHEAD)) return { ok: false, error: "date" }
  }

  const now = new Date().toISOString()
  const on = !row?.unsubscribed_at
  const emails = input.emails === undefined || input.emails === on ? {} : { unsubscribed_at: input.emails ? null : now }

  const { data, error } = await db
    .from("lifecycle_prefs")
    .upsert({ user_id: user.id, exam: input.exam, exam_date: date, updated_at: now, ...emails }, { onConflict: "user_id" })
    .select("user_id")
  if (error || !data?.length) {
    console.error("[lifecycle] save failed", error?.message)
    return { ok: false, error: "failed" }
  }
  return { ok: true }
}
