# Goethe-Zertifikat A2 — format blueprint

| | |
|---|---|
| **Exam** | Goethe-Zertifikat A2 (adults). Youth variant: Goethe-Zertifikat A2: Fit in Deutsch |
| **Level** | CEFR A2 |
| **Provider** | Goethe-Institut e. V. (sole developer since 2015; it replaced the joint "Start Deutsch 2") |
| **Audience** | Adults, recommended from 16. Under 16: Fit in Deutsch (12–16) |
| **Total duration** | 90 min written (Lesen 30 + Hören ~30 + Schreiben 30, no breaks) + 15 min Sprechen (pair) = ~105 min |
| **Delivery** | Paper or digital (written sections on a test platform; Sprechen stays face-to-face). *Corrected 2026-10-24: G1 (Stand 1 Sep 2025) describes only the paper flow; it mentions "digital" only for examiners' rating input (G1 p. 10). The digital format is `TODO(hannes): unverified`.* |
| **Stand** | 10/2026, all facts checked 2026-10-12, re-verified part by part 2026-10-24 (§11) |

Sources are numbered in §7. Format only. No exam texts, items or audio scripts are reproduced here (CLAUDE.md §4).

---

## 1. Merge verdict: **do not merge** with telc Deutsch A2

Companion file: [`telc-a2.md`](telc-a2.md) (same verdict, same evidence).

**What happened to "Start Deutsch 2":** Start Deutsch 2 was developed jointly by the Goethe-Institut and telc. Goethe's own Übungssatz says the Goethe-Zertifikat A2 was developed by the Goethe-Institut and **has replaced Start Deutsch 2 since 2015** [G3]. Goethe no longer offers Start Deutsch 2. telc still sells the old joint format as "telc Deutsch A2 (Start Deutsch 2)". Its 2024 Übungstest still says it was developed jointly with Goethe [T2]. The two exams have since diverged.

**Evidence: the formats differ on every axis we model.**

| | Goethe-Zertifikat A2 | telc Deutsch A2 (Start Deutsch 2) |
|---|---|---|
| Written time | 90 min: Lesen 30 · Hören ~30 · Schreiben 30 [G1] | 70 min: Hören ~20, then Lesen + Schreiben 50 combined [T2] |
| Hören | 4 Teile · 20 items [G1][G3] | 3 Teile · 15 items [T2] |
| Lesen | 4 Teile · 20 items [G1][G3] | 3 Teile · 15 items [T2] |
| Schreiben | 2 free texts (20–30 + 30–40 words) [G3] | Form (5 fields) + one letter of ~40 words [T2] |
| Sprechen | T1 card Q&A · T2 monologue + examiner questions · T3 plan together [G1] | T1 introduce yourself · T2 question-card conversation · T3 negotiate [T2] |
| Scoring | 4 × 25 = 100. Pass 60, with at least 45/75 written and 15/25 oral [G1] | 4 × 15 = 60. Pass at 60 % = 36 [T2] |
| Play counts | T1 2× · T2 1× · T3 1× · T4 2× [G3] | T1 2× · T2 1× · T3 2× [T2] |

The overlap is only at the level of single task types: an info-board "which floor" task, radio/phone clips and a pair planning task. Item counts, timings, answer formats, writing tasks and scoring all differ. A merged mock would be unrealistic for both audiences, which breaks the USP (CLAUDE.md §2). The two exams can share **item-type components** (e.g. one "Wegweiser a/b/anderes Stockwerk" renderer), but they need **separate blueprints**.

**Fit in Deutsch:** the Durchführungsbestimmungen cover both exams and state that **they have the same format** [G1]. The Fit Modellsatz has the same parts, items, play counts and word limits. Only the topics (teen life) and the address form (du instead of Sie) differ [G4]. A Fit variant is therefore a content skin on this blueprint, not a separate format.

---

## 2. Hören (~30 min, 20 items, 25 points)

Candidates mark answers on the task sheet first, then transfer them to the Antwortbogen. About 3 minutes of the section are set aside for this [G1 p. 5]. The audio file contains all instructions, pauses and transfer time [G1 p. 3]. *(Corrected 2026-10-24: "the digital exam has no transfer step" is not in G1; unverified.)*

| Teil | Task | Text type / situation | Length | Items · answer format | Plays | Time | Source |
|---|---|---|---|---|---|---|---|
| 1 | Pick the right detail from five separate short texts | Radio (event info, weather, call-in game), answering-machine messages, announcements (train, venue) | **43–64 words** each (ÜS 43–64, MS 47–50), monologue, ~17–21 s of speech | 5 · a/b/c (text) | **2×** | in ~30 | [G2][G3] |
| 2 | One connected conversation: match each slot (a day) to what the people did or plan | Dialogue between a woman and a man about a past trip or a planned week | **~220–250 words incl. example** (ÜS 246, MS 221), 2 voices | 5 · match to **9 pictures** a–i (each letter once; 1 used by the example, 3 distractors) | **1×** | in ~30 | [G2][G3] |
| 3 | Five short separate conversations, one question each | Everyday dialogues, mostly phone calls (shopping, appointments, repairs, work) | **42–66 words** each, 2 voices | 5 · a/b/c, **picture options in all 10 items of both sets** (the spec allows "Bild/Text") | **1×** | in ~30 | [G2][G3] |
| 4 | One interview: are the statements right? | Radio interview (presenter + guest) about the guest's life or project | **~195–215 words incl. example** (ÜS 214, MS 193), 2 voices | 5 · Ja/Nein | **2×** | in ~30 | [G2][G3] |

