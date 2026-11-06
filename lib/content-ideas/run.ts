import "server-only"
import { apifyConfigured } from "./apify"
import { collectScan, latestScan, markScan, startScan } from "./collect"
import { isoWeek } from "./model"
import { rankScan, rankingConfigured } from "./rank"

/**
 * One step of the weekly scan, shared by the cron route and the "Scan now" button: no row for this week → start the
 * Apify runs; a `running` row → collect their datasets and rank; a `ranking` row (a collect that died before
 * ranking) → rank again. Idempotent: a doubled call reports what it found instead of starting twice.
 */
export type ScanStep = { status: number; body: Record<string, unknown> }

export async function runScanStep(now = new Date()): Promise<ScanStep> {
  if (!apifyConfigured()) return { status: 503, body: { error: "not_configured", missing: "APIFY_API_KEY" } }
  const week = isoWeek(now)
  const latest = await latestScan()
  try {
    if (!latest || latest.week !== week) {
      const { scan, started } = await startScan(week)
      return { status: 200, body: { phase: "started", week, started, runs: scan.apify_runs.length, error: scan.error } }
    }
    if (latest.status === "running") {
      const result = await collectScan(latest)
      if (result.state === "waiting") return { status: 200, body: { phase: "waiting", week, pending: result.pending } }
      if (!rankingConfigured()) {
        await markScan(latest.id, { status: "error", error: "ANTHROPIC_API_KEY missing", finished_at: now.toISOString() })
        return { status: 503, body: { phase: "collected", week, questions: result.inserted, ranking: "not_configured" } }
      }
      const ranked = await rankScan({ ...latest, status: "ranking", stats: result.stats })
      return { status: 200, body: { phase: "collected", week, questions: result.inserted, perSource: result.perSource, errors: result.errors, suggestions: ranked.suggestions } }
    }
    if (latest.status === "ranking") {
      if (!rankingConfigured()) return { status: 503, body: { error: "not_configured", missing: "ANTHROPIC_API_KEY" } }
      const ranked = await rankScan(latest)
      return { status: 200, body: { phase: "ranked", week, ...ranked } }
    }
    return { status: 200, body: { phase: "idle", week, status: latest.status, stats: latest.stats } }
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    console.error("[content-scan]", message)
    if (latest?.week === week) await markScan(latest.id, { status: "error", error: message, finished_at: now.toISOString() })
    return { status: 500, body: { error: message } }
  }
}
