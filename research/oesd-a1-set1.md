# ÖSD Zertifikat A1 (ZA1): Modelltest 1, plan for approval

**Stand: 24.10.2026** · status: **proposed, waiting for Hannes's approval** · format verified part by part on 2026-10-24
against the Modellsatz (2026 = Broschüre 2024), its transcript and audio, the Durchführungsbestimmungen, the 2026 scoring sheets
and the official Sprechen video (`oesd-a1.md` §9). Do-not-reuse list (official set, TestGerman, our free tests):
`oesd-a1-official-situations.md`. Regional words: `austrian-swiss-glossary.md` §4.

Set 1 = Prüfungssimulation 1: all four skills are planned together, and no topic, name, place or firm repeats across them.
Voices: AT cast; CH only for Swiss-set speakers; one DE voice only for one Germany-set speaker (decision O2).

---

## 1. Scorecard: official vs our plan vs TestGerman

Scores 0–10, where 10 means indistinguishable from the official format. TestGerman is measured from its 5 "ÖSD A1" mocks
(`oesd-a1.md` §9.4). Our scores rate this plan as it would ship, including known limits.

| Dimension | Official (verified) | Our set 1 | Ours | TestGerman | TG |
|---|---|---|---|---|---|
| Format / structure | Written module L 25 → H ca. 10 → S 20 (16 / 15 / 10+1 items); oral module separate: 10 min preparation, then ~7–10 min individual exam with Assessor + Interlokutor | Same: module screens, one section timer each, Hören as one continuous track, a 10-min preparation screen, Sprechen as intro → A1 → A2 → A3 | **9** | Counts right; Lesen as 5 parts, form 7–9 fields, Sprechen 10 solo prompts, no preparation | 5 |
| Answer formats | H1 text number under 6 photos; H2 note sheet ("Was" pre-filled); H3 one tick per row; L1 situation → ad; L2 JA/NEIN; L3 notice → pictogram; S1 typed + tick form | Same, incl. the pre-filled example lines and the 4-box tick group | **9** | Picture panels instead of separate photos; ticks typed as text | 6 |
| Text types & lengths | H1 33–45 w; H2 ~96 w; H3 39–54 w; L1 ads 20–30 w; L2 30–40 w; L3 15–30 w; S1 situation ~47 w; S2 input ~50 w | Same ranges, enforced by the validator (after `oesd-a1.ts` is corrected) | **9** | H3 ~25 % short; L1 up to 2.5× long, L2 ~2× long; L1 as a website | 6 |
| Audio realism | Female narrator, gong between every step, "Text eins …" labels, 2–4 s sound cue per H1 clip, beep around the voicemail, 30/30/10 s previews, 20/60 s check times; 110–195 wpm; AT/DE/CH speakers | Same rhythm, measured from the official track; 9 distinct voices in Hören, gender always matching | **8** | de-DE TTS only; one voice for both roles once; no gong, labels, beeps or cues | 3 |
| Sprechen | Topic card 4 of 6 + 3 Interlokutor questions; choose 1 of 3 photos + 2 questions; role choice, then ~8-turn role-play led by the Interlokutor | Same, with a live Interlokutor (follow-ups built from your answer) and a branching role-play for the chosen photo and role | **7** | No card, no choices, 2 isolated TTS questions per picture | 2 |
| Writing tasks & scoring | S1 10 items → 5 pts by table; S2 ~30 w, TL deductions, A, K 1, T 1, L 4, F 4, n. b. | Same rubric and tables; S1 scored by rules, S2 by the rubric | **9** | Prompts close; AI checklist with invented minimum and structure points | 4 |
| Result | Written /75 (L ≥ 6, H ≥ 6, S ≥ 4, total ≥ 38), oral /25 ≥ 12, optional /100 ≥ 50, Prädikat | Same, via the result helper; labelled as a practice result | **10** | 50 % per section, 25 points each | 3 |
| Austrian realism | Texts from A/D/CH (≈ 40 / 30 / 30 by cue); AT realia (*-gasse*, 0664/0676, Vienna district postcode), CHF, `.de/.at/.ch`; "das E-Mail" in the instructions; no glossed words | Same mix (§2.5), AT/CH voices by setting, 1–2 regional words per AT/CH text, never keyed | **8** | AT towns and words, but de-DE voices | 4 |
| **Total** | | | **69/80** | | **33/80** |

