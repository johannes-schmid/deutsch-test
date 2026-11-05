import { google, type searchconsole_v1 } from "googleapis"
import type { BingDay, GscDay } from "./seo-model"

/**
 * Live numbers for `/admin/seo`, next to Friday's snapshot.
 *
 * The snapshot ends three days before Friday, so on Monday it is already ten days old. Search
 * Console returns the fresh days up to today with `dataState: 'all'`; they are preliminary and the
 * page says so. Same service account as the collector (`GSC_SA_JSON` on Vercel). Without a key or
 * on an error: `null`, and the page falls back to the snapshot: unknown, never zero.
 *
 * Half an hour in the function's memory: the page is for the owner only, and Search Console
 * itself refreshes only a few times a day.
 */

const SITE = "sc-domain:deutschtest-ueben.de"
const BRAND = "deutschtest[- ]?[uü]e?ben"
const TTL = 30 * 60_000
/** A Google error (often a short 502) must not pin the page to the snapshot for half an hour. */
const ERROR_TTL = 60_000
/** The first day the site could have had data: the scaffold date. */
const FIRST_DAY = "2026-10-11"

type Totals = { clicks: number; impressions: number; position: number | null }
export type PageRow = { page: string; impressions: number; clicks: number; position: number }

export type LiveGsc = {
  fetchedAt: string
  daily: GscDay[]
  windows: { current: { start: string; end: string }; previous: { start: string; end: string } }
  totals: { current: Totals; previous: Totals }
  nonBrand: { current: Totals; previous: Totals }
  /** `current` is the same 28-day window as `windows.current`: the basis of the page score. `previous` is its `demand`. */
  pages: { current: PageRow[]; previous: PageRow[] }
  /** Query × page since the first day, for a page's drawer. Only rows with ≥ 2 impressions. */
  queryPage: { query: string; page: string; impressions: number; position: number }[]
}

let gscCache: { at: number; value: LiveGsc | { error: string } } | null = null
let bingCache: { at: number; value: BingDay[] | null } | null = null

const ymd = (d: Date) => d.toISOString().slice(0, 10)
const addDays = (d: string, n: number) => {
  const x = new Date(`${d}T00:00:00Z`)
  x.setUTCDate(x.getUTCDate() + n)
  return ymd(x)
}

function creds(): { client_email: string; private_key: string } | null {
  const raw = process.env.GSC_SA_JSON
  if (!raw) return null
  return JSON.parse(raw.trim().replace(/^'([\s\S]*)'$/, "$1"))
}

export async function fetchLiveGsc(now = new Date()): Promise<LiveGsc | { error: string } | null> {
  if (gscCache && Date.now() - gscCache.at < ("error" in gscCache.value ? ERROR_TTL : TTL)) return gscCache.value

  let c: ReturnType<typeof creds>
  try {
    c = creds()
  } catch {
    return { error: "GSC_SA_JSON is not valid JSON" }
  }
  if (!c) return null

  const auth = new google.auth.JWT({ email: c.client_email, key: c.private_key, scopes: ["https://www.googleapis.com/auth/webmasters.readonly"] })
  const sc = google.searchconsole({ version: "v1", auth })
  type Body = Pick<searchconsole_v1.Schema$SearchAnalyticsQueryRequest, "startDate" | "endDate" | "dimensions" | "dimensionFilterGroups">
  const once = async (body: Body) => (await sc.searchanalytics.query({ siteUrl: SITE, requestBody: { rowLimit: 25000, dataState: "all", type: "web", ...body } })).data.rows ?? []
  // One retry: Search Console occasionally returns a 502 that is gone a second later.
  const query = async (body: Body) => {
    try {
      return await once(body)
    } catch {
      await new Promise((r) => setTimeout(r, 800))
      return once(body)
    }
  }

  const today = ymd(now)
  const current = { start: addDays(today, -27), end: today }
  const previous = { start: addDays(today, -55), end: addDays(today, -28) }
  const nonBrand: searchconsole_v1.Schema$ApiDimensionFilterGroup[] = [{ filters: [{ dimension: "query", operator: "excludingRegex", expression: BRAND }] }]
  const total = (rows: { clicks?: number | null; impressions?: number | null; position?: number | null }[]): Totals => ({ clicks: rows[0]?.clicks ?? 0, impressions: rows[0]?.impressions ?? 0, position: rows[0]?.position ?? null })
  const pages = (rows: { keys?: string[] | null; clicks?: number | null; impressions?: number | null; position?: number | null }[]): PageRow[] =>
    rows.map((r) => ({ page: r.keys![0], clicks: r.clicks ?? 0, impressions: r.impressions ?? 0, position: r.position ?? 0 }))

  try {
    const [daily, cur, prev, nbCur, nbPrev, curPages, prevPages, qp] = await Promise.all([
      query({ startDate: FIRST_DAY, endDate: today, dimensions: ["date"] }),
      query({ startDate: current.start, endDate: current.end }),
      query({ startDate: previous.start, endDate: previous.end }),
      query({ startDate: current.start, endDate: current.end, dimensionFilterGroups: nonBrand }),
      query({ startDate: previous.start, endDate: previous.end, dimensionFilterGroups: nonBrand }),
      query({ startDate: current.start, endDate: current.end, dimensions: ["page"] }),
      query({ startDate: previous.start, endDate: previous.end, dimensions: ["page"] }),
      query({ startDate: FIRST_DAY, endDate: today, dimensions: ["query", "page"] }),
    ])
    const value: LiveGsc = {
      fetchedAt: new Date().toISOString(),
      daily: daily.map((r) => ({ date: r.keys![0], clicks: r.clicks ?? 0, impressions: r.impressions ?? 0 })),
      windows: { current, previous },
      totals: { current: total(cur), previous: total(prev) },
      nonBrand: { current: total(nbCur), previous: total(nbPrev) },
      pages: { current: pages(curPages), previous: pages(prevPages) },
      queryPage: qp.filter((r) => (r.impressions ?? 0) >= 2).map((r) => ({ query: r.keys![0], page: r.keys![1], impressions: r.impressions ?? 0, position: r.position ?? 0 })),
    }
    gscCache = { at: Date.now(), value }
    return value
  } catch (e) {
    const raw = e instanceof Error ? e.message : ""
    const code = /\b(4\d\d|5\d\d)\b/.exec(raw)?.[1]
    const value = { error: raw.trimStart().startsWith("<") || code ? `Google returned an error${code ? ` (${code})` : ""}, retrying in a minute` : raw.slice(0, 120) || "request failed" }
    gscCache = { at: Date.now(), value }
    return value
  }
}

/** Bing does not lag; with `BING_API_KEY` the page fetches it live, otherwise the snapshot stays. */
export async function fetchLiveBing(): Promise<BingDay[] | null> {
  const key = process.env.BING_API_KEY
  if (!key) return null
  if (bingCache && Date.now() - bingCache.at < TTL) return bingCache.value
  let value: BingDay[] | null = null
  try {
    const res = await fetch(`https://ssl.bing.com/webmaster/api.svc/json/GetRankAndTrafficStats?siteUrl=${encodeURIComponent("https://deutschtest-ueben.de/")}&apikey=${key}`, { cache: "no-store" })
    if (res.ok) value = ((await res.json()) as { d?: BingDay[] }).d ?? null
  } catch {
    value = null
  }
  bingCache = { at: Date.now(), value }
  return value
}
