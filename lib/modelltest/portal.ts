import "server-only"
import { requireAdmin } from "@/lib/admin/guard"
import { canOpen } from "@/lib/entitlements"
import type { PartId } from "@/lib/exam/types"
import { portalPath, type ExamId } from "@/lib/exams"
import { MODELLTESTS } from "@/lib/portal"
import { createAdminClient } from "@/lib/supabase/admin"
import { mostPracticed } from "@/lib/billing/default-skill"

export { MODELLTESTS }

/**
 * open: can start · done: finished at least once (best result shown) · locked: published, needs the exam ·
 * soon: not published yet · preview: unpublished, visible to admins only so they can run it before publishing.
 * Published sets lock for admins too, so the portal shows them what a customer sees.
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
    canOpen(userId, exam, skill),
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
    if (!set.is_free && !owns) return { n, state: "locked", href: null, free: false, result: null }
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

type DoneRow = { set_id: string; exam: string; skill: string; number: number; score: number | null; max_score: number | null; completed_at: string }

export type PortalStats = {
  /** Distinct Modelltests finished, per exam. */
  done: Record<string, number>
  /** Finished attempts, newest first. */
  recent: { exam: string; skill: string; number: number }[]
  /** Mean share of points over every finished attempt, in percent; null before the first one. */
  average: number | null
  /** The average now minus the average before the last 7 days; null without both. */
  delta: number | null
  /** The last 12 results in percent, oldest first. */
  trend: number[]
  /** The last 7 days ending today (Berlin): weekday label and finished attempts. */
  week: { day: string; count: number }[]
}

const DAY = new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Berlin" })
const WEEKDAY = new Intl.DateTimeFormat("de-DE", { weekday: "short", timeZone: "Europe/Berlin" })
const mean = (xs: number[]) => (xs.length ? Math.round(xs.reduce((a, b) => a + b, 0) / xs.length) : null)

/** Everything the overview shows about one user's Modelltests. One query, newest first (capped at 1,000 attempts). */
export async function portalStats(userId: string): Promise<PortalStats> {
  const db = createAdminClient()
  const { data, error } = await db
    .from("mt_attempts")
    .select("set_id, exam, skill, number, score, max_score, completed_at")
    .eq("user_id", userId)
    .not("completed_at", "is", null)
    .order("completed_at", { ascending: false })
    .limit(1000)
  if (error) throw error
  const rows = data as DoneRow[]

  const sets: Record<string, Set<string>> = {}
  for (const r of rows) (sets[r.exam] ??= new Set()).add(r.set_id)

  const now = Date.now()
  const weekAgo = now - 7 * 86_400_000
  const scored = rows.filter((r) => r.score != null && r.max_score)
  const pct = (r: DoneRow) => (100 * Number(r.score)) / Number(r.max_score)
  const average = mean(scored.map(pct))
  const before = mean(scored.filter((r) => Date.parse(r.completed_at) < weekAgo).map(pct))
  const fresh = scored.some((r) => Date.parse(r.completed_at) >= weekAgo)

  const perDay: Record<string, number> = {}
  for (const r of rows) perDay[DAY.format(new Date(r.completed_at))] = (perDay[DAY.format(new Date(r.completed_at))] ?? 0) + 1
  const week = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(now - (6 - i) * 86_400_000)
    return { day: WEEKDAY.format(d).replace(".", ""), count: perDay[DAY.format(d)] ?? 0 }
  })

  return {
    done: Object.fromEntries(Object.entries(sets).map(([k, v]) => [k, v.size])),
    recent: rows.map(({ exam, skill, number }) => ({ exam, skill, number })),
    average,
    delta: average != null && before != null && fresh ? average - before : null,
    trend: scored.slice(0, 12).map((r) => Math.round(pct(r))).reverse(),
    week,
  }
}

/** The skill this learner finished the most Modelltests in (lib/billing/default-skill.ts), for the pricing page. */
export async function mostPracticedSkill(userId: string): Promise<PartId | null> {
  const { data, error } = await createAdminClient().from("mt_attempts").select("skill, completed_at").eq("user_id", userId).not("completed_at", "is", null).limit(1000)
  if (error) throw error
  return mostPracticed((data ?? []).map((r) => ({ skill: r.skill as string, completedAt: r.completed_at as string })))
}
