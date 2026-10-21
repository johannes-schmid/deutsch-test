import "server-only"
import { EXAM_IDS, type ExamId } from "@/lib/exams"
import type { Skill } from "./data"
import { SKILLS } from "./data"
import { selectAll } from "./store"

export type Lead = { id: string; email: string; marketing: boolean; exam: ExamId; skill: Skill; level: string; at: string }
export const OUTCOMES = ["B1", "A2", "unter A2", "bestanden", "nicht bestanden", "transkript", "offen"] as const

type Row = { exam: string; skill: string; level: string; email: string | null }

export async function funnel() {
  const rows = await selectAll<Row>("exam, skill, level, email")
  return EXAM_IDS.flatMap((exam) =>
    SKILLS.map((skill) => {
      const mine = rows.filter((r) => r.exam === exam && r.skill === skill)
      const unlocked = mine.filter((r) => r.email)
      const outcomes = Object.fromEntries(OUTCOMES.map((o) => [o, unlocked.filter((r) => r.level === o).length])) as Record<(typeof OUTCOMES)[number], number>
      return { exam, skill, attempts: mine.length, leads: unlocked.length, outcomes }
    })
  ).filter((r) => r.attempts || r.leads)
}

export async function leads(limit?: number): Promise<Lead[]> {
  const rows = await selectAll<Omit<Lead, "at"> & { unlocked_at: string }>("id, email, marketing, exam, skill, level, unlocked_at", (q) => q.not("email", "is", null).order("unlocked_at", { ascending: false }).order("id"), limit)
  return rows.map(({ unlocked_at, ...l }) => ({ ...l, at: unlocked_at }))
}
