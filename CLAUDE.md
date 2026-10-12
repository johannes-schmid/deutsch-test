# CLAUDE.md — deutschtest-ueben.de

German exam-prep platform for migrants in Germany. German sister product of
**inburgeringoefenen.nl** / **knmoefenen.nl**, built and run solo by Hannes.
Read §1–§4 before touching anything; the rest is reference.

---

## 1. Dev server (always use this)

Scaffolded 2026-10-11 (Next.js 16.4, Tailwind v4, shadcn base-nova). Supabase is not set up yet.
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
- Build: `npx next build` · Types: `npx tsc --noEmit` (both verified). Unit/E2E: not set up yet.
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
  (B1 / A2 / unter A2), never a percentage or "bestanden".
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
- **Sell one DTZ bundle, not four modules.** Candidates take all four parts on one day.
  This deliberately differs from inburgeringoefenen.nl, which sells per module.
- **Pricing: TODO(hannes).** Benchmark: TestGerman charges €19.90/month, €44.90 for 3 months,
  €74.90 for 6 and €119.90 for 12, sold per goal ("Visa & Family", "Citizenship") rather than per
  level. Offer a 3-month plan. Prices are always a concrete € amount, never "ab X".
- **Prices include 19% VAT** for German consumers (OSS). Never show prices excluding VAT to
  consumers.
- **One source of truth for prices** (`lib/pricing.ts`). Derived numbers (savings %, per-month
  price) are computed, never typed in by hand.
- **Check entitlement with one helper** (e.g. `ownsDtz(meta)`), never with a bare `plan` field.
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
- **Explanations** are available in English, Arabic, Turkish, Ukrainian, Russian and Dari.
  Only the explanations are translated; exam content stays German.
  - **RTL support** for Arabic and Dari. Every forward arrow flips in RTL.
- **Code, comments, commit messages and `LEARNINGS.md`:** English. **Chat with Hannes:** English.
- **URL slugs:** German, lowercase, `ü→ue`, `ö→oe`, `ä→ae`, `ß→ss`.
- **i18n:** every user-facing string goes into every locale file. Grep the file before adding a
  key: duplicate JSON keys don't error, and the last one silently wins.

---

## 5. Stack

**Default: the same as inburgering-website** (both Dutch sites run on Next.js, not vanilla JS), so
the exam engine, admin, TTS pipeline and funnel can be ported. **Payments differ: Stripe, not
Mollie.** Don't port the Dutch sites' Mollie routes; rebuild that layer on Stripe.

- **Next.js 16** (App Router, TypeScript strict) · **Tailwind v4** + **shadcn/ui** · **next-intl**
  (de + 6 explanation locales)
- **Supabase:** Postgres, RLS, Auth, Storage, **EU region**
- **Stripe** for payments: Checkout + Billing subscriptions, Customer Portal for cancel/plan
  changes, **Stripe Tax** for the 19% German VAT (OSS). For DE, enable cards, SEPA Direct Debit,
  PayPal, Klarna, Apple Pay and Google Pay. Read the official Stripe docs before building.
- **Resend** · **Vercel** hosting + crons
- **PostHog** (+ Meta Pixel for ads) and GA4. **TODO(hannes):** use the shared PostHog project
  split by `$host` (as the Dutch sites do), or a separate one?
- **ElevenLabs:** a designed German voice cast for Hören monologues and dialogues
- **Model calls go directly to the provider. Never via Vercel AI Gateway** (global rule).
  inburgering-website's exception does not carry over.

### Site structure

```
/                         home, diagnostic CTA ("Wie weit bist du von B1?")
/dtz                      DTZ overview → /dtz/hoeren · /dtz/lesen · /dtz/schreiben · /dtz/sprechen
/dtz/modelltest/[n]       full mock exams
/b1-einbuergerung         landing: citizenship applicants
/a2-zu-b1                 landing: stuck at A2
/einbuergerungstest       free: all 310 BAMF questions incl. Bundesland questions
/leben-in-deutschland     free civic test practice (see the TODO in §4)
/ratgeber/...             guides (e.g. booking the DTZ as an external candidate)
/preise                   pricing
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
├── research/dtz-blueprint.md        # ★ the real DTZ format, sourced and dated (to be written)
└── testgerman/                       # competitor research, mirrors their app sections; README.md in every folder
    ├── analysis.md · examples.md    #   full teardown · structural examples (≤20-word excerpts)
    ├── uebungen/{lesen,hoeren,schreiben,sprechen}/<level>/<topic>/  # "Übungen": all 275 exercises in full, screenshots/
    ├── leben-in-deutschland/        #   "Leben in Deutschland" course library (NOT the LiD test); A2 Sprechen course teardown inside
    ├── pruefungssimulation/         #   "Prüfungssimulation": 18 full mocks as <provider>/<level>/*.md, screenshots/, mock-exams.md blueprint
    └── data/                        #   catalogue CSVs + raw/ (recon JSON + bundle; reference only, never ship)
```

```
DESIGN.md                            # ★ the chosen visual system (Nachtzug): tokens, components, do's and don'ts
seo/keyword-strategy.md              # keyword → page ownership, homepage title/H1/meta
app/design/                          # /design/nachtzug: locked-in landing + live design-system panel (noindex)
│   └── design.css                   #   Nachtzug tokens + gradients, mapped onto shadcn tokens
components/ui/                       # shadcn components (Base UI)
components/design/                   # shell (switcher), kit, design-system panel, variants/
lib/design/                          # content.ts (shared copy, placeholder prices), variants.ts
```

**TODO:** extend with `data/`, `supabase/`, `scripts/`, `seo/` (with `facts.md`) when they exist.

---

## 7. Competitor research — how to use it

- `testgerman/` holds **structure and statistics** of TestGerman's platform, taken
  from Hannes's paid account. Use them to benchmark formats, durations and pricing.
  **Never copy texts, questions, answers or audio** from them into this product.
- Key gaps to beat:
  - TestGerman's DTZ mock is advertised but **inactive**.
  - All its audio is TTS, often with one voice.
  - Answer options are text only, with no picture options.
  - Sprechen is solo recordings scored by AI.

---

## 8. Engineering rules

- **Mobile first.** Most users are on a phone, often on a slow connection. Keep pages light and
  stream audio.
- **Accessible:** real labels, keyboard navigation. Audio gets a transcript, **shown after
  answering**.
- **No secrets in the repo.** Use env vars, and the service key never reaches the browser
  (the KNM key leaked that way). **Never log personal data.**
- **GDPR:** EU hosting. Cookie consent before Meta Pixel and PostHog marketing events.
  Datenschutzerklärung and Impressum (§ 5 DDG) are mandatory.
- **Stripe webhooks:**
  - Verify the signature (`stripe.webhooks.constructEvent` on the raw body).
  - Make them idempotent by storing processed `event.id`s.
  - Handle events arriving out of order.
  - Grant access from the webhook, never from the success-page redirect.
  - Webhook reliability was an issue on the Dutch site (with Mollie).
- **Stripe keys:** test-mode keys locally, live keys only on Vercel production. The secret key and
  webhook secret are server-only env vars.
- **Every route that spends credits** (TTS, grading) checks auth/admin and is capped.

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
