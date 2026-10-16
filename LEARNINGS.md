# LEARNINGS

## 2026-10-11 — Scaffold + 5 design directions
**Changed:** Scaffolded Next.js 16.4 + Tailwind v4 + shadcn (port 3002); built `/design/{leitsystem,werkstatt,lernpfad,pruefstand,nachtzug}` with a switcher, light/dark per variant and a design-system section (`app/design/`, `components/design/`, `lib/design/`).
**Outcome:** SUCCESS
**What worked / went wrong:** A `[variant]` dynamic route plus `usePathname` in the shell triggered "Next.js encountered URL data … outside of `<Suspense>`" under cacheComponents + partialPrefetching. Five static routes passing the id as a prop fixed it. `create-next-app` won't run in a non-empty folder, so it was scaffolded in a temp dir and moved in.
**Lesson:** With cacheComponents on, a fixed set of pages should be static routes; read `node_modules/next/dist/docs/` before using params or navigation hooks.

## 2026-10-11 — Startbahn variant (Handshake style, Leitsystem palette)
**Changed:** Added `/design/startbahn` (`components/design/variants/startbahn*.tsx`, tokens in `app/design/design.css`, Anton font).
**Outcome:** SUCCESS
**What worked / went wrong:** A plain CSS class (`.sb-mega` uppercase) beat Tailwind's `normal-case`, because unlayered CSS wins over Tailwind v4 layers. A flipped grid row kept the narrow column for the panel.
**Lesson:** Plain classes in design.css override Tailwind utilities, so use inline style or a modifier class to override them. When flipping a two-column row, flip the column widths too.

## 2026-10-12 — Konfetti variant (Teak style) + palette switcher
**Changed:** Added `/design/konfetti` (`components/design/variants/konfetti.tsx`, Funnel Display/Sans + DM Mono) and a per-variant palette switcher (3 palettes each) in `components/design/shell.tsx`; brand colours in `app/design/design.css` now derive from `--p-*` tokens via `color-mix`, and hardcoded hexes in the variant components were swapped for those tokens.
**Outcome:** SUCCESS
**What worked / went wrong:** Making every palette derive from 4–7 `--p-*` seeds (neutrals included, via `color-mix(in oklab, …)`) kept light/dark × palette combinations coherent without writing 42 hand-tuned blocks. `getPropertyValue` on a derived token returns the `color-mix()` string, so the design-system swatches resolve it to hex through a 1px canvas.
**Lesson:** Keep component colours on tokens, never hex: a theme switch only covers what is tokenised. Palette selectors (`[data-palette]`) must come after the `.dark` rules, because both have the same specificity.

## 2026-10-12 — Nachtzug: new fonts + platform mock
**Changed:** Swapped Nachtzug's Newsreader/Hanken for Host Grotesk + Reddit Mono, added a clickable Modelltest window (`components/design/variants/nachtzug-demo.tsx`) and app mocks in the three practice panels (`nachtzug.tsx`, `.nz-app` in `app/design/design.css`).
**Outcome:** SUCCESS
**What worked / went wrong:** A `.nz-app` class that remaps the `--v-*` tokens to a fixed dark set let the shared kit components (AudioPlayer, AnswerOptions, LevelScale, Timer) render on dark glass in both page modes, with no forks. A pill CTA inside a narrow mobile card wrapped onto two lines until it got `whitespace-nowrap`.
**Lesson:** For an always-dark inset UI inside a light/dark page, remap the tokens on a wrapper class. Don't hardcode colours into shared components.

## 2026-10-12 — Nachtzug: split hero + light by default
**Changed:** Hero is now a split layout with a dusk "photo" card, a frosted phone lock screen and a pill notification (`HeroScene` in `nachtzug.tsx`). Nachtzug defaults to light (`lib/design/variants.ts`), the dark practice band uses tokens, and `.nz-app` is light glass with a `.dark` override.
**Outcome:** SUCCESS
**What worked / went wrong:** Light glass at 66% white over a dark gradient turned muddy lavender-grey with weak contrast. 88% white plus solid white inner surfaces read clean.
**Lesson:** Light frosted glass over a dark backdrop needs ≥85% opacity. Below that it takes on the backdrop hue and secondary text fails contrast.

