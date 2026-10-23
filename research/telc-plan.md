# telc Modelltests: build plan

**Stand: 23.10.2026** · decided by Hannes 2026-10-23 · facts in [`telc-overview.md`](telc-overview.md) and the per-exam blueprints.

## 1. Decisions

- **We build every telc exam** as full Modelltests in the portal, one exam at a time. **telc Deutsch B1 comes first** because it is the exam most candidates take.
- **Official result modes only.** Every exam reports its result the way telc does: its points, part minimums, grade bands and terms (`bestanden` / `nicht bestanden`, `teilgenommen`, or B1/A2 for scaled exams). The table is in [`telc-overview.md` §2](telc-overview.md). TestGerman's 25-points-per-section scheme is ignored. The screen always says it is a practice result, not an official telc result.
- **Intro texts follow the official material.** Each "Anleitung" restates what telc tells candidates in its Übungstest: the Testformat page, the "Informationen zur Schriftlichen/Mündlichen Prüfung" pages, the task instructions and the Punkte/Bestehen pages. Every sentence cites a page. Official texts are copyright, so we paraphrase closely and never copy them (CLAUDE.md §4). Drafts are in §6.
- **Realism rules carry over from the DTZ:** the real parts, item counts, timings, answer formats and play counts; one continuous Hören track; a pair Sprechen with a partner who reacts; rubrics built on the official criteria.

## 2. Rollout order

| # | Exam | Blueprint | Why this position |
|---|---|---|---|
| 1 | **telc Deutsch B1** (Zertifikat Deutsch) | `telc-b1.md` | Most taken; Einbürgerung / Niederlassungserlaubnis; already in free tests and the portal |
| 2 | telc Deutsch A2·B1 | needs `telc-a2-b1.md` (skeleton in overview §3b) | Same audience as the DTZ, scaled B1/A2; no competitor has mocks |
| 3 | telc Deutsch B2 | `telc-b2.md` | Jobs, Pflege recognition; same skeleton as B1, so most of the B1 engine carries over |
| 4 | Start Deutsch 2 / telc A2 | `telc-a2.md` | Already a free test; short exam |
| 5 | Start Deutsch 1 / telc A1 | `start-deutsch-1.md` | Spouse visas; needs picture options and a group Sprechen |
| 6 | telc Deutsch B1·B2 Pflege | needs its own file (skeleton in overview §3g) | Care workers need B2; scaled |
| 7 | telc Deutsch C1 Hochschule, then C1 | `telc-c1.md` | University entry; costliest content (lecture, 350-word essay) |
| 8 | B1·B2 Beruf, B1+ Beruf, A2+ Beruf, Medizin, others | overview §3 | Weaker demand; each needs its own blueprint first |

An exam is listed as included in the Prüfungspass only once it has reviewed Modelltests (CLAUDE.md §3).

## 3. telc B1: phases

Each phase is a small PR. Hannes approves each PR before the commit.

