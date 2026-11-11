/**
 * The funnel of `/admin/seo`, pure: from a visit out of a search engine or an AI assistant to a payment, per
 * landing page. The rows come from GA4 (`seo-funnel.ts`); only the sum lives here, so it is tested.
 *
 * **Why GA4:** only GA4 ties an event to the landing page of its session. The steps are the client events
 * `lib/analytics.ts` sends (only with "Statistik" consent, so every number is a floor): a free test or a
 * Modelltest started, a Google sign-up, the checkout button, and the purchase with its amount as `value`.
 *
 * Users are counted per landing page; someone who landed on two pages counts twice. That doesn't matter
 * for comparing pages, it does for an exact total, and the page says so.
 */

export type FunnelStep = "visits" | "practice" | "account" | "checkout" | "paid"
export type FunnelCounts = Record<FunnelStep, number> & { revenue: number }
export type PageKind = "practice" | "landing" | "blog" | "other"

export const STEPS: FunnelStep[] = ["visits", "practice", "account", "checkout", "paid"]

export const STEP_EVENTS: Record<Exclude<FunnelStep, "visits">, string[]> = {
  practice: ["test_start", "modeltest_start"],
  account: ["sign_up"],
  checkout: ["begin_checkout"],
  paid: ["purchase"],
}

export const FUNNEL_EVENTS = Object.values(STEP_EVENTS).flat()

const STEP_OF_EVENT = new Map(
  (Object.entries(STEP_EVENTS) as [Exclude<FunnelStep, "visits">, string[]][]).flatMap(([step, evs]) => evs.map((e) => [e, step] as const)),
)

export const emptyCounts = (): FunnelCounts => ({ visits: 0, practice: 0, account: 0, checkout: 0, paid: 0, revenue: 0 })

const ENGINES: [RegExp, string][] = [
  [/chatgpt|openai/i, "ChatGPT"],
  [/perplexity/i, "Perplexity"],
  [/gemini|bard/i, "Gemini"],
  [/copilot/i, "Copilot"],
  [/claude/i, "Claude"],
]

/** Which AI assistant is behind a GA4 source. Perplexity often arrives as "Unassigned". */
export function aiEngine(source: string): string | null {
  return ENGINES.find(([re]) => re.test(source))?.[1] ?? null
}

export function isSearchSession(channel: string, source: string): boolean {
  return channel === "Organic Search" || channel === "AI Assistant" || aiEngine(source) !== null
}

export function normalisePath(landing: string): string | null {
  if (!landing || !landing.startsWith("/")) return null
  let p = landing.split("?")[0]
  try {
    p = decodeURI(p)
  } catch {}
  return p.length > 1 ? p.replace(/\/+$/, "") : p
}

/** The sections of `seo-agent/pages.json` folded into four kinds; core, translations and legal are "other". */
export function kindOfSection(section: string): PageKind {
  if (section === "practice" || section === "landing" || section === "blog") return section
  return "other"
}

export type SessionRow = { page: string; channel: string; source: string; sessions: number }
export type EventRow = { page: string; channel: string; source: string; event: string; users: number; value: number }

export type Funnel = {
  byPage: Record<string, FunnelCounts>
  total: FunnelCounts
  ai: { engine: string; sessions: number }[]
}

const cents = (x: number) => Math.round(x * 100) / 100

export function buildFunnel(sessions: SessionRow[], events: EventRow[]): Funnel {
  const byPage: Record<string, FunnelCounts> = {}
  const total = emptyCounts()
  const ai = new Map<string, number>()
  const at = (page: string) => {
    const p = normalisePath(page)
    return p ? (byPage[p] ??= emptyCounts()) : null
  }

  for (const r of sessions) {
    if (!isSearchSession(r.channel, r.source)) continue
    total.visits += r.sessions
    const c = at(r.page)
    if (c) c.visits += r.sessions
    const engine = aiEngine(r.source)
    if (engine) ai.set(engine, (ai.get(engine) ?? 0) + r.sessions)
  }
  for (const r of events) {
    const step = STEP_OF_EVENT.get(r.event)
    if (!step || !isSearchSession(r.channel, r.source)) continue
    total[step] += r.users
    const c = at(r.page)
    if (c) c[step] += r.users
    if (step === "paid") {
      total.revenue += r.value
      if (c) c.revenue += r.value
    }
  }
  total.revenue = cents(total.revenue)
  for (const c of Object.values(byPage)) c.revenue = cents(c.revenue)

  return { byPage, total, ai: [...ai].map(([engine, n]) => ({ engine, sessions: n })).sort((a, b) => b.sessions - a.sessions) }
}

export function rollupByKind(byPage: Record<string, FunnelCounts>, kindOf: (path: string) => PageKind | null): Record<PageKind, FunnelCounts> {
  const out: Record<PageKind, FunnelCounts> = { practice: emptyCounts(), landing: emptyCounts(), blog: emptyCounts(), other: emptyCounts() }
  for (const [path, c] of Object.entries(byPage)) {
    const k = kindOf(path) ?? "other"
    for (const key of [...STEPS, "revenue"] as const) out[k][key] += c[key]
  }
  for (const k of Object.keys(out) as PageKind[]) out[k].revenue = cents(out[k].revenue)
  return out
}

/** Below 20 visits every conversion is chance. */
export const MIN_VISITS = 20

/** The step where relatively the most people drop off, or null with too little traffic. */
export function weakestStep(c: FunnelCounts): Exclude<FunnelStep, "visits"> | null {
  if (c.visits < MIN_VISITS) return null
  let worst: Exclude<FunnelStep, "visits"> | null = null
  let lowest = Infinity
  for (let i = 1; i < STEPS.length; i++) {
    const prev = c[STEPS[i - 1]]
    if (!prev) break
    const r = c[STEPS[i]] / prev
    if (r < lowest) {
      lowest = r
      worst = STEPS[i] as Exclude<FunnelStep, "visits">
    }
  }
  return worst
}

export const rate = (num: number, den: number) => (den ? num / den : null)

export type IndexState = "indexed" | "not-indexed" | "discovered" | "canonical" | "unknown"
export type IndexRecord = { verdict: string; coverage: string; lastCrawl?: string | null }

/**
 * "Discovered" is not "crawled, not indexed": the first is waiting, the second a judgement. An alternate
 * page with a proper canonical is out of the index on purpose: not a problem.
 */
export function indexState(r: IndexRecord | undefined): IndexState {
  if (!r) return "unknown"
  if (r.verdict === "PASS") return "indexed"
  if (/^discovered/i.test(r.coverage)) return "discovered"
  if (/^alternate page with proper canonical/i.test(r.coverage)) return "canonical"
  return "not-indexed"
}

export const missingFromGoogle = (s: IndexState | "noindex") => s === "not-indexed" || s === "discovered"
