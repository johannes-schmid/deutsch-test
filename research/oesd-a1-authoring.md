# ÖSD Zertifikat A1 (ZA1): authoring guide for Modelltests

How to write set *n* as JSON. Format facts: `oesd-a1.md` (§9 verified 2026-10-24). Topics of set 1: `oesd-a1-set1.md`.
Do-not-reuse list: `oesd-a1-official-situations.md`. Regional words: `austrian-swiss-glossary.md` §3–4. Rules that override
everything here: CLAUDE.md §2–§4, §8 (realism, no copying of official or competitor text, voices from `data/tts-voices.json`).

Check every file with `npx tsx scripts/modelltest/check-oesd.ts --exam oesd-a1 --set <n>` until every skill prints
"matches the blueprint".

## Common shape

- **Files:** `data/modelltest/oesd-a1/{hoeren,lesen,schreiben,sprechen}-NN.json`, each
  `{ "exam": "oesd-a1", "skill", "number", "title": "Modelltest n", "blocks": [...] }`.
- **Block:** `id, exam, skill, teil, status: "draft", generated: { model: "claude-opus-5-5", at, textType }, display, key`.
  Ids are `oesd-a1-<skill>-NN-t<teil>[-<suffix>]`. ÖSD calls the parts "Aufgabe"; `teil` = Aufgabe number.
- **Items** are numbered per skill, continuously: Lesen 1–16 (A1 1–5, A2 6–11, A3 12–16), Hören 1–15 (A1 1–5, A2 6–10,
  A3 11–15). Schreiben Aufgabe 1 form fields 1–9 (one tick group counts 2 → 10 points).
- **A Beispiel is item 0, shown solved** (only Hören Aufgabe 2 "Was:" and the printed surname of the form). Its solution
  goes in the block's `exampleAnswers`, never in `key.answers`.
- **Every real item has one `key.answers` entry:** `{ n, correct, explanation, evidence: { text, hit } }`; `hit` is an exact
  substring of `text`. `explanation`: simple German, du, 1–2 sentences, says why the near-miss is wrong. Matching
  explanations name ads/photos/pictures by content, never by number or letter.
- **Answers:** matching → the option key ("1"–"6" for ads and pictures, "A"–"F" for photos); JA/NEIN → `"richtig"` (JA) /
  `"falsch"` (NEIN); grid → the column key; typed → the word or number, with `accept` for other right forms and
  `"exact": true` for the spelled name and the phone number (they must be fully right, MS S. 13).
- **Instructions** (`display.instruction`): our own wording of the ÖSD pattern (a preview line, then "Situation: …", then how
  to answer and the play count, "Achtung: …" for the extra option), formal *Sie*. Never the official sentences.
- **Regions:** every text is set in A, D or CH (≈ 45 / 30 / 25 % per set). Regional words only in texts of that region,
  1–2 per text, never keyed (glossary §4). CH: ss, CHF `18.50`, `.ch`, 4-digit postcodes. AT: ß, `.at`, 0664/0676/0699,
  *-gasse*, Vienna `1xx0` postcodes, *Jänner*. Instructions say **"das E-Mail"** (neuter), as the ÖSD sheets do.
- **Language:** A1, very short sentences, everyday words. Hören scripts are spoken German: numbers and times as words.

## Hören (one track ~11 min; audio.ts adds the narrator SedaDa, gongs, previews, beeps, second play and check times)

`display.clip`: `{ plays, situation, speakers: { <id>: { name, tone } }, segments: [], duration: 0 }`.
`key.script`: `[{ speaker, voice, text, delivery, clip?, sound? }]`; `delivery` is a short English stage direction in
brackets. Tones: first speaker `var(--v-sk-lesen)`, second `var(--v-sk-schreiben)`, others `var(--v-sk-hoeren)`,
`var(--v-sk-sprechen)`.

