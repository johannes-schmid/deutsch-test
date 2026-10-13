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
| Timings: Hören ca. 25, Lesen 45, Schreiben 30, Sprechen ca. 16 Min | /dtz, landing | CLAUDE.md §2. TODO(hannes): official source (telc DTZ Modelltest / Handbuch) | unverified |
| VAT 19% included in prices | /preise | German standard rate (UStG § 12 Abs. 1) | 2026-10-12 |
| Placeholder prices 19.90 / 44.90 / 74.90 € | /preise | TestGerman benchmark, `lib/pricing.ts`. TODO(hannes): real prices | 2026-10-12 |

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