Lengths are word counts of the ÜS and MS transcripts (corrected 2026-10-24; were "~260 / 65–75 / ~230"). They are not official specs. Teil 2 and Teil 4 open with a worked example (Beispiel 0), played as its own clip before "Sie hören jetzt den Text" [G2 audio]. Measured timings: §11.2.

**Instruction style (paraphrased):** a short lead sentence stating what you hear and how often ("five short texts, each played twice"). Then which items to answer and the format (a/b/c, picture letter, Ja/Nein). Teil 2 adds "use each letter only once; look at the pictures now". Teil 4 adds "read the statements now". Formal *Sie*, about 2–3 sentences.

---

## 3. Lesen (30 min, 20 items, 25 points)

Answers are transferred to the Antwortbogen, with about 3 minutes set aside for this (paper) [G1 p. 5]. The online Modellsatz says Teil 4 answers go straight onto the answer sheet [G2]; the paper sets transfer all four Teile at the end [G3 S. 5].

| Teil | Task | Text type / situation | Length | Items · answer format | Plays | Time | Source |
|---|---|---|---|---|---|---|---|
| 1 | Understand information and opinions in a media text | Newspaper/magazine article about people or a project | **~180–220 words incl. headline** (ÜS 220, MS 183; corrected from "200–250") | 5 · a/b/c (options paraphrase the text) | – | in 30 | [G2][G3] |
| 2 | Where do you go for X? | Information board: **store directory** (MS, 6 levels) or **event programme** (ÜS, 5 halls with time slots) | Directory ~120 words; programme ~200 words (corrected from "~200–240") | 5 · a / b (two named places) / c "**anderer Stock**" or "**andere Halle**" | – | in 30 | [G2][G3] |
| 3 | Understand personal correspondence | Informal email to a friend | ~250 words | 5 · a/b/c | – | in 30 | [G2][G3] |
| 4 | Match people to ads | Six short internet ads a–f, five people with needs (+ example) | ~220 words of ads in total | 5 · letter a–f. The example's ad is not reusable; **one person has no match → X** | – | in 30 | [G2][G3] |

**Instruction style (paraphrased):** a situation line ("You read this text in a newspaper", "You are at a trade fair"). Then which items to solve and the format. Teil 4 states that one task has no solution (mark X) and that the example's ad can't be reused.

---

## 4. Schreiben (30 min, 2 tasks, 20 raw points → ×1.25 = 25)

| Teil | Task | Text type / situation | Length | Items · answer format | Plays | Time | Source |
|---|---|---|---|---|---|---|---|
| 1 | Personal message to keep in touch: cover **3 given points** (e.g. apologise, give a reason, propose something new) | SMS / short message to a friend, **informal (du)** | **20–30 words** | 1 · free text · 10 raw points | – | in 30 | [G2][G3] |
| 2 | Semi-formal message to regulate something: cover **3 given points** (e.g. thank/confirm, mention a detail, ask a question) | Email to a boss, hotel or institution, **formal (Sie)** | **30–40 words** | 1 · free text · 10 raw points | – | in 30 | [G2][G3] |

**Criteria per task** (A–E scale): *Aufgabenerfüllung* (speech functions covered + register) and *Sprache* (range and control of coherence, vocabulary, structures), each 5 / 3.5 / 2 / 0.5 / 0 [G3]. E for Aufgabenerfüllung zeroes the task. So does fewer than 50 % of the word count (under 10 words in T1, under 15 in T2) or missing the topic [G2][G3]. Two independent raters score; the mean is taken. A third rater is called when the two straddle the 12-point pass line and the mean falls below it [G1].

**Instruction style (paraphrased):** a 2–3 sentence situation, then three bullet points, "write 20–30 / 30–40 words", "write about all three points".

---

## 5. Sprechen (~15 min per pair, 25 points)

Normally a **pair exam**. In exceptional cases it is taken alone, in 10 min, with an examiner as partner. There is **no preparation time** [G1]. Examiners give ~20 s to look at cards or task sheets before each Teil [G3]. The intro chat (~1 min) is not scored [G1].

| Teil | Task | Format | Materials | Time | Points (per candidate) | Source |
|---|---|---|---|---|---|---|
| 1 | Exchange personal information: candidates take turns asking **4 questions** from keyword cards and answering the partner's 4 | Interaction, **pair** | 4 cards each, topic "Fragen zur Person", one keyword per card (e.g. birthday, home town, job, hobby) | ~3 min | Aufgabenerfüllung 2 + Sprache 2 = 4 | [G1][G2][G3] |
| 2 | Talk about your own life using a card with a question + 4 keyword prompts. The examiner then asks **1–2 follow-up questions** | Production, **solo**, partner listens. A and B get different cards | 1 card per candidate | ~3 min per candidate | 4 + 4 = 8 | [G1][G2][G3] |
| 3 | Plan something together: ask questions, make suggestions, react | Interaction, **pair**. A and B have **different** sheets | Either two different appointment calendars (find a common slot) or a mind map with prompts + a "…?" branch (e.g. plan a party) | ~5 min | 4 + 4 = 8 | [G1][G2][G3] |
| – | Pronunciation (whole exam) | – | – | – | 5 | [G3] |

