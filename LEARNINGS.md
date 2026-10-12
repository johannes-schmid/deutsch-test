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
