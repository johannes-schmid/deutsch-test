import "server-only"
import { EXAMS, EXAM_IDS, LEVELS, examPath, portalPath, type Exam, type ExamId, type Level } from "@/lib/exams"
import { SKILLS, examLive, liveSkills, type Skill } from "@/lib/kurztest/data"

export type PortalExam = Exam & { id: ExamId; href: string; free: string | null }

/** Modelltests per skill, as on inburgeringoefenen.nl. */
export const MODELLTESTS = 10

export { portalPath }

export const portalExam = (id: ExamId): PortalExam => ({ ...EXAMS[id], id, href: portalPath(id), free: examLive(id) ? examPath(id) : null })

/** Cached: it reads the content files, which only change with a deploy. Lowest level first; an exam sits under every level it certifies (the DTZ under A2 and B1) and leads its group. */
export async function portalExamGroups(): Promise<{ level: Level; exams: PortalExam[] }[]> {
  "use cache"
  return LEVELS.map((level) => ({
    level,
    exams: EXAM_IDS.filter((id) => EXAMS[id].levels.includes(level))
      .sort((a, b) => Number(b === "dtz") - Number(a === "dtz"))
      .map(portalExam),
  }))
}

export type PortalSkill = { skill: Skill; href: string; free: string | null }

/** One exam's four skills, each with its Modelltest page and, where reviewed content exists, the free 5-minute test. */
export async function portalSkills(exam: ExamId): Promise<PortalSkill[]> {
  "use cache"
  const live = examLive(exam) ? liveSkills(exam) : []
  return SKILLS.map((skill) => ({ skill, href: portalPath(exam, skill), free: live.includes(skill) ? `${examPath(exam)}/${skill}` : null }))
}

export type ModelltestSlot = { n: number; href: string | null }

/** The ten Modelltest slots of one skill. None is built yet, so none has a link. */
export function modelltests(): ModelltestSlot[] {
  return Array.from({ length: MODELLTESTS }, (_, i) => ({ n: i + 1, href: null }))
}

