# DTZ blueprint (Deutsch-Test für Zuwanderer A2–B1)

The single source of truth for the DTZ format (CLAUDE.md §2). Every Modelltest we ship is checked
against this file; a deviation is a bug. Format only: the official texts are copyright and are never
reproduced or paraphrased (CLAUDE.md §4).

## Sources

| Id | Source | Checked |
|---|---|---|
| G1 | g.a.s.t. "Der DTZ auf einen Blick" https://www.gast.de/de/forschung-entwicklung/entwicklung/auftraege/deutsch-test-fuer-zuwanderer-dtz/der-dtz-auf-einen-blick | 2026-10-16 (seo/facts.md) |
| G2 | g.a.s.t. DTZ FAQ https://www.gast.de/de/forschung-entwicklung/entwicklung/auftraege/deutsch-test-fuer-zuwanderer-dtz/faq | 2026-10-16 (seo/facts.md) |
| U1 | g.a.s.t. DTZ Übungssatz 1, Juni 2024 https://www.gast.de/fileadmin/gast.de/GAST/5_DTZ/PDF/gast_DTZ_UEbungssatz_1.pdf | 2026-10-22 |
| U2 | g.a.s.t. DTZ Übungssatz 2, Juni 2024 https://www.gast.de/fileadmin/gast.de/GAST/5_DTZ/PDF/gast_DTZ_UEbungssatz_2.pdf | 2026-10-22 |
| A1, A2 | g.a.s.t. Übungssatz 1/2 audio (see §2.1) | 2026-10-22 |
| L1 | IntTestV (Integrationskurstestverordnung) https://www.gesetze-im-internet.de/inttestv/ | 2026-10-16 (seo/facts.md) |

U1 and U2 have the identical structure (same Teile, item numbers, timings, scoring tables). U2 p. 6:
"Das Testformat und die Aufgabentypen bleiben unverändert" since g.a.s.t. took over on 2023-01-01.

## 1. Overview

| Part | Time | Items / tasks | Result |
|---|---|---|---|
| Hören | ca. 25 min | 4 Teile, items 1–20 | together with Lesen: 45 points |
| Lesen | 45 min | 5 Teile, items 21–45 | (see above) |
| Schreiben | 30 min | 1 task, choose A or B | 20 points |
| Sprechen | ca. 16 min, pair exam | 3 Teile (1A, 1B, 2A, 2B, 3) | 100 points |

- The written exam (Hören, Lesen, Schreiben) is 100 min without a break. Each part may only be worked
  on in its own time; the booklet has "STOP" pages after Hören and Lesen (U2 p. 6–7).
- **Every listening text is played once** (G1). There is no repeat anywhere in Hören.
- Hören Teil 1, 3, 4 and Lesen Teil 1, 5 open with a solved **Beispiel** (item 0) before the scored
  items; Hören Teil 2 and Lesen Teil 2, 3, 4 have none (U1, U2). Our Modelltests show it the same way,
  unscored.
- Hören and Lesen answers go on one Antwortbogen; Schreiben has its own Schreibbogen (U2 p. 6).

## 2. Hören (ca. 25 min, items 1–20, every text once)

| Teil | Task (official) | Items | Structure | Answer | Text length (measured, U1+U2) |
|---|---|---|---|---|---|
| 1 | Ansagen am Telefon, öffentliche Durchsagen verstehen | 4 (1–4) | 4 separate clips, 1 item each, + Beispiel | a/b/c, text options | 45–75 words, 20–35 s; 1 voice |
| 2 | Kurze Informationen in den Medien verstehen | 5 (5–9) | 5 radio clips, 1 item each, no Beispiel | a/b/c | 55–80 words, 22–36 s; 1 voice |
| 3 | Alltägliche Gespräche verstehen | 8 (10–17) | 4 dialogues × 2 items (1 richtig/falsch + 1 a/b/c), + Beispiel dialogue | r/f, then a/b/c | 105–145 words, 48–70 s; 2 voices |
| 4 | Unterschiedliche Meinungen zu einem Thema verstehen | 3 (18–20) | short host intro, then Beispiel + 3 separate statements; 6 sentences a–f (1 used by Beispiel, 2 distractors) | match statement → sentence | statement 45–80 words, 20–30 s; intro ≈ 35 words, ≈ 20 s; a different voice per statement |

Details:
- Teil 1 situations: an automated info line (Beispiel), station, U-Bahn or in-train announcements,
  answering-machine messages from an office, insurance, Bürgerbüro, hairdresser, doctor, and a private
  voicemail from a friend in du-form (U1 Nr. 4). No department-store announcement in any official set.
