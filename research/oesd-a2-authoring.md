# ÖSD Zertifikat A2 (ZA2): authoring guide for Modelltests

How to write set *n* as JSON. Format facts: `oesd-a2.md` (§9 verified 2026-10-24). Topics of set 1: `oesd-a2-set1.md`.
Do-not-reuse list: `oesd-a2-official-situations.md`. Regional words: `austrian-swiss-glossary.md` §3–4. Rules that override
everything here: CLAUDE.md §2–§4, §8.

Check every file with `npx tsx scripts/modelltest/check-oesd.ts --exam oesd-a2 --set <n>` until every skill prints
"matches the blueprint".

## Common shape

- **Files:** `data/modelltest/oesd-a2/{hoeren,lesen,schreiben,sprechen}-NN.json`, each
  `{ "exam": "oesd-a2", "skill", "number", "title": "Modelltest n", "blocks": [...] }`.
- **Block:** `id, exam, skill, teil, status: "draft", generated: { model: "claude-opus-5-5", at, textType }, display, key`.
  Ids are `oesd-a2-<skill>-NN-t<teil>`. `teil` = Aufgabe number.
- **Items** per skill, continuously: Lesen 1–10 (A1 1–5, A2 0 + 6–10), Hören 1–14 (A1 1–4, A2 5–9, A3 10–14).
- **Beispiel:** only Lesen Aufgabe 2 (item 0, `exampleAnswers: ["<letter>"]`).
- **Keys:** `{ n, correct, explanation, evidence: { text, hit } }` as in ZA1 (`oesd-a1-authoring.md`). Headings → the
  heading letter; A/B/C → `"a"|"b"|"c"`; marks → one right box key per item (items 1–4 = the four right boxes in box
  order); multi-select row → the ticked column keys joined by "," in column order ("b,e"); typed → word/number with
  `accept`, the phone number `"exact": true`.
- **Instructions:** our own wording of the ÖSD pattern ("Lesen Sie … Sie haben dafür 30 Sekunden Zeit." is read by the
  narrator; the sheet says the Situation and how to answer). "das E-Mail" (neuter).
- **Regions:** AT-leaning (≈ 55–60 % A, 25 % D, 15 % CH per set). Regional words only in texts of that region, 1–3 per
  text, never keyed. Lesen Aufgabe 1 texts carry an origin label.
- **Language:** A2. Hören at **~165–185 words/min** with natural fillers ("äh", "na ja", "tja") in the voicemail and the
  interviews; numbers and times as words.

## Hören (one track ~10.5 min; audio.ts adds the narrator SedaDa, gongs, previews, jingle, playback sound, check times)

| Aufgabe | Block | Items | Item | Plays | Script |
|---|---|---|---|---|---|
| 1 | `t1` (two clips) | 1–4 | `marks`: `{ title: "<topic>", options: 8 boxes a–h (row 1 a–d, row 2 e–h, 1–3 words each), pick: 4, ns: [1, 2, 3, 4] }` | 1 | **two radio texts with the same four facts** in other words and order, **65–75 words each**: clip 1 read by a woman (news style), clip 2 by a man (chattier). `sound: "radio"` on the block. Of the 4 wrong boxes, **1 is mentioned and negated**, 3 are plausible but unmentioned. 2 right per row |
| 2 | `t2` | 5–9 | `gap`, `sheet: "Notiz"`, all typed: a note title line, then 5 lines (day, time, € amount, thing to bring, phone after a printed AT mobile prefix) | 2 | **one speaker**, an informal du voice message (Servus, fillers), **112–128 words**; `sound: "playback"`. One time is said so that two formats are right (`accept`) |
| 3 | `t3` (five clips) | 10–14 | `grid` with `"multi": true`: `title` = the question, `columns` a–e (5 options), `rows` `{ n: 10, text: "Person 1" }` … | 1 | interviewer's question first (no `clip`), then five answers `clip: 1…5`, **one person each, 35–65 words**, ~4 s apart, **no "Text n" labels**; genders f, m, f, m, f. Key: **10 ticks of 25, every column exactly twice, 1–3 per row**; every speaker also names one option they don't use. `sound: "street"` |

