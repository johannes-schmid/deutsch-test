import "server-only"
import { EXAMS, FAMILIES, FAMILY_IDS, examPath, familyLevels, familyOf, familyPath, portalPath, type Brand, type Exam, type ExamId, type FamilyId, type Level } from "@/lib/exams"
import type { FocusInfo, SwitchFamily } from "@/components/portal/exam-focus"
import { SKILLS, examLive, liveSkills, type Skill } from "@/lib/kurztest/data"

export type PortalExam = Exam & { id: ExamId; href: string; free: string | null }

/** Modelltests per skill, as on inburgeringoefenen.nl. */
export const MODELLTESTS = 10

export { portalPath }

export const portalExam = (id: ExamId): PortalExam => ({ ...EXAMS[id], id, href: portalPath(id), free: examLive(id) ? examPath(id) : null })

export type PortalFamily = { id: FamilyId; name: string; brand: Brand; summary: string; levels: Level[]; href: string; exams: PortalExam[]; total: number }

/** Cached: it reads the content files, which only change with a deploy. The overview's exam families, DTZ first, each with its exams lowest level first. */
export async function portalFamilies(): Promise<PortalFamily[]> {
  "use cache"
  return FAMILY_IDS.map((id) => {
    const f = FAMILIES[id]
    return { id, name: f.name, brand: f.brand, summary: f.summary, levels: familyLevels(id), href: familyPath(id), exams: f.exams.map(portalExam), total: f.exams.length * SKILLS.length * MODELLTESTS }
  })
}

export type PortalSkill = { skill: Skill; href: string; free: string | null }

/** One exam's four skills, each with its Modelltest page and, where reviewed content exists, the free 5-minute test. */
export async function portalSkills(exam: ExamId): Promise<PortalSkill[]> {
  "use cache"
  const live = examLive(exam) ? liveSkills(exam) : []
  return SKILLS.map((skill) => ({ skill, href: portalPath(exam, skill), free: live.includes(skill) ? `${examPath(exam)}/${skill}` : null }))
}

/** Every exam by family for the dashboard's exam switch. Start Deutsch 1 sits under Goethe and telc. */
export async function switchFamilies(): Promise<SwitchFamily[]> {
  "use cache"
  return FAMILY_IDS.map((id) => ({ id, name: FAMILIES[id].name, brand: FAMILIES[id].brand, exams: FAMILIES[id].exams.map((e) => ({ id: e, level: EXAMS[e].levels.join("–") })) }))
}

/** The dashboard's exam with its family's other levels as keys. Start Deutsch 1 belongs to two families and shows Goethe's levels. */
export function focusInfo(id: ExamId): FocusInfo {
  const exam = EXAMS[id]
  const family = FAMILIES[familyOf(id) ?? "goethe"]
  const siblings = family.exams.length > 1 ? family.exams.map((e) => ({ id: e, level: EXAMS[e].levels.join("–") })) : null
  return { id, name: exam.name, brand: exam.brand, summary: exam.summary, range: exam.levels.join("–"), siblings }
}
