# Goethe-Zertifikat A2: authoring guide for Modelltests

How to write set *n* as JSON. Format facts: `goethe-a2.md` (§11 verified 2026-10-24). Topics of set 1:
`goethe-a2-set1.md`. Do-not-reuse list: `goethe-a2-official-situations.md`. Rules that override everything here:
CLAUDE.md §2–§4, §8 (realism, no copying of official or competitor text, voices from `data/tts-voices.json`).

Check every file with `npx tsx scripts/modelltest/check-goethe.ts --exam goethe-a2 --skill <skill> --set <n>` until it prints
"matches the blueprint".

## Common shape

- **Files:** `data/modelltest/goethe-a2/{hoeren,lesen,schreiben,sprechen}-NN.json`, each
  `{ "exam": "goethe-a2", "skill", "number", "title": "Modelltest n", "blocks": [...] }`.
- **Block:** `id, exam, skill, teil, status: "draft", generated: { model: "claude-opus-5-5", at, textType }, display, key`.
  Ids are `goethe-a2-<skill>-NN-t<teil>-<suffix>`.
- **Items** are numbered 1–20 per skill, continuously across the Teile.
- **A Beispiel is item 0, shown solved.** Its solution goes in the block's `exampleAnswers` (in item order), never in
  `key.answers`.
- **Every real item has one `key.answers` entry:** `{ n, correct, explanation, evidence: { text, hit } }`.
  - `hit` is a substring of `text`.
  - `explanation` is simple German, 1–2 sentences, and says why the near-miss is wrong.
  - Matching explanations name ads/pictures by content, never by letter.
- **Answers:** a/b/c → `"a"|"b"|"c"`; richtig/falsch and Ja/Nein → `"richtig"|"falsch"` (Ja = richtig); matching → the
  letter, or `"x"` for no match.
- **Instructions** (`display.instruction`): our own wording of the official pattern (`goethe-a2.md` §11.1), formal *Sie*.
- **Language:** A2, natural, Germany settings, formal *Sie* in instructions.
  - Speakers in dialogues talk like real people, with fillers ("äh", "na ja", "Moment mal").
  - Numbers in scripts are written as spoken words ("halb neun").
  - No official or TestGerman storylines.

## Hören (one track, ~30 min; audio.ts adds narrator, pauses, sound and the second plays)

`display.clip`: `{ plays, situation, speakers: { <id>: { name, tone } }, segments: [], duration: 0 }`.
`key.script`: `[{ speaker, voice, text, delivery, item? }]`. `delivery` is a short English stage direction in brackets.
`item: n` marks the turn that carries the answer. Turns of a Beispiel inside a block carry `item: 0`. Tones: first speaker
`var(--v-sk-lesen)`, second `var(--v-sk-schreiben)`.

| Teil | Blocks | Items | Item type | Plays | Script |
|---|---|---|---|---|---|
| 1 | `t1-01`…`t1-05` | 1–5 | `choice` (prompt = W-question or "Weil …" completion, 3 short text options) | 2 | **one speaker**, 43–64 words; radio items `sound: "radio"`, voicemail none, announcements `"gong"`/`"pool"`/`"store"` |
| 2 | `t2-01` (one block) | 0, 6–10 | `match`: `ads` = **9 pictures** a–i (`title: ""`, `text`: 1–4-word label of what the picture shows); `situations` = days in dialogue order (`{ n: 0, text: "Montag" }` …) | 1 | dialogue m + f, 220–250 words incl. the Beispiel part. The Beispiel turns come first and carry `item: 0` |
| 3 | `t3-01`…`t3-05` | 11–15 | `picture` (prompt = question, 3 options `{ key, label }`, label 1–3 words) | 1 | two speakers, 42–66 words; phone calls `sound: "phone"` |
| 4 | `t4-01` (one block) | 0, 16–20 | `rf` with `"labels": ["Ja", "Nein"]` (statement about the guest) | 2 | radio interview, presenter + guest, 195–215 words incl. the Beispiel exchange first (`item: 0`) |

- **Teil 1:** every clip mentions all three options; the wrong ones are said, then changed or ruled out.
- **Teil 2:** each wrong picture is something the speakers mention but don't do. The Beispiel uses one picture, 5 are
  answers, and 3 are distractors. `exampleAnswers`: [letter of the Beispiel picture]. Shuffle the letters, so the answers
  are not in a–e order.
