import "server-only"
import { POSTS, POSTS_BY } from "@/lib/blog/posts"
import { createAdminClient } from "@/lib/supabase/admin"
import type { SuggestionKind } from "@/lib/content-ideas/model"
import { community } from "@/lib/content-ideas/collect"
import { postWords } from "@/lib/blog/standard"
import { fetchLiveGsc } from "./seo-live"
import type { PromptPost, PromptSuggestion } from "./blog-prompts"

/**
 * What `/admin/blog` shows: every German post with its translations, its Google numbers (live Search Console
 * when the key is on the server, otherwise unknown) and the ideas that point at it; plus the community
 * ideas of the latest scan. Reads only; the writes are in app/(admin)/admin/blog/actions.ts.
 */

export type AdminPost = PromptPost & { file: string; readingMinutes: number; sources: { name: string; url: string }[]; openIdeas: number }

export type SuggestionStatus = "open" | "planned" | "done" | "dismissed"
export type AdminSuggestion = Omit<PromptSuggestion, "evidence"> & {
  id: string
  scanId: string
  week: string
  status: SuggestionStatus
  createdAt: string
  decidedAt: string | null
  evidence: { question_id: string; url: string | null; quote: string }[]
}

export type ScanSummary = {
  id: string
  week: string
  status: "running" | "ranking" | "done" | "error"
  startedAt: string
  finishedAt: string | null
  error: string | null
  /** Per source, from the scan's stats; a source that is not there is unknown, never zero. */
  questions: Partial<Record<"reddit" | "google_paa" | "google_related" | "gutefrage", number>>
  newQuestions: number | null
  suggestions: number | null
}

export type BlogCockpit = {
  posts: AdminPost[]
  suggestions: AdminSuggestion[]
  scan: ScanSummary | null
  liveGsc: boolean
  config: { reddit: string[]; google: number; maxPerWeek: number }
  canScan: { apify: boolean; ranking: boolean }
}

const pathOf = (url: string) => decodeURI(url.replace(/^https?:\/\/[^/]+/, "") || "/")

export async function loadBlogCockpit(now = new Date()): Promise<BlogCockpit> {
  const db = createAdminClient()
  const [liveRes, scans, suggestionRows] = await Promise.all([
    fetchLiveGsc(now),
    db.from("content_scans").select("id, week, status, started_at, finished_at, error, stats").order("started_at", { ascending: false }).limit(1),
    db.from("content_suggestions").select("id, scan_id, kind, title, slug, target_path, why, brief, evidence, status, created_at, decided_at, content_scans!inner(week)").order("created_at", { ascending: false }).limit(300),
  ])

  const live = liveRes && !("error" in liveRes) ? liveRes : null
  const byPath = new Map((live?.pages.current ?? []).map((p) => [pathOf(p.page), p]))
  const queriesByPath = new Map<string, { query: string; impressions: number; position: number }[]>()
  for (const q of live?.queryPage ?? []) {
    const path = pathOf(q.page)
    const list = queriesByPath.get(path) ?? []
    list.push({ query: q.query, impressions: q.impressions, position: q.position })
    queriesByPath.set(path, list)
  }

  const suggestions: AdminSuggestion[] = (suggestionRows.data ?? []).map((r) => {
    const row = r as unknown as { id: string; scan_id: string; kind: SuggestionKind; title: string; slug: string | null; target_path: string | null; why: string; brief: string; evidence: AdminSuggestion["evidence"]; status: SuggestionStatus; created_at: string; decided_at: string | null; content_scans: { week: string } | { week: string }[] }
    const scan = Array.isArray(row.content_scans) ? row.content_scans[0] : row.content_scans
    return { id: row.id, scanId: row.scan_id, week: scan?.week ?? "", kind: row.kind, title: row.title, slug: row.slug, target_path: row.target_path, why: row.why, brief: row.brief, evidence: row.evidence ?? [], status: row.status, createdAt: row.created_at, decidedAt: row.decided_at }
  })

  const posts: AdminPost[] = POSTS.map((p) => {
    const path = `/blog/${p.slug}`
    const g = byPath.get(path)
    return {
      slug: p.slug,
      title: p.title,
      h1: p.h1,
      description: p.description,
      category: p.category,
      status: p.status,
      published: p.published,
      reviewed: p.reviewed,
      readingMinutes: p.readingMinutes,
      sections: p.sections.map((s) => s.title),
      words: postWords(p),
      related: p.related,
      sources: p.sources,
      locales: { uk: POSTS_BY.uk.some((t) => t.slug === p.slug), ru: POSTS_BY.ru.some((t) => t.slug === p.slug) },
      file: `data/blog/${p.slug}.tsx`,
      gsc: g ? { impressions: g.impressions, clicks: g.clicks, position: g.position } : null,
      queries: (queriesByPath.get(path) ?? []).sort((a, b) => b.impressions - a.impressions).slice(0, 6),
      openIdeas: suggestions.filter((s) => s.status === "open" && s.kind === "adjust" && s.target_path === path).length,
    }
  })

  const s = scans.data?.[0] as { id: string; week: string; status: ScanSummary["status"]; started_at: string; finished_at: string | null; error: string | null; stats: { questions?: ScanSummary["questions"]; new_questions?: number; suggestions?: number } } | undefined
  const scan: ScanSummary | null = s ? { id: s.id, week: s.week, status: s.status, startedAt: s.started_at, finishedAt: s.finished_at, error: s.error, questions: s.stats?.questions ?? {}, newQuestions: s.stats?.new_questions ?? null, suggestions: s.stats?.suggestions ?? null } : null

  return {
    posts,
    suggestions,
    scan,
    liveGsc: Boolean(live),
    config: { reddit: community.reddit.searches, google: community.google.queries.length, maxPerWeek: community.limits.max_suggestions_per_week },
    canScan: { apify: Boolean(process.env.APIFY_API_KEY), ranking: Boolean(process.env.ANTHROPIC_API_KEY) },
  }
}
