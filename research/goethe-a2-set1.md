# Goethe-Zertifikat A2: Modelltest 1, plan for approval

**Stand: 24.10.2026** · status: **proposed, waiting for Hannes's approval** · format verified part by part on 2026-10-24
against the Übungssatz 01, the Modellsatz and the Durchführungsbestimmungen (`goethe-a2.md` §11). Do-not-reuse list:
`goethe-a2-official-situations.md`. Master plan: `goethe-plan.md`.

Set 1 = Prüfungssimulation 1: all four skills are planned together, and no topic, name, place or firm repeats across them.
Voices: DE cast only (CLAUDE.md §5). Narrator Mark.

---

## 1. Scorecard: official vs our plan vs TestGerman

Scores 0–10, where 10 means indistinguishable from the official format. TestGerman scores are measured from their two Goethe
A2 mocks (`goethe-a2.md` §11.4). Our scores rate this plan as it would ship, including known limits.

| Dimension | Official (verified) | Our set 1 | Ours | TestGerman | TG |
|---|---|---|---|---|---|
| Format / structure | L 4 Teile/20, H 4/20, S 2, Sp 3; Beispiel in L1, L2, L4, H2, H4; items 1–20 per skill; order L → H → S; one timer per section | Same, incl. every Beispiel (H2/H4 as their own clips), items 1–20, one section timer | **9** | No Beispiel in L1/L2/L4 or audio, items 21–40, Sprechen split into 16 prompts | 6 |
| Answer formats | H2: 9 pictures; H3: 3 pictures per item; L2: c = "anderer Stock"/"andere Halle"; L4: X; H4: Ja/Nein | Same: H2 9 pictures, H3 picture options throughout, L2 "andere Halle", L4 X, H4 Ja/Nein | **9** | Text where 10 of 20 Hören items use pictures; L2 says "andere Etage" | 5 |
| Text types & lengths | H1 43–64 words; H2 220–250; H3 42–66; H4 195–215; L1 180–220; L2 directory ~120 or programme ~200; L3 ~256; L4 ~220 | Same ranges, enforced by the validator; L2 as an event programme (the free test already uses a store directory) | **9** | H1 ~40 % short, H4 ~40 % long, L2 never a programme | 6 |
| Audio realism | 145–170 wpm; T1 and T4 twice; jingles on radio items, phone rings; narrator "Sie hören jetzt das Beispiel / den Text" + 2–3.5 s; distinct voices | Same pace, plays and sound design; 11 distinct voices, each matching the speaker's gender; one continuous track with reading pauses | **8** | Plays right, but one voice for most T1 clips, no narrator, jingles or rings | 4 |
| Sprechen | Pair, no preparation; T1 4+4 cards; T2 card + 1–2 examiner follow-ups; T3 hidden partner calendar, ends in agreement | Live partner and live examiner follow-ups (as in Start Deutsch 1); T3 with a hidden partner calendar that has exactly one shared free hour | **7** | Solo prompts, no follow-ups, scripted partner | 2 |
| Writing tasks & scoring | 20–30 / 30–40 words, 3 Leitpunkte; AE + Sprache A–E; < 50 % words or off-topic → 0; round, then ×1.25 | Same tasks and the official rubric incl. the zero rules and rounding | **9** | Prompts right, generic AI checklist | 6 |
| Result | /100; bestanden at ≥ 60 **and** ≥ 45/75 written **and** ≥ 15/25 oral; Prädikat | Same, via the result helper; labelled as a practice result | **10** | Two-part rule encoded; grade not shown | 8 |
| **Total** | | | **61/70** | | **37/70** |

**What keeps us below 10:**
- **Audio:** TTS voices, and the Übungssatz exam master is not measured yet (reading pauses, gap between the two plays). Until then we use the timings measured on the Modellsatz clips.
- **Sprechen:** the T3 negotiation needs a new partner model that checks each proposal against its own hidden calendar.
- **Pictures:** H2 and H3 need clear drawings or photos, and the current pictograms don't cover activities.
- **Format:** answer-sheet transfer time is kept inside the official clock (master plan D5).

---

## 2. Set 1 content plan

Every topic below was checked against the official ÜS/MS situations, TestGerman's cloned storylines and our free test
(`data/gratis-test/goethe-a2/`).

### Hören (~30 min track, 20 items)

