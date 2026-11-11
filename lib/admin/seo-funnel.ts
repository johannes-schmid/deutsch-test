import { google } from "googleapis"
import { buildFunnel, FUNNEL_EVENTS, type EventRow, type Funnel, type SessionRow } from "./seo-funnel-model"

/**
 * The funnel of `/admin/seo` live from GA4: the last 28 days, per landing page, only visits from search
 * engines and AI assistants. Two reports: sessions, and the funnel events with their value. The sum is in
 * `seo-funnel-model.ts`.
 *
 * Auth: the same service account as Search Console (`GSC_SA_JSON`, or its own `GA4_SA_JSON`) with Viewer on
 * the GA4 property in `GA4_PROPERTY_ID`. Missing key or an error → `{ error }`: unknown, never zero; a funnel
 * that says "0 visits" when a key expired points at the wrong step. Cached half an hour like `seo-live.ts`.
 */

const TTL = 30 * 60_000
const ERROR_TTL = 60_000
const RANGE = [{ startDate: "27daysAgo", endDate: "today" }]
const DIMS = [{ name: "landingPage" }, { name: "sessionDefaultChannelGroup" }, { name: "sessionSource" }]

export type LiveFunnel = Funnel & { fetchedAt: string }

let cache: { at: number; value: LiveFunnel | { error: string } } | null = null

type Row = { dimensionValues?: { value?: string | null }[] | null; metricValues?: { value?: string | null }[] | null }
const dim = (r: Row, i: number) => r.dimensionValues?.[i]?.value ?? ""
const met = (r: Row, i: number) => Number(r.metricValues?.[i]?.value ?? 0) || 0

function client() {
  const raw = process.env.GA4_SA_JSON ?? process.env.GSC_SA_JSON
  if (!raw) throw new Error("GSC_SA_JSON missing")
  if (!process.env.GA4_PROPERTY_ID) throw new Error("GA4_PROPERTY_ID missing")
  let creds: { client_email: string; private_key: string }
  try {
    creds = JSON.parse(raw.trim().replace(/^'([\s\S]*)'$/, "$1"))
  } catch {
    throw new Error("GSC_SA_JSON is not valid JSON")
  }
  const auth = new google.auth.JWT({ email: creds.client_email, key: creds.private_key, scopes: ["https://www.googleapis.com/auth/analytics.readonly"] })
  return google.analyticsdata({ version: "v1beta", auth })
}

async function load(): Promise<LiveFunnel | { error: string }> {
  let ga: ReturnType<typeof client>
  try {
    ga = client()
  } catch (err) {
    return { error: err instanceof Error ? err.message : "GA4 key unreadable" }
  }
  const property = `properties/${process.env.GA4_PROPERTY_ID}`
  try {
    const [s, e] = await Promise.all([
      ga.properties.runReport({ property, requestBody: { dateRanges: RANGE, dimensions: DIMS, metrics: [{ name: "sessions" }], limit: "25000" } }),
      ga.properties.runReport({
        property,
        requestBody: {
          dateRanges: RANGE,
          dimensions: [...DIMS, { name: "eventName" }],
          metrics: [{ name: "totalUsers" }, { name: "eventValue" }],
          dimensionFilter: { filter: { fieldName: "eventName", inListFilter: { values: FUNNEL_EVENTS } } },
          limit: "25000",
        },
      }),
    ])
    const sessions: SessionRow[] = (s.data.rows ?? []).map((r) => ({ page: dim(r, 0), channel: dim(r, 1), source: dim(r, 2), sessions: met(r, 0) }))
    const events: EventRow[] = (e.data.rows ?? []).map((r) => ({ page: dim(r, 0), channel: dim(r, 1), source: dim(r, 2), event: dim(r, 3), users: met(r, 0), value: met(r, 1) }))
    return { ...buildFunnel(sessions, events), fetchedAt: new Date().toISOString() }
  } catch (err) {
    return { error: err instanceof Error ? err.message : "GA4 report failed" }
  }
}

export async function fetchSeoFunnel(): Promise<LiveFunnel | { error: string }> {
  if (cache && Date.now() - cache.at < ("error" in cache.value ? ERROR_TTL : TTL)) return cache.value
  const value = await load()
  cache = { at: Date.now(), value }
  return value
}
