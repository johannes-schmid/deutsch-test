// telc Deutsch B1 Modelltest plan: one entry per set covers ALL skills of set n together, so set n is already
// Prüfungssimulation n (CLAUDE.md §3): no topic, situation or place repeats across Lesen n, Sprachbausteine n, Hören n,
// Schreiben n and Sprechen n. Format per Teil: research/telc-b1.md. Every entry is a topic, never a text, and never a
// situation of the official Übungstests (research/telc-b1-official-situations.md).

export type H3Kind = "anrufbeantworter" | "programm" | "wetter" | "zug" | "geschaeft" | "verkehr"

export type TelcB1Set = {
  /** Lesen Teil 1: five short press items (one each). */
  lesen1: string[]
  /** Lesen Teil 2: one article. */
  lesen2: string
  /** Lesen Teil 3: the world of the 10 situations and 12 ads. */
  lesen3: string
  /** Sprachbausteine Teil 1: informal email (du). Teil 2: semi-formal or formal letter (Sie). */
  sb1: string
  sb2: string
  /** Hören Teil 1: the radio survey question. Teil 2: the interview guest and topic. Teil 3: five short texts. */
  hoeren1: string
  hoeren2: string
  hoeren3: [H3Kind, string][]
  /** Schreiben: who writes to you and what about (informal or semi-formal). */
  schreiben: string
  /** Sprechen Teil 2: the topic both opinion sheets argue about. Teil 3: what the pair plans. */
  sprechen2: string
  sprechen3: string
}