| Item | Teil · plays | Situation / text type | Tested detail → key | Voices |
|---|---|---|---|---|
| 1 | T1 · 2× | Radio tip with jingle: a children's clothes flea market moves from the market square to the school yard because of a building site | Where is it? → b | Laura |
| 2 | T1 · 2× | Voicemail from a friend lending his bike for the weekend: the lock is broken, bring your own | What should you bring? → a | Simon |
| 3 | T1 · 2× | Voicemail from a dental practice: appointment moved from Thursday to Tuesday, 8:30 | When is the new appointment? → c | Irene |
| 4 | T1 · 2× | Radio traffic report with jingle: a road closed because of a cycling race, bus line on a detour | Which road is closed? → b | Christian |
| 5 | T1 · 2× | Announcement in an indoor pool: the big pool closes at 17:00 today, the children's pool and sauna stay open | What closes early? → a | Ela |
| 0, 6–10 | T2 · 1× | A woman tells a colleague how she prepares her move next week, day by day (Mon–Sat). Example: Monday = pack books. 9 pictures: boxes, painting a wall, internet technician, van rental, delivered washing machine, cleaning, + 3 mentioned-but-not-done (selling the sofa, a goodbye party, a plant to the neighbour) | Day → picture | Lisa + Ben |
| 11 | T3 · 1× | Phone with ring: ordering a cake at a bakery for a children's birthday | Which cake? (3 pictures) | Ela + Johann |
| 12 | T3 · 1× | Two colleagues: what to bring to a team picnic | What does she bring? (salad / drinks / dessert) | Christian + Laura |
| 13 | T3 · 1× | Phone with ring: two friends agree where to meet before the cinema | Where do they meet? | Simon + Irene |
| 14 | T3 · 1× | In a shop: a man looks for a bag for a short trip | Which bag does he buy? | Michael + Ela |
| 15 | T3 · 1× | Phone with ring: holiday flat booking | What costs extra? (breakfast / parking / bikes) | Laura + Ben |
| 0, 16–20 | T4 · 2× | Radio interview: a retired electrician repairs lamps and bikes in a repair café (when, who comes, what he can't repair, his plans). Example clip first | Ja/Nein: 3 Ja, 2 Nein, max run 2 | Irene (presenter) + Johann |

Key pattern: no even a/b/c spread (the official sets don't have one), runs of at most 3, and every T1/T3 clip mentions all
three options. Sound: jingles on 1 and 4, rings on 11, 13 and 15, pool ambience on 5.

### Lesen (30 min, 20 items)

| Teil | Text | Items |
|---|---|---|
| 1 | Newspaper article (~200 words): a supermarket in a medium-sized town has a vegetable garden on its roof, looked after by neighbours and a school class | Beispiel + 1–5 a/b/c |
| 2 | **Event programme** of a home and building fair, Halls 1–5 with times. c = "andere Halle" (right in 2 of 5) | Beispiel + 6–10 |
| 3 | Informal email (~250 words): Mira writes about a week on a farm with her children (animals, rain day, the farmer's daughter, plans to come back in autumn) | 11–15 a/b/c, no Beispiel |
| 4 | 6 website ads on **sport and exercise** (yoga in the park, climbing hall, running group, swimming lessons for adults, dance school, bike shop with a course). Beispiel person + 5 people; one person is X (a near-miss ad); one ad stays unused | Beispiel + 16–20 |

### Schreiben (30 min)

| Teil | Task | Leitpunkte |
|---|---|---|
| 1 | SMS to your friend Nils (du, 20–30 words): it's your birthday tomorrow and you are having a picnic in the park | invite him · say when and where · ask him to bring something |
| 2 | Email to your neighbour Frau Lorenz (Sie, 30–40 words): she is going on holiday and asked you to water her plants | say yes · say you are away on Wednesday · ask where the key is |

### Sprechen (~15 min, pair, live partner and examiner)

| Teil | Material | Partner / examiner |
|---|---|---|
| Intro | Greeting, name, where you come from (not scored) | Examiner Irene |
| 1 | "Fragen zur Person". Your cards: Sprachen · Wohnung · Sport · Urlaub. Partner's hidden cards: Geschwister · Essen · Handy · Freunde. The examiner models one exchange first: "Woher kommen Sie?" | Partner Kathi (learner voice, a plausible fellow candidate). She asks 4, answers 4, strictly alternating |
| 2 | Your card: "Wie kaufen Sie ein?" (Wo? · Was? · Wann? · Online?). The partner speaks first on her own card, "Was machen Sie gern draußen?" | Examiner reads the card question, then asks 1–2 follow-ups built from what you said (live) |
| 3 | **Calendar**: a friend is moving; you both want to help him paint one afternoon this Saturday. Two different calendars, 7:00–21:00 hourly, 6 entries each, exactly one shared free slot | Partner proposes, rejects with a reason from her hidden calendar ("da kann ich nicht, da …") and counter-proposes, then agrees |

Set 2 then uses a mind map for Teil 3 and a store directory for Lesen Teil 2. Each form is used in alternate sets.

### Cross-skill check (set 1)

People's names: Nils, Frau Lorenz, Mira, Kathi (partner voice only), a presenter in H4; no duplicates. Themes:
- Lesen and Schreiben share no theme.
- The Hören move (T2) and the Sprechen painting help both involve moving. **Clash → Sprechen Teil 3 switches to "help a friend
  build a cupboard" if you prefer zero overlap** (decision A1).

---

## 3. What has to exist before drafting

1. `lib/exam/exams/goethe-a2.ts`: a `full` spec with the corrected numbers (Lesen T1 180–220 words, Hören T3 42–66 words,
   option c "anderer Stock"/"andere Halle", 145–170 wpm, Modellsatz pauses). The file still has the old numbers.
2. Components:
   - Ja/Nein item
   - 9-picture matching on a day grid with the Beispiel
   - picture a/b/c in Hören T3
   - event-programme board for Lesen T2
   - calendar planning screen with a hidden partner calendar
   - result view with the two-part rule

   Design skills first; each goes on `/design/pruefung`.
3. Pictures: drawings for H2 and H3 (pictogram set extended, or Pexels photos via `images.ts`; decision A2).
4. `research/goethe-a2-authoring.md` (the JSON shape guide), then drafting with Opus 5.5 on the Batches API, `audio.ts`
   with the DE cast, and seeding locally as a draft.

## 4. Decisions

- **A1.** Sprechen T3 theme: painting help (as planned) or a cupboard to build (no overlap with the Hören move)?
- **A2.** Pictures for H2/H3: drawn pictograms (consistent, light on mobile) or photos (closer to the real booklet's drawings? the
  official booklet uses **drawings**, so pictograms/drawings are closer)?
- **A3.** Approve the topics above, or swap any?
