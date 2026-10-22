import "server-only"
import fs from "node:fs"
import path from "node:path"
import { TASTER } from "@/lib/exam/blueprint"
import type { ItemKey, KurztestBlock } from "@/lib/exam/kurztest"
import type { PartId } from "@/lib/exam/types"
import { EXAM_IDS, type ExamId } from "@/lib/exams"
import { EXAM_PAGES_BY } from "@/lib/i18n/kurztest"
import type { SiteLocale } from "@/lib/i18n/locale"

export const SKILLS = ["hoeren", "lesen", "schreiben", "sprechen"] as const satisfies readonly PartId[]
export type Skill = (typeof SKILLS)[number]
export const isSkill = (s: unknown): s is Skill => SKILLS.includes(s as Skill)
export const isExam = (e: unknown): e is ExamId => EXAM_IDS.includes(e as ExamId)

const dir = (exam: ExamId) => path.join(process.cwd(), exam === "dtz" ? "data/kurztest/drafts" : `data/gratis-test/${exam}`)
const prefix = (exam: ExamId, skill: Skill) => (exam === "dtz" ? `${skill}-` : `${exam}-${skill}-`)

/** The taster's blocks: per Teil the first n reviewed blocks, in plan order. Writing is always one block. */
function taster(exam: ExamId, skill: Skill, blocks: KurztestBlock[]) {
  const t = TASTER[exam]
  if (!t) return blocks
  if (skill === "schreiben") return blocks.slice(0, 1)
  if (skill === "sprechen") return blocks.filter((b) => t.sprechen.includes(b.teil))
  return t[skill].flatMap((p) => blocks.filter((b) => b.teil === p.teil).slice(0, p.blocks))
}

/** Only reviewed blocks ever leave this module (CLAUDE.md §4). */
export function loadSet(exam: ExamId, skill: Skill): KurztestBlock[] {
  const d = dir(exam)
  if (!fs.existsSync(d)) return []
  const reviewed = fs
    .readdirSync(d)
    .filter((f) => f.startsWith(prefix(exam, skill)) && f.endsWith(".json"))
    .map((f) => JSON.parse(fs.readFileSync(path.join(d, f), "utf8")) as KurztestBlock)
    .filter((b) => b.status === "reviewed")
    .sort((a, b) => a.teil - b.teil || a.id.localeCompare(b.id))
  return taster(exam, skill, reviewed)
}

export const tasterMinutes = (exam: ExamId, skill: Skill) => TASTER[exam]?.minutes[skill] ?? 5

/** Skills with reviewed content. An exam is live on /gratis-test once it has at least one. */
export const liveSkills = (exam: ExamId) => SKILLS.filter((s) => loadSet(exam, s).length)

/** An exam links out only once it has reviewed content; the others show as "Bald verfügbar" with no URL. */
export const examLive = (exam: ExamId, l: SiteLocale = "de") => !!EXAM_PAGES_BY[l][exam] && liveSkills(exam).length > 0

/** What the browser may see before grading: no answers, evidence, transcripts or model answers. */
export type PublicBlock = Pick<KurztestBlock, "id" | "skill" | "teil" | "display">

export const publicSet = (exam: ExamId, skill: Skill): PublicBlock[] => loadSet(exam, skill).map(({ id, skill, teil, display }) => ({ id, skill, teil, display }))

export const answerKey = (exam: ExamId, skill: Skill): ItemKey[] => loadSet(exam, skill).flatMap((b) => b.key.answers)