**What keeps us below 10:**
- **Audio:** TTS. The AT cast is thin: 4 AT voices carry 13 of the 17 speaking roles in Hören, so voices repeat across clips (never inside a dialogue or across a boundary). Martin's accent is unverified (O3). Which official speakers are AT/DE/CH is still unverified by ear.
- **Sprechen:** a model plays the Interlokutor. The ~8-turn role-play needs a partner that reacts to the candidate's role and answers; if live generation fails, we fall back to scripted turns.
- **Pictures:** H1 and Sprechen need real-looking photos of exactly two people in a clear service or everyday scene. Stock photos may not fit every script; the script is then refit to the photo (`images.ts`).

---

## 2. Set 1 content plan

Checked against the official MS, TestGerman's 5 mocks and our free test (`oesd-a1-official-situations.md`). Region tags A / D / CH.

### 2.1 Hören (one track ~11.5 min, 15 items)

Narrator: **Seda** (`woman_seda_at`, all instructions; title and "Ende des Prüfungsteils Hören" also Seda, see O1). Gong = xylophone (~6 s).

| Item | Aufgabe · plays | Region · situation | Tested detail / key | Voices | Sound cue · length |
|---|---|---|---|---|---|
| 1 | A1 · 1× | A · Ticket inspection on a regional train: the passenger has the ticket on her phone, the conductor checks it, asks where she changes | photo **B** (conductor + passenger on a train) | Gruber (conductor) + Alexandra (passenger) | train rolling, door chime · 35–40 w |
| 2 | A1 · 1× | A · Market stall: a man buys apricots ("Marillen", unkeyed) and asks the price per kilo; the seller says "Grüß Gott" | photo **E** (fruit stall) | Emilia (seller) + Martin (customer) | market murmur · 35–40 w |
| 3 | A1 · 1× | CH · Cinema box office: two "Billette" for the 8 p.m. film, a row near the back, "Merci" | photo **A** (cinema till) | Mia (cashier) + Andres (customer) | lobby murmur · 35–40 w |
| 4 | A1 · 1× | – · Two friends paint a wall in a new flat: colour, a second coat, a break for pizza | photo **F** (two people with paint rollers) | Emilia + Gruber (du) | roller on a wall · 35–45 w |
| 5 | A1 · 1× | – · A tourist asks a passer-by to take a photo of her by a river bridge; "a bit to the left", thanks | photo **D** (one person taking a photo of another) | Alexandra (tourist) + Martin (passer-by) | water, birds · 35–40 w |
| – | A1 | extra photo **C**: two people at a tram-stop ticket machine (near-miss for 1 and 3) | – | – | – |
| 6–10 | A2 · 2× | A · **Lost-property office** voicemail: your rucksack from the tram has been found; pick it up | Was: *Rucksack abholen* (printed example) · Wann: am **Mittwoch** · **21.** Jänner (printed), um **10** Uhr (1+1) · Wo: in der **Lerchen**gasse 5 (spelled) · Tel. 0699 / **4 3 8 1 2 7 0**. Distractors: Monday closed, open until 12, a reference number | Gruber (Herr Pichler) | beep before and after · 95–100 w at ~110–120 wpm |
| 11–15 | A3 · 1× | Street poll: "Welche Jahreszeit mögen Sie am liebsten?" Columns Frühling · Sommer · Herbst · Winter | 1 (f) A **Herbst** (colours, long walks; summer is too hot for her) · 2 (m) A **Winter** (cold clear air, warm tea, quiet streets; spring is too wet) · 3 (f) CH **Sommer** (long evenings, rides her "Velo" to work, unkeyed; winter too dark) · 4 (m) A **Frühling** (his small garden, the first sun; autumn is nice too, but) · 5 (f) D **Herbst** (from Leipzig; apples and mushrooms; summer holidays are nice, but) | interviewer Emilia · 1 Alexandra · 2 Martin · 3 Heidi (CH) · 4 Gruber · 5 Irene (DE, O2) | light street noise · 40–55 w each |

Each A3 speaker names 2–3 seasons and settles on one late in the answer, as in the MS. No answer mentions skiing, lakes or Christmas markets, so A3 doesn't touch H1 clip 5 or the Sprechen photos.

**Track plan (from the measured MS):** title → gong → "Aufgabe eins" + preview → 30 s → Situation (spoken) → gong → 5 × ("Text n." → cue → dialogue → ~2 s) → gong · "Aufgabe zwei" → 30 s → Situation → gong + beep → message → beep + gong → "zum zweiten Mal" → gong + beep → message → beep + gong → "zwanzig Sekunden" → 20 s → gong · "Aufgabe drei" → 10 s → Situation → gong → interviewer → 5 × ("Text n." → answer) → gong → "sechzig Sekunden" → 60 s → gong → "Ende des Prüfungsteils Hören" → end gong.

