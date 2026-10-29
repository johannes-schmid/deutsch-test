import "server-only"
import { cache } from "react"
import type { ExamId } from "@/lib/exams"
import type { PartId } from "@/lib/exam/types"
import { createAdminClient } from "@/lib/supabase/admin"
import { activeGrants, allows, parseGrants, type Grants } from "@/lib/billing/grants"

export type PassStatus = {
  /** End of the latest paid, unrevoked period; null = never bought. */
  until: Date | null
  /** A monthly subscription is recorded and not cancelled. */
  renewing: boolean
  canceledAt: Date | null
  /** Every paid, unrevoked period with the grants it bought (the snapshot on its payment row). */
  periods: { end: Date; grants: Grants }[]
  /** What the latest period renews at; null = never bought, or a one-off offer. */
  renewalCents: number | null
  /** The offer of the latest period (lib/pricing.ts offerById); null = never bought. */
  offerId: string | null
}

/** The learner's passes, from the server-written `payments` and `mollie_customers` (never user_metadata). */
export const passStatus = cache(async (userId: string): Promise<PassStatus> => {
  const db = createAdminClient()
  const [pay, cust] = await Promise.all([
    db.from("payments").select("period_ends_at, grants, renewal_cents, plan_id, paid_at").eq("user_id", userId).eq("status", "paid").is("revoked_at", null).not("period_ends_at", "is", null).order("period_ends_at", { ascending: false }).order("paid_at", { ascending: false }),
    db.from("mollie_customers").select("subscription_id, canceled_at").eq("user_id", userId).maybeSingle(),
  ])
  if (pay.error || cust.error) throw new Error(`[entitlements] ${(pay.error ?? cust.error)!.message}`)
  const rows = pay.data ?? []
  const periods = rows.flatMap((r) => {
    const grants = parseGrants(r.grants)
    return grants ? [{ end: new Date(r.period_ends_at!), grants }] : []
  })
  return {
    until: rows[0] ? new Date(rows[0].period_ends_at!) : null,
    renewing: !!cust.data?.subscription_id && !cust.data.canceled_at,
    canceledAt: cust.data?.canceled_at ? new Date(cust.data.canceled_at) : null,
    periods,
    renewalCents: rows[0]?.renewal_cents ?? null,
    offerId: rows[0]?.plan_id ?? null,
  }
})

/**
 * The one entitlement check (CLAUDE.md §3: never a bare `plan` field, never user_metadata). Modelltest 1 per skill is
 * free and needs no entitlement; 2–10 need a paid period whose grants cover this exam and skill.
 */
export async function canOpen(userId: string, exam: ExamId, skill: PartId): Promise<boolean> {
  const s = await passStatus(userId)
  return allows(activeGrants(s.periods, s.renewing, new Date()), exam, skill)
}
