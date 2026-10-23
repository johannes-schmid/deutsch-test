// telc Deutsch A2 (Start Deutsch 2): free-test specs from research/telc-a2.md (checked 2026-10-12).
// Instructions are our own wording of what the real task asks; never the official text.

import type { ExamSpec } from "../exam-blueprints"

const U = "research/telc-a2.md §2–4 (telc Übungstest 1, 2017 and 2024; audio measured 2026-10-23)"

export const spec: ExamSpec = {
  context: { name: "telc Deutsch A2 (Start Deutsch 2)", level: "A2", setting: "Alltag in Deutschland", copyright: "telc" },
  parts: [
    {
      // Full Modelltest only (research/telc-a2.md §2); the 5-minute taster leaves it out.
      skill: "hoeren", teil: 3, answer: "match", ads: 9, noMatch: false, itemsReal: 5, itemsPerBlock: 5,
      full: { items: 5, first: 11, blocks: 1, itemsPerBlock: 5, length: { min: 95, max: 150, unit: "seconds" }, example: true, options: 9, pace: { min: 150, max: 200 }, pauses: { before: 7, after: 17 }, source: U },
      textTypes: ["Gespräch zwischen zwei Personen: eine Person zeigt der anderen einen Ort oder erzählt von Plänen (Firma, Verein, Umzug, Woche)"],
      length: { min: 95, max: 150, unit: "seconds" }, voices: { min: 2, max: 2 }, plays: 2,
      instruction: "Sie hören ein Gespräch. Was passt zu wem? Ordnen Sie zu. Sie hören das Gespräch zweimal.",
      hint: "Zwei Stimmen, etwa 350 Wörter, A2. Fünf Personen oder Tage werden je einer von neun Möglichkeiten zugeordnet; das Beispiel nimmt eine weg.",
    },
    {
      skill: "hoeren", teil: 1, answer: "abc", itemsReal: 5, itemsPerBlock: 1,
      full: { items: 5, first: 1, blocks: 5, itemsPerBlock: 1, length: { min: 12, max: 25, unit: "seconds" }, example: true, pace: { min: 120, max: 185 }, pauses: { before: 7, after: 16 }, sound: "Anrufbeantworter: Piepton", source: U },
      textTypes: ["Nachricht von einer Freundin oder einem Freund auf dem Anrufbeantworter", "Nachricht vom Arbeitgeber oder einer Firma auf dem Anrufbeantworter", "Telefonansage: Auskunft oder Fahrplaninformation"],
      length: { min: 15, max: 45, unit: "seconds" }, voices: { min: 1, max: 1 }, plays: 2,
      instruction: "Sie hören eine Nachricht am Telefon. Ergänzen Sie die Notiz: Welche Information fehlt? Wählen Sie a, b oder c. Sie hören jeden Text zweimal.",
      hint: `Eine Person spricht am Telefon, 40–70 Wörter, A2, natürlich gesprochen (Begrüßung, Name, Anliegen, Gruß). Die Nachricht nennt mehrere Details (Uhrzeit, Tag, Ort, Preis, Telefonnummer, Name); genau eins fehlt in der Notiz.
"prompt" ist eine Zeile aus einer Telefonnotiz mit "…" an der Stelle, die fehlt, z. B. "Treffen am Samstag um … Uhr" oder "Neue Telefonnummer von Frau Brandt: …". Die drei Optionen sind nur das fehlende Detail (eine Zahl, eine Uhrzeit, ein Wort). Die zwei falschen kommen in der Nachricht auch vor oder klingen ähnlich (z. B. eine alte Uhrzeit, die geändert wird).`,
      todo: "TODO(hannes): the real Teil 1 is an open gap-fill (write the missing word or number; numbers must be exact). The kit has no typed-answer item yet, so the taster offers three options for the gap.",
    },
    {
      skill: "hoeren", teil: 2, answer: "abc", itemsReal: 5, itemsPerBlock: 1,
      full: { items: 5, first: 6, blocks: 5, itemsPerBlock: 1, length: { min: 14, max: 27, unit: "seconds" }, example: true, pace: { min: 120, max: 185 }, pauses: { before: 7, after: 16 }, sound: "Radio-Jingle", source: U },
      textTypes: ["Radio: Programmhinweis", "Radio: Wetterbericht", "Radio: Verkehrsmeldung", "Radio: Gewinnspiel", "Radio: Grüße von Hörerinnen und Hörern"],
      length: { min: 15, max: 45, unit: "seconds" }, voices: { min: 1, max: 1 }, plays: 1,
      instruction: "Sie hören eine Meldung im Radio. Wählen Sie die richtige Antwort: a, b oder c. Sie hören jeden Text einmal.",
      hint: "Eine Radiosprecherin oder ein Radiosprecher, 40–80 Wörter, A2. Nennt mehrere Details, nur eins ist gefragt.",
    },
    {
      skill: "lesen", teil: 1, answer: "abc", itemsReal: 5, itemsPerBlock: 1,
      full: { items: 5, first: 1, blocks: 1, itemsPerBlock: 5, length: { min: 55, max: 100, unit: "words" }, example: true, fixedLast: "anderes Stockwerk", source: U },
      textTypes: ["Wegweiser in einem Kaufhaus", "Wegweiser in einem Einkaufszentrum"],
      length: { min: 55, max: 100, unit: "words" },
      instruction: "Lesen Sie die Situation und den Wegweiser. In welches Stockwerk gehen Sie? Wählen Sie a, b oder c.",
      hint: `Ein Wegweiser nach Stockwerken: jede Zeile in "paragraphs" ist ein Stockwerk mit seinen Abteilungen als Stichworte (z. B. "3. Stock: Damenmode · Schuhe · Taschen · Café"), vom Untergeschoss bis zum obersten Stock. "sender" ist der Name des Kaufhauses, "source" ist "Wegweiser". Die Frage ist eine Situation in einem Satz ("Sie möchten Ihrer Tochter ein Puzzle schenken."), ohne das Stichwort aus dem Wegweiser. Optionen: a und b sind zwei Stockwerke (z. B. "2. Stock", "Untergeschoss"), c ist immer genau "anderes Stockwerk". c ist richtig, wenn das Gesuchte in keinem der beiden genannten Stockwerke ist. Ein falsches Stockwerk hat ein Stichwort, das fast passt.`,
    },
    {
      skill: "lesen", teil: 2, answer: "rf", itemsReal: 5, itemsPerBlock: 2,
      full: { items: 5, first: 6, blocks: 1, itemsPerBlock: 5, length: { min: 120, max: 175, unit: "words" }, example: true, source: U },
      textTypes: ["Kurzer Zeitungsartikel über eine Person aus der Region", "Meldung in einer Zeitschrift über eine bekannte Person"],
      length: { min: 120, max: 170, unit: "words" },
      instruction: "Lesen Sie den Artikel. Sind die Aussagen richtig oder falsch?",
      hint: `Ein kurzer Artikel von der "Leute"-Seite einer Zeitung oder Zeitschrift: eine Überschrift als erste Zeile in "paragraphs", dann 2–3 kurze Absätze über eine Person (Beruf, Erfolg, Familie, Pläne). "sender" ist der Name der Zeitung oder Zeitschrift (erfunden), "source" ist "Zeitungsartikel" oder "Zeitschrift". A2: einfache Sätze, Perfekt und Präteritum von sein/haben. Eine Aussage ist falsch, weil ein Detail anders ist (Zeit, Ort, Person, Zahl).`,
    },
    {
      skill: "lesen", teil: 3, answer: "match", ads: 8, noMatch: true, itemsReal: 5, itemsPerBlock: 5, sample: 3,
      full: { items: 5, first: 11, blocks: 1, itemsPerBlock: 5, length: { min: 110, max: 190, unit: "words" }, example: true, options: 8, source: U },
      textTypes: ["Kurze Anzeigen und Webseiten-Teaser (Kurse, Freizeit, Dienstleistungen, Einkaufen)"],
      length: { min: 110, max: 190, unit: "words" },
      instruction: "Lesen Sie die Situationen und die Anzeigen. Welche Anzeige passt? Für eine Situation gibt es keine passende Anzeige. Dann wählen Sie x.",
      hint: "8 Anzeigen, je 15–25 Wörter, mit Titel. A2.",
    },
  ],
  // research/telc-a2.md §7, cut to the 5-minute taster. Hören Teil 3 (one ~350-word conversation, played twice,
  // matched to 9 options) is left out: it alone runs ~5 minutes and the kit's listening match is the opinions format.
  kurztest: {
    lesen: [
      { teil: 1, blocks: 1, items: 1 },
      { teil: 2, blocks: 1, items: 2 },
      { teil: 3, blocks: 1, items: 3 },
    ],
    hoeren: [
      { teil: 1, blocks: 2, items: 1 },
      { teil: 2, blocks: 3, items: 1 },
    ],
  },
  // research/telc-a2.md §4–5. Schreiben: only Teil 2 (the letter). Sprechen: all three Teile, shortened.
  open: [
    {
      skill: "schreiben", teil: 2, title: "Antwort auf eine Einladung", minutes: 5, tasks: 1, points: 4,
      instruction: "Antworten Sie auf die Nachricht. Wählen Sie drei von vier Punkten und schreiben Sie zu jedem ein bis zwei Sätze, etwa 40 Wörter. Vergessen Sie Anrede und Gruß nicht.",
      hint: `situation: genau 2 Sätze in Sie-Form (A2): eine Person, die man kennt (Kollegin, Nachbar, Kursleiterin, Bekannte), lädt ein oder bittet um etwas (Feier, Ausflug, Hilfe beim Umzug, Kursabend). Dann "Antworten Sie …".
points: genau 4 kurze Punkte wie im Prüfungsheft (z. B. "Dank für die Einladung", "Was Sie mitbringen", "Wann Sie kommen", "Frage nach dem Weg"). Die Person wählt drei davon.
register: informell oder halbformell (Bekannte, Kollegin).
modelAnswer: etwa 40–50 Wörter, A2, mit passender Anrede, genau drei der vier Punkte (je 1–2 einfache Sätze) und Gruß.`,
      todo: "TODO(hannes): the real Schreiben block also has Teil 1 (a form with 5 fields), left out until the kit has a form component. Research §9: confirm whether Teil 2 can be formal. The rubric names chosen points generically because the grader's \"Punkt n\" mapping assumes all points are answered.",
    },
    {
      skill: "sprechen", teil: 1, title: "Sich vorstellen", minutes: 1.5,
      instruction: "Stellen Sie sich vor. Die Stichwörter helfen. Danach stellt Ihnen die Prüferin oder der Prüfer eine Frage.",
      hint: `telc Deutsch A2 ist eine Paarprüfung ohne Vorbereitungszeit. Auf dem Tisch liegt ein Blatt mit Stichwörtern für beide.
points: genau die Stichwörter Name, Alter, Land, Wohnort, Sprachen, Beruf, Hobby. cards: leer.
turns: 1. pruefer: begrüßt beide kurz und bittet zuerst den Partner, sich vorzustellen. 2. partner: stellt sich mit 5–6 Stichwörtern vor (3–5 kurze Sätze, A2). 3. pruefer: dankt und bittet "du", sich vorzustellen. 4. du: Hinweis "Stell dich vor. Die Stichwörter helfen." 5. pruefer: stellt "du" eine Nachfrage zu einem Stichwort (z. B. "Seit wann wohnen Sie in …?" oder "Was machen Sie gern am Wochenende?"). 6. du: Hinweis "Antworte auf die Frage." 7. pruefer: kurzer Dank.`,
      todo: "TODO(hannes): the real Teil 1 has two examiner follow-up questions per candidate; the taster asks one.",
    },
    {
      skill: "sprechen", teil: 2, title: "Fragen und antworten", minutes: 1.5,
      instruction: "Sie bekommen Karten mit Fragewörtern zu einem Thema. Fragen Sie Ihre Partnerin oder Ihren Partner und antworten Sie auf ihre oder seine Fragen.",
      hint: `telc Deutsch A2 ist eine Paarprüfung. Ein Alltagsthema (z. B. Tagesablauf, Wochenende, Essen, Wohnen, Einkaufen, Freizeit). Jede Person hat Karten mit einem Fragewort; man fragt abwechselnd.
cards: genau 2 Karten für "du": label = "<Thema> · <Fragewort> …?" (z. B. "Wochenende · Wann …?", "Wochenende · Wo …?"), picto = null. points: das Thema.
turns: 1. pruefer: nennt das Thema und erklärt kurz, dass beide abwechselnd fragen. 2. partner: stellt "du" eine Frage zum Thema (eigenes Fragewort, z. B. "Wie oft …?"). 3. du: Hinweis "Antworte auf die Frage." 4. du: Hinweis "Frag deine Partnerin (oder: deinen Partner) mit deiner Karte: <Fragewort> …?" – passend zum gender des Partners. 5. partner: antwortet kurz (1–2 Sätze, A2). 6. partner: stellt die zweite Frage (anderes Fragewort). 7. du: Hinweis "Antworte auf die Frage." 8. du: Hinweis "Frag mit deiner zweiten Karte: <Fragewort> …?" 9. partner: antwortet kurz. 10. pruefer: kurzer Dank.`,
      todo: "TODO(hannes): the real Teil 2 has 3 questions and 3 answers per candidate; the taster uses 2 and 2.",
    },
    {
      skill: "sprechen", teil: 3, title: "Etwas aushandeln", minutes: 1.5,
      instruction: "Planen Sie mit Ihrer Partnerin oder Ihrem Partner etwas zusammen. Sie haben verschiedene Ideen. Einigen Sie sich: Was machen Sie, wann und warum?",
      hint: `telc Deutsch A2 ist eine Paarprüfung. Beide wollen zusammen etwas unternehmen (z. B. am Wochenende, nach dem Kurs, an einem Feiertag). "du" und der Partner haben verschiedene Ideen auf ihrem Blatt.
points: die Ideen auf dem Blatt von "du": genau 4 kurze Stichwörter (z. B. "Kino", "Flohmarkt", "Fahrradtour", "?") – das letzte ist immer "?" für eine eigene Idee.
cards: leer.
turns: 1. pruefer: stellt die Aufgabe (zusammen etwas planen, sagen was, wann und warum). 2. partner: macht einen Vorschlag aus seinen eigenen Ideen (nicht von der Liste von "du"). 3. du: Hinweis "Reagiere und mach einen Vorschlag von deinem Blatt." 4. partner: lehnt höflich ab oder stimmt zu, mit Grund (Zeit, Geld, Wetter, mag er nicht), und fragt nach Zeit oder Ort. 5. du: Hinweis "Sag, wann und wo ihr euch trefft." 6. partner: stimmt zu und fasst kurz zusammen. 7. pruefer: fragt kurz nach einem fehlenden Detail (z. B. Uhrzeit oder Treffpunkt). 8. du: Hinweis "Antworte der Prüferin." (oder: dem Prüfer) 9. pruefer: kurzer Dank, Ende der Prüfung.`,
      todo: "TODO(hannes): the real Teil 3 asks the pair to agree on two activities (Übungstest); the taster agrees on one.",
    },
  ],
  // research/telc-a2.md §4: per chosen point 3 / 1.5 / 0, opening and closing 1 / 0.5 / 0; max 10.
  rubric: {
    schreiben: [
      { name: "Erster gewählter Punkt", max: 3 },
      { name: "Zweiter gewählter Punkt", max: 3 },
      { name: "Dritter gewählter Punkt", max: 3 },
      { name: "Anrede und Gruß", max: 1 },
    ],
  },
  taster: {
    lesen: [{ teil: 1, blocks: 1 }, { teil: 2, blocks: 1 }, { teil: 3, blocks: 1 }],
    hoeren: [{ teil: 1, blocks: 2 }, { teil: 2, blocks: 3 }],
    sprechen: [1, 2, 3],
    minutes: { lesen: 5, hoeren: 4, schreiben: 5, sprechen: 4 },
  },
}
