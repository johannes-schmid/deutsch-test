import "server-only"
import { requireAdmin } from "@/lib/admin/guard"
import { ownsExam } from "@/lib/entitlements"
import type { PartId } from "@/lib/exam/types"
import { portalPath, type ExamId } from "@/lib/exams"
import { MODELLTESTS } from "@/lib/portal"
import { createAdminClient } from "@/lib/supabase/admin"

export { MODELLTESTS }

/**
 * open: can start · done: finished at least once (best result shown) · locked: published, needs the exam ·
 * soon: not published yet · preview: unpublished, visible to admins only so they can run it before publishing.
 */
export type SlotState = "open" | "done" | "locked" | "soon" | "preview"
export type ModelltestSlot = { n: number; state: SlotState; href: string | null; free: boolean; result: string | null }

type SetRow = { id: string; number: number; is_free: boolean; published: boolean }
type AttemptRow = { set_id: string; result: { level?: string; score?: { points: number; max: number } } | null; score: number | null }

const RANK: Record<string, number> = { B1: 3, A2: 2, "unter A2": 1 }

/** The best finished attempt per set, as the label the row shows (a level for the DTZ, points elsewhere). */
function best(attempts: AttemptRow[]) {
  const top = attempts.reduce<AttemptRow | null>((b, a) => {
    const rank = (x: AttemptRow) => (x.result?.level ? RANK[x.result.level] ?? 0 : (x.score ?? 0) / Math.max(1, x.result?.score?.max ?? 1))
    return !b || rank(a) > rank(b) ? a : b
  }, null)
  if (!top) return null
  return top.result?.level ?? (top.result?.score ? `${top.result.score.points}/${top.result.score.max}` : null)
}

/** The ten slots of one skill for one user. Read with the secret key, filtered to this user. */
export async function modelltestSlots(exam: ExamId, skill: PartId, userId: string): Promise<ModelltestSlot[]> {
  const db = createAdminClient()
  const [{ data: sets, error }, admin, owns] = await Promise.all([
    db.from("mt_sets").select("id, number, is_free, published").eq("exam", exam).eq("skill", skill).gt("number", 0),
    requireAdmin(),
    ownsExam(userId, exam),
  ])
  if (error) throw error
  const ids = (sets as SetRow[]).map((s) => s.id)
  const { data: attempts, error: aErr } = ids.length
    ? await db.from("mt_attempts").select("set_id, result, score").eq("user_id", userId).in("set_id", ids).not("completed_at", "is", null)
    : { data: [], error: null }
  if (aErr) throw aErr
  return Array.from({ length: MODELLTESTS }, (_, i) => {
    const n = i + 1
    const set = (sets as SetRow[]).find((s) => s.number === n)
    const href = `${portalPath(exam, skill)}/${n}`
    if (!set || (!set.published && !admin)) return { n, state: "soon", href: null, free: n === 1, result: null }
    const mine = (attempts as AttemptRow[]).filter((a) => a.set_id === set.id)
    const result = best(mine)
    if (!set.published) return { n, state: "preview", href, free: set.is_free, result }
    if (!set.is_free && !owns && !admin) return { n, state: "locked", href: null, free: false, result: null }
    return { n, state: mine.length ? "done" : "open", href, free: set.is_free, result }
  })
}

/** Per skill: how many Modelltests this user finished and how many are out. For the exam page's skill cards. */
export async function skillProgress(exam: ExamId, userId: string): Promise<Record<string, { done: number; available: number }>> {
  const db = createAdminClient()
  const [{ data: sets, error }, admin] = await Promise.all([db.from("mt_sets").select("id, skill, published").eq("exam", exam).gt("number", 0), requireAdmin()])
  if (error) throw error
  const visible = (sets as { id: string; skill: string; published: boolean }[]).filter((s) => s.published || admin)
  const { data: attempts } = visible.length
    ? await db.from("mt_attempts").select("set_id").eq("user_id", userId).in("set_id", visible.map((s) => s.id)).not("completed_at", "is", null)
    : { data: [] }
  const doneSets = new Set((attempts ?? []).map((a) => a.set_id))
  const out: Record<string, { done: number; available: number }> = {}
  for (const s of visible) {
    out[s.skill] ??= { done: 0, available: 0 }
    out[s.skill].available++
    if (doneSets.has(s.id)) out[s.skill].done++
  }
  return out
}
