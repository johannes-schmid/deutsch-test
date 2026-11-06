import "server-only"
import config from "@/seo-agent/config.json"
import { createAdminClient } from "@/lib/supabase/admin"
import { datasetItems, runFinished, runStatus, startRun } from "./apify"
import { dedupeAgainst, mapGoogleItems, mapRedditItems, type CommunityConfig, type QuestionRow } from "./model"

/**
 * The two halves of a scan. `startScan` fires the Apify Actors and records their run ids on a `content_scans` row;
 * `collectScan` reads the finished datasets into `content_questions`. The questions of this week are what
 * rank.ts hands to Claude. Sources and limits live in seo-agent/config.json › community.
 */

export const community = config.community as CommunityConfig

export type ApifyRef = { source: "reddit" | "google"; runId: string; datasetId: string }
export type ScanRow = { id: string; week: string; status: "running" | "ranking" | "done" | "error"; apify_runs: ApifyRef[]; started_at: string; finished_at: string | null; error: string | null; stats: Record<string, unknown> }

const REDDIT_ACTOR = "harshmaur~reddit-scraper"
const GOOGLE_ACTOR = "apify~google-search-scraper"

/** Keyword searches across Reddit (harshmaur/reddit-scraper, 2026-11-06: trudax/reddit-scraper-lite was blocked by Reddit on every search). */
function redditInput(c: CommunityConfig["reddit"]) {
  return {
    searchTerms: c.searches,
    searchPosts: true,
    searchComments: false,
    searchCommunities: false,
    searchSort: "relevance",
    searchTime: c.time,
    crawlCommentsPerPost: false,
    includeNSFW: false,
    maxPostsCount: Math.max(5, Math.ceil(c.max_posts / Math.max(1, c.searches.length))),
  }
}

function googleInput(c: CommunityConfig["google"]) {
  return { queries: c.queries.join("\n"), maxPagesPerQuery: 1, countryCode: c.country, languageCode: c.language, searchLanguage: c.language, saveHtmlToKeyValueStore: false }
}

export async function latestScan(): Promise<ScanRow | null> {
  const { data } = await createAdminClient().from("content_scans").select("*").order("started_at", { ascending: false }).limit(1).maybeSingle()
  return (data as ScanRow | null) ?? null
}

export async function scanForWeek(week: string): Promise<ScanRow | null> {
  const { data } = await createAdminClient().from("content_scans").select("*").eq("week", week).maybeSingle()
  return (data as ScanRow | null) ?? null
}

/** Inserts the week's row and starts both Actors. A second call for the same week returns the existing row untouched. */
export async function startScan(week: string): Promise<{ scan: ScanRow; started: boolean }> {
  const existing = await scanForWeek(week)
  if (existing) return { scan: existing, started: false }
  const db = createAdminClient()
  const { data: inserted, error } = await db.from("content_scans").insert({ week }).select("*").single()
  if (error) throw new Error(error.message)
  const scan = inserted as ScanRow
  const runs: ApifyRef[] = []
  const errors: string[] = []
  for (const [source, actor, input] of [["reddit", REDDIT_ACTOR, redditInput(community.reddit)], ["google", GOOGLE_ACTOR, googleInput(community.google)]] as const) {
    try {
      const run = await startRun(actor, input)
      runs.push({ source, runId: run.id, datasetId: run.defaultDatasetId })
    } catch (err) {
      errors.push(`${source}: ${err instanceof Error ? err.message : String(err)}`)
    }
  }
  const patch = runs.length ? { apify_runs: runs, error: errors.join("; ") || null } : { status: "error", error: errors.join("; ") || "no run started", finished_at: new Date().toISOString() }
  await db.from("content_scans").update(patch).eq("id", scan.id)
  return { scan: { ...scan, ...patch } as ScanRow, started: true }
}

export type CollectResult = { state: "waiting"; pending: string[] } | { state: "collected"; inserted: number; perSource: Record<string, number>; errors: string[]; stats: Record<string, unknown> }

/**
 * When every run has finished, maps the datasets to question rows and stores the new ones. A failed Actor
 * is recorded as an error on the scan, not as zero questions. Returns `waiting` while a run is still going.
 */
export async function collectScan(scan: ScanRow): Promise<CollectResult> {
  const statuses = await Promise.all(scan.apify_runs.map(async (r) => ({ ...r, run: await runStatus(r.runId) })))
  const pending = statuses.filter((s) => !runFinished(s.run.status)).map((s) => s.source)
  if (pending.length) return { state: "waiting", pending }

  const db = createAdminClient()
  const rows: QuestionRow[] = []
  const errors: string[] = []
  const perSource: Record<string, number> = {}
  for (const s of statuses) {
    if (s.run.status !== "SUCCEEDED") {
      errors.push(`${s.source}: ${s.run.status}${s.run.statusMessage ? ` (${s.run.statusMessage})` : ""}`)
      continue
    }
    const items = await datasetItems(s.datasetId)
    const mapped = s.source === "reddit" ? mapRedditItems(items) : mapGoogleItems(items)
    for (const m of mapped) perSource[m.source] = (perSource[m.source] ?? 0) + 1
    rows.push(...mapped)
  }

  const keys = rows.map((r) => r.key)
  const existing = new Set<string>()
  for (let i = 0; i < keys.length; i += 500) {
    const { data } = await db.from("content_questions").select("key").in("key", keys.slice(i, i + 500))
    for (const row of data ?? []) existing.add(row.key as string)
  }
  const fresh = dedupeAgainst(rows, existing)
  if (fresh.length) {
    const { error } = await db.from("content_questions").insert(fresh.map((r) => ({ ...r, scan_id: scan.id })))
    if (error) throw new Error(error.message)
  }
  const stats = { ...scan.stats, questions: perSource, new_questions: fresh.length }
  await db.from("content_scans").update({ status: "ranking", error: errors.join("; ") || null, stats }).eq("id", scan.id)
  return { state: "collected", inserted: fresh.length, perSource, errors, stats }
}

export async function markScan(id: string, patch: Partial<Pick<ScanRow, "status" | "error" | "finished_at" | "stats">>) {
  await createAdminClient().from("content_scans").update(patch).eq("id", id)
}
