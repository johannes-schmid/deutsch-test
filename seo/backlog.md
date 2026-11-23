# SEO backlog

From the research of 2026-11-23 (Search Console, a Reddit scrape of 399 posts, SERP checks in German and six other
languages, a tools survey). Search volumes are not verified: the search tool was US-based. Check the top candidates in a
German incognito search before writing. Every number on a page comes from `seo/facts.md`.

Why this list looks the way it does: the domain is young and ranks at position 40–70 for head terms. It reaches page 1
for narrow questions the exam bodies answer only in PDFs ("wie lange", "wie viele Punkte", "wiederholen", "was nun").
Calculators win where the SERP is PDFs. migrando.de owns the legal questions around Einbürgerung in about ten languages.

## Built on 2026-11-23 (branch `claude/seo-top5-pages`)

| Page | Owning query | State |
|---|---|---|
| `/dtz/ergebnis-rechner` | DTZ Ergebnis berechnen | built, German |
| `/telc-b1/punkte-rechner` | telc B1 Punkte Rechner | built, German |
| `/blog/dtz-neue-regel-b1` | DTZ neue Regel November 2026 | built, German |
| `/blog/dtz-ergebnis-wartezeit` | DTZ Ergebnis wie lange | built, German |
| `/blog/telc-b1-ergebnis-wartezeit` | telc B1 Ergebnis wie lange | built, German |
| `/a2-zu-b1` | DTZ nur A2 | extended: repeat, cost, 300 hours, Einsicht |
| `/blog/dtz-bestehen` (de, en, uk, ru) | DTZ bestehen | rule of 11/2026 corrected |

After the deploy: request indexing for each URL in Search Console.

## Next, in this order

1. **English versions of the five new pages.** `/en` is the only indexed mirror, and Reddit demand is about 90 % English.
   Machine translation, labelled at the top. The calculators need their copy moved into a locale file first.
2. **The same pages in uk/ru**, for learners (both mirrors are noindex since 2026-11-16).
3. **`/telc-b1/modelltest` and a Goethe B1 equivalent**, modelled on `/dtz/modelltest`. Reddit: "there is only one free
   telc B1 mock"; paid ones are called too easy.
4. **`/dtz/sprechen`: the pair exam with a partner.** Our one feature no competitor has; answers the "partner problem"
   threads (silent or too-fluent partner, freezing in "gemeinsam planen").
5. **Points calculators for Goethe B1/A2 and ÖSD**, one page per exam. Scoring is in `lib/exam/scoring/`.
6. **"Welches Zertifikat brauche ich?"**: a sourced lookup by purpose (Einbürgerung, Niederlassungserlaubnis,
   Ehegattennachzug, Ausbildung). A table with sources, never an individual assessment.
7. **B1 letter check on the official criteria**: a new entry page to the free Schreiben test. Watch the one-query-one-page rule.
8. **English `/b1-einbuergerung`** for employed applicants where B1 is the last missing piece.
9. **Single-question posts** (350–700 words each): "Einbürgerungstest Bescheinigung verloren" · "telc B1 nur mündlich
   oder schriftlich wiederholen" · "Unterschied DTZ und telc B1 / telc A2·B1" (German answers are thin) ·
   "DTZ externe Teilnehmer" · "Berliner Sprachtest zur Einbürgerung" (almost nothing online).
10. **Arabic** as the next language: the largest unserved group (Syria: 65,600 naturalisations in 2025). Needs RTL first.

## Needs Hannes

- **Einbürgerungstest trainer with translations** (page 5 of the research). Not built. Three things block it:
  the open decision which page owns which query (`/einbuergerungstest` vs `/leben-in-deutschland`, CLAUDE.md §4); the
  BAMF catalogue with its image questions has to be imported; and the translations are content generation (Batches API).
  The premise also changed: /uk and /ru are noindex, so translated versions bring no Google traffic today, and
  lid-einbuergerung.de already has a web trainer with a 12-language interface.
- **DTZ overall A2.** IntTestV and g.a.s.t. define only B1. The calculator uses the BAMF sentence (the level in Sprechen
  and in one other part), but that BAMF page still shows the old B1 rule. Confirm with g.a.s.t. or the BAMF.
- **The spoken DTZ Anleitung is outdated.** `lib/modelltest/anleitung.ts` (`OVERALL`) still says B1 needs Sprechen plus
  one written part. Changing it means a new text and a new audio render.
- **Translated `/a2-zu-b1`** (en, uk, ru) still has the short old text. Not wrong, but without the new sections.
- **GitHub Actions secrets.** `GSC_SA_JSON` and `BING_API_KEY` are missing there, so every Friday snapshot says "skipped".
- **A lawyer or the BAMF on old certificates.** The regulation of 13.10.2026 has no transition rule; we say so and make
  no claim about certificates issued before 01.11.2026.

## Not worth it now

- Legal explainers on accepted certificates and B1 validity: migrando.de holds those results.
- English A1 mock landing pages: at least six free competitors.
- "B1 Brief Beispiel", Redemittel, "Sprechen Teil 3 Beispiel": publisher PDFs dominate, and it collides with `/dtz/*`.
- A general Einstufungstest: Goethe owns it.
- An Einbürgerung eligibility checker: legal advice risk.
- Polish, Romanian and Bulgarian mirrors: no evidence of demand.
- City or nationality page variants: forbidden by CLAUDE.md §4.
