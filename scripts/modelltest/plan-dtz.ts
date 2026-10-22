// DTZ Modelltest plan: what each of the 10 sets is about, per Teil. The model only writes the German; coverage and
// variety come from here (inburgering lesson: without a plan file, 60 texts converged on the same few topics).
// Format per Teil: research/dtz-blueprint.md. Every entry is a topic, never a text, and never a topic of the official
// g.a.s.t. Übungssätze (format only, CLAUDE.md §4).

export type Kind = "anrufbeantworter" | "privat" | "info" | "bahnhof" | "radio" | "zug" | "gespraech" | "text"

export type Slot = { kind: Kind; topic: string }

const ab = (topic: string): Slot => ({ kind: "anrufbeantworter", topic })
const pv = (topic: string): Slot => ({ kind: "privat", topic })
const info = (topic: string): Slot => ({ kind: "info", topic })
const bf = (topic: string): Slot => ({ kind: "bahnhof", topic })
const ra = (topic: string): Slot => ({ kind: "radio", topic })
const zg = (topic: string): Slot => ({ kind: "zug", topic })

// Checked against research/dtz-official-situations.md (2026-10-22). Text types follow the official sets: Bandansage,
// Anrufbeantworter of firms and offices, a private voicemail, Durchsagen in station, U-Bahn or train. No department-store
// announcements (in no official set). Twists the official sets use are out: platform change for construction work,
// train ends with replacement bus, "is ready, pick it up", practice on the answering machine, film times.

/** Hören Teil 1: Beispiel + 4 Ansagen per set. */
export const HOEREN_1: Slot[][] = [
  [info("Recyclinghof: Annahmezeiten und was man abgeben darf"), bf("Bahnhof: Reisezentrum heute geschlossen, Fahrkarten am Automaten oder in der App"), pv("Bekannte: Kinderwagen abholen, wann sie zu Hause ist"), ab("Autowerkstatt: Reparatur wird teurer, Bitte um Zustimmung per Rückruf"), ab("Volkshochschule: Kurs beginnt eine Woche später")],
  [info("Hallenbad: Öffnungszeiten in den Ferien"), ab("Standesamt: eine Unterlage für die Anmeldung zur Hochzeit fehlt"), bf("Regionalexpress: Verspätung wegen einer Weichenstörung, neue Ankunftszeit"), pv("Kollege: möchte die Schicht am Freitag tauschen"), ab("Bank: neue Karte kommt per Post, die PIN getrennt")],
  [info("Stadtbibliothek: Öffnungszeiten und Rückgabeautomat"), ab("Stromanbieter: Abschlag ändert sich ab nächstem Monat"), zg("Zug: Klimaanlage in einem Wagen defekt, freie Plätze weiter vorne"), pv("Freundin: Treffpunkt vor dem Kino geändert"), ab("Kita: Elternabend wird verschoben")],
  [info("Theaterkasse: Vorstellung ausverkauft, Restkarten an der Abendkasse"), bf("Bahnsteig: Zug wird geteilt, vordere Wagen fahren in eine andere Stadt"), ab("Hausverwaltung: Wasser wird am Dienstag abgestellt"), ab("Schule: Kind hat Fieber, bitte abholen"), pv("Nachbarin: hat ein Paket für dich angenommen")],
  [info("Fundbüro der Stadt: Öffnungszeiten, was man mitbringen muss"), ab("Jobcenter: Termin verlegt, Unterlagen mitbringen"), bf("U-Bahn-Station: Rolltreppe außer Betrieb, anderen Ausgang benutzen"), ab("Paketdienst: Paket liegt in der Filiale, Vollmacht nötig"), pv("Cousin: kommt später an, wer ihn abholen soll")],
  [info("Zoo: Fütterungszeiten und Preise"), ab("Optiker: Gläser falsch bestellt, neuer Termin zum Messen"), bf("Bahnhof: Aufzug defekt, Umweg über die Rampe"), ab("Fitnessstudio: Kurs fällt aus, Ersatzkurs"), pv("Kollegin: Schlüssel vergessen, Bitte um Hilfe")],
  [info("Museum: Sonderausstellung und Führungen"), ab("Tierarztpraxis: Impftermin für die Katze"), ab("Volkshochschule: Kursraum geändert"), bf("Durchsage: Zug hält heute nicht in einem Ort, nächster Zug hält dort"), pv("Schwester: Geburtstagsessen, was du mitbringen sollst")],
  [info("Turnverein: Kinderturnen, Zeiten und Anmeldung"), ab("Arbeitgeber: Schicht morgen früher"), bf("Bahnhof: Fahrkartenautomaten gestört, Kauf im Zug ohne Aufpreis"), ab("Apotheke: Medikament nicht lieferbar, Rücksprache mit dem Arzt"), ab("Möbelhaus: Liefertermin, jemand muss zu Hause sein")],
  [info("Stadtwerke: Störungsnummer und Zählerstand melden"), ab("Elternbeirat: Hilfe beim Schulfest gesucht"), bf("ICE mit geänderter Wagenreihung"), ab("Sprachschule: Prüfungstermin und Unterlagen"), pv("Nachbar: dein Auto blockiert die Einfahrt")],
  [info("Restaurant: Ruhetag und Reservierung"), ab("Handyladen: Reparatur dauert länger, Leihgerät möglich"), ab("Physiotherapie: Termine nächste Woche ändern sich"), bf("Anschlusszug wartet nicht, nächste Verbindung"), pv("Freund: Fahrradtour fällt wegen Regen aus")],
]

