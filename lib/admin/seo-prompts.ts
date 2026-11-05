import type { ScoreFactor, Verdict } from "./seo-score.mjs"

/**
 * The two buttons on a page row of `/admin/seo`: a prompt to paste into Claude Code, and the steps to
 * do it by hand. Pure and without server dependencies, so the client component builds them on click:
 * 176 pages times two texts don't belong in the payload.
 *
 * The guard rails come from CLAUDE.md: nothing publishes without Hannes's review, every number
 * from `seo/facts.md`, never "kein KI", never "official".
 */

export type PromptPage = {
  path: string
  section: string
  sectionLabel: string
  verdict: Verdict
  reason: string
  plan: { action: string; owner: string; week?: string; into?: string } | null
  demand: number
  now: { impressions: number; clicks: number; position: number | null } | null
  queries: { query: string; impressions: number; position: number }[]
  score: number
  factors: ScoreFactor[]
  recs: { task: string; steps: string[] }[]
}

const ORIGIN = "https://deutschtest-ueben.de"

/** Where a page's copy lives. An honest signpost beats a guessed file name. */
export function sourceHint(path: string): string {
  const parts = path.split("/").filter(Boolean)
  const [first, second, third] = parts
  if (first === "uk" || first === "ru") {
    if (second === "blog" && third) return `data/blog/${first}/${third}.tsx (the translated fields; the German original is data/blog/${third}.tsx)`
    if (second === "gratis-test") return `lib/i18n/exam-pages/<exam>.ts and lib/i18n/kurztest.${first}.ts`
    if (second) return `data/pages/${first}/${second}.ts`
    return `lib/i18n/landing.${first}.ts`
  }
  if (first === "blog" && second) return `data/blog/${second}.tsx (title, description; sections stay with the reviewer)`
  if (first === "blog") return "app/(main)/(site)/blog/page.tsx and lib/i18n/ui.ts"
  if (first === "gratis-test" && second === "dtz") return "lib/i18n/kurztest.ts (DTZ hub and skill pages)"
  if (first === "gratis-test" && second) return `lib/i18n/exam-pages/${second}.ts`
  if (first === "gratis-test") return "app/(main)/gratis-test/page.tsx and lib/i18n/kurztest.ts"
  if (first === "en") return "lib/i18n/landing.ts (the en block)"
  if (!first) return "lib/i18n/landing.ts (the de block) and seo/keyword-strategy.md › Homepage on-page"
  return `data/pages/de/${first}.ts (metadata in app/(main)/(site)/${first}/page.tsx)`
}

const nf = new Intl.NumberFormat("en-GB")

