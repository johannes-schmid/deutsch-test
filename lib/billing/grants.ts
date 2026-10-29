import { EXAM_IDS, type ExamId } from "@/lib/exams"
import type { PartId } from "@/lib/exam/types"
import { hasAccess } from "@/lib/billing/period"

/**
 * What one purchase lets a learner open. Every offer in lib/pricing.ts carries grants, and every payment row stores a
 * snapshot of them (`payments.grants`), so a later price or catalogue change never alters what someone already bought.
 * Access checks read only these snapshots.
 */
export type Grants = { skills: PartId[]; exams: "*" | ExamId[]; simulation: boolean }

export const SKILLS: PartId[] = ["hoeren", "lesen", "schreiben", "sprechen"]

/** The Prüfungspass: every skill of every exam, plus the Prüfungssimulation. */
export const ALL_GRANTS: Grants = { skills: SKILLS, exams: "*", simulation: true }

/** Each grant is checked on its own: a Sprechen pass for every exam plus a DTZ-only Lesen pass never opens telc Lesen. */
export const allows = (grants: Grants[], exam: ExamId, skill: PartId) =>
  grants.some((g) => g.skills.includes(skill) && (g.exams === "*" || g.exams.includes(exam)))

/** The grants of every paid period that still gives access (grace days included while the subscription renews). */
export const activeGrants = (rows: { end: Date; grants: Grants }[], renewing: boolean, now: Date) =>
  rows.filter((r) => hasAccess({ until: r.end, renewing }, now)).map((r) => r.grants)

/** A stored snapshot, or null when the value is not one (a malformed row grants nothing). */
export function parseGrants(v: unknown): Grants | null {
  const g = v as Partial<Grants> | null
  if (!g || !Array.isArray(g.skills) || typeof g.simulation !== "boolean") return null
  if (!g.skills.every((s) => SKILLS.includes(s))) return null
  if (g.exams !== "*" && !(Array.isArray(g.exams) && g.exams.every((e) => (EXAM_IDS as readonly string[]).includes(e)))) return null
  return { skills: g.skills, exams: g.exams, simulation: g.simulation }
}
