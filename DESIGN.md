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
- **Skill tones** (icon tiles only): Hören = ember, Lesen `#5E86FF`, Schreiben `#E58FB5`,
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
- **Two-tone headings** (from inburgeringoefenen.nl): the key phrase in ink, the rest in muted (`text-v-muted`), e.g. "Jede Prüfung, *Teil für Teil.*", "Ein Paket *für den ganzen DTZ.*" The hero keeps its italic muted line.
- Copy comes in simple German (`/`, the default, addressed as *du*) and English (`/en`). Sentences stay at 15 words or fewer. All strings live in `lib/i18n/landing.ts`. Exam task content stays German in both.

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

5. **Chrome and paper**: `.nz-chrome` (white at 72%, 22px blur, white edge, soft navy drop) for the header pill, footer card and small glass chips; `.nz-paper` (solid surface, long soft drop) for reading cards and `PhotoCard`. The recommended price plan is the one `.nz-night` card on `/preise`.

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
| `PartIcon` / `PartCard` | `variants/nachtzug-icons.tsx` | glass tile with a blurred tone blob. Sizes sm/md/lg = 36/48/64px |
| `TestIcon` / `TestCard` | `variants/nachtzug-icons.tsx` | DTZ, Einbürgerungstest, Integrationskurs |
| `ExamMark` | `variants/nachtzug-icons.tsx` | exam badge on the free-test overview: the provider name in our type on a tone tile (`--v-ex-goethe`, `--v-ex-telc`, `--v-ex-oesd`) plus a small country flag (DE, AT for ÖSD). Our own mark, never the provider's logo (we are not affiliated) |
| `LevelSeal` | `variants/nachtzug-icons.tsx` | three-arc ring that lights up to the level reached |
| `ScoreSeal` | `variants/nachtzug-icons.tsx` | the LevelSeal for exams scored in points: one arc for the share reached (Glut when passed, ink when not), a tick at the pass mark, the % in the middle |
| `LevelPath` | `variants/nachtzug-icons.tsx` | A2 seal, then dots, then a larger B1 seal |
| `MetaChip` | `variants/nachtzug-icons.tsx` | glass pill with an icon (45 Min, 2× hören, zu zweit) |
| `ExamTicket` | `variants/nachtzug-icons.tsx` | countdown ticket with the four part icons |
| `PromiseArt` | `variants/nachtzug-icons.tsx` | review card: blueprint checks and a "Von einem Menschen geprüft" pill |
| `SiteNav` / `SiteGlow` / `SiteFooter` | `site-chrome.tsx`, `nav-links.tsx` | the one site chrome, after inburgeringoefenen.nl. **Header:** a floating glass pill (`.nz-chrome`, 56px) inside the container; the current section gets a soft ink pill (`ActiveNavLinks`, in `<Suspense>`); `switchLang={false}` on German-only pages. **Footer:** a glass card (brand, blurb, four `ExamMark sm` tiles, link groups, two columns on phones) with the operator line and the disclaimer under it. Every public page uses these, never its own bar |
| `PhotoCard` | `kit.tsx` | product card after the Dutch site: a `.photo` head (art tile, mono status chip, optional tag links) over a white body (title, text, meta, "cta + round ink arrow"). The whole card links via a stretched title link; head tags stay clickable above it. No `href` = dashed "Bald verfügbar" placeholder. Used by the home exam row, `ExamPicker` and `ExamHub` |
| `ExamPicker` | `components/kurztest/exam-picker.tsx` | level pills (A1 · A2 · B1, shadcn Tabs, all panels kept in the HTML) over exam cards; a card without content is dashed with "Bald verfügbar" and no link |
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
| `ExamShell` | The frame: exit (X), progress in one segment per Teil, `TimerChip` (turns glow under 5 min), content, sticky action bar, overview sheet (item grid). `wide` (1040px) for Lesen and Schreiben; otherwise 560px |
| `ExamButton` | `primary` (ink pill, 48px), `soft`, `icon`, `iconSm` |
| `PartIntro` | The screen before each part: icon, minutes, item count, an optional `about` ("what happens", free tests), the Teile, and the rules (play count, no rewind, timer). `action` replaces the start button, e.g. the email form before Schreiben/Sprechen |
| `ExamAudio` / `useExamAudio` | A 112px round play button with a progress ring, waveform, speaker chips that light up per segment, and the play count. No pause or seek. It plays a real `<audio>` when `src` is set and simulates the clip otherwise |
| `ChoiceItem` | a/b/c as 56px option cards with radio dots |
| `TrueFalseItem` | richtig/falsch as two 56px toggles |
| `PictureItem` | three square picture tiles: an `image`, a Lucide `icon` (specimens), or a `picto` key from `lib/exam/pictos.ts` with its short label under it (Start Deutsch 1 Hören Teil 1; pictograms stand in for drawings) |
| `MatchItem` | situation tabs plus ads as a sideways scroll-snap row, and "x" (no match) as a dashed card |
| `GapItem` | a letter with pill gaps; tapping a gap opens its options under the text and moves on to the next open gap |
| `FeedbackSheet` | practice-mode explanation: the verdict, an explanation, the evidence marked in glow, and a language chip for translated explanations |
| `ConfirmSheet` | replaces `window.confirm`/`alert` in exams (leave, hand in early, time up): bottom sheet on phones, centred card from `sm`; the safe choice is filled and focused; without `cancel` it is a one-button notice |
| `ReadingLayout` / `ReadingText` | a "Text \| Aufgaben (n/m)" switch on phones and two panes from `lg`; the text sits at 18px |
| `WritingTask` | choose task A or B (one task: no choice, shown as "Deine Aufgabe"), then content points the learner ticks off themselves (no live grading), a textarea and a word count |
| `SpeakingTask` | pair exam: task and point chips, optional drawn `cards` (label + pictogram, Start Deutsch 1), turns from Prüfer, Partner and Du as a chat, a 72px mic with a level meter |
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
