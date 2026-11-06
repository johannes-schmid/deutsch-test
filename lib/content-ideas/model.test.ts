import { describe, expect, it } from "vitest"
import { dedupeAgainst, isoWeek, mapGoogleItems, mapRedditItems, normaliseUrl, questionKey, validateSuggestions, type Ranking } from "./model"

describe("questionKey", () => {
  it("treats the same thread with www, query and trailing slash as one", () => {
    const a = questionKey("reddit", "https://www.reddit.com/r/German/comments/abc/dtz_frage/?utm=1", "DTZ Frage")
    const b = questionKey("reddit", "https://reddit.com/r/German/comments/abc/dtz_frage", "Anders")
    expect(a).toBe(b)
  })

  it("falls back to source + title when there is no url, case-insensitively", () => {
    expect(questionKey("google_paa", null, "Wie lange dauert der DTZ?")).toBe(questionKey("google_paa", null, "wie lange   dauert der DTZ?"))
    expect(questionKey("google_paa", null, "x")).not.toBe(questionKey("google_related", null, "x"))
  })

  it("normalises a broken url without throwing", () => {
    expect(normaliseUrl("not a url")).toBe("not a url")
  })
})

describe("mapRedditItems", () => {
  const post = { dataType: "post", title: "  DTZ nur A2 – was jetzt? ", body: "Ich habe ...", url: "https://www.reddit.com/r/German/comments/1/x/", upVotes: 12, numberOfComments: 7, createdAt: "2026-11-01T10:00:00.000Z" }
  it("keeps posts with a title, adds up votes and comments, skips comments and communities", () => {
    const rows = mapRedditItems([post, { dataType: "comment", body: "nope" }, { dataType: "community", title: "German" }, { dataType: "post", title: "" }])
    expect(rows).toHaveLength(1)
    expect(rows[0]).toMatchObject({ source: "reddit", title: "DTZ nur A2 – was jetzt?", score: 19, asked_at: post.createdAt })
    expect(rows[0].url).toBe(post.url)
  })

  it("reads the harshmaur field names too", () => {
    const rows = mapRedditItems([{ dataType: "post", title: "DTZ exam b1", body: "scared", postUrl: "https://www.reddit.com/r/German/comments/2/y", upVotes: 5, commentsCount: 12, createdAt: "2026-10-23T08:23:02.000Z" }])
    expect(rows[0]).toMatchObject({ url: "https://www.reddit.com/r/German/comments/2/y", score: 17 })
  })

  it("clips long bodies", () => {
    const rows = mapRedditItems([{ ...post, body: "a".repeat(3000) }])
    expect(rows[0].body!.length).toBeLessThanOrEqual(1500)
  })
})

describe("mapGoogleItems", () => {
  const item = {
    searchQuery: { term: "dtz prüfung" },
    peopleAlsoAsk: [{ question: "Wie viele Punkte braucht man für B1 im DTZ?", answer: "Für B1 ...", url: "https://example.org/a" }, { title: "Was kostet der DTZ?" }, {}],
    relatedQueries: [{ title: "dtz prüfung termine 2026", url: "https://google.com/x" }],
    organicResults: [
      { title: "DTZ Prüfung bestanden?", url: "https://www.gutefrage.net/frage/dtz-pruefung-bestanden", description: "Hallo, ich ..." },
      { title: "telc", url: "https://www.telc.net/x", description: "no" },
    ],
  }
  it("turns PAA, related searches and gutefrage hits into rows, nothing else", () => {
    const rows = mapGoogleItems([item])
    expect(rows.map((r) => r.source)).toEqual(["google_paa", "google_paa", "google_related", "gutefrage"])
    expect(rows[0]).toMatchObject({ title: "Wie viele Punkte braucht man für B1 im DTZ?", body: "Für B1 ...", lang: "de" })
    expect(rows[1].body).toBe("Zu: dtz prüfung")
    expect(rows[3].url).toBe("https://www.gutefrage.net/frage/dtz-pruefung-bestanden")
  })
})

describe("dedupeAgainst", () => {
  it("drops stored keys and repeats inside the batch, first one wins", () => {
    const rows = mapGoogleItems([{ relatedQueries: [{ title: "dtz b1" }, { title: "DTZ B1" }, { title: "dtz a2" }] }])
    const out = dedupeAgainst(rows, [questionKey("google_related", null, "dtz a2")])
    expect(out.map((r) => r.title)).toEqual(["dtz b1"])
  })
})

describe("validateSuggestions", () => {
  const questions = [
    { id: "q1", url: "https://reddit.com/1" },
    { id: "q2", url: null },
    { id: "q3", url: "https://gutefrage.net/3" },
  ]
  const limits = { min_evidence: 2, max_suggestions_per_week: 2 }
  const base = { why: "People ask this every week.", brief: "Outline: 1. ... 2. ... Owning query: dtz wiederholen." }
  const ranking: Ranking = {
    suggestions: [
      { kind: "article", title: "DTZ wiederholen: so geht es", slug: "dtz-wiederholen", target_path: null, ...base, evidence: [{ question_id: "q1", quote: "a" }, { question_id: "q1", quote: "dup" }, { question_id: "q2", quote: "b" }, { question_id: "nope", quote: "c" }] },
      { kind: "article", title: "Bad slug", slug: "Bad Slug", target_path: null, ...base, evidence: [{ question_id: "q1", quote: "a" }, { question_id: "q2", quote: "b" }] },
      { kind: "adjust", title: "Add points table", slug: null, target_path: "/blog/dtz-bestehen", ...base, evidence: [{ question_id: "q1", quote: "a" }, { question_id: "q3", quote: "b" }] },
      { kind: "tool", title: "Only one proof", slug: null, target_path: null, ...base, evidence: [{ question_id: "q1", quote: "a" }] },
      { kind: "tool", title: "Points calculator", slug: null, target_path: null, ...base, evidence: [{ question_id: "q2", quote: "a" }, { question_id: "q3", quote: "b" }] },
    ],
  }

  it("keeps only well-formed suggestions with enough real evidence and caps the count", () => {
    const out = validateSuggestions(ranking, questions, limits)
    expect(out.map((s) => s.title)).toEqual(["DTZ wiederholen: so geht es", "Add points table"])
    expect(out[0].evidence).toEqual([
      { question_id: "q1", url: "https://reddit.com/1", quote: "a" },
      { question_id: "q2", url: null, quote: "b" },
    ])
    expect(out[1].target_path).toBe("/blog/dtz-bestehen")
  })

  it("without the cap the tool with two proofs comes through and the one-proof tool does not", () => {
    const out = validateSuggestions(ranking, questions, { ...limits, max_suggestions_per_week: 10 })
    expect(out.map((s) => s.kind)).toEqual(["article", "adjust", "tool"])
    expect(out[2].slug).toBeNull()
  })
})

describe("isoWeek", () => {
  it("matches the collector's labels", () => {
    expect(isoWeek(new Date("2026-11-06T12:00:00Z"))).toBe("2026-W45")
    expect(isoWeek(new Date("2027-01-01T12:00:00Z"))).toBe("2026-W53")
  })
})
