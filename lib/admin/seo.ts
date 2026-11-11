import { readFile, readdir } from "node:fs/promises"
import path from "node:path"
import { expectedSnapshotWeek, isLive, markPreliminary, mergeDaily, nextCollectDate, parseBingDate, parseSourceStatus, trendRead, type BingDay, type DayPoint, type GscDay, type LedgerEntry, type Recommendation, type SourceState, type TrendRead } from "./seo-model"
import { fetchLiveBing, fetchLiveGsc, type LiveGsc, type PageRow } from "./seo-live"
import type { IndexRecord } from "./seo-funnel-model"
import { pageScore, pageWeight, rollup, type HistoryRow, type ScoreFactor, type ScoreInput, type Verdict } from "./seo-score.mjs"

/**
 * The source of `/admin/seo`: the files the SEO loop puts in the repo.
 *
 * Friday evening `.github/workflows/seo-collect.yml` commits a snapshot on `main`, and that commit
 * deploys. So this page reads the deploy's disk and needs no database or key of its own.
 * `outputFileTracingIncludes` in `next.config.ts` makes sure `seo-agent/` is in the function.
 */

const ROOT = path.join(process.cwd(), "seo-agent")
const SITE_KEY = "deutschtest"
const SITE_DOMAIN = "deutschtest-ueben.de"
const SITE_ORIGIN = `https://${SITE_DOMAIN}`
// TODO(hannes): set the GitHub repo slug so the report and PR links on /admin/seo resolve.
const REPO = process.env.SEO_REPO ?? "johannes-schmid/deutsch-test"
export const REPO_URL = `https://github.com/${REPO}`

type Totals = { clicks: number; impressions: number; ctr: number; position: number }
type GscPageRow = { keys: [string]; clicks: number; impressions: number; position: number }
type GscSite = {
  property?: string
  error?: string
  windows?: { current: { start: string; end: string }; previous: { start: string; end: string } }
  current?: { page?: GscPageRow[]; query_page?: { keys: [string, string]; clicks: number; impressions: number; position: number }[] }
  previous?: { page?: GscPageRow[] }
  daily?: GscDay[]
  totals?: { current: Totals; previous: Totals }
  non_brand?: { current: Totals; previous: Totals }
}
type BingSite = { GetRankAndTrafficStats?: BingDay[]; error?: string }
type HealthSite = { sitemap?: { status: number; url_count: number }; status_counts?: Record<string, number>; problems?: Record<string, string[]>; orphans?: string[]; error?: string }
type GeoSnapshot = { citation_share?: Record<string, number | null>; top_cited?: { domain: string; n: number }[]; prompt_count?: number; engines?: string[] }

export type SourceRow = { key: string; label: string } & SourceState
export type Window28 = { clicks: number; impressions: number; prevClicks: number; prevImpressions: number }
export type NearQuery = { query: string; page: string; impressions: number; clicks: number; position: number }

/** A page from the triage with its live numbers, its score and what to do about it. `now: null` = unknown. */
export type StructurePage = {
  path: string
  section: string
  verdict: Verdict
  reason: string
  plan: { action: string; owner: string; week?: string; into?: string } | null
  /** Impressions in the previous 28-day window. */
  demand: number
  now: { impressions: number; clicks: number; position: number | null } | null
  queries: { query: string; impressions: number; position: number }[]
  issues: string[]
  score: number
  factors: ScoreFactor[]
  weight: number
  recs: Pick<Recommendation, "id" | "task" | "owner" | "priority" | "steps" | "why" | "expect" | "status">[]
}
export type SiteStructure = {
  updated: string
  sections: { key: string; label: string; note: string; score: number | null }[]
  pages: StructurePage[]
  site: number | null
  history: HistoryRow[]
  live: boolean
}
export type LiveState = { state: "live" | "snapshot" | "error"; detail: string; fetchedAt: string | null; bingLive: boolean }