### Phase 1: result model and blueprint (data only)
- `lib/exams.ts`: replace `result` + `pass` with one official result rule per exam: max points per part, part minimums, grade bands, terms, and whether a partial retake exists. Fix A1/A2 to "teilgenommen" below 36. One helper computes the official result from the part points, and every result view uses it.
- `lib/exam/blueprint-telc-b1.ts` (the `full` spec, like the DTZ's): 3 Lesen + 2 Sprachbausteine Teile in one 90-min block, Hören 5/10/5 R/F played 1×/2×/2× with 30 s / 60 s reading time, Schreiben 30 min, Sprechen 20 min preparation + ~15 min.
- `validateSet` per exam (B1 rules: item counts, 10 headlines for 5 texts, 12 ads with 1–3 "x", a 15-word pool with 5 distractors, 4 Leitpunkte, word ranges per Teil).

### Phase 2: missing exam components (frontend, design skills first)
- **Word-pool gap text** (Sprachbausteine Teil 2). It also unblocks the TODO in `lib/exam/exams/telc-b1.ts`.
- **Shared block timer** (Lesen + Sprachbausteine, 90 min across all 5 Teile; whether candidates may move freely between Teile is not stated in the official material: `TODO(hannes)`, default free navigation like the paper booklet).
- **Vorbereitung screen** for Sprechen: all three task sheets, a notes field, a 20-min timer; notes stay visible but are not read aloud.
- **Sprechen Teil 2 sheets** (A and B with opposing opinions) and a **Teil 3 planning sheet**.
- **Result view** for points-based exams: written /225, oral /75, the 60 % marks, total /300, grade.
- Each component is added to `/design/pruefung` and DESIGN.md before use (CLAUDE.md §8).

### Phase 3: scoring
- Closed items with the official weights: LV 5 / 5 / 2.5 per item, SB 1.5, HV 5 / 2.5 / 5.
- Schreiben: 3 criteria (Aufgabenbewältigung, Kommunikative Gestaltung, Formale Richtigkeit) × A/B/C/D = 5/3/1/0, × 3 = 45. Mapping 4/3/2/≤1 Leitpunkte → A/B/C/D.
- Sprechen: 4 criteria per Teil (Ausdrucksfähigkeit, Aufgabenbewältigung, Formale Richtigkeit, Aussprache/Intonation); Teil 1 max 15, Teil 2 and 3 max 30 each.
- "What next" stays rule-based (AI Act).

### Phase 4: content pipeline (`scripts/modelltest/`, exam as a parameter)
- `research/telc-b1-official-situations.md`: every situation in telc's public B1 Übungstests (1, 2, 5), paraphrased, as the do-not-reuse list. The official texts for the 6-gram overlap check go only in `.unit-cache/official/`.
- `plan-telc-b1.ts`: topics for 10 sets, **all skills of set *n* planned together** so set *n* is already Simulation *n* (no repeated topic, name or place across its sections; §7), checked against that list.
- Teil prompts in `author.ts`, using the word ranges from `telc-b1.md` §3. Our prompts describe the official wording, never quote it (LEARNINGS 2026-10-23).
- Voice casting (DE voices only):
  - Hören 1: a host plus 5 speakers of both genders and mixed ages.
  - Hören 2: presenter and guest, different genders.
  - Hören 3: five different text types and speakers.
  - Sprechen: Interlokutor plus a partner of the other gender.
- Audio: see §5.

### Phase 5: content
1. Draft set 1 of all four skills on the Batches API.
2. Hannes reviews it in `/admin/modelltests` and we fix the prompts.
3. Draft sets 2–10 with `batch.sh`.
4. Review and publish.

**Estimate:** about $1.60 of Claude per set at batch prices and about 20k ElevenLabs characters per set. Hannes's review time is the real limit.

### Phase 6: launch
- Portal lists telc B1 under the telc family; Prüfungspass copy names it only once reviewed sets exist.
- Anleitung text (§6) + TTS by Mark, as for the DTZ.

## 4. What each skill needs, per exam

| Skill | Generation | New kit pieces (first exam that needs them) |
|---|---|---|
| Hören | Scripts with role, gender and age per line. Each item's key is tied to one line. Distractors are mentioned but meant differently. Words per clip and speaking rate per level come from the official recordings. | Picture options (A1); phone-note gap-fill with tolerant spelling and exact numbers (A2); note-taking gaps (A2·B1, C1); 8-speaker matching (C1) |
| Lesen | Official text types and word ranges per Teil. Headlines summarise without repeating the text. Ads fail on exactly one detail. "x" is a valid answer. | Store directory (A2); sentence insertion and R/F/nicht im Text (C1) |
| Sprachbausteine | One letter or article with targeted gaps: grammar Teil (a/b/c forms), lexis Teil (word pool) | Word pool (B1); 4-option MC (C1) |
| Schreiben | Stimulus + Leitpunkte. Model answers per band are for review only and never reach the client. | Form fields (A1/A2); task choice A/B and a minimum-word counter (B2, C1) |
| Sprechen | Examiner script, partner persona and sheet, cue cards, live-line fallbacks | Preparation timer (B1+); card draw (A1/A2); presentation + summary (C1); group of 4 (A1) |

## 5. Audio standard (all exams)

The TestGerman teardown (23.10.2026, 180 clips) found mislabelled voices, a female guest voiced by a man, fixed 0.3–0.6 s turn gaps, no room tone, a 19 LU loudness spread, mixed sample rates, and no exam framing. Our standard:

- **One continuous Hören track per set.** It contains the narrator's instructions, examples, reading pauses (B1: 30 s before Teil 1, 60 s before Teil 2), repeats exactly as the blueprint says, and pauses after each item. There is no pause or seek.
- **Voices** come from `data/tts-voices.json` only. Each voice matches the role's gender, and A and B are always different voices. The validator also checks the item wording ("Der Sprecher", "Frau Dr. …") against the voice's gender.
- **Natural dialogue:** varied turn gaps (about 0.15–0.9 s), back-channels written into the script, and a room tone or scene bed per text type (`SoundKey`: radio, phone, train, store, station).
- **Loudness:** every track normalised to one target (−16 LUFS integrated, −1 dBTP), one output format.
- **Length per level** from the official recordings: A1 16:52 · B1 25:00 · B2 18:28 · C1 ~41 min (with instructions and pauses).

## 6. Intro texts ("Anleitung"), drafts for review

Sie-form like the exam, simple sentences, our own wording. Page numbers refer to telc's *Übungstest 1 Zertifikat Deutsch / telc Deutsch B1*, 13th ed. 2020 (`telc-b1.md` [S1]).

**The other exams** are drafted in [`telc-anleitung/`](telc-anleitung/) (`start-deutsch-1`, `telc-a2`, `telc-a2-b1`, `telc-b2`, `telc-c1`, `telc-c1-hochschule`). They use the DTZ `Anleitung` shape plus an `overview`, and every line cites its source page. Lines that describe our runner rather than telc are marked "ours". A 6-word overlap check against the official PDFs found only short labels and stock phrases; the three closest lines were reworded. Each file header lists where the official sources contradict each other. The ones that change product copy:
- **A1:** the Übungstest gives only the grade table (below 36 = "teilgenommen") and never states the pass rule in words. `TODO(hannes)`: confirm with a current telc source.
- **A2:** written time is 70 min (2024 edition) vs 80 min (2017). A per-part "Mindestpunktzahl" is mentioned (p. 41) but never defined. Schreiben Teil 2 is called both "Brief" and "E-Mail".
- **A2·B1:** Hören Teil 2 and Teil 4 are both played once. "Keine Vorbereitungszeit", but there is about 1 min to think before Sprechen Teil 3. telc's term for a result below A2 isn't found yet, so the draft shows "unter A2" as our label.
- **B2 / C1:** retaking one part is "same or following calendar year" in the Übungstests vs "within 12 months" in the 2025 Prüfungsregularien. The drafts follow the Regularien. The C1 Übungstest's "120 Minuten" written time is a misprint (its own Testformat adds up to 200 + 20 min break).
- **C1 Hochschule:** the 2015 Handbuch gives 20 min preparation for all speaking tasks; the 2018 Übungstest prepares only the presentation. The drafts follow the newer Übungstest.
- **Scoring detail:** C1 and C1 Hochschule average the two examiners' speaking scores; A1, A2 and B2 agree on one joint score.

### telc Deutsch B1

**Overview**
- Die Prüfung hat einen schriftlichen und einen mündlichen Teil. *(p. 5)*
- Der schriftliche Teil dauert 150 Minuten. Sie beginnen mit Leseverstehen und Sprachbausteinen. Dafür haben Sie zusammen 90 Minuten. Dann folgt das Hörverstehen, etwa 30 Minuten. Am Ende schreiben Sie 30 Minuten eine E-Mail. *(p. 5, 29)*
- Wörterbücher, Handys und andere Geräte sind in der Prüfung nicht erlaubt. *(p. 29)*
- Die mündliche Prüfung machen Sie zu zweit. Sie dauert etwa 15 Minuten. Vorher haben Sie 20 Minuten Zeit zur Vorbereitung. *(p. 5, 30)*
- So zählt es: Es gibt 300 Punkte, 225 im schriftlichen und 75 im mündlichen Teil. Sie haben bestanden, wenn Sie in beiden Teilen mindestens 60 Prozent haben: 135 und 45 Punkte. Die Note: ab 270 Punkten sehr gut, ab 240 gut, ab 210 befriedigend, ab 180 ausreichend. *(p. 39–40)*
- Ihr Ergebnis hier ist ein Übungsergebnis, kein offizielles telc-Ergebnis.

**Leseverstehen und Sprachbausteine** (one screen, one 90-min block, p. 5, 29)
- Teil 1: Fünf kurze Texte und zehn Überschriften. Welche Überschrift passt zu welchem Text? Jede Überschrift passt nur einmal. *(p. 6)*
- Teil 2: Ein längerer Text mit fünf Aufgaben. Welche Lösung ist richtig: a, b oder c? *(p. 8)*
- Teil 3: Zehn Situationen und zwölf Anzeigen. Welche Anzeige passt? Jede Anzeige passt nur einmal. Passt keine Anzeige, wählen Sie x. *(p. 10)*
- Sprachbausteine Teil 1: Ein Text mit zehn Lücken. Welches Wort passt: a, b oder c? *(p. 12)*
- Sprachbausteine Teil 2: Ein Text mit zehn Lücken und 15 Wörtern. Jedes Wort passt nur einmal. *(p. 13)*
- Sie haben für alle fünf Teile zusammen 90 Minuten. In der Prüfung markieren Sie auf dem Antwortbogen, hier wählen Sie direkt. *(p. 6–13, 29)*
- So zählt es: Leseverstehen gibt 75 Punkte, Sprachbausteine 30 Punkte. *(p. 39)*

**Hörverstehen** (p. 14–16, 29)
- Teil 1: Fünf Personen sagen kurz ihre Meinung. Sie hören jeden Text nur einmal. Vorher haben Sie 30 Sekunden, um die Aufgaben zu lesen. *(p. 14)*
- Teil 2: Ein längeres Gespräch, zum Beispiel ein Interview im Radio. Sie hören es zweimal. Vorher haben Sie eine Minute zum Lesen. *(p. 15)*
- Teil 3: Fünf kurze Texte, zum Beispiel eine Durchsage oder eine Nachricht am Telefon. Sie hören jeden Text zweimal. *(p. 16)*
- Alle 20 Aufgaben: richtig oder falsch. Entscheiden Sie beim Hören. *(p. 14–16)*
- Die Aufnahme läuft ohne Pause bis zum Ende. Sie können nicht anhalten oder zurückspulen. *(p. 29)*
- So zählt es: Hörverstehen gibt 75 Punkte. *(p. 39)*

**Schriftlicher Ausdruck** (p. 17, 36–38)
- Sie bekommen eine E-Mail und antworten darauf. Ihre Antwort ist eine persönliche oder halbformelle E-Mail. *(p. 5, 17)*
- Schreiben Sie zu allen vier Punkten etwas. Überlegen Sie vorher eine gute Reihenfolge. *(p. 17)*
- Denken Sie an Betreff, Anrede, Einleitung und Schluss. *(p. 17)*
- Sie haben 30 Minuten Zeit. *(p. 5)*
- So zählt es: Bewertet werden drei Dinge. Haben Sie alle Punkte gut bearbeitet? Ist der Text gut verbunden und passt er zur Situation? Wie korrekt ist Ihr Deutsch? Zusammen gibt es 45 Punkte. *(p. 36–39)*

**Mündlicher Ausdruck** (p. 18–21, 30–31)
- Vorbereitung: Sie bekommen alle Aufgabenblätter und haben 20 Minuten Zeit. Sie dürfen Notizen machen. Im Gespräch sollen Sie die Notizen aber nicht vorlesen. *(p. 30)*
- Teil 1, Einander kennenlernen, etwa 3 Minuten: Sie erzählen von sich und stellen Ihrem Partner Fragen. Die Stichpunkte auf dem Blatt helfen. Die Prüferin kann ein weiteres Thema ansprechen. *(p. 18, 30)*
- Teil 2, Über ein Thema sprechen, etwa 6 Minuten: Sie und Ihr Partner haben verschiedene Blätter mit verschiedenen Meinungen. Sie sagen einander, was auf Ihrem Blatt steht. Dann sprechen Sie über das Thema, über Ihre Erfahrungen und Ihre Meinung. *(p. 19–20, 30)*
- Teil 3, Gemeinsam etwas planen, etwa 6 Minuten: Sie planen zusammen etwas, zum Beispiel eine Feier. Machen Sie Vorschläge und reagieren Sie auf die Vorschläge Ihres Partners. Klären Sie, wer was macht. *(p. 21, 30)*
- Sprechen Sie mit Ihrem Partner, nicht mit der Prüferin. Fragen Sie nach und helfen Sie einander. Das wird positiv bewertet. *(p. 31)*
- Hier ist Ihr Partner simuliert. Die Prüferin leitet durch die Teile und spricht nur wenig. *(p. 31; simulation note is ours)*
- So zählt es: Teil 1 gibt 15 Punkte, Teil 2 und Teil 3 je 30 Punkte. Bewertet werden Ausdruck, Aufgabe, Korrektheit und Aussprache. *(p. 34–35, 39)*

## 7. Prüfungssimulation: the whole exam in one go (every exam, DTZ first)

Added 23.10.2026 (Hannes asked for it). Applies to every exam on the platform, not only telc.

### What TestGerman does (checked live 23.10.2026, `/exercise/simulated-exam`)
- The simulation is their **only** mock format: 20 simulations on the A2/B1 roadmap (Goethe 5, telc 4, ÖSD 7, DTZ 4), each one fixed bundle of all four skills, generated as one exam ("69 Fragen · 195 Min.").
- Flow (screenshots in `testgerman/screenshots/pruefungssimulation/`): a narrated Anleitung, then sections in a fixed order. A side navigator shows each section's countdown and item grid. Leaving a section asks for confirmation; leftover time is lost and you can't go back. One "Einreichen" submits all.
- Gaps against the real exams: their sections are always Hören → Lesen → Schreiben → Sprechen with one timer each, so telc B1's shared 90-min Lesen + Sprachbausteine block and the official order (Lesen+SB → Hören → Schreiben) are lost. There's no break before the oral part, no preparation time, and the result is their 25-points-per-skill score, not the official one.

### Our model: compose, never generate
- **A Prüfungssimulation is an assembly of reviewed Modelltests, not new content.** Simulation *n* of an exam = Modelltest *n* of each of its skills (Hören *n*, Lesen *n*, Schreiben *n*, Sprechen *n*). 10 per skill → 10 simulations per exam at **zero extra Claude or ElevenLabs cost** for content.
- **Per level = per exam.** Each exam already sits at its level in the portal (A1 Start Deutsch 1, A2, A2·B1/DTZ, B1, B2, C1), so every level gets simulations as soon as its exam has sets.
- **Available only when all four sets *n* are published.** A simulation inherits its sets' review status; nothing is reviewed twice.
- **What is new per exam (rendered once, reused by all 10 simulations):** the exam-level Anleitung (§6 drafts, `research/telc-anleitung/`, DTZ: `lib/modelltest/anleitung.ts` merged into one intro), short narrator transitions between sections, the break screen, and the closing text. About 3–4k ElevenLabs characters per exam, Mark only.
- **Pairing check, not regeneration.** `validateSimulation` checks the four sets of a simulation against each other (same situation or topic in Lesen and Schreiben, same names or voices back to back). On a clash we swap the pairing in a small map (`sim n → { hoeren: a, lesen: b, … }`, identity by default), never redraft a set.
- **Already done?** Candidates who did Hören 3 alone meet it again in Simulation 3. The simulation card says which Modelltests it contains and marks the ones already done. `TODO(hannes)`: alternatively hold back sets 9–10 of every skill for simulations only (no extra cost, fewer single-skill tests).

### How it runs (exam conditions)
- **Every simulation runs in its exam's official format** (Hannes, 23.10.2026): the official order of sections, the official timing groups (shared timers), breaks, preparation times, play counts and the official result. Never a generic Hören → Lesen → Schreiben → Sprechen, never TestGerman's flow. The table below is the binding spec; `lib/exam/simulation.ts` encodes it and `validateSimulation` fails on any deviation.
- **Section lock as in the exam:** finishing a timing group is final; its leftover time is lost. Within a group, free navigation between Teile (paper booklet). The Hören track runs as in the single Modelltest.
- **Server-side deadlines:** each group's end time is stored on start, so a reload doesn't reset the clock. **Resume only at group boundaries** (most users are on a phone): a candidate can stop at the break or between groups and continue later; a started group keeps running.
- **Result: the official overall result,** computed by the one helper from Phase 1 (§3) from the four section results: DTZ certificate level (Sprechen + Hören/Lesen or Schreiben), telc B1 written /225 ≥ 135 and oral /75 ≥ 45 with the grade, A1/A2 "teilgenommen" below the mark, etc. Below it, each skill's own result and a rule-based "what next" (weakest skill → its Modelltests). Labelled as a practice result.
- **Costs per run** are the sum of the single-skill runs (Schreiben grading, live Sprechen, Scribe) under the same caps in `lib/modelltest/sprechen-run.ts` / `lib/kurztest/limits.ts`. Simulation 1 is free like Modelltest 1; the rest need the Prüfungspass (`ownsExam`).

### Official format per exam (binding for every simulation)

Each row comes from the exam's blueprint; the source pages are cited there. A timing group can join two single-skill Modelltests under one timer (e.g. Lesen *n* + Schreiben *n* in telc A2), so the sets themselves never change.

| Exam | Written part: groups in official order | Break | Oral part | Official result shown | Blueprint |
|---|---|---|---|---|---|
| **DTZ** | Hören ~25 → Lesen 45 → Schreiben 30 (100 min) | none inside the written part | Sprechen ~16 min, pair, **no preparation** | Certificate level **B1 / A2 / unter A2** (Sprechen + Hören/Lesen or Schreiben), plus the level per part | `dtz-blueprint.md` §1, §6 |
| **Start Deutsch 1** (Goethe + telc) | Hören ~20 → Lesen + Schreiben **one 45-min block** | none | Sprechen ~15 min, group, no preparation | Goethe /100, bestanden at 60 · telc /60, ≥36 graded, below **teilgenommen** | `start-deutsch-1.md` §1, §4 |
| **telc Deutsch A2** | Hören ~20 → Lesen + Schreiben **one 50-min block** (2024 edition) | none | Sprechen ~15 min, pair, no preparation | /60, ≥36 with grade, below **teilgenommen** | `telc-a2.md` §1, §6 |
| **Goethe-Zertifikat A2** | Lesen 30 → Hören ~30 → Schreiben 30 (90 min) | none | Sprechen ~15 min, pair, no preparation | /100: bestanden at ≥60 **and** ≥45/75 written **and** ≥15/25 oral, with grade | `goethe-a2.md` §1, §6 |
| **ÖSD Zertifikat A1** | Module Schriftlich: Lesen 25 → Hören ~10 → Schreiben 20 | none | Module Mündlich: **10 min preparation** + ~10 min, individual | Per module (written 75, oral 25) with the subtest minimums | `oesd-a1.md` §1, §4 |
| **ÖSD Zertifikat A2** | Module Schriftlich: Lesen 30 → Hören ~15 → Schreiben 30 | none | Module Mündlich: **10 min preparation** + ~10 min, pair or individual | Per module (written 70, oral 20) with the subtest minimums | `oesd-a2.md` §1, §6 |
| **telc Deutsch A2·B1** | 4 groups: Lesen 45 → Sprachbausteine + Lesen + Schreiben 35 → Hören + Schreiben 35 → Schreiben 10 | `TODO(hannes)` | Sprechen ~15 min, pair, **no preparation** | **B1 / A2 / no certificate** from 240 points with the 3-of-4-skills rule | overview §2, §3b; needs `telc-a2-b1.md` first |
| **telc Deutsch B1** | Lesen + Sprachbausteine **one 90-min block** → Hören ~30 → Schreiben 30 (150 min) | none inside the written part | **20 min preparation** + ~15 min, pair | /300: ≥135/225 written **and** ≥45/75 oral, grade bands, else **nicht bestanden** | `telc-b1.md` §1, §4 |
| **Goethe / ÖSD Zertifikat B1** | **Four modules:** Lesen 65 → Hören ~40 → Schreiben 60 | **≥15 min after each module** | Sprechen: **15 min preparation** + ~15 min, pair | **Per module** /100, bestanden at 60 with Prädikat; all four passed = Gesamtzeugnis | `goethe-oesd-b1.md` §1, §2 |
| **telc Deutsch B2** | Lesen + Sprachbausteine **90 min** → Hören ~20 (all played **once**) → Schreiben 30 (140 min) | none | **20 min preparation** + ~15 min, pair | /300: ≥135 written **and** ≥45 oral, grade bands | `telc-b2.md` §1 |
| **telc C1 / C1 Hochschule** | Lesen + Sprachbausteine 90 → **20-min break** → Hören ~40 (all once) → Schreiben 70 | 20 min after Lesen + SB | **20 min preparation** + ~16 min, pair | /214: ≥128 total, ≥99 written **and** ≥29 oral, grade bands | `telc-c1.md` §1 |

- **The break between the written and the oral part** is not in the official material for most exams (on exam day the oral part may come later the same day or on another day). The simulation shows a break screen there and lets the candidate continue later; it adds no fixed break where the blueprint names none.
- **Answer-sheet transfer time** (paper only) is left out, as in the digital exams. Where the official clock includes it (Goethe/ÖSD B1 Hören: 5 min at the end), the group's time stays the official one.
- **An exam gets simulations only when its row is complete.** Any `TODO(hannes)` in its row blocks it. New exams (B1·B2 Pflege, C1 variants, Beruf) add their row from their own blueprint first.
- **The single-skill Modelltests keep the same official structure,** so a simulation needs no extra content: e.g. telc B1 Lesen sets include the Sprachbausteine, and Start Deutsch 1 Lesen and Schreiben sets share the official 45-min block when run together.

### Generation rule: every set is born as part of a simulation
- The plan file per exam lists set *n* for **all** skills at once, and the planner checks set *n* across skills (topics, situations, names, places) before any drafting. `validateSimulation` repeats that check on the drafts.
- Casting is assigned per set *n* across skills, so the sections of one simulation don't open with the voice that just closed the previous one.
- Each set is drafted in its official structure inside the full exam (shared blocks fit their one timer). The sets of *n* are drafted in the same batch run.
- Result: assembling a simulation is a lookup, never a generation step. The pairing map (above) stays a fallback only.

### Build (small PRs, after telc B1 Phase 1 because it needs the result helper)
1. **Data:** `lib/exam/simulation.ts` (per exam: timing groups in order, breaks, preparation, pairing map) + `validateSimulation`. Migration: `mt_sim_attempts` (user, exam, number, current group, group deadlines, result) and `mt_attempts.sim_attempt_id`, so each section is a normal attempt of its set and per-skill progress counts it too. No new scoring code.
2. **Runner:** `components/modelltest/simulation.tsx` wraps the existing runner per group: exam Anleitung → groups with a section navigator and the confirm-to-leave dialog → break → Sprechen → overall result. New kit pieces (section navigator, break screen, overall result) go on `/design/pruefung` and in DESIGN.md first; design skills first.
3. **Portal:** a fifth card "Prüfungssimulation" on each exam page with its 10 slots, route `/dashboard/[exam]/simulation/[n]`; admin preview of unpublished simulations as for sets.
4. **Launch DTZ first** (its 10 sets per skill already exist), then every exam gets its simulations automatically once its sets are reviewed.

## 8. telc B1 Sprechen: build plan (proposed 23.10.2026, not built)

Source for the flow: telc Übungstest 1, p. 30–35 (research/telc-b1.md §3e, §5). Scoring is already built and tested:
`lib/exam/scoring/telc-b1.ts` (`speakingTeilScore`, 15/30/30, pass 45/75).

**What the candidate goes through (official order):**

| Step | Official | Ours |
|---|---|---|
| Vorbereitung | 20 min alone with all task sheets; notes on stamped paper, not read aloud | One screen with three sheet cards (Teil 1 topics, **only your own** Teil 2 opinion, Teil 3 list), a notes field and a 20:00 timer. Notes stay visible during the talk with the hint "nicht ablesen" |
| Teil 1, ~3 min | A and B get to know each other along the topics; the Interlokutor may add a topic (weekend, hobbies) | Partner speaks **live** (persona from the set), asks back and answers; one examiner extra question from the bank |
| Teil 2, ~6 min | Interlokutor asks **B first** what B read, then A; then both discuss with own opinion and experience | Partner reports his sheet first, the candidate reports theirs, then a live discussion: the partner holds the opposing view, reacts to what the candidate said and asks back |
| Teil 3, ~6 min | Interlokutor asks **A** to start; both propose, react and agree on one plan | Candidate opens; the partner alternates who opens each point, objects at least twice (persona), and leaves the final summary or agreement to the candidate |
| Interlokutor | Speaks as little as possible; steps in when one is silent or the talk stalls | Ela: opening, transitions, ending; a rescue line only when the candidate's answer is empty or under ~8 words twice in a row |

**Engine changes** (reuse the DTZ run: recording → ElevenLabs Scribe → live line from Haiku → eleven_v4_turbo):
1. **Time budget per Teil instead of a fixed turn count:** 3 / 6 / 6 min. The partner keeps turns at ≤ 40 words so the candidate gets about half the speaking time. Candidate turns 30–60 s.
2. **Phases** "1", "2", "3" (already in `SpeakPhase`), and the partner prompt gets the Teil's goal: get to know, disagree with reasons, agree on a plan.
3. **Roles A/B:** the candidate is always A for now. `TODO(hannes)`: offer B as well, so Teil 2 can be practised reporting first.
4. **Preparation:** `TODO(hannes)`: may candidates start before the 20 minutes are up? Default: yes, with a "Ich bin bereit" button, labelled as a deviation in practice mode only. A simulation runs the full 20 minutes.

**Grading** (`gradeTelcSpeaking`, new): one Claude call per Teil on the transcript with the four official criteria, steps A–D:
- Ausdrucksfähigkeit, Aufgabenbewältigung (includes Gesprächsbeteiligung: asking back, reacting, helping) and Formale Richtigkeit come from the model.
- Aussprache/Intonation is estimated from Scribe confidence plus the transcript and labelled as an estimate, as in the DTZ.
- Points from `speakingTeilScore`; oral result /75 with the 45 mark. In a simulation, `telcB1Result` combines it with the written result into the grade.

**Content fixes before more sets** (from the 23.10. review):
- Teil 3: alternate openings, the candidate does the summary, longer candidate turns.
- Teil 1 sheet: neutral cue words in one register.
- Add a cross-skill name/topic check to `validateSet`. Set 1 reuses the surname Albers (HV2, HV3) and has the wedding theme in LV3, SB2 and Schreiben.

**New UI** (design skills first, shown on /design/pruefung before use):
- `PrepScreen`: three sheet cards plus notes and the timer.
- Opinion sheet card: magazine-quote style, reuse `ArticleText` typography.
- Planning list card: the list ending in "…".
- `SpeakingTask` gets a "your notes" drawer.

**PRs:** (1) prompt and validator fixes · (2) PrepScreen + sheet cards · (3) run engine telc mode · (4) `gradeTelcSpeaking` + oral result view · (5) end-to-end test with a real microphone. Cost per run like the DTZ: Haiku for live lines, ~3–5k TTS characters per talk, one Opus call per Teil for grading, capped by `MT_SPEAKING_PER_DAY`.
