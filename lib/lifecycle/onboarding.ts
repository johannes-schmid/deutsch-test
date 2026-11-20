import { SKILLS } from "@/lib/billing/grants"
import type { PartId } from "@/lib/exam/types"
import { EXAM_IDS, portalPath, type ExamId } from "@/lib/exams"
import { daysUntil } from "./rules"

/** Why the learner needs the exam (onboarding after the free test, Hannes 2026-11-20); stored as lifecycle_prefs.goal. */
export const GOALS = ["einbuergerung", "aufenthalt", "integrationskurs", "arbeit", "andere"] as const
export type Goal = (typeof GOALS)[number]

/** The answers of the onboarding. Skipped questions stay null. `examDate` is only an exact date the learner picked. */
export type Onboarding = { exam: ExamId; skill: PartId | null; examDate: string | null; goal: Goal | null }

/** Where Google returns to after the onboarding (app/auth/willkommen saves the answers there). */
export const WELCOME_PATH = "/auth/willkommen"

const YMD = /^\d{4}-\d{2}-\d{2}$/
const MAX_DAYS_AHEAD = 3 * 366

export function welcomePath(o: Onboarding): string {
  const q = new URLSearchParams({ exam: o.exam })
  if (o.skill) q.set("skill", o.skill)
  if (o.examDate) q.set("date", o.examDate)
  if (o.goal) q.set("goal", o.goal)
  return `${WELCOME_PATH}?${q}`
}

const validDate = (raw: string | null, now: Date): string | null => {
  if (!raw || !YMD.test(raw)) return null
  const d = new Date(`${raw}T00:00:00Z`)
  if (Number.isNaN(d.getTime()) || d.toISOString().slice(0, 10) !== raw) return null
  const left = daysUntil(raw, now)
  return left >= 0 && left <= MAX_DAYS_AHEAD ? raw : null
}

/** Reads the answers back from the welcome URL. Null without a known exam; anything else unknown is dropped, never guessed. */
export function parseOnboarding(q: URLSearchParams, now: Date): Onboarding | null {
  const exam = q.get("exam")
  if (!exam || !(EXAM_IDS as readonly string[]).includes(exam)) return null
  const skill = q.get("skill")
  const goal = q.get("goal")
  return {
    exam: exam as ExamId,
    skill: skill && (SKILLS as string[]).includes(skill) ? (skill as PartId) : null,
    examDate: validDate(q.get("date"), now),
    goal: goal && (GOALS as readonly string[]).includes(goal) ? (goal as Goal) : null,
  }
}

/** The portal page the learner lands on: the skill of the free test, so Modelltest 1 is the next step. */
export const landingPath = (o: Onboarding) => portalPath(o.exam, o.skill ?? undefined)
