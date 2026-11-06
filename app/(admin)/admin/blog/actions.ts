"use server"

import { refresh } from "next/cache"
import { requireAdmin } from "@/lib/admin/guard"
import type { SuggestionStatus } from "@/lib/admin/blog"
import { runScanStep } from "@/lib/content-ideas/run"
import { createAdminClient } from "@/lib/supabase/admin"

export type ActionResult = { ok: true; message?: string } | { ok: false; error: string }

const STATUSES: SuggestionStatus[] = ["open", "planned", "done", "dismissed"]

/** Plan / Done / Dismiss on one idea. Dismissed ideas stay in the table so the ranking never brings them back. */
export async function setSuggestionStatus(id: string, status: SuggestionStatus): Promise<ActionResult> {
  const admin = await requireAdmin()
  if (!admin) return { ok: false, error: "No access." }
  if (!STATUSES.includes(status)) return { ok: false, error: "Unknown status." }
  const { data, error } = await createAdminClient()
    .from("content_suggestions")
    .update({ status, decided_at: status === "open" ? null : new Date().toISOString() })
    .eq("id", id)
    .select("id")
  if (error) return { ok: false, error: error.message }
  if (!data.length) return { ok: false, error: "Nothing changed." }
  refresh()
  return { ok: true }
}

/** "Scan now": the same step the cron runs. First click starts the Apify runs, the next one collects and ranks. */
export async function scanNow(): Promise<ActionResult> {
  const admin = await requireAdmin()
  if (!admin) return { ok: false, error: "No access." }
  console.info(`[admin] content scan by ${admin}`)
  const { status, body } = await runScanStep()
  refresh()
  if (status >= 400) return { ok: false, error: String(body.error ?? body.ranking ?? "Scan failed.") + (body.missing ? ` (${body.missing})` : "") }
  switch (body.phase) {
    case "started":
      return { ok: true, message: body.started ? `Started ${body.runs} Apify runs for ${body.week}. Come back in a few minutes and click again to collect.` : `A scan for ${body.week} is already running.` }
    case "waiting":
      return { ok: true, message: `Still running: ${(body.pending as string[]).join(", ")}. Try again in a minute.` }
    case "collected":
      return { ok: true, message: `Collected ${body.questions} new questions, ${body.suggestions} ideas.${(body.errors as string[])?.length ? ` Errors: ${(body.errors as string[]).join("; ")}` : ""}` }
    case "ranked":
      return { ok: true, message: `Ranked ${body.questions} questions into ${body.suggestions} ideas.` }
    default:
      return { ok: true, message: `Scan for ${body.week} is ${body.status}. The next one starts on Friday.` }
  }
}