**Voice check:** no voice twice inside a dialogue; no voice at both sides of a boundary (clip 1 Gruber/Alexandra → clip 2 Emilia/Martin → clip 3 CH → clip 4 Emilia/Gruber → clip 5 Alexandra/Martin; narrator between Aufgaben). Every pair is different. Gender matches every role and every A3 row label (f, m, f, m, f).

### 2.2 Lesen (25 min, 16 items)

| Aufgabe | Texts | Items / key |
|---|---|---|
| 1 | Situations: A you need new glasses · B your daughter's birthday: you need a cake, no time to bake · C you want to sell clothes you no longer wear · D your mother visits for a week; she needs a cheap room · E your son needs help with maths. Ads (20–30 w): **1** CH guest house in Lucerne, rooms from CHF 85.– with breakfast · **2** A adult-education programme in Linz: cake baking, maths for adults, sewing (**extra**, keyword near-miss for B, C, E) · **3** A optician in Graz, eye test free · **4** D maths tutoring for pupils, Rosenheim (.de email) · **5** D pastry shop in Nuremberg, cakes to order (e.g. a curd-cheese cake) · **6** D second-hand shop in Passau buys clothes | A3 · B5 · C6 · D1 · E4; ad 2 unused |
| 2 | **1** A "Old town on foot": daily city walk in Salzburg 11:00, 90 min, €14, children free, meet at the fountain · **2** D open day at a nursery in Regensburg: Saturday 10–14, play and crafts, no sign-up, drinks free · **3** CH lunch menu at a restaurant in Bern: Mon–Fri 11.30–14.00, menu CHF 18.50 with salad, take-away CHF 2.– cheaper (ss spelling) | Q1 tour in the evening? **N** · Q2 children pay? **N** · Q3 must sign up? **N** · Q4 drinks free? **J** · Q5 menu on Saturday? **N** · Q6 take-away cheaper? **J** → 2 J / 4 N |
| 3 | Notices "Liebe …!": **A** bottle bank: white and coloured glass only, no lids · **B** reading room: please be quiet, students are learning · **C** taxi rank: wait here, taxis every 5 minutes, phone number · **D** hotel guests: breakfast on the 1st floor, 7–10 · **E** parents: baby-changing room on the ground floor ("Erdgeschoß"). Pictograms: 1 baby · 2 bottle bank · 3 rubbish bin (**extra**, near-miss for A) · 4 taxi · 5 coffee cup · 6 finger on lips | A2 · B6 · C4 · D5 · E1; picture 3 unused |

### 2.3 Schreiben (20 min)

| Aufgabe | Task | Key / points |
|---|---|---|
| 1 | Situation (~45–50 w, A): your friend **Nadia Haddad** from Wels wants to do a first-aid course in March, needed for her driving licence and because she has a baby; Saturdays only, mornings; she pays by bank transfer; born 3 **Jänner** 1994; phone given. Form "Erste-Hilfe-Kurs · Anmeldung": surname **pre-filled** · first name · birth date · place of residence · phone · month (written: 5) · day Sa/So · time morning/afternoon · course for: ❑ Führerschein ❑ Arbeit ❑ Kinder ❑ Sport (2 right) · payment cash/transfer (ticks: 5) | 10 → 5 pts by the official table; any D-A-CH date format |
| 2 | Input email (~50 w, D) from your friend **Tamara** in Munich: a picnic in a big park on Sunday. "Hast du am Sonntag Zeit? Was bringst du zum Essen mit? Wie kommst du zum Park?" Instruction "Antworten Sie Tamara. Schreiben Sie circa 30 Wörter." Printed opener: "Liebe Tamara, danke für dein E-Mail. Hier meine Antworten:" | TL / A / K / T / L / F (`oesd-a1.md` §4) |

### 2.4 Sprechen (10 min preparation + ~8 min individual exam)

| Aufgabe | Material | Live behaviour |
|---|---|---|
| Intro | Greeting; both examiners introduce themselves ("Herr Leitner", "Frau Moser"); name, how are you, tasks understood (not scored) | Assessor **Gruber** |
| 1 | Topic card: **Wohnort? · Wohnung? · Familie? · Sprachen? · Arbeit? · Wochenende?** Choose 4 | Interlokutor **Alexandra**: back-channels, then **3 follow-up questions** built from what you said |
| 2 | Choose 1 of 3 photos: **1** mobile-phone shop (saleswoman + customer at a counter) · **2** ski-hire counter (employee hands over boots + skier) · **3** dry cleaner's (*Putzerei*: customer hands in a coat) | Assessor asks which photo; Interlokutor asks **2 questions** about it |
| 3 | Role-play of the chosen photo; the Assessor asks which role you take | Interlokutor plays the other role, **~8 turns** (e.g. dry cleaner: what, when ready, price, a stain, pay now or later, name for the ticket) |

