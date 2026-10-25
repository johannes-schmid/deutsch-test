# Goethe (+ ÖSD B1) Modelltests: master plan

**Stand: 24.10.2026** · proposed, awaiting Hannes's decisions in §6 · format facts in `start-deutsch-1.md`, `goethe-a2.md`,
`goethe-oesd-b1.md` (all checked against the official PDFs on 2026-10-12; web re-check 2026-10-24 found no format change).

## 1. Which exams are really the same

| Level | Same exam (one blueprint) | A different exam (own blueprint) | Evidence |
|---|---|---|---|
| **A1** | **Goethe-Zertifikat A1: Start Deutsch 1 = telc Deutsch A1 (Start Deutsch 1).** Jointly developed by Goethe and telc: same Teile, item counts, play counts, rubrics, even a shared item pool. Only the score scale (/100 vs /60) and wording differ. | ÖSD Zertifikat A1: individual Sprechen with a photo, Hören note-taking, 16 Lesen items, its own minimums | `start-deutsch-1.md` §2, `oesd-a1.md` §1 |
| **A2** | none | **Goethe-Zertifikat A2** ≠ **telc Deutsch A2 (Start Deutsch 2)** ≠ ÖSD Zertifikat A2 | `goethe-a2.md` §1, `oesd-a2.md` §1 |
| **B1** | **Goethe-Zertifikat B1 = ÖSD Zertifikat B1.** Jointly developed by Goethe, ÖSD and Uni Fribourg and "offered worldwide under either name". Same Teile, items, timings, weights and pass rule; only certificate admin and rater moderation differ. | telc Deutsch B1 (Zertifikat Deutsch): Sprachbausteine, all-R/F Hören, 1 email, 300 points | `goethe-oesd-b1.md` §2, `telc-b1.md` §2 |

**Why A2 looks the same but isn't:** Start Deutsch 2 was the joint Goethe/telc A2 exam. Goethe's own Übungssatz says the
Goethe-Zertifikat A2 "löst seit 2015 die Prüfung Start Deutsch 2 ab". Goethe still uses the old URL slug (`gzsd2`) and
caption on some pages, which makes the two look like one exam. telc kept the old format and still sells it as
"telc Deutsch A2 (Start Deutsch 2)". The formats now differ on every axis: 4+4 Teile (20+20 items) vs 3+3 (15+15), two
free texts vs a form plus a letter, pass rule 45/75 + 15/25 vs 36/60, and the Hören conversation is played once at Goethe
but twice at telc.

**What that means for the build:**

| Exam | Status today | Work left |
|---|---|---|
| Goethe A1 = Start Deutsch 1 | Sets 1–10 drafted (`data/modelltest/start-deutsch-1/`), set 1 in the official format | Review only. Shown under the Goethe family already (`lib/exams.ts` FAMILIES) |
| **Goethe-Zertifikat A2** | Free-test taster only (`data/gratis-test/goethe-a2/`), no `full` spec | **Full build: sets 1–10** |
| **Goethe-Zertifikat B1** | Free-test taster only, no `full` spec | **Full build: sets 1–10** |
| **ÖSD Zertifikat B1** | Free-test taster with its own texts | **Derived from Goethe B1** (§3): same items, Austrian/Swiss voices |
| ÖSD A1, ÖSD A2 | Free-test tasters | Separate exams; own pipeline later (§7). Voice swapping does not work here |

---

## 2. Format checklist per exam (what the validator enforces)

Every item ships only if its set passes these checks (`validateSet` + the per-exam check script). A deviation is a bug.

### Goethe-Zertifikat A2 (`goethe-a2.md`)