Total: 4 + 8 + 8 + 5 = 25. Two examiners score independently; the mean is rounded [G3][G1].

**What the partner does (for TTS simulation):**

- **Teil 1:** the partner asks 4 questions built from *their own* keyword cards and answers the candidate's 4 questions. It's strictly alternating: A asks → B answers, then B asks → A answers. The moderator shows one example first [G1][G3]. TTS partner: 4 short questions (one per hidden keyword) plus 4 short answers in A2-level first person.
- **Teil 2:** the partner is silent. The **examiner** (a second TTS voice) reads the card's question, listens, then asks 1–2 follow-up questions tied to what was said [G3]. Simulating the follow-ups needs either generic follow-ups per card or a short model step. Keep follow-ups scripted per card for v1.
- **Teil 3:** a genuine negotiation. The partner proposes, accepts, rejects with a reason ("da kann ich nicht, da …"), and suggests alternatives from **their own** calendar or mind map, which the candidate cannot see. They must end on an agreement [G1][G2]. TTS partner: a branching script over the partner's hidden calendar (busy/free slots) so the candidate's proposals get a correct "yes/no + reason".

**Criteria:** Aufgabenerfüllung (speech function, interaction, register) and Sprache (range, control), plus Aussprache (melody, stress, sounds) across all parts. E for Aufgabenerfüllung zeroes that Teil [G3].

---

## 6. Scoring and pass rule

- Lesen 20 items and Hören 20 items, 1 point each, × 1.25 → 25 each. Schreiben 20 raw × 1.25 → 25. Sprechen 25 [G1].
- **Pass:** at least **60 / 100 overall**, all parts taken, **and at least 45 / 75 in the written exam (Lesen + Hören + Schreiben) and at least 15 / 25 in Sprechen**. Otherwise the whole exam is failed [G1].
- Grades: 100–90 sehr gut · 89–80 gut · 79–70 befriedigend · 69–60 ausreichend · 59–0 nicht bestanden [G1].
- Not modular. Exceptional partial retakes (oral only or the whole written part) are possible within one year at the same centre, with no right to them [G1].
- **Product implication:** unlike the DTZ, this *is* a pass/fail exam, so a mock may show "bestanden / nicht bestanden" plus points. It must apply the **two-part rule** (45/75 written + 15/25 oral), not just 60 %.

---

## 7. Kurztest composition (proposal)

This mirrors the DTZ cut in `lib/exam/blueprint.ts`: about 10 items per closed skill, every Teil present in real proportion, the real answer formats and play counts, 1 writing task and all speaking parts. The real exam weights its Teile equally (5 items each), so the cut is 2–3 per Teil.

**Lesen (10 items)**

| Teil | Blocks | Items/block | Notes |
|---|---|---|---|
| 1 | 1 article | 3 | full ~200-word text, 3 a/b/c |
| 2 | 1 info board | 2 | keep the "andere(s) Stockwerk" option |
| 3 | 1 email | 3 | ~250 words |
| 4 | 1 ad set (6 ads) | 2 | keep the X option live: one of the two may have no match |

**Hören (10 items)**

| Teil | Blocks | Items/block | Plays | Notes |
|---|---|---|---|---|
| 1 | 2 clips | 1 | 2× | mix of radio + answering machine |
| 2 | 1 conversation | 3 | 1× | picture matching; still show ≥ 6 pictures so guessing stays hard |
| 3 | 2 short dialogues | 1 | 1× | one with picture options |
| 4 | 1 interview | 2 | 2× | Ja/Nein |

**Schreiben:** Teil 2 (formal email, 30–40 words, 3 points). It is the harder register and the more representative task. Teil 1 (informal SMS, 20–30 words) is the alternative if we want the lightest possible lead magnet.

**Sprechen:** all three Teile with a TTS partner and a TTS examiner. T1: 2 questions asked + 2 answered (half of the real 4 + 4). T2: one card + 1 examiner follow-up. T3: calendar planning against a hidden partner calendar.

**Result:** show indicative points per section and the two-part pass rule as an *estimate*, never as an official result.

---

## 8. Drift in TestGerman's Goethe A2 mocks (`testgerman/a2/pruefungssimulation/goethe/`, `mock-exams.md`)