## 2026-10-12 — Nachtzug: light photo gradients
**Changed:** `--g-photo-1…6` now have light dawn versions in light mode; the night originals moved to `.dark` (`app/design/design.css`). `.photo` text uses `--v-photo-ink`, and the CTA and audience-card text in `nachtzug.tsx` now use tokens.
**Outcome:** SUCCESS
**What worked / went wrong:** Same composition, same orb positions, only the base and orb tints lightened, so the style stays recognisable. Text hardcoded white on the photos had to move to tokens first.
**Lesson:** Theme imagery-like gradients per mode the same way as colour tokens, and never hardcode text colour on them.

## 2026-10-12 — Nachtzug: single hero gradient, gradient motion, keyword-led copy
**Changed:** Removed the hero's gradient card (phone now sits on the header orbs with a breathing `.nz-halo`), added a slow `photo-drift` animation to all `.photo` gradients, and rewrote Nachtzug copy around "DTZ online üben" (`components/design/variants/nachtzug.tsx`, `app/design/design.css`, `lib/design/content.ts`).
**Outcome:** SUCCESS
**What worked / went wrong:** Animating `translate`/`rotate` (individual transform properties) on `::before` while hover uses `scale` lets both coexist; a `transform` keyframe would have killed the hover zoom. Keyword research was qualitative only (US-based search, no volumes); see scratchpad report.
**Lesson:** Don't stack a gradient card on a gradient section; one gradient layer per view. Use individual transform properties when a loop animation and a hover effect share an element.

## 2026-10-12 — Nachtzug icon set + standard elements
**Changed:** Added `components/design/variants/nachtzug-icons.tsx` (part/test icon tiles, 3-arc level seals, A2→B1 path, meta chips, exam ticket), used them in the audience cards, and rendered them in a new "Icons & Elemente" panel via an optional `extra` prop on `DesignSystem` (`components/design/design-system.tsx`, `variant-page.tsx`).
**Outcome:** SUCCESS
**What worked / went wrong:** Tinting tiles with `color-mix(var(--tone) 26%, var(--v-surface))` made one component work in light and dark across all palettes. A CSS-mask ticket notch rendered as bumps over glass; a dashed perforation line was cleaner.
**Lesson:** Drive per-skill colour from the existing `--v-sk-*` tokens, not new hexes; the level seal encodes the scaled B1/A2/unter A2 result, never a percentage.

## 2026-10-12 — Nachtzug logo variants + Versprechen art
**Changed:** Added `components/design/variants/nachtzug-logo.tsx` (3 Umlaut-Punkte variants: Punkte, Leuchte, Dialog, with a pick-for-header switcher in the design panel), wired `NzLogo` into the Nachtzug nav/footer, and added `PromiseArt` (human-review card) to the empty "Unser Versprechen" photo in `nachtzug-icons.tsx`.
**Outcome:** SUCCESS
**What worked / went wrong:** A `grid-cols-[1fr_auto]` row with a fixed 120px tile overflowed its card at 1440; `minmax(0,1fr)` plus a smaller tile fixed it. The first screenshot was taken before HMR applied, so it showed the old state.
**Lesson:** Wait briefly after edits before screenshotting, and use `minmax(0,1fr)` next to fixed-size tiles.