/** Hören Teil 2: 5 Ansagen aus dem Radio (und eine Durchsage im Zug) per set. */
export const HOEREN_2: Slot[][] = [
  [ra("Werbung: Möbelhaus mit Lieferservice, was kostenlos ist"), ra("Meldung: Stadtbibliothek jetzt auch sonntags offen, nur der Lesesaal"), ra("Hörerservice: Ratgebersendung zum Mietvertrag, Telefonnummer und Uhrzeit"), zg("Zug: Bordrestaurant geschlossen, Snacks am Platz"), ra("Veranstaltungstipp: Fahrrad-Reparaturtag auf dem Marktplatz, was mitbringen")],
  [ra("Verkehr: Brücke gesperrt, Umleitung über den Ring"), ra("Werbung: Autowaschanlage, Rabatt am Dienstag"), ra("Wetter: Badewetter nur am Samstag"), zg("Zug: ein Wagen ist heute Ruhebereich"), ra("Veranstaltungstipp: Kochabend im Nachbarschaftszentrum, Anmeldung")],
  [ra("Flohmarkt für Kindersachen"), ra("Glätte am Morgen: Schulbusse fahren später"), ra("Werbung: Fahrschule mit Ferienkurs"), ra("Hörertelefon: Thema der Sendung"), ra("Fußgängerzone gesperrt wegen Marktaufbau")],
  [ra("Konzert im Park, Eintritt frei, Spende erbeten"), ra("Werbung: Sprachkurs-App mit Probemonat"), zg("Zug: Fahrkartenkontrolle, Handytickets bereithalten"), ra("Blutspende-Termin"), ra("Meldung: neue Fahrradstellplätze am Bahnhof")],
  [ra("Weihnachtsmarkt: Öffnungszeiten"), ra("Werbung: Supermarkt-Wochenangebot"), ra("Streik im Nahverkehr: Fahrkarten gelten auch im Regionalzug"), ra("Kinderprogramm in der Bibliothek"), ra("Hitze: Tipps")],
  [ra("Tag der offenen Tür bei der Feuerwehr"), ra("Verkehr: Parkhaus in der Innenstadt geschlossen"), ra("Werbung: Fitnessstudio-Angebot"), zg("Wagen 12 fehlt heute"), ra("Fotoaktion: Bilder vom Stadtpark einschicken, Preis ist ein Fahrrad")],
  [ra("Gesundheitsmesse"), ra("Pollenflug"), ra("Werbung: Handyvertrag"), ra("Stadtlauf: Straßensperrungen"), ra("Neue Buslinie")],
  [ra("Ausbildungsmesse"), ra("Werbung: Reisebüro"), ra("Nebel und Wetter morgen"), zg("Zug: Fahrradabteil voll, Fahrräder in den ersten Wagen"), ra("Kochsendung: Rezept zum Nachlesen")],
  [ra("Erntefest auf dem Bauernhof"), ra("Werbung: Pflegedienst"), ra("Wasserleitung kaputt: Straße gesperrt, Anwohner parken woanders"), ra("Sternwarte: Abendführung"), ra("Schwimmbad wieder geöffnet")],
  [ra("Sommerfest im Kleingartenverein"), ra("Werbung: Schuhgeschäft-Ausverkauf"), ra("Gewitter am Nachmittag"), ra("Mitmachaktion: Stadtputz"), zg("Halt wegen Signalstörung")],
]

