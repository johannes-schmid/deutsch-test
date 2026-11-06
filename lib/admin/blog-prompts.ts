import type { SuggestionKind } from "@/lib/content-ideas/model"
import { BLOG_STANDARD, BLOG_STANDARD_LINES } from "@/lib/blog/standard"
import { sourceHint } from "./seo-prompts"

/**
 * The prompts behind every copy button on `/admin/blog`: pure text builders, so the client makes them on click
 * and a test can pin their wording. Posts stay TSX, reviewed by Hannes and shipped by PR (CLAUDE.md §4):
 * every prompt ends in a draft, never in a published page.
 */

export type PromptPost = {
  slug: string
  title: string
  h1: string
  description: string
  category: string
  status: "draft" | "reviewed"
  published: string
  reviewed: string
  sections: string[]
  related: string[]
  locales: { uk: boolean; ru: boolean }
  /** Rendered words today (lib/blog/standard.ts), so a prompt can say how much room the post has left. */
  words: number
  gsc: { impressions: number; clicks: number; position: number | null } | null
  queries: { query: string; impressions: number; position: number }[]
}

export type PromptSuggestion = {
  kind: SuggestionKind
  title: string
  slug: string | null
  target_path: string | null
  why: string
  brief: string
  evidence: { url: string | null; quote: string }[]
}

const ORIGIN = "https://deutschtest-ueben.de"

const RULES = [
  "Rules:",
  "- Read CLAUDE.md (§2, §4 and §10) and seo/README.md (Blog post standard) first.",
  "- Every number comes from seo/facts.md with its source and Stand; a legal or fee fact you can't source stays `TODO(hannes):`.",
  "- Never write \"kein KI\", \"ohne KI\", \"offiziell\", \"garantiert\" or invented user numbers. The DTZ has no bestanden: B1, A2 or unter A2.",
  "- German copy for learners at A2: short sentences (≤ 15 words on average), \"du\", everyday words.",
  "- Nothing goes live without Hannes's review: a new or changed post keeps `status: 'draft'`; never set it to reviewed yourself.",
  "- Run npx tsc --noEmit, npm test (lib/blog/standard.test.ts checks every post against the standard) and npx next build, open a PR (don't push to main), and add an entry to seo-agent/ledger.json so the Saturday run judges it after 35 days.",
]

/** The blog post standard (lib/blog/standard.ts), as the prompt states it. */
const STANDARD = [
  "The blog post standard (lib/blog/standard.ts; npm test enforces it):",
  ...BLOG_STANDARD_LINES.map((l) => `- ${l}`),
  "- One section answers one question. Write the heading as the question people ask or as its answer, and put the answer in `kurz` before the body explains it.",
  `- Split instead of stuffing: if an addition would push the post past ${BLOG_STANDARD.words.max} words or ${BLOG_STANDARD.sections.max} sections, or it serves a different search query than the post's owning one, create a new post for it (own slug, own owning query, registered in seo/keyword-strategy.md) and link both ways. A post stays about one question.`,
]

const roomLine = (p: PromptPost) => {
  const left = BLOG_STANDARD.words.max - p.words
  const sections = BLOG_STANDARD.sections.max - p.sections.length
  return `Today: ${p.words} words in ${p.sections.length} sections. Room before the cap: ${left > 0 ? `about ${left} words` : "none"}${sections > 0 ? ` and ${sections} more section${sections === 1 ? "" : "s"}` : ", no more sections"}.${left < 250 || sections < 1 ? " Anything substantial becomes a new post (see Split)." : ""}`
}

const nf = new Intl.NumberFormat("en-GB")

