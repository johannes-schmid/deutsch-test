# SEO standard — read this before writing or changing any public page

Four files here, plus the loop in `seo-agent/`:

| File | Use |
|---|---|
| **README.md** (this) | The process and the checklist that must pass before a page or guide ships. |
| **facts.md** | Every number and legal fact we may publish, with source URL and check date. **Nothing outside this file goes on the site.** |
| **keyword-strategy.md** | Positioning, page ownership (one query, one page), homepage on-page, the openings. Pick the owning query from here. |
| **semrush-2026-10-12.md** | The keyword export. Volumes are US-based estimates until confirmed in Search Console or DataForSEO. |
| `../seo-agent/` | The weekly loop: Friday data pull, Saturday routine, `/admin/seo`. See `seo-agent/README.md`. |

---

## The rules that outrank the rest

The product promise is **the most realistic DTZ mock exams, built on research of the real exam**
(CLAUDE.md §2). That constrains the content:

- **Every number is sourced or it is cut.** `facts.md` or nothing. If a competitor states a pass
  threshold we can't source, we say that; naming the gap is more citable than repeating the guess.
- **No invented social proof.** No testimonials, no `AggregateRating`, no user counts, no pass rates.
- **Never "kein KI" / "ohne KI", never "offiziell".** Items may be AI-drafted; we are not affiliated
  with BAMF, telc or g.a.s.t. "Built on the official DTZ format" is fine.
- **No mass-generated or near-duplicate pages** (one per city, nationality, …). The Dutch site lost
  its organic traffic in the September 2026 spam update, most likely for AI-written volume. Fewer,
  deeper pages, each reviewed by a human before it publishes (`status: 'reviewed'`).
- **Machine translations say so at the top** (AI Act art. 50). The uk/ru mirrors are for learners,
  never a ranking bet; the loop watches them and never pushes them.

## Process for a new guide

1. **Pick the query** from `keyword-strategy.md`. Check that no page owns it yet (the ownership
   table; `seo/used-keywords.md` once it exists). Practice-exam queries (`DTZ üben`, `Modelltest`)
   belong to `/gratis-test/*` and the Modelltests, never to a blog post. The blog takes
   **explanatory** queries only.
2. **SERP research before writing.** Search the query on google.de. Open the top three. Record
   format, length, topics. Match the format and land within 10% of their average length. google.de
   is not fetchable from this environment (consent redirect); use Search Console queries once the
   site has impressions, or `seo-dataforseo`.
3. **Content.** Cover every topic the top three cover, add one or two they miss. Our reliable
   differentiators: sourced, dated format facts from `research/dtz-blueprint.md`, a worked example
   in the real exam format, and what the result levels mean (B1 / A2 / unter A2, never
   "bestanden"). Answer the main question in the first 100 words. FAQ with 4–8 real questions.
4. **Voice.** Simple German, short sentences (≤ 15 words on average), **du**. The reader is at A2.
5. **Where it lives.** A post is `data/blog/<slug>.tsx` with sections as JSX, a named author, a
   review date and sources; the route exists already. Translations are `data/blog/{uk,ru}/<slug>.tsx`.
   Metadata, canonical, hreflang, OG and JSON-LD come from the registry; don't hand-roll them.
6. **Images.** One hero via Pexels, local file under `public/`, under ~150 KB, descriptive alt text.

## On-page checklist (every page, before it ships)

- [ ] Owning query in the title (≤ 60 chars, query near the front) and in the first 100 words
- [ ] Meta description 140–160 chars, unique, with the owning query
- [ ] Exactly one `<h1>`; H2 per section
- [ ] The main question answered at the top
- [ ] 2–3 internal links (free test, a Modelltest, a related guide); 2–3 external sources (BAMF, gesetze-im-internet.de, telc/g.a.s.t. format pages)
- [ ] Every number traced to `facts.md`
- [ ] Nothing from the do-not-say list above
- [ ] `Byline` with author, review date, sources; `status: 'reviewed'`
- [ ] Every user-facing string in every locale file (de, uk, ru) — grep before adding a key
- [ ] Appears in `app/sitemap.ts` output (automatic for reviewed posts; confirm)
- [ ] The weekly health check (`/admin/seo`) shows no issue for the URL after deploy

## Cadence

Don't dump a batch. One guide a week, reviewed, beats five drafts. After publishing, request
indexing in Search Console.

## Off-page

Not a priority yet. When it is: Integrationskurs providers, Migrationsberatung sites, Ukrainian and
Russian community sites, journalist queries. Never PBNs or bulk backlinks.
