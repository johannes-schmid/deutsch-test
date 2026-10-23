import "server-only"
import { EXAMS, FAMILIES, FAMILY_IDS, examPath, familyLevels, familyPath, portalPath, type Brand, type Exam, type ExamId, type FamilyId, type Level } from "@/lib/exams"
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
