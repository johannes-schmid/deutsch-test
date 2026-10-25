# Austrian and Swiss standard German for ÖSD / Goethe mocks: evidence, glossary, generator rules

**Stand: 24.10.2026** · for ÖSD Zertifikat B1 (= Goethe-Zertifikat B1), ÖSD A1 (ZA1) and ÖSD A2 (ZA2).
Source tags `[Sx]` point to §6. Official exam text is never reproduced here (CLAUDE.md §4); single words only.

---

## 1. Verdict: how much Austrian German is in ÖSD exams?

**Short answer: less than assumed.** ÖSD tests the *common* standard of D, A and CH. Austrian words appear, but only
in texts set in Austria, a few per text, and they never carry an item unless glossed. ÖSD's own A1/A2 sheets lean a bit
more Austrian than the joint B1, mainly in the **instructions** ("das E-Mail").

What ÖSD says (official):

- ZB1 tests "die in Deutschland, Österreich und der Schweiz verwendete deutsche Standardsprache" (the shared one, not
  Austrian). [S1 §1]
- Hören: speakers from A, D and CH, each in their **supra-regional standard variety, with a light national colouring;
  no dialect needed** to solve any item. [S1 Hören; S4 "Plurizentrik"]
- ZA1: texts come from A, D and CH; **"lösungsrelevante Wortschatzvarianten bzw. landeskundliche Besonderheiten werden
  erläutert"**, e.g. by a footnote in the target language. [S4 "Plurizentrik", "Wortschatz"]
- ZA2 Lesen labels each text with its origin ("aus einer österreichischen / Schweizer / deutschen Zeitung"). [S5]

What the material shows (my greps of the extracted PDFs, 2026-10-24):

