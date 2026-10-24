import "server-only"
import { cache } from "react"
import type { ExamId } from "@/lib/exams"
import { createAdminClient } from "@/lib/supabase/admin"
import { hasAccess } from "@/lib/billing/period"

export type PassStatus = {
  /** End of the latest paid, unrevoked period; null = never bought. */
  until: Date | null
  /** A monthly subscription is recorded and not cancelled. */
  renewing: boolean
  canceledAt: Date | null
}

/** The learner's Prüfungspass, from the server-written `payments` and `mollie_customers` (never user_metadata). */
export const passStatus = cache(async (userId: string): Promise<PassStatus> => {
  const db = createAdminClient()
  const [pay, cust] = await Promise.all([
    db.from("payments").select("period_ends_at").eq("user_id", userId).eq("status", "paid").is("revoked_at", null).order("period_ends_at", { ascending: false }).limit(1).maybeSingle(),
    db.from("mollie_customers").select("subscription_id, canceled_at").eq("user_id", userId).maybeSingle(),
  ])
  if (pay.error || cust.error) throw new Error(`[entitlements] ${(pay.error ?? cust.error)!.message}`)
  return {
    until: pay.data?.period_ends_at ? new Date(pay.data.period_ends_at) : null,
    renewing: !!cust.data?.subscription_id && !cust.data.canceled_at,
    canceledAt: cust.data?.canceled_at ? new Date(cust.data.canceled_at) : null,
  }
})

/**
 * The one entitlement check (CLAUDE.md §3: never a bare `plan` field, never user_metadata). Modelltest 1 per skill is
 * free and needs no entitlement; 2–10 need an active Prüfungspass, which covers every exam (the `exam` argument stays so a
 * per-exam product would be a one-line change).
 */
export async function ownsExam(userId: string, exam: ExamId): Promise<boolean> {
  void exam
  return hasAccess(await passStatus(userId), new Date())
}
