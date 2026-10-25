---
name: deutschtest üben
description: Realistic DTZ exam prep. Soft light behind glass, calm ink type, one warm glow.
colors:
  ink: "#0E1322"
  bg: "#EEF1F6"
  surface: "#FFFFFF"
  soft: "#E3E8F0"
  muted: "#596173"
  line: "#D6DCE6"
  glow: "#FFB45E"
  ember: "#D9811C"
  skill-hoeren: "#D9811C"
  skill-lesen: "#5E86FF"
  skill-schreiben: "#E58FB5"
  skill-sprechen: "#5FB8A6"
  dark-bg: "#070A12"
  dark-surface: "#10162A"
  dark-ink: "#F2EFE9"
  dark-muted: "#A2A8B6"
  dark-line: "#1E2538"
typography:
  display:
    fontFamily: "Host Grotesk, system-ui, sans-serif"
    fontSize: "clamp(46px, 6.2vw, 88px)"
    fontWeight: 500
    lineHeight: 1.04
    letterSpacing: "-0.04em"
  headline:
    fontFamily: "Host Grotesk, system-ui, sans-serif"
    fontSize: "clamp(30px, 4.4vw, 60px)"
    fontWeight: 500
    lineHeight: 1.08
    letterSpacing: "-0.04em"
  title:
    fontFamily: "Host Grotesk, system-ui, sans-serif"
    fontSize: "30px"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "-0.01em"
  body:
    fontFamily: "Host Grotesk, system-ui, sans-serif"
    fontSize: "18px"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "Reddit Mono, ui-monospace, monospace"
    fontSize: "12px"
    fontWeight: 400
    letterSpacing: "0.08em"
rounded:
  key: "999px"
  tile-sm: "12px"
  tile: "16px"
  card: "18px"
  panel: "24px"
  frame: "28px"
  phone: "40px"
spacing:
  gutter: "clamp(16px, 4vw, 40px)"
  container: "1200px"
  section: "96px"
  section-lg: "128px"
components:
  button-primary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.surface}"
    rounded: "{rounded.key}"
    height: "52px"
    padding: "0 28px"
  button-ghost:
    textColor: "{colors.ink}"
    rounded: "{rounded.key}"
    height: "52px"
    padding: "0 28px"
  button-sm:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.surface}"
    rounded: "{rounded.key}"
    height: "36px"
    padding: "0 16px"
  card-app:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.panel}"
  level-key-active:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.surface}"
    rounded: "{rounded.key}"
  level-key:
    backgroundColor: "{colors.soft}"
    textColor: "{colors.muted}"
    rounded: "{rounded.key}"
  logo-tile:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    size: "32px"
---

# Design System: deutschtest üben

Source of truth: `app/(main)/landing.css` (tokens under `.v-frame[data-variant="nachtzug"]`),
`components/design/` (components), `lib/design/variants.ts` (metadata). Live reference:
`/` (the landing page), fixed to the Glut palette in light mode.

## Overview

**Creative North Star: "Nachtzug": soft light behind glass.**

The site should feel like a quiet, well-lit waiting room before an exam. Content sits on frosted glass
over blurred gradient "photos". The ink is a deep blue-black, and one warm glow (Glut, `#FFB45E`)
marks progress and success. The aim is to lower exam stress: calm surfaces, big honest headlines,
and the real exam structure (four parts, timer, B1 / A2 / unter A2) shown as concrete UI rather
than as illustration.

The audience is migrants preparing for the DTZ, mostly on phones and often on slow connections. Type
stays large and simple, and every screen works at 390px.

**Key characteristics**
- One display family (Host Grotesk) with an italic for emphasis inside headlines. No serif.
- Mono labels (Reddit Mono, uppercase, +0.08em) for exam metadata: parts, times, "Format-Stand".
- Blurred gradient fields (`.photo`) instead of stock photography.
- Glass app cards (`.nz-app`) that show real product states.
- Pill buttons and keys, soft cards in between.

## Colors

The palette is cool and neutral, with a single warm accent and four skill tones used only for icons.

- **Ink `#0E1322`**: text, primary buttons, the selected state. It reads as near-black with a navy
  bias.
- **Background `#EEF1F6`** / **Surface `#FFFFFF`** / **Soft `#E3E8F0`**: page, cards and quiet fills.
- **Muted `#596173`**: secondary text. **Line `#D6DCE6`**: borders and dividers.
- **Glut `#FFB45E`** (glow) / **Ember `#D9811C`**: the one accent. Use it for checks, progress,
  the B1 seal, the Hören tone and the first logo dot. Ember is the light-mode accent for text and
  icons; Glow is for fills.
- **Skill tones** (part strips, washes, logo dots; never on icon tiles): Hören = ember, Lesen `#5E86FF`, Schreiben `#E58FB5`,
  Sprechen `#5FB8A6`.
- **Alternate palettes**, defined in CSS but not active: Mond (`#A7BCFF` / `#4C6CD6`) and
  Rosé (`#FF9CC4` / `#C94680`). They swap `--p-glow` / `--p-ember` only.
