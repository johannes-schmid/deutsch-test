# CLAUDE.md — deutschtest-ueben.de

German exam-prep platform for migrants in Germany. German sister product of
**inburgeringoefenen.nl** / **knmoefenen.nl**, built and run solo by Hannes.
Read §1–§4 before touching anything; the rest is reference.

---

## 1. Dev server (always use this)

Scaffolded 2026-10-11 (Next.js 16.4, Tailwind v4, shadcn base-nova). Supabase Auth (Google only) since 2026-10-21; first table `kurztest_attempts` (free-test attempts + leads) the same day.
Use these defaults so this stack can run next to the two Dutch ones:

```bash
supabase start                                 # local Postgres + Auth + Storage (Docker)
PATH="/opt/homebrew/bin:$PATH" npm run dev     # next dev -p 3002, hot reload
```

| | knm-website | inburgering-website | **this project** |
|---|---|---|---|
| Next dev | 3001 | 3001 | **3002** |
| Supabase block | 543xx (CLI default) | 544xx | **545xx** (set in `supabase/config.toml`) |

Two projects on the same Supabase ports fight over them: the second fails with a port-in-use error
that looks like Docker is broken. Don't move this one back to the defaults.

- `.env.development.local` points at the local stack, so `npm run dev` can never write to production.
- Local Google sign-in needs `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` in `supabase/.env` before
  `supabase start`; the Google OAuth client must list `http://127.0.0.1:54521/auth/v1/callback`.
- Build: `npx next build` · Types: `npx tsc --noEmit` (both verified). Unit: `npm test` (vitest, billing logic in `lib/billing/`). E2E: not set up yet.
- `next.config.ts` has `cacheComponents` + `partialPrefetching` on. Don't read `params` or call
  `usePathname` outside `<Suspense>`; prefer static routes (see LEARNINGS.md).

---

## 2. What this is

**Core product:** realistic **DTZ** (Deutsch-Test für Zuwanderer, A2–B1) mock exams for
self-study, covering Hören, Lesen, Schreiben and Sprechen. Schreiben and Sprechen get feedback per
official DTZ criterion.

**Audiences, in priority order:**

1. **Stuck at A2.** About a third of DTZ takers finish at A2 and have mostly used up their
   subsidised repeat hours. They need B1 and retake the DTZ as external candidates.
2. **Citizenship applicants.** Need a B1 certificate for Einbürgerung. Often employed, short on
   time, willing to pay.
3. **Integrationskurs learners** who want extra exam practice close to their exam date.
4. **Einbürgerungstest / Leben in Deutschland.** Free only. A lead magnet, not a revenue product.

### The USP, and what it constrains

**The most realistic DTZ mock exams available, built on thorough research of the real exam.**
A candidate who has done our Modelltest should find nothing on exam day that surprises them.
Unlike the Dutch sites, there is **no teacher USP**. Competitors (TestGerman, Plakos, Preparaio)
lead with AI and volume, and their mocks drift from the real format (see §7).

**What "realistic" means. Each point is a requirement, not a nice-to-have:**

- **Format fidelity:** the same parts, number of items, order, timings, instructions, answer
  formats and scoring as the real DTZ. This includes picture options where the real exam has them.
- **Text types and situations** match the real exam: Behördenbriefe, Aushänge, Anzeigen,
  Durchsagen, Telefonansagen, Alltagsgespräche, at the real length and register.
- **Audio sounds like the exam:**
  - multiple distinct voices
  - natural dialogue
  - real-world settings (station, phone, radio)
  - played once or twice exactly as in the real exam
  - no pause or rewind where the exam has none
- **Exam conditions:** a real timer per section, the same flow between parts, and a scaled result
  (B1 / A2 / unter A2), never a percentage or "bestanden". Other exams show their **own official
  result format** (e.g. Goethe/telc/ÖSD: bestanden / nicht bestanden with points), as set in
  `research/<exam>.md` and `lib/exams.ts`. Decided by Hannes 2026-10-12; reconfirmed 2026-10-23 for every
  official exam (telc table: `research/telc-overview.md` §2). Never copy a competitor's scoring.
- **Sprechen simulates the pair exam,** including the partner's turns. It is never a series of
  solo prompts.
- **Schreiben/Sprechen feedback** uses the official DTZ assessment criteria.

**The research is the product's backbone and lives in the repo:**

- `research/dtz-blueprint.md` is the single source of truth for the format: every part, item
  count, timing, text type and answer format, each with its source and the date it was checked.
- Sources are official material (telc/g.a.s.t. Modelltests, the Prüfungsordnung, the
  Handbuch/Testspezifikation), plus first-hand candidate reports where they add detail.
  **Use official material for format only.** It is copyright, so we never reproduce it (§4).
- **Every exam item is checked against the blueprint before publishing.** A deviation is a bug.
  If the blueprint is unsure about something, mark it as unverified (`TODO(hannes):`) rather than
  guess.
- Data models and validators encode the blueprint: item counts, timings and answer formats per
  part. A validator warns when an exam deviates from it.

**Claims and AI rules (lessons the Dutch site paid for):**

- **Claim only what the research supports.** "Built on the official DTZ format" and "same parts,
  timing and question types as the real exam" are fine. "Official", "identical to the real exam"
  or "guaranteed B1" are not.
- **Never say "kein KI", "ohne KI" or "nicht von einer KI".** Items may be AI-drafted. "Geen AI"
  on inburgeringoefenen.nl was false and had to be removed site-wide.
- **Never position the product as "AI-generated" either.** Realism and research are the product.
- **Schreiben/Sprechen scoring:** a model applies a rubric built on the official DTZ criteria, and
  we say so. A score is practice feedback, not an official telc result. Keep "what next?" routing
  rule-based (AI Act high-risk boundary).