const gs = (topic: string): Slot => ({ kind: "gespraech", topic })

/** Hören Teil 3: Beispiel + 4 Gespräche per set (each: one man and one woman, or two women). "(du)": friends or family, informal. */
export const HOEREN_3: Slot[][] = [
  [gs("Im Treppenhaus: Nachbarin fragt nach dem Kinderwagen im Flur"), gs("Im Copyshop: Bewerbungsmappe drucken"), gs("(du) Freunde: Fahrrad fürs Wochenende leihen"), gs("Auf dem Markt: Preis und Menge"), gs("Bei der Krankenkasse: Bonusheft und Zuschuss")],
  [gs("Paket für den Nachbarn annehmen"), gs("Im Sportgeschäft: Laufschuhe umtauschen"), gs("Reklamation: Wasserkocher kaputt"), gs("Anmeldung im Fitnessstudio"), gs("(du) Kolleginnen: Schicht tauschen")],
  [gs("Wohnungsbesichtigung"), gs("Am Bahnschalter: Fahrkarte und Umsteigen"), gs("Beim Hausarzt: Krankschreibung"), gs("(du) Freunde: Sprachtandem verabreden"), gs("Kundenservice: Internet geht nicht")],
  [gs("Im Bürgerbüro: Termin für den Reisepass"), gs("Anmeldung zum Deutschkurs"), gs("Mit dem Hausmeister: Heizung bleibt kalt"), gs("In der Bäckerei: Torte bestellen"), gs("(du) Kollegen: Weihnachtsfeier")],
  [gs("Fundbüro: Tasche verloren"), gs("Kita-Anmeldung"), gs("Probetraining im Fußballverein"), gs("Im Möbelhaus: Lieferung"), gs("(du) Mit der Freundin: Umzug helfen")],
  [gs("In der Bank: Konto eröffnen"), gs("Beim Friseur: Wunsch und Preis"), gs("(du) Geschwister: Oma besuchen"), gs("Jobcenter: fehlende Unterlagen"), gs("Im Zug: Platzreservierung")],
  [gs("Bibliothek: Ausweis verlängern"), gs("Arbeitsbeginn: erster Tag"), gs("Beim Zahnarzt: Kosten für eine Krone"), gs("(du) Mitbewohner: Putzplan"), gs("Im Restaurant: Rechnung falsch")],
  [gs("Volkshochschule: Kurs wechseln"), gs("Autowerkstatt: Reparaturkosten"), gs("Krankenkasse: Karte verloren"), gs("Tauschbörse: Kinderfahrrad"), gs("(du) Mit dem Kollegen: Fahrgemeinschaft")],
  [gs("Bürgeramt: Wohnung ummelden"), gs("Schulsekretariat: Kind ist krank"), gs("Supermarkt: Pfand und Leergut"), gs("Sportverein: Mitgliedsbeitrag"), gs("(du) Freunde: Konzertkarten teilen")],
  [gs("Handyladen: Vertrag kündigen"), gs("Augenarzt: Rezept für Kontaktlinsen"), gs("Hausmeister: Fahrradkeller"), gs("Postfiliale: Einschreiben"), gs("(du) Freunde: Ausflug mit dem Rad")],
]

