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
- Copy comes in English (`/`, the default) and simple German (`/de`, addressed as *du*). Sentences stay at 15 words or fewer. All strings live in `lib/i18n/landing.ts`. Exam task content stays German in both.

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
| `LevelSeal` | `variants/nachtzug-icons.tsx` | three-arc ring that lights up to the level reached |
| `LevelPath` | `variants/nachtzug-icons.tsx` | A2 seal, then dots, then a larger B1 seal |
| `MetaChip` | `variants/nachtzug-icons.tsx` | glass pill with an icon (45 Min, 2× hören, zu zweit) |
| `ExamTicket` | `variants/nachtzug-icons.tsx` | countdown ticket with the four part icons |
| `PromiseArt` | `variants/nachtzug-icons.tsx` | review card: blueprint checks and a "Von einem Menschen geprüft" pill |
| `PlatformDemo` | `variants/nachtzug-demo.tsx` | tabbed exam mock: Hören, Lesen, Schreiben, Sprechen, Ergebnis |

Icons come from Lucide at stroke 1.75–2.5. That is the existing dependency; don't mix it with
another icon family.

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