Voices: AT cast; CH only for a Swiss-set speaker; at most one DE voice for a Germany-set speaker; never `woman_seda_at`
or `man_mark`; gender matches.

## Lesen (30 min, one timer)

| Aufgabe | Block | Items | Shape |
|---|---|---|---|
| 1 | `t1` | 1–5 | `match`, `noMatch: false`: `ads` = **10 headings** `{ key: "A"…"I", "K", title: "<3–7 words>", text: "" }` in **3 theme clusters**; `situations` = 5 newspaper notices `{ n, origin: "aus einer österreichischen / deutschen / Schweizer Zeitung", text }` (35–55 words; ≈ 2 A, 2 D, 1 CH). **One text carries a small `table`** (rows of cells, first row = header); its `text` stays 35–55 words. Each text has 1–3 same-cluster near-miss headings; five different letters in the key |
| 2 | `t2` | 0, 6–10 | `reading` `{ sender: "<newspaper name>", source: "aus einer österreichischen Zeitung", paragraphs: [headline, …] }` (185–225 words); items: Beispiel `choice` n 0 + 5 `choice` (sentence starts completed by a/b/c), in text order. Key skewed toward one letter as in the MS, all three letters used |

## Schreiben (30 min)

One block `t1`: `writing: [{ key: "A", title, situation, points, opener }]`, `items: []`, `key.writing: [{ key: "A",
register: "informell", modelAnswer }]`. `situation` = frame sentence + the input email in „…" (~75 words, du, 4 questions
in the body). `points` = the 4 questions, **the first "Wie geht es dir?"**, the last a "when do you have time"-type
question. `opener` = "AW: <subject>\nLiebe/Lieber …,\n<two opening sentences>\nZu deinen Fragen:". Instruction: write
about 50 words, answer all questions, greeting at the end, "das E-Mail". Model answer 45–65 words.

## Sprechen (10 min preparation + ~7 min individual exam)

Blocks `t1`, `t2`; `display.speaking = { data, people, turns }` as in ZA1 (`pruefer` = Assessor "Herr …", `partner` =
Interlokutorin "Frau …"). `key.speaking.voices = { pruefer: "man_gruber_at", partner: "woman_emilia_at" }`.

| Aufgabe | Material (`data`) | Turns |
|---|---|---|
| 1 | Folienblatt: `points` = 6 topics (5 keywords with "?" + one open sentence with "…", e.g. "… möchte ich lernen …"), `choose: 5` | Assessor: greeting, both examiners, name, preparation done, nervous? → du (15 s) → Assessor explains (5 of 6, Frau … asks) → du (120 s) → **5 × (Interlokutorin `followup` → du 20 s)** → Assessor: next Aufgabe. Bank ≥ 7 Sie-form questions |
| 2 | `task`; **`sheet`** `{ title, rows: [{ label: "Wo?", pictures: [3] }, { label: "Wann?", pictures: [3] }, { label: "…?", pictures: [3] }, { label: "…?", pictures: [2] }], more: "noch etwas?" }`; pictures `{ label, picto }` (keys from `lib/exam/pictos.ts`); `points` = the row labels + "noch etwas?" | Assessor sets the scene (Sie) and says Frau … plans with you on du → Interlokutorin (`live: "partner"`, **du**) opens with a question → du … ≥ 5 du turns (25 s each) across all rows; she proposes, objects once with a reason, offers an alternative, uses a picture the candidate skipped → Assessor reminds once of an unused row → … → Assessor: "Haben Sie jetzt alles geplant?", thanks, exam over. `key.live.persona` (who she is, her preferences per row) and `partnerLines` ≥ 6 |
