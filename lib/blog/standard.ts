import { isValidElement, type ReactNode } from "react"
import type { BlogPost } from "./types"

/**
 * The blog post standard (Hannes, 2026-11-06), after the length research in LEARNINGS.md: a post is as long as the
 * answer, structured so a B1 reader can leave after one section. `checkPost` runs over every post in
 * lib/blog/standard.test.ts, so a post that breaks the standard fails `npm test`; the same rules go into the
 * Claude Code prompts (lib/admin/blog-prompts.ts) and the weekly ranking brief (lib/content-ideas/rank.ts).
 */
export const BLOG_STANDARD = {
  /** Words of the rendered article (prose and blocks), non-native readers at about 130 words per minute. */
  words: { min: 350, max: 1300 },
  wordsPerMinute: 130,
  sections: { min: 3, max: 6 },
  /** "Kurz gesagt": one sentence per section, the answer first. */
  kurz: { min: 25, max: 170 },
  /** At least one worked example or self-check per post: a QuizCard, LetterSample or a block named here. */
  exampleBlocks: ["QuizCard", "LetterSample"],
  faq: { max: 5 },
  summaryRows: { min: 3, max: 5 },
  sourcesMin: 2,
} as const

/** The rules in words, for prompts and the content standard. Keep in sync with BLOG_STANDARD. */
export const BLOG_STANDARD_LINES = [
  `${BLOG_STANDARD.words.min}–${BLOG_STANDARD.words.max} words in total (a single-question post 350–700, a guide 800–1,200). The post is as long as the answer, never padded.`,
  `${BLOG_STANDARD.sections.min}–${BLOG_STANDARD.sections.max} sections. Every section starts with \`kurz\`: its answer in one sentence (${BLOG_STANDARD.kurz.min}–${BLOG_STANDARD.kurz.max} characters), shown as "Kurz gesagt" so a reader can stop after it. Each section stands alone; nothing repeats what another post owns, link there instead.`,
  "At least one worked example or self-check in the real exam format: a QuizCard or a LetterSample. One concrete example beats two paragraphs of explanation.",
  "Short sentences (about 15 words on average), everyday words, du-form. Numbers only from seo/facts.md with source and Stand.",
  `Summary card with ${BLOG_STANDARD.summaryRows.min}–${BLOG_STANDARD.summaryRows.max} rows, at most ${BLOG_STANDARD.faq.max} FAQ entries, at least ${BLOG_STANDARD.sourcesMin} sources, \`readingMinutes\` = ceil(words / ${BLOG_STANDARD.wordsPerMinute}).`,
]

const SKIP_PROPS = new Set(["className", "href", "id", "key", "src", "url", "photo", "part", "kind", "mark", "brand", "level", "size", "correct", "checked", "ariaLabel", "rel", "target", "strokeWidth"])

/** Every string a React tree would render, including block props such as table rows and letter lines. */
export function textOf(node: unknown, out: string[] = []): string[] {
  if (node == null || typeof node === "boolean") return out
  if (typeof node === "string") {
    out.push(node)
    return out
  }
  if (typeof node === "number") return out
  if (Array.isArray(node)) {
    for (const n of node) textOf(n, out)
    return out
  }
  if (isValidElement(node)) {
    const props = node.props as Record<string, unknown>
    for (const [k, v] of Object.entries(props)) if (!SKIP_PROPS.has(k)) textOf(v, out)
    return out
  }
  if (typeof node === "object") {
    for (const [k, v] of Object.entries(node as Record<string, unknown>)) if (!SKIP_PROPS.has(k)) textOf(v, out)
  }
  return out
}

export const countWords = (s: string) => (s.match(/[\p{L}\p{N}§]+(?:[-’'][\p{L}\p{N}]+)*/gu) ?? []).length

/** Words of a post as the reader sees them: lead, summary, every section (heading, kurz, body) and the FAQ. */
export function postWords(post: BlogPost): number {
  const parts = [post.lead, ...post.summary.rows.flatMap((r) => [r.k, r.v]), ...post.sections.flatMap((s) => [s.title, s.kurz ?? "", ...textOf(s.body)]), ...post.faq.flatMap((f) => [f.q, f.a])]
  return parts.reduce((n, p) => n + countWords(p), 0)
}

export const readingMinutesFor = (words: number) => Math.max(1, Math.ceil(words / BLOG_STANDARD.wordsPerMinute))

function blockNames(node: ReactNode, out = new Set<string>()): Set<string> {
  if (Array.isArray(node)) node.forEach((n) => blockNames(n, out))
  else if (isValidElement(node)) {
    const t = node.type as { name?: string; displayName?: string } | string
    if (typeof t !== "string" && (t.displayName || t.name)) out.add(t.displayName || t.name || "")
    const children = (node.props as { children?: ReactNode }).children
    if (children !== undefined) blockNames(children, out)
  }
  return out
}

export function hasExample(post: BlogPost): boolean {
  const names = new Set<string>()
  for (const s of post.sections) blockNames(s.body, names)
  return BLOG_STANDARD.exampleBlocks.some((b) => names.has(b))
}

export type StandardIssue = { rule: string; detail: string }

/** Every rule a post breaks; an empty list means it meets the standard. */
export function checkPost(post: BlogPost): StandardIssue[] {
  const issues: StandardIssue[] = []
  const S = BLOG_STANDARD
  const words = postWords(post)
  if (words < S.words.min || words > S.words.max) issues.push({ rule: "words", detail: `${words} words, allowed ${S.words.min}–${S.words.max}` })
  const expected = readingMinutesFor(words)
  if (post.readingMinutes !== expected) issues.push({ rule: "readingMinutes", detail: `readingMinutes is ${post.readingMinutes}, ${words} words → ${expected}` })
  if (post.sections.length < S.sections.min || post.sections.length > S.sections.max) issues.push({ rule: "sections", detail: `${post.sections.length} sections, allowed ${S.sections.min}–${S.sections.max}` })
  for (const s of post.sections) {
    const k = s.kurz?.trim() ?? ""
    if (k.length < S.kurz.min || k.length > S.kurz.max) issues.push({ rule: "kurz", detail: `section "${s.id}": kurz has ${k.length} characters, allowed ${S.kurz.min}–${S.kurz.max}` })
    else if (!/[.!?»“”"]$/.test(k)) issues.push({ rule: "kurz", detail: `section "${s.id}": kurz must be a full sentence` })
  }
  const ids = new Set<string>()
  for (const s of post.sections) {
    if (ids.has(s.id)) issues.push({ rule: "sections", detail: `duplicate section id "${s.id}"` })
    ids.add(s.id)
  }
  if (!hasExample(post)) issues.push({ rule: "example", detail: `no ${S.exampleBlocks.join(" or ")} in any section` })
  if (post.faq.length > S.faq.max) issues.push({ rule: "faq", detail: `${post.faq.length} FAQ entries, at most ${S.faq.max}` })
  if (post.summary.rows.length < S.summaryRows.min || post.summary.rows.length > S.summaryRows.max) issues.push({ rule: "summary", detail: `${post.summary.rows.length} summary rows, allowed ${S.summaryRows.min}–${S.summaryRows.max}` })
  if (post.sources.length < S.sourcesMin) issues.push({ rule: "sources", detail: `${post.sources.length} sources, at least ${S.sourcesMin}` })
  return issues
}