/** Hören Teil 4: one topic per set; host intro, Beispiel + 3 opinions, 6 sentences a–f. Not: Sunday shopping, food, Kita. */
export const HOEREN_4 = [
  "Taschengeld für Kinder", "Arbeiten von zu Hause", "Kinder und Handys", "Mit dem Fahrrad zur Arbeit", "Haustiere in der Mietwohnung",
  "Sport im Verein oder allein", "Urlaub zu Hause oder im Ausland", "Gebraucht kaufen statt neu", "Ehrenamt in der Freizeit", "Deutsch lernen mit Apps",
]

/** Lesen Teil 1: one directory per set (Beispiel + 5 situations). */
export const LESEN_1 = [
  "Wegweiser im Landratsamt (Stockwerke, Abteilungen)", "Inhaltsverzeichnis: Ratgeber für Mieterinnen und Mieter (Kapitel)", "Wegweiser im Krankenhaus (Stockwerke, Stationen)",
  "Übersicht eines Stadtportals (Rubriken)", "Inhaltsverzeichnis: Programmheft der Volkshochschule (Kapitel)", "Wegweiser im Kaufhaus (Stockwerke, Abteilungen)",
  "Wegweiser im Jobcenter und Bürgerzentrum (Stockwerke)", "Inhaltsverzeichnis: Elternbroschüre der Stadt (Kapitel)", "Wegweiser im Ärztehaus (Stockwerke, Praxen)",
  "Übersicht eines Mieterportals (Rubriken)",
]

/** Lesen Teil 2: 8 ads a–h for 5 situations, one without a match. Theme mix per set. */
export const LESEN_2 = [
  "Haushaltshilfe und Reinigung", "Hilfe mit Computer und Handy", "Räume, Essen und Verleih für Feiern", "Kinderbetreuung und Freizeit für Kinder",
  "Möbel und Umzug", "Sport und Gesundheit", "Reisen und Ausflüge", "Handwerker und Dienstleistungen", "Autos, Fahrräder und Mobilität", "Vereine und Ehrenamt",
]

/** Lesen Teil 3: 3 texts per set (2 items each). */
export const LESEN_3: string[][] = [
  ["Pressemeldung: Stadt verschenkt Bäume für Gärten", "Brief des Hortes an die Eltern: neue Abholzeiten", "E-Mail der Musikschule: Probestunde"],
  ["Pressemeldung: neue Radwege", "Aushang der Hausverwaltung: Treppenhausreinigung", "E-Mail des Arbeitgebers: Betriebsausflug"],
  ["Pressemeldung: Schwimmbad wird saniert", "Brief der Schule: Projektwoche", "E-Mail der Krankenkasse: Bonusprogramm"],
  ["Pressemeldung: Stadtbibliothek digital", "Aushang im Sportverein: neue Trainingszeiten", "Brief des Vermieters: Mieterhöhung"],
  ["Pressemeldung: Wochenmarkt zieht um", "E-Mail der Volkshochschule: Kurs fällt aus", "Brief des Jobcenters: Einladung"],
  ["Pressemeldung: Bauarbeiten am Bahnhof", "Aushang in der Arztpraxis: Urlaub und Vertretung", "E-Mail des Kindergartens: Schließtage im August"],
  ["Pressemeldung: kostenlose Energieberatung", "Brief der Stadtwerke: Zählertausch", "E-Mail eines Online-Shops: Lieferung verspätet"],
  ["Pressemeldung: neues Familienzentrum", "Aushang im Supermarkt: Pfandautomat", "Brief der Bank: neue Karte"],
  ["Pressemeldung: Nachtbus-Linien", "E-Mail des Elternbeirats: Schulweg", "Brief der Versicherung: Vertragsänderung"],
  ["Pressemeldung: Repair-Café eröffnet", "Aushang der Hausverwaltung: Fahrradkeller räumen", "E-Mail des Fitnessstudios: Preise ab Januar"],
]

/** Lesen Teil 4: one brochure or rules text per set. */
export const LESEN_4 = [
  "Regeln für Gäste im Freizeitpark", "Regeln für die Gemeinschaftswaschküche", "Hausordnung eines Mehrfamilienhauses", "Benutzungsordnung der Stadtbibliothek",
  "Badeordnung des Hallenbads", "Teilnahmebedingungen eines Integrationskurses", "Informationen zum Recyclinghof", "Regeln für den Gemeinschaftsgarten",
  "Informationen zur Sperrmüll-Abholung", "Nutzungsbedingungen für Leihfahrräder",
]