- **Machine-translated explanations say so at the top of the page** (AI Act art. 50).
- **No invented social proof:** no fake testimonials, AI avatars, made-up user counts or pass
  rates. Reviews of the Dutch sites may only be shown if they are labelled as the sister site's.

### Exam facts (keep accurate)

- **DTZ** is one exam in one sitting: Hören (~25 min), Lesen (45 min), Schreiben (30 min, one
  letter/email), Sprechen (~16 min, **pair exam**).
- It is a **scaled test with no pass/fail**. The result is B1, A2 or below A2. Show practice results
  the same way, never as "bestanden".
- **Zertifikat Integrationskurs** = DTZ B1 + passed "Leben in Deutschland" test.
- **Einbürgerungstest:** 33 questions in 60 minutes, 17 correct to pass. Catalogue: 300 general
  questions + 10 per Bundesland (BAMF).
- Fees, dates and legal rules (§ 44 / § 44a AufenthG, StAG): link the source and add
  `Stand: MM/YYYY`. **Never guess a legal fact.** Leave `TODO(hannes):` instead.
- Keep every number in one facts file (`seo/facts.md`, see §6) with its source URL and the date
  you checked it. If a number isn't in that file, it doesn't ship. Every competitor states pass
  thresholds they can't source; we don't.

---

## 3. Product rules

- **Free first:** at least one full mock exam per skill without an account, plus the full
  Einbürgerungstest. The paywall comes after value.
- **Sell one Prüfungspass, not modules** (Hannes, 2026-10-23). One pass unlocks every exam, level and part on
  the platform; candidates take all parts on one day. This deliberately differs from inburgeringoefenen.nl,
  which sells per module. Only list exams as included once they have reviewed Modelltests; never promise
  future ones ("Neue Modelltests während deiner Laufzeit sind inklusive" is fine).
- **Pricing (Hannes, 2026-10-24; replaces the one-time pass of 2026-10-23):** first term 1 Monat €19.95 or
  3 Monate €44.95 (recommended), then it **renews monthly at €19.95**, cancellable any time to the end of the paid
  period (Kündigungsbutton, § 312k BGB). Same gross price in DE and AT. Benchmark: TestGerman €19.90/month,
  €44.90 / 3 months, auto-renewing.
  Savings are shown against n × the 1-month price, never as a struck-through "old" price.
  Prices are always a concrete € amount, never "ab X".
- **Prüfungssimulation (Hannes, 2026-10-23):** every exam also gets 10 full simulations (all four skills in one go).
  Simulation *n* = the reviewed Modelltests *n* of each skill, assembled, **never generated**: no extra Claude or TTS
  for content, nothing reviewed twice. Only exam-level framing is rendered once per exam (Anleitung, transitions,
  closing). **Every simulation runs in its exam's official format:** official section order, shared timers, breaks,
  preparation, play counts, section lock and the official overall result, never a generic or competitor flow.
  Binding table per exam: `research/telc-plan.md` §7; an exam with an open `TODO(hannes)` in its row gets no simulation.
- **Generate every Modelltest as part of its simulation from day one** (Hannes, 2026-10-23), so sets can be patched
  together later with zero regeneration:
  - **One plan per exam covers all skills of set *n* together** (like `scripts/modelltest/plan-dtz.ts`): no topic,
    situation, name or place repeats across Hören *n*, Lesen *n*, Schreiben *n* and Sprechen *n*.
  - **Casting is planned per set *n* across skills:** no voice twice in a row at a section boundary.
  - **Each set already has the official structure of its section in the full exam** (e.g. telc B1 Lesen *n* includes
    the Sprachbausteine; a shared-timer block like Lesen + Schreiben is drafted to fit that one timer).
  - **Exam-wide framing** (Anleitung, transitions, closing) lives outside the sets and is rendered once per exam.
  - Never draft a single skill of set *n* without the plan entries for the other skills of *n*.