| Aufgabe | Block | Items | Item | Plays | Script |
|---|---|---|---|---|---|
| 1 | `t1` (one block, five clips) | 1–5 | `match`, `noMatch: false`, `data.layout: "textNumber"`; `ads` = **6 photos** `A`–`F` (`title: ""`, `text`: German one-line description of the photo); `situations` = `{ n: 1, text: "Text 1" }` … `{ n: 5, text: "Text 5" }` | 1 | five dialogues, **two people each, 2–4 turns, 33–45 words**; every turn carries `clip: 1…5`; the first turn of each clip carries `sound` (`"train" \| "market" \| "lobby" \| "roller" \| "river" \| "station" \| "store"`). Speaker ids unique per clip (`c1a`, `c1b`, …) |
| 2 | `t2` | 0, 6–10 | `gap`, `sheet: "Notiz"`, all fields typed (`options: []`): title line, `Was:` = Beispiel n 0, `Wann: am [6], [7]. <Monat>, um [8] Uhr`, `Wo: [9]gasse <Nr.>` (the spelled part), `Telefon: 0699 / [10]` | 2 | **one speaker**, a voicemail of **94–102 words**, `sound: "beep"` on the block. Says the weekday and date, spells the street name letter by letter ("L – E – R – C – H – E – N"), says the number in pairs or singly; distractor day, time and a reference number |
| 3 | `t3` (one block, five clips) | 11–15 | `grid` (no `multi`): `title` = the question, `columns` a–d (4 options), `rows` `{ n: 11, text: "Text 1" }` … | 1 | the interviewer's question first (**no `clip`**), then five answers, `clip: 1…5`, **one person each, 38–55 words**, spontaneous ("äh", "also"); every answer names 2–3 options and settles on one late; all four columns used, one twice. `sound: "street"` on the block |

- **Aufgabe 1 photos:** `block.photos = { "0": { "A": { "query", "alt" }, … "F": … } }`. Query: concrete English Pexels
  terms for the scene with **two people** ("conductor checking ticket of woman on regional train"). The extra photo is a
  plausible near-miss scene. `images-options.ts` fills `ads[].image`. Shuffle: text order and photo order unrelated.
- **Voices (set 1 casting in `oesd-a1-set1.md`):** AT cast (`man_gruber_at`, `man_martin_at`, `woman_alexandra_at`,
  `woman_emilia_at`); CH voices only for Swiss-set speakers; **at most one DE voice** in the set, for a Germany-set
  speaker. Never `woman_seda_at` (narrator) or `man_mark`. No voice twice in one dialogue; gender matches the role.
- `situation` labels: "Fünf kurze Gespräche", "Nachricht auf der Sprachbox", "Umfrage auf der Straße".

## Lesen (25 min, one timer)

| Aufgabe | Block | Items | Shape |
|---|---|---|---|
| 1 | `t1` | 1–5 | `match`, `noMatch: false`: `ads` = **6 newspaper ads** `{ key: "1"…"6", title, text }` (20–30 words each, 120–200 words in all), `situations` = 5 × two short sentences ("Sie brauchen …. Sie haben …"). One ad stays unused and shares keywords with 2–3 situations. No ad in its own position |
| 2 | `t2-01`, `t2-02`, `t2-03` | 6–11 | each block: `reading` `{ sender: "<shop / organiser>", source: "Anzeige", paragraphs: [title, 2–3 lines] }` (26–44 words), one each from D, A, CH; items: 2 × `rf` with `"labels": ["Ja", "Nein"]` whose `statement` is a **question** ("Kostet die Führung für Kinder etwas?"). 2 JA / 4 NEIN in all, at most one JA per text |
| 3 | `t3` | 12–16 | `match`, `noMatch: false`: `ads` = **6 pictograms** `{ key: "1"…"6", title: "<German label for screen readers>", text: "", picto: "<key from lib/exam/pictos.ts>" }`; `situations` = 5 notices, each beginning "Liebe …!" (14–32 words). The unused pictogram is a near-miss sign |

## Schreiben (20 min)