function googleLines(p: PromptPost): string[] {
  const out: string[] = []
  if (p.gsc) out.push(`Google, last 28 days: ${nf.format(p.gsc.impressions)} impressions, ${nf.format(p.gsc.clicks)} clicks${p.gsc.position !== null ? `, average position ${p.gsc.position.toFixed(1)}` : ""}.`)
  else out.push("Google, last 28 days: unknown (no live Search Console data).")
  if (p.queries.length) out.push(`Top queries: ${p.queries.map((q) => `"${q.query}" (#${Math.round(q.position)}, ${nf.format(q.impressions)})`).join(", ")}.`)
  return out
}

const evidenceLines = (s: PromptSuggestion) => s.evidence.map((e) => `- "${e.quote}"${e.url ? ` (${e.url})` : ""}`)

/** Improve one post: the questions people ask that it should answer, plus what Google says about it. */
export function improvePostPrompt(p: PromptPost, ideas: PromptSuggestion[]): string {
  const out = [
    `Improve the blog post ${ORIGIN}/blog/${p.slug} in this repo.`,
    "",
    `Where it lives: data/blog/${p.slug}.tsx (title "${p.title}", status ${p.status}, reviewed ${p.reviewed}). Sections today: ${p.sections.join(" · ")}.`,
    roomLine(p),
    ...googleLines(p),
  ]
  if (ideas.length) {
    out.push("", "Questions from Reddit, Google and gutefrage.net that this post should answer and doesn't yet:")
    for (const s of ideas) out.push(`- ${s.title}: ${s.why}`, ...evidenceLines(s).map((l) => `  ${l}`), `  Brief: ${s.brief}`)
  } else {
    out.push("", "No open community suggestion for this post. Look for the one thing a reader asks that the post does not answer, or the one block that repeats what every competitor says, and fix that.")
  }
  out.push(
    "",
    "Do this:",
    "1. For each question above, decide: does it belong to this post's owning query? If yes, answer it in the section that owns it (or a new section if there is room), with the heading as the question and the answer in `kurz`. If no, or there is no room, write a brief for a new post into seo-agent/briefs/ instead and only add a link here.",
    "2. Draft the change in the post's sections (keep the block components from components/design/article.tsx: FactBox, Steps, DoDont, LetterSample, QuizCard …). Show, don't describe: one concrete example in the real exam format (research/) beats more explanation. Cut a paragraph for every one you add if the post is near the cap.",
    `3. Keep the owning query${p.queries[0] ? ` ("${p.queries[0].query}")` : ""} early in the title and H1; don't change the slug.`,
    "4. Set `status: 'draft'` and leave `reviewed` as it is; Hannes reviews, sets reviewed and the date. Update `readingMinutes` as the test tells you.",
    "5. Don't touch data/blog/uk/ or data/blog/ru/: the translations follow after the German review.",
    "",
    ...STANDARD,
    "",
    ...RULES,
  )
  return out.join("\n")
}

/** Only the title and meta description, in every locale file that has them. */
export function snippetPrompt(p: PromptPost): string {
  return [
    `Fix the search snippet of ${ORIGIN}/blog/${p.slug}.`,
    "",
    `Where it lives: data/blog/${p.slug}.tsx (fields title, description, crumb) and the same fields in data/blog/uk/${p.slug}.tsx and data/blog/ru/${p.slug}.tsx.`,
    `Today: title "${p.title}" (${p.title.length} chars), description "${p.description}" (${p.description.length} chars).`,
    ...googleLines(p),
    "",
    "Do this:",
    "1. Title max 60 characters with the owning query first; description 140–160 characters, a concrete promise, no filler.",
    "2. Change only these fields, in every locale file that has them; sections, faq and status stay untouched.",
    "",
    ...RULES,
  ].join("\n")
}

/** The uk/ru wrapper for a post that lacks one. */
export function translatePrompt(p: PromptPost, locale: "uk" | "ru"): string {
  const name = locale === "uk" ? "Ukrainian" : "Russian"
  return [
    `Translate the blog post ${ORIGIN}/blog/${p.slug} into ${name} for ${ORIGIN}/${locale}/blog/${p.slug}.`,
    "",
    `Pattern: data/blog/${locale}/${p.slug}.tsx exports \`{ ...de, locale: "${locale}", <translated fields> }\` from the German post (see an existing file in data/blog/${locale}/ and register it in data/blog/${locale}/index.ts and POSTS_BY in lib/blog/posts.ts), plus a two-line route in app/(main)/${locale}/(site)/blog/${p.slug}/page.tsx.`,
    "Translate title, crumb, description, h1, lead, cover.label, summary, every section body, faq and cta. Block components take l=\"" + locale + "\" for their own labels. Exam content and quoted German examples stay German.",
    "The page is labelled as machine-translated at the top (AI Act art. 50); the layout does that, don't add a second note.",
    "slug, status, category, published and reviewed are inherited: the translation goes live with the reviewed German original.",
    "",
    ...RULES,
  ].join("\n")
}

/** A new post from a community-question brief. */
export function newArticlePrompt(s: PromptSuggestion): string {
  const slug = s.slug ?? "<slug>"
  return [
    `Draft a new blog post for ${ORIGIN}/blog/${slug}: "${s.title}".`,
    "",
    `Why: ${s.why}`,
    "What people ask:",
    ...evidenceLines(s),
    "",
    "Brief:",
    s.brief,
    "",
    "Do this:",
    `1. Create data/blog/${slug}.tsx as a \`BlogPost\` (lib/blog/types.ts): named author (lib/blog/author.ts), sources with URLs, summary rows, 3–6 sections each answering one question (heading = the question or its answer, \`kurz\` = the answer in one sentence), one QuizCard or LetterSample, a short faq, cta to the matching free test, related slugs. Copy the shape of data/blog/dtz-pruefung.tsx.`,
    "2. Add it to POSTS in lib/blog/posts.ts and the two-line route app/(main)/(site)/blog/" + slug + "/page.tsx. German only; uk/ru follow after review.",
    "3. Check seo/keyword-strategy.md: one query, one owning page. If a page already owns this query, stop and write a brief into seo-agent/briefs/ instead.",
    "4. `status: 'draft'`, `published` and `reviewed` = today, `readingMinutes` as the test tells you; Hannes reviews and publishes.",
    "",
    ...STANDARD,
    "",
    ...RULES,
  ].join("\n")
}

/** An adjustment to an existing post or page. */
export function adjustPrompt(s: PromptSuggestion): string {
  const path = s.target_path ?? "/"
  return [
    `Improve ${ORIGIN}${path}: ${s.title}.`,
    "",
    `Where it lives: ${sourceHint(path)}.`,
    `Why: ${s.why}`,
    "What people ask:",
    ...evidenceLines(s),
    "",
    "Brief:",
    s.brief,
    "",
    "Do this:",
    "1. First check the fit: is this question part of the page's owning query (seo/keyword-strategy.md), and does a blog post have room (npm test reports words and sections against lib/blog/standard.ts)? If not, create a new post instead (own slug, own owning query) and link both ways; don't stuff it in.",
    "2. Draft the addition in place (a blog post: a section that answers exactly this question, heading = the question or its answer, `kurz` = the answer, with the block components from components/design/article.tsx; a text page: in its data/pages/de file). Answer concretely, in the real exam format where it applies.",
    "3. Keep the page's owning query early in the title and H1; don't change the URL.",
    "4. A blog post gets `status: 'draft'`; leave `reviewed` as it is, update `readingMinutes`. Don't touch uk/ru files.",
    "",
    ...STANDARD,
    "",
    ...RULES,
  ].join("\n")
}

/** A tool idea: a brief for Hannes, never a build. */
export function toolPrompt(s: PromptSuggestion): string {
  const slug = s.slug ?? s.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")
  return [
    `Write a one-page proposal for a tool people are asking for: "${s.title}". Propose, don't build.`,
    "",
    `Why: ${s.why}`,
    "What people ask:",
    ...evidenceLines(s),
    "",
    "Brief:",
    s.brief,
    "",
    "Do this:",
    `1. Write seo-agent/briefs/tool-${slug}.md: the need (with the quotes above), what the tool does in three sentences, where it would live (a free page under /gratis-test, a block inside a blog post, or the portal), which existing pieces it reuses (components/exam/, lib/exam/, data/), what it must not claim, the effort in days, and the one metric that would show it worked.`,
    "2. Check seo/keyword-strategy.md for the query it would own and name the page that owns it today, if any.",
    "3. Don't create pages, components or migrations. Hannes decides on the brief.",
    "",
    ...RULES.slice(0, 4),
  ].join("\n")
}

export function suggestionPrompt(s: PromptSuggestion): string {
  if (s.kind === "article") return newArticlePrompt(s)
  if (s.kind === "adjust") return adjustPrompt(s)
  return toolPrompt(s)
}
