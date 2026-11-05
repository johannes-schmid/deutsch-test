---
name: seo-monthly
description: The monthly run of the SEO loop (first Saturday). Content decay, cannibalisation, internal links and the competitor diff from the last four weeks of snapshots; delivers briefs for Hannes and at most two PRs with internal links.
---

# SEO monthly run

Same ground rules as `/seo-weekly` (read that first, and `seo-agent/README.md`). This run looks
over four weeks and does the things too slow for a weekly judgement. Output: briefs in
`seo-agent/briefs/`, a section "Month" at the bottom of this week's report, and at most
`rules.monthly_pr_cap` PRs: only internal links and structured data, never copy.

1. **Content decay.** Per page: clicks in the current 28-day window against the average of the
   three previous snapshots. A drop ≥ `rules.decay_threshold_pct` at ≥ 100 impressions → brief
   `seo-agent/briefs/refresh-<slug>.md`: which queries are leaving, what competitors do on that
   query (`competitors.json`), and three concrete proposals for Hannes. Write no copy; a brief says
   what and why.

2. **Cannibalisation.** In `gsc.json → current.query_page`: queries where two of our URLs have
   impressions and the positions alternate (both between 5 and 30). Pick the winner per
   `seo/keyword-strategy.md` ("one query, one owning page"). Proposal: the loser links internally to
   the winner and drops the query from its title; that is a PR if it only touches a link or a title,
   otherwise a brief. Watch the known pair: `/gratis-test/dtz/*` (free tests) vs the DTZ guides under
   `/blog/*`, and the uk/ru mirrors vs their German originals.

3. **Internal links.** `health.json → orphans` plus pages with `internal_link_count` below the
   median: propose three source pages per orphan from the top 20 by clicks, and put the links in the
   existing text of those source pages (only `<a href>` / `<Link>`, no new sentences). That may be one PR.

4. **Competitors.** `competitors.json → new_since_last` of the last four weeks: which new URLs cover
   a topic we have no page for? A list of at most five content gaps with the matching query from
   `seo/semrush-*.md` if present; it goes in the report, not in a PR. Scrape nothing; if a URL looks
   important, name it and let Hannes decide. Never copy a competitor's text (CLAUDE.md §7).

5. **Quarterly note** (January, April, July, October): one paragraph on market and scope (Austria,
   Switzerland, English-language demand, A1 demand) based on the queries that have impressions but no
   page. No PR.

Everything goes in one PR set on `claude/seo-<week>-monthly`, with the briefs and the report
section, and the ledger gets a row per merged link change.