- Teil 2 situations: radio ads, event tips, public transport timetable changes, train announcements,
  competitions (U2). Mixed radio + public announcement.
- Teil 3 dialogues are natural speech with fillers ("äh", "is ja n bisschen früh"), names are used
  (Frau Wilke, Herr Kern). Settings: neighbours, job interview for household help, asking the boss
  for leave, doctor's reception, asking the way (U2). U1 mixes in du-conversations between friends and
  partners (Maria/Lukas, Angela/Günter). The a/b/c stems are often sentence starts ("Herr Klimke kann …")
  with options ending in a full stop. r/f keys are balanced (U2: 2 richtig, 2 falsch).
- Teil 4: "Lesen Sie jetzt die Sätze a–f. Dazu haben Sie eine Minute Zeit." → **60 s reading time**
  before the audio (U2 p. 12). Topic in U2: food and health; the spoken statements are first-person opinions
  of ordinary people of different ages, but the sentences a–f are short general opinions, never first
  person ("Fleisch macht den Körper stark.", "Sonntags sollten auch Banken offen haben.").
- Item stems are short questions ("Wann ist Frau Aysel wieder da?") or statements for r/f; options are
  short phrases ending in a full stop.
### 2.1 Audio protocol and speed (measured from the official audio, A1/A2 below)

Sources A1/A2: g.a.s.t. Übungssatz 1/2 audio
(`gast.de/fileadmin/gast.de/GAST/5_DTZ/Audio/gast_Deutsch-Test_fuer_Zuwanderer_UEbungssatz_<n>.mp3`),
23:33 and 23:47 min. Transcribed 2026-10-22 with ElevenLabs Scribe (word timestamps) for measurement only;
nothing from it is reused. Speech span = first to last word of the clip, without sound effects.

**One continuous track, the same rhythm in both sets:**
1. Title, then per Teil: jingle-free "Hören, Teil n", the instruction read aloud by one narrator, "Beispiel".
2. Per item: **[jingle] "Nummer n" → 10–13 s silence (read the question) → clip → 10–15 s silence
   (answer) → next.** Teil 3 announces "Nummer 10 und 11" per dialogue. Re-measured 2026-10-22 speech to speech:
   ≈ 12 s before and ≈ 15 s after each clip, the Beispiel included (we had 4 s after the Beispiel).
3. Teil 4: instruction → **≈ 72 s silence** (60 s to read a–f plus jingle) → host intro (≈ 19–21 s) → ≈ 3 s →
   "Beispiel" statement → per item "Nummer 18" → 3–4 s → statement → ≈ 15 s.
4. "Ende von Teil n" (with jingle) after each Teil, ≈ 8 s, then the next Teil; "Ende des Prüfungsteils Hören" at the end.
5. The candidate cannot pause, skip or replay; the track runs on its own. The Beispiel clips are played too.

**Clip length and speed:**

| Teil | Speech span per clip | Speed (words/min) | Voices | Sound design in the clip |
|---|---|---|---|---|
| Narrator (instructions, "Nummer n") | – | 110–150, calm | 1, same throughout | jingle before each number |
| 1 Ansagen | 20–35 s (up to ≈ 45 s with ambience) | 105–155, avg ≈ 125 | 1 per clip, varies | answering-machine beep + dial tones; station gong + train noise |
| 2 Radio | 22–36 s (up to ≈ 45 s with music) | 105–160, avg ≈ 130 | 1 per clip | radio jingle/music bed, coughing in an ad, train announcement chime |
| 3 Gespräche | 48–70 s (Beispiel ≈ 46 s) | 140–165, avg ≈ 150 | 2 (male + female) | knock on the door, shop/street ambience, fillers and overlaps |
| 4 Meinungen | 20–34 s per statement; intro 19–21 s | 140–190, avg ≈ 160 | host + 1 voice per statement, mixed ages | none |

Consequences for our audio:
- eleven_v4 speaks ≈ 2.9 words/s (≈ 174 wpm, LEARNINGS 2026-10-12). That is right for Teil 4, slightly fast for
  Teil 3 and clearly too fast for Teil 1 and 2. Speed and script length are set per Teil (`full.pace`).
- Clips need their sound design (beeps, gongs, jingles, ambience) under or before the speech.
- A full Hören Modelltest is one timed sequence with the narrator, numbers, reading and answer pauses,
  ≈ 23–24 min in total — not a list of clips the user starts.

## 3. Lesen (45 min, items 21–45)