- **Lifecycle emails (Hannes, 2026-10-27):** at most **5 emails per person**, each kind once (Willkommen, Dein Stand,
  Zahlung offen, Endspurt, Wie war's?), only with consent (§ 7 UWG): an unticked checkbox under every Google sign-up
  button (opt-out is not valid consent in DE, Hannes agreed 2026-10-27), changeable in Konto; ≥ 48 h apart. Browser push
  runs the same five moments (one moment, every channel the learner turned on; push toggle in Konto, iPhone needs the
  home-screen app); the dashboard shows the next step in-app to everyone without a pass; a purchase ends the
  series except "Wie war's?". Rules in `lib/lifecycle/rules.ts` (tested); drafts on the artifact page shown to Hannes.
- **Prices include 19% VAT** for German consumers (OSS). Never show prices excluding VAT to
  consumers.
- **One source of truth for prices** (`lib/pricing.ts`). Derived numbers (savings %, per-month
  price) are computed, never typed in by hand.
- **Pricing is switchable (Hannes, 2026-10-29):** offers (first term, renewal, grants) live in catalogues; `ACTIVE_CATALOGUE`
  picks what is on sale. Every payment row stores a snapshot of what it bought (`catalogue`, `grants`, `term_months`,
  `renewal_cents`), and access reads only that snapshot, so switching or changing prices never touches past buyers.
  Never edit or delete a sold offer; add a new one. Plan for the per-skill Teil-Pass: artifact "Teil-Pass Pricing Draft".
  Catalogues: `pass-2026-10` (on sale) and `teil-2026-11` (built, not on sale: any skills at 9.95 € each, all four = 3 ×
  skill; one offer per pick of one or two skills plus all four, `coveringOffer()` turns a pick of three into all four;
  adding skills later costs the monthly difference once (`upgradeCost()`), then the subscription moves to the new price). Try one locally with
  `NEXT_PUBLIC_PRICING_CATALOGUE=teil-2026-11` in `.env.development.local` (ignored in production builds). Every copy
  surface (pricing pages, home FAQ, AGB, lifecycle and activation emails) follows `ACTIVE_LAYOUT`; the Teil-Pass wording
  was approved by Hannes 2026-10-29.
- **Check entitlement with one helper** (`canOpen(userId, exam, skill)`), never with a bare `plan` field.
  This bug shipped twice on the Dutch site: a paying customer read as `plan: 'free'`.
- Every Schreiben/Sprechen feedback maps to the **official DTZ assessment criteria**.

---

## 4. Content rules (important)

The Dutch site lost almost all organic Google traffic around the **September 2026 spam update**,
most likely because most of its content was AI-written. Don't repeat that here.

- **No mass-generated pages or near-duplicate SEO pages** (one per city, nationality, etc.).
- **Every exam item and guide is reviewed by a human before it is published:** checked against
  the blueprint and for natural German. Drafts carry `status: 'draft'`. Only `status: 'reviewed'`
  publishes, and nothing publishes automatically.
- Every guide needs a **named author**, a **review date** and **sources**.
  **TODO(hannes):** who is the named author/reviewer on the site?
- Fewer, deeper pages that answer the real question beat many thin ones.
- **One query, one owning page.** Guides and blog posts never target practice-exam keywords.
  Those belong to `/dtz/*`.
  - **TODO(hannes):** `/einbuergerungstest` and `/leben-in-deutschland` draw on the same BAMF
    catalogue. Decide which page owns which query before building both.
- **Official telc / g.a.s.t. DTZ model tests are copyright.** Use them for **format only**:
  length, register, question style, layout. Write every item we ship from scratch.
  The same goes for competitor material in this folder (see §7).
- **No "official" claims.** We are not affiliated with BAMF, telc or g.a.s.t., and the footer
  says so.

### Language and tone

- **Site language:** simple German (short sentences, ≤15 words on average, everyday words),
  addressing the user as **du**.
- **Ukrainian and Russian (since 2026-10-21, Hannes's call):** every public page is mirrored under `/uk` and
  `/ru`, machine-translated from German and labelled as such at the top of each page (AI Act art. 50), plus the
  item explanations in the free tests. Exam content stays German. Impressum/Datenschutz stay German only.
  Planned later, not built: explanations in English, Arabic, Turkish and Dari. Don't claim a language before it ships.
  - **RTL support** for Arabic and Dari. Every forward arrow flips in RTL.
- **Code, comments, commit messages and `LEARNINGS.md`:** English. **Chat with Hannes:** English.
- **URL slugs:** German, lowercase, `ü→ue`, `ö→oe`, `ä→ae`, `ß→ss`.
- **i18n:** every user-facing string goes into every locale file. Grep the file before adding a
  key: duplicate JSON keys don't error, and the last one silently wins.

---

## 5. Stack

**Default: the same as inburgering-website** (both Dutch sites run on Next.js, not vanilla JS), so
the exam engine, admin, TTS pipeline and funnel can be ported. **Payments: Mollie** (Hannes, 2026-10-24), on the
same Mollie organisation as the Dutch sites with its own website profile. Ported from inburgering's flow
(first payment → mandate → subscription), but access lives in our `payments` table, never in `user_metadata`.

- **Next.js 16** (App Router, TypeScript strict) · **Tailwind v4** + **shadcn/ui** · **next-intl**
  (de + 6 explanation locales)
- **Supabase:** Postgres, RLS, Auth, Storage, **EU region**
- **Mollie** for payments: hosted checkout with a `first` payment (mandate), then a monthly subscription
  (`lib/billing/`). Recurring works with cards (incl. Apple/Google Pay), PayPal and EPS (needs SEPA Direct Debit on the
  profile); Klarna can't recur. Mollie computes no VAT: we store the detected country per payment for the OSS return.
- **Resend** · **Vercel** hosting + crons
- **PostHog** (+ Meta Pixel for ads) and GA4. **TODO(hannes):** use the shared PostHog project
  split by `$host` (as the Dutch sites do), or a separate one?
- **ElevenLabs:** a designed German voice cast for Hören monologues and dialogues
- **Live-site Claude calls (grading, Sprechen partner) go through Vercel AI Gateway** (`lib/ai/claude.ts`, `AI_GATEWAY_API_KEY`;
  Hannes, 2026-10-25, for cost control). **Content generation** (`scripts/`, Batches API) stays on the direct Anthropic API, never the Gateway.
  ElevenLabs (TTS, Scribe) stays direct: the Gateway has no ElevenLabs.

### Voice cast (approved by Hannes after listening, 2026-10-22)

All audio on `eleven_v4_turbo`. Voice IDs live only in `data/tts-voices.json`; content refers to the keys.
**A new voice needs Hannes's listening approval first** (render samples, send a listening page).

| Accent | Men | Women |
|---|---|---|
| **DE** (standard German) | `man_mark` (narrator only) · `man_ben` (young) · `man_christian` (middle) · `man_simon` (young) · `man_johann` (old) · `man_michael` (old) | `woman_ela` (young) · `woman_irene` (middle) · `woman_laura` (middle) · `woman_lisa` (old) · `woman_kathi` (`de-learner`: soft Eastern European accent) |
| **AT** | `man_gruber_at` · `man_martin_at` (stronger dialect) | `woman_alexandra_at` · `woman_emilia_at` · `woman_seda_at` (approved 2026-10-24) |
| **CH** | `man_andres_ch` · `man_thomas_ch` (maybe) | `woman_heidi_ch` · `woman_mia_ch` |

- **Accent per exam:** DTZ, Goethe and telc use DE voices only. ÖSD B1 runs the Goethe B1 sets with Austrian voices (Swiss voices for Swiss-set speakers), made by `scripts/modelltest/derive-oesd.ts` (Hannes, 2026-10-24). ÖSD uses AT (plus DE/CH where
  `accents` in `lib/exam/exams/oesd-*.ts` says so). CH voices only where an exam has Swiss speakers.
- **Kathi** (`de-learner`) is never a native role (announcer, examiner, official). Use her for people who
  came to Germany themselves: Hören Teil 4 opinions, a learner partner in Sprechen.
- **DTZ casting** (`scripts/modelltest/author.ts`): narrator Mark; Hören Teil 1–3 rotate Ben, Christian, Simon,
  Ela, Irene, Laura, never one voice twice in a dialogue; Teil 4 four different voices with one older, one young,
  both genders; Sprechen examiner Ela, partner Ben.
- Rejected after listening (don't re-propose): Louisa, Yvonne, Ramona, Doreen, Nadine, Markus (AT).

### Site structure

```
/                         home, diagnostic CTA ("Wie weit bist du von B1?")
/dtz                      308 → /blog/dtz-pruefung (the DTZ overview is a blog article since 2026-10-16)
/dtz/modelltest/[n]       full mock exams
/gratis-test              free tests: pick level (A1/A2/B1) → exam → /gratis-test/{exam}/{skill}
                          (only exams with reviewed content link out; /dtz/kurztest 308s to /gratis-test/dtz)
                          each test is a ~5-minute taster (TASTER in lib/exam/blueprint.ts), a lead magnet, not a mock
/b1-einbuergerung         landing: citizenship applicants
/a2-zu-b1                 landing: stuck at A2
/einbuergerungstest       free: all 310 BAMF questions incl. Bundesland questions
/leben-in-deutschland     free civic test practice (see the TODO in §4)
/blog/...                 guides (data/blog/<slug>.tsx; drafts 404 outside `next dev`)
/preise                   pricing: PassBuilder (exam date → plan, summary on Nacht); /dashboard/preise = same offer in the portal
/impressum · /datenschutz mandatory
```

Keep the four surfaces from the Dutch sites apart: public `(main)`, portal `(app)`,
`(auth)` and `(admin)`. They never share layouts.

---

## 6. Directory map

```
deutsch-test/
├── CLAUDE.md                        # this file
├── LEARNINGS.md                     # success/failure log (create with the first code session)
├── research/dtz-blueprint.md        # ★ the real DTZ format, sourced and dated (g.a.s.t. Übungssätze 1+2); encoded as `full` in lib/exam/blueprint.ts
├── research/telc-overview.md         # all 24 telc German exams: official result modes (§2), skeletons, recognition, A1→C1 ladder; blueprints in research/{start-deutsch-1,telc-a2,telc-b1,telc-b2,telc-c1}.md
├── research/telc-plan.md             # ★ telc build plan (all exams, telc B1 first), audio standard, cited Anleitung drafts, Prüfungssimulation (§7)
├── research/goethe-plan.md           # ★ Goethe A2/B1 build plan: which exams share a format, ÖSD B1 = Goethe B1 items with AT/CH voices, voice gaps, open decisions
├── research/goethe-{a2,oesd-b1}-set1.md # set 1 plans with scorecards (official vs ours vs TestGerman) · *-official-situations.md = do-not-reuse lists · austrian-swiss-glossary.md = regional words + generator rules
├── research/telc-anleitung/          # draft Anleitung (intro) text per telc exam, cited to the official Übungstest pages; moves to lib/modelltest/ when built
├── research/dtz-official-situations.md # every situation of the official DTZ sets (paraphrased): the generator's do-not-reuse list; official texts for the 6-word overlap check live only in .unit-cache/official/ (gitignored)
└── testgerman/                       # competitor research, sorted by level; README.md in every folder
    ├── analysis.md · examples.md    #   full teardown (B1 in §2b) · structural examples (≤20-word excerpts)
    ├── uebungen.md · pruefungssimulation.md · mock-exams.md  # how each section works · ★ part-by-part mock blueprints incl. their 4 DTZ mocks
    ├── {a1,a2,b1}/uebungen/<skill>/<topic>/       # all 433 exercises in full
    ├── {a1,a2,b1}/pruefungssimulation/<provider>/ # all 29 mocks in full (DTZ only in b1/)
    ├── leben-in-deutschland/        #   course library, same on every roadmap (NOT the LiD test); A2 Sprechen course teardown inside
    ├── screenshots/                 #   exercise + simulator UI
    └── data/                        #   catalogue CSVs + raw/ (recon JSON + bundle; reference only, never ship)
```

```
DESIGN.md                            # ★ the chosen visual system (Nachtzug + Fokus exam UI): tokens, components, rules
seo/keyword-strategy.md              # keyword → page ownership, homepage title/H1/meta
app/(main)/                          # public site: / (German, default) and /en (English) Nachtzug landing; /de 308s to /
app/(main)/{uk,ru}/                  # machine-translated mirror of every public page: two-line static routes, one per German route (cacheComponents: no [lang] param); Impressum/Datenschutz stay German
│   └── design/pruefung/             #   noindex reference: every exam component (+ /ergebnis results page)
│   └── landing.css                  #   Nachtzug tokens + gradients, mapped onto shadcn tokens
components/ui/                       # shadcn components (Base UI)
components/design/                   # shell, kit, interactive, variants/ (Nachtzug landing, icons, logo, demo), exam-gallery
components/exam/                     # ★ Fokus exam system: ExamShell, items, audio, reading, writing, speaking, results
lib/exam/                            # exam types, UI copy (de + en), design specimens (samples.ts, not real content)
lib/design/                          # content.ts (shared copy, placeholder prices), variants.ts
lib/i18n/landing.ts                  # landing copy, de (default, /) + en (/en); uk/ru in landing.{uk,ru}.ts
lib/i18n/locale.ts                   # locales, lp() path prefix, hreflang alternates()
lib/i18n/ui.ts                       # shared chrome + blog labels (+ ui.{uk,ru}.ts); kurztest/exam copy also has .uk/.ru siblings
data/pages/{de,uk,ru}/               # text-page copy (a2-zu-b1, b1-einbuergerung, ueber-uns, kontakt, preise); views in components/pages/
data/blog/{uk,ru}/<slug>.tsx         # post translations: `{ ...germanPost, locale, <translated fields> }`, live with their German original
data/explanations/{uk,ru}.json       # item explanations keyed <exam>/<blockId>/<n>; unlock swaps them in (lib/kurztest/explanations.ts)
data/tts-voices.json                 # ★ the ElevenLabs voice cast with accent de/at/ch (AT/CH = provisional picks for ÖSD); content refers to keys, never voice_ids
data/kurztest/drafts/                # ★ Kurztest content: one JSON per block, `display` (kit types) + `key` (server-only); only status "reviewed" ships
public/audio/kurztest/               # rendered eleven_v4 clips for Hören blocks and Sprechen turns
lib/exam/{blueprint,kurztest,validate,band}.ts  # part specs + 10-item composition, block types, blueprint validator, indicative band
lib/kurztest/                        # server-only: data loader (strips keys), store (Supabase `kurztest_attempts` via the secret-key client in `lib/supabase/admin.ts`), score, grade (Claude), stt, stats
components/kurztest/                 # runner (Lesen/Hören, Schreiben, Sprechen), email gate, result view, shared item renderer
app/(main)/gratis-test/              # level + exam picker; dtz/ = hub + /{hoeren,lesen,schreiben,sprechen} lead-magnet tests, site layout, indexed
lib/exams.ts                         # ★ the 9 free-test exams (name, brand badge, levels, official result format, pass mark); research/<exam>.md = their blueprints
lib/exam/exams/<exam>.ts             # ★ one file per non-DTZ exam: generator context, part specs, Schreiben/Sprechen briefs, rubric, 5-min taster (from research/<exam>.md; goethe-b1 + oesd-b1 share research/goethe-oesd-b1.md)
lib/exam/exam-blueprints.ts          # aggregates lib/exam/exams/*; drafts → data/gratis-test/<exam>/ (--exam flag on the scripts)
lib/i18n/exam-pages/<exam>.ts        # hub + skill page copy per non-DTZ exam (DTZ and Start Deutsch 1 stay in lib/i18n/kurztest.ts)
components/design/site-chrome.tsx    # SiteNav / SiteGlow / SiteFooter shared by the landing and every inner page
app/{icon.svg,favicon.ico,apple-icon.png,opengraph-image.png,manifest.ts}  # brand icons + share card (rendered from the Leuchte mark)
lib/seo.ts · app/{sitemap.ts,robots.txt/,llms.txt/}  # site URL, OPERATOR (Impressum data), BreadcrumbList/OG helpers, sitemap, robots, llms.txt
app/(main)/(site)/                   # German text pages on one layout: dtz, preise, a2-zu-b1, b1-einbuergerung, ueber-uns, kontakt, impressum, datenschutz
components/design/content-page.tsx   # PageHeader, Prose, Byline (author/date/sources), TestCta, Todo marker
lib/pricing.ts · seo/facts.md        # the one price source: offers per catalogue, ACTIVE_CATALOGUE, offerById (any catalogue) / sellableOffer (checkout) · every number/legal fact with source + date
lib/billing/grants.ts                # Grants (skills × exams × simulation), allows(), activeGrants(), parseGrants(); tested
lib/billing/default-skill.ts         # mostPracticed(): the skill the Teil-Pass page preselects (tested); query in lib/modelltest/portal.ts
lib/billing/                         # ★ payments: period.ts (terms, grace), process.ts (idempotent payment → state, *.test.ts), mollie.ts (server adapters, syncPayment), view.ts (portal PassView)
app/api/mollie/{checkout,webhook,status,cancel} · app/api/cron/reconcile-payments  # checkout (plan id + consent only) · webhook · return poll · Kündigung · daily re-sync (vercel.json)
lib/email/{resend,billing}.ts + templates/ # one Resend REST sender; activation + cancellation emails, contact-form mail to support@; nothing sends without RESEND_API_KEY
app/(app)/dashboard/kontakt/          # portal contact form (components/portal/contact-form.tsx): topic + message → support inbox, reply-to = account email, 5/day via app_metadata.contact
app/(main)/(site)/{agb,widerruf}/    # AGB, Widerrufsbelehrung + Muster-Formular; German only, linked in the footer legal line with "Verträge hier kündigen" (→ /dashboard/konto/kuendigen)
lib/lifecycle/{rules,prefs}.ts       # lifecycle moments: nextEmail() (pure, *.test.ts) · examGoal() + CONSENT_VERSION; ExamDateWidget (countdown only, /dashboard aside) + ExamGoalForm (konto: exam, date, email consent, push switch) in components/portal/exam-goal.tsx → app/(app)/dashboard/goal-actions.ts
lib/lifecycle/{state,push,push-copy}.ts # cron state per learner · web-push sender (VAPID env, drops 404/410) · push texts per moment (tested); public/sw.js shows them; app/(app)/dashboard/push-actions.ts stores subscriptions
app/api/cron/lifecycle               # daily 07:00 UTC: claims the due moment in lifecycle_messages, sends it by email (consent) and push; CRON_SECRET
lib/lifecycle/email.ts + lib/email/templates/lifecycle.ts # the five emails; sendWelcome() from /auth/callback to every new account (service mail, never an offer); app/api/lifecycle/abmelden = one-click unsubscribe
components/portal/next-step.tsx      # in-app next step (next free Modelltest 1 → pass) for everyone without a pass
lib/lifecycle/consent-cookie.ts      # sign-up checkbox → `lc_consent` cookie → app/auth/callback records it (recordSignupConsent)
supabase/migrations/*_lifecycle_*.sql # lifecycle_prefs (exam (NULL = not chosen yet), exam_date, consent + version, unsubscribe token) + lifecycle_messages (moment log, channels) + push_subscriptions + lifecycle_emails (one row per sent kind, unique)
lib/billing/cancel.ts                # cancelForUser(): the one cancel path (portal button)
supabase/migrations/*_payments.sql   # payments (one row per Mollie payment, period, country, revoked) + mollie_customers (customer, subscription, canceled_at); server writes only
lib/i18n/pass.ts                     # PassBuilder copy (de/uk/ru); components/design/pass-builder.tsx = the configurator
app/api/kurztest/{submit,unlock,quota}  # submit stores attempt → id only; unlock takes email → result; quota = limit check before Schreiben/Sprechen
lib/kurztest/limits.ts               # paid runs (Claude grading, speech-to-text) capped per day: per IP, per email, global (salted hashes, env-tunable)
app/(admin)/admin/                   # /admin = stats + signups per week, /admin/kurztest = funnel, /admin/kurztest/emails = latest leads + CSV, /admin/modelltests = per-exam overview → [exam] slot grid → [exam]/[skill]/[n] review; Google login + `admin_users` allowlist (lib/admin/guard.ts, checked in proxy.ts and every page/route; also guards /design/kurztest)
lib/admin/sales.ts · components/admin/sales{,-charts}.tsx # /admin sales: revenue, MRR/churn, conversion (pure + tested; loaded by salesOverview() in lib/admin/stats.ts; recharts via components/ui/chart.tsx)
components/admin/                    # admin-shell (sidebar + mobile nav, from lib/admin/nav.ts), admin-drawer (client), admin-ui (AdminPage, Panel, DataTable, skeletons), modelltest-review
proxy.ts                             # also: Supabase session refresh on /dashboard + auth pages; no session → /anmelden, session on auth pages → /dashboard
lib/supabase/{client,server}.ts      # @supabase/ssr clients (publishable key, never the service key); getSessionUser() = Google profile only
lib/auth/redirect.ts                 # safeNext() (same-site paths only), PORTAL_HOME, auth error copy
app/auth/callback/route.ts           # Google → Supabase PKCE code exchange → ?next
app/(auth)/{registrieren,anmelden}/  # Google-only sign-up/sign-in (noindex); components/auth/ = GoogleButton + AuthHeader
app/(app)/dashboard/                 # portal (login-only): overview by level → [exam] (4 skill cards) → [exam]/[skill] (10 Modelltests); components/portal/ = sidebar, tab bar, account, exam pages; /dashboard/preise (Prüfungspass) and /dashboard/konto (account: progress, pass, sign-in; portal-account.tsx)
app/(app)/dashboard/[exam]/[skill]/[n]/ # ★ the Modelltest runner page + actions.ts (startAttempt, submitClosed, submitWriting, finishSpeaking; session + ownership checked in each)
components/modelltest/               # runner.tsx (intro → test → result; Hören follows the one track, Lesen/Schreiben timed) · speaking.tsx (live pair exam)
lib/entitlements.ts                  # canOpen(user, exam, skill) + passStatus(): the one paid-access check, from the grant snapshots on `payments` (Modelltest 1 per skill is free)
lib/modelltest/{rows,portal,runner}.ts # row → MtBlock (shared with admin) · slots per user (open/done/locked/soon/preview) · runner set with keys stripped + scoring against mt_options
lib/modelltest/speaking-telc.ts      # telc B1 Sprechen live: partner per Teil, Teil-1 extra topic, examiner rescue line, grading per Teil on the 4 official criteria (/75)
lib/modelltest/anleitung-telc-b1.ts  # telc B1 Anleitung per skill (audio: scripts/modelltest/anleitung.ts --exam telc-b1)
lib/modelltest/{grade,speaking,sprechen-run}.ts # official DTZ steps: Schreiben 4×0–5, Sprechen 5/5/10/10/20 + 10/10/15/15 · live lines (Haiku) + voice (eleven_v4_turbo) · run state + FREE_SPEAKING_SECONDS cap
app/api/modelltest/sprechen/turn/    # one answer: private recording → Scribe → next live line as audio (or null = pre-rendered fallback)
lib/portal.ts · lib/i18n/portal.ts   # exam groups for the portal ("use cache") · auth + portal copy
supabase/config.toml                 # local stack on 545xx, email signups off, Google on
supabase/migrations/*_modelltests.sql # mt_* tables: sets (exam×skill×1..10, 0 = backlog), stimuli/questions/options/open_tasks (display + server-only key, no client policies), attempts/answers/submissions (owner reads); buckets exam-audio, exam-images, sprechen-recordings (private, own folder); mt_publish_issues()
scripts/{generate,tts,validate}-kurztest.ts  # Claude drafts → eleven_v4 audio → blueprint check
supabase/migrations/*_mt_set_track.sql # mt_sets.track: the Hören set as one track { src, duration, cues }
scripts/lib/drafting.ts              # shared Claude call (direct API, optional image), system prompts, output schemas, voice casting
scripts/modelltest/                  # ★ Modelltest pipeline: plan-dtz (topics per set) → author (Claude per Teil, validated) → audio (eleven_v4_turbo, Hören track / Sprechen lines) → images (Pexels → WebP, Claude refits text to the photo) → seed (local mt_* + Storage; never touches review_status)
                                     # batch.sh <sets…> runs all of it (author → images → audio → local seed) with Claude on the Message Batches API (50% off), logs in .unit-cache/batch/
                                     # drafting model: Opus 5.5, effort medium (DRAFT_MODEL / DRAFT_EFFORT override; blind eval 2026-10-23 in LEARNINGS.md)
scripts/modelltest/author-oesd.ts     # ÖSD A1/A2 sets 2–10: plan per set → draft per skill (Message Batches with DRAFT_BATCH=1) → check-oesd.ts (validateSet, AT voices + max one DE voice, names across skills, official overlap); guides research/oesd-{a1,a2}-authoring.md, set 1 plans research/oesd-{a1,a2}-set1.md
scripts/modelltest/check-oesd.ts      # checks an ÖSD set (--exam oesd-a1|oesd-a2 --set n); audio.ts --exam oesd-a1|oesd-a2 builds the ÖSD track (SedaDa, xylophone gongs, previews, beeps/jingle/playback, 20/60 s checks); images-options.ts --skill sprechen fetches the A1 Sprechen photos
lib/exam/scoring/oesd.ts             # ÖSD A1/A2 official scoring: Aufgabe tables, 4-of-8 with penalty, 2/1/0 grid rows, form 10→5, Schreiben rubrics, module results (minimums + Prädikat); tests in oesd.test.ts (npx tsx --test)
components/exam/oesd.tsx             # ÖSD answer formats: PhotoNumberGrid, TickGrid, MarkBoxes, TopicCard, SceneChoice, PlanningSheet (shown on /design/pruefung)
scripts/modelltest/{plan,author}-telc-b1.ts # telc B1: one plan entry per set covers all skills (= Simulation n) → author (Teile batched together; Lesen Teil 4–5 = Sprachbausteine; rejects names/themes repeated in the set via clash.ts) → check-set.ts --set n after all four skills (re-run flagged Teile with --teil --force) → audio.ts/seed.ts --exam telc-b1 (official pace ~185 wpm, Teil 3 situation lines); do-not-reuse list research/telc-b1-official-situations.md, official text for the overlap check only in .unit-cache/official-telc-b1/
scripts/modelltest/check-start.ts + research/{start-deutsch-1,telc-a2}-authoring.md # Start Deutsch 1 / telc A2: how to draft sets 2–10 in the style of set 1 (shape, casting, quality rules, prompt) and the structural + overlap check
scripts/modelltest/author-start.ts + research/{start-deutsch-1,telc-a2}-plan.md # sets 2–10: plan (2 sets per call, all skills of set n together) → draft per skill with set 1 as the example → check-start + validateSet, redraft flagged skills (DRAFT_BATCH=1, --sets 2-10, --force); logs in .unit-cache/start-batch/
lib/exam/scoring/goethe.ts           # Goethe A2 / Goethe-ÖSD B1 official scoring: Lesen/Hören (A2 × 1.25, B1 raw → /100), Schreiben A–E steps per task, Sprechen per Teil + Aussprache; tests in goethe.test.ts
lib/modelltest/speaking-{goethe,oesd}.ts # live partner/Interlokutorin lines + Sprechen grading for Goethe A2/B1, ÖSD B1 and ÖSD A1/A2 (ÖSD: the candidate's topics, photo and role from RunState.choice)
lib/modelltest/grade-{goethe,oesd,module}.ts # Schreiben per task on the official criteria; grade-module adds up the module (A2 2 tasks, B1 3 Aufgaben, ÖSD A1 form + reply)
lib/exam/scoring/start.ts            # Start Deutsch 1 / telc A2 scoring: typed answers (spelling slack, exact numbers), Schreiben Teil 2 3/1.5/0 + 1, Sprechen tasks 3/6/6, telc grade bands /60 ("teilgenommen" below 36); lib/modelltest/speaking-start.ts = live partner + grading
data/modelltest/<exam>/<skill>-NN.json # Modelltest drafts (MtSet); photos.lock.json = Pexels ids in use. Rendered media lives in .unit-cache/ (gitignored) until seeded
lib/modelltest/types.ts              # MtSet/MtBlock (+ Hören track cues, Sprechen turns with phase/live, photos, live key)
lib/exam/validate-modelltest.ts      # validateTeil (closed Teile vs `full`), validateSprechen, validateWriting, validateSet (whole set, used by author.ts and the admin publish gate)
app/(admin)/admin/modelltests/       # review: overview (exam × skill × 10 slots) → [exam]/[skill]/[n] set preview with real exam components, "Geprüft" per Teil, publish gated on validateSet + mt_publish_issues; actions.ts = setReviewed/setPublished (requireAdmin each); lib/modelltest/admin.ts loads sets with Storage URLs
data/blog/<slug>.tsx · lib/blog/       # blog posts (sections as JSX, status draft/reviewed) · registry (POSTS, isLive) and types
components/design/article.tsx        # blog blocks (FactBox, Note, Steps, Compare, DoDont, DataTable, ExamStrip, LetterSample, …); blog-article.tsx renders a post + JSON-LD
app/(main)/(site)/blog/              # /blog index + one static route per post; /design/blog shows every block
```

**TODO:** extend with `data/`, `supabase/`, `scripts/`, `seo/` (with `facts.md`) when they exist.

---

## 7. Competitor research — how to use it

- `testgerman/` holds **structure and statistics** of TestGerman's platform, taken
  from Hannes's paid accounts (A1–A2 and A2–B1 roadmaps). Use them to benchmark formats, durations and pricing.
  **Never copy texts, questions, answers or audio** from them into this product.
- Key gaps to beat:
  - TestGerman's 4 DTZ mocks (B1 roadmap only) give **pass/fail**, not B1/A2/unter A2, and their Sprechen
    has no partner and no planning task (`testgerman/mock-exams.md` › DTZ).
  - All its audio is TTS, often with one voice.
  - Answer options are text only, with no picture options.
  - Sprechen is solo recordings scored by AI.

---

## 8. Engineering rules

- **Always build from the design system.** Every UI uses the components and tokens in
  DESIGN.md: `components/exam/` (Fokus) for anything exam-related, `components/design/`
  (`VButton`, `LevelScale`, `LevelSeal`, `PartIcon`, …) and `components/ui/` (shadcn) for the rest,
  on the Nachtzug tokens. Never write a one-off option card, player, timer or result view. If a
  piece is missing, add it to the system, show it on `/design/pruefung` and list it in DESIGN.md
  before using it.
- **Mobile first.** Most users are on a phone, often on a slow connection. Keep pages light and
  stream audio.
- **Accessible:** real labels, keyboard navigation. Audio gets a transcript, **shown after
  answering**.
- **No secrets in the repo.** Use env vars, and the service key never reaches the browser
  (the KNM key leaked that way). **Never log personal data.**
- **GDPR:** EU hosting. Cookie consent before Meta Pixel and PostHog marketing events.
  Datenschutzerklärung and Impressum (§ 5 DDG) are mandatory.
- **Mollie webhooks** post only an id: always fetch the payment from the API, never trust a posted status.
  - Every sync (webhook, `/api/mollie/status` return poll, daily reconcile cron) runs `processPayment()`, which is
    idempotent (claim on `status <> 'paid'`) and unit-tested (`npm test`). Keep changes test-first.
  - The subscription starts one term after the first payment (`startDate`), never today: inburgering charged month one twice.
  - Never create a subscription from a payment that has `subscriptionId` (renewals would compound).
  - Webhook reliability was an issue on the Dutch site: the return poll and the cron are the safety nets, keep both.
- **Mollie keys:** `test_` key locally (`.env.development.local`), `live_` only on Vercel production. `MOLLIE_WEBHOOK_URL`
  is unset in production (falls back to SITE_URL); locally Mollie rejects localhost, so only the return poll runs.
  `CRON_SECRET` is required for the reconcile cron (it fails closed).
- **Every route that spends credits** (TTS, grading) checks auth/admin and is capped.
  - Free tests: Schreiben/Sprechen take the email **before** the test, then `lib/kurztest/limits.ts` caps runs per IP,
    per email and per day. Sprechen in the free test is **transcribe-only** (ElevenLabs Scribe, direct), no model
    scoring. Decided by Hannes 2026-10-12.

### Inherited traps (each has bitten the Dutch sites)

- **Never `supabase db reset`.** It wipes script-seeded content. Apply new migrations with `psql`
  via the container.
- **Never `supabase stop --no-backup`.** It deletes the volumes.
- **Never edit a migration that has run anywhere.**
- **Deploys go through GitHub → Vercel only.** No `vercel deploy` / `vercel link`.
- **An RLS-denied UPDATE returns 200 with zero rows.** Test write paths with a real session.
- **A plain `select()` is capped at 1,000 rows.** Paginate any admin tally.
- **`.eq('col', null)` matches nothing.** Use `.is('col', null)`.
- **NULL means unverified, never zero.** Validators skip the check; they don't guess.
- **Never select model answers or rubric criteria into a client component.** They are a scoring
  key.
- **Answer options are reconciled by label, never deleted and re-inserted.** A delete erases what
  past candidates picked.
- **TTS voices come from one JSON file, never hardcoded.**
  - The voice matches the speaker's gender.
  - Speakers A and B are always different voices.
  - The generator throws on an uncast speaker.
- **Every exam asset lives in our own Storage.** Third-party CDN links break silently.
- **A seeder never overwrites `review_status` on an existing row.** One re-seed on the Dutch site
  silently unpublished 51 reviewed lessons.

---

## 9. Verification (after every change)

1. `npx tsc --noEmit` and `npx next build`
2. **UI:** screenshot mobile (390) + desktop (1440) with a `check-ui.mjs` harness (port from
   inburgering-website), read both, fix, re-run
3. **Schema changes:** query the table to confirm
4. **Deploys:** curl the live URL

Report the actual output. Don't declare done without it.

---

## 10. Working with me (Claude)

- **Ask before:**
  - changing pricing
  - publishing content
  - sending emails
  - running migrations against production
  - deleting data
  - any commit or push
- **Never send an email** to users or anyone else without showing the draft and getting approval.
- **Investigate / check / look into** means report only. Change nothing until approved.
- **Bigger changes:** propose a short plan first. Don't create files, pages or migrations beyond
  what was asked.
- **Keep PRs small** and describe the "why".
- **Unsure about an exam or legal fact?** Write `TODO(hannes):` and don't guess.
- **Frontend work:** load impeccable, design-taste-frontend and emil-design-eng first (global
  rule).
- **Learning loop:** read `LEARNINGS.md` at session start. Append after every session with a
  change:

```
## [DATE] — [short title]
**Changed:** one sentence, with file paths.
**Outcome:** SUCCESS or FAILURE
**What worked / went wrong:** concrete.
**Lesson:** the generalizable rule.
```

---

## 11. Related projects

- `../inburgering-website` (inburgeringoefenen.nl): the closest template. Fork its machinery
  (exam engine, admin CRUD, TTS pipeline, rubric grading, funnel; not payments) and read its
  `docs/decisions/` before porting an area. **Don't copy Dutch content or exam formats.** The DTZ
  is structured differently (one combined exam, scaled result, pair Sprechen).
- `../knm-website` (knmoefenen.nl): the original platform. Older patterns; prefer inburgering's.