| Area | TestGerman | Official | Verdict |
|---|---|---|---|
| Hören play counts | T1 2×, T2 1×, T3 1×, T4 2× | same [G3] | OK |
| Hören T2 | matching from 9 options | 9 **pictures** a–i [G2] | text instead of pictures |
| Hören T3 | a/b/c text | picture **or** text options [G3] | no picture options |
| Lesen T1 length | 175–186 words | ~180–220 (MS 183, ÜS 220) [G3][G3b] | OK *(corrected 2026-10-24; was "too short")* |
| Lesen T4 | 6 ads a–f + X, **no example**, 5 scored people, one X | 6 ads a–f, example consumes one, one X [G3] | example missing *(corrected: "7 ads" was a–f plus the x option)* |
| Schreiben | prompt has **3 points** and 20–30 / 30–40 words; AI scores 5 checks (min. words, "structure", 3 points); 750-char box | **3 points**, **20–30 / 30–40 words**, AE + Sprache A–E [G3] | prompt OK, scoring not official *(corrected: "5 content points")* |
| Sprechen | 8 solo cards, 2 two-minute monologues, 6 scripted partner lines for "plan" (30 s each) | 4 + 4 pair Q&A, 1 monologue + examiner Qs, ~5 min negotiation with a hidden partner sheet [G1][G3] | no partner, wrong structure |
| Pass rule | scoring policy: written group 75 with 60 %, speaking 60 %, total 60 (`all_groups`) | 60/100 **and** 45/75 written **and** 15/25 oral [G1] | OK *(corrected 2026-10-24; was "missing the two-part rule")* |

Full re-measurement with scores: §11.4.

---

## 9. Open items

- `TODO(hannes): unverified — whether Goethe centres in Germany run A2 on paper or digitally by default. G1 has rules for both, but it doesn't say which is standard where.`
- ~~Hören Teil 2 picture count~~ **Resolved 2026-10-24:** 9 pictures a–i in both sets; the example's picture is marked on the sheet and the answer key uses each of the other letters at most once, leaving 3 distractors (§11.1).
- `TODO(hannes): unverified — the per-Teil time for Hören/Lesen is not specified officially (only 30 min per section). Our runner should use one section timer, not per-Teil timers.`
- `TODO(hannes): unverified — the official spec for Lesen Teil 2 length is not stated. Measured 2026-10-24: store directory ~120 words (MS), trade-fair programme ~200 words (ÜS).`

---

## 10. Sources (all checked 2026-10-12)

- **[G1]** Goethe-Institut, *Durchführungsbestimmungen Goethe-Zertifikat A2 und Goethe-Zertifikat A2 Fit in Deutsch*, Stand 1 Sep 2025 (bilingual DE/EN). https://www.goethe.de/pro/relaunch/prf/en/Durchfuehrungsbestimmungen_A2.pdf
- **[G2]** Goethe-Institut, accessible online Modellsatz A2 (Hören, Lesen, Schreiben, Sprechen pages). https://bfu.goethe.de/a2_mod_2MX5/hoeren.php · …/lesen.php · …/schreiben.php · …/sprechen.php
- **[G3]** Goethe-Institut, *Goethe-Zertifikat A2 Übungssatz 01 Erwachsene* (© 2020, 1st ed. Jan 2021), incl. the Vorwort ("löst seit 2015 die Prüfung Start Deutsch 2 ab"), the Prüfungsteile overview, the Prüferblätter and the rating sheets. https://www.goethe.de/pro/relaunch/prf/materialien/A2/A2_Uebungssatz_Erwachsene.pdf
- **[G3b]** Goethe-Institut, *Goethe-Zertifikat A2 Modellsatz Erwachsene* (© 2016), used to cross-check play counts and word limits. https://www.goethe.de/pro/relaunch/prf/materialien/A2/A2_Modellsatz_Erwachsene.pdf
- **[G4]** Goethe-Institut, *Goethe-Zertifikat A2 Fit in Deutsch Modellsatz Jugendliche* (2nd ed. Feb 2021; ages 12–16). https://www.goethe.de/pro/relaunch/prf/materialien/A2_fit/A2_Modellsatz_Jugendliche.pdf
- **[T2]** telc gGmbH, *Übungstest 1 Start Deutsch 2 / telc Deutsch A2*, 10th ed. 2024 (for the comparison). https://shop.telc.net/media/catalog/product/file/t/e/telc_deutsch_a2_uebungstest_1-1_20241212_5090-b00-010107.pdf
- Competitor (structure only, AI-made, not a fact source): `testgerman/mock-exams.md` › Goethe A2; `testgerman/a2/pruefungssimulation/goethe/`.

---

## 11. Verification 2026-10-24

Re-checked part by part before drafting Modelltest set 1. Sources read in full on 2026-10-24:

- **[G3] ÜS** = Übungssatz 01 Erwachsene (PDF Vs0.6_050526, © 2020), downloaded from the URL in §10. Cites use its printed page numbers ("S.").
- **[G3b] MS** = Modellsatz Erwachsene (PDF Vs5.1_050525, © 2016). Same printed page layout as ÜS.
- **[G1]** Durchführungsbestimmungen A2, Stand 1 Sep 2025. Cites use PDF pages ("p.").
- **[G2]** online Modellsatz (bfu.goethe.de/a2_mod_2MX5/…): **the same set as MS**, incl. its 13 audio clips (`/medien/a2_2005/audio_a2_*.mp4`), downloaded and measured (§11.2).
- **Not reachable:** the ÜS audio. goethe.de material pages return 403 to scripts, guessed file URLs return 404, and the browser tool could not connect. `TODO(hannes): download the Übungssatz 01 MP3s by hand (goethe.de › A2 › Übungsmaterialien) so we can measure the exam master with its instructions and pauses.`