| Marker | ZB1 Band 1 (ÖSD, 14k lines) | Goethe B1 Übungssatz | ZA1 Modellsatz | ZA2 Modellsatz |
|---|---|---|---|---|
| **Jänner / Januar** | **0 / 0** | 0 / 0 | 0 / 0 | 0 / 0 |
| Paradeiser, Erdäpfel, Topfen, heuer, Spital, Trafik, Sackerl, Semmel, Öffis, Bim, Jause, Matura | **0 each** | 0 | 0 | 0 |
| Glossed regional word (`*Wort = … Standard für „…"`) | 2: *Stiege* (AT), *Velo* (CH) | 1: *Stiege* (AT) | 0 | 0 |
| Unglossed Austriazismen | *Kassa, Bankomatkarte, läutete, zu Mittag, Buben, Lehrstelle* (all in AT-set texts, context-clear) | – | *Burggasse … 1070 Wien*, mobile *0676* | *Gemeindeamt* (AT-labelled ad) |
| Unglossed Helvetismen | *Velo* (14 incl. compounds), *grillieren, Kanton, Franken, Lehrperson* (8), *benützen*, *Ferien* | *Velo* 1 | *CHF 1'200,–*, *benützen* | – |
| Swiss spelling in CH texts | *geniessen, heisst, Spass, gross*; «guillemets» | – | `.ch` address only | – |
| Common-core word instead | *Krankenhaus* 19 (Spital 0), *Fahrrad* 13, *Straßenbahn* 5, *Treppe* 2, *Samstag* 4, *Kasse* 1 | same pattern | *Brötchen* (in a Basel ad!) | *Fahrrad* 4 |
| das/ein **E-Mail** (neuter) vs die/eine E-Mail | 6 vs 19 (neuter only in ÖSD's commentary; task sheets say *eine E-Mail*, as Goethe) | 0 vs 2 | 2 vs 1 | **4 vs 0** |
| Text origin labels | 3 DE, 3 CH, 1 AT press texts; forum writers from Graz, Wien, Salzburg, Klagenfurt, Innsbruck, Zürich, Bern, Luzern, St. Gallen | Vienna letter, Bern/Salzburg writers | Wien, Graz, Basel ads | 3 AT, 1 CH, 2 DE texts |

Takeaways:

- **Regional words follow the setting.** An `.at` blog gets *Kassa*; a Murten (CH) brochure gets *Velo*, *geniessen* and
  «»; a Basel ad gets CHF. Nothing Austrian appears in DE- or CH-set texts.
- **Density is low:** typically 0–3 regional words per AT/CH text; most AT texts read as common German.
- **Glossing rule:** a regional word an item depends on gets a target-language footnote (`*Stiege = österreichischer
  Standard für „Treppe"`). Unglossed ones are guessable from context or not tested.
- **Not Austrian throughout.** No whole text is written in heavy Austrian vocabulary, not even in ÖSD's own A1/A2 sets.
- **ZA1/ZA2 "/Österreich" variants** (migrants in Austria) have Austrian topics [oesd-a1.md S1]. Expect more AT
  settings and institutions there. `TODO(hannes): unverified` (we have not read a /Österreich Modellsatz).

**Candidate's own variety (scoring):** no ÖSD document I read says in so many words that A/CH/D variants all score as
correct. The basis is implied: the tested standard is that of D, A and CH [S1 §1], and the bibliography cites the
*Variantenwörterbuch des Deutschen* [S1 §17]. Accent: a *foreign* accent costs no points [S1, Sprechen]. **Surprise:** in
ÖSD's B1 sample letter, the candidate's closing "Grüsse" (ss) is marked **FO** (orthography error) [S1, Schreiben
Aufgabe 1 Mustertext]. Swiss ss is legal in Switzerland [S8 §25 E2], but ÖSD evidently does not accept it from an
ordinary candidate. `TODO(hannes): unverified` whether an Austrian word in a candidate text (e.g. *Sessel* for Stuhl,
*heuer*) is ever penalised. Safe advice for our feedback: **accept Austrian and Swiss vocabulary; expect ß in candidate
writing.**

## 2. "Jänner": validated

- **Standard Austrian, used in official writing.** Federal law uses it, e.g. Arbeitsruhegesetz § 7 (2): "1. Jänner
  (Neujahr), 6. Jänner (Heilige Drei Könige)" [S9]. Duden labels *Jänner* "österreichisch, seltener süddeutsch" [S10].
  Austrian authorities, Länder and GeoSphere use it in titles ("Monatsbericht Jänner 2024") [S11].
- **Feber** is also Austrian (Duden: "besonders Amtssprache"), but now rare. Use *Februar*. [S10]
- **In ÖSD exam material it never occurs**, because no January date appears in any set. The 2026 sets name only
  Juni/Juli/August. So "Jänner" is right for an AT-set text that needs January. It is not a fact about ÖSD texts.
- **Rule:** AT-set text + January → *Jänner*. DE/CH-set → *Januar*. Instructions and rubrics → avoid month names.

## 3. Glossary

Columns: **DE** = German standard / common core · **AT** / **CH** = national standard variant (– = same as DE) ·
**Lvl** = first level where it is plausible · **Src**: `P10` EU Protocol No. 10 [S7] · `D` Duden usage label [S10] ·
`ÖSD` seen in ÖSD/Goethe material [S1–S6] · `K` well-known, my knowledge, not checked against a dictionary today.
**⚠ coll.** = colloquial, never in written exam text; at most in casual dialogue of an AT/CH speaker.

### 3.1 The legal core: Protocol No. 10 (23 terms, equal legal status in the EU since 1 Jan 1995) [S7]

| AT (P10) | DE (P10) | Lvl | | AT (P10) | DE (P10) | Lvl |
|---|---|---|---|---|---|---|
| Beiried | Roastbeef | B1 | | Marillen | Aprikosen | A2 |
| Eierschwammerl | Pfifferlinge | B1 | | Melanzani | Aubergine | B1 |
| **Erdäpfel** | Kartoffeln | A1 | | Nuß | Kugel (beef cut) | – |
| **Faschiertes** | Hackfleisch | A2 | | **Obers** | Sahne | A2 |
| Fisolen | grüne Bohnen | A2 | | **Paradeiser** | Tomaten | A1 |
| Grammeln | Grieben | – | | Powidl | Pflaumenmus | – |
| Hüferl | Hüfte | – | | Ribisel | Johannisbeeren | B1 |
| **Karfiol** | Blumenkohl | A2 | | Rostbraten | Hochrippe | – |
| Kohlsprossen | Rosenkohl | B1 | | Schlögel | Keule | – |
| Kren | Meerrettich | B1 | | **Topfen** | Quark | A2 |
| Lungenbraten | Filet | – | | Vogerlsalat | Feldsalat | B1 |
| | | | | Weichseln | Sauerkirschen | B1 |

Notes: *Paradeiser* is south/east Austrian (Duden); Tirol/Vorarlberg say *Tomate*, so a Vienna/Graz speaker fits best.
*Obers* is east-Austrian; *Schlagobers* = Schlagsahne. "–" = butcher terms, too specialised for A1–B1.

### 3.2 Everyday Austriazismen by exam domain

| Domain | DE | AT standard | Lvl | Src / flag |
|---|---|---|---|---|
| **Time** | Januar | **Jänner** | A1 | S9, D |
| | dieses Jahr | **heuer** | A2 | D (also S-DE, CH) |
| | morgens | in der Früh | A2 | K (also S-DE) |
| | mittags | zu Mittag | A2 | ÖSD |
| | Viertel vor acht | dreiviertel acht (`¾ 8`) | B1 | K; also E/S-DE; never as an item key |
| **Greeting / letters** | Guten Tag | Grüß Gott (neutral-polite; also Bavaria) | A1 | K |
| | Hallo / Tschüss | Servus (informal, hi *and* bye) | A1 | K; informal register only |
| | Auf Wiedersehen | Auf Wiederschauen | A1 | K |
| | Tschüss | Baba, Pfiat di | – | ⚠ coll./dialect: avoid |
| | Liebe Grüße | Liebe Grüße (very frequent, also "LG") | A1 | ÖSD ("Liebe Grüße aus Wien") |
| | Sehr geehrte Frau Huber | Sehr geehrte Frau Mag. Huber (academic titles used in address) | B1 | K |
| | die E-Mail | **das E-Mail** (die also correct) | A1 | ÖSD (ZA2 4×, ZA1 2×) |
| | der Briefumschlag | das Kuvert | A2 | D |
| **Food / shopping** | Brötchen | Semmel | A1 | D |
| | Zwischenmahlzeit, Brotzeit | Jause | A2 | D |
| | Tüte | Sackerl | A2 | D ("bayrisch, österreichisch"); fine in dialogue |
| | Kasse | **Kassa** | A2 | ÖSD, D |
| | Pfannkuchen | Palatschinke | A2 | D |
| | Pflaume | Zwetschke | A2 | K |
| | Kneipe, Lokal | Beisl, Gasthaus | B1 | K; *Gasthaus* is neutral |
| | Tabakladen, Kiosk | Trafik | B1 | D |
| | Geldautomat / EC-Karte | Bankomat / Bankomatkarte | A2 | ÖSD |
| | Klebeband | Tixo | B1 | D |
| | T-Shirt | Leiberl | – | D; coll.-leaning, avoid |
| **Housing** | Treppe | **Stiege** (also in addresses: Stiege 2) | A2 | ÖSD (glossed) |
| | Schrank | Kasten | A2 | K |
| | Stuhl | **Sessel** (DE Sessel = armchair: false friend) | A2 | K |
| | Sessel | Fauteuil | B1 | D |
| | Kissen | Polster | A2 | K |
| | Flur, Diele | Vorzimmer | A2 | K |
| | Mülleimer | Mistkübel; Mist = Müll | A2 | D |
| | Nebenkosten | Betriebskosten | B1 | K |
| | Hausmeister | Hausbetreuung, (older) Hausbesorger | B1 | K |
| | Erdgeschoss | Erdgeschoß (ß allowed in AT) | A1 | K (Duden lists AT *Geschoß*) |
| | Schornstein | Rauchfang | B1 | K |
| | klingeln | läuten | A2 | ÖSD |
| | Wäscheklammer | Kluppe | – | D |
| **Authorities** | Bürgeramt / Stadtverwaltung | Magistrat (cities), Gemeindeamt (towns), **Bezirkshauptmannschaft (BH)** (rural districts) | B1 | ÖSD (*Gemeindeamt*), K |
| | Anmeldung, Meldebescheinigung | Meldezettel, Meldeamt | A2 | K |
| | Öffnungszeiten (office) | **Parteienverkehr** | B1 | K; typical on Aushänge |
| | Überweisungsträger | Erlagschein | B1 | D |
| | Bekanntmachung | Kundmachung | B1 | K |
| | Jobcenter / Agentur für Arbeit | **AMS** (Arbeitsmarktservice) | A2 | K |
| | Krankenkasse | ÖGK; Versicherungskarte = **e-card** | A2 | K |
| **Transport** | Bürgersteig | Gehsteig | A2 | D |
| | Straßenbahn | Straßenbahn (std.) · Bim | A1 | ⚠ *Bim* coll. (D) |
| | öffentliche Verkehrsmittel | Öffis | – | ⚠ coll. (D) |
| | Vignette, TÜV | Pickerl | – | ⚠ coll. (D) |
| **School** | Grundschule | Volksschule (1–4) | A2 | K |
| | Klassenarbeit | Schularbeit | B1 | K |
| | Abitur | **Matura**; Maturant/in | A2 | D |
| | Turnhalle | Turnsaal | A2 | K |
| | Klassenlehrer | Klassenvorstand | B1 | K |
| | Jura | Jus | B1 | K |
| | Junge | Bub | A2 | ÖSD, D (also S-DE, CH) |
| **Health** | Arztpraxis; Sprechstunde | Ordination; Ordinationszeiten | A2 | K |
| | Krankenhaus | Spital (Krankenhaus equally standard; ÖSD uses *Krankenhaus*) | A2 | K, ÖSD count |
| | krankgeschrieben sein | im Krankenstand sein | B1 | K |
| | Krankenwagen | die Rettung | A2 | K |
| **Work** | Elternzeit | Karenz | B1 | K |
| | Rente / Rentner | Pension / Pensionist | B1 | K |
| | Auszubildende/r | Lehrling, Lehrstelle | A2 | ÖSD |
| | Gehaltsabrechnung | Lohnzettel | B1 | K |
| | Arbeitgeber/-nehmer | Dienstgeber/-nehmer (legal style) | B1 | K |

### 3.3 Helvetismen (Swiss standard)

| Domain | DE | CH standard | Lvl | Src / flag |
|---|---|---|---|---|
| **Spelling** | ß | **always ss** (Strasse, gross, heisst, Grüsse) | A1 | S8 §25 E2; ÖSD CH texts |
| | „…" | «…» guillemets | – | ÖSD CH texts; K |
| | Sehr geehrter Herr X, | comma after salutation optional; then capital letter | B1 | S8 |
| **Greeting** | Guten Tag | Grüezi (formal, CH-wide in speech) | A1 | K; spoken only |
| | Danke | Merci (very common, standard in CH) | A1 | K |
| | Hoi, Sali, Ciao, Uf Widerluege | – | – | ⚠ dialect: avoid |
| **Transport** | Fahrrad | **Velo** | A1 | ÖSD (glossed once), D |
| | Fahrkarte | Billett | A1 | K |
| | Bahnsteig | Perron (Gleis also used) | A2 | D |
| | Bürgersteig | Trottoir | A2 | D |
| | parken | parkieren | A2 | D |
| | Straßenbahn | Tram (das Tram) | A1 | K |
| | Tretroller | Trottinett | B1 | D |
| | Bahncard / Jahreskarte | Halbtax, GA (Generalabonnement) | B1 | K |
| **Food** | grillen | grillieren | A2 | ÖSD, D |
| | Hähnchen | Poulet | A2 | K |
| | Möhre | Rüebli | A2 | D |
| | Eis | Glace | A2 | K |
| | Croissant | Gipfeli | A2 | K |
| | Sahne | Rahm | A2 | K (also W-AT, S-DE) |
| | Paprika (vegetable) | Peperoni | B1 | K |
| | Abendessen | Nachtessen | A2 | D |
| | Frühstück | Morgenessen | – | D "veraltend": avoid |
| | Vormittagspause, -snack | Znüni | B1 | D; informal, context-clear only |
| | Mittagessen | Zmittag | – | D; ⚠ coll.-leaning, avoid in writing |
| | Friseur | Coiffeur | A2 | D |
| **Housing** | umziehen | zügeln | B1 | K |
| | Hausmeister | Hauswart, Abwart | B1 | D |
| | Dachboden | Estrich | B1 | K |
| | Waschbecken | Lavabo | B1 | K |
| | 3-Zimmer-Wohnung | 3½-Zimmer-Wohnung (halves count) | A2 | K |
| **School / work** | Lehrer/in (generic) | Lehrperson | B1 | ÖSD (8), D |
| | Unterrichtsstunde | Lektion | A2 | ÖSD ("Kurslektionen") |
| | Auszubildende/r | Lernende/r, Lehrling | A2 | K |
| | Abitur | Matur / Maturität | B1 | D |
| | Grundschule | Primarschule | A2 | K |
| | Urlaub (employee leave) | Ferien | A1 | ÖSD; K |
| | Jobcenter | RAV (Regionales Arbeitsvermittlungszentrum) | B1 | K |
| | Rentenversicherung | AHV | B1 | K |
| | benutzen | benützen (also AT) | A2 | ÖSD |
| | innerhalb (von) | innert | B1 | ÖSD (also W-AT) |
| **Authorities** | Bürgeramt | Gemeindeverwaltung, Einwohnerkontrolle / Einwohnerdienste | B1 | K |
| | Bundesland | Kanton | A2 | ÖSD |
| | Krankenhaus | Spital | A2 | K |
| | Handy | Natel (dated brand word; *Handy* now usual) | – | K; avoid |

### 3.4 Grammar and usage points (AT unless stated)

| Point | DE (common) | AT / CH | Use in our texts |
|---|---|---|---|
| Perfect of *sitzen, stehen, liegen* | ich habe gesessen | ich **bin** gesessen (AT, CH, S-DE; standard per Duden) | AT/CH speakers, B1 dialogue/letters. Never the tested point |
| Gender | die E-Mail, die Cola | das E-Mail, das Cola (AT); das Tram (CH) | AT/CH-set texts only; ÖSD instructions use both |
| Prepositions | in Urlaub fahren; am Wochenende | auf Urlaub; am Wochenende (AT also *zu*) | light touch |
| Time telling | Viertel nach / vor | also viertel acht, dreiviertel acht (AT-East) | B1 dialogue, never an item key |
| Diminutive | -chen | -erl (Sackerl, Packerl), -li (Gipfeli, Rüebli) in CH | only lexicalised words above |
| Date | 3. Januar 2027 | 3. Jänner 2027 (AT) | |
| Swiss letters | Sehr geehrte Frau X, | comma optional; ss; «» | CH-set texts |

### 3.5 Formats (realia)

| | DE | AT | CH |
|---|---|---|---|
| Price | 12,90 € / 12,90 Euro | 12,90 € / € 12,90 / 12,90 Euro | CHF 12.90 / Fr. 12.90; ÖSD ZA1 printed `CHF 1'200,–` |
| Thousands | 1.200 | 1.200 | 1'200 (apostrophe) |
| Postcode | 5 digits (10115 Berlin) | 4 digits; Vienna `1xx0` = district (1070 = 7th) | 4 digits (8001 Zürich, 3011 Bern, 4051 Basel) |
| Address | Hauptstraße 5 | Burggasse 10 / Stiege / Tür, e.g. `Burggasse 10/2/15` | Bahnhofstrasse 5 |
| Phone | 030 …, mobile 015x/016x/017x | 01 … (Vienna), mobile 0664/0676/0699 (ÖSD: `0676 / …`) | 044 … (Zürich), 031 … (Bern), mobile 076/077/078/079 |
| Emergency | 112, Polizei 110 | Rettung 144, Polizei 133, Feuerwehr 122 (+112) | Sanität 144, Polizei 117, Feuerwehr 118 (+112) |
| Web/e-mail | .de | .at (ÖSD: `…@klu.at`, `….at` blog) | .ch |
| Admin units | Bundesland, Kreis, Gemeinde | Bundesland, Bezirk (BH), Gemeinde; Statutarstadt → Magistrat | Kanton, Bezirk, Gemeinde |

`K` items in §3.5 (phone prefixes, emergency numbers, address slash format) are well known but were not re-checked today.
`TODO(hannes): unverified` before any of them become an item key.

## 4. Rules for the generator (ÖSD and Goethe B1, later ZA1/ZA2)

1. **Region is a property of the text, not of the exam.** Every block/speaker already gets `region: de | at | ch`
   (goethe-plan.md §3). Regional words appear **only** in texts whose setting, sender or speaker is from that region.
   A DE-set text never contains *Jänner*; an AT-set one may.
2. **Mix per set ~60 % DE / 25 % AT / 15 % CH** (goethe-plan.md §3). For ZA1/ZA2 shift to about 40/40/20 (the ZA2
   Modellsatz has 3 AT, 2 DE, 1 CH reading texts). For a future */Österreich* variant, mostly AT. `TODO(hannes)`.
3. **Density: 1–3 variants per AT/CH text, at most one per sentence.** Prefer high-frequency, context-clear words
   (Jänner, Kassa, Semmel, Matura, Velo, Billett, parkieren). No word lists dressed up as text.
4. **Never key an item to a regional word unless it is glossed** in a footnote: `*Wort = österreichischer Standard für
   „…"` / `Schweizer Standard für „…"` (ÖSD's own pattern). At most one glossed word per Teil.
5. **Standard only.** Nothing flagged ⚠ in §3 (Bim, Öffis, Pickerl, Baba, Leiberl, Zmittag, Swiss dialect greetings).
   Hören: light national accent via voice choice, never dialect spelling in the script.
6. **Labels.** Reading texts get an origin line where ÖSD uses one ("aus einer österreichischen Zeitung"). Forum and
   letter writers sign with name, age and a real D/A/CH city.
7. **Swiss texts:** ss instead of ß, «» quotes, CHF with apostrophe thousands, Swiss postcodes/phones. Austrian texts
   keep ß and „" quotes.
8. **Realia follow the region** (§3.5): prices, phone numbers, institutions (AMS, Magistrat, Gemeindeamt, BH;
   Kanton, Gemeinde, RAV). Invent names of businesses and people, never real brands.
9. **Instructions (Aufgabenstellung) stay common German** and identical to the official wording pattern. For ZA1/ZA2
   follow ÖSD's own sheets ("ein E-Mail"); for B1 follow the shared sheets ("eine E-Mail").
10. **Candidate feedback (Schreiben/Sprechen):** accept AT/CH vocabulary and *bin gesessen*; flag Swiss ss in
    candidate writing gently, as ÖSD marks it FO (§1). Never penalise a regional accent.
11. **Validator idea:** a list of AT and CH markers (this file) checked against the block's `region`; a marker in a
    `de` block, or a ⚠ word anywhere, is a warning. `TODO(hannes)`: approve before building.

## 5. Surprises

- Zero *Jänner* in all official ÖSD material: not because ÖSD avoids it, but because no January date appears.
- Most AT-set texts look like common German; ÖSD uses *Krankenhaus* 19×, *Spital* 0×.
- Swiss texts are truly Swiss in spelling (ss, «»), yet a candidate's "Grüsse" is marked as an error.
- ÖSD's own B1 commentary says "ein persönliches E-Mail", while its B1 task sheets (shared with Goethe) say "eine E-Mail".
- A Basel ad in ZA1 says *Brötchen*: realism is about setting and realia, not about forcing a variant into every line.

## 6. Sources (all checked 2026-10-24)

- **[S1]** ÖSD, *ÖSD Zertifikat B1 – Übungsmaterialien Band 1*, 4th ed. © 2026 (§1 Niveau; Hören "Texte"; Schreiben
  Mustertext; Modellsatz; §17 Literatur): https://osd.at/wp-content/uploads/2026/09/ZB1-Uebungsmaterialien-Band-1_WEB.pdf
- **[S2]** ÖSD, *ZB1 Folder*: https://www.osd.at/wp-content/uploads/2024/02/ZB1_Folder.pdf (no variety statement found)
- **[S3]** Goethe-Institut / ÖSD, *Goethe-Zertifikat B1 Übungssatz Erwachsene* © 2016:
  https://www.goethe.de/pro/relaunch/prf/materialien/B1/B1_Uebungssatz_Erwachsene.pdf
- **[S4]** ÖSD, *ZA1 Modellsatzbroschüre mit Informationen*, 5th ed. 2024 ("Plurizentrik", "Wortschatz"):
  https://www.osd.at/wp-content/uploads/2024/09/ZA1-Modellsatzbroschure_WEB.pdf · ZA1 Modellsatz 2026:
  https://osd.at/wp-content/uploads/2026/08/ZA1_Modellsatz.zip
- **[S5]** ÖSD, *ZA2 Modellsatz* 2026: https://osd.at/wp-content/uploads/2026/08/ZA2_Modellsatz.zip
- **[S6]** ÖSD, *Durchführungsbestimmungen ZB1* (10/2023) and *Prüfungsordnung* (from 1 Aug 2026): no statement on
  varieties. https://www.osd.at/wp-content/uploads/2023/09/ZB1-Durchfuhrungsbestimmungen_10_2023.pdf ·
  https://osd.at/wp-content/uploads/2026/08/OSD-Prufungsordnung_gueltig-ab-01.08.2026.pdf
- **[S7]** EU-Beitrittsvertrag, Akte, *Protokoll Nr. 10 über die Verwendung spezifisch österreichischer Ausdrücke der
  deutschen Sprache im Rahmen der Europäischen Union*, BGBl. Nr. 45/1995, in force 1 Jan 1995. Art. 1:
  https://www.ris.bka.gv.at/Dokumente/Bundesnormen/NOR12085775/NOR12085775.rtf · Anhang (the 23 terms):
  https://www.ris.bka.gv.at/Dokumente/Bundesnormen/NOR12085776/NOR12085776.rtf
- **[S8]** Rat für deutsche Rechtschreibung, *Amtliches Regelwerk* (2016, ed. 2018), § 25 E2 ("In der Schweiz kann man
  immer ss schreiben") and the salutation rules: https://www.rechtschreibrat.com/DOX/rfdr_Regeln_2016_redigiert_2018.pdf
- **[S9]** RIS, Arbeitsruhegesetz § 7 (2): https://www.ris.bka.gv.at/NormDokument.wxe?Abfrage=Bundesnormen&Gesetzesnummer=10008541&Paragraf=7
- **[S10]** Duden online, usage labels ("Gebrauch") for each `D` entry, e.g. https://www.duden.de/rechtschreibung/Jaenner
- **[S11]** Examples of official Austrian "Jänner" use: https://www.salzburg.gv.at/umweltnaturwasser_/Documents/2024-01.pdf ·
  https://www.land-oberoesterreich.gv.at/27531.htm
- Background (not opened in full): Ammon et al., *Variantenwörterbuch des Deutschen* (De Gruyter; cited by ÖSD [S1]);
  *Österreichisches Wörterbuch* (official for Austrian schools and authorities). Der Standard on the 23-term
  compromise: https://derstandard.at/1947362/Oesterreichisches-Deutsch-existiert-in-der-EU-nur-kulinarisch
- `TODO(hannes): unverified` — all `K` entries: well documented, but not checked against ÖWB/Duden today. Check the
  ones we actually use before publishing a set.
