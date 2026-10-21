// Ported from inburgering-website. A robots.txt group is not additive: a crawler that matches a named
// group ignores "User-agent: *" entirely, so every group repeats the same Disallow list. It is a route
// handler rather than app/robots.ts because the metadata convention cannot emit comments.

import { SITE_URL } from "@/lib/seo"

/** Behind a password or not content. Public pages are never disallowed. */
const DISALLOW = ["/admin", "/api/", "/dashboard", "/auth/"]

/** Vendors' own tokens; a typo is silent, so check the vendor docs before adding one. */
const AGENT_GROUPS: [comment: string, agents: string[]][] = [
  ["OpenAI: training, search index, and user-triggered fetches", ["GPTBot", "OAI-SearchBot", "ChatGPT-User"]],
  ["Anthropic: crawler, search, and user-triggered fetches", ["ClaudeBot", "Claude-SearchBot", "Claude-User", "anthropic-ai"]],
  ["Google: Gemini and Vertex grounding. Googlebot itself is covered by the wildcard group", ["Google-Extended"]],
  ["Microsoft: Bing and Copilot", ["bingbot", "BingPreview"]],
  ["Apple: Siri and Apple Intelligence", ["Applebot", "Applebot-Extended"]],
  ["Perplexity: index and user-triggered fetches", ["PerplexityBot", "Perplexity-User"]],
  ["Meta: Meta AI", ["meta-externalagent", "meta-externalfetcher", "FacebookBot"]],
  ["Other assistants and indexes", ["Amazonbot", "DuckAssistBot", "MistralAI-User", "YouBot", "cohere-ai", "AI2Bot", "Diffbot", "Timpibot", "PetalBot"]],
  ["Common Crawl", ["CCBot"]],
]

const group = (agents: string[], comment?: string) =>
  (comment ? `# ${comment}\n` : "") + agents.map((a) => `User-agent: ${a}`).join("\n") + "\nAllow: /\n" + DISALLOW.map((p) => `Disallow: ${p}`).join("\n")

const BODY = `# ${SITE_URL}
#
# Practice material for the Deutsch-Test für Zuwanderer (DTZ). Crawling and quoting are welcome.
# The Disallow lines are generated from one list in app/robots.txt/route.ts. Edit it there.

${group(["*"])}

${AGENT_GROUPS.map(([comment, agents]) => group(agents, comment)).join("\n\n")}

Sitemap: ${SITE_URL}/sitemap.xml
`

export function GET() {
  return new Response(BODY, { headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "public, max-age=86400" } })
}