Answer letters are not reproduced here; key patterns and every official situation (paraphrased) are in [`goethe-a2-official-situations.md`](goethe-a2-official-situations.md).

### 11.1 Claim → verdict, per Teil

**Whole exam**

| Claim in this file | Verdict | Cite |
|---|---|---|
| Written 90 min with no breaks: Lesen 30 · Hören ca. 30 · Schreiben 30 | Confirmed. Recommended order **Lesen → Hören → Schreiben**; centres may change it | G1 p. 4 |
| ~3 min answer transfer inside Lesen and inside Hören | Confirmed (paper) | G1 p. 5 |
| Digital delivery without transfer step | **Not in G1** → unverified (body corrected) | G1 p. 3–11 |
| Audio file contains texts, instructions, pauses and transfer times | Confirmed (new detail) | G1 p. 3 |
| Sprechen materials are independent of the written set | **New:** Sprechen materials "can be combined freely" with any written set | G1 p. 3 |
| Replaced Start Deutsch 2 in 2015; from 16 | Confirmed | ÜS S. 2 |

**Hören** (ÜS S. 15–19, 33–36; MS same)

| Teil | Claim | Verdict | Cite |
|---|---|---|---|
| 1 | 5 short texts, each **2×**, a/b/c text | Confirmed, both sets | ÜS S. 16, MS S. 16 |
| 1 | ~45–65 words | Corrected to **43–64** (ÜS 43–64, MS 47–50) | ÜS S. 33, MS S. 33 |
| 1 | Instruction | "Five short texts, each heard twice. Choose a, b or c for items 1–5." **No example.** Question stems: W-question or "Weil …" completion | ÜS S. 16 |
| 2 | 1 dialogue, **1×**, 9 pictures a–i, each letter once, example uses one | Confirmed. Example in column 0 of a day grid with its letter filled in; picture crossed on the sheet. 3 distractors, each an activity the speakers mention but don't do | ÜS S. 17, S. 32; MS S. 17 |
| 2 | ~260 words | Corrected to **~220–250 incl. example** (ÜS 246, MS 221) | ÜS S. 34, MS S. 34 |
| 2 | Instruction | "You hear a conversation once." + content question (past trip / plans for the week) + "Choose a picture a–i for 6–10. Use each letter once. Look at the pictures now." Slots are **days** in both sets (Fri→Wed, Mon→Sat) | ÜS S. 17, MS S. 17 |
| 3 | 5 dialogues, **1×**, a/b/c "Bild/Text" | Confirmed spec, but **all 10 items in both sets use three pictures** and no text. Generate picture options | ÜS S. 3, S. 18; MS S. 18 |
| 3 | ~65–75 words | Corrected to **42–66** | ÜS S. 35, MS S. 35 |
| 3 | Instruction | "Five short conversations, each heard once. Choose a, b or c for 11–15." No example. 3 of 5 are phone calls in both sets | ÜS S. 18 |
| 4 | Interview, **2×**, Ja/Nein, example 0 | Confirmed. Example statement printed with its answer; "Read the tasks now." | ÜS S. 19, MS S. 19 |
| 4 | ~230 words | Corrected to **~195–215 incl. example** (ÜS 214, MS 193) | ÜS S. 36, MS S. 36 |
| all | Section ~30 min incl. ~3 min transfer | Confirmed | G1 p. 4–5 |

**Lesen** (ÜS S. 5–13)

| Teil | Claim | Verdict | Cite |
|---|---|---|---|
| 1 | Press article, 5 × a/b/c, example 0 | Confirmed. Instruction: "You read this text in a newspaper. Choose a, b or c for 1–5." Example sits **under the text**, before item 1 (next page). Stems are mostly sentence starts ("… "), one set has a "Dieser Text informiert über …" item | ÜS S. 6–7, MS S. 6–7 |
| 1 | ~200–250 words | Corrected to **~180–220** (ÜS 220, MS 183, incl. headline) | ÜS S. 6, MS S. 6 |
| 2 | Info board, a / b / c "andere(s) …" | Confirmed with exact options: **c = "andere Halle"** (ÜS) / **"anderer Stock"** (MS); a and b name two places from the board. Example 0 first; the 6 situations come **before** the board text | ÜS S. 8–9, MS S. 8–9 |
| 2 | Form | **Event programme** (ÜS: travel fair, 5 halls with time slots) **or store directory** (MS: department store, 6 levels). Instruction opens with the place ("You are at a travel fair" / "You read the info board in a department store"), then "Where do you go?" / "Which floor?" | ÜS S. 8, MS S. 8 |
| 3 | Informal email ~250 words, 5 × a/b/c | Confirmed (ÜS 257, MS 256). Instruction: "You read an email. Choose a, b or c for 11–15." **No example** | ÜS S. 10–11 |
| 4 | 6 ads a–f, example ad consumed, exactly one X | Confirmed. Instruction: "**Six** people look for X on the internet" (the example person counts) + "Read 16–20 and ads a–f. Which ad fits which person? One task has no solution: mark X. You can't choose the example's ad again." → 4 matches + 1 leftover ad. Ads are website snippets headed by a URL, ~220 words in all (ÜS 218, MS 226) | ÜS S. 12–13, MS S. 12–13 |