export const SETS: TelcB1Set[] = [
  {
    lesen1: ["Studie: Wer abends aufs Handy schaut, schläft später ein", "Verbrauchertipp: Stromfresser im Haushalt finden", "Reiseangebot: Wandern mit Lamas im Allgäu", "Buchtipp: Kochen mit Resten aus dem Kühlschrank", "Neu in der Stadt: Lastenräder zum Ausleihen"],
    lesen2: "Ein Dorf rettet seinen letzten Laden: Die Bewohner führen ihn selbst als Genossenschaft",
    lesen3: "Freizeit und Weiterbildung: Kurse, Vereine, Veranstaltungen, Dienstleistungen in einer Stadt",
    sb1: "E-Mail an einen Freund: der erste Monat im neuen Job als Busfahrer",
    sb2: "Anfrage an eine Tanzschule nach einem Kurs für ein Brautpaar vor der Hochzeit",
    hoeren1: "Was machen Sie in Ihrer Mittagspause?",
    hoeren2: "Interview mit einer Imkerin, die Bienen auf dem Dach eines Hotels in der Innenstadt hält",
    hoeren3: [["anrufbeantworter", "Zahnarztpraxis: geänderte Sprechzeiten wegen Fortbildung"], ["programm", "Programm des Stadttheaters am Wochenende"], ["wetter", "Wetter für das Wochenende an der Nordseeküste"], ["zug", "Durchsage im Intercity: Steckdosen in einem Wagen funktionieren nicht"], ["geschaeft", "Durchsage im Baumarkt: Angebote in der Gartenabteilung"]],
    schreiben: "Eine Freundin (du) fährt zwei Wochen weg und fragt, ob Sie ihre Katze versorgen können",
    sprechen2: "Kleidung gebraucht kaufen",
    sprechen3: "Einen Spielenachmittag für die Kinder aus dem Wohnhaus organisieren",
  },
  {
    lesen1: ["Umfrage: Immer mehr Menschen arbeiten nach der Rente weiter", "Verbrauchertipp: Handyvertrag richtig kündigen", "Reiseangebot: Mit dem Nachtzug nach Wien", "Buchtipp: Ratgeber für die ersten Monate mit Baby", "Stadt: Neuer Wasserspielplatz im Park eröffnet"],
    lesen2: "Repair-Cafés: Freiwillige reparieren kaputte Geräte, statt sie wegzuwerfen",
    lesen3: "Wohnen und Haushalt: Möbel, Umzug, Handwerker, Reinigung, Gartenhilfe",
    sb1: "E-Mail an eine Freundin: Erzählen von der Hochzeit der Schwester",
    sb2: "Antwort auf eine Anzeige für ein Ferienhaus an einem See: Fragen zu Ausstattung und Anreise",
    hoeren1: "Wie halten Sie sich im Winter fit?",
    hoeren2: "Interview mit einem Busfahrer, der seit dreißig Jahren dieselbe Linie fährt",
    hoeren3: [["anrufbeantworter", "Autowerkstatt: Reifenwechsel, Termin und Preis"], ["programm", "Veranstaltungen im Museum am Sonntag"], ["wetter", "Wetter für morgen in den Alpen"], ["zug", "Durchsage am Bahnsteig: Zug fährt in umgekehrter Wagenreihung"], ["geschaeft", "Durchsage im Supermarkt: Kasse schließt, frische Brötchen am Nachmittag"]],
    schreiben: "Ihre Kursleiterin (Sie) lädt zum Kursabschluss ein und bittet um Ideen für das Programm",
    sprechen2: "Kinder und eigenes Handy ab zehn Jahren",
    sprechen3: "Einen Grillabend für die Kolleginnen und Kollegen der Abteilung planen",
  },
  {
    lesen1: ["Studie: Hunde machen ihre Besitzer aktiver", "Verbrauchertipp: Lebensmittel richtig einfrieren", "Reiseangebot: Radtour entlang der Mosel mit Gepäckservice", "Buchtipp: Erste Hilfe für Eltern", "Stadt: Bibliothek verleiht jetzt auch Werkzeug"],
    lesen2: "Ältere Menschen und Studierende wohnen zusammen: Wohnen gegen Hilfe",
    lesen3: "Gesundheit und Sport: Praxen, Kurse, Vereine, Beratung, Angebote für Familien",
    sb1: "E-Mail an einen Freund: Absage für ein Wochenende und neuer Termin",
    sb2: "Anfrage an einen Sportverein: Probetraining für ein Kind, Beitrag und Ausrüstung",
    hoeren1: "Kaufen Sie lieber im Geschäft oder im Internet ein?",
    hoeren2: "Interview mit einer Hebamme über ihren Alltag auf dem Land",
    hoeren3: [["anrufbeantworter", "Stadtbibliothek: Öffnungszeiten zwischen den Feiertagen"], ["programm", "Kinoprogramm des Programmkinos am Dienstag"], ["wetter", "Unwetterwarnung für den Abend"], ["verkehr", "Verkehrsfunk: Baustelle und Stau auf der Autobahn"], ["geschaeft", "Durchsage im Möbelhaus: Restaurant und Kinderbetreuung"]],
    schreiben: "Ein Nachbar (Sie) bittet Sie, im Urlaub die Blumen zu gießen und die Post zu holen",
    sprechen2: "Urlaub zu Hause statt Reisen",
    sprechen3: "Einen Ausflug mit dem Deutschkurs in eine Nachbarstadt planen",
  },
  {
    lesen1: ["Studie: Musik beim Lernen hilft nicht allen", "Verbrauchertipp: Online-Tickets sicher kaufen", "Reiseangebot: Kochwoche in der Toskana", "Buchtipp: Roman über eine Familie in Hamburg", "Stadt: Kostenloses WLAN am Marktplatz"],
    lesen2: "Ein Café, in dem Menschen mit Behinderung arbeiten, wird zum Treffpunkt im Viertel",
    lesen3: "Reisen und Ausflüge: Unterkünfte, Bus- und Bootsfahrten, Führungen, Ferienkurse",
    sb1: "E-Mail an eine Freundin: Bericht vom ersten Tag im Sprachkurs in einer neuen Stadt",
    sb2: "Beschwerde an einen Online-Shop: falsche Größe geliefert, Bitte um Umtausch",
    hoeren1: "Was ist für Sie ein perfekter Sonntag?",
    hoeren2: "Interview mit einem Koch, der eine Kantine auf gesundes Essen umgestellt hat",
    hoeren3: [["anrufbeantworter", "Hausverwaltung: Heizung wird gewartet, wann jemand kommt"], ["programm", "Konzerte im Stadtpark im August"], ["wetter", "Wetter und Pollenflug für die Woche"], ["zug", "Durchsage im ICE: Bordbistro hat heute nur kalte Getränke"], ["geschaeft", "Durchsage im Elektromarkt: Beratung und Abholung"]],
    schreiben: "Ein Freund (du) möchte Deutsch lernen und fragt nach Ihren Erfahrungen und Tipps",
    sprechen2: "Wohnen in der Stadt oder auf dem Land",
    sprechen3: "Eine Überraschungsparty zum Geburtstag eines gemeinsamen Freundes planen",
  },
  {
    lesen1: ["Studie: Kinder spielen weniger draußen als früher", "Verbrauchertipp: Fahrrad richtig gegen Diebstahl sichern", "Reiseangebot: Wellness-Wochenende im Schwarzwald", "Buchtipp: Ratgeber für das erste Vorstellungsgespräch", "Stadt: Neuer Wochenmarkt am Abend"],
    lesen2: "Immer mehr Betriebe bieten eine Vier-Tage-Woche an: Erfahrungen einer Firma",
    lesen3: "Arbeit und Beruf: Jobs, Weiterbildung, Beratung, Kinderbetreuung, Bewerbungshilfe",
    sb1: "E-Mail an einen Freund: Einladung zur Einweihungsfeier der neuen Wohnung",
    sb2: "Anfrage an eine Volkshochschule: Computerkurs für Anfänger, Termine und Ermäßigung",
    hoeren1: "Wie wichtig ist Ihnen das Frühstück?",
    hoeren2: "Interview mit einer Försterin über ihre Arbeit und Besucher im Wald",
    hoeren3: [["anrufbeantworter", "Tierarztpraxis: Notdienst am Wochenende"], ["programm", "Führungen im Zoo in den Ferien"], ["wetter", "Wetter für den Feiertag in ganz Deutschland"], ["zug", "Durchsage im Regionalzug: Halt in einem Ort entfällt heute"], ["geschaeft", "Durchsage im Kaufhaus: Kind sucht seine Eltern"]],
    schreiben: "Eine Kollegin (Sie) fragt, ob Sie nächste Woche einen Dienst mit ihr tauschen",
    sprechen2: "Ehrenamt neben Arbeit und Familie",
    sprechen3: "Ein Picknick mit den Nachbarn im Hof planen",
  },
  {
    lesen1: ["Studie: Wer kocht, isst gesünder", "Verbrauchertipp: Nebenkostenabrechnung prüfen", "Reiseangebot: Segelkurs an der Ostsee", "Buchtipp: Wanderführer für Familien", "Stadt: Schwimmbad bietet Kurse für Erwachsene"],
    lesen2: "Ein Busunternehmen bildet Geflüchtete zu Fahrerinnen und Fahrern aus",
    lesen3: "Familie und Kinder: Babysitter, Kinderkurse, Feste, Nachhilfe, Ferienprogramme",
    sb1: "E-Mail an eine Freundin: Dank für die Hilfe beim Umzug und Bericht vom Viertel",
    sb2: "Antwort auf eine Anzeige: Interesse an einem Gebrauchtwagen, Fragen zu Zustand und Besichtigung",
    hoeren1: "Lesen Sie lieber Bücher auf Papier oder auf dem Bildschirm?",
    hoeren2: "Interview mit einem Feuerwehrmann der freiwilligen Feuerwehr",
    hoeren3: [["anrufbeantworter", "Kfz-Zulassungsstelle: Termine nur online"], ["programm", "Programm des Stadtfests am Samstag"], ["wetter", "Wetter für die Skigebiete"], ["verkehr", "Verkehrsmeldung: Straßenbahn fährt wegen Bauarbeiten Umleitung"], ["geschaeft", "Durchsage in der Drogerie: Fotoservice und Angebote"]],
    schreiben: "Ihre Vermieterin (Sie) fragt, ob Sie beim Hoffest im Sommer mithelfen",
    sprechen2: "Kinder und Hausaufgaben am Nachmittag in der Schule",
    sprechen3: "Einen Tag der offenen Tür in Ihrem Sportverein vorbereiten",
  },
  {
    lesen1: ["Studie: Viele Menschen trinken zu wenig Wasser", "Verbrauchertipp: Garantie und Gewährleistung", "Reiseangebot: Städtereise nach Dresden mit Theaterkarte", "Buchtipp: Gartenbuch für den Balkon", "Stadt: Nachtbusse fahren am Wochenende öfter"],
    lesen2: "Schulgärten: Kinder lernen, wo das Gemüse herkommt",
    lesen3: "Essen und Feiern: Restaurants, Catering, Räume, Musik, Kochkurse",
    sb1: "E-Mail an einen Freund: Bericht vom Urlaub auf dem Campingplatz",
    sb2: "Anfrage an ein Hotel: Raum für eine Familienfeier mit dreißig Gästen",
    hoeren1: "Wie feiern Sie Ihren Geburtstag?",
    hoeren2: "Interview mit einer Taxifahrerin, die nachts arbeitet",
    hoeren3: [["anrufbeantworter", "Kinderarztpraxis: Impfsprechstunde und Rezepte"], ["programm", "Ausstellungen in der Stadthalle im Herbst"], ["wetter", "Wetter für den Wochenmarkt am Samstag"], ["zug", "Durchsage am Flughafenbahnhof: S-Bahn-Ersatz und Fahrzeit"], ["geschaeft", "Durchsage im Sportgeschäft: Skiservice und Ausverkauf"]],
    schreiben: "Ein Freund (du) hat Sie zu seiner Hochzeit eingeladen, aber Sie können nicht kommen",
    sprechen2: "Fernsehen und Streaming für Kinder",
    sprechen3: "Eine Fahrradtour mit Freunden für das lange Wochenende planen",
  },
  {
    lesen1: ["Studie: Pausen ohne Handy machen zufriedener", "Verbrauchertipp: Wäsche sparsam waschen", "Reiseangebot: Insel-Hopping mit der Fähre", "Buchtipp: Comic über die Geschichte einer Stadt", "Stadt: Mehr Bänke und Trinkbrunnen in der Fußgängerzone"],
    lesen2: "Ein Großvater lernt mit siebzig Jahren noch einen neuen Beruf",
    lesen3: "Dienstleistungen im Alltag: Reparatur, Computerhilfe, Übersetzung, Fahrdienst, Tierbetreuung",
    sb1: "E-Mail an eine Freundin: Neuigkeiten aus der Familie und Frage nach einem Besuch",
    sb2: "Brief an die Stadtverwaltung: Bitte um Information zu einem Parkausweis für Anwohner",
    hoeren1: "Arbeiten Sie lieber im Team oder allein?",
    hoeren2: "Interview mit einem Bäcker, der seine Bäckerei an die Tochter übergibt",
    hoeren3: [["anrufbeantworter", "Versicherung: Unterlagen fehlen, was man schicken soll"], ["programm", "Kinderprogramm im Freizeitbad"], ["wetter", "Wetter für die Woche: Hitze und Gewitter"], ["zug", "Durchsage im Fernzug: Anschlusszüge im nächsten Bahnhof"], ["geschaeft", "Durchsage im Einkaufszentrum: Öffnungszeiten am Feiertag"]],
    schreiben: "Eine Bekannte aus dem Elternbeirat (Sie) bittet Sie, beim Schulfest einen Stand zu übernehmen",
    sprechen2: "Mit dem Auto oder mit Bus und Bahn zur Arbeit",
    sprechen3: "Einen Kochabend mit Gerichten aus verschiedenen Ländern planen",
  },
  {
    lesen1: ["Studie: Großeltern betreuen oft die Enkel", "Verbrauchertipp: Heizkosten senken im Winter", "Reiseangebot: Kanutour auf der Spree", "Buchtipp: Sachbuch über gesunden Schlaf bei Schichtarbeit", "Stadt: Neue Hundewiese im Stadtwald"],
    lesen2: "Eine Firma bietet ihren Mitarbeitenden Deutschkurse während der Arbeitszeit an",
    lesen3: "Kultur und Freizeit: Theater, Chor, Malkurs, Museumsführungen, Tanz",
    sb1: "E-Mail an einen Freund: Nachricht von der bestandenen Führerscheinprüfung",
    sb2: "Anfrage an eine Musikschule: Gitarrenunterricht für Erwachsene, Leihinstrument",
    hoeren1: "Was machen Sie, wenn Sie Stress haben?",
    hoeren2: "Interview mit der Leiterin eines Tierheims über Tiere und Ehrenamtliche",
    hoeren3: [["anrufbeantworter", "Bürgeramt: Termin für den Personalausweis verschoben"], ["programm", "Lesungen in der Buchhandlung im November"], ["wetter", "Wetter für das Bergwandern am Wochenende"], ["verkehr", "Radio: Fähre fährt wegen Sturm nicht"], ["geschaeft", "Durchsage im Gartencenter: Pflanzen-Beratung und Lieferung"]],
    schreiben: "Ein Freund (du) braucht Hilfe bei einer Bewerbung und fragt nach Ihren Erfahrungen",
    sprechen2: "Kinder im Haushalt mithelfen lassen",
    sprechen3: "Einen Flohmarktstand mit Freunden vorbereiten",
  },
  {
    lesen1: ["Studie: Wer singt, ist glücklicher", "Verbrauchertipp: Kleidung länger tragen und reparieren", "Reiseangebot: Fahrt mit der historischen Dampfeisenbahn", "Buchtipp: Ratgeber für Gespräche mit Behörden", "Stadt: Neue Fahrradstraße zum Bahnhof"],
    lesen2: "Ein Stadtviertel teilt Autos: Erfahrungen nach einem Jahr Carsharing",
    lesen3: "Lernen und Kurse: Sprachen, Prüfungsvorbereitung, Nachhilfe, Computer, Fahrschule",
    sb1: "E-Mail an eine Freundin: Absage für das Konzert und Vorschlag für einen anderen Abend",
    sb2: "Brief an den Kindergarten: Anfrage nach einem Platz ab Herbst und Fragen zur Eingewöhnung",
    hoeren1: "Haben Sie ein Hobby, das wenig kostet?",
    hoeren2: "Interview mit einem Schornsteinfeger über alte und neue Seiten seines Berufs",
    hoeren3: [["anrufbeantworter", "Fahrschule: Theoriestunde fällt aus, Ersatztermin"], ["programm", "Sportprogramm im Fernsehen am Sonntag"], ["wetter", "Wetter für den Weihnachtsmarkt am Abend"], ["zug", "Durchsage im Nahverkehrszug: Fahrkarten im Zug nur mit Karte"], ["geschaeft", "Durchsage im Kaufhaus: Kundenkarte und Rabatt heute"]],
    schreiben: "Eine Freundin (du) zieht in Ihre Stadt und fragt nach einem guten Stadtteil zum Wohnen",
    sprechen2: "Feste Arbeitszeiten oder flexible Arbeitszeiten",
    sprechen3: "Einen Besuch mit einer Gruppe aus Ihrer Partnerstadt planen",
  },
]

/** The plan entries of set n grouped by skill, for the cross-skill repeat check (scripts/modelltest/clash.ts). */
export function planBySkill(n: number): Record<string, string[]> {
  const p = SETS[n - 1]
  return {
    lesen: [...p.lesen1, p.lesen2, p.lesen3, p.sb1, p.sb2],
    hoeren: [p.hoeren1, p.hoeren2, ...p.hoeren3.map(([, t]) => t)],
    schreiben: [p.schreiben],
    sprechen: [p.sprechen2, p.sprechen3],
  }
}
