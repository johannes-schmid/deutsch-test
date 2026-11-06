import { describe, expect, it } from "vitest"
import { improvePostPrompt, snippetPrompt, suggestionPrompt, translatePrompt, type PromptPost, type PromptSuggestion } from "./blog-prompts"

const post: PromptPost = {
  slug: "dtz-bestehen",
  title: "DTZ bestehen: Punkte, B1 und A2",
  h1: "DTZ bestehen",
  description: "So zählen die Punkte im DTZ.",
  category: "pruefungen",
  status: "reviewed",
  published: "2026-10-12",
  reviewed: "2026-10-16",
  sections: ["Punkte", "B1 oder A2"],
  related: [],
  locales: { uk: true, ru: false },
  words: 1150,
  gsc: { impressions: 1234, clicks: 56, position: 9.4 },
  queries: [{ query: "dtz bestehen", impressions: 800, position: 8.6 }],
}

const idea: PromptSuggestion = {
  kind: "adjust",
  title: "Explain the Sprechen points",
  slug: null,
  target_path: "/blog/dtz-bestehen",
  why: "Many ask how Sprechen counts.",
  brief: "Owning query: dtz sprechen punkte. Add a table …",
  evidence: [{ url: "https://reddit.com/x", quote: "Wie zählt Sprechen?" }, { url: null, quote: "dtz sprechen punkte" }],
}

describe("blog prompts", () => {
  it("improve: names the file, the numbers, the open ideas and keeps the draft rule", () => {
    const p = improvePostPrompt(post, [idea])
    expect(p).toContain("data/blog/dtz-bestehen.tsx")
    expect(p).toContain("1,234 impressions, 56 clicks, average position 9.4")
    expect(p).toContain('"Wie zählt Sprechen?" (https://reddit.com/x)')
    expect(p).toContain("status: 'draft'")
    expect(p).toContain('("dtz bestehen")')
    expect(p).not.toContain("No open community suggestion")
    expect(p).toContain("Today: 1150 words in 2 sections. Room before the cap: about 150 words and 4 more sections. Anything substantial becomes a new post")
    expect(p).toContain("Split instead of stuffing")
  })

  it("improve without ideas says so instead of inventing one", () => {
    expect(improvePostPrompt({ ...post, gsc: null, queries: [] }, [])).toContain("No open community suggestion")
    expect(improvePostPrompt({ ...post, gsc: null, queries: [] }, [])).toContain("unknown (no live Search Console data)")
  })

  it("snippet: counts the characters and limits the scope to the three fields", () => {
    const p = snippetPrompt(post)
    expect(p).toContain(`(${post.title.length} chars)`)
    expect(p).toContain("sections, faq and status stay untouched")
  })

  it("translate: points at the wrapper pattern for the right locale", () => {
    const p = translatePrompt(post, "ru")
    expect(p).toContain("data/blog/ru/dtz-bestehen.tsx")
    expect(p).toContain("app/(main)/ru/(site)/blog/dtz-bestehen/page.tsx")
    expect(p).toContain("Russian")
  })

  it("suggestion: one builder per kind", () => {
    expect(suggestionPrompt(idea)).toContain("Improve https://deutschtest-ueben.de/blog/dtz-bestehen")
    expect(suggestionPrompt({ ...idea, kind: "article", slug: "dtz-sprechen-punkte" })).toContain("Create data/blog/dtz-sprechen-punkte.tsx")
    const tool = suggestionPrompt({ ...idea, kind: "tool", title: "DTZ Punkte-Rechner" })
    expect(tool).toContain("seo-agent/briefs/tool-dtz-punkte-rechner.md")
    expect(tool).toContain("Propose, don't build")
  })
})
