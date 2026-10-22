"use server"

import { refresh } from "next/cache"
import { requireAdmin } from "@/lib/admin/guard"
import { loadSet } from "@/lib/modelltest/admin"
import { createAdminClient } from "@/lib/supabase/admin"
import type { PartId } from "@/lib/exam/types"
import type { ExamId } from "@/lib/exams"

export type ActionResult = { ok: true } | { ok: false; error: string }

/** Marks one Teil (stimulus or task) as reviewed or back to draft. A published set can't be un-reviewed: unpublish first. */
export async function setReviewed(table: "mt_stimuli" | "mt_open_tasks", id: string, reviewed: boolean): Promise<ActionResult> {
  if (!(await requireAdmin())) return { ok: false, error: "Kein Zugriff." }
  const db = createAdminClient()
  const { data: row, error: readError } = await db.from(table).select("set_id, mt_sets!inner(published)").eq("id", id).single()
  if (readError) return { ok: false, error: readError.message }
  if (!reviewed && (row.mt_sets as unknown as { published: boolean }).published) return { ok: false, error: "Der Test ist veröffentlicht. Nimm ihn zuerst offline." }
  const { data, error } = await db.from(table).update({ review_status: reviewed ? "reviewed" : "draft", reviewed_at: reviewed ? new Date().toISOString() : null }).eq("id", id).select("id")
  if (error) return { ok: false, error: error.message }
  if (!data.length) return { ok: false, error: "Nichts geändert." }
  refresh()
  return { ok: true }
}

/** Publishes only when the set has no format or review issues left; unpublishing always works. */
export async function setPublished(exam: ExamId, skill: PartId, number: number, published: boolean): Promise<ActionResult> {
  if (!(await requireAdmin())) return { ok: false, error: "Kein Zugriff." }
  const set = await loadSet(exam, skill, number)
  if (!set) return { ok: false, error: "Test nicht gefunden." }
  if (published && set.issues.length) return { ok: false, error: `Noch ${set.issues.length} offene Punkte.` }
  const { data, error } = await createAdminClient().from("mt_sets").update({ published, published_at: published ? new Date().toISOString() : null }).eq("id", set.id).select("id")
  if (error) return { ok: false, error: error.message }
  if (!data.length) return { ok: false, error: "Nichts geändert." }
  refresh()
  return { ok: true }
}
