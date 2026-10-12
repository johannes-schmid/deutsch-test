# Keyword strategy: homepage and exam pages

Stand: 10/2026. Built on the qualitative competitor research from 2026-10-12 (US-based search,
no volumes). **TODO(hannes):** confirm volumes in Keyword Planner, GSC or DataForSEO before
building pages.

## Positioning

Lead with **exam preparation and the result**, the way TestGerman does ("Pass Goethe, telc, DTZ &
ÖSD"). Don't lead with *when* people study (evenings, after work). That angle is dropped.

What we can say, and what we can't:

| TestGerman says | We say instead | Why |
|---|---|---|
| "9000+ Active users" | nothing until we have real numbers | no invented social proof |
| "Pass … DTZ" | "B1 schaffen" / "bereit für den DTZ" | DTZ has no pass/fail, only B1 / A2 / unter A2 |
| "with AI feedback" | "Feedback nach den DTZ-Kriterien" | never position the product as AI |
| "in your language" | "Erklärungen in deiner Sprache" | same promise, true for 6 languages |
| "No credit card" | "Ohne Anmeldung" | the free test needs no account at all |
| "Goethe, telc, ÖSD" | DTZ + Einbürgerungstest only | **TODO(hannes):** decide whether Goethe/telc B1 is ever in scope |

"Bestehen" is fine for the **Einbürgerungstest** (17 of 33 correct). For the DTZ, use it only to
match search phrasing in a guide that explains the result levels.

## Page ownership (one query, one page)

| Page | Primary | Secondary |
|---|---|---|
| `/` | DTZ online üben | DTZ Modelltest online · DTZ Prüfung vorbereiten · Deutsch-Test für Zuwanderer üben (also "Deutschtest") · DTZ B1 üben · DTZ Prüfungssimulation A2–B1 |
| `/dtz` | DTZ Prüfung | DTZ Aufbau · DTZ B1 Prüfung · DTZ Ablauf · DTZ Bewertung |
| `/dtz/{hoeren,lesen,schreiben,sprechen}` | DTZ [Teil] üben | DTZ Schreiben Brief · DTZ Sprechen gemeinsam etwas planen · DTZ Hören Teil 1–4 |
| `/dtz/modelltest/[n]` | DTZ Modelltest [n] | DTZ Übungstest |
| `/a2-zu-b1` | DTZ nur A2 | DTZ wiederholen · von A2 zu B1 |
| `/b1-einbuergerung` | B1 für Einbürgerung | Sprachnachweis Einbürgerung B1 |
| `/einbuergerungstest` | Einbürgerungstest online üben | Einbürgerungstest bestehen · 310 Fragen (see the LiD TODO in CLAUDE.md §4) |
| `/ratgeber/dtz-bestehen` | DTZ bestehen | "Was heißt beim DTZ bestanden?" Explains B1 / A2 / unter A2 |

Leave off every page: "pdf" queries (download intent; we can't host official material).

## Homepage on-page

- **Title (≤60):** `DTZ online üben: Modelltests A2–B1 | deutschtest üben`
- **Meta description (≤155):** `Bereite dich auf den DTZ vor: realistische Modelltests für Hören, Lesen,
  Schreiben und Sprechen. Ergebnis wie in der Prüfung. Erster Test gratis.`
- **H1:** `DTZ online üben und B1 schaffen.`
- **Lead:** `Realistische Modelltests für den Deutsch-Test für Zuwanderer. Hören, Lesen, Schreiben und
  Sprechen, wie in der Prüfung. Mit Erklärungen in deiner Sprache.`
- **CTA:** "Gratis Test starten" (primary) · "Preise ansehen" (secondary)
- **Proof row:** Ohne Anmeldung · Einbürgerungstest gratis · Unter A2 → A2 → B1
- **H2s carry the secondary terms:** "Dein DTZ-Modelltest, online" · "So bereitest du dich vor" ·
  FAQ "Kann ich den DTZ online üben?" / "Was mache ich, wenn ich nur A2 hatte?"

## Biggest openings (from the research)

1. **DTZ Modelltest online / Prüfungssimulation.** The results are mostly PDFs and books. No full,
   timed mock with exam-like audio and pair Sprechen ranks.
2. **Sourced, dated format guides.** Ranking guides contradict each other on timings and parts.
3. **DTZ nur A2 / wiederholen.** Coverage is thin and comes from low-trust sites. This is audience #1.
4. **German-language skill pages.** TestGerman's DTZ guides are in English.
