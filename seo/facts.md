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
| VAT included in prices (DE 19 %, AT 20 %, same gross price) | /preise | UStG § 12 Abs. 1; AT UStG § 10 Abs. 1. TODO(hannes): confirm OSS setup with the tax advisor | 2026-10-24 |
| Prüfungspass 19.95 € (1 Monat) / 44.95 € (3 Monate), then 19.95 € per month, cancellable any time, incl. VAT | /preise, /dashboard/preise | Set by Hannes, `lib/pricing.ts` | 2026-10-24 |
| Teil-Pass (catalogue `teil-2026-11`, on sale since 2026-10-29): one skill 9.95 € per month, all four 29.85 € per month (3 × 9.95), switch from one to all four 19.90 € once, all monthly, cancellable any time, incl. VAT | /preise, /dashboard/preise, home FAQ (when active) | Set by Hannes, `lib/pricing.ts` | 2026-10-29 |

## Einbürgerungstest (`/blog/einbuergerungstest-ergebnis-wartezeit`, checked 2026-11-06)

| Fact | Used on | Source | Checked |
|---|---|---|---|
| 33 questions, 60 minutes, passed with at least 17 correct | /blog/einbuergerungstest-ergebnis-wartezeit | [EinbTestV § 1 Abs. 2, 3](https://www.gesetze-im-internet.de/einbtestv/BJNR164900008.html) | 2026-11-06 |
| Fee 25 € per participant | /blog/einbuergerungstest-ergebnis-wartezeit | [EinbTestV § 2 Abs. 1](https://www.gesetze-im-internet.de/einbtestv/BJNR164900008.html); BAMF page "Die Teilnahme am Einbürgerungstest kostet 25 Euro." | 2026-11-06 |
| The Regionalstelle of the BAMF evaluates the tests centrally in a fully standardised procedure; the Prüfstelle may not tell the result | /blog/einbuergerungstest-ergebnis-wartezeit | [Prüfungsordnung Einbürgerungstest § 12 Abs. 1, § 10 Abs. 11 (Stand 28.07.2008)](https://www.bamf.de/SharedDocs/Anlagen/DE/Integration/Einbuergerung/einbuergerungstest-pruefungsordnung.pdf?__blob=publicationFile&v=2) | 2026-11-06 |
| The Bescheinigung (standard form, signed and sealed, shows Gesamtpunktzahl and Prädikat "erfolgreich teilgenommen" / "teilgenommen") is sent by post to the participant | /blog/einbuergerungstest-ergebnis-wartezeit | Prüfungsordnung § 12 Abs. 2, § 13 Abs. 1–3 (same link) | 2026-11-06 |
| A new copy of the Bescheinigung is issued only against the original or a written declaration of loss | /blog/einbuergerungstest-ergebnis-wartezeit | Prüfungsordnung § 13 Abs. 4 (same link) | 2026-11-06 |
| The Bescheinigung stays valid after a change of residence | /blog/einbuergerungstest-ergebnis-wartezeit | [EinbTestV § 1 Abs. 4](https://www.gesetze-im-internet.de/einbtestv/BJNR164900008.html) | 2026-11-06 |
| The BAMF publishes which test date it is currently evaluating: "Aktuell wertet das Bundesamt Tests bis Prüfungsdatum 24.08.2026 aus." (page dated 02.11.2026, i.e. about 10 weeks) | /blog/einbuergerungstest-ergebnis-wartezeit | [BAMF: Einbürgerung](https://www.bamf.de/DE/Themen/Integration/ZugewanderteTeilnehmende/Einbuergerung/einbuergerung-node.html) | 2026-11-06 |
| The BAMF names no fixed processing time; questions go to the BAMF Bürgerservice or the Einbürgerungsbehörde | /blog/einbuergerungstest-ergebnis-wartezeit | BAMF page (same link); [BAMF Bürgerservice](https://www.bamf.de/DE/Service/ServiceCenter/Buergerservice/buergerservice-node.html) | 2026-11-06 |
| A VHS states "in der Regel 6 bis 8 Wochen" by post, and to contact the BAMF Regionalstelle after that (a Prüfstelle's statement, not the BAMF's) | /blog/einbuergerungstest-ergebnis-wartezeit | [VHS Tempelhof-Schöneberg: Einbürgerung](https://www.berlin.de/vhs-tempelhof-schoeneberg/kurse/deutsch-als-zweitsprache/pruefungen-und-abschluesse/einbuergerung/) | 2026-11-06 |
| Test repeatable when fewer than 17 answers are correct | /blog/einbuergerungstest-ergebnis-wartezeit | BAMF page: "können Sie den Test wiederholen." | 2026-11-06 |

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
| ~~DTZ overall B1 = B1 in Sprechen + B1 in Hören/Lesen or Schreiben~~ Outdated since 01.11.2026, see "DTZ: rule of 11/2026" below. Sprechen unter A2 = no certificate, only an Ergebnisbogen | /blog/dtz-bestehen | IntTestV § 10 Abs. 1 (old text); G3 p. 49; G2 | 2026-10-16 |
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

## telc Deutsch B1: points, results, repeats (`/telc-b1/punkte-rechner`, `/blog/telc-b1-ergebnis-wartezeit`, checked 2026-11-23)

Sources: telc Übungstest 1 Zertifikat Deutsch / telc Deutsch B1, 13. Auflage 2020 (ÜT) https://shop.telc.net/media/catalog/product/file/telc_deutsch_b1_zd_uebungstest_1.pdf ·
telc Prüfungsregularien, gültig ab 15.04.2025 (PO) https://www.telc.net/fileadmin/user_upload/pdfs/AGB_Pruefungsordnung/9994-P00-150010.pdf ·
telc "Zertifikate digital" https://www.telc.net/sprachpruefungen/telc-zertifikate-digital/ · telc Kontakt https://www.telc.net/kontakt/

| Fact | Used on | Source | Checked |
|---|---|---|---|
| Points: Leseverstehen 75, Sprachbausteine 30, Hörverstehen 75, Schriftlicher Ausdruck 45 = 225 written; Mündlicher Ausdruck 75; total 300. Per item 5 / 2.5 / 1.5 is derived, not printed | /telc-b1/punkte-rechner | ÜT p. 39 | 2026-11-23 |
| Pass: 60 % written (135) and 60 % oral (45); grades 270–300 sehr gut, 240–269.5 gut, 210–239.5 befriedigend, 180–209.5 ausreichend | /telc-b1/punkte-rechner | ÜT p. 40 | 2026-11-23 |
| The written or the oral part can be repeated alone within twelve months of the first exam (date of the Ergebnisbogen); single subtests cannot. Replaces the "same or following calendar year" row above | /telc-b1/punkte-rechner, /blog/telc-b1-ergebnis-wartezeit | PO § 7.3 | 2026-11-23 |
| An exam can be repeated any number of times; every result stays valid | /blog/telc-b1-ergebnis-wartezeit | PO § 7.2 | 2026-11-23 |
| telc names no evaluation time. Evaluation starts when the complete documents are at telc; the Prüfungszentrum must hand results over within two weeks of receiving them | /blog/telc-b1-ergebnis-wartezeit | PO (Durchführungsrichtlinien), § 12.2, § 12.5. A 05/2022 telc newsletter said "ca. 3-4 Wochen": outdated, not used | 2026-11-23 |
| Digital results are the telc standard from Q1 2026: certificate or Ergebnisbogen as PDF by email | /blog/telc-b1-ergebnis-wartezeit | telc "Zertifikate digital". PO § 12.3 still describes signed paper documents; we quote the web page as telc's statement | 2026-11-23 |
| Status questions: participants are sent to their Prüfungszentrum | /blog/telc-b1-ergebnis-wartezeit | telc Kontakt | 2026-11-23 |
| Ergebnisüberprüfung: once, within six weeks of the result, in text form via the telc web form, 40 €, the result can get worse, fee refunded if the result is revised. Einsichtnahme in the answer sheets within three months, in person, no copies, no advice | /blog/telc-b1-ergebnis-wartezeit | PO § 8.2–8.4, Anhang 2 | 2026-11-23 |
| Results are archived for ten years; a duplicate certificate costs 40 € and is requested from telc. Corrections of personal data within four months via the Prüfungszentrum | /blog/telc-b1-ergebnis-wartezeit | PO § 7.5, § 7.1, Anhang 2 | 2026-11-23 |
| Express evaluation | not used | no official source found | unverified |

## DTZ: rule of 11/2026, results, repeats (`/dtz/ergebnis-rechner`, `/blog/dtz-neue-regel-b1`, `/blog/dtz-ergebnis-wartezeit`, `/a2-zu-b1`, `/blog/dtz-bestehen`, checked 2026-11-23)

Sources: IntTestV https://www.gesetze-im-internet.de/inttestv/ · Änderungsverordnung vom 13.10.2026, BGBl. 2026 I Nr. 306 https://www.recht.bund.de/bgbl/1/2026/306/VO.html ·
g.a.s.t. FAQ and "Der DTZ auf einen Blick" (links above) · BAMF Leitfaden für Kursträger, "Abschluss des Integrationskurses" (26.08.2026) https://www.bamf.de/SharedDocs/Dossiers/DE/Integration/integrationskurse-leitfaden.html?nn=282388&docId=1616708 ·
BAMF "Abschlussprüfung" https://www.bamf.de/DE/Themen/Integration/ZugewanderteTeilnehmende/Integrationskurse/Abschlusspruefung/abschlusspruefung-node.html

| Fact | Used on | Source | Checked |
|---|---|---|---|
| DTZ overall B1 = Sprechen B1 + B1 in Hören/Lesen or Schreiben + at least A2 in the remaining area | all pages above, `lib/exam/dtz-result.ts` | IntTestV § 10 Abs. 1 (current text); g.a.s.t. FAQ "Wann erhalte ich das Gesamtergebnis B1?" | 2026-11-23 |
| In force since 01.11.2026 (Verordnung vom 13.10.2026, BGBl. 2026 I Nr. 306, Art. 2). No transition rule in the regulation; no official statement on certificates issued before | /blog/dtz-neue-regel-b1 | BGBl. 2026 I Nr. 306 | 2026-11-23 |
| DTZ overall A2 = the level in Sprechen and in at least one of the other two parts. TODO(hannes): only the BAMF page says this, and it still shows the old B1 rule, so it may be stale; IntTestV and g.a.s.t. do not define overall A2 | `lib/exam/dtz-result.ts` (calculator), /blog/dtz-bestehen | BAMF "Abschlussprüfung", "Die Sprachniveaus A2 und B1" | 2026-11-23 |
| Overall result below A2: an Ergebnisbogen instead of a certificate | /blog/dtz-ergebnis-wartezeit, calculator | g.a.s.t. FAQ | 2026-11-23 |
| g.a.s.t. sends results to the BAMF "in der Regel zweieinhalb Wochen" after the exam; the BAMF validates; certificates are then provided in the portal for Prüfstellen; the candidate gets the certificate from the Prüfstelle | /blog/dtz-ergebnis-wartezeit | g.a.s.t. FAQ | 2026-11-23 |
| "Nach ungefähr 4 Wochen erhält die Prüfstelle das Testergebnis"; the Prüfstelle passes the DTZ certificates on | /blog/dtz-ergebnis-wartezeit | BAMF Leitfaden | 2026-11-23 |
| No online status for candidates (the g.a.s.t. portal is for Prüfstellen; the public tool only verifies certificates) | /blog/dtz-ergebnis-wartezeit | g.a.s.t. FAQ; https://dtz.gast.de/portal/certificate/verification-dtz-choice | 2026-11-23 |
| Schreiben is rated by one trained rater, Sprechen by two examiners independently | /blog/dtz-ergebnis-wartezeit | g.a.s.t. FAQ | 2026-11-23 |
| Zertifikat Integrationskurs: issued by the BAMF in written form (not electronically) and sent to the participant by the Regionalstelle | /blog/dtz-ergebnis-wartezeit | IntV § 17 Abs. 4; BAMF Leitfaden | 2026-11-23 |
| Einsichtnahme within three months of the result; request via the g.a.s.t. portal; fixed dates in eight cities, 15 minutes, no tasks or solutions shown. Einspruch: first the Prüfstelle, at the latest three months after the result. Cost: no official source | /blog/dtz-ergebnis-wartezeit, /a2-zu-b1 | IntTestV § 11; g.a.s.t. FAQ | 2026-11-23 |
| Unlimited repeats; the whole exam is repeated, no part results carried over | /a2-zu-b1, /blog/dtz-ergebnis-wartezeit | IntTestV § 9 Abs. 3; g.a.s.t. FAQ | 2026-11-23 |
| The BAMF pays the second attempt if the first was before the lesson hours were used up; otherwise self-paid. No official candidate fee (AbrRL only states what the BAMF reimburses the Prüfstelle) | /a2-zu-b1 | IntV § 17 Abs. 3; BAMF Leitfaden | 2026-11-23 |
| The 300-UE repeat (old § 5 Abs. 5 IntV) was repealed on 07.12.2024 (BGBl. 2024 I Nr. 393); now only after an Alphabetisierungskurs or a course for gering Literalisierte (§ 13 Abs. 1 S. 4 IntV); admissions already granted stay valid | /a2-zu-b1 | BAMF Leitfaden; IntV § 13 | 2026-11-23 |
| DTZ only for people in the Integrationskurs system (Teilnahmeberechtigung or at least one self-paid Kursabschnitt) | /a2-zu-b1 | g.a.s.t. DTZ page | 2026-11-23 |
| Lost DTZ certificate / duplicate | not used | no official source found | unverified |
