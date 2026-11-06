import { createHash } from "node:crypto"
import { z } from "zod"

/**
 * The pure part of the weekly community scan (Hannes, 2026-11-06): what a question row looks like, how an
 * Apify item becomes one, how the same thread is recognised a week later, and what Claude's ranking may
 * return. No I/O here, so every rule has a test. The I/O lives in collect.ts (Apify + Supabase) and
 * rank.ts (Claude).
 */

export const QUESTION_SOURCES = ["reddit", "google_paa", "google_related", "gutefrage"] as const
export type QuestionSource = (typeof QUESTION_SOURCES)[number]

export type QuestionRow = {
  source: QuestionSource
  url: string | null
  title: string
  body: string | null
  score: number
  lang: string | null
  asked_at: string | null
  key: string
}

export type CommunityConfig = {
  reddit: { searches: string[]; max_posts: number; time: "all" | "hour" | "day" | "week" | "month" | "year" }
  google: { queries: string[]; country: string; language: string }
  limits: { max_suggestions_per_week: number; min_evidence: number }
}

export const SUGGESTION_KINDS = ["article", "adjust", "tool"] as const
export type SuggestionKind = (typeof SUGGESTION_KINDS)[number]

const BODY_MAX = 1500
const TITLE_MAX = 300

const clip = (s: string, max: number) => (s.length > max ? `${s.slice(0, max - 1).trimEnd()}…` : s)
const clean = (s: unknown) => (typeof s === "string" ? s.replace(/\s+/g, " ").trim() : "")

/** A URL without protocol, `www.`, query, fragment or trailing slash: what makes two links the same thread. */
export function normaliseUrl(url: string): string {
  try {
    const u = new URL(url)
    const host = u.hostname.toLowerCase().replace(/^www\./, "")
    const path = u.pathname.replace(/\/+$/, "").toLowerCase()
    return `${host}${path}`
  } catch {
    return url.trim().toLowerCase()
  }
}

/** The dedupe key: the normalised URL when there is one, otherwise the source plus the normalised title. */
export function questionKey(source: QuestionSource, url: string | null, title: string): string {
  const basis = url ? normaliseUrl(url) : `${source}:${clean(title).toLowerCase()}`
  return createHash("sha256").update(basis).digest("hex").slice(0, 32)
}

/** Reddit scraper items (harshmaur/reddit-scraper; the lite actor's field names are read too): only posts with a title become questions. */
export function mapRedditItems(items: unknown[]): QuestionRow[] {
  const rows: QuestionRow[] = []
  for (const raw of items) {
    const it = raw as Record<string, unknown>
    if (it.dataType !== "post") continue
    const title = clean(it.title)
    if (!title) continue
    const link = [it.postUrl, it.url].find((u) => typeof u === "string" && u)
    const url = typeof link === "string" ? link : null
    const body = clean(it.body)
    const up = typeof it.upVotes === "number" ? it.upVotes : typeof it.score === "number" ? it.score : 0
    const comments = typeof it.commentsCount === "number" ? it.commentsCount : typeof it.numberOfComments === "number" ? it.numberOfComments : 0
    rows.push({
      source: "reddit",
      url,
      title: clip(title, TITLE_MAX),
      body: body ? clip(body, BODY_MAX) : null,
      score: up + comments,
      lang: null,
      asked_at: typeof it.createdAt === "string" ? it.createdAt : null,
      key: questionKey("reddit", url, title),
    })
  }
  return rows
}

type GoogleItem = {
  searchQuery?: { term?: string }
  peopleAlsoAsk?: unknown[]
  relatedQueries?: { title?: string; url?: string }[]
  organicResults?: { title?: string; url?: string; description?: string }[]
}

const isGutefrage = (url: string) => /(^|\.)gutefrage\.net$/.test((() => { try { return new URL(url).hostname } catch { return "" } })())

/**
 * Google Search Scraper items: "People also ask" and related searches are questions in their own right;
 * organic hits on gutefrage.net are the German Q&A threads behind a `site:gutefrage.net` query.
 */
