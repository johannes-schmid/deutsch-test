# Goethe-/ÖSD-Zertifikat B1: authoring guide for Modelltests

How to write set *n* as JSON. Format facts: `goethe-oesd-b1.md` (§8 verified 2026-10-24). Topics of set 1:
`goethe-oesd-b1-set1.md`. Do-not-reuse list: `goethe-oesd-b1-official-situations.md`. Regional words:
`austrian-swiss-glossary.md`. Rules that override everything here: CLAUDE.md §2–§4, §8.

**One text set, two brands.** You write `data/modelltest/goethe-b1/*-NN.json` with **German voices only**.
`scripts/modelltest/derive-oesd.ts` copies it to `oesd-b1`:
- Austrian-set speakers get Austrian voices, Swiss-set speakers Swiss voices, and the rest Austrian voices.
- The Sprechen examiner and partner become Austrian.

So every Hören speaker needs a region: write `data/modelltest/goethe-b1/regions-NN.json` as
`{ "<blockId>": { "<speaker id>": "de" | "at" | "ch" } }`.

Check with `npx tsx scripts/modelltest/check-goethe.ts --exam goethe-b1 --skill <skill> --set <n>`.

## Common shape

- **Same JSON shape as Goethe A2** (`goethe-a2-authoring.md` §Common shape), with `exam: "goethe-b1"` and ids
  `goethe-b1-<skill>-NN-t<teil>-<suffix>`.
- **Items:** Lesen 1–30, Hören 1–30.
- **Beispiel** = item 0, solved via `exampleAnswers`.
- **Regions per set:** ~50–55 % D, ~25–30 % A, ~20 % CH by setting.
  - Places, prices (€ / CHF), phone prefixes and institutions follow the region.
  - Austrian/Swiss texts carry 1–3 regional words that are clear from context (glossary rules).
  - Swiss texts use **ss** and «», never ß.
  - Exactly **one** regional word per set gets a footnote line at the end of its text: "*X = österreichischer Standard
    für Y*".
  - Instructions stay common German.

## Lesen (65 min)

| Teil | Blocks | Items | Text |
|---|---|---|---|
| 1 | `t1-01` | 0, 1–6 `rf` | blog or personal email, **300–380 words**, in text order. Keys: 3 R / 3 F, never 3 in a row; Beispiel richtig |
| 2 | `t2-01`, `t2-02` | `t2-01`: 0, 7–9 · `t2-02`: 10–12, `choice` | two press texts, **175–235 words** each. The last paragraph is the source line, e.g. "aus einer deutschen Zeitung" / "aus einer Schweizer Zeitschrift". The first item of each text (7, 10) is "In diesem Text geht es um …" |
| 3 | `t3-01` | 0, 13–19 `match` (`noMatch: true`, `data.noMatchLabel: "0"`) | 10 ads a–j on one theme, ~20–50 words each (270–390 in all) with a title. Situations: one sentence each, with a first name. The Beispiel consumes one ad; **exactly one 0, at item 14–18**; 3 ads stay unused, one of them a near-miss for the 0 |
| 4 | `t4-01` | 0, 20–26 `rf` with `"labels": ["Ja", "Nein"]` | `reading.paragraphs`: heading "LESERBRIEFE" + a 1–2-sentence framing with the question, then 8 comments (Beispiel + 20–26) of ~50–70 words, each followed by "Name, Alter, Stadt". `statement` = "Beitrag 20: Name, Alter, Stadt". Key: is the person **for** the proposal (Ja = richtig). 3 Ja / 4 Nein. Writers: 4–5 D, 1–2 A, 2 CH |
| 5 | `t5-01` | 27–30 `choice` (stem = sentence start, options = endings) | rules / terms of use, **215–265 words**, heading + bold sub-headings ("**Buchung**" as its own paragraph). Items are **not** in text order; no Beispiel. `instruction` names a one-sentence situation |

## Hören (~38 min track incl. 5 min transfer; audio.ts builds the official rhythm)

| Teil | Blocks | Items | Script |
|---|---|---|---|
| 1 | `t1-bsp` (`example: true`), `t1-01`…`t1-05` | Beispiel: two items n = 0 (`rf`, then `choice`), `exampleAnswers` [rf, letter]. Text k: `rf` (2k−1) then `choice` (2k) | one speaker, **65–85 words**; `display.clip.lead` = the spoken situation line ("Sie hören eine Nachricht auf dem Anrufbeantworter."). `sound`: `"beep"` voicemail, `"radio"` radio/advert, `"gong"` station, `"boat"` lake boat. R/F: only 1–2 richtig of 5 |
| 2 | `t2-01` | 11–15 `choice` | one speaker to an audience, **~380–420 words**; `clip.lead` = situation line |
| 3 | `t3-01` | 16–22 `rf` | dialogue m + f in a public place, **~440–470 words**, du; overlaps, fillers, back-channels ("Mhm", "Klar"); `clip.lead`. 3–4 richtig |
| 4 | `t4-01` | 0, 23–30 `choice`: statement as prompt, options **a = moderator, b = guest 1, c = guest 2** (`label` = "Name, Rolle") | radio discussion, 3 voices, **~750–800 words**; `clip.lead` names the show and the guests; turns carrying a statement are marked `item`. The moderator owns exactly 1 of 23–30; the Beispiel belongs to a guest. `exampleAnswers` [letter] |

Voices: DE cast only (`data/tts-voices.json`), gender-matched, no voice twice in a block, none back to back across
blocks; never `man_mark` (narrator). Plays: T1 2, T2 1, T3 1, T4 2.

## Schreiben (60 min)

Three blocks `t1`, `t2`, `t3`, each with `display.writing: [{ key: "A", title, situation, points }]`, `display.items: []`,
`key.answers: []` and `key.writing: [{ key: "A", register, modelAnswer }]`.

| Aufgabe | Task | points | Model answer |
|---|---|---|---|
| 1 | informal email to a friend about something you experienced | exactly 3: describe … / give reasons … / suggest a meeting … | 70–100 words |
| 2 | guest-book post after a TV discussion. `situation` includes the stimulus post (~45 words) with "Name, Stadt" | `[]` (the official task has no points) | 70–100 words |
| 3 | polite email to a person you know only formally (apologise + explain, or ask) | `[]` | 35–55 words |

`instruction` names the time and "circa 80 / 40 Wörter".

## Sprechen (15 min preparation + ~15 min pair)

Same shape as Goethe A2, with `key.speaking.voices = { pruefer: "woman_irene", partner: "man_ben" }` (derive-oesd swaps in
`woman_alexandra_at` / `man_gruber_at`). Partner persona: a fellow candidate. The pair agrees on du in the intro.

| Teil | Block | Material | Turns |
|---|---|---|---|
| 1 | `t1` | `task` = situation; `points` = 4 Leitpunkte as short questions + "…" | examiner sets the task → du and partner alternate (partner proposes, objects with a reason, counter-proposes; live) → examiner closes. ≥ 4 du turns, `partnerLines` ≥ 4 |
| 2 | `t2` | `cards` = the 2 topics to choose from (`{ label }`); `points` = the 5 slides of the first topic, in the official order (introduce + structure; own experience; situation in your home country; pros/cons + own opinion; close + thanks) | examiner: intro, reminder not to read out notes → 5 du turns, one per slide (≈ 35 s each) → examiner thanks |
| 3 | `t3` | — | partner gives feedback + asks 1 question about **your** talk (live) → du answers → examiner asks 1 question (live) → du answers → round B: partner presents the other topic briefly (scripted) → du gives feedback and asks a question → partner answers → examiner closes. `followups` ≥ 3 |