| Teil | Task (official) | Items | Structure | Answer | Length (measured) |
|---|---|---|---|---|---|
| 1 | Kataloge, Register, Verzeichnisse verstehen | 5 (21–25) | **one** directory text + Beispiel; 5 situations | a/b/c where a and b name two sections and c is always "anderes Stockwerk" / "anderes Kapitel" | directory 120–170 words |
| 2 | Allgemeine und spezifische Informationen in Anzeigen verstehen | 5 (26–30) | 5 situations, **8 ads a–h**; exactly one situation has no match → X | match situation → ad or X | ads 35–90 words each, ≈ 450 words total |
| 3 | Informationen und Meinungen in Pressetexten und formelle Mitteilungen verstehen | 6 (31–36) | 3 texts × 2 items (1 r/f + 1 a/b/c), no Beispiel | r/f, then a/b/c | 90–130 words per text |
| 4 | Informationsbroschüren verstehen | 3 (37–39) | one brochure/rules text with sub-headings | r/f | 200–260 words |
| 5 | Wörter in einem Brief ergänzen | 6 (40–45) | one formal letter with gap (0) as Beispiel + 6 gaps | a/b/c per gap (grammar and fixed phrases: Anrede, connectors, articles, possessives, prepositions) | letter 85–110 words |

Details:
- Teil 1 directories seen: Rathaus floor guide with offices and services per floor (U1); a book's
  table of contents with 5 chapters (U2). The Beispiel uses one of the sections too.
- Teil 2 ads: flats, insurances, temporary housing, courses, jobs. Distractor ads are close to a
  situation but fail one condition (no pets, no balcony, for sale instead of for rent) (U2).
- Teil 3 text types: local news item (Bürgerbüro reopens), letter from a Kindergarten to parents,
  email from a language school (U2). Letters and emails have a sender and a greeting; news items have no
  source line (U1, U2).
- Teil 4 text types: transport operator's rules for passengers (U2), school lunch-care information
  for parents (U1). Uses bullet lists and prices.
- Teil 5 letters: subscription confirmation (U2), hotel complaint (U1). Sender block, date, subject
  line in capitals.

## 4. Schreiben (30 min)