export type SeoCockpit = {
  latestWeek: string | null
  generatedAt: string | null
  expectedWeek: string
  nextCollect: string
  sources: SourceRow[]
  live: LiveState
  daily: DayPoint[]
  structure: SiteStructure | null
  trend: TrendRead
  google: { windows: GscSite["windows"] | null; totals: GscSite["totals"] | null; nonBrand: GscSite["non_brand"] | null; error: string | null; near: NearQuery[] }
  bing: Window28 | null
  geo: { share: number | null; topCited: { domain: string; n: number }[]; prompts: number; engines: string[] } | null
  health: { urlCount: number | null; ok: number; errors: { url: string; issues: string[] }[]; lengthIssues: number; orphans: number } | null
  ledger: LedgerEntry[]
  recommendations: Recommendation[]
  ownerBudget: number
  reports: { name: string; href: string }[]
  /** URL Inspection per page from the newest week that has it; `null` = never checked. */
  indexing: { checkedAt: string; pages: Record<string, IndexRecord> } | null
}

async function json<T>(file: string): Promise<T | null> {
  try {
    return JSON.parse(await readFile(path.join(ROOT, file), "utf8")) as T
  } catch {
    return null
  }
}

async function list(dir: string): Promise<string[]> {
  try {
    return (await readdir(path.join(ROOT, dir))).sort()
  } catch {
    return []
  }
}

/** The last 28 days with Bing data against the 28 before. */
function bingWindow(rows: BingDay[] | undefined | null): Window28 | null {
  if (!rows?.length) return null
  const sorted = rows
    .map((r) => ({ date: parseBingDate(r.Date), c: r.Clicks, i: r.Impressions }))
    .filter((r) => r.date)
    .sort((a, b) => a.date!.localeCompare(b.date!))
  const cur = sorted.slice(-28)
  const prev = sorted.slice(-56, -28)
  const sum = (xs: typeof sorted, k: "c" | "i") => xs.reduce((s, x) => s + x[k], 0)
  return { clicks: sum(cur, "c"), impressions: sum(cur, "i"), prevClicks: sum(prev, "c"), prevImpressions: sum(prev, "i") }
}

const SOURCE_LABELS: Record<string, string> = { gsc: "Search Console", bing: "Bing Webmaster", health: "Health check", competitors: "Competitors", geo: "AI search engines", indexing: "Indexing", backlinks: "Backlinks" }

const LENGTH_ISSUE = /^(title|description) \d+ chars$/

