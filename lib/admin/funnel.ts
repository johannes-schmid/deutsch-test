import { berlinWeek, type SignupWeek } from "@/lib/admin/sales"

// The Modelltest funnel for /admin/funnel: sign-up → Modelltest started → halfway paywall seen → checkout → paid.
// Pure, so it is unit-tested; the fetching lives in lib/admin/stats.ts. Weeks are Berlin weeks like the sales numbers.
//
// A paywall sighting is `mt_attempts.paused` (written when the free half ends) and is cleared once the learner pays and
// goes on. So a buyer is counted as having seen the paywall when they had a Modelltest 1 attempt before their checkout.

export type FunnelAttempt = { user_id: string; exam: string; skill: string; number: number; started_at: string; paused: { at?: string } | null }
export type FunnelPayment = { user_id: string | null; kind: string; status: string; created_at: string; paid_at: string | null }

export type FunnelWeek = {
  week: string
  signups: number
  /** People who started any Modelltest. */
  started: number
  /** People who reached the halfway stop (paused attempts, plus buyers whose pause was cleared by paying). */
  paywall: number
  /** Attempts still waiting at the halfway stop. */
  paywallAttempts: number
  /** People who opened a Mollie checkout for a first purchase. */
  checkout: number
  /** People whose first purchase was paid. */
  paid: number
}
export type FunnelSkillRow = { exam: string; skill: string; thisWeek: number; lastWeek: number; total: number }
export type Funnel = { thisWeek: FunnelWeek; lastWeek: FunnelWeek; total: Omit<FunnelWeek, "week" | "signups">; paywallBySkill: FunnelSkillRow[] }

const shiftWeek = (monday: string, weeks: number) => new Date(Date.parse(`${monday}T00:00:00Z`) + weeks * 7 * 86_400_000).toISOString().slice(0, 10)

export function computeFunnel({ signups, attempts, payments, now = new Date() }: { signups: SignupWeek[]; attempts: FunnelAttempt[]; payments: FunnelPayment[]; now?: Date }): Funnel {
  const week = berlinWeek(now)
  const last = shiftWeek(week, -1)
  const firsts = payments.filter((p) => p.kind === "first" && p.user_id)
  const firstModelltest = new Map<string, string>()
  for (const a of attempts) if (a.number === 1 && (!firstModelltest.has(a.user_id) || a.started_at < firstModelltest.get(a.user_id)!)) firstModelltest.set(a.user_id, a.started_at)

  const stages = (inWeek: (at: string) => boolean): Omit<FunnelWeek, "week" | "signups"> => {
    const paused = attempts.filter((a) => a.paused?.at && inWeek(a.paused.at))
    const checkouts = firsts.filter((p) => inWeek(p.created_at))
    const paywallUsers = new Set(paused.map((a) => a.user_id))
    for (const p of checkouts) if ((firstModelltest.get(p.user_id!) ?? "￿") <= p.created_at) paywallUsers.add(p.user_id!)
    return {
      started: new Set(attempts.filter((a) => inWeek(a.started_at)).map((a) => a.user_id)).size,
      paywall: paywallUsers.size,
      paywallAttempts: paused.length,
      checkout: new Set(checkouts.map((p) => p.user_id)).size,
      paid: new Set(firsts.filter((p) => p.status === "paid" && p.paid_at && inWeek(p.paid_at)).map((p) => p.user_id)).size,
    }
  }
  const forWeek = (w: string): FunnelWeek => ({ week: w, signups: signups.find((s) => s.week === w)?.signups ?? 0, ...stages((at) => berlinWeek(at) === w) })

  const bySkill = new Map<string, FunnelSkillRow>()
  for (const a of attempts) {
    if (!a.paused?.at) continue
    const key = `${a.exam}/${a.skill}`
    const row = bySkill.get(key) ?? { exam: a.exam, skill: a.skill, thisWeek: 0, lastWeek: 0, total: 0 }
    const w = berlinWeek(a.paused.at)
    row.total++
    if (w === week) row.thisWeek++
    else if (w === last) row.lastWeek++
    bySkill.set(key, row)
  }

  return {
    thisWeek: forWeek(week),
    lastWeek: forWeek(last),
    total: stages(() => true),
    paywallBySkill: [...bySkill.values()].sort((a, b) => b.thisWeek - a.thisWeek || b.total - a.total || a.exam.localeCompare(b.exam) || a.skill.localeCompare(b.skill)),
  }
}
