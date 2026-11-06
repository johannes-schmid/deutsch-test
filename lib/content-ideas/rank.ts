import "server-only"
import Anthropic from "@anthropic-ai/sdk"
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod"
import { createAdminClient } from "@/lib/supabase/admin"
import { POSTS } from "@/lib/blog/posts"
import { BLOG_STANDARD, postWords } from "@/lib/blog/standard"
import { community, markScan, type ScanRow } from "./collect"
import { RankingSchema, validateSuggestions, type SuggestionInsert } from "./model"

/**
 * One Claude call per week: this week's new questions, our posts and the ideas already on the list go in;
 * at most `limits.max_suggestions_per_week` ideas come out, each tied to the questions that prove it.
 * Direct Anthropic API like the other content-research tooling (ANTHROPIC_API_KEY); owner tooling, not a
 * learner-facing call, so it stays off the AI Gateway.
 */

export const rankingConfigured = () => Boolean(process.env.ANTHROPIC_API_KEY)

const MODEL = process.env.CONTENT_IDEAS_MODEL ?? "claude-opus-5-5"

/** Pages outside the blog that an "adjust" idea may point at, with what each one owns (seo/keyword-strategy.md). */
const OWNED_PAGES = [
  "/ (DTZ online üben)",
  "/blog/dtz-pruefung (DTZ Prüfung: Aufbau, Ablauf, Bewertung)",
  "/a2-zu-b1 (DTZ nur A2, wiederholen)",
  "/b1-einbuergerung (B1 für die Einbürgerung)",
  "/einbuergerungstest (Einbürgerungstest online üben)",
  "/gratis-test/<exam> (free tests per exam: dtz, telc-b1, goethe-b1, oesd-b1, …)",
  "/preise (Prüfungspass)",
]

const SYSTEM = `You are the content editor of deutschtest-ueben.de, a German exam-prep site (DTZ, telc, Goethe, ÖSD, Einbürgerungstest) for migrants in Germany. Each week you read what people ask in public forums and search, and you propose what the site should do about it.

Return at most {MAX} suggestions, best first, in three kinds:
- "article": a new blog post. Give a German URL slug (lowercase, ü→ue, ö→oe, ä→ae, ß→ss, hyphens). Never a page per city, nationality or course provider. Never a topic one of our posts or pages already owns: propose an "adjust" instead.
- "adjust": one question an existing post or page should answer and does not (target_path = its path). Say the question; it becomes one section with the heading as the question and the answer first. Only when the question belongs to that page's owning topic AND the post has room (the list shows words and sections; the cap is {WORDS} words and {SECTIONS} sections). A post at the cap, or a question that is really its own search intent (e.g. costs, waiting times, a different exam), gets an "article" instead, never a bolt-on section.
- "tool": an interactive thing people are looking for that we could build (a calculator, checker, planner, generator). Only if the questions clearly show the need.

Rules:
- Every suggestion cites at least {MIN} question ids from the list as evidence, with a short quote from each (in its original language).
- "why" (2 sentences, English): what people ask and why it matters for the site's audiences: stuck at A2, citizenship applicants, Integrationskurs learners.
- "brief" (English, 80–200 words): the owning search query, the questions to answer, an outline with 3–6 sections where each section is one question, the one worked example or self-check (quiz, sample letter) the post needs, what must be checked in official sources (numbers, fees, legal rules carry "Stand: MM/YYYY" and a source), and what not to claim. Posts are 350–1,300 words, short sentences, du-form. The brief is for the site owner, who writes and reviews; it is never the article itself.
- Never recommend claims like "official", "guaranteed", "kein KI", invented user counts or pass rates. The DTZ has no pass/fail: results are B1, A2 or unter A2.
- Do not repeat an idea that is already on the list; merge new evidence into a fresh angle only if it is really different.
- Skip questions that are off-topic (visa, jobs, unrelated languages). If nothing is worth doing, return fewer suggestions.`

type QuestionForPrompt = { id: string; source: string; title: string; body: string | null; score: number; url: string | null }

function questionsBlock(qs: QuestionForPrompt[]) {
  return qs.map((q) => `[${q.id}] (${q.source}${q.score ? `, ${q.score}` : ""}) ${q.title}${q.body ? `\n    ${q.body.slice(0, 400)}` : ""}`).join("\n")
}

export async function rankScan(scan: ScanRow): Promise<{ suggestions: number; questions: number }> {
  const db = createAdminClient()
  const { data: qRows } = await db.from("content_questions").select("id, source, title, body, score, url").eq("scan_id", scan.id).order("score", { ascending: false }).limit(400)
  const questions = (qRows ?? []) as QuestionForPrompt[]
  if (!questions.length) {
    await markScan(scan.id, { status: "done", finished_at: new Date().toISOString(), stats: { ...scan.stats, suggestions: 0 } })
    return { suggestions: 0, questions: 0 }
  }
  const { data: prior } = await db.from("content_suggestions").select("kind, title, status").neq("status", "dismissed").order("created_at", { ascending: false }).limit(200)
  const { data: dismissed } = await db.from("content_suggestions").select("title").eq("status", "dismissed").order("created_at", { ascending: false }).limit(100)

  const posts = POSTS.map((p) => `- /blog/${p.slug} (${p.status}, ${postWords(p)} words, ${p.sections.length} sections): ${p.title}. Sections: ${p.sections.map((s) => s.title).join(" · ")}`).join("\n")
  const prompt = [
    "## Our blog posts",
    posts,
    "",
    "## Other pages and what they own",
    ...OWNED_PAGES.map((p) => `- ${p}`),
    "",
    "## Ideas already on the list (do not repeat)",
    ...(prior ?? []).map((s) => `- [${s.kind}, ${s.status}] ${s.title}`),
    ...(dismissed?.length ? ["", "## Ideas the owner dismissed (do not bring back)", ...dismissed.map((s) => `- ${s.title}`)] : []),
    "",
    `## This week's questions (${questions.length})`,
    questionsBlock(questions),
  ].join("\n")

  const client = new Anthropic()
  const format = zodOutputFormat(RankingSchema)
  const system = SYSTEM.replace("{MAX}", String(community.limits.max_suggestions_per_week)).replace("{MIN}", String(community.limits.min_evidence)).replace("{WORDS}", String(BLOG_STANDARD.words.max)).replace("{SECTIONS}", String(BLOG_STANDARD.sections.max))
  const res = await client.messages.create({
    model: MODEL,
    max_tokens: 16000,
    output_config: { effort: "medium", format: { type: format.type, schema: format.schema } },
    system,
    messages: [{ role: "user", content: prompt }],
  })
  if (res.stop_reason === "refusal") throw new Error("Ranking refused")
  const text = res.content.flatMap((c) => (c.type === "text" ? [c.text] : [])).join("")
  if (res.stop_reason === "max_tokens" || !text) throw new Error(`Unparseable ranking (stop_reason ${res.stop_reason})`)
  const ranking = format.parse(text)
  const valid: SuggestionInsert[] = validateSuggestions(ranking, questions, community.limits)

  if (valid.length) {
    const { error } = await db.from("content_suggestions").insert(valid.map((s) => ({ ...s, scan_id: scan.id })))
    if (error) throw new Error(error.message)
  }
  await markScan(scan.id, { status: "done", finished_at: new Date().toISOString(), stats: { ...scan.stats, suggestions: valid.length, proposed: ranking.suggestions.length, model: MODEL, tokens: { in: res.usage.input_tokens, out: res.usage.output_tokens } } })
  return { suggestions: valid.length, questions: questions.length }
}
