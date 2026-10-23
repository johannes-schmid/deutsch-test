# telc Deutsch A2 (Start Deutsch 2): authoring guide for Modelltests 2–10

How to draft set *n* of telc Deutsch A2 in the style of set 1. Format facts live in `research/telc-a2.md`; this
file says how to turn them into our JSON. **Canonical example: `data/modelltest/telc-a2/*-01.json`.** Copy its
shape exactly; change only the content. Stand 2026-10-23.

Rules that override everything here: CLAUDE.md §2–§4 (realism, no official claims, no copying), §8 (voices, keys).

---

## 1. Plan set *n* across all four skills first

Set *n* = Prüfungssimulation *n* (CLAUDE.md §3). Write one plan for Hören *n*, Lesen *n*, Schreiben *n* and Sprechen *n*
together **before** drafting any skill:

| Plan section | Content |
|---|---|
| Hören | per item: Teil, topic / situation, names and places, tested detail → key, voice |
| Lesen | directory (store name, floors), article (person, facts, R/F keys), 8 ads + 5 situations (+ which one is x) |
| Schreiben | form situation (person, documents, fields), letter situation + 4 points |
| Sprechen | examiner, partner persona, Teil 2 topic + both card sets + examiner's example card, Teil 3 plan + both mind maps |
| Cross-skill check | every person name, place, firm and theme of the set, by skill: **no repeats** |

- No topic, situation, person name, firm or town appears in two skills of set *n*, not even as a side detail
  (set 1 renamed a Lesen actor who shared a surname with a Hören neighbour, and moved the library town because Kassel
  was already a Hören stop).
- Also avoid: the official Übungstest situations (§9), the free test (`data/gratis-test/telc-a2/`), telc B1 set *n*,
  and situations already used in earlier A2 sets (§9, "Sets used"). Add set *n* to that table when it is done.
- Keys balanced: a/b/c spread per Teil, richtig/falsch mixed (no three in a row, no strict alternation).

## 2. File and block layout

Files: `data/modelltest/telc-a2/{hoeren,lesen,schreiben,sprechen}-NN.json`, each
`{ exam, skill, number, title: "Modelltest n", blocks, track? }`. Every block has
`id, exam, skill, teil, status: "draft", generated: { model, at, textType }, display, key`. Block ids are
`telc-a2-<skill>-NN-t<teil>-<suffix>`.

Items are numbered 1–15 per skill, continuously across Teile. The Beispiel is item **0**, shown solved: its
solution goes in the block's `exampleAnswers` (never in `key`); a Beispiel with its own clip is its own block with
`example: true`. Every real item has exactly one `key.answers` entry
`{ n, correct, explanation, evidence?: { text, hit }, accept? }` (`hit` is a substring of `text`).

**Typed answers** (Hören 1, Schreiben 1): a gap `{ n, options: [] }`. Scoring tolerates case and 1–2 wrong letters,
but **every digit sequence must match exactly**. `accept` lists real alternative forms: "10.10", "10:10 Uhr",
"zehn nach zehn" for "10:10"; the number without spaces; "Türkei" for "türkisch"; the short form when the note
asks for one word ("Apotheke" for "vor der Apotheke"). `correct` is what fits the note line (one word or number).

### Hören (15 items + 3 Beispiele, ~18 min track)

| Teil | Blocks (id suffix) | Items | Item type | Plays | `sound` | Script |
|---|---|---|---|---|---|---|
| 1 | `t1-bsp`, `t1-01`…`t1-05` | 0, 1–5 | `gap`, `sheet: "Notiz"`, one typed field per note | 2 | `beep` | phone message / recorded announcement, 1 voice, 25–100 words |
| 2 | `t2-bsp`, `t2-01`…`t2-05` | 0, 6–10 | `choice` a/b/c | 1 | `radio` | radio item, 1 voice, 25–100 words |
| 3 | `t3-01` (one block) | 0, 11–15 | `match`: 9 options a–i (`ads` with `title: ""`), situations = 6 people incl. the Beispiel; `noMatch: false`; `exampleAnswers: [<letter>]` | 2 | none | one conversation, 2 voices, 280–420 words |