export function mapGoogleItems(items: unknown[]): QuestionRow[] {
  const rows: QuestionRow[] = []
  for (const raw of items) {
    const it = raw as GoogleItem
    const term = clean(it.searchQuery?.term) || null
    for (const p of it.peopleAlsoAsk ?? []) {
      const q = p as Record<string, unknown>
      const title = clean(q.question) || clean(q.title)
      if (!title) continue
      const url = typeof q.url === "string" && q.url ? q.url : null
      const answer = clean(q.answer)
      rows.push({ source: "google_paa", url, title: clip(title, TITLE_MAX), body: answer ? clip(answer, BODY_MAX) : term ? `Zu: ${term}` : null, score: 0, lang: "de", asked_at: null, key: questionKey("google_paa", null, title) })
    }
    for (const r of it.relatedQueries ?? []) {
      const title = clean(r.title)
      if (!title) continue
      rows.push({ source: "google_related", url: null, title: clip(title, TITLE_MAX), body: term ? `Zu: ${term}` : null, score: 0, lang: "de", asked_at: null, key: questionKey("google_related", null, title) })
    }
    for (const o of it.organicResults ?? []) {
      if (!o.url || !isGutefrage(o.url)) continue
      const title = clean(o.title)
      if (!title) continue
      const desc = clean(o.description)
      rows.push({ source: "gutefrage", url: o.url, title: clip(title, TITLE_MAX), body: desc ? clip(desc, BODY_MAX) : null, score: 0, lang: "de", asked_at: null, key: questionKey("gutefrage", o.url, title) })
    }
  }
  return rows
}

/** Drops rows whose key is already stored or already in this batch; the first occurrence wins. */
export function dedupeAgainst(rows: QuestionRow[], existingKeys: Iterable<string>): QuestionRow[] {
  const seen = new Set(existingKeys)
  const out: QuestionRow[] = []
  for (const r of rows) {
    if (seen.has(r.key)) continue
    seen.add(r.key)
    out.push(r)
  }
  return out
}

/** What Claude returns. `question_ids` point at this week's rows; anything else is dropped by `validateSuggestions`. */
export const RankingSchema = z.object({
  suggestions: z.array(
    z.object({
      kind: z.enum(SUGGESTION_KINDS),
      title: z.string().min(3),
      slug: z.string().nullable(),
      target_path: z.string().nullable(),
      why: z.string().min(10),
      brief: z.string().min(20),
      evidence: z.array(z.object({ question_id: z.string(), quote: z.string() })),
    }),
  ),
})
export type Ranking = z.infer<typeof RankingSchema>
export type RankedSuggestion = Ranking["suggestions"][number]

export type SuggestionInsert = {
  kind: SuggestionKind
  title: string
  slug: string | null
  target_path: string | null
  why: string
  brief: string
  evidence: { question_id: string; url: string | null; quote: string }[]
}

const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

/**
 * Keeps only suggestions whose evidence points at real questions (at least `minEvidence` of them), with a valid
 * German slug for articles and a site path for adjustments, capped at `max`. Order is Claude's: best first.
 */
export function validateSuggestions(ranking: Ranking, questions: { id: string; url: string | null }[], limits: { min_evidence: number; max_suggestions_per_week: number }): SuggestionInsert[] {
  const byId = new Map(questions.map((q) => [q.id, q]))
  const out: SuggestionInsert[] = []
  for (const s of ranking.suggestions) {
    const seen = new Set<string>()
    const evidence = s.evidence.flatMap((e) => {
      const q = byId.get(e.question_id)
      if (!q || seen.has(e.question_id)) return []
      seen.add(e.question_id)
      return [{ question_id: e.question_id, url: q.url, quote: clip(clean(e.quote), 280) }]
    })
    if (evidence.length < limits.min_evidence) continue
    const slug = s.kind === "article" && s.slug && SLUG_RE.test(s.slug) ? s.slug : null
    if (s.kind === "article" && !slug) continue
    const target = s.kind === "adjust" && s.target_path?.startsWith("/") ? s.target_path : null
    if (s.kind === "adjust" && !target) continue
    out.push({ kind: s.kind, title: clip(clean(s.title), 160), slug, target_path: target, why: s.why.trim(), brief: s.brief.trim(), evidence })
    if (out.length >= limits.max_suggestions_per_week) break
  }
  return out
}

/** ISO week label (same as scripts/seo-agent/lib/dates.mjs), so a scan and a snapshot share a name. */
export function isoWeek(date = new Date()): string {
  const d = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()))
  const day = d.getUTCDay() || 7
  d.setUTCDate(d.getUTCDate() + 4 - day)
  const yearStart = Date.UTC(d.getUTCFullYear(), 0, 1)
  const week = Math.ceil(((d.getTime() - yearStart) / 86_400_000 + 1) / 7)
  return `${d.getUTCFullYear()}-W${String(week).padStart(2, "0")}`
}