| Skill | Teil | Items · format | Plays / time | Notes the generator must hit |
|---|---|---|---|---|
| Lesen 30 min | 1 | 5 · a/b/c | one 30-min timer | press article ~200–250 words |
| | 2 | 5 · a / b / c "anderes Stockwerk/Halle" | | directory or event programme |
| | 3 | 5 · a/b/c | | informal email ~250 words |
| | 4 | 5 · ads a–f + X | | 6 ads, example consumes one, exactly 1 X |
| Hören ~30 min | 1 | 5 · a/b/c | **2×** | radio, voicemail, announcements, 45–65 words |
| | 2 | 5 · match to **9 pictures** a–i | **1×** | one dialogue (m+f) ~260 words, example uses one picture |
| | 3 | 5 · a/b/c, **picture or text options** | **1×** | 5 short dialogues 65–75 words |
| | 4 | 5 · **Ja/Nein** | **2×** | radio interview ~230 words |
| Schreiben 30 min | 1 | SMS to a friend (du), 3 points | | **20–30 words** |
| | 2 | email to boss/hotel/office (Sie), 3 points | | **30–40 words** |
| Sprechen ~15 min, pair, no prep | 1 | 4 questions asked + 4 answered from keyword cards | | partner asks from **own hidden** cards |
| | 2 | card: question + 4 keywords, then 1–2 examiner follow-ups | | partner silent |
| | 3 | plan together: two **different** calendars or a mind map | | partner negotiates from a hidden calendar |
| Result | | /100: bestanden at ≥60 **and** ≥45/75 written **and** ≥15/25 oral, grade | | |

### Goethe-/ÖSD-Zertifikat B1 (`goethe-oesd-b1.md`)

| Skill | Teil | Items · format | Plays / time | Notes the generator must hit |
|---|---|---|---|---|
| Lesen 65 min | 1 | 6 · R/F | free order of Teile | blog or personal email ~330 words, with feelings |
| | 2 | 2 texts × 3 · a/b/c | | two press texts ~250 words each |
| | 3 | 7 · ads a–j or **0** | | 10 ads on one theme, exactly one "0", each ad once |
| | 4 | 7 · **Ja/Nein** ("Ist die Person für …?") | | 7 + example comments ~60 words, signed name, age, city in **D/A/CH** |
| | 5 | 4 · a/b/c sentence endings | | house rules or instructions ~250 words |
| Hören ~40 min | 1 | 5 texts × (R/F + a/b/c) | **2×**, 10 s reading | voicemail, Durchsage, radio, advert, 70–100 words |
| | 2 | 5 · a/b/c | **1×**, 60 s reading | monologue to an audience ~420 words (~3 min) |
| | 3 | 7 · R/F | **1×**, 60 s reading | dialogue m+f in a public place ~480 words |
| | 4 | 8 · speaker a/b/c | **2×**, 60 s reading | radio discussion, **3 people** (moderator + 2 guests) ~780 words |
| Schreiben 60 min | 1 | informal email, 3 fixed Leitpunkte (beschreiben / begründen / Vorschlag) | | ~80 words |
| | 2 | forum/guest-book opinion after a stimulus post (~45 words) | | ~80 words |
| | 3 | polite email to a formally known person (apologise/ask) | | ~40 words |
| Sprechen 15 min prep + ~15 min, pair | 1 | plan together, 4 Leitpunkte | ~3 min | partner proposes, objects, counter-proposes |
| | 2 | presentation, **choice of 2 topics**, 5 fixed slides | ~3–4 min | partner silent |
| | 3 | partner feedback + 1 question, examiner question | ~1–2 min | question must refer to what the candidate said (live) |
| Result | | **per module** /100, bestanden at 60, Prädikat; no compensation | | Gesamtzeugnis when all four pass |

---

## 3. Goethe B1 → ÖSD B1: write once, voice twice

> **Superseded 2026-10-24 for Hören:** Goethe and ÖSD publish the same sets with one shared D-A-CH audio recording
> (`goethe-oesd-b1.md` §8.1). Proposal now: one mixed Hören render for both brands, with only Sprechen rendered twice.
> See `goethe-oesd-b1-set1.md` §0.

**The idea:** the real exam is one exam under two names, and the official material already mixes German, Austrian and
Swiss settings (Goethe's own Übungssatz has a letter from Vienna and forum writers from Bern and Salzburg; ÖSD states its
speakers come from AT, DE and CH, in standard German with a light accent and no dialect). So we author **one** set *n*
and render it twice.

