# Official DTZ situations: do-not-reuse catalogue

Paraphrased (no quotes) from g.a.s.t. Übungssatz 1 + 2 (2024), Goethe/telc Modellsatz (2009), DTZ Prüfungshandbuch and a telc training sample chapter. Built 2026-10-22 after the set 1 realism check found Hören items re-skinning Übungssatz 2. `scripts/modelltest/author.ts` sends the relevant section with every prompt and runs an originality check against it. Format only: never reuse a situation **and** its tested twist.

```text
OFFICIAL DTZ MATERIAL - SITUATION CATALOGUE ("do not reuse" list)
Sources: U1 = g.a.s.t. Übungssatz 1 (2024) | U2 = g.a.s.t. Übungssatz 2 | MS = Goethe/telc Modellsatz 2009
         HB = DTZ Prüfungshandbuch (examples only; mostly reprints MS items) | TT = telc Prüfungstraining sample chapter (2020)
Format: SOURCE item | text type | situation (paraphrased) | question focus
All lines are paraphrases. Generator: avoid these situations AND their key twists.

======================================================================
HÖREN
======================================================================

--- Hören Teil 1 (Ansagen am Telefon / Durchsagen) ---
U1 Bsp | Kino-Bandansage | Kino am Stadtpark: drei Filme Samstag 16/18/20 Uhr, Preise | Uhrzeit eines Films
U1 1 | Durchsage U-Bahn | Haltestelle Rosengarten wegen Bauarbeiten gesperrt; Bus, dann Umstieg Friedrichring | was tun, um hinzukommen
U1 2 | Anrufbeantworter | Arztpraxis: bestelltes Rezept liegt bereit, Versichertenkarte mitbringen | wer ruft an
U1 3 | Durchsage im Zug | Zug endet am Ostbahnhof wegen Defekt; Ersatzbusse am Ausgang | was sollen Fahrgäste tun
U1 4 | private Sprachnachricht | Freund beschreibt Weg: Bus ab Busbahnhof, wohnt gegenüber Schule | wo wohnt er
U2 Bsp | Kino-Bandansage | (identisch mit U1 Bsp) | Uhrzeit eines Films
U2 1 | Bahnhofsdurchsage | IC nach Frankfurt wegen Bauarbeiten heute von anderem Gleis (11->12) | welches Gleis
U2 2 | Anrufbeantworter | Kfz-Versicherung kann nicht abbuchen: falsche Kontonummer angegeben | was ist das Problem
U2 3 | Anrufbeantworter | Bürgerbüro: neuer Ausweis fertig; heute bis 12, morgen Nachmittag, nächste Woche zu | wann abholen
U2 4 | Anrufbeantworter | Friseursalon: Friseurin krank, nächster Termin erst übermorgen | wann ist sie wieder da
MS Bsp | Kunden-Hotline-Menü | Tastenmenü: Bestellung, Fax, Mitarbeiter, Null zurück | welche Taste für Bestellung
MS 1 | Anrufbeantworter | Arztpraxis: Blutwerte da, Arzt will sprechen, bitte zurückrufen | was soll Frau tun
MS 2 | Anrufbeantworter | Wohngeldstelle: Mietbescheinigung fehlt, Formulare abholen, zur Sprechzeit kommen | was soll Frau tun
MS 3 | Bahnsteigdurchsage | Regionalexpress nach Lübeck fällt aus; über Bad Oldesloe umsteigen | wie heute nach Lübeck
MS 4 | Praxis-Anrufbeantworter | Ärztin im Urlaub bis Datum; Vertretung bei anderem Arzt | was tun bei dringendem Termin
TT - | (Lektion 1 Mobilität: nicht im Auszug enthalten)

--- Hören Teil 2 (Radio) ---
U1 5 | Veranstaltungstipp | Sommerfestival im Schlosspark: Samstag Musik/Kurzfilme, Sonntag Kinderprogramm | was gibt es am Sonntag
U1 6 | Werbung Arzneimittel | pflanzliches Schlafmittel: mittags und abends Tropfen mit Wasser | wie einnehmen
U1 7 | Kinoprogramm | drei Kinos, Komödie/Krimi/Zeichentrickfilm | was läuft in Kino X
U1 8 | Programmtipps Radio | Hörspielkrimi, Wunschkonzert, Doku je auf anderem Sender | wo hört man Musik
U1 9 | Zugdurchsage Anschlüsse | Ankunft Aschaffenburg, Anschlüsse nach Würzburg und Regionalbahnen | Abfahrtszeit Anschluss
U2 5 | Werbung Erkältungsmittel | pflanzliche Tropfen auch für Kinder ab 6 | wer darf nehmen
U2 6 | Moderatorenhinweis | Hörer können Konzerttickets in Morgensendung gewinnen | was kann man gewinnen
U2 7 | Verkehrsbetriebe | Sommerferienfahrplan: nur zwei Straßenbahnlinien fahren | welche Linien fahren
U2 8 | Durchsage Zug endet | technische Probleme; Fahrgäste Richtung Schloss nehmen Bus | wie zum Schloss
U2 9 | Veranstaltungstipp | französische Filmtage; Tageskarte vs. Karte für ganzes Programm | Preis Gesamtkarte
MS 5 | Nachrichtenüberblick | Schlagzeilen: Staatsbesuch, Schneechaos, Festnahme, Filmfestspiele | Sendungstyp erkennen
MS 6 | Wetterbericht | Samstag Regen im Norden, Süden erst freundlich, zu kühl | Wetter Norddeutschland
MS 7 | Verkehrsmeldung | drei Autobahnen: Reifenteile, Stau, Personen auf Fahrbahn nach Unfall | wo laufen Leute
MS 8 | Gewinnspiel Festival | zwei Gratiskarten Afrika-Festival; Telefonnummer anrufen | wie gewinnt man
MS 9 | Unwetterwarnung | Sturmwarnung Küste: Fenster/Türen zu, Haus nicht verlassen | was sollen Sie tun
TT P1 | Radioansage | Rathaus-Info / Seniorenhandy-Werbung / Kursinfo (Distraktoren) | was hören Sie
TT P2 | Radioansage | Bücherbus: Sommerferien, Haltestellen, neuer Fahrplan | was gilt für Bücherbus
TT P3 | Radioansage | Museum-Website: Eröffnungsvideo, Kinderspiele, Online-Ausstellung | was gibt es online
TT P4 | Veranstaltungshinweis | Veranstaltung: 18 Uhr / online / für Kinder und Jugendliche | Detail zur Veranstaltung
TT P5 | Buchtipp | Buch: mehrere Sprachen / Krimi / unter 10 Euro | Detail zum Buch
TT Ü | Übungsdialoge | Stadtbibliothek: Ausweis, Leihfristen, Gebühr 20 Euro; Podcast Kinderserie/Fußballspiel | (Übung, kein Prüfungsitem)

--- Hören Teil 3 (Gespräche; R/F + a/b/c) ---
U1/U2 Bsp | Nachbargespräch | Nachbarin im Büro; Nachbar soll Stromableser in Wohnung lassen | was soll er tun
U1 10/11 | Apotheke | Kunde will billige Kopfschmerztabletten; max. drei täglich, wirken lange | R/F Frau ist Ärztin; Wirkdauer
U1 12/13 | Freunde | Krankenschwester glücklich im neuen Job, junge Chefin war selbst Pflegerin | R/F unglücklich; Eigenschaft Chefin
U1 14/15 | Ehepaar | Kita-Sommerfest; Mann will nicht grillen, kommt aber mit | R/F kommt er; was statt grillen
U1 16/17 | Paar beim Einkauf | Frau will grünes Kleid für Geburtstag der Schwiegermutter, Mann findet teuer | R/F kaufen; Meinung Mann
U2 10/11 | Vorstellungsgespräch privat | Tochter sucht Haushaltshilfe für sehbehinderte Mutter; Bewerberin Ex-Krankenschwester | R/F erstes Treffen; Aufgaben
U2 12/13 | Büro, Chef | Angestellte will zwei Tage Urlaub wegen TV-Quizshow, kam gerade aus Urlaub | R/F Frage an Chef; Detail
U2 14/15 | Arztpraxis Empfang | Patient ohne Termin will sofort dran; neuer Termin übermorgen 15 Uhr | R/F Termin nächste Woche; wann
U2 16/17 | Weg fragen Straße | Fremder sucht Straße; zu Fuß 30 Min., besser Straßenbahn | R/F am Hauptbahnhof; Entfernung
MS Bsp | Teambesprechung | Leiterin nennt Themen, Kollege will Urlaubsantrag abgeben | worum geht es
MS 10/11 | Nachbarn | Nachbarin mit Kopfschmerzen bittet, Sohn soll Musik leiser machen | R/F Kollegen; Bitte
MS 12/13 | Telefon Freunde | Hochzeitsgeschenk für befreundetes Paar: Hochzeitstisch im Kaufhaus | R/F wollen heiraten; Thema
MS 14/15 | Arbeitsvermittlung | Frau sucht Stelle als Arzthelferin, 12 Jahre Erfahrung, Vollzeit | R/F hilft bei Suche; was fragt er
MS 16/17 | Telefon Lehrerin | Klassenlehrerin: Sohn kommt nicht mit, Sitzenbleiben droht, Sprechstunde | R/F mit Igor; was will sie

--- Hören Teil 4 (Hörerumfrage; Meinungen zuordnen) ---
U1 | Ladenöffnung am Sonntag / 24-Stunden-Einkaufen | Sätze: schon viele offen; Ausland; Zukunft länger offen; Freizeit zusammen; Hektik; Banken
U1 18 | Freiberufler: Trend zu Rund-um-die-Uhr-Einkauf, Nachbarländer machen es | Zukunft länger offen
U1 19 | Gegner: Sonntagsarbeit zerstört Familie und Freundschaften | gemeinsame Freizeit geht verloren
U1 20 | Ärztin: Patienten haben schon zu viel Stress | Leute schon jetzt gehetzt
U2 | Gesunde Ernährung: Fleisch, Gemüse, Bio, Garten | Sätze: Bio egal; Fisch teuer; Fleisch stark; Kinder/Gemüse; selbst anbauen; Gesundheit
U2 Bsp | Mann mit eigenem Gartenstück, baut Obst/Gemüse an | Anbauen macht Spaß
U2 18 | Bio ist für Reiche, Herkunft egal | Bio unwichtig
U2 19 | Vegetarierin seit Jahren, Vitamine wichtig | Obst/Gemüse gesund
U2 20 | Familie isst viel Fleisch, gibt Kraft; Fisch nur frisch | Fleisch macht stark
MS/HB | Kindergarten oder zu Hause? | Sätze: Zeit mit Erwachsenen; Zeit nur für Kinder; bei Mutter bis Schule; früh in Kita; Kita für Migrantenkinder; Geldfrage
MS Bsp | Kleine Kinder gehören zur Mutter bis zur Schule | bei Mutter bleiben
MS 18 | Tochter ab drei in Kita, braucht andere Kinder | früh in Kindergarten
MS 19 | Wollte zu Hause bleiben, Mann verdient zu wenig | Erziehung zu Hause ist Geldfrage
MS 20 | Türkische Familie: Kita wegen Sprache und deutscher Freunde | Kita nützlich für ausländische Kinder

======================================================================
LESEN
======================================================================

--- Lesen Teil 1 (Verzeichnisse; a/b/c mit "anderes ...") ---
Directory types used: U1 Rathaus-Zentralwegweiser (Stockwerke/Ämter) | U2 Ratgeberbuch "Leben in Deutschland" Inhaltsverzeichnis (Kapitel)
                      MS/HB Online-Shop-Kategorien (Internetseite) | TT Lektion 5 "Ämter und Behörden" (nicht im Auszug)
U1 Bsp | Wegweiser Rathaus | finanzielle Hilfe für Ausbildung (BAföG) | Jugendamt-Stockwerk
U1 21 | Wegweiser Rathaus | Großmutter kann nicht mehr kochen/putzen | Sozialamt (Hilfe für Ältere)
U1 22 | Wegweiser Rathaus | Infos über Krankenhäuser in der Region | Gesundheitsamt (anderes Stockwerk)
U1 23 | Wegweiser Rathaus | neuer Führerschein | Verkehrsamt
U1 24 | Wegweiser Rathaus | wichtiges Dokument kopieren | Bürgeramt Kopierer
U1 25 | Wegweiser Rathaus | größere Mülltonne | Umweltamt
U2 Bsp | Buch-Inhaltsverzeichnis | Hilfe beim Umzug | Wohnen und Haushalt
U2 21 | Buch-Inhaltsverzeichnis | Neffe hat schlechte Schulnoten | Kinder und Familie
U2 22 | Buch-Inhaltsverzeichnis | Konto bei Internetbank eröffnen | Rund ums Geld
U2 23 | Buch-Inhaltsverzeichnis | Fragen zum Arbeitsvertrag | Geld verdienen (anderes Kapitel)
U2 24 | Buch-Inhaltsverzeichnis | neue Leute kennenlernen | Freizeit/Vereine
U2 25 | Buch-Inhaltsverzeichnis | billiges Kinderbett | Möbel günstig (Wohnen)
MS Bsp | Shop-Kategorien | Speicherkarte für Fotos auf Betriebsausflug | Foto & Camcorder
MS 1 | Shop-Kategorien | gebrauchtes Auto | Fahrzeuge (andere Seite)
MS 2 | Shop-Kategorien | Geschenk für Bekannte, die gern Geschichten hört | Hörbücher
MS 3 | Shop-Kategorien | Umzugskartons | Heimwerker/Umzugsmaterial
MS 4 | Shop-Kategorien | Kaffeemaschine fürs Büro | Haushaltsgeräte (andere Seite)
MS 5 | Shop-Kategorien | Schreibtischlampe für Heimarbeit | Möbel & Wohnen/Lampen

--- Lesen Teil 2 (Anzeigen zuordnen, 1x X) ---
Ad themes: U1 Weiterbildung/Nebenjob/Führerschein | U2 Wohnungen + Versicherungen | MS/HB Stellenanzeigen (Handwerk/Gastro) | TT Lektion 6 Einkaufen (nicht im Auszug)
U1 26 | Anzeige | Kinder in Freizeit betreuen | Babysitterkurs
U1 27 | Anzeige | studieren mit nur Realschulabschluss | VHS Schulabschluss nachholen
U1 28 | Anzeige | Nebenjob am Wochenende | Zeitungsausträger samstags
U1 29 | Anzeige | Führerschein machen | X (nur Fahrlehrer-Ausbildung, Distraktor)
U1 30 | Anzeige | Ausbildung von zu Hause | Fernlehrgang Webentwickler
U1 Distr. | Anzeigen | Fahrlehrer werden; Bäckerei-Aushilfe nachmittags; Bildungsgutschein Arbeitsagentur | -
U2 26 | Anzeige | Freundin will Unfallversicherung | Freizeit-Unfallversicherung
U2 27 | Anzeige | Mietwohnung groß, mit Balkon, Katze erlaubt | 4-Zimmer, Haustiere willkommen
U2 28 | Anzeige | kleine Wohnung kaufen | 1-Zimmer zum Kauf
U2 29 | Anzeige | Krankenversicherung für Hund | X (nur Tierhaftpflicht, Distraktor)
U2 30 | Anzeige | Verwandtenbesuch, Wohnung zu klein | Wohnen auf Zeit
U2 Distr. | Anzeigen | private Krankenversicherung; Wohnung ohne Tiere/Balkon; Renovierwohnung ohne Balkon | -
MS 6 | Stellenanzeige | Friseurin, stundenweise, Berlin | Haarstudio Berlin flexible Zeit
MS 7 | Stellenanzeige | Ausbildungsplatz Köchin ab September | Hotel bietet Kochausbildung
MS 8 | Stellenanzeige | Job als Maler und Tapezierer | X (Umzugsfirma sucht Tischler, Distraktor)
MS 9 | Stellenanzeige | Kfz-Werkstatt, will Lehrlinge ausbilden | Kfz-Servicetechniker
MS 10 | Stellenanzeige | Sommerjob, Geld für Auto | Ferienjob Juli/August
MS Distr. | Anzeigen | Koch Düsseldorf; Minijob Friseur anderswo; Autoverkäufer | -

--- Lesen Teil 3 (3 Kurztexte; R/F + a/b/c) ---
U1 31/32 | Zeitungsmeldung | Straßenfest: Bus öfter, Sonderbusse, Monatskarte nimmt Familie mit | R/F Bus öfter; ÖPNV nutzen
U1 33/34 | E-Mail Firma | Internetanbieter Auftragsbestätigung, Techniker-Termin per Link bestätigen | R/F neuer Anschluss; wie bestätigen
U1 35/36 | Brief Lehrerin | Klassenlehrerin lädt Familie zum Klassenfest, alle bringen Essen mit | R/F Lehrerin; Einladung
U2 31/32 | Zeitungsmeldung | Bürgerbüro nach Umbau offen; keine Kfz-Anmeldung, neu Rechtsberatung | R/F geschlossen; was möglich
U2 33/34 | Brief Kita-Leitung | Kita-Beitrag steigt um 10 Euro wegen Reparaturen, Renovierung | R/F mehr zahlen; was muss Kita tun
U2 35/36 | Brief Sprachschule | Einstufungstest: zwischen A2 und B1, Berufskurs erst ab B2 | R/F angemeldet; was stimmt
MS/HB 11/12 | Zeitungsmeldung | Bundesland fördert ehrenamtliche Integrationshelfer mit 500.000 Euro | R/F Betrag; Ziel Zusammenarbeit
MS 13/14 | Brief Kindergarten | Sommerfest mit Kinderaufführung; Eltern sollen Kuchen bringen oder spenden | R/F putzen; was sollen Eltern
MS/HB 15/16 | Brief Hausverwaltung | Nebenkostenabrechnung mit Guthaben, Miete sinkt ab Februar | R/F mehr Miete; zu viel bezahlt

--- Lesen Teil 4 (Broschüre; 3x R/F) ---
U1 37-39 | Elterninfo | Mittagsbetreuung Grundschule: Mo-Fr, Gebühren, Geschwisterrabatt, Gruppenregeln | Wochenende zu; Rabatt 2 Kinder; Regeln
U2 37-39 | Fahrgastregeln | Verkehrsverbund: Fahrrad nur mit halbem Ticket, Rucksack, Hunde an Leine | Fahrrad ohne Ticket; Rucksack; Hunde
MS/HB 17-19 | Beipackzettel | Ibuprofen-Schmerzmittel: nach dem Essen, Autofahren erlaubt, letztes Schwangerschaftsdrittel verboten | Einnahme; Autofahren; Schwangerschaft
TT - | (Lektion 8 Gesundheit: nicht im Auszug)

--- Lesen Teil 5 (Lückenbrief, 6x a/b/c) ---
U1 40-45 | Beschwerdebrief an Hotel | Paar: Zimmer klein und laut, kein Warmwasser, will Geld zurück | Possessiv, weil, Aber, kein, obwohl, zurück
U2 40-45 | Brief Abo-Service | Zeitschriftenabo bestätigt, Lieferung ab Heft X, Adresse prüfen | Dank, an, Ihrem, Ihre, wenn, unserer
MS/HB 20-25 | Kündigungsbrief | Probeabo Tageszeitung kündigen, keine Zeit zum Lesen | Anrede, mir, möchte, musste, Deshalb, freundlichen

======================================================================
SCHREIBEN (Aufgabe A / B, je 4 Leitpunkte)
======================================================================
U1 A | E-Mail an Weiterbildungszentrum | Erste-Hilfe-Kurs: Fragen stellen | Warum Kurs / eigene Erfahrungen / Dauer+Termine / Kosten
U1 B | Brief an Vermieter | Treppenhausreinigung: Nachbarn putzen nicht | Grund / eigene Lösungsversuche / weitere Hausprobleme / was Vermieter tun soll
U2 A | Antwort-E-Mail an Bekannten | Gartenpflege während seines Urlaubs | Hilfe zusagen / Ihre Aufgaben / Werkzeug / wie oft
U2 B | Schreiben an Vermieter | Fenster schließen nicht, Wohnung kalt, Anruf ohne Folge | Grund / warum kalte Wohnung schlecht / was Sie wollen / was Sie tun, wenn nichts passiert
MS/HB A | an Kurslehrerin | fehlen diese Woche im Deutschkurs | Grund / Entschuldigung / Hausaufgaben / Rückkehr in den Kurs
MS B | Antwort an frühere Lehrerin | Einladung zur Geburtstagsparty | Grund / was Sie gerade machen / kommen Sie? / Bitte um Wegbeschreibung
HB samples | 3 Lernertexte zu MS A | Kind/Mann krank, bleibe zu Hause, frage nach Hausaufgaben | Bewertet unter A2 / A2 / B1
TT Ü | E-Mail an Stadtbibliothek | Anmeldung, Fragen zu Öffnungszeiten/Gebühren/Leihfrist | (Übung; Lektion 10 Kinderbetreuung nicht im Auszug)

======================================================================
SPRECHEN
======================================================================

--- Sprechen Teil 1 (Über sich sprechen) ---
All sources (U1, U2, MS, HB, TT) | Stichworte immer: Name, Geburtsort, Wohnort, Arbeit/Beruf, Familie, Sprachen
U1/U2 1B Beispiele | Beruf nicht verstanden, nachfragen; wann/mit welchem Alter Sprache gelernt
MS/HB 1B Beispiele | Herkunft/Bedeutung des Namens; früher wohnen; Beruf gelernt; Kinder Alter; Sprache zu Hause
MS 1 Zusatzfrage | Lieblingsbeschäftigung in der Freizeit
HB Transkript | Frau aus Äthiopien (Oromo/Amharisch), Fernsehen in Heimatsprache; Türkin mit Minijob Küchenhilfe, will Kassiererin werden
HB Musterlösung | junger Mechaniker aus Ex-Jugoslawien in Mannheim, Hobbys Fußball/Musik
TT Ü | Lernerprofile: Syrer Alphabetisierung, Lkw-Fahrer; Kolumbianerin will Dolmetscherin; Ukrainerin Bürokauffrau -> Erzieherin

--- Sprechen Teil 2 (Foto + Erfahrungen) - topics ---
U1 | Einkaufen: online vs. im Geschäft (A und B gleiche Fragen)
U2 | Nachbarn / Nachbarschaftshilfe
MS/HB | Müll und Mülltrennung (HB-Fotos: Glascontainer sortieren; liegengelassener Müll im Park nach Grillen)

--- Sprechen Teil 2B Prüferfragen (paraphrasiert) ---
U1 A2 | was schon online gekauft; welche Produkte lieber online/im Laden, warum
U1 A2 | wie im Heimatland: online oder Geschäft; wo kaufen Sie sonst ein
U1 B1 | wo meistens einkaufen, warum; Erfahrungen online, Vor- und Nachteile
U1 B1 | Heimatland: online oder Laden, warum so; andere Einkaufsmöglichkeiten
U2 A2 | Nachbarn schon geholfen, wobei; was sonst mit Nachbarn; wie viel Kontakt hier
U2 A2 | Heimatland: Kontakt zu Nachbarn, Unterschied zu Deutschland
U2 B1 | helfen Sie sich gegenseitig, wobei; Heimatland: mehr Nachbarschaftshilfe, warum
U2 B1 | Vor- und Nachteile Nachbarschaftshilfe; ist gegenseitige Hilfe wichtig, warum
MS A2 | wie machen Sie das mit Müll; wer macht das bei Ihnen; wie
MS B1 | wie läuft Müll im Heimatland; Meinung zum deutschen Mülltrennungssystem, warum
HB Transkript | Prüfer fragt: helfen Kinder beim Trennen; wer bringt Müll raus; was macht Stadt

--- Sprechen Teil 3 (Gemeinsam planen) ---
U1 | Wanderausflug mit Deutschkurs am Wochenende | wohin (Wald/Fluss/Stadt) / was besichtigen (Burg, Schloss, Museum) / übernachten / Essen / wer kommt
U2 | Besuch bei Freund, der nach Wien gezogen ist | wann/wie lange / Bahn-Auto-Flugzeug / gemeinsame Aktivitäten / Infos über Wien / Geschenk
MS/HB | Kursabschlussparty organisieren | wo / Essen-Getränke / Musik, Spiele / wer bezahlt / wer macht was
HB | Hausfest mit Nachbarn im Miethaus | wann / Essen-Getränke / wer bezahlt / Musik, Kinderspiele / wo (Hof)
HB Transkript | Abschlussparty: Treffen 10 Uhr einkaufen, Partyservice vs. selbst kochen, Pizza, Buffet, Kuchen
TT - | (Lektion 13 "Diskussion und Lösungen": nicht im Auszug)

======================================================================
TT LESSON THEMES (Handlungsfelder per Teil, from table of contents; content mostly not in sample)
======================================================================
Hören T1 Mobilität | Hören T2 Mediennutzung | Hören T3 Arbeit und Arbeitssuche | Hören T4 Wohnen
Lesen T1 Ämter und Behörden | Lesen T2 Einkaufen | Lesen T3 Banken und Versicherungen | Lesen T4 Gesundheit | Lesen T5 Unterricht
Schreiben Betreuung und Ausbildung der Kinder | Sprechen T1 Sprachen lernen | T2 Aus- und Weiterbildung | T3 Diskussion und Lösungen

======================================================================
CROSS-SOURCE PATTERNS TO AVOID REPEATING VERBATIM
======================================================================
- Kino-Bandansage with three film times (example in U1 and U2)
- Neighbour lets meter reader into flat (Hören T3 example, U1 and U2)
- Bauarbeiten -> Gleis-/Haltestellenänderung (U1 1, U2 1, MS 3)
- Zug endet wegen Defekt, Ersatzbus (U1 3, U2 8)
- Arztpraxis on answering machine (U1 2, MS 1, MS 4)
- Kita/Schule letter about Fest or fee (U1 35, U2 33, MS 13)
- Vermieter letter about building defect (U1 B, U2 B)
- Pflanzliche Tropfen ad with age rule (U1 6, U2 5)
- Hotel complaint / Abo letters in Lesen T5 (U1, U2, MS)
- Kursabschlussparty / Fest planning in Sprechen T3 (MS, HB)
```