## 2026-10-12 — Logo locked to "Leuchte"
**Changed:** `components/design/variants/nachtzug-logo.tsx` is now a single logo: the Leuchte mark on a white rounded tile in the header/footer, with the whole wordmark in ink (no grey "deutschtest"). The Punkte/Dialog variants and the switcher are gone.
**Outcome:** SUCCESS
**What worked / went wrong:** On the white tile the U and dots use fixed colours (#0E1322, ember, #5E86FF), so the tile reads the same in light and dark.
**Lesson:** A brand mark on a fixed-colour tile needs fixed colours of its own, not theme tokens.

## 2026-10-12 — Lock in Nachtzug, exam-prep hero, keyword strategy
**Changed:** Deleted the other six variants (app/design/*, components/design/variants/*) and their CSS, fonts and switcher links. /design now redirects to /design/nachtzug. Rewrote the Nachtzug hero and evening copy (nachtzug.tsx, variants.ts tagline) and wrote seo/keyword-strategy.md.
**Outcome:** SUCCESS
**What worked / went wrong:** The repo isn't under git, so the deleted files were tarred to the scratchpad before removal. Narrowing VARIANT_IDS to one id broke a `{ [id]: "light" | "dark" }` spread in shell.tsx (it widened to string), and tsc failed on stale `.next/types` until a build regenerated them.
**Lesson:** Map competitor claims to provable ones before copying their structure: "Pass DTZ" becomes "B1 schaffen", user counts get dropped, and "AI feedback" becomes "Feedback nach den DTZ-Kriterien". Back up before deleting outside git.

## 2026-10-12 — DESIGN.md, switcher removed, repo connected
**Changed:** Wrote DESIGN.md (Nachtzug tokens and component inventory) and replaced components/design/shell.tsx with a static Glut · Hell frame (no switcher). Initialised git with origin github.com/johannes-schmid/deutsch-test and added testgerman/ to .gitignore.
**Outcome:** SUCCESS
**What worked / went wrong:** The GitHub repo is public. testgerman/ holds competitor exercises in full from a paid account, so it stays local only.
**Lesson:** Check repo visibility before the first push. Competitor and copyright research never goes into a public repo.

## 2026-10-12 — Removed design-system panel
**Changed:** Removed the token panel at the bottom of /design/nachtzug: deleted components/design/design-system.tsx and the NachtzugLogos/NachtzugElements showcases, and reduced shell.tsx to a static server component.
**Outcome:** SUCCESS
**What worked / went wrong:** DESIGN.md is now the only reference for tokens and components; nothing on the page duplicates it.
**Lesson:** Once a direction is locked, the documentation lives in DESIGN.md and not on the page.

## 2026-10-12 — Nachtzug becomes the landing page
**Changed:** Moved the landing to `/` via app/(main)/{layout,page}.tsx and moved the tokens from app/design/design.css to app/(main)/landing.css. Deleted all /design routes. The page now carries the title and meta description from seo/keyword-strategy.md.
**Outcome:** SUCCESS
**What worked / went wrong:** The root layout still loads Geist for future surfaces; (main) loads Host Grotesk and Reddit Mono.
**Lesson:** Public pages live in the (main) route group so the portal, auth and admin layouts stay separate (CLAUDE.md §5).

## 2026-10-12 — English default landing + German /de
**Changed:** Moved all landing copy into lib/i18n/landing.ts (en + de, with de as the type source so a missing key fails tsc). `/` renders English and `/de` German, linked with hreflang, and `<html lang>` is now "en" with the German wrapper set to `lang="de"`. The new hero reads "Pass Goethe, telc, DTZ & ÖSD. No surprises on exam day." and no longer mentions B1.
**Outcome:** SUCCESS
**What worked / went wrong:** The German H1 is about 30% longer and ran to five lines at the old size, so the scale dropped to clamp(38px,4.8vw,68px). The German "Gratis starten" pushed the mobile nav past 390px; the language switch now shows only its icon below sm.
**Lesson:** Size headlines for the longest locale (German) and check the mobile nav in every locale. Static routes per locale (`/`, `/de`) avoid reading params under cacheComponents. Switch to next-intl when the portal needs the six explanation locales.

## 2026-10-12 — Domain + keyword research
**Changed:** Added Semrush DE keyword data and insights in `seo/semrush-2026-10-12.md`; competitor map published as an artifact.
**Outcome:** SUCCESS
**What worked / went wrong:** Google autocomplete (suggestqueries, hl=de&gl=de) was a fast free proxy for phrasing; Semrush gave the volumes. "Probeprüfung" looked ideal as a brand until autocomplete showed it means school exams (Realschule/MSA). "deutschtest" turned out to be a small keyword family (10k/mo) next to "b1 prüfung" (208k/mo).
**Lesson:** Check what a candidate brand word autocompletes to before recommending it, and size keyword families before naming a domain after one.

## 2026-10-12 — TestGerman B1 scrape + level-first folders
**Changed:** Scraped the "Integration & Citizenship" roadmap (158 B1 exercises, 11 B1 mocks incl. 4 DTZ) into `testgerman/b1/`, and moved everything to `testgerman/{a1,a2,b1}/{uebungen,pruefungssimulation}/`. Cross-level docs are now `testgerman/{uebungen,pruefungssimulation,mock-exams}.md`; `analysis.md` has a B1 section (§2b).
**Outcome:** SUCCESS
**What worked / went wrong:** The previous session's render scripts were still in its scratchpad and rendered B1 unchanged. Writing the auth token to a file was blocked as credential materialization. Fetching inside the page with `evaluate_script` and saving only the JSON response (`filePath`) worked, and the token never left the browser. Appending rows to a CSV whose last line had no trailing newline glued the first new row onto it. A backup copy saved it.
**Lesson:** Fetch authenticated competitor data inside the browser and save the response, never the token. Check for a trailing newline before appending to a CSV. Their DTZ mocks are pass/fail with solo Sprechen. That is our clearest realism gap to exploit.

## 2026-10-12 — Exam UI: three directions
**Changed:** Added `/design/pruefung` (noindex) with three switchable directions for player, question types, right/wrong, audio, Lesen and Sprechen (`components/design/exam/{bogen,fokus,fahrplan,lab,shared}.tsx`, specimens in `lib/design/exam-samples.ts`), and an "Exam UI" section in DESIGN.md with the rules shared by all three.
**Outcome:** SUCCESS
**What worked / went wrong:** At 390px, grids without explicit columns sized themselves to their widest min-content child (scroll-snap rows, phase tracks) and overflowed. `grid-cols-[minmax(0,1fr)]` plus `min-w-0` on flex segments fixed it. `resize_page` did nothing on a background tab, so mobile checks need `emulate` with a viewport. Chrome DevTools can only write screenshots inside the project, so they go to `.impeccable/review/` (gitignored).
**Lesson:** Give every responsive grid a `minmax(0,1fr)` base column. Exam realism rules (no feedback in exam mode, no seek, play count, visible voices, pair Sprechen) belong in the design system, not in each component.

## 2026-10-12 — Fokus locked as the exam design system + results page
**Changed:** Turned the Fokus direction into reusable components in `components/exam/` (shell, stage, items, audio, feedback, reading, writing, speaking, part intro, results), with types, de/en copy and specimens in `lib/exam/`. Rebuilt `/design/pruefung` as the reference and added `/design/pruefung/ergebnis`. Deleted the Bogen and Fahrplan directions. DESIGN.md and CLAUDE.md §8 now say every UI is built from the system.
**Outcome:** SUCCESS
**What worked / went wrong:** Keeping solutions off item types and passing them only as a `review` prop made the exam/practice/review states one component each, and it follows the scoring-key rule. A level scale inside every part card repeated the level pill, so the card kept only the pill. On mobile the result seal sat under the copy until it got `order-first`.
**Lesson:** Design-system components take content as data and grading as a separate prop. On a results screen the verdict (seal) comes first on mobile, and each level appears once per card.

## 2026-10-12 — Kurztest generator + first 3 samples
**Changed:**
- Added the generation pipeline: `lib/exam/{blueprint,kurztest,validate}.ts` and `scripts/{generate,tts,validate}-kurztest.ts`.
- Generated 3 drafts in `data/kurztest/drafts/`: Lesen T3, Hören T1 and Hören T3. Audio is in `public/audio/kurztest/`.
- The drafts can be reviewed at `/design/kurztest`, rendered with `components/exam`.

**Outcome:** SUCCESS

**What worked / went wrong:**
- Claude (`claude-opus-5-5`, effort high, `messages.parse` + zod) cost about $0.04–0.07 per block.
- ElevenLabs `eleven_v4` works on `/v1/text-to-dialogue/with-timestamps`. Its `voice_segments` map directly onto `AudioClip.segments`, so no per-turn rendering or stitching is needed.
- The 3 samples used 972 characters (≈972 credits). Both clips landed inside the blueprint lengths (23.5 s and 30.6 s).
- The scoped ElevenLabs key lacks `models_read` and subscription access, so it can't list models or show remaining credits.
- The model wrote the audio `situation` as a full sentence. The player shows it as a label, so the prompt now asks for 2–4 words.

**Lesson:**
- Draft files keep `display` (kit types) and `key` (answers, evidence, transcript) apart, so the page renders without an adapter and the key stays server-side.
- The validator catches length drift; the Lesen sample came out 1 word over.

## 2026-10-12 — Full Kurztest drafts for all four skills
**Changed:**
- The generator now covers every DTZ format: a/b/c, R/F, ad matching with x, opinion matching, gap fill, Schreiben A/B and Sprechen Teil 1–3 as a pair exam. `--kurztest` fills whatever blocks are missing per `KURZTEST` in `lib/exam/blueprint.ts`.
- Output is 17 drafts: Lesen 10 items, Hören 10 items, Schreiben A/B, Sprechen 3 Teile.
- `MatchItem` got an optional `noMatch` prop, because Hören T4 has no "x".
- `/design/kurztest` now has a tab per skill.

**Outcome:** SUCCESS

**What worked / went wrong:**
- Claude cost $0.82 for 14 blocks, with the four skills generated in parallel.
- eleven_v4 used 6,422 characters this round, 7,394 in total.
- Sprechen renders one clip per examiner or partner turn, because the candidate answers in between.
- Three drafts are slightly outside the blueprint and are flagged by the validator for review:
  - Hören T4 is 66.6 s against a 70 s minimum.
  - Lesen T1 has 87 words against a 90 minimum.
  - Lesen T3 has 121 words against a 120 maximum.
- Content issues the validator cannot catch:
  - The Lesen T5 letter is dated 2025.
  - "Lindenstraße 14" appears in two drafts.

**Lesson:**
- Ask the model for one fixed schema per answer format, and derive the kit's display types and item numbers in code. Don't ask it to produce kit JSON directly.
- Format checks catch length and structure. Dates, repeated names and plausibility still need the human review.

## 2026-10-12 — Kurztest live on the site (lead magnet)
**Changed:**
- **Pages:** `/dtz/kurztest` hub plus 4 static test pages (`components/kurztest/*`, built on `components/exam`). The landing CTAs point to the hub.
- **API:**
  - `/api/kurztest/submit` scores server-side and returns only an id.
  - `/api/kurztest/unlock` takes the email, then returns the result or grades the attempt: Schreiben with Claude, Sprechen with ElevenLabs STT plus Claude.
- **Storage:** Vercel Blob, with `.data/` as the dev fallback.
- **Admin:** `/admin/kurztest` with a CSV export, behind basic auth in `proxy.ts`.
- **Drafts:** all set to `reviewed`.

**Outcome:** SUCCESS (locally). Production still needs a Blob store and env vars.

**What worked / went wrong:**
- **Answer keys never reach the client:**
  - `lib/kurztest/data.ts` is `server-only`, and `publicSet` strips `key`.
  - A grep of the built `.next/static` found no explanations, `correct` values or model answers.
  - `/design/kurztest` does ship them, so `proxy.ts` now guards it.
- **Scroll helper bug:** in current Chrome `window.scrollTo()` returns a Promise. `useEffect(top, …)` with `top = () => window.scrollTo(...)` crashed with "destroy is not a function".
- **Multipart in route handlers:** `instanceof File` failed in the route runtime. Use `typeof f !== "string"`.
- **Test script bug:** zsh doesn't word-split `$VAR`, so curl got one argument. Use a bash array.
- **Partner name:** the Sprechen partner was "Ben" in the UI, "Dragan" in Teil 1 and "Herr Kovač" in Teil 2. It is now one person, and the generator reuses the cast partner across Teile.
- **Funnel counts:** Blob has no append and the per-record JSON is slow to read in bulk. Marker files at `stats/<kind>/<skill>/<level>/<id>` make the admin counts a single list call.
- **Timings:**
  - Schreiben grading takes about 15 s.
  - Sprechen (12 STT calls plus grading) takes about 13 s.
  - The grader spotted stand-in audio that just repeated the partner's lines.

**Lesson:**
- Gate results server-side and validate before writing records, so failed requests don't leave orphan leads.
- One partner identity per Sprechen set is a realism requirement, so the generator must enforce it.

## 2026-10-12 — Kurztest inside the site layout + SEO as on inburgering
**Changed:** Extracted `components/design/site-chrome.tsx` from the landing; `app/(main)/dtz/kurztest/layout.tsx` wraps all Kurztest pages in nav + footer; tests run in a framed `ExamStage` below an indexable header (`components/kurztest/{page-header,skill-page}.tsx`); added `lib/seo.ts`, `app/sitemap.ts`, `app/robots.txt/route.ts`; pages are now `index, follow` with canonical, OG, Quiz/CollectionPage + BreadcrumbList JSON-LD.
**Outcome:** SUCCESS
**What worked / went wrong:**
- The full-screen exam stage with its own logo bar read as a different site. A framed stage between the site nav and footer (inburgering's `/oefenen/{skill}` pattern) fixes it.
- `scrollTo(0)` on phase change now scrolls to the exam frame, and skips the intro so page load doesn't jump.
- `export const dynamic = "force-static"` breaks a route handler under `cacheComponents`. Drop it; GET handlers prerender anyway.
- After adding a nested layout, `tsc` failed on stale `.next/dev/types`. `npx next typegen` fixes it.
**Lesson:** Lead magnets live in the normal site chrome with one H1 in the page header; inner exam headings (gate, result hero) are h2.

## 2026-10-12 — /gratis-test: level + exam picker, DTZ moved under it
**Changed:** `app/(main)/dtz/kurztest` → `app/(main)/gratis-test/dtz`, new overview `app/(main)/gratis-test/page.tsx` + `components/kurztest/exam-picker.tsx`, exam catalogue `lib/exams.ts`, 308s in `next.config.ts`, sitemap/nav/CTAs repointed.
**Outcome:** SUCCESS
**What worked / went wrong:** Static folders per exam (no `[exam]` param) keep cacheComponents happy. shadcn `TabsTrigger` ships `hover:text-foreground`, which beat `data-active:text-*` on the hovered active tab (white label vanished on ink); an explicit `data-active:hover:text-*` fixed it. Base UI `keepMounted` keeps inactive panels in the HTML, so every exam stays crawlable.
**Lesson:** When restyling shadcn primitives, override every state variant they set (hover, dark, data-active), not just the base; check the hovered active state.

## 2026-10-12 — First sample drafts for the 7 non-DTZ exams
**Changed:** `lib/exam/exam-blueprints.ts` (sampled parts per exam), `--exam` in `scripts/generate-kurztest.ts`, exam-aware `lib/exam/validate.ts` + `/design/kurztest` selector, accents in `data/tts-voices.json`; 14 drafts in `data/gratis-test/<exam>/`, 6 Hören clips.
**Outcome:** SUCCESS (13/14 pass the blueprint check; telc A2 ads 3 words long)
**What worked / went wrong:** Claude ≈ $0.87 for 14 drafts, TTS 3,225 characters. Voices are cast by gender + accent in speaker order (`spec.accents`); DTZ stays on "de" only, so the new AT/CH voices can never leak into DTZ audio. Single-speaker clips all land on the first free voice (Ela), so every monologue sounds the same.
**Lesson:** Sample only parts the kit can render faithfully; a format the kit fakes (e.g. ÖSD's tick grid as 4-option choices) gets a `TODO(hannes)` on the spec, not silence.

## 2026-10-12 — Launch pages: /dtz, /preise, landings, legal, llms.txt
**Changed:** `app/(main)/(site)/{dtz,preise,a2-zu-b1,b1-einbuergerung,ueber-uns,kontakt,impressum,datenschutz}` on a shared layout; `components/design/content-page.tsx` (PageHeader without eyebrow, Prose, Byline, TestCta, Todo); `lib/pricing.ts` replaces `PLACEHOLDER_PLANS`; `OPERATOR`/`LEGAL_COMPLETE` in `lib/seo.ts`; real nav + footer links in `site-chrome.tsx`; `app/llms.txt/route.ts`; sitemap entries; `seo/facts.md`.
**Outcome:** SUCCESS (all routes 200 on dev; my files pass tsc). Full `next build` was blocked by a parallel session's half-done kurztest refactor (`loadSet(exam, skill)`).
**What worked / went wrong:**
- Legal facts came from gesetze-im-internet (StAG § 10, IntV § 17), and each one is in `seo/facts.md`. The DTZ timings are still unsourced.
- Impressum/Datenschutz are noindex and kept out of the sitemap until `OPERATOR.address` is set, so an incomplete Impressum can't get indexed.
- First draft of /preise said "kein Abo" while CLAUDE.md plans Stripe subscriptions; removed. Don't promise billing terms before they're decided.
- The nav "Anmelden" button did nothing (no auth yet); removed rather than ship a dead control.
- JSX text doesn't parse ` `; use `{" "}`.
**Lesson:** Write the Datenschutz from what the code does (grep stores, routes, third-party SDKs), not from the sister site's policy. The Dutch one lists services this site doesn't use.

## 2026-10-12 — 5-minute tasters, API limits, Start Deutsch 1 set
**Changed:**
- The free tests are now ~5-minute tasters: `TASTER` in `lib/exam/blueprint.ts` picks reviewed blocks, and `loadSet(exam, skill)` in `lib/kurztest/data.ts` applies it. Everything is exam-aware (loader, scoring, API, stats, admin).
- Paid runs are now capped:
  - Schreiben/Sprechen take the email before the test (`/api/kurztest/quota`).
  - `lib/kurztest/limits.ts` caps runs per IP, per email and per day.
  - Sprechen is transcribe-only.
- Start Deutsch 1:
  - 13 drafts in `data/gratis-test/start-deutsch-1/`.
  - Static routes under `/gratis-test/start-deutsch-1`, via the generic `ExamHub`/`SkillPage`.
  - Kit additions: pictogram options (`lib/exam/pictos.ts`), speaking `cards`, single-task `WritingTask`, `ScoreSeal` + points/pass results.

**Outcome:** SUCCESS

**What worked / went wrong:**
- The generator scripts need `npx tsx --env-file=.env.local`. Without it the Anthropic SDK fails with "Could not resolve authentication method".
- Two older samples kept item numbers from before the full spec existed (n=1 in Teil 2/3). They clashed with the new Teil 1 blocks, so they were renumbered by hand.
- A partner-gender detail ("Partner" vs "Partnerin") was hardcoded in the speaking prompt; it is now gender-aware.
- Cost: Claude $0.36 for 11 blocks; eleven_v4 2,023 characters.

**Lesson:**
- When a spec gains earlier Teile, re-check the item numbers of existing drafts. The validator doesn't catch duplicate numbers across files yet.
- Any check that encodes one exam's format (pair partner, picture brief) must be keyed to that exam.

## 2026-10-12 — Brand icons, share card, German as default
**Changed:** `app/{icon.svg,favicon.ico,apple-icon.png,opengraph-image.png,manifest.ts}` + `public/icon-*.png` rendered from the logo with Playwright; Next starter SVGs removed; `/` now German, English at `app/(main)/en`, `/de` → `/` 308 in `next.config.ts`; crumbs, nav, sitemap, hreflang, llms.txt repointed; `<html lang="de">`, theme color, twitter card.
**Outcome:** SUCCESS (tsc clean, build 39/39, all icon routes 200, `/de` 308).
**What worked / went wrong:** A page that sets its own `openGraph` loses the file-convention `opengraph-image` from the root, so /dtz etc. had no og:image. Fixed by adding `OG_IMAGE` inside the shared `openGraph()` helper.
**Lesson:** After adding an `opengraph-image`, curl an inner page with its own metadata and check `og:image`; inheritance stops at the first page-level `openGraph`.

## 2026-10-12 — KNM-style SEO header on /gratis-test/dtz/hoeren
**Changed:** Hören title/description/H1/lead and a new optional per-skill `eyebrow` in `lib/i18n/kurztest.ts`; `components/kurztest/skill-page.tsx` uses it; H1 gets `text-balance` in `components/kurztest/page-header.tsx`.
**Outcome:** SUCCESS
**What worked / went wrong:** Copied knmoefenen.nl's pattern: the title carries the primary keyword plus the year, the H1 uses a variant keyword plus a number, the eyebrow lists format facts, and the lead spells out the full exam name. tsc and build pass. Screenshots at 390 and 1440 look clean.
**Lesson:** Title and H1 should target different query variants ("gratis üben" vs "Test") instead of repeating each other. A year in a title has to be updated by hand every January.

## 2026-10-13 — Google Analytics behind an opt-in banner
**Changed:** `components/design/consent.tsx` (banner + `@next/third-parties` GoogleAnalytics, loads only after "Akzeptieren"; ID from `NEXT_PUBLIC_GA_ID`), mounted in `SiteFooter` with a "Cookie-Einstellungen" footer link; `.consent-in` entry transition in `landing.css`; GA section in `/datenschutz`.
**Outcome:** SUCCESS (tsc clean, build passes; Playwright: 0 GA requests before consent, gtag loads after accept, banner reopens from footer, decline removes `_ga` cookies).
**What worked / went wrong:** Clearing `_ga` cookies then reloading left one cookie, because gtag rewrote it on unload. Setting `window['ga-disable-<ID>'] = true` before clearing fixed it.
**Lesson:** To revoke GA consent, disable gtag first, then delete cookies, then reload. No GA without opt-in in DE (§ 25 TDDDG), unlike the Dutch sites.

## 2026-10-13 — General cookie banner with categories
**Changed:** `components/design/consent.tsx` is now a standard cookie banner (Nur notwendige / Alle akzeptieren / Einstellungen with Notwendig + Statistik switch), bottom right on desktop; shadcn `components/ui/switch.tsx` added; `.consent-panel` expand transition in `landing.css`; Datenschutz button names updated.
**Outcome:** SUCCESS (tsc, build; Playwright: GA only with Statistik on, switch state persists, revoke clears `_ga`).
**What worked / went wrong:** A GA-named headline read oddly to the user; the familiar "Wir nutzen Cookies" + categories pattern fits better. Storage key bumped to v2, so earlier choices are asked again.
**Lesson:** For consent UI, use the pattern visitors already know; name vendors inside the categories, not in the headline.

## 2026-10-13 — Free-test drafts for all 7 other exams, Goethe/ÖSD B1 split, exam badges
**Changed:**
- `goethe-oesd-b1` is now two exams, `goethe-b1` (DE voices) and `oesd-b1` (AT/CH voices), each with its own set. Every exam in `lib/exams.ts` has a `brand` and a `pass` mark.
- Per-exam specs moved to `lib/exam/exams/<exam>.ts` (context, parts, plan, Schreiben/Sprechen briefs, rubric, taster), aggregated in `exam-blueprints.ts`. Page copy goes in `lib/i18n/exam-pages/<exam>.ts`.
- Generator: the non-DTZ writing and speaking prompts read `hint`/`tasks`/`points`/`accents` from the OpenSpec, not hardcoded Start Deutsch 1 text. The validator reads `tasks`/`points`/`partner` from the spec. Rubric lines take `steps` (B1: A–E).
- `ExamMark` badge (`variants/nachtzug-icons.tsx`, `--v-ex-*` tokens) on the overview cards and `/design/pruefung`. Exam facts are logged in `seo/facts.md`.
- 7 parallel agents drafted 69 blocks (oesd-a1, goethe-a2, telc-a2, oesd-a2, goethe-b1, oesd-b1, telc-b1), all `draft`.
**Outcome:** SUCCESS (tsc clean, `next build` passes, every new block validates; 3 older DTZ blocks still fail on small length deviations).
**What worked / went wrong:**
- Splitting the shared spec and copy files into one file per exam *before* fanning out let 7 agents work in one checkout without edit conflicts.
- Agents wrote logs with the same names to the shared scratchpad and overwrote each other's cost lines. Give each agent its own log path.
- Cost: Claude about $2.90 in all, eleven_v4 about 24k characters.
- eleven_v4 speaks at about 2.9 words/s, but the generator assumes 2.3, so clips come out shorter than their spec.
**Lesson:**
- Before fanning out agents over shared config, give each unit its own file and an aggregator, and keep the shared code changes for yourself.
- Never use a provider's logo for a "nicht verbunden" product. A badge with our own type, a provider tone and a country flag tells the exams apart just as well.

## 2026-10-16 — Blog with 3 draft articles and blog blocks in the design system
**Changed:** `/blog` index + 3 static post routes in `app/(main)/(site)/blog/`, posts in `data/blog/*.tsx` (registry `lib/blog/posts.ts`), blocks in `components/design/article.tsx`, renderer + BlogPosting/FAQPage/Breadcrumb JSON-LD in `components/design/blog-article.tsx`, `.article-body` in `landing.css`, `/design/blog`, footer link + sitemap gated on reviewed posts, 16 new rows in `seo/facts.md`, `Photo` moved to `kit.tsx`.
**Outcome:** SUCCESS (tsc clean, `next build` passes, 390/1440 screenshots with no horizontal scroll; production build 404s the drafts and leaves them out of the sitemap and footer).
**What worked / went wrong:**
- A research agent checked every DTZ fact against g.a.s.t., IntTestV and IntV before the articles were written. It found that external candidates **cannot** take the DTZ, that Hören is played once, and that Sprechen has no prep time. CLAUDE.md §2 still says audience 1 retakes "as external candidates".
- `Prose` styles every descendant `ul/p`, which would restyle the blocks inside it. The fix was a separate `.article-body` that styles only the direct prose children of a section.
- Sections as `{ id, title, body: JSX }` mean the table of contents can never disagree with the headings.
**Lesson:**
- Before writing a guide, check exam facts against the current operator's pages (g.a.s.t. since 2023, not telc) and the regulation. Our own CLAUDE.md had three wrong DTZ assumptions.
- Gate drafts on `NODE_ENV === "development"`, not on `!== "production"`, so preview builds can't leak them.

## 2026-10-16 — Blog reworked on inburgeringoefenen.nl's layout
**Changed:** `components/design/article.tsx` rewritten (feature/side/grid cards, header with CTA + cover tile, white reading card, summary card, proof line, `NightCta`, related list); new `article-interactive.tsx` (scroll-spy TOC, `QuizCard` on the exam's `ChoiceItem`, `BlogFilter` chips); `lib/blog/author.ts`; posts get `crumb`, `category`, `summary`, `cover.mini`; `.nz-night` in landing.css.
**Outcome:** SUCCESS (tsc, eslint, `next build` pass; 390/1440 screenshots, no horizontal scroll).
**What worked / went wrong:** The live site screenshots were more useful than the code summary for copying the layout. The first scroll-spy observed headings with a narrow root, so a jump-scroll changed nothing and the TOC stuck on 01. Observing whole sections against a 1 % line at 40 % fixed it, because the sections are contiguous.
**Lesson:** For scroll-spy with IntersectionObserver, observe the contiguous sections, not the headings. Never port a "teacher note" block without a real person's first-hand notes behind it.
