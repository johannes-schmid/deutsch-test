# Start Deutsch 1 (telc Deutsch A1): authoring guide for Modelltests 2–10

How to draft set *n* of Start Deutsch 1 in the style of set 1. Format facts live in `research/start-deutsch-1.md`;
this file says how to turn them into our JSON. **Canonical example: `data/modelltest/start-deutsch-1/*-01.json`.**
Copy its shape exactly; change only the content. Stand 2026-10-23.

Rules that override everything here: CLAUDE.md §2–§4 (realism, no official claims, no copying), §8 (voices, keys).

---

## 1. Plan set *n* across all four skills first

Set *n* = Prüfungssimulation *n* (CLAUDE.md §3). Write one plan for Hören *n*, Lesen *n*, Schreiben *n* and Sprechen *n*
together **before** drafting any skill. Use set 1's plan as the template (table per skill, then a cross-skill check):

| Plan section | Content |
|---|---|
| Hören | per item: Teil, setting / text type, tested detail → key, voices (A / B), plays |
| Lesen | per text: type, ~words, items with keys |
| Schreiben | form situation + fields; message task + register |
| Sprechen | examiner, partner persona (name, age, country, town, job, languages, hobby), Teil 2 topics + cards, Teil 3 cards |
| Cross-skill check | every person name, place, firm and theme of the set, by skill: **no repeats** |

- No topic, situation, person name, firm or town appears in two skills of set *n* (not even as a side detail).
- Also avoid: the official Übungstest situations (§9), the free test (`data/gratis-test/start-deutsch-1/`), and the
  situations already used in earlier sets (§9, "Sets used"). Add set *n* to that table when it is done.
- Keys are balanced: a/b/c spread evenly per Teil, richtig/falsch mixed (never three of the same in a row, never
  strict alternation).

## 2. File and block layout

Files: `data/modelltest/start-deutsch-1/{hoeren,lesen,schreiben,sprechen}-NN.json`, each
`{ exam, skill, number, title: "Modelltest n", blocks, track? }`. Every block has
`id, exam, skill, teil, status: "draft", generated: { model, at, textType }, display, key`. Block ids are
`start-deutsch-1-<skill>-NN-t<teil>-<suffix>`.

Items are numbered 1–15 per skill, continuously across Teile. A Beispiel is item **0**, shown solved: its block has
`example: true` (when it is its own block) and its solution goes in the block's `exampleAnswers` (never in `key`).
Every real item has exactly one `key.answers` entry: `{ n, correct, explanation, evidence?: { text, hit } }`
(`hit` must be a substring of `text`). Explanations are simple German, 1–2 sentences, and say why the near-miss is wrong.

### Hören (15 items + 2 Beispiele, ~17 min track)

| Teil | Blocks (id suffix) | Items | Item type | Plays | `sound` | Script |
|---|---|---|---|---|---|---|
| 1 | `t1-bsp`, `t1-01`…`t1-06` | 0, 1–6 | `picture`: prompt + 3 options `{ key, label, picto }` | 2 | none | dialogue, 2 voices, 20–70 words |
| 2 | `t2-bsp`, `t2-01`…`t2-04` | 0, 7–10 | `rf`: one statement | 1 | `store` / `gong` / `station` / `train` to fit the place | announcement, 1 voice, 20–50 words |
| 3 | `t3-01`…`t3-05` (no Beispiel) | 11–15 | `choice`: prompt + a/b/c (1–4 words each) | 2 | `beep` | phone message, 1 voice, 15–50 words |

- `display.clip`: `{ plays, situation, speakers: { A: { name, tone }, B: … }, segments: [] }`. `audio.ts` fills `src`
  and `duration`. Speaker names are roles ("Mann", "Frau", "Erzieherin", "Sprecher"); A uses `var(--v-sk-lesen)`,
  B `var(--v-sk-schreiben)`.
- `key.script`: `[{ speaker, voice, text, delivery, item? }]`; `delivery` is a short English stage direction in
  brackets; `item: n` marks the turn that carries the answer.
- Teil 1 pictures: every option needs a `picto` key from `lib/exam/pictos.ts` (`PICTO_KEYS`) and the block needs
  `key.pictureBrief` (one line per option: what the drawing shows). Pick details that a pictogram can show
  (weather, objects, places, numbers on a sign).
- Write numbers in scripts as words ("fünfzehn Uhr zehn"), as they are spoken.

### Lesen (15 items + 3 Beispiele)