1. **Plan with a D-A-CH mix per set.** The B1 plan gives every text and speaker a `region: de | at | ch`, with about 60 %
   DE, 25 % AT and 15 % CH, as in the official material. Places, prices (€ / CHF) and names follow the region. Regional
   words appear only when the context makes them clear, as the Übungssatz does. This makes each text valid for both
   brands.
2. **Text is shared.** `data/modelltest/goethe-b1/*.json` is the single source. Lesen and Schreiben for ÖSD B1 are the
   same blocks (ids aliased, no copy). Content is reviewed **once**.
3. **Audio is rendered twice:**
   - `goethe-b1`: DE voices only, under the current accent rule (CLAUDE.md §5), unless decision D2 changes that.
   - `oesd-b1`: each speaker gets a voice from their `region`. The narrator and examiner are AT.
   - A small script (`scripts/modelltest/recast.ts --from goethe-b1 --to oesd-b1`) writes the ÖSD cast map and calls
     `audio.ts`. No Claude call; ElevenLabs cost only.
4. **Review for ÖSD = listening only.** The text review carries over; Hannes checks that the ÖSD track sounds right.
5. **In the portal:** ÖSD B1 Modelltest *n* says "Gleiche Aufgaben wie Goethe-Zertifikat B1 Modelltest *n*, mit Stimmen
   aus Österreich und der Schweiz". That's honest, since it is one exam. **Note:** this reverses the free-test choice
   (the two B1 tasters use different texts so they don't feel identical). That choice can stay for the free tests.

### Voice check (from `data/tts-voices.json` + CLAUDE.md §5)

What one ÖSD B1 set needs at most: narrator, 5 + 1 Teil 1 speakers (mixed), 1 Teil 2 speaker, 2 Teil 3 speakers (m + f),
3 Teil 4 speakers, and in Sprechen 2 examiners + a partner. About 40 % of these are AT/CH:

| Accent | Approved | Gap |
|---|---|---|
| AT men | `man_gruber_at` (young), `man_martin_at` (middle, **stronger dialect**) | ÖSD rules out dialect, so Martin needs a re-listen. Without him only one AT man is left. **No older AT man** |
| AT women | `woman_alexandra_at`, `woman_emilia_at` (both middle) | **No young or older AT woman** |
| CH women | `woman_heidi_ch`, `woman_mia_ch` (both middle) | no young/older |
| CH men | `man_andres_ch` (middle), `man_thomas_ch` (**maybe**) | Thomas not yet approved |

**Verdict:** enough to render ÖSD B1 sets 1–2 without a voice back to back in one set. Across 10 sets the same two AT women
would carry every Austrian role, which is the "only Ben" problem again. **Proposal:** a listening round for 4 more voices
(older AT man, young AT woman, older AT woman, young CH man), with yes/maybe/no per voice as in the 2026-10-22 round.
Goethe A2 and Goethe B1 (DE voices) have no gap: 11 DE voices with all ages, both genders and Kathi as the learner voice.

---

## 4. Rollout order

| # | Exam | Why |
|---|---|---|
| 1 | **Goethe-Zertifikat B1** (+ ÖSD B1 render) | Biggest audience (Einbürgerung, jobs); two exams for the work of one |
| 2 | **Goethe-Zertifikat A2** | Spouse/family and the A2 → B1 path; smaller exam |
| 3 | Goethe A1 = Start Deutsch 1 | Already drafted, review only |
| 4 | ÖSD A1, ÖSD A2 | Separate formats, Austria-focused audience; after the AT/CH voice round |

---

## 5. Phases per exam (same as telc B1; each a small PR, Hannes approves before any commit)

1. **`full` spec + validator.** `full` blocks in `lib/exam/exams/goethe-{a2,b1}.ts` (items, first item no., blocks,
   lengths, pace, pauses, play counts and reading times from §2), rules in `lib/exam/validate-modelltest.ts`, and
   `research/goethe-{a2,b1}-authoring.md` (the JSON shape guide, like `start-deutsch-1-authoring.md`). Before fixing pace
   and pauses, **measure the official Übungssatz MP3s** (silencedetect + Scribe, as for telc B1): the B1 clip seconds are
   still `TODO(hannes): unverified`.
2. **Missing exam components.** Design skills first; shown on `/design/pruefung` and listed in DESIGN.md:
   - A2+B1: **Ja/Nein** item (R/F component with other labels), and "0" vs "X" as the no-match label per exam.
   - A2: **picture matching from 9 pictures** (Hören 2), picture-or-text options (Hören 3), the floor-directory task
     (shared with telc A2), the **hidden-calendar** planning screen (Sprechen 3).
   - B1: **speaker matching** (Hören 4: statement → moderator / guest 1 / guest 2), a **5-slide presentation** screen with
     a choice of 2 topics, and a 15-min preparation screen covering all Sprechen Teile.
3. **Scoring and result.** Goethe A2: /100 with the 45/75 + 15/25 rule. B1: per module /100 (Lesen/Hören × 3.33 via the
   official table, Schreiben 40/40/20 with the "Erfüllung E → 0" and "< 50 % words → 0" rules, Sprechen 28/40/16 + 16
   Aussprache). Via the shared result helper; unit tests (`npx tsx --test`).
4. **Set 1, built by hand-in-the-loop and reviewed first.** This is the "quick check" set: one complete set *n* = 1 for
   Goethe B1 (all four skills, Hören track rendered, ÖSD render too) and then Goethe A2. Hannes reviews it in
   `/admin/modelltests/...` with the real exam components. **Nothing for sets 2–10 is generated until set 1 is approved.**
   Then an independent review agent compares set 1 against the official Übungssatz PDF + MP3 (it caught 4 issues in telc
   B1 set 1 that self-review missed).
5. **Sets 2–10.** `author-start.ts` generalised to `--exam goethe-a2|goethe-b1`:
   - plan all skills of set *n* together (2 sets per call)
   - draft each skill with set 1 as the example
   - run the check script + `validateSet`, redraft flagged units
   - all on the Message Batches API (`DRAFT_BATCH=1`, 50 % off)

   Do-not-reuse lists: `research/goethe-{a2,b1}-official-situations.md`; official texts for the overlap check go only in
   `.unit-cache/` (gitignored). Then audio → images → local seed as draft (`batch.sh --exam …`).
6. **Simulation row check.** The `telc-plan.md` §7 rows for Goethe A2 and Goethe/ÖSD B1 already exist. B1 runs as **four
   modules with ≥15-min breaks**, and Hören keeps its 5 min of transfer time inside the official clock.

**Rough size per exam (sets 1–10):** ~40 drafting units plus redrafts. telc B1 set 1 cost $0.99 in batch mode, so
~$10–20 per exam for drafting. Plus ElevenLabs for ~10 Hören tracks (A2 ~30 min, B1 ~40 min each) and Sprechen lines.
The ÖSD render roughly doubles the B1 TTS cost and adds nothing for drafting.

---

## 6. Decisions for Hannes

- **D1. ÖSD B1 = same items as Goethe B1 with AT/CH voices** (proposed), or 10 separate ÖSD sets (double the drafting and
  review)?
- **D2. Goethe B1 voices:** DE only (current rule, proposed), or the same D-A-CH mix as ÖSD? The joint exam suggests the
  real Goethe audio may also have AT/CH speakers. `TODO(hannes): unverified`: we couldn't open goethe.de's audio pages
  (HTTP 403). If it's true, one mixed render could serve both brands.
- **D3. Listening round** for 4 more AT/CH voices before ÖSD sets 3–10, plus a re-listen of Martin (dialect)?
- **D4. Order:** Goethe B1 first, then Goethe A2 (proposed)?
- **D5. Paper or digital conditions:** keep the paper transfer time inside the official clock (proposed, as for telc), or
  follow the digital Goethe exam, which has none?

## 7. Out of scope here

- **ÖSD A1 / A2:** different exams from Goethe/telc A1/A2 (individual or pair Sprechen with 10 min prep, note-taking,
  Ja/Nein, per-module minimums). They need their own full spec and sets later. The AT/CH voice round (D3) is a
  precondition.
- **Fit in Deutsch / Jugendliche:** same format as the adult exams; a content skin (du, teen topics) for later.