- Choose **Aufgabe A or B**. Each gives a situation and **4 Leitpunkte** ("Schreiben Sie etwas zu
  folgenden Punkten"). "Zeigen Sie, was Sie können. Schreiben Sie möglichst viel. Vergessen Sie nicht
  die Anrede und den Gruß." (U1, U2 p. 24)
- Text type: halbformelle und formelle Mitteilungen (U2 p. 5). Seen: email to an acquaintance
  (semi-formal, U2 A), complaint to the landlord (formal, U1 B and U2 B), enquiry to a training centre (U1 A),
  excuse to the course teacher and reply to a former teacher's invitation (Modellsatz 2009).
  One semi-formal task (Sie to a named acquaintance, colleague or teacher, never a du-message to a friend)
  and one formal task. The situation names the form ("Schreiben Sie … eine E-Mail / einen Brief"). The
  Leitpunkte are neutral keywords; the formal task asks for B1 functions (why it matters, what you want,
  what you do if nothing happens).
- Benchmarked sample answers (DTZ Prüfungshandbuch §6.4.1) are short and not error-free: B1 ≈ 77 words,
  A2 ≈ 60 words. Our model answers (90–120 words, near error-free) are Musterlösungen, not typical B1.
- **No word count** is given (G1, U1, U2).
- Criteria (U2 p. 42–43), each 0–5 points (B1 gut erfüllt 5 / erfüllt 4, A2 3 / 2, A1 1, 0):
  I Aufgabenbewältigung (all four Leitpunkte precise = 5 … none = 0), II Kommunikative Gestaltung,
  III Korrektheit, IV Wortschatz. Off-topic text = 0 on every criterion.
- Result: 15–20 = B1, 7–14 = A2, 0–6 = unter A2 (U2 p. 47).

## 5. Sprechen (ca. 16 min, pair exam, no preparation time; a short look at the photo in Teil 2 and a moment to read the sheet in Teil 3, Handbuch p. 61/63, U2 p. 31)

| Teil | Task | Time | Material | Points (Aufgabenbewältigung) |
|---|---|---|---|---|
| 1A | Über sich sprechen | ca. 4 min for both | same sheet for both: keywords Name, Geburtsort, Wohnort, Arbeit/Beruf, Familie, Sprachen | 5 |
| 1B | Auf Nachfragen reagieren | (in Teil 1) | examiner follow-up questions on what was said | 5 |
| 2A | Über Erfahrungen sprechen | ca. 6 min for both | **different photo per candidate**, same topic; "Was sehen Sie auf dem Foto? Was für eine Situation zeigt dieses Bild?" | 10 |
| 2B | Auf Nachfragen reagieren | (in Teil 2) | examiner questions on own experience, separate A2 and B1 question sets | 10 |
| 3 | Gemeinsam etwas planen | ca. 6 min | same sheet for both: situation + 5 note points + "…?" | 20 |

- Order (U2 p. 31): A 1A, A 1B, B 1A, B 1B, then B 2A, B 2B, A 2A, A 2B, then A+B Teil 3.
  The examiner hands the Teil 2 sheet only to the person whose turn it is.
- 1B and 2B: one or two follow-up questions per candidate (U2 p. 28 "eine Zusatzfrage", Handbuch p. 63
  "ein bis zwei").
- Teil 2A: the examiner frames the photo ("in einer Zeitschrift gefunden … berichten Sie kurz") and never
  names the topic; "Was für eine Situation zeigt dieses Bild?" asks the candidate to interpret it (U2 p. 33).
- Scores come in fixed steps per criterion (B1 gut, B1, A2 gut, A2, A1, 0, e.g. 5/4/3/2/1/0); each of the two
  examiners scores alone and the result is their average, hence the half points (U2 p. 28–29, 44–47).
  Judge "kriterienbasiert und nicht nach Punktwerten" (U2 p. 47).
- One examiner leads and asks; the other observes. In Teil 3 the candidates plan with each other; the
  examiner only helps if needed (U2 p. 28).
- Total slot ca. 20 min including ca. 4 min for the examiners to confer (U2 p. 28).
- Language criteria over the whole conversation: II Aussprache/Intonation 10, III Flüssigkeit 10,
  IV Korrektheit 15, V Wortschatz 15 (U2 p. 48).
- Result: 75–100 = B1, 35–74.5 = A2, 0–34.5 = unter A2 (U2 p. 48).
- Our simulation: the user is one candidate, the partner and the examiner are voiced (CLAUDE.md §2).

## 6. Scoring and overall result

- Hören + Lesen: 1 point per item, 45 total. **33–45 = B1, 20–32 = A2, 0–19 = unter A2** (U2 p. 47).
- Overall certificate (U2 p. 49, IntTestV § 10):
  - Sprechen unter A2 → no certificate.
  - **B1** = Sprechen B1 + B1 in Hören/Lesen or Schreiben.
  - **A2** = Sprechen at least A2 + at least A2 in Hören/Lesen or Schreiben.
- A per-skill Modelltest shows its own Teilergebnis (B1 / A2 / unter A2). Only the later full
  simulation shows the overall certificate level.

## 7. What changed against the provisional spec (lib/exam/blueprint.ts, TestGerman-based)

| Spec field | Was | Official |
|---|---|---|
| Hören play counts | TODO | once, every Teil (G1) |
| Hören T3 clip length | 29–40 s | 48–70 s (105–145 words) |
| Hören speed | one rate (eleven_v4 ≈ 174 wpm) | per Teil: ≈ 125 / 130 / 150 / 160 wpm |
| Hören flow | user starts each clip | one timed track: number, 10–13 s reading, clip, 10–15 s answering |
| Hören T4 | one clip with 3 opinions, 6 statements | intro + Beispiel + 3 separate statements, 6 sentences a–f, 60 s reading time |
| Lesen T1 | 5 blocks, 1 item each, 90–150 words | 1 directory, 5 items, option c fixed ("anderes …") |
| Lesen T2 | 300–430 words | 8 ads, ≈ 450 words |
| Lesen T3 | 80–120 words | 90–130 words |
| Lesen T4 | 165–230 words | 200–260 words |
| Lesen T5 | 95–105 words | 85–110 words, plus gap (0) Beispiel |
| Sprechen T1 | 3 min | ca. 4 min; 1A + 1B |
| Sprechen T2 | picture TODO | different photo per candidate, A2 and B1 follow-up questions |
| Schreiben length | TODO | no word count; "möglichst viel" |
| Hören pauses | 10/12 s, 4 s after Beispiel | ≈ 12/15 s everywhere (re-measured 2026-10-22) |

## 7a. Originality

`research/dtz-official-situations.md` lists every situation of the official sets (paraphrased). The
generator shows the matching section in every prompt, then checks each Teil twice: no 6 words in a row shared
with the official texts (kept locally in `.unit-cache/official/`, never committed) and a model pass that
compares situations and tested details. Set 1 v1 failed exactly here: Hören re-skinned Übungssatz 2 item by
item without copying a sentence (realism check 2026-10-22).

## 8. Open items

- TODO(hannes): Sprechen 2B question sets: do examiners pick A2 or B1 questions per candidate on the
  fly? U2 lists both; our simulation asks the B1 set and falls back to A2 wording.
- Photos for Sprechen Teil 2 (decided by Hannes 2026-10-22): Pexels API, re-encoded to a compressed web format
  and stored in our own Supabase Storage (never hot-linked).
