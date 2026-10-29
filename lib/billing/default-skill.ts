import { SKILLS } from "@/lib/billing/grants"
import type { PartId } from "@/lib/exam/types"

/**
 * The skill the pricing page preselects (Hannes, 2026-10-29): the one with the most finished Modelltests, a tie going
 * to the most recently practised. Null (preselect all four) without attempts or with all four practised equally.
 * A rule, no model involved.
 */
export function mostPracticed(attempts: { skill: string; completedAt: string }[]): PartId | null {
  const stats = new Map<PartId, { n: number; last: string }>()
  for (const a of attempts) {
    if (!SKILLS.includes(a.skill as PartId)) continue
    const s = stats.get(a.skill as PartId) ?? { n: 0, last: "" }
    stats.set(a.skill as PartId, { n: s.n + 1, last: a.completedAt > s.last ? a.completedAt : s.last })
  }
  const ranked = [...stats.entries()].sort(([, a], [, b]) => b.n - a.n || b.last.localeCompare(a.last))
  if (ranked.length === 0) return null
  if (ranked.length === SKILLS.length && ranked.every(([, s]) => s.n === ranked[0][1].n)) return null
  return ranked[0][0]
}
