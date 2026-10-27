import "server-only"
import { createAdminClient } from "@/lib/supabase/admin"
import { isExam } from "@/lib/kurztest/data"
import type { ExamId } from "@/lib/exams"

/** The consent wording (EMAIL_CONSENT in lib/i18n/portal.ts and its uk/ru translations); bump it whenever that text changes. */
export const CONSENT_VERSION = "2026-10-27.2"

/** `exam` is null when the row only holds a sign-up consent and no exam was chosen yet. */
export type ExamGoal = { exam: ExamId | null; examDate: string | null; consent: boolean }

/** The learner's exam, date and whether lifecycle emails are on; null = no row yet. */
export async function examGoal(userId: string): Promise<ExamGoal | null> {
  const { data, error } = await createAdminClient().from("lifecycle_prefs").select("exam, exam_date, consent_at, unsubscribed_at").eq("user_id", userId).maybeSingle()
  if (error) throw new Error(`[lifecycle] ${error.message}`)
  if (!data) return null
  return { exam: isExam(data.exam) ? data.exam : null, examDate: data.exam_date, consent: !!data.consent_at && !data.unsubscribed_at }
}

/** The ticked sign-up checkbox, recorded by /auth/callback. Keeps an active consent as it is; never touches exam or date. */
export async function recordSignupConsent(userId: string) {
  const db = createAdminClient()
  const { data: row } = await db.from("lifecycle_prefs").select("consent_at, unsubscribed_at").eq("user_id", userId).maybeSingle()
  if (row?.consent_at && !row.unsubscribed_at) return
  const now = new Date().toISOString()
  const { error } = await db
    .from("lifecycle_prefs")
    .upsert({ user_id: userId, consent_at: now, consent_version: CONSENT_VERSION, unsubscribed_at: null, updated_at: now }, { onConflict: "user_id" })
  if (error) console.error("[lifecycle] signup consent failed", error.message)
}
