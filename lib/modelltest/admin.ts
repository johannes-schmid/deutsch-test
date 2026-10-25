import "server-only"
import { createAdminClient } from "@/lib/supabase/admin"
import { validateSet } from "@/lib/exam/validate-modelltest"
import type { PartId } from "@/lib/exam/types"
import type { ExamId } from "@/lib/exams"
import { ROW_COLUMNS, rowToBlock, tableOf, trackWithUrl, type Row } from "./rows"
import type { HoerTrack, MtBlock } from "./types"

// Admin reads of the Modelltest tables (secret-key client). Every caller checks requireAdmin() first: these return
// scoring keys and unpublished drafts.

export const SKILLS: PartId[] = ["hoeren", "lesen", "schreiben", "sprechen"]

export type SetSummary = { id: string; exam: ExamId; skill: PartId; number: number; isFree: boolean; published: boolean; total: number; reviewed: number }

type ReviewRow = { set_id: string; review_status: string }

/** All review rows of a table: the API returns at most 1,000 rows per request, whatever range is asked for. */
async function allReviewRows(db: ReturnType<typeof createAdminClient>, table: "mt_stimuli" | "mt_open_tasks") {
  const out: ReviewRow[] = []
  for (let from = 0; ; from += 1000) {
    const { data, error } = await db.from(table).select("set_id, review_status").order("id").range(from, from + 999)
    if (error) throw error
    out.push(...data)
    if (data.length < 1000) return out
  }
}

/** Every set with its review progress (content rows reviewed / all). */
export async function setOverview(): Promise<SetSummary[]> {
  const db = createAdminClient()
  const [sets, stimuli, tasks] = await Promise.all([
    db.from("mt_sets").select("id, exam, skill, number, is_free, published").order("exam").order("number"),
    allReviewRows(db, "mt_stimuli"),
    allReviewRows(db, "mt_open_tasks"),
  ])
  if (sets.error) throw sets.error
  const rows = [...stimuli, ...tasks]
  return sets.data.map((s) => {
    const mine = rows.filter((r) => r.set_id === s.id)
    return { id: s.id, exam: s.exam, skill: s.skill, number: s.number, isFree: s.is_free, published: s.published, total: mine.length, reviewed: mine.filter((r) => r.review_status === "reviewed").length }
  })
}

export type AdminBlock = { rowId: string; table: "mt_stimuli" | "mt_open_tasks"; reviewedAt: string | null; block: MtBlock }
export type AdminSet = { id: string; exam: ExamId; skill: PartId; number: number; title: string | null; isFree: boolean; published: boolean; publishedAt: string | null; track: HoerTrack | null; blocks: AdminBlock[]; issues: string[] }

function toBlock(r: Row, exam: ExamId, skill: PartId, table: AdminBlock["table"]): AdminBlock {
  return { rowId: r.id, table, reviewedAt: r.reviewed_at, block: rowToBlock(r, exam, skill) }
}

/** One set with its blocks in exam order and everything that still blocks publishing (format + review). */
export async function loadSet(exam: ExamId, skill: PartId, number: number): Promise<AdminSet | null> {
  const db = createAdminClient()
  const { data: set, error } = await db.from("mt_sets").select("id, title, is_free, published, published_at, track").eq("exam", exam).eq("skill", skill).eq("number", number).maybeSingle()
  if (error) throw error
  if (!set) return null
  const table = tableOf(skill)
  const [rows, gate] = await Promise.all([
    db.from(table).select(ROW_COLUMNS).eq("set_id", set.id).order("teil").order("sort_order"),
    db.rpc("mt_publish_issues", { p_set: set.id }),
  ])
  if (rows.error || gate.error) throw rows.error ?? gate.error
  const blocks = (rows.data as Row[]).map((r) => toBlock(r, exam, skill, table))
  const format = validateSet(exam, skill, blocks.map((b) => b.block))
  const track = set.track as HoerTrack | null
  return {
    id: set.id, exam, skill, number, title: set.title, isFree: set.is_free, published: set.published, publishedAt: set.published_at,
    track: trackWithUrl(track),
    blocks,
    issues: [...format, ...(gate.data as { issue: string }[]).map((g) => g.issue)],
  }
}
