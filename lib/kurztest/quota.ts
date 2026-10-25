/** Graded free tests per skill and account, for good (same as inburgeringoefenen.nl). A Prüfungspass lifts it. */
export const FREE_PER_SKILL = 10

export type LimitError = "limit_free" | "limit_ip" | "busy"

export type Usage = { usedForSkill: number; todayByIp: number; todayAll: number; paid: boolean }
export type Caps = { perSkill: number; perIp: number; daily: number }

/** Free limit first: someone out of free tests is told about the pass, not to come back tomorrow. */
export function verdict(u: Usage, caps: Caps): LimitError | null {
  if (!u.paid && u.usedForSkill >= caps.perSkill) return "limit_free"
  if (u.todayAll >= caps.daily) return "busy"
  if (u.todayByIp >= caps.perIp) return "limit_ip"
  return null
}
