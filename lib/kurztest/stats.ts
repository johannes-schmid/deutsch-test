import "server-only"
import { EXAM_IDS, type ExamId } from "@/lib/exams"
import type { Skill } from "./data"
import { SKILLS } from "./data"
import { getJson, listEntries } from "./store"

export type Lead = { id: string; email: string; marketing: boolean; exam?: ExamId; skill: Skill; level: string | null; at: string }
export const OUTCOMES = ["B1", "A2", "unter A2", "bestanden", "nicht bestanden", "transkript", "offen"] as const

/** Counts come from marker pathnames (stats/<kind>/<exam>/<skill>/<outcome>/<id>), so no record is read. */
const parse = (p: string) => {
  const parts = p.split("/")
  // Markers written before exams existed have no exam segment; those are all DTZ.
  const [exam, skill, level, id] = parts.length === 5 ? ["dtz", ...parts.slice(2)] : parts.slice(2)
  return { exam, skill, level, id }
}

export async function funnel() {
  const [attempts, leads] = await Promise.all([listEntries("stats/attempt/"), listEntries("stats/lead/")])
  const a = attempts.map((e) => parse(e.pathname))
  const l = leads.map((e) => parse(e.pathname))
  return EXAM_IDS.flatMap((exam) =>
    SKILLS.map((skill) => {
      const mine = (x: { exam: string; skill: string }) => x.exam === exam && x.skill === skill
      const byId = new Map<string, string>()
      for (const x of l.filter(mine)) if (!byId.has(x.id) || byId.get(x.id) === "offen") byId.set(x.id, x.level)
      const outcomes = Object.fromEntries(OUTCOMES.map((o) => [o, [...byId.values()].filter((v) => v === o).length])) as Record<(typeof OUTCOMES)[number], number>
      return { exam, skill, attempts: new Set(a.filter(mine).map((x) => x.id)).size, leads: byId.size, outcomes }
    })
  ).filter((r) => r.attempts || r.leads)
}

export async function leads(limit?: number): Promise<Lead[]> {
  const entries = (await listEntries("leads/")).sort((a, b) => +b.uploadedAt - +a.uploadedAt)
  const picked = limit ? entries.slice(0, limit) : entries
  const out: Lead[] = []
  for (let i = 0; i < picked.length; i += 20) {
    const batch = await Promise.all(picked.slice(i, i + 20).map((e) => getJson<Lead>(e.pathname)))
    out.push(...batch.filter((l): l is Lead => !!l))
  }
  return out
}