export async function loadSeoCockpit(now = new Date()): Promise<SeoCockpit> {
  const weeks = (await list("data")).filter((d) => /^\d{4}-W\d{2}$/.test(d))
  const latestWeek = weeks.at(-1) ?? null

  const triage = await json<Triage>("pages.json")
  const [liveGsc, liveBing, index, gsc, bing, health, geo, ledger, recs, config, history, reportFiles, scoreHistory] = await Promise.all([
    fetchLiveGsc(now),
    fetchLiveBing(),
    latestWeek ? json<{ generated_at: string; sources: Record<string, string> }>(`data/${latestWeek}/index.json`) : null,
    latestWeek ? json<{ sites?: Record<string, GscSite> }>(`data/${latestWeek}/gsc.json`) : null,
    latestWeek ? json<{ sites?: Record<string, BingSite> }>(`data/${latestWeek}/bing.json`) : null,
    latestWeek ? json<{ sites?: Record<string, HealthSite> }>(`data/${latestWeek}/health.json`) : null,
    latestWeek ? json<GeoSnapshot & { skipped?: string }>(`data/${latestWeek}/geo.json`) : null,
    json<{ entries: LedgerEntry[] }>("ledger.json"),
    json<{ items: Recommendation[] }>("recommendations.json"),
    json<{ rules: { owner_minutes_per_week?: number } }>("config.json"),
    list("data/history"),
    list("reports"),
    json<{ rows: HistoryRow[] }>("data/history/health.json"),
  ])

  // Old → new: first the backfills, then every week; the newest snapshot wins per day.
  const googleRuns: GscDay[][] = []
  for (const f of history.filter((f) => f.startsWith("gsc-daily-"))) {
    const h = await json<{ sites?: Record<string, GscDay[]> }>(`data/history/${f}`)
    const run = h?.sites?.[SITE_KEY]
    if (run) googleRuns.push(run)
  }
  for (const w of weeks) {
    const g = w === latestWeek ? gsc : await json<{ sites?: Record<string, GscSite> }>(`data/${w}/gsc.json`)
    const d = g?.sites?.[SITE_KEY]?.daily
    if (d) googleRuns.push(d)
  }
  let indexing: SeoCockpit["indexing"] = null
  for (const w of [...weeks].reverse()) {
    const snap = await json<{ generated_at: string; pages?: Record<string, IndexRecord> }>(`data/${w}/indexing.json`)
    if (snap?.pages) {
      indexing = { checkedAt: snap.generated_at, pages: snap.pages }
      break
    }
  }
  const live = liveGsc && !("error" in liveGsc) ? liveGsc : null
  if (live) googleRuns.push(live.daily)
  const bingRows = liveBing ?? bing?.sites?.[SITE_KEY]?.GetRankAndTrafficStats ?? []
  const today = now.toISOString().slice(0, 10)
  const daily = markPreliminary(mergeDaily(googleRuns, Array.isArray(bingRows) ? bingRows : []), today)

  const g = gsc?.sites?.[SITE_KEY]
  const near: NearQuery[] = (g?.current?.query_page ?? [])
    .filter((r) => r.position >= 4 && r.position <= 20 && r.impressions >= 5)
    .sort((a, b) => b.impressions - a.impressions)
    .slice(0, 6)
    .map((r) => ({ query: r.keys[0], page: r.keys[1], impressions: r.impressions, clicks: r.clicks, position: r.position }))

  const h = health?.sites?.[SITE_KEY]
  const problems = Object.entries(h?.problems ?? {})
  const errors = problems.map(([url, issues]) => ({ url, issues: issues.filter((i) => !LENGTH_ISSUE.test(i)) })).filter((p) => p.issues.length > 0)

  const asTotals = (t: { clicks: number; impressions: number; position: number | null }): Totals => ({ clicks: t.clicks, impressions: t.impressions, ctr: t.impressions ? t.clicks / t.impressions : 0, position: t.position ?? 0 })

  return {
    latestWeek,
    generatedAt: index?.generated_at ?? null,
    expectedWeek: expectedSnapshotWeek(now),
    nextCollect: nextCollectDate(now),
    sources: Object.entries(SOURCE_LABELS).map(([key, label]) => ({ key, label, ...parseSourceStatus(index?.sources[key]) })),
    live: live
      ? { state: "live", detail: "Search Console, live", fetchedAt: live.fetchedAt, bingLive: !!liveBing }
      : liveGsc && "error" in liveGsc
        ? { state: "error", detail: liveGsc.error, fetchedAt: null, bingLive: !!liveBing }
        : { state: "snapshot", detail: "no Search Console key on this server", fetchedAt: null, bingLive: !!liveBing },
    daily,
    structure: triage ? buildStructure(triage, live, g, h?.problems ?? {}, recs?.items ?? [], scoreHistory?.rows ?? []) : null,
    // The read ignores the preliminary days: half of today would pull the week average down.
    trend: trendRead(daily.filter((p) => !p.preliminary)),
    google: {
      windows: live ? live.windows : (g?.windows ?? null),
      totals: live ? { current: asTotals(live.totals.current), previous: asTotals(live.totals.previous) } : (g?.totals ?? null),
      nonBrand: live ? { current: asTotals(live.nonBrand.current), previous: asTotals(live.nonBrand.previous) } : (g?.non_brand ?? null),
      error: live ? null : (g?.error ?? (g ? null : "no snapshot")),
      near,
    },
    bing: bingWindow(Array.isArray(bingRows) ? bingRows : null),
    geo: geo && !geo.skipped && geo.citation_share ? { share: geo.citation_share[SITE_DOMAIN] ?? null, topCited: geo.top_cited ?? [], prompts: geo.prompt_count ?? 0, engines: geo.engines ?? [] } : null,
    health: h && !h.error ? { urlCount: h.sitemap?.url_count ?? null, ok: h.status_counts?.["200"] ?? 0, errors, lengthIssues: problems.length - errors.length, orphans: h.orphans?.length ?? 0 } : null,
    ledger: ledger?.entries ?? [],
    recommendations: recs?.items ?? [],
    ownerBudget: config?.rules.owner_minutes_per_week ?? 90,
    reports: reportFiles.filter((f) => f.endsWith(".md")).reverse().map((f) => ({ name: f.replace(/\.md$/, ""), href: `${REPO_URL}/blob/main/seo-agent/reports/${f}` })),
    indexing,
  }
}