| Teil | Blocks | Items | Item type | Text |
|---|---|---|---|---|
| 1 | `t1-01` (items 0, 1, 2), `t1-02` (items 3, 4, 5) | 0, 1–5 | `rf` | two personal notes / e-mails, 30–90 words each; `reading: { sender, source: "Notiz" or "E-Mail", paragraphs }` with greeting and sign-off as their own paragraphs |
| 2 | `t2-bsp`, `t2-01`…`t2-05` | 0, 6–10 | `choice` a/b | situation as `prompt`; two snippets as option labels `"www.domain.de · text"`, 8–30 words each |
| 3 | `t3-bsp`, `t3-01`…`t3-05` | 0, 11–15 | `rf` | one sign per block: `reading: { sender: "<where the sign hangs>", source: "Schild", paragraphs: <sign lines> }`, 4–25 words |

Instructions name the item range ("Aussagen 1 bis 5", "Situationen 6–10", "Aussagen 11–15").

### Schreiben

| Teil | Block | Shape |
|---|---|---|
| 1 | `t1` | `reading` = the situation (3 short paragraphs, 45–80 words, `source: "Situation"`); `items` = **one** `gap` with `sheet: "Formular"`: `parts` alternate label strings and fields, lines separated by `"\n"`, a title line first. Field 0 is the Beispiel (`{ n: 0, options: [] }`, solution in `exampleAnswers`); fields 1–5 are typed (`options: []`), except **one** tick choice (`options: ["ja", "nein"]` or two real alternatives). |
| 2 | `t2` | `writing: [{ key: "A", title, situation, points: [3 Leitpunkte] }]`; `key.writing: [{ key: "A", register, modelAnswer }]` |

Typed fields are scored tolerantly (case and 1–2 wrong letters pass) but **every digit sequence must match
exactly**. Put real alternative forms in `accept`: "zwei" for "2", "12.7." for "12. Juli", "Ringstr. 17" for
"Ringstraße 17", the number without spaces. Every answer must be findable in the situation text; a field asks for
one word, number or date.

Teil 2: ~30 words, one or two sentences per point, greeting and closing. `register` is `"formell"` (Sie, e.g. a
neighbour "Liebe Frau X" or an office) or `"informell"` (du, a friend); the model answer must use that register
throughout. Model answer 25–45 words, signed with a name that does not occur elsewhere in the set.

### Sprechen (group exam simulated as *du* + one partner + examiner)

Blocks `t1`, `t2`, `t3`, `phase` `"1"`, `"2"`, `"3"`. `display.speaking = { data, people, turns }`,
`key.speaking = { voices: { pruefer, partner }, sampleAnswers, pictureBrief? }`, `key.live = { persona, partnerLines? }`.

| Teil | Turns (in order) | du turns |
|---|---|---|
| 1 | examiner greets + models an intro (her own invented data) → du intro (60 s) → spell surname (15 s) → a number: postcode / phone / house number (10 s) → partner intro → partner spells → partner says a number → examiner closes | 3 |
| 2 | examiner names topic 1 and models one card (question **and** answer) → du asks with card 1 (15 s) → partner answers (**live**) → partner asks with her card → du answers (15 s) → examiner: topic 2, partner asks first → du answers → du asks with card 2 → partner answers (**live**) → examiner closes | 4 |
| 3 | examiner models a request with an example picture card + a reaction → du request card 1 (10 s) → partner reacts (**live**) → partner request → du reacts (10 s) → du request card 2 → partner reacts (**live**) → partner request → du reacts → examiner ends the exam | 4 |

- `data.points`: Teil 1 the keyword sheet (Name? Alter? Land? Wohnort? Sprachen? Beruf? Hobby?); Teil 2 the two
  topics. `data.cards`: Teil 2 `"Thema: <topic> · <keyword>"`, Teil 3 `{ label, picto }` (picto from `PICTO_KEYS`).
  `key.speaking.pictureBrief` lists the Teil 3 cards (example, du, partner).
