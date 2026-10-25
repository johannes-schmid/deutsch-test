# Goethe-/ÖSD-Zertifikat B1: Modelltest 1, plan for approval

**Stand: 24.10.2026** · status: **proposed, waiting for Hannes's approval** · format verified part by part on 2026-10-24
against the Goethe Modellsatz + Übungssatz, ÖSD Übungsmaterialien Band 1 (2026), both Durchführungsbestimmungen and the
official audio (`goethe-oesd-b1.md` §8). Do-not-reuse list: `goethe-oesd-b1-official-situations.md`. Regional words:
`austrian-swiss-glossary.md`. Master plan: `goethe-plan.md`.

## 0. New finding that simplifies the plan

**Goethe and ÖSD publish the same adult sets, and the Modellsatz audio is one recording.** The Goethe MP4 and ÖSD's MP3s
correlate at r ≈ 0.99. The recordings were made in Austrian and German studios, plus a Swiss studio for the Übungssatz, and
ÖSD states its speakers come from D, A and CH. So the real Goethe B1 audio is **not** German-only.

**Proposal (replaces "write once, voice twice" in `goethe-plan.md` §3):**

- **Hören: one D-A-CH recording for both brands,** exactly as the real exam does. Speaker accent follows the text's setting.
- **Lesen and Schreiben:** identical for both brands.
- **Sprechen: rendered twice,** because there the voices are the people at the test centre:
  - Goethe: examiner and partner in DE voices.
  - ÖSD: examiner in an AT voice, partner in an AT or DE voice.

  These are short lines, so the cost is small.
- Content review once, listening review once (plus the ÖSD Sprechen lines).
- This changes the CLAUDE.md §5 accent rule ("Goethe uses DE voices only") **for B1 Hören only**. Decision B1.

---

## 1. Scorecard: official vs our plan vs TestGerman

Scores 0–10, where 10 means indistinguishable from the official format. TestGerman is measured from its 3 "Goethe" + 2
"ÖSD" B1 mocks (one shared bank, `goethe-oesd-b1.md` §8). Our scores rate this plan as it would ship.

| Dimension | Official (verified) | Our set 1 | Ours | TestGerman | TG |
|---|---|---|---|---|---|
| Format / structure | L 5 Teile/30, H 4/30, S 3 tasks, Sp 3 Teile; modules Lesen 65 → Hören ~40 → Schreiben 60, ≥15-min breaks; Sprechen 15 min preparation | Same, incl. examples, item numbering 0–30, module timers, break screens and the preparation screen | **9** | Item and play counts right; Lesen shown as 6 parts; Sprechen T2–3 missing | 6 |
| Answer formats | L3 "0" (exactly 1, mid-list, 3 ads unused); L4 Ja/Nein; H4 speaker a/b/c (moderator = a, owns 1 of 8); L5 items before the text | Same | **9** | "x" instead of 0; H4 adds a "neither" option | 6 |
| Text types & lengths | L1 ~330–350; L2 2 × 190–220 with a source line; L3 ~330; L4 ~470; L5 ~230–250; H1 65–85; H2 ~400; H3 ~460; H4 ~750–800 per play | Same ranges, enforced by the validator | **9** | Lesen fine; H2–4 20–50 % short; H4 a 2-person chat | 6 |
| Audio realism | ~140–150 wpm (105–169); H1 10.5 s reading → situation line → sound cue → text → "noch einmal" → text; H2–4 60 s reading; H4 with music around both plays; 5:00 transfer; overlaps and back-channels | Same rhythm, measured from the official track; continuous ~38-min track; narrator lines as in the official; natural fillers | **8** | One TTS voice for all of T1 in 3 of 5 mocks, gender mismatches, no narrator rhythm or cues | 3 |
| Sprechen | Pair, 15 min preparation; T1 plan with 4 Leitpunkte; T2 choice of 2 topics, 5 slides; T3 partner feedback + question, examiner question on the actual talk | Same, with a live partner in T1 and live T3 questions built from the transcript; round B (partner presents, you give feedback) included | **7** | 6 scripted partner lines; no presentation, no feedback or questions, no preparation | 1 |
| Writing tasks & scoring | A1 ~80 (beschreiben / begründen / Vorschlag); A2 ~80 opinion after a stimulus post; A3 ~40 polite email; 4 criteria A–E, 40/40/20, E rules; copying task wording costs points | Same, incl. the E rules and the copy check | **9** | Task frames right; checklist with invented word minimums | 4 |
| Result | Per module /100, ≥60, Prädikat; 3.33 table for L/H; no compensation; Gesamtzeugnis if all four pass | Same, via the result helper | **10** | 25-point scale, no Prädikat | 4 |
| D-A-CH realism | ~53 % D / 27 % A / 20 % CH by setting; accent follows setting; 1 glossed regional word per set; L4 signatures 4–5 D, 1–2 A, 2 CH | Same mix (§2), AT/CH voices on AT/CH settings, 1–3 regional words per regional text, one glossed word | **8** | DE voices only, almost no regional words | 3 |
| **Total** | | | **69/80** | | **33/80** |