**Schreiben** (ÜS S. 22, 37–40; MS S. 22)

| Teil | Claim | Verdict | Cite |
|---|---|---|---|
| 1 | SMS to a friend, du, 3 points, **20–30 words** | Confirmed. Pattern: 1–2 situation sentences + "Write an SMS to <first name>" + 3 imperative dashes + "Schreiben Sie 20–30 Wörter. Schreiben Sie zu allen drei Punkten." | ÜS S. 22, MS S. 22 |
| 1 | Leitpunkt functions | ÜS: **inform** (where you live) · **describe/evaluate** (what you like) · **invite**. MS: **apologise** · **give a reason** · **propose** place + time | ÜS S. 22, MS S. 22 |
| 2 | Email, Sie, 3 points, **30–40 words** | Confirmed. Same pattern with a named addressee (hotel employee / boss) | ÜS S. 22, MS S. 22 |
| 2 | Leitpunkt functions | ÜS: **state purpose** · **inform** (new length of stay) · **ask** (new price). MS: **thank + accept** · **inform** (bringing someone) · **ask** (the way). The 3rd point is a question in both | ÜS S. 22, MS S. 22 |
| both | AE (Sprachfunktion + Register) and Sprache (Spektrum + Beherrschung), each 5/3.5/2/0.5/0; E in AE zeroes the task; E also for < 50 % of words (10 / 15) or off-topic | Confirmed | ÜS S. 37–38 |
| both | 2 raters, mean; 3rd rater if the two straddle 12 and the mean is below 12 | Confirmed | G1 p. 9 |
| both | 20 raw → ×1.25 | Confirmed, **plus: raw points are rounded to whole points before ×1.25** (new) | G1 p. 9 |

**Sprechen** (ÜS S. 23–27, 41–44; MS S. 23–27)

| Teil | Claim | Verdict | Cite |
|---|---|---|---|
| all | Pair, ~15 min, no preparation; single exam 10 min with an examiner as partner | Confirmed | G1 p. 4 |
| all | ~20 s to look at cards/sheets before each Teil | Confirmed | ÜS S. 41 |
| all | Intro ~1 min, not scored; timings T1 ~3 min, T2 ~3 min per candidate, T3 ~5 min | Confirmed | G1 p. 6, p. 8 |
| 1 | 4 cards each, header "Fragen zur Person", one keyword + "?" | Confirmed. Card topics: ÜS **Ausbildung/Studium, Eltern, Musik, Familienname**; MS **Geburtstag, Wohnort, Beruf, Hobby**. Examiner first models one exchange (where your family lives); A asks 4 → B answers, then B asks 4 → A answers | ÜS S. 24, S. 41; MS S. 24 |
| 2 | 1 card each (A and B differ): question in the middle + 4 keyword prompts with "?"; then 1–2 examiner questions | Confirmed. Header "von sich erzählen". Topics: ÜS family activities / going out in the evening; MS money / weekend. The examiner reads the card question aloud and starts with **candidate 2**; follow-ups depend on how much was said | ÜS S. 25, S. 41; MS S. 25; G1 p. 7 |
| 3 | Plan together; A and B have different sheets; calendar **or** mind map | Confirmed: **ÜS = mind map** (party after the German course; 5 different prompts each + "…?"), **MS = calendar** (one Saturday, 7:00–21:00 hourly, 6 entries each, some spanning several hours; essentially one common free hour). Must end on an agreement | ÜS S. 26–27, MS S. 26–27 |
| scoring | Per candidate: T1 AE 2 + Sprache 2; T2 4 + 4; T3 4 + 4; Aussprache 5 = 25 | Confirmed. Steps: T1 2/1.5/1/0.5/0; T2–T3 4/3/2/1/0; Aussprache 5/3.5/2/0.5/0. AE = Sprachfunktion + Interaktion + Register | ÜS S. 42–43 |
| scoring | 2 examiners, mean rounded (≤ .49 down, ≥ .5 up) | Confirmed | G1 p. 10 |

**Result**

| Claim | Verdict | Cite |
|---|---|---|
| L, H, S: 20 points × 1.25 = 25 each; Sprechen 25 | Confirmed | ÜS S. 2; G1 p. 8–9 |
| Pass: ≥ 60/100, all parts taken, **≥ 45/75 written and ≥ 15/25 oral**, otherwise whole exam failed | Confirmed | G1 p. 11; ÜS S. 2 |
| Total rounded to whole points; grades 100–90 sehr gut · 89–80 gut · 79–70 befriedigend · 69–60 ausreichend · 59–0 nicht bestanden | Confirmed | G1 p. 10 |
| Partial retake (oral or whole written) only in exceptional cases, within 1 year, same centre | Confirmed | G1 p. 11 |