- **Dark mode** is defined (`.dark`): bg `#070A12`, surface `#10162A`, ink `#F2EFE9`, and the
  glow becomes the accent and selection colour. It isn't exposed on the page right now.

## Typography

- **Display / headline:** Host Grotesk 500, tracking −0.04em, `text-wrap: balance`. For emphasis,
  use the italic of the same family on the key phrase ("*B1 schaffen.*").
- **Title:** Host Grotesk 600, about 30px, for panel and card headings.
- **Body:** Host Grotesk 400, 17–18px in the lead and 15–15.5px in lists and FAQ, muted colour,
  max about 46ch.
- **Label:** Reddit Mono 400–500, 11–12px, uppercase, +0.08em. Timers and counts use `.v-num`
  (mono, tabular numbers).
- **Cyrillic:** Host Grotesk and Reddit Mono have no Cyrillic. Onest (sans) and JetBrains Mono (labels) are
  loaded with the Cyrillic subset only and sit first in the font stacks (`--font-cyr`, `--font-cyrmono`), so
  their `unicode-range` catches Cyrillic glyphs and Latin text never touches them. No generated fallback face,
  or Arial would win for Latin. Onest has no italic; Cyrillic emphasis in a headline renders oblique.
- **Two-tone headings** (from inburgeringoefenen.nl): the key phrase in ink, the rest in muted (`text-v-muted`), e.g. "Jede Prüfung, *Teil für Teil.*", "Ein Paket *für den ganzen DTZ.*" The hero keeps its italic muted line.
- Copy comes in simple German (`/`, the default, addressed as *du*), English (`/en`, landing only) and Ukrainian and Russian (`/uk`, `/ru`: every public page, machine-translated, addressed as *ви*/*вы*). Sentences stay at 15 words or fewer. Landing strings live in `lib/i18n/landing{,.uk,.ru}.ts`, chrome and blog labels in `lib/i18n/ui{,.uk,.ru}.ts`. Exam task content stays German in every locale.

## Layout

- Container max 1200px with a fluid gutter `clamp(16px, 4vw, 40px)`.
- Sections have 96px vertical padding (128px from `sm`) and are separated by `border-t` lines,
  not boxes.
- The hero is split: copy at 1.1fr on the left, a phone scene at 0.9fr on the right. It stacks on
  mobile, with the copy first.
- Feature panels are two-column cards (text plus a mock on a `.photo` field) and stack on mobile.
- Audience cards use 3 columns from `md` and are at least 420px tall.
- Never let the page scroll horizontally; `.v-frame` sets `overflow-x: clip`.

## Elevation & Depth

Depth comes from layering, with almost no shadow:
1. **Orbs** (`.nacht-orb`): 300–520px blurred colour circles behind the hero. They drift slowly
   (20s) and their opacity comes from `--v-orb`.
2. **Photo fields** (`.photo`): gradient tokens `--g-photo-1…6`, blurred 14px with noise overlaid.
   They drift for 26s and scale to 1.05 on hover.
3. **Glass** (`.nz-app`, `.glass`): frosted white at 88% with a 26px backdrop blur, an inner top
   highlight, and a long soft drop shadow `0 40px 80px -40px rgba(8,10,30,.55)`.
4. **Float** (`.nz-float`): an 8px vertical bob over 7s, staggered with negative delays.

5. **Chrome and paper**: `.nz-chrome` (white at 72%, 22px blur, white edge, soft navy drop) for the header pill, footer card and small glass chips; `.nz-paper` (solid surface, long soft drop) for reading cards and `PhotoCard`. The `PassBuilder` summary is the one `.nz-night` card on `/preise` (`.nz-night` sets `position: relative`, so put `sticky` on a wrapper).

Every animation stops under `prefers-reduced-motion`. Glass becomes solid under
`prefers-reduced-transparency`.

## Shapes

- **Pill (999px):** buttons, level keys, chips, meta pills.
- **Soft:** icon tiles at 12/16/22px; cards at 18px (`--v-radius`); panels and app cards at
  22–24px; large photo frames at 28px; the phone at 40px.
- **Circles:** level seals, avatar initials, step dots.
- Dashed borders only mean "placeholder or draft" (the text sketch, the exam ticket tear line).

## Components

All in `components/design/`. These are shadcn (Base UI) primitives styled through the `--v-*`
tokens.

| Component | File | Notes |
|---|---|---|
| `VButton` | `kit.tsx` | kinds `cta` · `ink` · `ghost` · `light`, sizes `sm`/`md`/`lg` (36/44/52px), `active:scale(0.97)` |
| `LevelScale` | `kit.tsx` | three keys, unter A2 · A2 · B1, with the active one in ink. Never a percentage |
| `Timer` | `kit.tsx` | mono, tabular digits, `aria-label="Restzeit …"` |
| `SkillChips` | `kit.tsx` | four part chips tinted by skill tone |
| `AnswerOptions` | `interactive.tsx` | a, b, c options with feedback after answering |
| `AudioPlayer` | `interactive.tsx` | play-once bars, "Kein Zurückspulen" note |
| `LogoMark` / `NzLogo` | `variants/nachtzug-logo.tsx` | Leuchte U with orange and blue glowing dots. `tile` puts it on a white rounded square (radius 27%). The wordmark is all ink, and the ü dots glow |
| `Tile` / `PartIcon` / `PartCard` | `variants/nachtzug-icons.tsx` | `Tile` (`.nz-tile`): flat white tile, 1px ink ring at 12%, ink Lucide glyph at stroke 1.85. No tone, no blur, no gradient; the same family as `ExamMark`. `PartIcon`, `TestIcon` and the blog `Note` use it. Sizes sm/md/lg = 36/48/64px. Chosen 2026-10-21 from five flat styles |
| `TestIcon` / `TestCard` | `variants/nachtzug-icons.tsx` | DTZ, Einbürgerungstest, Integrationskurs |
| `ExamMark` | `variants/nachtzug-icons.tsx` | exam badge: the provider code in our type (DTZ, GI, telc, ÖSD, SD1) on a white tile with a 1px ink ring, the country's three colours as a strip along the bottom (DE, AT for ÖSD; white band shown as mist). Flat, no tone or blur. Sizes sm/md/lg = 36/48/64px. Our own mark, never the provider's logo (we are not affiliated). Chosen 2026-10-21 from nine flag variants |
| `LevelSeal` | `variants/nachtzug-icons.tsx` | three-arc ring that lights up to the level reached |
| `ScoreSeal` | `variants/nachtzug-icons.tsx` | the LevelSeal for exams scored in points: one arc for the share reached (Glut when passed, ink when not), a tick at the pass mark, the % in the middle |
| `LevelPath` | `variants/nachtzug-icons.tsx` | A2 seal, then dots, then a larger B1 seal |
| `MetaChip` | `variants/nachtzug-icons.tsx` | glass pill with an icon (45 Min, 2× hören, zu zweit) |
| `ExamTicket` | `variants/nachtzug-icons.tsx` | countdown ticket with the four part icons |
| `PromiseArt` | `variants/nachtzug-icons.tsx` | review card: blueprint checks and a "Von einem Menschen geprüft" pill |
| `SiteNav` / `SiteGlow` / `SiteFooter` | `site-chrome.tsx`, `nav-links.tsx` | the one site chrome, after inburgeringoefenen.nl. **Header:** a floating glass pill (`.nz-chrome`, 56px) inside the container; the current section gets a soft ink pill (`ActiveNavLinks`, in `<Suspense>`); a language menu (`LangSwitch` in `lang-switch.tsx`, Base UI Menu in a `.nz-chrome` popup, origin-aware 150ms scale 0.97 + fade, hidden below `sm` like the old language link: the pill has no room on phones, where the footer's `LangLinks` and the landing's language strip switch) offers the same page in every locale it exists in (English on the home page only); on `/uk` and `/ru` the `MachineNote` line under the pill says the page is machine-translated and links the German original (AI Act art. 50). **Footer:** a glass card (brand, blurb, four `ExamMark sm` tiles, link groups, two columns on phones) with the operator line and the disclaimer under it, and the same page in the other languages (`LangLinks`). Every public page uses these, never its own bar |
| `PhotoCard` | `kit.tsx` | product card after the Dutch site: a `.photo` head (art tile, mono status chip, optional tag links) over a white body (title, text, meta, "cta + round ink arrow"). The whole card links via a stretched title link; head tags stay clickable above it. No `href` = dashed "Bald verfügbar" placeholder. Used by the home exam row, `ExamPicker` and `ExamHub` |
| `ExamPicker` | `components/kurztest/exam-picker.tsx` | level pills (A1 · A2 · B1, shadcn Tabs, all panels kept in the HTML) over exam cards; a card without content is dashed with "Bald verfügbar" and no link |
| `ExamCard` | `components/kurztest/exam-card.tsx` | one exam as a `PhotoCard` (brand photo field, `ExamMark`, provider, summary, result format). No `href` = "Bald verfügbar". Shared by `ExamPicker` and the portal overview |
| Auth pages | `components/auth/` | `/registrieren`: two columns from `lg` (pitch with two-tone H1, mono stats derived from `lib/exams.ts`, `ExamMark` row \| `.nz-app` card with `GoogleButton`); `/anmelden`: one centred `.nz-app` card with "Noch kein Konto? Registrieren" under it. Both sit vertically centred on `.nz-auth-field`: the whole viewport is one living gradient (`.nz-auth-orbs`: glow, blue, light blue; transform-only drift, off under reduced motion), after inburgeringoefenen.nl's auth screens. `AuthHeader` is plain on the field: logo left, one link right (register → "Anmelden", login → "Preise ansehen"). `GoogleButton` (ink, 52px, Google's "G") is the only Supabase Auth caller; errors show below in a rosé wash with `role="alert"` |
| Portal shell | `components/portal/` | after inburgeringoefenen.nl's portal. **From `lg`:** `PortalSidebar`, a floating `.nz-chrome` panel (280px, 28px radius, sticky, full height): logo, "Übersicht" (active = ink pill), the exam families (DTZ, Goethe, telc, ÖSD; `ExamMark sm` + name, lit on the family page) with their levels nested on a hairline (mono level + exam name; lit on the exam and its skill pages; Start Deutsch 1 sits under Goethe and telc), the plan card (mist panel → `/dashboard/preise`), `AccountRow` (avatar or initials, name, email → `/dashboard/konto`; sign-out icon). **Below `lg`:** a sticky glass header pill (logo + avatar → `/dashboard/konto`) and `PortalTabBar`, a floating 64px glass tab bar (max 440px) over the safe area: Übersicht, Prüfungen, Preise (`/dashboard/preise`), Konto (`/dashboard/konto`), each lit on its route. User bits render in `<Suspense>` with skeleton fallbacks. Live reference: `/design/portal` |
| Portal overview | `components/portal/portal-overview.tsx` | `/dashboard` picks the exam first, the level second. `FamilyCard` (`.nz-paper`, `ExamMark`, mono level-range chip, "Zuletzt: …" or summary, `ProgressBar`, "x von y Modelltests", ink "Weiter →" once started, outlined "Beginnen" before; stretched link). `LevelCard` (same frame, the level as an ink tile) on `/dashboard/{goethe,telc,oesd}`. Right column (xl, sticky; below the cards on smaller screens): `ScoreCard` (mean share of points as a practice value, change since last week, a line of the last 12 results; empty state without attempts) and `WeekCard` (7 day bars, today last). Data: families in `lib/exams.ts` (`FAMILIES`), stats from `portalStats()` in `lib/modelltest/portal.ts`. Live reference: `/design/portal` |
| Portal exam pages | `components/portal/portal-exam.tsx` | `PortalCrumbs` (Übersicht › exam › skill), `SkillCard` (`.nz-paper`, `PartIcon lg`, mono count chip, status line, stretched link, optional "Gratis-Test · 5 Min." link above it), `ModelltestRow` (10 rows divided inside one `.nz-paper` card, one state each: open = ink number + arrow; done = ember check on the number, best result in the sub-line, arrow becomes "noch einmal"; preview = admins only, unpublished; locked = soft number + lock; soon = dashed number + clock). Used by `/dashboard/[exam]` and `/dashboard/[exam]/[skill]`; live reference `/design/portal` |
| `PassBuilder` | `pass-builder.tsx` | the Prüfungspass configurator, after inburgeringoefenen.nl's ModulePicker; on `/preise` (all site locales) and `/dashboard/preise`. **Left**, one `.nz-paper` card divided by hairlines: "Wann ist deine Prüfung?" pills (native radios; the pick sets the recommended plan, rule-based, with a one-line hint), the plans as radio tiles (selected = 2px ink ring + ink check dot; Glut "Empfohlen" pill; price in display type + "für n Monate"; multi-month: per month, `−x %` chip, "statt n × price"; never a struck-through price), a `Repeat` line with the monthly renewal, "Das ist im Pass" checklist, a mist "Gratis bleibt gratis" strip. **Right**, the `.nz-night` summary (sticky from lg, below the choices on phones): plan, price, per month, "Du sparst …" in Glut, "Danach … im Monat. Jederzeit kündbar.", end of the first term (client-only), trust lines, then by mode: public → light "Pass kaufen" link into the portal; `checkout` → consent checkbox (white/8 tile, 20px box, Glut fill + dark check when ticked, Glut ring + Glut message when missing, focus moves to it) and light "Zahlungspflichtig bestellen" (spinner + "Weiter zur Zahlung …" while busy) → Mollie; `renewing` → note + "Zu deinem Konto". Copy in `lib/i18n/pass.ts`, prices from `lib/pricing.ts` |
| `BillingPanel` · `PaymentStatus` · `CancelButton` | `billing-panel.tsx`, `portal-billing.tsx` | `/dashboard/zahlung` and `/dashboard/konto/kuendigen`. `BillingPanel`: one `.nz-paper` card (max 640px): `Tile` (Glut halo for success), the page h1, one line, the next step as an ink `lg` button. `PaymentStatus` polls the return and shows checking (spinner) / paid / failed / pending / none. Kündigung: facts as a mist `dl` (contract, price, kind, end date, name, confirmation email), then the ink "Jetzt kündigen" button; the result replaces the button in a mist strip |
| Portal account | `components/portal/portal-account.tsx` | `/dashboard/konto`, after inburgeringoefenen.nl's `/dashboard/profiel`. `AccountHead` (72px avatar, H1, name), `ProgressCard` (one row per DTZ part and per other exam started: `PartIcon`/`ExamMark sm`, label, mono "x von y", `ProgressBar`, arrow; a hint above when nothing is done), `PassCard` (free/ended: paper, "Gratis" chip, ink button to the pass; renewing: `.nz-night`, Glut "Aktiv" pill, paid-until + monthly price, underlined "Vertrag kündigen" link; cancelled: `.nz-night`, white/15 "Gekündigt" pill, runs-until, "Neuen Pass kaufen"), `AccountCard` (`SettingsRow`s for e-mail and sign-in, sign-out on a mist strip). Two columns from lg (progress \| pass + account). Live reference: `/design/portal` |
| `PageHeader` / `Prose` / `Byline` / `TestCta` / `Todo` | `content-page.tsx` | text pages. `PageHeader`: breadcrumb, optional round glass `icon` tile, H1 with an optional muted second half (`h1Muted`), lead. `Prose`: the text on one white reading card (`.nz-paper`, 28px radius), 68ch measure; an `<ol>` renders as numbered steps (ink dots on a rail, `.nz-steps`). `Byline`: mist panel under the card. `TestCta`: centred display headline on a `--g-photo-6` field, one per page. `Todo`: dashed marker for unfilled facts |
| `Photo` | `kit.tsx` | blurred gradient field (`--g-photo-1` … `-6`); glass cards sit on it. Shared by the landing and the blog |
| Blog page frame | `article.tsx`, `article-interactive.tsx` | modelled on inburgeringoefenen.nl's blog. **Index:** H1 with a muted second half, `AuthorCard` (glass), `BlogFilter` topic chips with counts, `FeatureCard` (cover full-bleed, text on an `nz-app` glass panel), two `SideCard`s (square photo thumb with the cover's `mini` art), then `GridCard`s, then one centred photo CTA. **Article:** `ArticleHeader` (crumbs, H1, lead, `Byline` = avatar · name · role · date \| mono reading time, ink CTA button, `CoverTile` = cover with a turned glass sheet behind), then one white reading card: sticky `ArticleToc` with numbered items and scroll-spy (IntersectionObserver on sections, `ArticleTocFold` on phones), `SummaryCard`, the text, `ArticleFaq` (accordion on a mist panel), `ArticleProof` (review line + sources), `NightCta` (the one dark block, `.nz-night`), then `RelatedList` |
| In-article blocks | `article.tsx`, `article-interactive.tsx` | on the white card, so surfaces are mist (`bg-v-soft/60`), not borders. `FactBox` (bold claim, mono "Quelle · Stand"), `Note` tipp/info/wichtig (light wash of its tone + icon tile), `QuizCard` (one practice question built on the exam's `ChoiceItem`, answer shown after the tap), `ExamStrip` (explainer figure: exams on one time axis, part colours), `Steps`, `Compare` (3 items → 3 columns), `DoDont` (rosé wrong, glow right), `DataTable` (ink header, zebra, scrolls sideways), `LetterSample` (our own model letter with numbered notes). Live reference: `/design/blog` (noindex) |
| `PlatformDemo` | `variants/nachtzug-demo.tsx` | the landing page's tabbed exam teaser (marketing only; real exam screens use `components/exam`) |

Icons come from Lucide at stroke 1.75–2.5. That is the existing dependency; don't mix it with
another icon family.

## Exam UI: "Fokus"

Every exam screen uses **Fokus**: one task per screen on a glass card (`.nz-app`) over a photo
field, with big touch targets and a sticky action bar. It was chosen on 2026-10-12 over
"Prüfungsbogen" (paper look) and "Fahrplan" (timetable).

**Source of truth:** `components/exam/` (import from `@/components/exam`). Types are in
`lib/exam/types.ts` and UI copy (de + en) in `lib/exam/copy.ts`. Live reference:
`/design/pruefung` shows every part and every block, and `/design/pruefung/ergebnis` shows the
results page (both noindex). Specimen data is in `lib/exam/samples.ts`; it was written for design
and is not reviewed content.

**Never build one-off exam UI.** New exam screens are composed from these components. If one is
missing, add it to `components/exam/`, show it on `/design/pruefung`, and list it below.

| Component | Use |
|---|---|
| `ExamStage` | The photo field behind every screen. `scene` picks the gradient per part (intro, hoeren, lesen, schreiben, sprechen, ergebnis). `framed` for previews |
| `FocusLayer` | Focus mode, after inburgeringoefenen.nl's player: once a test starts it covers the whole screen (fixed, z-40, portalled into `.v-frame`, page scroll locked), the scene's photo field pinned behind. No site nav, page header or footer. Dialogs (z-50) sit above it. `KurztestFrame focus` uses it for test, sending and result |
| `ExamBar` | The detached glass pill above every exam screen, sticky at the top: exit (X), `PartIcon` (from `sm`), progress per Teil, mono done/total, `TimerChip`. The result screen shows it with every segment full |
| `ExamShell` | `ExamBar`, then one card: content, sticky action bar (`overflow-clip` so the sticky bar works), overview sheet (item grid). `wide` (1040px) for Lesen and Schreiben; otherwise 560px |
| `ExamButton` | `primary` (ink pill, 48px), `soft`, `icon`, `iconSm` |
| `PartIntro` | The screen before each part: icon, minutes, item count, an optional `about` ("what happens", free tests), the Teile, and the rules (play count, no rewind, timer). `action` replaces the start button, e.g. the email form before Schreiben/Sprechen |
| `ExamInstructions` | The "Anleitung" step between `PartIntro` and a DTZ Modelltest part, after the official front page: "Anleitung" eyebrow with an info icon, title, lead, a compact `bg-v-soft` player for the spoken version (44px ink play/pause, thin progress bar, mono time; pausable and replayable because it is not exam audio, hidden if the file fails), "Die Teile" as rows (mono label, name, muted meta like "5 Aufgaben · a, b oder c", one muted line on what happens; rows without a label span the full width), "So geht es" as numbered steps (26px `bg-v-soft` number dots), a `bg-v-soft` "So zählt …" box on how the part counts in the whole DTZ, then the start button. Text in the Sie-form of the exam, from `lib/modelltest/anleitung.ts` |
| `ExamAudio` / `useExamAudio` | A 112px round play button with a progress ring, waveform, speaker chips that light up per segment, and the play count. No pause or seek. It plays a real `<audio>` when `src` is set and simulates the clip otherwise |
| `ExamTrack` / `useExamTrack` | Modelltest Hören as one continuous track: a 56px ring button starts it once (then a lock), one `bg-v-soft` row with the phase line ("Teil 2 · Nummer 6 · Lesezeit") and one progress segment per Teil, remaining time in mono. No pause, seek or replay; if the device pauses it, the button resumes. The runner follows `cue` to show the matching task and puts the remaining time in the `ExamBar` timer |
| `ChoiceItem` | a/b/c as 56px option cards with radio dots |
| `TrueFalseItem` | richtig/falsch as two 56px toggles; `labels` prints them as the exam does (Goethe "Ja" / "Nein") |
| `PictureItem` | three square picture tiles: an `image`, a Lucide `icon` (specimens), or a `picto` key from `lib/exam/pictos.ts` with its short label under it (Start Deutsch 1 Hören Teil 1; pictograms stand in for drawings) |
| `MatchItem` | situation tabs plus ads as a sideways scroll-snap row, and "x" (no match) as a dashed card, labelled as the exam prints it (`noMatchLabel`: Goethe B1 "0", Goethe A2 "X"). An ad with `image` is a picture to match: a 4:3 photo above its label (Goethe A2 Hören Teil 2) |
| `GapItem` | a letter (max 66ch) with pill gaps. The open gap's options sit in a tray **docked above the action bar** (`--exam-dock`, set by `ExamShell`), headed "Lücke n: Welches Wort passt? Tippe unten.", so they stay in view while the letter scrolls. Picking moves on to the next open gap. The tray has no entrance animation: it changes with every pick |
| `GapItem` typed fields | A gap with no options is written, not picked (Start Deutsch 1 / telc A2). `sheet: "Formular"` (Schreiben Teil 1): a paper card labelled Formular, the form's title, then one row per line: muted label left (13rem from `sm`, above on phones), the field right as a 44px dashed ink underline that turns solid when filled or focused; prefilled values in plain text, the Beispiel in semibold; a ja/nein field is two 44px pill toggles in place, no tray. `sheet: "Notiz"` (Hören Teil 1 phone note): the letter sheet labelled Notiz with the field inline (9.5em, 17px so iOS never zooms). Enter jumps to the next field; no autocorrect or spellcheck. Review: glow fill when right, rosé with the struck-through answer plus the solution when wrong; right/wrong comes from the scorer (`marks`), which forgives small spelling slips but never a wrong digit |
| `HeadlineMatch` · `ArticleText` · `AdBoard` · `WordPoolGap` | The printed booklet (`print.tsx`), picked by the task's shape through `MatchTask` / `GapTask` / `ExamReading` (runner, free tests, admin review alike):
- **Headline match:** options are headlines only. A clipping in a narrow hyphenated column (justified from `sm`) with an empty headline slot, beside the headline list a–j; used headlines dim and name their text.
- **Article:** telc Leseverstehen Teil 2, magazine setting. Mono source line, headline, bold standfirst, indented paragraphs.
- **Ad board:** any Lesen match with ads (DTZ Teil 2 too), in columns with five ink-only print styles (box, ink banner, rules, double frame, plain). The letter sits in the corner; chosen is an ink outline with a check. The current situation is an **ink card** ("Situation 12 · 2 von 10", the text, then the prompt "Tippe auf die passende Anzeige …" or "Deine Antwort: a · …"). Ads used for another situation dim and say "bei 11". A pick moves on to the next open situation; on phones the view scrolls back to it. From `lg` the tabs and card stay sticky beside the ads, so there is no sideways scrolling.
- **Letter sheet** (`sheet.tsx`, every gap text): a paper card labelled E-Mail or Brief, with real paragraph spacing and at most 68ch.
- **Word pool:** one pool a–o shared by all gaps. A used word dims, shows its gap and moves when picked again. On phones it docks above the action bar in compact chips; from `lg` it sits sticky beside the letter.

`SituationTabs` is shared with `MatchItem`. |
| `PhotoNumberGrid` · `TickGrid` · `MarkBoxes` | ÖSD Zertifikat A1 / A2 (`oesd.tsx`), picked through `MatchTask` and the item renderers:
- **Photo grid** (ÖSD A1 Hören 1, `layout: "textNumber"`): six 4:3 photos A–F (two columns on phones, three from `sm`), each with a 44px "Text Nr." box under it, dashed when empty. Tapping it docks a tray above the action bar (like the gap tray, no entrance animation) with 1–5 and "Kein Text"; a number sits under one photo at a time and moves when chosen again.
- **Tick grid** (ÖSD Hören 3): one row per person. Phones: the row label, then the columns as 44px pill toggles; from `sm` a printed grid with the column names on top and a 44px tick cell per column. `multi` (ÖSD A2) makes the cells checkboxes and says "Mehrere Antworten möglich"; review marks missed ticks as solution.
- **Mark boxes** (ÖSD A2 Hören 1): eight 56px checkbox tiles in two rows of four (2 × 4 on phones), a mono counter "n von 4 markiert" that turns ember with "Zu viele Kreuze kosten Punkte." past four.
- **Pictogram ads** (ÖSD A1 Lesen 3): an ad with `picto` shows only the sign (label for screen readers), in `MatchItem`.
- **Clipping origin and table** (ÖSD A2 Lesen 1): the mono label adds "[aus einer … Zeitung]"; a small ruled table with tabular figures follows the text.
- **Form tick group** (ÖSD A1 Schreiben 1): a form gap with `pick: 2` renders checkboxes instead of the ja/nein toggles. |
| `TopicCard` · `SceneChoice` · `PlanningSheet` | ÖSD Sprechen material: the topic card (paper, "Wähle 4 von 6 Themen", the candidate ticks topics, the rest dims at the limit); three 3:2 photos to choose one from (sideways snap on phones, three columns from `sm`), then the two roles as pill toggles (A1 Aufgabe 3); the Angabenblatt (title, one row per question with up to three pictogram tiles and captions, a dashed "noch etwas?" box). The admin review shows them above the turns; in the Modelltest they sit in `SpeakingPrep` (ÖSD: 10 minutes) and then inside `SpeakingTask` via `material` (once a photo is picked, only that photo stays) |
| `FeedbackSheet` | practice-mode explanation: the verdict, an explanation, the evidence marked in glow, and a language chip (only with `onLanguage`) that flips a translated explanation to the German original and back; the chip names the language it switches to |
| `GuestWall` | `components/kurztest/guest-wall.tsx`: the sign-up card a guest meets after Teil 1 of a free Lesen/Hören test (after inburgeringoefenen.nl's GuestSignupOverlay). Same sheet/card geometry as `ConfirmSheet`, a 6px-blurred veil so the test stays recognisable behind it, a mint "gespeichert" chip, `GoogleButton` with `next` = the test path, and a login link. No close button |
| `ConfirmSheet` | replaces `window.confirm`/`alert` in exams (leave, hand in early, time up): bottom sheet on phones, centred card from `sm`; the safe choice is filled and focused; without `cancel` it is a one-button notice |
| `ReadingLayout` / `ReadingText` | a "Text \| Aufgaben (n/m)" switch on phones and two panes from `lg`; the text sits at 18px |
| `WritingTask` | choose task A or B (one task: no choice, shown as "Deine Aufgabe"), then content points the learner ticks off themselves (no live grading), a textarea and a word count. `opener` (ÖSD): what the answer sheet already prints ("AW: …", salutation, first lines) in a `bg-v-soft` box above the textarea |
| `SpeakingTask` | pair exam: task and point chips, optional drawn `cards` (label + pictogram, Start Deutsch 1), optional `photo` (DTZ Teil 2: 3:2 rounded image from our Storage, caption left, Pexels credit right), turns from Prüfer, Partner and Du as a chat, a 72px mic with a level meter. In the Modelltest the Du bubble shows the transcript once the answer is in. `material` puts the candidate's own sheet under the task line (ÖSD cards) |
| `ResultSummary` · `ScoreRing` · `PointsBar` · `ContinueCard` | the free-test end screen, after inburgeringoefenen.nl's: one card with `ScoreRing` (one segment per task, filled in one run) or the seal for graded skills, a mono "Dein Ergebnis · x von y richtig", the verdict with the level in ember, where points went (the texts/clips with a wrong answer), `LevelScale` (DTZ) or `PointsBar` (points + pass tick), the time (Lesen) and the practice note. Then `ContinueCard`: one full-width ink button to the portal (signed in) or to sign-up (guest), a note, and "Noch einmal üben" · "Anderen Teil testen". The solutions fold away under one toggle. No email box: everyone who reaches it is signed in or gave an email before |
| `SpeakingSheet` · `SheetPeek` · `SpeakingPrep` · `NotesPeek` | telc Mündlicher Ausdruck. `SpeakingSheet`: a printed task sheet on paper (mono Teil label, whose sheet on the right) in three kinds: `topics` (Teil 1, two-column cue list with hairlines), `opinion` (Teil 2: "Aus einer Zeitschrift", topic headline, the quote with an ink rule at the start, name · age · job below) and `plan` (Teil 3: list title, dotted list ending in "…"). `SpeakingPrep`: the preparation (telc 20, Goethe/ÖSD B1 15 minutes with the planning card and the five slides as `plan` sheets, ÖSD A1/A2 10), all sheets left, a notes pad right (sticky from `lg`, below the sheets on phones) with "nicht vorlesen". During the talk `SheetPeek` folds the sheet to its label plus cue chips (opinion: title and author) and `NotesPeek` folds the notes, so the turns and the mic stay in view. `SpeakingTask` takes the sheet via `sheet`. The Teil clock uses `TimerChip lowAt={60}` |
| `ResultHero` · `PartResultCard` · `NextStepCard` · `ReviewList` | results page. DTZ: LevelSeal + scale and level pills. Exams scored in points (`score` + `pass`): ScoreSeal, a bestanden / nicht bestanden pill and "x von y Punkten · Bestanden ab 60 %", criteria with points (full / half / zero on the 3-step meter). Otherwise: overall seal and scale, per part a level pill plus item dots per Teil (Hören/Lesen) or criteria with a 3-step meter and "your text vs. better" (Schreiben/Sprechen), a rule-based next step, and wrong items to review |

**States** (one vocabulary for every answer surface, `stateSurface` in `primitives.tsx`)
- **idle:** surface + line border. **selected:** ink border + 1px ink ring. Chosen is ink, never glow.
- **right:** glow fill + an inverse check. **solution:** glow ring + check + "Lösung".
- **wrong:** rosé fill (`--v-sk-schreiben` at 30%) + X + "Deine Antwort". Rosé is the one semantic
  exception to the single-accent rule, and it only ever means "wrong".

**Rules**
- **Exam mode gives no feedback.** A `review` prop is passed only after grading (Auswertung or
  the Übungsmodus "Prüfen"). Items never carry their solution, so scoring keys stay on the server.
- **Audio** shows its play count, locks when done ("Keine Wiederholung"), and the transcript unlocks
  after answering. Several voices are visible as speaker chips in their tones.
- **Sprechen** always shows the examiner and the partner as people with turns. Partner voices come
  from `data/tts-voices.json`.
- **Results** are B1 / A2 / unter A2 only. Per-Teil counts ("3 von 4 richtig") are fine;
  percentages and "bestanden" are not. The next step is rule-based (weakest part first).
- **Copy** goes through `useExamCopy()` (`ExamCopyProvider locale`). Exam content stays German.
- **Layout:** touch targets at least 44px, option rows at least 56px. Every grid starts at
  `grid-cols-[minmax(0,1fr)]`. Screens work at 390px.
- **Motion:** screens enter with `.nz-screen` (420ms blur-up). The sheets slide on
  `--ease-out-strong` over 300ms. Presses scale to 0.97–0.985. Only the record button pulses (`.nz-rec`).

**Admin review** (`/admin/modelltests`, `components/admin/modelltest-review.tsx`)
- The set preview renders every Teil with `BlockReview` (`components/design/kurztest-review.tsx`), the
  same exam components candidates see, inside the Nachtzug frame. Solutions only on "Lösung zeigen".
- `ReviewToggle`: ink "Als geprüft markieren" → soft pressed "Geprüft" with a check. `PublishPanel`: one
  surface card with the open points, an ember progress line (reviewed / all) and the only publish
  button, behind a `ConfirmSheet`. `TrackReview`: the Hören track with a jump per Teil and the current
  cue. `SpeakingExtra`: both photos with Pexels credit, the follow-up bank, persona and fallbacks.
- Per exam (`/admin/modelltests/[exam]`): 10 slots per skill, dashed = not made, `x/y` = reviewed Teile,
  ink ring + check = ready, ink fill = published, with a legend above the grid.

**Admin shell** (`app/(admin)/layout.tsx`, `components/admin/admin-{shell,drawer,ui}.tsx`, nav in `lib/admin/nav.ts`)
- The whole admin sits on the Nachtzug tokens (`DesignShell`). From `lg`: the portal's floating glass sidebar
  (same `SIDE_*` link styles, `PortalLink`, `SideGroup`), sections Übersicht / Inhalte / Gratis-Test, Modelltests
  unfolds to one link per exam; foot = "Website ansehen", admin email, sign-out. Below `lg`: a glass top bar and a
  left drawer (260ms iOS drawer curve, closes on navigation, Escape and scrim) with the same nav.
- Pages compose `AdminPage` (crumbs, title, description, actions), `Section`, `Panel` (`.nz-paper`), `DataTable`
  with the `TH`/`TD`/`THEAD`/`TBODY`/`TOTAL` classes (mono heads, soft row lines, tabular numbers), `Empty`,
  `PanelSkeleton` (loading shape, never a bare "Lädt …") and `Progress` (ember line). No one-off tables.
- Overview stats: one panel split into four linked cells by 1px `v-line` gaps, not four cards.

## Do's and Don'ts

**Do**
- Show the real exam structure: four parts, real timings, and B1 / A2 / unter A2.
- Keep one accent. Glow marks success and progress, not decoration.
- Put product mocks on photo fields, inside glass cards.
- Flip forward arrows in RTL (Arabic, Dari).

**Don't**
- Don't show "bestanden" as a DTZ result, or percentages, user counts, testimonials or "offiziell". The hero's "Pass / bestehen" refers to the exams in general.
- Don't lead with AI, and never write "ohne KI".
- Don't use evening or after-work framing. The message is exam readiness.
- Don't use serif display type, stock photos, or a second accent colour.
- Don't use pure-black shadows or hard drop shadows.