- **du turns:** the hint in du-form ("Frag Iryna. Deine Karte: Balkon."), with `seconds`.
- **Live partner turns** (`"live": "partner"`): every partner turn that answers or reacts to the candidate. The text is
  only the fallback when live generation fails, so it must be **neutral**: it picks up the card keyword and fits any
  sensible question/request on that card, without assuming what was asked ("Meine Jacke? Ich habe eine warme Jacke
  für den Winter. Sie ist schwarz."). List the same texts, in order, in `key.live.partnerLines`.
- Partner turns that are the partner's **own** question or request stay scripted (they come from her cards).
- `key.live.persona`: name, age, country (+ town), where she lives, job, languages, hobby; her level (A1: short
  simple sentences, at most one small error per line, always understandable; she says *Sie* to the others); her
  Teil 2 cards and fixed questions, the facts behind her answers (home, clothes, …); her Teil 3 cards and how she
  reacts to requests.
- Examiner: *Sie*, calm, models every Teil herself. Candidates say *Sie* to each other.
- `sampleAnswers`: one short A1 model per du turn, in order.
- `people`: `pruefer` "Prüferin"/P, `partner` first name + initial, `du` "Du"/Du; tones as in set 1.

## 3. Text types and situations (from the blueprint)

| Skill · Teil | Text types | Situations that fit (vary them) |
|---|---|---|
| Hören 1 | short everyday dialogue | family phone call, street, course, work, shop counter, neighbour, doctor's reception |
| Hören 2 | loudspeaker announcement | airport, supermarket / department store, U-Bahn / tram, train, station |
| Hören 3 | answerphone / phone message | Kita / school, friend, library, colleague, practice, workshop, office |
| Lesen 1 | note, e-mail | work note, invitation, request for help, change of plan |
| Lesen 2 | web snippets / small ads | services, shops, leisure, used goods, opening hours, courses |
| Lesen 3 | signs and notices | house, bus, park, office, shop door, pool, library, Kita |
| Schreiben 1 | form | sign-up (course, club, library), order, repair job, rental: **not** hotel/holiday lodging, **not** language school (official) |
| Schreiben 2 | short e-mail / note | to a friend or neighbour: apology, request, invitation, short information |
| Sprechen 2 | topics | Wohnen, Kleidung, Essen und Trinken, Einkaufen, Wochenende, Arbeit, Freizeit, Familie |
| Sprechen 3 | picture cards | everyday objects or signs a person can be asked for (pen, window, lamp, glass, bag, chair, …) |

## 4. Voices and casting

Voice keys only from `data/tts-voices.json`, never voice ids. **DE voices only.**

- Narrator `man_mark` (framing only, rendered by `audio.ts`); never in a script.
- Hören 1 dialogues: two different voices, gender matching the role (`man_ben`, `man_christian`, `man_simon`,
  `woman_ela`, `woman_irene`, `woman_laura`; `woman_lisa`, `man_johann`, `man_michael` for older people).
- Hören 2–3: one voice per clip; rotate, don't use the same voice in two clips in a row.
- `woman_kathi` (`de-learner`) only for people who came to Germany themselves (a friend, a course mate), never an
  announcement, office, practice or examiner.
- Sprechen: examiner `woman_ela`, partner `woman_kathi` (a learner from abroad, plausibly Eastern Europe). The
  partner is a woman: "Frau <Surname>", "Ihre Partnerin", "ihre Bitte".
- Plan casting per set: the last Hören clip should not be Ela or Kathi (they open Sprechen in the simulation).

## 5. Hören pace and track

- Pace measured on the official telc ÜT1 MP3: Teil 1 ~120, Teil 2 ~115, Teil 3 ~140 words/min after tempo
  correction (`LEVEL_PACE` in `scripts/modelltest/audio.ts`; at most ×1.15 speed-up). Official total 16:54.
- Track: jingle + "Teil n" + instruction per Teil; per text "Beispiel"/"Nummer n", ~7 s reading, the clip, chime
  and repeat where played twice, ~16 s to answer. `audio.ts` builds it and writes `track` + clip `src`/`duration`.
- Render (Hannes approves the cost): `npx tsx --env-file=.env.local scripts/modelltest/audio.ts --exam start-deutsch-1 --set n`
  and `… --skill sprechen` for the examiner/partner lines and fallbacks.
- Never edit a script, clip or cue after rendering without re-rendering that set.

## 6. Quality rules (from the set 1 reviews)

1. **Paraphrase.** Statements, prompts and situations never repeat the source's key words; the candidate must
   understand, not match words ("Sie brauchen mehr Licht" for "Lampen", "Zettel mit einer Zahl" for "Wartenummer").
   The distractor may share words with the prompt; the key should not.
2. **Distractors in only 2–3 of 5 texts per Teil.** The others are plain. A planted near-miss (wrong day mentioned
   first, a second number) in every clip sounds scripted.
3. **Unambiguous keys.** Each key must survive a reviewer asking "could the other option also be right?". Avoid
   quotes or opinions that can be read two ways.
4. **Natural German** at A1: short main clauses, everyday words, real place types; dialogue sounds spoken.
5. **Numbers exact** and consistent between script, items, keys and explanations.
6. **Not close to official situations** (§9), not even re-skinned (same task with a new name).
7. Sprechen fallbacks are neutral (§2); learner errors only in Kathi's lines, max one small one per line.
8. Schreiben 1: all answers are in the text, at most one planted near-miss, alternative forms in `accept`.

## 7. Check

```bash
npx tsx scripts/modelltest/check-start.ts --exam start-deutsch-1 --set n            # whole set
npx tsx scripts/modelltest/check-start.ts --exam start-deutsch-1 --set n --skill lesen
```

It checks items, numbering, Beispiele, keys (one per item, one correct option, typed gaps answered, `accept`
sane), play counts, voices (exist, DE, gender, A ≠ B, examiner ≠ partner, no learner voice in announcements), word
counts, Sprechen turns (du count, live partner turns + `partnerLines`, persona), names/places repeated across the
skills of the set, and the 6-word overlap with `.unit-cache/official-start-deutsch-1/*.txt`. Fix every hit; only
stock phrases (instruction formulas, the Teil 1 keyword sheet) are allowed. Then an independent review against the
official Übungstest (format, realism, keys) before Hannes reviews.

## 8. Seed and review

```bash
npx tsx --env-file=.env.development.local scripts/modelltest/seed.ts --exam start-deutsch-1 --skill <skill> --set n
```

Local only; Hannes seeds production. Review each set in `/admin/modelltests` (preview with the real exam
components, "Geprüft" per Teil). Drafts stay `status: "draft"`; nothing publishes automatically.

## 9. Do not reuse

**Official telc Übungstest 1 (2017/2021; paraphrased):** hotel room number, pullover price, the time, food in a
restaurant, son's school class, way to the 2nd floor, where a man travels, "come to the counter", where two men
meet, how long a man waits, which day a woman comes, what is broken; weather website, Rhine boat, learning German
in Germany, train ticket online, Bodensee, train connection; party with salad / pullover; language-school move,
breakfast pack, post office hours, smoking at the station, restaurant dance evening, New Year's bus; Bodensee tour
bus-tour booking for a family on holiday (fields: persons, children, holiday address/hotel, payment cash or card,
date): avoid that field set, not just the topic; Dresden tourist office; Sprechen examples breakfast /
glass of water. Goethe Übungssatz 01/02: language-school sign-up, holiday booking.
`TODO(hannes):` the Goethe Übungssätze are not cached (goethe.de blocks scripts); add their situations here.

**Free test** (`data/gratis-test/start-deutsch-1`): tram to the station, party (cake/salad/wine), airport gate
change (Wien), cinema meeting time, practice opening hours, birthday party in the garden, German course Saturday /
evening, doctor's holiday sign, language-course enquiry, cards Einkaufen · Supermarkt and Schere. Names Paul,
Miriam, Jana, Jonas, Mareike, Hanna, Felix, Hollmann, Lindner, Krause, Lindenau, Mertens, Kaltenbach, Lindenberg.

**Sets used** (add a row per finished set):

| Set | Hören | Lesen | Schreiben | Sprechen |
|---|---|---|---|---|
| 1 | pet, weather Kiel, ex-course mate at the hospital, exercise page, present for grandpa, holiday month, parcel at the kiosk; Kaufhaus bags, Lissabon delay, child at the supermarket entrance, U3 closed, Bordbistro; Kita Tierpark, moving Saturday, library book, colleague's shift, dentist | work note (printer, order), Kinderflohmarkt; museum, pram, kids' football, pharmacy Sunday, old sofa, birthday cake; pool, no water, bus without cash, dogs on a lead, Bürgerbüro number, Waschsalon | Kochkurs sign-up (Lan Nguyen, Gießen; fields street, town, mobile, vegetarian tick, weekday); e-mail to neighbour Frau Brandt (letter box) | Iryna Bondarenko (Ukraine, Erfurt, Friseurin); Wohnen (Balkon/Küche), Kleidung (Jacke/Farbe); Kuli, Lampe / Zeitung, Kamera |

## 10. Drafting brief (per set)

> You draft **Start Deutsch 1 Modelltest {n}** (all four skills = Prüfungssimulation {n}) for deutschtest-ueben.de.
> Read `research/start-deutsch-1-authoring.md` (this file), `research/start-deutsch-1.md` and CLAUDE.md §2–§4, §8.
> Copy the JSON shape of `data/modelltest/start-deutsch-1/*-01.json` exactly.
> 1. Write the plan for set {n} (§1): every item with situation, tested detail, key and voices; the Sprechen persona
>    and cards; the cross-skill name/place/theme check. Nothing from §9 (official, free test, earlier sets).
> 2. Draft `data/modelltest/start-deutsch-1/{hoeren,lesen,schreiben,sprechen}-{NN}.json`, `status: "draft"`,
>    `generated.model` = your model id. Simple, natural A1 German; balanced keys; paraphrased statements;
>    distractors in only 2–3 of 5 texts per Teil; neutral live fallbacks for the partner.
> 3. Run `npx tsx scripts/modelltest/check-start.ts --exam start-deutsch-1 --set {n}` until it prints `ok`.
> 4. Report: the plan, the checker output, anything unsure as `TODO(hannes):`. Do not render audio, seed or commit.