**What keeps us below 10:**
- **Audio:** TTS voices, and a thin AT/CH cast for 10 sets. We also haven't confirmed by ear which official roles are accented: the
  inference that accent follows the setting is low-to-medium confidence (`goethe-oesd-b1.md` §8.4, 5-min listen for Hannes).
- **Sprechen:** the T3 question depends on live transcription and a model step. If that fails, we fall back to a topic-level
  question.

---

## 2. Set 1 content plan

Checked against the official sets (incl. Jugendliche), our free tests (`data/gratis-test/{goethe,oesd}-b1/`) and the TestGerman
bank. Region tags: D / A / CH.

### Lesen (65 min, 30 items)

| Teil | Region | Text | Items / key pattern |
|---|---|---|---|
| 1 | A | Blog: a man from Graz joined a choir at 45: stage fright at the first concert at the end of **Jänner**, a new friend, rehearsals after work, his daughter's reaction. ~340 words, 1–2 Austrian words | Beispiel (R) + 1–6 R/F: 3 R / 3 F, never 3 in a row |
| 2 | D + CH | (a) D: a town library lends tools and sewing machines ("Bibliothek der Dinge"), source line "aus einer deutschen Zeitung". (b) CH: residents of a mountain village run their own shop as a cooperative, source "aus einer Schweizer Zeitschrift", ss spelling. ~200 words each | Beispiel on text (a); 7 and 10 = main idea; skew allowed toward b |
| 3 | mixed | Theme: offers for people new in a town. 10 ads: newcomer city walk (Köln), language café (Linz), club directory, second-hand furniture market, neighbourhood app, childcare exchange (Basel), bike course for adults, sports for beginners, etc. Beispiel + 7 situations | Exactly one **0** at item 16; 3 ads unused, one a near-miss for the 0 |
| 4 | mixed | Question: "Sollen Geschäfte auch am Sonntag öffnen dürfen?" Magazine framing, heading LESERBRIEFE. 8 writers: 5 D, 1 A (Salzburg), 2 CH (Luzern, Basel), signed "Name, Alter, Stadt" | Beispiel + 20–26 Ja/Nein: 3 Ja / 4 Nein |
| 5 | – | Terms of use of a car-sharing service you just joined: booking, key card, fuel, damage, late return. ~240 words. Items printed **before** the text, not in text order | 27–30 a/b/c |

Glossed word for the set: one Austrian word in Lesen 1 with a footnote ("österreichischer Standard für …"), as in the
official sets.

### Hören (~38 min track incl. 5:00 transfer, 30 items)

| Item | Teil · plays | Region · situation | Voices |
|---|---|---|---|
| 0 | T1 · 2× | – · Voicemail from a friend: sharing a car to a concert (Beispiel) | Ela |
| 1–2 | T1 · 2× | D · Radio tip with jingle: a summer reading night at the city library | Laura |
| 3–4 | T1 · 2× | A · Voicemail from the adult education centre in Linz: the course moves to another room, bring the enrolment confirmation | Emilia (AT) |
| 5–6 | T1 · 2× | CH · Announcement with a gong on a lake boat: a stop skipped because of low water, connection by bus | Andres (CH) |
| 7–8 | T1 · 2× | D · Voicemail from a daycare: a closure day for training, emergency care offered | Irene |
| 9–10 | T1 · 2× | D · Radio advert: a furniture store's reopening with offers | Christian |
| 11–15 | T2 · 1× | A · The organiser briefs volunteer helpers before a music festival in Wels: shifts, T-shirts, meal vouchers, meeting point, what to do in an emergency (~400 words) | Alexandra (AT) |
| 16–22 | T3 · 1× | D + CH · On a train to Zürich, two former colleagues meet: she has a new job at a small bakery, he is looking for a flat (~460 words, overlaps, "Mhm") | Lisa (D) + Andres (CH) |
| 0, 23–30 | T4 · 2× | mixed · Radio discussion "Vier-Tage-Woche: gut für alle?": moderator (D), a carpentry-firm owner from Upper Austria (A), a work psychologist from Bern (CH). Music around both plays; ~780 words | Christian (mod) + Gruber (AT) + Mia (CH) |