/** Lesen Teil 5: one formal letter per set (gap 0 as Beispiel + 6 gaps). */
export const LESEN_5 = [
  "Zusage der Musikschule für einen Platz im Gitarrenkurs", "Antwort des Energieversorgers auf eine Bitte um Ratenzahlung", "Brief des Schwimmvereins zur Anmeldung eines Kindes", "Antwort der Hausverwaltung auf eine Reparaturmeldung",
  "Brief der Krankenkasse: fehlende Unterlagen", "Absage eines Arzttermins durch die Praxis", "Reklamation einer Lieferung", "Einladung zum Vorstellungsgespräch",
  "Einladung des Arbeitgebers zur Betriebsversammlung", "Antwort eines Vereins auf eine Mitgliedsanfrage",
]

/** Schreiben: Aufgabe A (halbformell: Sie an Bekannte, Kollegen, Nachbarn) and B (formell) per set. Not: course enquiry,
 * landlord complaint about the building, help during a holiday, excuse to the teacher, reply to a party invitation. */
export const SCHREIBEN: [string, string][] = [
  ["Bekannte bietet Ihnen ihr altes Kinderbett an", "Fahrschule: Fahrstunde verschieben und Fragen zur Prüfung"],
  ["Kursteilnehmerin fragt, ob Sie zusammen für die Prüfung lernen", "Stadtwerke: Abschlag ist zu hoch, Bitte um Änderung"],
  ["Kollege fragt, ob Sie seine Schicht übernehmen", "Schule des Kindes: Kind kann nicht an der Klassenfahrt teilnehmen"],
  ["Bekannte fragt nach Tipps für einen Deutschkurs in Ihrer Stadt", "Krankenkasse: neue Versichertenkarte fehlt"],
  ["Bekannte sucht eine Wohnung in Ihrer Stadt", "Sportverein: Kündigung der Mitgliedschaft"],
  ["Bekannter möchte Ihr Auto leihen", "Arbeitgeber: Urlaub beantragen"],
  ["Kursteilnehmerin fragt nach Ihren Notizen", "Online-Shop: falsche Ware geliefert"],
  ["Nachbarin bittet, ein Paket für sie anzunehmen", "Kita: Betreuungszeiten ändern"],
  ["Bekannter fragt nach einem guten Arzt", "Volkshochschule: Kurs wechseln"],
  ["Bekannte kommt zu Besuch, Abholung am Bahnhof", "Hausverwaltung: Lärm in der Nacht"],
]

/** Sprechen Teil 2: one topic per set, two different photos (du / Partner). Not: online shopping, neighbours, rubbish.
 * Teil 3: one planning task per set. Not: course party, house party, course hiking trip, visiting a friend abroad. */
export const SPRECHEN_2 = [
  "Ausflüge am Wochenende", "Umzug und neue Wohnung", "Ehrenamt und Vereine", "Arbeiten im Team", "Freizeit im Park",
  "Kochen zu Hause", "Mit Bus und Bahn unterwegs", "Feste und Feiern", "Lernen und Weiterbildung", "Sport im Alltag",
]
export const SPRECHEN_3 = [
  "Sie wollen zusammen ein Geschenk für Ihre Kursleiterin kaufen", "Sie wollen auf dem Stadtfest einen Stand mit Essen aus Ihren Ländern machen", "Eine Kollegin hat bald ihren letzten Arbeitstag",
  "Sie wollen einem Nachbarn beim Umzug helfen", "Ihr Kind und das Kind des Partners haben zusammen Geburtstag", "Sie wollen für Ihre Kinder einen Spielenachmittag organisieren",
  "Eine Freundin liegt im Krankenhaus; Sie wollen sie besuchen", "Ihre Hausgemeinschaft macht einen Aufräumtag im Hof", "Sie wollen zusammen einen Schwimmkurs für Erwachsene besuchen",
  "Sie organisieren einen Flohmarktstand in der Schule",
]