function stateLines(p: PromptPage): string[] {
  const lines: string[] = []
  if (p.now) lines.push(`Google, last 28 days: ${nf.format(p.now.impressions)} impressions, ${nf.format(p.now.clicks)} clicks${p.now.position !== null ? `, average position ${p.now.position.toFixed(1)}` : ""}.`)
  else lines.push("Google, last 28 days: unknown (no live Search Console data).")
  if (p.demand > 0) lines.push(`The 28 days before: ${nf.format(p.demand)} impressions.`)
  if (p.queries.length) lines.push(`Top queries: ${p.queries.map((q) => `"${q.query}" (#${Math.round(q.position)})`).join(", ")}.`)
  return lines
}

function task(p: PromptPage): string[] {
  const snippet = p.factors.find((f) => f.key === "snippet")
  const visibility = p.factors.some((f) => f.key === "visibility" || f.key === "position")
  switch (p.verdict) {
    case "remove":
      return ["Take this page out of Google’s index without deleting it: set `robots: { index: false }` in its metadata and drop it from app/sitemap.ts.", "Keep the page reachable and its content intact."]
    case "consolidate":
      return [`Merge this page into ${p.plan?.into ?? "the stronger page on the same topic"}: move anything unique there as a draft for Hannes to review, then add a permanent redirect in next.config.ts and drop this URL from app/sitemap.ts.`, "Never lose a fact that only this page has."]
    case "improve":
      return ["Draft a rewrite for Hannes to review. Don’t set status to reviewed or publish it yourself.", "Show, don’t describe: add a concrete example from the real exam format (research/dtz-blueprint.md), not more explanation.", "Keep the page’s owning query (seo/keyword-strategy.md) early in the title and H1."]
    case "watch":
      return ["Decide whether this page earns its place: compare it with its German original or sibling pages and write a short brief in seo-agent/briefs/ proposing noindex, a merge or enrichment. Don’t change the page."]
    default:
      if (snippet) return [`Fix the snippet: ${snippet.label.toLowerCase()}. Titles max 60 characters, meta descriptions 140–160, unique per page, with the owning query first. Change the same key in every locale file that has it.`]
      if (visibility) return ["Find out why Google shows this page less: compare it with the pages that outrank it for its top queries and write the findings in seo-agent/briefs/. Don’t edit copy yet."]
      return ["Nothing is wrong. Look for one improvement that helps the reader more than any competitor does, and propose it in seo-agent/briefs/."]
  }
}

export function aiPrompt(p: PromptPage): string {
  const out = [`Improve ${ORIGIN}${p.path} in this repo.`, "", `Where it lives: ${sourceHint(p.path)}.`, `Section: ${p.sectionLabel}. Health score ${p.score}/10.`, ...stateLines(p)]
  if (p.factors.length) out.push("", "What costs points:", ...p.factors.map((f) => `- ${f.label} (${f.delta})`))
  out.push("", `Triage: ${p.verdict}. ${p.reason}`)
  if (p.plan) out.push(`Plan: ${p.plan.action}`)
  out.push(
    "",
    "Do this:",
    ...task(p).map((t, i) => `${i + 1}. ${t}`),
    "",
    "Rules:",
    "- Read CLAUDE.md (§2, §4 and §10) and seo/README.md first.",
    "- Every number comes from seo/facts.md. Never write \"kein KI\", \"ohne KI\" or \"offiziell\".",
    "- German copy for learners at A2: short sentences, \"du\". Every user-facing string goes into every locale file.",
    "- Nothing goes live without Hannes’s review; drafts stay `status: 'draft'`.",
    "- Run npx tsc --noEmit and npx next build, open a PR (don’t push to main), and add an entry to seo-agent/ledger.json so the Saturday run judges it after 35 days.",
  )
  return out.join("\n")
}

/** The steps to do it by hand: those from the to-do list first, otherwise per verdict. */
export function manualSteps(p: PromptPage): string[] {
  const fromRecs = p.recs.flatMap((r) => r.steps)
  if (fromRecs.length) return [...fromRecs, `The content lives in ${sourceHint(p.path)}.`]
  const where = `Open ${sourceHint(p.path)}.`
  const snippet = p.factors.find((f) => f.key === "snippet")
  switch (p.verdict) {
    case "remove":
      return [where, "Add `robots: { index: false }` to the page metadata.", "Remove the URL from app/sitemap.ts.", "Push via a PR; after deploy, ask Google to recrawl it in Search Console (URL Inspection)."]
    case "consolidate":
      return [where, `Copy anything unique into ${p.plan?.into ?? "the stronger page on the same topic"} as a draft.`, "Add a permanent redirect in next.config.ts.", "Remove the URL from app/sitemap.ts."]
    case "improve":
      return [where, "Add one thing no competitor has: a worked example in the real exam format, with the official criteria from research/.", "Cut blocks that repeat on every page.", `Keep the owning query${p.queries[0] ? ` ("${p.queries[0].query}")` : ""} early in the title and H1.`, "Review it, set status to reviewed; then it publishes."]
    case "watch":
      return [where, "Compare it with the German original: does it draw German queries away from it?", "If yes, noindex it. If no, leave it."]
    default:
      if (snippet) return [where, `${snippet.label}. Shorten or lengthen it, unique per page, owning query first.`]
      return ["Nothing to do. Check again after next Friday’s data pull."]
  }
}
