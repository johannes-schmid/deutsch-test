# Facts file

Every number or legal fact on the site lives here, with its source and the date it was checked.
If it isn't in this file, it doesn't ship.

| Fact | Used on | Source | Checked |
|---|---|---|---|
| DTZ = scaled language test of the BAMF, levels A2 to B1 | /dtz | [IntV § 17 Abs. 1](https://www.gesetze-im-internet.de/intv/__17.html) | 2026-10-12 |
| Zertifikat Integrationskurs = B1 in the DTZ + required points in the orientation test (LiD) | /dtz, /b1-einbuergerung | [IntV § 17 Abs. 2, 4](https://www.gesetze-im-internet.de/intv/__17.html) | 2026-10-12 |
| DTZ result: B1, A2 or unter A2, no pass/fail | /dtz, landing | IntV § 17 Abs. 1 ("skalierter Sprachtest"); TODO(hannes): add the telc/g.a.s.t. Handbuch | 2026-10-12 |
| Einbürgerung needs "ausreichende Kenntnisse der deutschen Sprache" = B1 | /b1-einbuergerung | [StAG § 10 Abs. 1 Nr. 6, Abs. 4](https://www.gesetze-im-internet.de/stag/__10.html) | 2026-10-12 |
| Exceptions for illness, disability, age | /b1-einbuergerung | StAG § 10 Abs. 6 (same link) | 2026-10-12 |
| Timings: Hören ca. 25, Lesen 45, Schreiben 30, Sprechen ca. 16 Min | /blog/dtz-pruefung, landing | CLAUDE.md §2. TODO(hannes): official source (telc DTZ Modelltest / Handbuch) | unverified |
| VAT 19% included in prices | /preise | German standard rate (UStG § 12 Abs. 1) | 2026-10-12 |
| Prüfungspass 24.90 € (1 Monat) / 39.90 € (3 Monate), one-time, incl. VAT | /preise, /dashboard/preise | Set by Hannes, `lib/pricing.ts` | 2026-10-23 |

## Free tests: exam formats (`lib/exams.ts`, `/gratis-test`)

Full blueprints with every source are in `research/<exam>.md`. Only the numbers the site shows are listed here.
The free tests are ~5-minute tasters, not full mocks; the page copy must not imply the real exam is that short.

| Fact | Used on | Source | Checked |
|---|---|---|---|
| Start Deutsch 1 = Goethe-Zertifikat A1 and telc Deutsch A1, same tasks; pass at 60 % of all points | /gratis-test, /gratis-test/start-deutsch-1 | research/start-deutsch-1.md §2, §4 (Goethe Durchführungsbestimmungen, telc Übungstest) | 2026-10-12 |
| ÖSD Zertifikat A1: Lesen 25, Hören ca. 10, Schreiben 20 Min; Sprechen alone, 10 Min prep + ca. 10 Min; pass 50/100 | /gratis-test/oesd-a1 | research/oesd-a1.md §1, §6 | 2026-10-12 |
| Goethe-Zertifikat A2: Lesen 30, Hören ca. 30, Schreiben 30, Sprechen ca. 15 Min (pair); pass 60/100 with 45/75 written and 15/25 oral | /gratis-test/goethe-a2 | research/goethe-a2.md §1, §6 | 2026-10-12 |
| telc Deutsch A2: Hören ca. 20, Lesen + Schreiben 50, Sprechen ca. 15 Min (pair); pass 36/60 | /gratis-test/telc-a2 | research/telc-a2.md §1, §6 | 2026-10-12 |
| ÖSD Zertifikat A2: Lesen 30, Hören ca. 15, Schreiben 30 Min; Sprechen 10 Min prep + ca. 10 Min; pass 45/90 | /gratis-test/oesd-a2 | research/oesd-a2.md §1, §6 | 2026-10-12 |
| Goethe-Zertifikat B1 and ÖSD Zertifikat B1 are one jointly developed exam (Goethe-Institut, ÖSD, Universität Freiburg/Fribourg) with the same tasks | /gratis-test/goethe-b1, /gratis-test/oesd-b1 | research/goethe-oesd-b1.md §2 (both providers' Durchführungsbestimmungen) | 2026-10-12 |
| Goethe/ÖSD B1: 4 modules, each passed on its own at 60/100; Lesen 65, Hören ca. 40, Schreiben 60 Min; Sprechen 15 Min prep + ca. 15 Min (pair) | /gratis-test/goethe-b1, /gratis-test/oesd-b1 | research/goethe-oesd-b1.md §1, §4 | 2026-10-12 |
| telc Deutsch B1 (Zertifikat Deutsch): written 150 Min (Lesen + Sprachbausteine 90, Hören ca. 30, Schreiben 30), Sprechen ca. 15 Min after 20 Min prep; pass 60 % written and 60 % oral | /gratis-test/telc-b1 | research/telc-b1.md §1, §4 | 2026-10-12 |
| Which authorities accept Goethe/ÖSD/telc B1 for Einbürgerung | not used yet | TODO(hannes): unverified (research/goethe-oesd-b1.md, research/telc-b1.md open items) | unverified |

## Blog (`/blog/*`, checked 2026-10-16)

Sources: g.a.s.t. "Der DTZ auf einen Blick" (G1) https://www.gast.de/de/forschung-entwicklung/entwicklung/auftraege/deutsch-test-fuer-zuwanderer-dtz/der-dtz-auf-einen-blick ·
g.a.s.t. FAQ (G2) https://www.gast.de/de/forschung-entwicklung/entwicklung/auftraege/deutsch-test-fuer-zuwanderer-dtz/faq ·
g.a.s.t. DTZ Übungssatz 2, 06/2024 (G3) https://www.gast.de/fileadmin/gast.de/GAST/5_DTZ/PDF/gast_DTZ_UEbungssatz_2.pdf ·
IntTestV https://www.gesetze-im-internet.de/inttestv/ · IntV § 17 https://www.gesetze-im-internet.de/intv/__17.html · StAG § 10 https://www.gesetze-im-internet.de/stag/__10.html

| Fact | Used on | Source | Checked |
|---|---|---|---|
| DTZ written part 100 min without break: Hören ca. 25, Lesen 45, Schreiben 30; Sprechen pair exam ca. 16 min (law: "circa 15") | /blog/b1-pruefung, /blog/dtz-bestehen, /blog/dtz-pruefung | G2, G3 p. 7, IntTestV § 3 Abs. 1. Resolves the "unverified" timings row above | 2026-10-16 |
| DTZ Hören 4 Teile / 20 items, every text played once; Lesen 5 Teile / 25 items | /blog/b1-pruefung | G1 ("Alle Texte werden einmal gehört"), G3 p. 6 | 2026-10-16 |
| DTZ Sprechen: no preparation time; 3 Teile (über sich sprechen, über Erfahrungen sprechen mit Bild, gemeinsam etwas planen) | /blog/b1-pruefung, /blog/dtz-bestehen | G1 ("Eine Vorbereitungszeit ist nicht vorgesehen"), G3 p. 27 | 2026-10-16 |
| DTZ scoring: Hören + Lesen together 45 points (B1 33–45, A2 20–32); Schreiben 20 (B1 15–20, A2 7–14); Sprechen 100 (B1 75–100, A2 35–74,5) | /blog/dtz-bestehen | G1, G3 pp. 47–48 | 2026-10-16 |
| DTZ overall B1 = B1 in Sprechen + B1 in Hören/Lesen or Schreiben; A2 the same way. Sprechen unter A2 = no certificate, only an Ergebnisbogen | /blog/dtz-bestehen | IntTestV § 10 Abs. 1; G3 p. 49; G2 | 2026-10-16 |
| DTZ Schreiben: choose task A or B, semi-formal/formal letter or email, 4 points, Anrede + Gruß, 30 min, no word count; criteria Aufgabenbewältigung, Kommunikative Gestaltung, Korrektheit, Wortschatz (5 bands each); off-topic = 0 on all | /blog/dtz-bestehen, /blog/b1-brief-schreiben | G1, G3 pp. 24, 42, G2 | 2026-10-16 |
| DTZ Sprechen criteria: Aufgabenbewältigung 50, Aussprache/Intonation 10, Flüssigkeit 10, Korrektheit 15, Wortschatz 15 | /blog/dtz-bestehen | G3 pp. 47–48 (G1 lists other names; we use G3) | 2026-10-16 |
| DTZ can be repeated without limit; the whole exam is repeated, no part results carried over | /blog/dtz-bestehen | IntTestV § 9 Abs. 3; G2 | 2026-10-16 |
| BAMF pays a second attempt if the first was before the course hours ran out | /blog/dtz-bestehen | IntV § 17 Abs. 3 S. 2 | 2026-10-16 |
| Only people in the integration course system take the DTZ (Teilnahmeberechtigung or at least one self-paid Kursabschnitt); registration via a Prüfstelle | /blog/dtz-bestehen | G1 | 2026-10-16 |
| Einbürgerung: § 10 Abs. 4 StAG = "Anforderungen einer Sprachprüfung der Stufe B 1" (no exam named) | /blog/b1-pruefung | StAG § 10 Abs. 4 S. 1 | 2026-10-16 |
| DTZ certificate only an "Indiz" for Einbürgerung; the authority may test itself | not used yet | VGH München 20.03.2026, 5 ZB 23.2060 | 2026-10-16 |
| BAMF list of recognised B1 certificates (Goethe B1, telc B1, telc A2·B1, ÖSD B1, DTZ B1 …) is for the Integrationskurs, not for Einbürgerung | /blog/b1-pruefung | BAMF list, Stand Juli 2023 (see research/telc-b1.md S10). TODO(hannes): newer version? | 2026-10-16 |
| TODO(hannes): does a DTZ with overall B1 but Schreiben A2 count for Einbürgerung? One commentary says no; BMI Anwendungshinweise not reachable | not used | unverified | unverified |
| telc B1: a failed written or oral part can be retaken alone in the same or the following calendar year | /blog/b1-pruefung | telc Übungstest 1 (2020) p. 40; TODO(hannes): check against the current telc Prüfungsordnung | 2026-10-16 |
| Goethe/ÖSD B1: four modules, each taken and repeated alone; Erwachsene (recommended 16+) and Jugendliche (12+) versions | /blog/b1-pruefung | research/goethe-oesd-b1.md S1, S3 | 2026-10-16 |
| DTZ result reaches the BAMF about 2.5 weeks after the exam; certificate collected at the Prüfstelle | /blog/dtz-bestehen | G2 | 2026-10-16 |