- **Teil 3:** the dialogue mentions all three pictured things; the decision comes late.
- **Teil 4:** 3 Ja / 2 Nein or 2 / 3, max run 2. `exampleAnswers`: ["richtig"] (Ja).
- **Photos (Teil 2, 3):** for each option, give a Pexels search query in `block.photos[<n>][<key>] = { query, alt }`,
  where n is the item number (Teil 2: n = 0 for the whole grid of 9). Use concrete, photographable English queries, e.g.
  "moving boxes stacked in empty apartment". `alt` is a German one-line description. `images-options.ts` fills
  `option.image`.
- `sound` values: `"radio" | "phone" | "gong" | "store" | "pool" | "station" | "train"`.
- Voices: DE cast only, matching gender; no voice twice in one block, and no voice back to back across blocks. The
  narrator (`man_mark`) is added by audio.ts; never cast him.

## Lesen (30 min, one timer)

`display.reading`: `{ sender, source, paragraphs: [] }`; the first paragraph is the headline where the text has one.

| Teil | Block | Items | Text |
|---|---|---|---|
| 1 | `t1-01` | 0, 1–5 `choice` | newspaper article, **170–230 words**; stems mostly sentence starts ("Die Kinder …") |
| 2 | `t2-01` | 0, 6–10 `choice` | info board: each paragraph = one hall or floor with time slots/departments (event programme ~200 words, or a store directory ~120). a and b = two places from the board; **c = exactly "andere Halle"** (programme) or **"anderer Stock"** (directory); c is right 1–2 times of 5 |
| 3 | `t3-01` | 11–15 `choice` | informal email, **230–280 words**, `sender` = first name, `source: "E-Mail"`; no Beispiel |
| 4 | `t4-01` | 0, 16–20 `match` (`noMatch: true`, `data.noMatchLabel: "X"`) | 6 internet ads a–f, each `{ title: "www.…de" or a name, text }`, 190–250 words in all. Situations: one sentence about a person and what they want. The Beispiel consumes one ad, exactly one person is "x" (with a near-miss ad), and one ad stays unused |

## Schreiben (30 min)

Two blocks: `t1` and `t2`, each with `display.writing: [{ key: "A", title, situation, points: [3 imperatives] }]`,
`display.items: []`, `key.answers: []`, and `key.writing: [{ key: "A", register, modelAnswer }]`.

- **T1:** SMS to a friend, `register: "informell"`, du. `instruction`: write 20–30 words, cover all three points. Model answer
  20–30 words.
- **T2:** email to a named person you address formally (boss, landlady, neighbour, course office), `register: "formell"`. The
  third point is always a question. Model answer 30–40 words.

## Sprechen (~15 min, pair, no preparation)

Shape as in `data/modelltest/telc-a2/sprechen-01.json`: `display.speaking = { data: { part, title, task, points, cards? },
people, turns }`, turns `{ who, phase, text, seconds?, live? }`, `key.speaking = { voices: { pruefer: "woman_irene",
partner: "woman_kathi" }, sampleAnswers: [one per du turn] }`, `key.live = { persona, followups?, partnerLines? }`.

- `phase` = "1", "2" or "3".
- `du` turns carry a short hint in `text` ("Frag Ana nach ihrer Wohnung.") and `seconds`.
- Partner turns that react to the candidate carry `live: "partner"`. Their written text is a neutral fallback that doesn't
  assume what was said.
- Examiner follow-ups carry `live: "followup"` and must appear verbatim in `key.live.followups`.
- The examiner opens and closes every Teil and says *Sie* to both.
- The partner (Kathi, a fellow learner from Poland or Ukraine) uses du with the candidate.

| Teil | Block | Material | Turns |
|---|---|---|---|
| 1 | `t1` | `cards`: 4 × `{ label: "<Thema>" }` under the title "Fragen zur Person" (your cards). The persona lists the partner's 4 hidden cards and her answers | examiner models one exchange → du asks 4 (one per card), each answered by the partner (live) → partner asks 4, du answers (≥ 8 du turns) |
| 2 | `t2` | your card: `task` = the question, `points` = 4 keyword prompts with "?" | examiner reads the question → du speaks (~60–90 s) → examiner asks 1–2 follow-ups (live, bank of ≥ 3) → partner's own short card answer (scripted, ~45 s) |
| 3 | `t3` | **calendar**: `cards` = your entries `{ label: "08:00–10:00 Zahnarzt" }`, 7:00–21:00. The partner's calendar is in `key.live.persona`, with exactly one shared free hour | examiner sets the task → du proposes → partner rejects with a reason from her calendar (live) → … → agreement; ≥ 4 du turns; `partnerLines` ≥ 4 fallbacks |

Speaking seconds per du turn: T1 questions 10, answers 20; T2 90; follow-up answers 30; T3 25.
