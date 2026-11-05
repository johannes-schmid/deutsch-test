---
name: seo-weekly
description: The Saturday-morning run of the SEO loop. Reads Friday's snapshots in seo-agent/data, judges old ledger rows, writes seo-agent/reports/<week>.md, opens at most three small PRs (titles, descriptions, technical errors) and updates the to-do list on /admin/seo. Runs as a cloud routine; can be invoked by hand too.
---

<!-- Copy this file to .claude/skills/seo-weekly/SKILL.md (the session that wrote it could not create skill files). -->

# SEO weekly run

You are the weekly reviewer of the SEO/GEO loop for deutschtest-ueben.de (this repo). You work
**only** on the snapshots in `seo-agent/data/`; you fetch no data yourself and invent no number.
Read `seo-agent/README.md` and `seo-agent/config.json` first, then CLAUDE.md §2 and §4.

Everything is English: the report, the to-do list, commit messages and PR titles (CLAUDE.md §4).

## Order

1. **Read in.** Find the current ISO week (`node -e "import('./scripts/seo-agent/lib/dates.mjs').then(m=>console.log(m.isoWeek()))"`).
   Read `seo-agent/data/<week>/index.json` and the five snapshots, plus the previous week with data.
   A snapshot with `skipped` or `error` is **unknown**, never zero: say so in the report and skip
   that section. Read `seo-agent/ledger.json`, `seo/keyword-strategy.md` (the page-ownership table)
   and `seo/used-keywords.md` if it exists.

2. **Ledger review.** For every row with `verdict: null` and `window_end` ≤ today: compare in
   `gsc.json` the current window with the previous one for `page` (and `metric`). Fill in `worked`,
   `didnt` or `inconclusive` (inconclusive below 50 impressions in both windows) and set
   `verdict_note` with the numbers. Never delete a row.

3. **KPI block**, current vs previous 28-day window:
   - clicks, impressions, CTR, position: total and non-brand (`non_brand` in gsc.json)
   - number of queries at position ≤ 20; number of pages with ≥ 1 click
   - indexing: `health.json` → `status_counts`, number of `problems`, `orphans`
   - Bing: clicks/impressions from `GetRankAndTrafficStats` if present
   - the funnel: read it on `/admin/funnel` (or `lib/admin/funnel.ts`), not from a snapshot
   - in an even week: `geo.json` → `citation_share` and `top_cited` (who does get cited)
   Every line in this block names the snapshot file the number comes from.

3a. **Collapse check, before anything else in the report.** A 28-day window averages a drop away.
   Read the daily numbers (`gsc.json → daily` and `seo-agent/data/history/gsc-daily-*.json`). If
   impressions on a day are **more than 70% below** the average of the seven days before, or the
   weekly average is more than 70% below the week before, the report opens with a red line: the date,
   the numbers, the Google updates running at that moment (Search Status Dashboard) and the deploys in
   that window (`git log`). Compare with Bing: if Bing didn't drop, it's Google, not the site.

4. **Technical health.** Everything in `health.json → problems` with status ≠ 200, `noindex in
   sitemap`, `canonical differs` or `invalid JSON-LD` is an error and gets **one** PR, outside the
   cap and outside the cooldown. Title/description lengths are not errors but input for step 5.

5. **Striking distance, odd weeks only.** From `gsc.json → current.query_page`: position between
   `rules.striking_distance.position_min` and `position_max`, impressions ≥ `min_impressions`, CTR
   below the average for that position. Exclude every page in the ledger with `date` within
   `rules.cooldown_days`. For at most `rules.weekly_pr_cap` pages: rewrite **only** the title /
   description (in `lib/i18n/landing.ts`, `lib/i18n/exam-pages/<exam>.ts`, `lib/i18n/kurztest.ts`
   or `data/blog/<slug>.tsx`), with the owning query from `seo/keyword-strategy.md` first, title ≤ 60
   and description 140–160 characters, in every locale file that has the key (de, uk, ru; en for the
   homepage). One PR per page, with the hypothesis and the GSC numbers in the PR body, and a new
   ledger row (`window_end` = date + 35 days).
   While there is no GSC data yet, step 5 is: the pages with the lowest score on `/admin/seo`
   (`pages.json` + `health.json` problems), practice and landing sections first.

6. **Report.** Write `seo-agent/reports/<week>.md` with: a five-line summary, the KPI block, this
   week's ledger verdicts, the opened PRs (link + hypothesis), GEO (even weeks), what was unknown and
   why, and one recommendation for Hannes that can't be a PR (a topic for a guide, a decision).
   Commit report, ledger and `recommendations.json` **directly on `main`** (`chore(seo): report
   <week>`), no report PR: Hannes reads it on `/admin/seo`. Code changes (titles, technical) stay PRs.

6a. **To-do list.** Update `seo-agent/recommendations.json`: that is the to-do list on `/admin/seo`.
   Per task: `task` (an imperative sentence), `owner` (`hannes` for what only he can do or must
   review, `agent` for what comes as a PR), `priority` (`now` / `next` / `later`), `kind`, `why`
   with the number and the source, `steps` (the concrete next step, with where you click), and
   `expect` (what we see afterwards and when). A task without `expect` can't be tested and doesn't
   belong. Never reuse ids; set a task to `done` or `dismissed` instead of removing it. Hannes's tasks
   carry `minutes`; never more than `rules.owner_minutes_per_week` per week, the rest stays `open`
   and shifts.

7. **Mail.** Send the summary (the first ~40 lines of the report, plus the PR links and the link to
   `https://deutschtest-ueben.de/admin/seo`) to Hannes with the Gmail connector, subject
   `SEO <week> — <one sentence>`. **Show the draft first and wait for approval** (CLAUDE.md §10:
   never send an email without it) unless the routine runs unattended, in which case the mail is the
   report summary verbatim. If Gmail isn't available: add an item with `owner: "hannes"` in
   `recommendations.json` and go on.

## Hard rules

- Touch nothing in `config.protected_paths` or `protected_fields`. No body text, no facts, no
  prices, no exam items, no translations. Content that must be rewritten is a **brief** in
  `seo-agent/briefs/<slug>.md`, never copy.
- Never "kein KI", "ohne KI", "offiziell" or any claim outside `seo/facts.md` (CLAUDE.md §2).
- Never claim a keyword that `seo/keyword-strategy.md` gives to another URL.
- Before every push: `npx tsc --noEmit` and `npm test` green.
- At most `weekly_pr_cap` content PRs + one technical. Report and recommendations go on `main`.
- A number without a source file doesn't exist. A week without GSC data is a report that says so,
  not a report with estimates.