### 2.5 Region and vocabulary check

- **Region by cued text:** D 6 (L1 ×3, L2, H3 speaker, S2) · A 9 (L1 ×2, L2, L3 ×2, H1 ×2, H2, S1) · CH 4 (L1, L2, H1, H3) → ~32 / 47 / 21 %. The official MS is ~30 / 40 / 30; our CH is a bit lower and AT a bit higher, in line with the glossary's ZA1/ZA2 rule (≈ 40 / 40 / 20).
- **Regional words (glossary §4, all unkeyed):** *Grüß Gott, Marillen* (H1 clip 2) · *Billett, Merci* (H1 clip 3, CH) · *Jänner* (H2 note sheet and message; S1 birth date) · *Erdgeschoß* (L3 E) · *Velo* (H3 speaker 3, CH) · *Putzerei* (Sprechen photo 3 label; the instruction also says "Reinigung"). CH texts use ss and CHF with `.–`; AT phone prefixes 0699 / 0664 only.
- **Instructions:** ÖSD wording pattern, "das E-Mail"; no glossed word (the MS has none).

### 2.6 Cross-skill check

- **Names:** Herr Pichler (H2), Nadia Haddad (S1), Tamara (S2), Herr Leitner / Frau Moser (Sprechen). No name from the official set (Maier, Torres, Rafaela), TestGerman or our free test.
- **Places:** Lucerne, Linz, Graz, Rosenheim, Nuremberg, Passau (L1); Salzburg, Regensburg, Bern (L2); Wels (S1); Munich (S2). None repeats.
- **Themes:** shopping appears as a market stall (H1), an optician/pastry/second-hand ad (L1) and a dry cleaner (Sp) — different situations. No lake, ski, cinema or tram theme appears twice (H1 cinema ≠ Sp ski hire; H2 tram is only where the rucksack was lost).

---

## 3. What has to exist before drafting

1. **`lib/exam/exams/oesd-a1.ts` `full` spec** with the corrected numbers (H1 33–45 w, H2 95–100 w at ~115 wpm, H3 40–55 w) and the measured track rhythm. The file still has the old numbers.
2. **Pipeline:** `research/oesd-a1-authoring.md` (JSON shape guide), `scripts/modelltest/plan-oesd-a1.ts` (one plan entry per set across all skills, as for telc B1) and `clash.ts` rules for names/places.
3. **Components** (design skills first; each shown on `/design/pruefung`):
   - photo grid A–F with a "Text Nr." box under each photo (text → photo, one extra, a number may be used twice)
   - situation → ad matching in a newspaper layout (check `MatchItem` with 6 ads and one extra)
   - notice → pictogram matching (6 pictograms, one extra)
   - note sheet with a pre-filled example line and a two-gap line (`GapItem` "Notiz" exists; scoring rules are new)
   - one-tick-per-row grid (5 × 4)
   - form with typed fields **and tick boxes**, incl. a 4-box group with 2 right answers (`FormSheet` has typed/pick fields, no multi-tick)
   - email reply with a printed opener
   - Sprechen: topic card (choose 4 of 6), photo choice (1 of 3) inside the 10-min preparation screen, role choice, live Interlokutor turns
   - result view per module with subtest minima and Prädikat
4. **Scoring helpers:** the ZA1 conversion tables (5 → 10 … ; 6 → 10 … 1–0 → 0; form 10 → 5 …), the 1+1 note line, exact match for the spelled word and the phone number, the S2 rubric with deductions and n. b., the Sprechen rubric (4/4/4/5/4/4).
5. **Assets:** 6 photos for H1, 3 for Sprechen (Pexels → WebP via `images.ts`), 6 pictograms for L3, sound cues (train, market, cinema lobby, paint roller, river), gong and voicemail beep.

## 4. Open decisions

- **O1.** Narrator: **Seda** (`woman_seda_at`) for all instructions, as the official female narrator? The MS uses a separate male voice for the title and closing line; we could add Gruber there.
- **O2.** One **Germany-set speaker with a DE voice** (Irene, H3 row 5)? ÖSD states its speakers come from A, D and CH, but the MS has no clearly German-set speaker. Alternative: Seda (narrator) voices row 5.
- **O3.** **Martin** (`man_martin_at`, "stronger dialect") has 3 roles here. Re-listen; if too dialectal, Andres can't replace him (not Swiss-set), so the fallback is fewer male roles or a new AT man.
- **O4.** Sprechen role choice: let the candidate choose either role (official, per the video), or fix the candidate as the customer to keep the role-play model simpler?
- **O5.** Approve the topics above, or swap any?