| Aufgabe | Block | Shape |
|---|---|---|
| 1 | `t1` | `reading` `{ sender: "", source: "Situation", paragraphs: [one paragraph of 40–55 words] }`; `items: [{ type: "gap", data: { sheet: "Formular", parts: [...] } }]`; the surname is the Beispiel (`n: 0`, `exampleAnswers: ["<surname>"]`). Fields 1–9: **5 typed** (first name, birth date, place, phone, month) and **4 tick fields** with `options`, one of them `"pick": 2` over 4 boxes (key `"<box>,<box>"` in option order). Typed keys get `accept` (date formats "3.1.1994", "03.01.1994", "3. Jänner 1994") |
| 2 | `t2` | `writing: [{ key: "A", title, situation, points, opener }]`, `items: []`, `key.answers: []`, `key.writing: [{ key: "A", register: "informell", modelAnswer }]`. `situation` = a frame sentence ("Ihre Freundin Tamara schreibt Ihnen:") + the input email in „…" (~50 words, du, 3 questions in the body). `points` = the 3 questions. `opener` = what the sheet prints ("Liebe Tamara,\ndanke für dein E-Mail. Hier meine Antworten:"). Instruction: write about 30 words, answer all questions, greeting at the end, "das E-Mail". Model answer 25–40 words |

## Sprechen (10 min preparation + ~8 min individual exam)

Blocks `t1`, `t2`, `t3`, each `display.speaking = { data, people, turns }`. `people`: `pruefer` = the **Assessor**
(`{ name: "Herr …", initial, tone: "var(--v-sk-lesen)" }`), `partner` = the **Interlokutorin** (`{ name: "Frau …",
initial, tone: "var(--v-sk-schreiben)" }`), `du` = `{ name: "Du", initial: "Du", tone: "var(--p-glow)" }`. Turns
`{ who, phase: "1" | "2" | "3", text, seconds?, live? }`; `du` turns carry a short hint in `text` (du-form) and `seconds`.
`key.speaking = { voices: { pruefer: "man_gruber_at", partner: "woman_alexandra_at" }, sampleAnswers: [one per du turn] }`
(sample answers at A1, a good candidate). `key.live = { persona?, followups?, partnerLines? }`.

- The Assessor opens and closes every Aufgabe and says *Sie*. The Interlokutorin says *Sie* in Aufgabe 1–2; in Aufgabe 3 she
  plays the other role (customer or staff) and uses the register of the scene (Sie).
- Interlokutor questions carry `live: "followup"` (text verbatim in `key.live.followups`, the bank). Role-play turns carry
  `live: "partner"`; their text is the fallback for the default scene and role.

| Aufgabe | Material (`data`) | Turns |
|---|---|---|
| 1 | `task`, `points` = **6 keywords with "?"** (the topic card), `choose: 4` | Assessor: greeting, introduces both examiners, asks the name and how the candidate is → du (warm-up, 15 s) → Assessor explains (4 of 6 topics, Frau … asks questions) → du (90 s) → **3 × (Interlokutorin `followup` → du 20 s)** → Assessor: thanks, next Aufgabe. Bank ≥ 5 follow-ups (Sie-form, about the person, fit any answer) |
| 2 | `task`, `points` = the 4 questions ("Was sehen Sie?" …), **`scenes`** = 3 × `{ key: "1"…"3", label, roles: ["<role 1>", "<role 2>"] }`; photos in `block.photos["0"][<key>] = { query, alt }` (two people in a service scene) | Assessor asks which photo → du (10 s) → Assessor: describe it → du (60 s) → **2 × (Interlokutorin `followup` → du 20 s)** → Assessor: thanks. Bank ≥ 3 questions that fit any of the three photos |
| 3 | `task`, `points` (4 short steps), the same `scenes` | Assessor: play the scene of your photo with Frau …, **which role** do you want? → du (10 s) → **~8 × (Interlokutorin `partner` → du 15 s)** → Assessor: thanks, exam over. `key.live.persona`: for each scene and each role, who the Interlokutorin is and her ~8 turns (problem, question, price, time, payment, name …). `partnerLines` ≥ 6 neutral fallbacks |

Speaking seconds per du turn: warm-up 15, A1 topics 90, follow-ups 20, photo choice 10, description 60, role choice 10,
role-play 15.
