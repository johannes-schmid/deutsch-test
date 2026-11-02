import "server-only"
import { createAdminClient } from "@/lib/supabase/admin"
import { isExam } from "@/lib/kurztest/data"
import type { ExamId } from "@/lib/exams"

/** The objection notice under the sign-up button (EMAIL_NOTICE in lib/i18n/portal.ts and its uk/ru translations); bump it whenever that text changes. */
export const NOTICE_VERSION = "2026-11-02.1"

/** `exam` is null when the row was created before an exam was chosen. `emails` = lifecycle emails on (default for every account). */
export type ExamGoal = { exam: ExamId | null; examDate: string | null; emails: boolean }

/** The learner's exam, date and whether lifecycle emails are on; null = no row yet (emails are on). */
export async function examGoal(userId: string): Promise<ExamGoal | null> {
  const { data, error } = await createAdminClient().from("lifecycle_prefs").select("exam, exam_date, unsubscribed_at").eq("user_id", userId).maybeSingle()
  if (error) throw new Error(`[lifecycle] ${error.message}`)
  if (!data) return null
  return { exam: isExam(data.exam) ? data.exam : null, examDate: data.exam_date, emails: !data.unsubscribed_at }
}

/** Stores the exam a sign-up came from (a free test) as the portal's exam, only while none is stored: a choice is never overwritten. */
export async function presetExam(userId: string, exam: ExamId): Promise<void> {
  const db = createAdminClient()
  const row = await db.from("lifecycle_prefs").upsert({ user_id: userId }, { onConflict: "user_id", ignoreDuplicates: true })
  const set = row.error ? row : await db.from("lifecycle_prefs").update({ exam, updated_at: new Date().toISOString() }).eq("user_id", userId).is("exam", null)
  if (set.error) console.error("[lifecycle] exam preset failed", set.error.message)
}

/** Switches the portal's exam (dashboard header, level keys). Keeps the date and the email setting. */
export async function setExam(userId: string, exam: ExamId): Promise<boolean> {
  const { data, error } = await createAdminClient()
    .from("lifecycle_prefs")
    .upsert({ user_id: userId, exam, updated_at: new Date().toISOString() }, { onConflict: "user_id" })
    .select("user_id")
  if (error || !data?.length) console.error("[lifecycle] exam switch failed", error?.message)
  return !error && !!data?.length
}

/**
 * The learner's prefs row (created when missing) and its unsubscribe token; null on a database error.
 * With `notice`, records that the sign-up objection notice was shown (/auth/callback, new accounts only).
 */
export async function ensurePrefs(userId: string, notice = false): Promise<string | null> {
  const db = createAdminClient()
  const now = new Date().toISOString()
  const { error } = notice
    ? await db.from("lifecycle_prefs").upsert({ user_id: userId, notice_at: now, notice_version: NOTICE_VERSION, updated_at: now }, { onConflict: "user_id" })
    : await db.from("lifecycle_prefs").upsert({ user_id: userId }, { onConflict: "user_id", ignoreDuplicates: true })
  if (error) {
    console.error("[lifecycle] prefs row failed", error.message)
    return null
  }
  const { data } = await db.from("lifecycle_prefs").select("unsubscribe_token").eq("user_id", userId).maybeSingle()
  return data?.unsubscribe_token ?? null
}
