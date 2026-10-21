import "server-only"
import { EXAMS, EXAM_IDS, LEVELS, examPath, type Exam, type ExamId, type Level } from "@/lib/exams"
import { examLive } from "@/lib/kurztest/data"

export type PortalExam = Exam & { id: ExamId; href: string | null }

/** Cached: it reads the content files, which only change with a deploy. Every exam once, under its highest level (the DTZ under B1), highest level first; the DTZ leads its group. */
export async function portalExamGroups(): Promise<{ level: Level; exams: PortalExam[] }[]> {
  "use cache"
  const top = (id: ExamId) => EXAMS[id].levels[EXAMS[id].levels.length - 1]
  return [...LEVELS].reverse().map((level) => ({
    level,
    exams: EXAM_IDS.filter((id) => top(id) === level)
      .sort((a, b) => Number(b === "dtz") - Number(a === "dtz"))
      .map((id) => ({ ...EXAMS[id], id, href: examLive(id) ? examPath(id) : null })),
  }))
}