- Hören 1 note: `parts` = a 2–3-line note as strings ("Zahnarzt Dr. Hartmann\nTermin am Mittwoch fällt aus\nneuer
  Termin: Freitag, ", gap, " Uhr"). The note gives context; the gap asks for one word or number the message says.
- Hören 2: the five radio items of one station: programme preview, weather, traffic, listener greeting, quiz /
  competition. Prompt + three short options.
- Hören 3: two people talk about five people + the Beispiel person; each person maps to one of 9 places / days /
  things; 3 options stay unused. The Beispiel's answer comes first in the conversation.
- `display.clip`: `{ plays, situation, speakers, segments: [] }`; `audio.ts` fills `src` and `duration`. Speaker
  names: roles ("Praxis", "Radio", "Freundin") or first names in Teil 3.
- `key.script`: `[{ speaker, voice, text, delivery }]`; numbers written as words, as spoken.

### Lesen (15 items + 3 Beispiele)

| Teil | Block | Items | Item type | Text |
|---|---|---|---|---|
| 1 | `t1-01` | 0, 1–5 | `choice`: a and b = two floors, c = `"anderes Stockwerk"` (always last) | store directory, `reading: { sender: <store>, source: "Wegweiser", paragraphs: one line per floor }`, 55–110 words |
| 2 | `t2-01` | 0, 6–10 | `rf` | people news article: headline paragraph + 3–4 paragraphs, `source: "Zeitung"`, 120–180 words |
| 3 | `t3-01` | 0, 11–15 | `match` with 8 `ads` (a–h, `title` + `text`), `noMatch: true`; exactly one situation is `x` | website teasers / small ads on one theme, 110–200 words in total |

Instructions name the item range and, in Teil 3, the x rule. In Teil 1 at least two items need a floor that is
**not** a or b (key c), and every option floor must exist in the directory.

### Schreiben

| Teil | Block | Shape |
|---|---|---|
| 1 | `t1` | `reading` = the person's documents and a short profile (`sender`, `source` e.g. "Pass und Notiz"); `items` = **one** `gap` with `sheet: "Formular"`: title line, then `"Label: "` strings and fields separated by `"\n"`; given fields are printed filled in. Field 0 is the Beispiel (`{ n: 0, options: [] }`, solution in `exampleAnswers`); fields 1–5 typed. Real form labels only ("Geburtsdatum", "Staatsangehörigkeit", "Beruf", "Interessen"). |
| 2 | `t2` | `writing: [{ key: "A", title, situation, points: [4 points] }]` (candidate picks 3); `key.writing: [{ key: "A", register, modelAnswer }]` |

Teil 1: the instruction says *you* help a friend/acquaintance ("Sie helfen ihr bei der Anmeldung"). Each answer is in
the text; at most one or two fields carry a near-miss (a second phone number, a former job). Teil 2: ~40 words, 1–2
sentences per chosen point, greeting and closing; reply to an invitation or a personal message. `register`
`"informell"` (du) or `"formell"` (Sie), used consistently; model answer 35–55 words covering 3 points.

### Sprechen (pair exam: *du* + partner + examiner)

Blocks `t1`, `t2`, `t3`, `phase` `"1"`, `"2"`, `"3"`. `display.speaking = { data, people, turns }`,
`key.speaking = { voices: { pruefer, partner }, sampleAnswers }`, `key.live = { persona, followups?, partnerLines? }`.

| Teil | Turns (in order) | du turns |
|---|---|---|
| 1 | examiner greets, names her colleague, models an intro → du intro (45 s) → 2 examiner follow-ups (`"live": "followup"`), du answers (20 s each) → partner intro → 2 examiner questions to the partner + her answers → examiner closes | 3 |
| 2 | examiner names the topic, asks both to draw 3 cards (one "…?"), models a question with her own card **to both** → du answers it (15 s) → partner answers it briefly → examiner: start → 3 rounds: du asks (10 s) → partner answers (**live**) → partner asks from her card → du answers (20 s) → examiner closes | 7 |
| 3 | examiner sets the task → du proposes (25 s) → partner reacts + own idea (**live**) → … alternating, 25 s each … → **examiner intervention** asking when and where exactly → du gives the result (20 s) → partner confirms briefly (**live**) → examiner ends the exam | 6 |

- `key.live.followups` (Teil 1): a bank of 5 A2 questions `{ text, level: "A2", sample }`; the two scripted
  follow-up turns are the first two.
- Teil 2 `data.cards`: du's three cards `"<topic> · Was …?"`, `"… · Wann …?"`, `"… · …?"`. The partner's cards and
  fixed questions are in the persona. The examiner's example card differs from all six (set 1: "Wie lange …?").
- Teil 3 `data.points`: du's mind map (4 ideas + "?"); the partner's sheet is in the persona as
  `Blatt von <Name>: …` with her preferences per idea, her free days, and that she never sums up.
- **Live partner turns** (`"live": "partner"`): every partner turn that answers or reacts to the candidate (Teil 2
  answers, all Teil 3 turns). The text is only the fallback if generation fails, so it must be **neutral**: no "Ja,
  gut" or "Das finde ich auch" that assumes what the candidate said; in Teil 2 answer the card's W-word
  generally ("Unter der Woche esse ich spät, so um acht Uhr …"); in Teil 3 bring in her own idea and a question.
  List the same texts, in order, in `key.live.partnerLines`.
- Partner turns that are her **own** questions (Teil 2) stay scripted.
- Examiner: *Sie*; the candidates say *du* to each other. du hints in du-form with `seconds`.
- `sampleAnswers`: one short A2 model per du turn, in order.

## 3. Text types and situations (from the blueprint)

| Skill · Teil | Text types | Situations that fit (vary them) |
|---|---|---|
| Hören 1 | answerphone, recorded info line | practice / office / workshop / employer / friend / timetable or cinema info; the gap is a time, day, place, number, thing to bring |
| Hören 2 | radio | one station: programme, weather, traffic, greeting, quiz |
| Hören 3 | conversation | colleagues, neighbours, family planning: who gets / goes / does what |
| Lesen 1 | directory | department store, shopping centre, town hall, hospital, adult-education centre |
| Lesen 2 | people news | someone who learned something for a role, a record, an unusual job, a local person |
| Lesen 3 | ads on one theme | housing, leisure, courses, services, travel, family |
| Schreiben 1 | form | registration (library, sports club, doctor's practice, course), order, application; **not** the online language school (official) |
| Schreiben 2 | letter | reply to an invitation or a friend's message |
| Sprechen 2 | topics | Essen und Trinken, Wohnen, Freizeit, Einkaufen, Arbeit, Feste; **not** Tagesablauf (official) |
| Sprechen 3 | plans | free time together, a day trip, a party, a visit; **not** a new hobby or a present for a course friend (official) |

## 4. Voices and casting

Voice keys only from `data/tts-voices.json`. **DE voices only.**

- Narrator `man_mark`: framing only (rendered by `audio.ts`), never in a script.
- Hören 1: one voice per message, gender matching the role, rotate across the five.
- Hören 2: one presenter voice for the station's items (+ another voice for weather or traffic is fine).
- Hören 3: two different voices, matching gender.
- `woman_kathi` (`de-learner`) only for people who came to Germany themselves (a friend's message), never an
  announcement, office or examiner.
- Sprechen: examiner `woman_ela`, partner `woman_kathi`: a woman who came to Germany herself, plausibly from Eastern
  Europe ("Frau <Surname>", "Ihre Partnerin"). Max one small learner error per line, always understandable.
- Plan casting per set: the last Hören clip should not be Ela or Kathi.

## 5. Hören pace and track

- Pace measured on the official MP3: Teil 1 ~160, Teil 2 ~160, Teil 3 ~175 words/min after tempo correction
  (`LEVEL_PACE` in `scripts/modelltest/audio.ts`; at most ×1.25 speed-up). Official total 18:23.
- Track: jingle + "Teil n" + instruction per Teil; per text "Beispiel"/"Nummer n", ~7 s reading, the clip, chime and
  repeat where played twice, ~16 s to answer; Teil 3 is one conversation for items 11–15 (Beispiel included).
- Render (Hannes approves the cost): `npx tsx --env-file=.env.local scripts/modelltest/audio.ts --exam telc-a2 --set n`
  and `… --skill sprechen`. Never edit a script after rendering without re-rendering it.

## 6. Quality rules (from the set 1 reviews)

1. **Paraphrase.** Situations and statements never repeat the source's key words ("Sie brauchen mehr Licht" for
   "Lampen"; "musste die Fahrprüfung nur einmal machen" for "beim zweiten Versuch bestanden").
2. **Distractors in only 2–3 of 5 texts per Teil.** The rest are plain; not every message corrects itself.
3. **Unambiguous keys.** No quotes or opinions that can be read two ways (set 1 had "richtig cool": cool about the
   role, or about the father?). Name who thinks what.
4. **Natural German** at A2: everyday words, short subordinate clauses (weil, dass, wenn) allowed.
5. **Numbers exact** across script, note, key, explanation and `accept`.
6. **Not close to official situations** (§9), not even re-skinned.
7. Sprechen fallbacks neutral; examiner intervention in Teil 3; the partner never sums up.
8. Typed answers: one word or number; every plausible right form in `accept`, nothing wrong in it.

## 7. Check

```bash
npx tsx scripts/modelltest/check-start.ts --exam telc-a2 --set n            # whole set
npx tsx scripts/modelltest/check-start.ts --exam telc-a2 --set n --skill sprechen
```

It checks items, numbering, Beispiele, keys (one per item, one correct option, typed gaps answered, `accept` sane,
match letters used once), play counts, voices (exist, DE, gender, A ≠ B, examiner ≠ partner, no learner voice in
announcements), word counts, Sprechen turns (du count, live partner turns + `partnerLines`, persona, Teil 3
intervention), names/places repeated across the skills of the set, and the 6-word overlap with
`.unit-cache/official-telc-a2/*.txt`. Fix every hit (stock phrases such as the Teil 1 keyword sheet are allowed).
Then an independent review against the official Übungstest before Hannes reviews.

## 8. Seed and review

```bash
npx tsx --env-file=.env.development.local scripts/modelltest/seed.ts --exam telc-a2 --skill <skill> --set n
```

Local only; Hannes seeds production. Review in `/admin/modelltests`. Drafts stay `status: "draft"`.

## 9. Do not reuse

**Official Übungstest (2017 = 2024 content; paraphrased):**
- Hören 1: car pick-up time at a garage (example), directory-enquiries phone number, friend cancels an evening
  meeting, computer-course meeting point (entrance), train Frankfurt → Köln price, employer asks to come in on two days.
- Hören 2: time signal, children's programme at 15:00, weather tomorrow (rain/thunder), animal on the motorway,
  birthday greeting from family, competition prize = a trip.
- Hören 3: boss shows a new intern round the company (person → place in the building).
- Lesen 1: department store (umbrella, book for a niece, travel guide, lost wallet, soap, sunglasses).
- Lesen 2: pop singer's wedding in Las Vegas, mother-in-law. Lesen 3: travel / study / jobs in Germany websites.
- Schreiben 1: online language-school registration for a Chilean doctor. Schreiben 2: wedding invitation (Berlin).
- Sprechen 2: Tagesablauf (example card "Wie oft …?"). Sprechen 3: new hobby; 2017: present for a course friend.

**Free test** (`data/gratis-test/telc-a2`): Miriam/Jana cinema, Yilmaz/Kröger Gartencenter, Radio Weserwelle,
Bavaria weather, A7 Hamburg, Kaufhaus Brenner, Lena Brandt café, Schwimmschule/Fahrradladen ads, Timo's move,
partner Tomasz, topic Einkaufen, picnic/Flohmarkt.

**Sets used** (add a row per finished set):

| Set | Hören | Lesen | Schreiben | Sprechen |
|---|---|---|---|---|
| 1 | dry cleaner (coat), dentist moves appointment, friend's new meeting point (Apotheke), rail info Ulm → Bremen, first day at Wendt Logistik (safety shoes), vet closed (clinic number); Radio Mainland: town festival, mobile-contract show, weekend weather, town run Offenbach, listener retires, quiz; Christmas presents for Daniel's family | Kaufhaus Sonnenhof directory; actor Jonas Kraus learns to drive a bus; housing ads (Transporter, Mieterverein, repair café, WG rooms) | library card for Leyla Aydin (Osnabrück); bike tour to the Kiessee | Ioana Marin (Romania, Freiburg, hotel cook); Essen und Trinken; holiday at home in Freiburg (zoo, museum, boat, climbing / city tour, minigolf, Straßburg, bowling) |

## 10. Drafting brief (per set)

> You draft **telc Deutsch A2 Modelltest {n}** (all four skills = Prüfungssimulation {n}) for deutschtest-ueben.de.
> Read `research/telc-a2-authoring.md` (this file), `research/telc-a2.md` and CLAUDE.md §2–§4, §8. Copy the JSON
> shape of `data/modelltest/telc-a2/*-01.json` exactly.
> 1. Write the plan for set {n} (§1): every item with situation, names, tested detail, key and voice; the Sprechen
>    persona, card sets and both mind maps; the cross-skill name/place/theme check. Nothing from §9.
> 2. Draft `data/modelltest/telc-a2/{hoeren,lesen,schreiben,sprechen}-{NN}.json`, `status: "draft"`,
>    `generated.model` = your model id. Natural A2 German; balanced keys; paraphrased statements; distractors in
>    only 2–3 of 5 texts per Teil; typed answers with `accept`; neutral live fallbacks for the partner.
> 3. Run `npx tsx scripts/modelltest/check-start.ts --exam telc-a2 --set {n}` until it prints `ok`.
> 4. Report: the plan, the checker output, anything unsure as `TODO(hannes):`. Do not render audio, seed or commit.