### 11.2 Official audio, measured (MS = online Modellsatz clips)

Measured with `ffmpeg silencedetect` (−30 dB; d = 0.5 s for fine gaps, d = 1.5 s for the structural pauses) and word timings from ElevenLabs Scribe (speech span from first to last content word). The online clips are cut per task: **one play each, with no reading pauses or second plays**, so they give clip lengths, internal pauses and speech rate, not the exam-master timeline.

| Teil | Clip file lengths | Words (Scribe) | Speech rate | Structure measured |
|---|---|---|---|---|
| 1 | 18.7 · 20.1 · 21.4 · 22.8 · 28.5 s (sum 111.5 s) | 47–49 per clip | **134–167 wpm** (mean ~155) | Radio items carry **jingles**: intro/outro music (item 1, speech starts at 2.6 s), music + click (weather, 5.8 s), ad jingle (game, 4.5 s). Voicemails start at once (0–0.1 s). One voice per clip; tail silence 0.9–1.6 s |
| 2 | 92.3 s | 220 dialogue words + 2 narrator lines | **~166 wpm** in speech spans | Narrator "Sie hören jetzt das Beispiel." → **1.9 s** → example dialogue (~20 s) → **2.2 s** → narrator "Sie hören jetzt den Text." → **3.2 s** → rest (~60 s). Turn gaps 0.5–1.2 s. 3 voices (narrator, man, woman) |
| 3 | 15.7 · 23.7 · 26.8 · 28.2 · 29.0 s (sum 123.4 s) | 42–64 per clip | **146–181 wpm** (mean ~160) | **Phone ring SFX** before 2 of 5 (speech starts 2.0 s and 4.3 s). Always 2 voices; a man–man pair once |
| 4 | example 18.9 s + main 69.7 s | 29 + 164 | **~160 wpm** | Narrator "Sie hören jetzt das Beispiel." → **3.7 s** → example exchange; main clip: narrator "Sie hören jetzt den Text." → **3.0 s** → interview. 2 voices + narrator (narrator merges with the male interviewer in diarization; can't tell if it is the same actor) |

- **Net audio, one play of everything:** ~416 s (6.9 min). **With the official plays** (T1 and T4 twice): ~616 s (**10.3 min**). The rest of the ~30 min is instructions, reading time, gaps between plays and the ~3 min transfer, which we could not measure.
- Our standard for generation: 145–170 wpm, radio jingle on radio items, phone ring on phone dialogues, narrator lines "Sie hören jetzt das Beispiel / den Text" with ~2–3.5 s after them, separate example clip in T2 and T4.
- `TODO(hannes): measure the ÜS exam master (reading pauses before each Teil, gap between first and second play, transfer block) once the MP3s are downloaded by hand.`

### 11.3 Generation checklist (what this means for set 1)

- Hören T2: 9 picture options a–i; example = slot 0 with its own clip; 3 distractors = mentioned-but-not-done activities; slots = days in dialogue order.
- Hören T3: **3 picture options per item** (all 5 items), no example, mostly phone calls with a ring.
- Lesen T2: alternate the two forms across sets (directory vs programme); option c is "anderer Stock" / "andere Halle" matching the form, right in 1–2 of 5.
- Lesen T4: 6 ads + example person; the X person has a near-miss ad; one ad stays unused.
- Schreiben: 3 imperative Leitpunkte; T1 ends with an invitation/proposal, T2 ends with a question.
- Sprechen T1: 4 + 4 keyword cards ("Fragen zur Person"); T2: one card each, question + 4 prompts, 1–2 examiner follow-ups; T3: alternate calendar (exactly one shared free hour) and mind map (5 prompts + "…?" each, different per candidate).
- Result: points per part, the two-part rule, and the Prädikat; never just a percentage.
- Answer keys: don't force an even a/b/c spread (the official sets don't), but cap runs at 3.

### 11.4 TestGerman vs official, per Teil

Measured from `testgerman/a2/pruefungssimulation/goethe/` (mocks 1 + 2), `data/raw/mock-parts.json` and the scoring policy in `data/raw/mocks.json` (snapshot 2026-10-11/12). Both mocks are tagged `ai-generated-question-set`. Clip seconds are TestGerman's own rounded metadata, so speech rates are approximate.