type Triage = Omit<SiteStructure, "pages" | "sections" | "site" | "history" | "live"> & {
  sections: { key: string; label: string; note: string }[]
  pages: Pick<StructurePage, "path" | "section" | "verdict" | "reason" | "plan" | "demand">[]
}

/**
 * The triage from `pages.json` with, per page, the numbers of the last 28 days (live, else Friday's
 * snapshot), the health check findings, the score and the tasks that name it. The sum lives in
 * `seo-score.mjs`, the same one that writes the weekly row.
 */
function buildStructure(triage: Triage, live: LiveGsc | null, snapshot: GscSite | undefined, problems: Record<string, string[]>, recommendations: Recommendation[], history: HistoryRow[]): SiteStructure {
  const key = (url: string) => decodeURI(url.replace(SITE_ORIGIN, "")) || "/"
  const fromSnap = (rows?: GscPageRow[]): PageRow[] | null => (rows ? rows.map((r) => ({ page: r.keys[0], clicks: r.clicks, impressions: r.impressions, position: r.position })) : null)
  const rows: PageRow[] | null = live ? live.pages.current : fromSnap(snapshot?.current?.page)
  const before: PageRow[] | null = live ? live.pages.previous : fromSnap(snapshot?.previous?.page)
  const now = new Map(rows?.map((r) => [key(r.page), r]) ?? [])
  const demand = new Map(before?.map((r) => [key(r.page), r.impressions]) ?? [])
  const issues = new Map(Object.entries(problems).map(([url, list]) => [key(url), list]))
  const queries = new Map<string, StructurePage["queries"]>()
  for (const r of live?.queryPage ?? []) {
    const k = key(r.page)
    queries.set(k, [...(queries.get(k) ?? []), { query: r.query, impressions: r.impressions, position: r.position }])
  }
  const openRecs = recommendations.filter(isLive)

  const inputs: ScoreInput[] = triage.pages.map((p) => {
    const r = now.get(p.path)
    return {
      path: p.path, section: p.section, verdict: p.verdict,
      demand: before ? (demand.get(p.path) ?? 0) : p.demand,
      now: rows ? { impressions: r?.impressions ?? 0, position: r ? r.position : null } : null,
      issues: issues.get(p.path) ?? [],
    }
  })
  const totals = rollup(inputs)

  const pages: StructurePage[] = triage.pages.map((p, i) => {
    const input = inputs[i]
    const { score, factors } = pageScore(input)
    const r = now.get(p.path)
    return {
      ...p,
      demand: input.demand,
      now: rows ? { impressions: r?.impressions ?? 0, clicks: r?.clicks ?? 0, position: r ? r.position : null } : null,
      queries: (queries.get(p.path) ?? []).sort((a, b) => b.impressions - a.impressions).slice(0, 5),
      issues: input.issues,
      score,
      factors,
      weight: pageWeight(input),
      recs: openRecs.filter((x) => x.pages?.includes(p.path)).map(({ id, task, owner, priority, steps, why, expect, status }) => ({ id, task, owner, priority, steps, why, expect, status })),
    }
  })

  return {
    updated: triage.updated,
    sections: triage.sections.map((s) => ({ ...s, score: totals.sections[s.key] ?? null })),
    pages,
    site: totals.site,
    history,
    live: !!live,
  }
}

export type SeoPull = { number: number; title: string; url: string; branch: string; createdAt: string; draft: boolean }

/** The loop's open PRs, straight from GitHub. `null` is unknown, `[]` is none. A private repo needs `GITHUB_TOKEN`. */
export async function fetchSeoPulls(): Promise<SeoPull[] | null> {
  try {
    const res = await fetch(`https://api.github.com/repos/${REPO}/pulls?state=open&per_page=50`, {
      headers: { Accept: "application/vnd.github+json", ...(process.env.GITHUB_TOKEN ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` } : {}) },
      next: { revalidate: 600 },
    })
    if (!res.ok) return null
    const rows = (await res.json()) as { number: number; title: string; html_url: string; head: { ref: string }; created_at: string; draft: boolean }[]
    return rows.filter((r) => /seo/i.test(r.head.ref) || /^seo\b/i.test(r.title)).map((r) => ({ number: r.number, title: r.title, url: r.html_url, branch: r.head.ref, createdAt: r.created_at, draft: r.draft }))
  } catch {
    return null
  }
}