Key patterns from the official sets:
- **T1:** only 1–2 R of 5, and all a/b/c letters used.
- **T3:** 3–4 R of 7.
- **T4:** the moderator owns exactly 1 of 8 statements, the guests split 3/4, and the Beispiel belongs to a guest.

Pace: 105–169 wpm per text type, with announcements slowest and discussion fastest.

### Schreiben (60 min)

| Aufgabe | Task |
|---|---|
| 1 | Informal email to a friend (~80 words): last Saturday you ran your first 5-km fun run; your friend couldn't come. **Describe** the day, **say why** you want to do it again, **suggest** training together |
| 2 | Guest book after a TV discussion "Sollen Kinder Taschengeld bekommen?" Stimulus post (~45 words, "Petra, Kassel"): kids should earn money with jobs at home. Your opinion, ~80 words |
| 3 | Polite email to your boss Frau Kessler (~40 words): she invited the team to a training day on Friday; apologise and explain why you can't come |

### Sprechen (15 min preparation + ~15 min pair)

| Teil | Material | Live behaviour |
|---|---|---|
| Intro | Greeting; the pair agrees on du or Sie (official, ÖSD Kommentar) | Examiner |
| 1 | Plan together: your elderly neighbour moves to a smaller flat and you both want to help. Leitpunkte: Wann? · Wie viele Helfer? · Transport? · Essen und Getränke? · … | Partner proposes, objects with a reason, counter-proposes; no consensus required |
| 2 | Choose 1 of 2: **"Lernen: online oder im Kurs?"** or **"Haustiere in der Stadtwohnung?"** Five fixed slides (slide 1 has a quote, the title and a photo) | Examiner: intro, reminder not to read out notes |
| 3 | After your talk: partner feedback + 1 question about what you said; examiner asks 1 question. Round B: the partner presents the other topic and you give feedback and ask a question | Questions built from your transcript (live) |

Casting: Goethe render with examiner Irene, examiner 2 Michael and partner Ben. ÖSD render with examiner Alexandra, examiner 2 Gruber
and partner Ben, plus Kathi as an alternative learner partner.

### Region and voice check

- **Region mix by text:** D 9 · A 5 · CH 4 (≈ 50 / 28 / 22 %), matching the official ~53/27/20.
- **AT/CH voices used:** Emilia, Alexandra, Gruber, Andres (2×, not adjacent), Mia. Martin (dialect) and Thomas (maybe) are not
  used. SedaDa is not used until approved.
- **No voice back to back** at a Teil boundary or between sections.

### Cross-skill check

- **Names:** Petra, Frau Kessler, the choir blogger, the H2 organiser, the H4 guests. All distinct, set in the plan before drafting.
- **Themes:**
  - The work-time discussion (H4) and the boss email (S3) share the work domain, but not the topic.
  - The moving help (Sp1) does not match any Hören or Lesen theme.
  - The fun run (S1) vs the library reading night (H1) is no clash.

---

## 3. What has to exist before drafting

1. A `full` spec in `lib/exam/exams/goethe-b1.ts`, with `oesd-b1.ts` pointing to the same sets. It carries the corrected lengths
   and the measured rhythm and pauses (H1 10.5 s, H2–4 60 s, transfer 5:00).
2. `audio.ts`: Teil 1 per-text rhythm, music bed for T4, accent per speaker from the plan.
3. Components:
   - Ja/Nein item
   - "0" no-match label
   - speaker-matching grid with names and roles as column heads
   - items-before-text layout for Lesen 5
   - module flow with break screens
   - 15-min preparation screen
   - presentation screen with a choice of 2 topics and 5 slides
   - T3 live feedback/question flow
   - per-module result with Prädikat

   Design skills first, each shown on `/design/pruefung`.
4. `research/goethe-b1-authoring.md`, then drafting (Opus 5.5, Batches API), a check against the do-not-reuse list and the
   6-word overlap check against the official texts (kept in `.unit-cache/`), audio, and local seeding as a draft.

## 4. Decisions

- **B1.** One D-A-CH Hören recording for both brands (proposed), instead of a DE-only Goethe render? This means a CLAUDE.md §5
  rule change for B1.
- **B2.** ÖSD B1 shows the same Modelltests as Goethe B1 (proposed, since it is the same exam), labelled "gleiche Aufgaben wie
  Goethe-Zertifikat B1"?
- **B3.** Approve the topics above, or swap any?
- **B4.** SedaDa as an extra AT woman: yes, maybe or no after listening (sample in the scratchpad)?