| Teil | TestGerman (measured) | Official | Gap |
|---|---|---|---|
| H1 | 5 clips, 15–24 s, **27–41 words**, ~86–134 wpm; 2× ✓; text options ✓; a tips block above the items; one voice reads 8 of 10 clips, incl. a message signed by a man's name; no jingles | 43–64 words, 134–167 wpm, jingles on radio items | texts ~40 % too short, mostly one voice |
| H2 | 1 dialogue, 65 s / 210 words (mock 1), 122 s / 386 words (mock 2), ~190 wpm; 1× ✓; **9 text options**, one composite AI image; **no example**, 5 scored slots, 4 distractors; mock 2 matches **people to tasks**, not days; ambient noise track | 220–250 words incl. example, 9 pictures, example uses one, slots are days | no pictures, no example, wrong slot type in mock 2 |
| H3 | 5 dialogues, 16–32 s, 50–92 words, ~114–227 wpm; 1× ✓; **text options only**; 2 voices ✓ | 42–66 words, 3 pictures per item | no picture options |
| H4 | 1 interview, 85 s / 272 words, 104 s / 311 words; 2× ✓; Ja/Nein ✓; example only as text, no example clip; mock 1 names the guest differently in audio and items; mock 2 uses two female voices | 193–214 words, example clip first | ~40 % too long, no narrator/example audio |
| L1 | 175–186 words ✓, 5 × a/b/c ✓, **no example**; items numbered 21–25; mock 2 retells the MS article's storyline | 180–220 words, example 0 | example missing |
| L2 | always a **6-level directory** (town hall, health centre), 83–89 words; c = "andere Etage"; no example | directory (~120 words) **or** event programme (~200); c = "anderer Stock"/"andere Halle"; example 0 | programme form never used, wrong c-label |
| L3 | email 243–260 words ✓, 5 × a/b/c ✓; mock 1 retells the MS email point by point | ~256 words | OK (but cloned) |
| L4 | 6 ads a–f + X ✓, 217–247 words ✓, **no example**, 5 scored people | 6 ads, example consumes one, 4 matches + 1 leftover ad | example missing, so 2 ads are left over |
| S1 | SMS, 3 Leitpunkte ✓, 20–30 words ✓, informal ✓; 750-char box; model answer shown | same | prompt OK |
| S2 | email, 3 Leitpunkte ✓, 30–40 words ✓, formal ✓ | same | prompt OK |
| S scoring | AI: 5 checks of 20 % each (min. word count, "intro/main/close structure", 3 Leitpunkte) | AE + Sprache, A–E steps, < 50 % words = 0, 2 raters | not the official criteria |
| Sp1 | 8 separate 30 s prompts: 4 "ask a question about X" (no answer comes back), 4 TTS questions to answer | 4 + 4 alternating with a partner | no interaction |
| Sp2 | **2 cards per candidate**, 120 s each, keywords as a bullet list, TTS reads the question, **no examiner follow-up** | 1 card each, ~3 min incl. 1–2 follow-ups | wrong count, no follow-up |
| Sp3 | calendar image + 6 fixed TTS partner lines, 30 s reply each; the partner never reacts to what was said | ~5 min negotiation with a hidden partner sheet, calendar or mind map | scripted, no mind-map variant |
| Sp scoring | AI content checks per prompt (1–5 points); no Aussprache | AE + Sprache per Teil + Aussprache 5 | no pronunciation, no official criteria |
| Result | 4 × 25 = 100; policy: written group /75 pass 60 %, speaking pass 60 %, total 60, `all_groups` | 60/100 + 45/75 + 15/25 | **matches** the two-part rule; grade display not seen |

**Scores (0–10, 10 = indistinguishable from the official format):**

| Dimension | Score | Evidence |
|---|---|---|
| Format / structure | **6** | Teile, item counts and section times right; but no Beispiel in L1, L2, L4 or as audio in H2/H4, items numbered 21–40, Sprechen split into 16 prompts |
| Answer formats | **5** | Lesen formats and H1/H4 right; H2 and H3 use text where the official sets use pictures (10 of 20 Hören items) |
| Text types & lengths | **6** | Lesen lengths fit; L2 never an event programme; H1 texts ~40 % short, H4 ~40 % long, H2 swings from 210 to 386 words |
| Audio realism (plays, voices) | **4** | Play counts all correct; TTS throughout, one voice for most H1 clips (a likely gender mismatch), no narrator or example clips, no jingles or phone rings, uneven speech rate |
| Sprechen | **2** | No partner, no examiner follow-up, Teil 2 done twice, Teil 3 is six scripted lines, no Aussprache |
| Writing tasks & scoring | **6** | Prompts match the official pattern (3 Leitpunkte, word ranges, register); scoring is a generic AI checklist, not AE/Sprache A–E |
| Result / pass rule | **8** | Scoring policy encodes 60 + 45/75 + 15/25; Prädikat display not verified |

**Copying note:** TestGerman mock 2 Lesen T1 and mock 1 Lesen T3 follow the storylines of the MS article and email point by point (career + "could expand but likes it small"; new city, welcome tour, international flat with rotating cooking, English at home bothers, visit, sleep in an absent flatmate's room). Our generator must avoid these storylines too (`goethe-a2-official-situations.md`).

### 11.5 Remaining TODOs

- `TODO(hannes): download the Übungssatz 01 MP3s by hand and measure the exam master (reading pauses, gap between plays, transfer block, total ~30 min).`
- `TODO(hannes): unverified — digital delivery (G1 covers paper only).`
- `TODO(hannes): unverified — per-Teil time in Hören/Lesen; use one section timer.`
- `lib/exam/exams/goethe-a2.ts` still carries the old numbers (Lesen T1 200–250 words, Hören T3 60–75 words, Lesen T2 c = "anderes Stockwerk"). Not changed in this pass; fix before set 1 is drafted.
