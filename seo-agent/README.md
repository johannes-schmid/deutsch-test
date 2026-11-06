# The SEO/GEO loop

Two layers, one log. Friday evening a GitHub Action fetches the data; Saturday morning a Claude
routine reads that data and makes proposals; Hannes judges them over coffee on `/admin/seo`.
Ported from inburgering-website's `seo-agent/` on 2026-11-05; same shape, this site's rules.

```
Friday 21:00 UTC  .github/workflows/seo-collect.yml → scripts/seo-agent/collect.mjs
                  → seo-agent/data/<ISO-week>/{gsc,bing,health,competitors,geo,index}.json
                  → pages.mjs (triage) → score.mjs (one row in data/history/health.json)   (commit on main)
Saturday 06:00    routine "SEO weekly"  = /seo-weekly   → reports/<week>.md + ledger.json + recommendations.json (on main), ≤3 PRs
                                                        → read on /admin/seo
1st Saturday      routine "SEO monthly" = /seo-monthly  → seo-agent/briefs/*.md, ≤2 PRs (links/schema only)
```

## Why a log and not fifty agents

SEO changes show up in Search Console only after three to six weeks. An agent that changes
something every week makes it impossible to see what worked. So:

- **`seo-agent/ledger.json`**: every merged change is a row: date, page, what, hypothesis, metric,
  `window_end`. After `rules.verdict_after_days` the weekly run fills in `worked` / `didnt` /
  `inconclusive`. Rows are never deleted.
- **Cooldown**: a page that is in the ledger within `rules.cooldown_days` gets no new proposal.
- **Rolling 28-day windows**, always against the 28 days before, with a three-day lag (GSC runs
  behind). Weekly numbers at this site's scale are noise.

## Cadence

| Rhythm | Task | Output |
|---|---|---|
| weekly | KPI block + ledger verdicts | report |
| weekly | technical health (4xx, canonical, noindex, JSON-LD, snippet lengths) | one PR if something is broken |
| fortnightly (odd weeks) | striking distance, positions 8–15 | ≤ 3 title/description PRs |
| fortnightly (even weeks) | GEO: fixed prompts to ChatGPT, Perplexity, Claude | citation share in the report |
| monthly | decay, cannibalisation, internal links, competitor diff | briefs + ≤ 2 link PRs |
| quarterly | market and scope | one paragraph |

## Community questions (since 2026-11-06)

Next to the search data, a Vercel cron (`app/api/cron/content-scan`, Friday 20:00 start, 22:00 collect) pulls
what people ask on Reddit (keyword searches), in Google's "People also ask" and related searches, and on
gutefrage.net (`site:` queries) through Apify. The queries and limits are the `community` block in
`config.json`. Claude turns the week's new questions into at most 8 ideas (new article, adjustment to an
existing page, tool people look for), each with quotes as evidence and a brief. They land in
`content_suggestions` and show on `/admin/blog`, where Hannes plans, finishes or dismisses them and copies
a Claude Code prompt per idea. Rules are the same as here: a prompt ends in a draft PR, never a published
page; dismissed ideas are never proposed again. Facebook groups are login-gated and not scanned.

## What an agent may touch

See `editable_surfaces` and `protected_paths` in `seo-agent/config.json`. In short: titles, meta
descriptions, internal links, structured data, sitemap and robots **yes**; the body of guides and
exam items, `seo/facts.md`, prices, translations, `research/` and everything under `scripts/` **no**.
Every exam item and guide is reviewed by Hannes before it publishes (CLAUDE.md §4); an agent that
publishes copy itself breaks that. Content that should change is a **brief** in `seo-agent/briefs/`
plus a recommendation with `owner: "hannes"` in `seo-agent/recommendations.json`.

`/admin/seo` is one page: at the top the **health score** of the site (out of 100) and the three
sources (Google, Bing, AI search engines), below it the **site structure**: every sitemap URL in its
section with a score out of 10, why, and the next step. Opening a page shows the search numbers, the
health-check findings and two buttons: a prompt for Claude Code or the steps to do it yourself. The
to-do list, experiments and numbers sit folded under "More".

- **The sum** lives in `lib/admin/seo-score.mjs` (plain JavaScript, so the page and the script use
  the same one). Starts at 10; deductions for the triage verdict, visibility against the previous
  28-day window, position and the health check. The site is the average weighted by search demand.
- **The line over time**: `node scripts/seo-agent/score.mjs` writes one row in
  `data/history/health.json` after every Friday run. It uses the snapshot, so the live "Now" on the
  page can differ by a few points.
- **The triage** lives in `seo-agent/pages.json` and comes from `node scripts/seo-agent/pages.mjs`
  (sitemap + previous-window demand); change the rules in that script, never the JSON.

## KPIs

| Phase | North star | Supporting |
|---|---|---|
| traffic (now) | non-brand organic clicks, 28 days | impressions, queries in the top 20, pages with clicks, indexed pages |
| GEO | share of GEO prompts in which deutschtest-ueben.de is cited | who is cited instead (top 5) |
| conversion | sign-up → Modelltest → paywall → paid, on `/admin/funnel` (our own tables, no PostHog needed) | free test → email |
| loop | verdict ratio: worked / judged | PRs merged / opened |

## Saturday, for Hannes

1. Open **`/admin/seo`**. The state of things, Friday's pull, what there is to do per owner (you,
   the agent), the experiments and the open PRs. The report itself is on `main` in
   `seo-agent/reports/<week>.md`; the page links to it.
2. Read the ledger verdicts: what from five weeks ago worked?
3. Judge the PRs. Closing is fine; write why in the PR, the monthly run reads that.
4. Your own work per week stays under `rules.owner_minutes_per_week` (90 minutes); what doesn't fit shifts.

## Sources and keys

| Source | Key (GitHub secret; the same on Vercel for the live tiles) | Without the key |
|---|---|---|
| Search Console | `GSC_SA_JSON`: the service-account JSON of this site's own Google Cloud project, see `seo-agent/google-api-access.md` | `skipped` |
| Bing Webmaster | `BING_API_KEY` | `skipped` |
| Firecrawl `/map` | `FIRECRAWL_API_KEY` (free: 1,000 credits/month, ~3/week needed) | `skipped` |
| GEO | `OPENAI_API_KEY`, `PERPLEXITY_API_KEY`, `ANTHROPIC_API_KEY` (direct vendor keys, never the AI Gateway) | engine skipped |
| CrUX | `CRUX_API_KEY` | `skipped` |

`health` needs no key and always runs. Try it locally:
`node scripts/seo-agent/collect.mjs --week 2026-W00 --only health` (and delete the folder afterwards).

A snapshot with `skipped` or `error` means **unknown**, never zero.
