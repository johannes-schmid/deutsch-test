// Part specs for the non-DTZ free tests, from research/<exam>.md (checked 2026-10-12).
// Start Deutsch 1 is complete. The other exams only have their sampled parts so far; the rest come
// with the components they need (Ja/Nein, note gap-fill, grids) when that exam is built.
// Instructions are our own wording of what the real task asks; never the official text.

import type { ExamId } from "@/lib/exams"
import type { KurztestPlan, OpenSpec, PartSpec } from "./blueprint"

export type ExamContext = { name: string; level: string; setting: string; copyright: string }

export const EXAM_CONTEXT: Record<Exclude<ExamId, "dtz">, ExamContext> = {
  "start-deutsch-1": { name: "Start Deutsch 1 (Goethe-Zertifikat A1 / telc Deutsch A1)", level: "A1", setting: "Alltag in Deutschland", copyright: "Goethe-Institut, telc" },
  "oesd-a1": { name: "ÖSD Zertifikat A1", level: "A1", setting: "Alltag in Österreich, Deutschland und der Schweiz; Texte aus allen drei Ländern (Preise in Euro oder Franken, Orte aus allen drei Ländern). Standardsprache, regionale Wörter nur, wenn sie aus dem Zusammenhang klar sind", copyright: "ÖSD" },
  "goethe-a2": { name: "Goethe-Zertifikat A2", level: "A2", setting: "Alltag in Deutschland", copyright: "Goethe-Institut" },
  "telc-a2": { name: "telc Deutsch A2", level: "A2", setting: "Alltag in Deutschland", copyright: "telc" },
  "oesd-a2": { name: "ÖSD Zertifikat A2", level: "A2", setting: "Alltag in Österreich, Deutschland und der Schweiz; Texte aus allen drei Ländern (Preise in Euro oder Franken, Orte aus allen drei Ländern). Standardsprache, regionale Wörter nur, wenn sie aus dem Zusammenhang klar sind", copyright: "ÖSD" },
  "goethe-oesd-b1": { name: "Goethe-Zertifikat B1 / ÖSD Zertifikat B1", level: "B1", setting: "Alltag in Deutschland, Österreich und der Schweiz", copyright: "Goethe-Institut, ÖSD" },
  "telc-b1": { name: "telc Deutsch B1 (Zertifikat Deutsch)", level: "B1", setting: "Alltag und Arbeit in Deutschland", copyright: "telc" },
}

export const EXAM_PARTS: Partial<Record<ExamId, PartSpec[]>> = {
  // research/start-deutsch-1.md §3.1–3.2
  "start-deutsch-1": [
    {
      skill: "lesen", teil: 1, answer: "rf", itemsReal: 5, itemsPerBlock: 2,
      textTypes: ["Kurze E-Mail an eine Freundin oder einen Freund", "Kurze Nachricht an eine Kollegin oder einen Kollegen"],
      length: { min: 50, max: 80, unit: "words" },
      instruction: "Lesen Sie den Text. Sind die Aussagen richtig oder falsch?",
      hint: `Eine kurze private oder berufliche Nachricht mit Anrede und Gruß (Zeilen als "paragraphs"). "sender" ist der Vorname der Person, die schreibt, "source" ist "E-Mail" oder "Nachricht". Inhalt: eine Einladung, eine Bitte, eine Terminänderung oder eine Information. Sehr einfache Sätze (A1). Die Aussagen in der Reihenfolge des Textes; eine Aussage ist falsch, weil ein Detail anders ist (Tag, Uhrzeit, Ort, Person).`,
      todo: "TODO(hannes): the real Teil 1 splits 5 items over two texts; the taster uses one text with 2 items.",
    },
    {
      skill: "lesen", teil: 2, answer: "abc", options: 2, noText: true, itemsReal: 5, itemsPerBlock: 1,
      textTypes: ["Zwei Anzeigen oder Webseiten-Ausschnitte zu einer Alltagssituation"],
      length: { min: 10, max: 25, unit: "words" },
      instruction: "Lesen Sie die Situation und die zwei Texte. Wo finden Sie die Information? Wählen Sie a oder b.",
      hint: `Die Frage ist eine Situation in einem Satz ("Sie möchten am Samstag schwimmen gehen."). Die zwei Optionen sind zwei kurze Anzeigen oder Webseiten-Ausschnitte, je 10–25 Wörter, mit einer Webadresse oder einem Titel am Anfang (z. B. "www.hallenbad-nord.de · Öffnungszeiten: …"). Nur einer passt; der andere passt fast (anderer Tag, andere Zielgruppe). Sehr einfache Sprache (A1).`,
    },
    {
      skill: "lesen", teil: 3, answer: "rf", itemsReal: 5, itemsPerBlock: 1,
      textTypes: ["Schild an einer Tür (Arztpraxis, Geschäft, Schule, Amt)", "Aushang an der Haltestelle oder am Bahnhof", "Schild im Restaurant, im Schwimmbad oder bei der Post"],
      length: { min: 5, max: 25, unit: "words" },
      instruction: "Lesen Sie das Schild. Ist die Aussage richtig oder falsch?",
      hint: `"sender" sagt, wo das Schild hängt (z. B. "An der Tür der Bibliothek", "An der Bushaltestelle"), "source" ist "Schild" oder "Aushang". "paragraphs": der Text des Schilds in 1–3 kurzen Zeilen, ohne ganze Sätze wo ein Schild keine hat (z. B. "Heute geschlossen!"). Die Aussage beschreibt eine Situation in einem einfachen Satz ("Sie können heute Bücher zurückgeben."). Sehr einfach (A1).`,
    },
    {
      skill: "hoeren", teil: 1, answer: "pic", itemsReal: 6, itemsPerBlock: 1,
      textTypes: ["Gespräch auf der Straße", "Gespräch unter Freunden am Telefon", "Gespräch im Deutschkurs", "Gespräch bei der Arbeit", "Gespräch im Geschäft"],
      length: { min: 10, max: 25, unit: "seconds" }, voices: { min: 2, max: 2 }, plays: 2,
      instruction: "Sie hören ein kurzes Gespräch. Was ist richtig? Wählen Sie das passende Bild: a, b oder c. Sie hören jeden Text zweimal.",
      hint: `Zwei Personen, ein kurzes Alltagsgespräch mit 3–6 Beiträgen, langsam und sehr einfach (A1). Die Frage fragt nach etwas, das man auf einem Bild zeigen kann: Uhrzeit, Preis, Tag, Ort, Verkehrsmittel, Essen, Gegenstand, Wetter. Jede Option hat ein Piktogramm ("pictos", ein Schlüssel aus der Liste) und eine sehr kurze Beschriftung als Option (ein Wort, eine Uhrzeit wie "9:30" oder ein Preis wie "4,50 €"). Alle drei Optionen kommen im Gespräch vor oder liegen nahe; nur eine passt.`,
      todo: "TODO(hannes): the real options are drawings; pictograms + label stand in (lib/exam/pictos.ts).",
    },
    {
      skill: "hoeren", teil: 2, answer: "rf", itemsReal: 4, itemsPerBlock: 1,
      textTypes: ["Durchsage am Flughafen", "Durchsage im Supermarkt oder Kaufhaus", "Durchsage am Bahnhof oder in der U-Bahn", "Durchsage im Zug"],
      length: { min: 14, max: 23, unit: "seconds" }, voices: { min: 1, max: 1 }, plays: 1,
      instruction: "Sie hören eine Durchsage. Ist die Aussage richtig oder falsch? Sie hören jeden Text einmal.",
      hint: "Eine Lautsprecherdurchsage, 30–45 Wörter, A1, mit einer Anweisung oder Information (Gleis, Uhrzeit, Ausgang, Angebot, Kasse). Die Aussage prüft genau diese Anweisung.",
    },
    {
      skill: "hoeren", teil: 3, answer: "abc", itemsReal: 5, itemsPerBlock: 1,
      textTypes: ["Nachricht auf dem Anrufbeantworter (privat)", "Telefonansage einer Arztpraxis oder Firma"],
      length: { min: 8, max: 17, unit: "seconds" }, voices: { min: 1, max: 1 }, plays: 2,
      instruction: "Sie hören eine Nachricht am Telefon. Wählen Sie die richtige Antwort: a, b oder c. Sie hören jeden Text zweimal.",
      hint: "Eine Person spricht langsam und deutlich (A1). Die Frage fragt nach einem Detail (Uhrzeit, Tag, Ort, Preis, Nummer). Die drei Optionen sind sehr kurz (1–4 Wörter); die zwei falschen kommen im Text auch vor.",
    },
  ],
  // research/oesd-a1.md §2–3
  "oesd-a1": [
    {
      skill: "lesen", teil: 1, answer: "match", ads: 6, noMatch: false, itemsReal: 5, itemsPerBlock: 5,
      textTypes: ["Zeitungsanzeigen (Arbeit, Dienstleistungen, Geschäfte, Freizeit, Handytarife)"],
      length: { min: 120, max: 210, unit: "words" },
      instruction: "Sie suchen etwas in der Zeitung. Welche Anzeige passt zu welcher Situation? Achtung: Eine Anzeige passt nicht.",
      hint: "6 Anzeigen, je 20–35 Wörter, mit Titel. 5 Situationen (\"Sie brauchen …\", \"Sie möchten …\"), ein Satz, sehr einfach (A1). Jede Anzeige passt höchstens einmal, eine Anzeige bleibt übrig.",
    },
    {
      skill: "hoeren", teil: 3, answer: "abc", options: 4, itemsReal: 5, itemsPerBlock: 5, sample: 3,
      textTypes: ["Kurzinterviews auf der Straße zu einer Alltagsfrage"],
      length: { min: 45, max: 80, unit: "seconds" }, voices: { min: 4, max: 4 }, plays: 1,
      accents: ["de", "at", "de", "ch"],
      instruction: "Sie hören Kurzinterviews. Eine Reporterin fragt Personen auf der Straße. Was sagt jede Person? Wählen Sie für jede Person eine Antwort. Sie hören die Interviews einmal.",
      hint: `Zuerst stellt die Reporterin (Sprecherin "reporter") die Frage, einmal, kurz. Dann antworten 3 Personen nacheinander, spontan gesprochen, je 40–55 Wörter, mit "äh", Wiederholungen, einfachen Sätzen (A1). Jede Person nennt ihren Vornamen. Items: eine Aufgabe pro Person, prompt = "Was sagt <Vorname>?". Alle Aufgaben haben dieselben 4 Optionen in derselben Reihenfolge (wie eine Tabelle mit 4 Spalten); jede Person passt zu genau einer Option, zwei Personen dürfen nicht dieselbe Option haben. Jede Person erwähnt auch eine zweite Möglichkeit, entscheidet sich aber für eine.`,
      todo: "TODO(hannes): the real task is a 5×4 tick grid. Until the grid component exists, each row renders as one 4-option choice.",
    },
  ],
  // research/goethe-a2.md §2–3
  "goethe-a2": [
    {
      skill: "lesen", teil: 2, answer: "abc", itemsReal: 5, itemsPerBlock: 1, sample: 2,
      textTypes: ["Informationstafel in einem Kaufhaus", "Wegweiser in einem Einkaufszentrum"],
      length: { min: 50, max: 100, unit: "words" },
      instruction: "Lesen Sie die Aufgaben und die Informationstafel. In welches Stockwerk gehen Sie? Wählen Sie a, b oder c.",
      hint: `Der Text ist eine Liste: jede Zeile in "paragraphs" ist ein Stockwerk mit Abteilungen (z. B. "2. Stock: Damenmode, Schuhe, Taschen"). Jede Aufgabe ist eine Situation ("Sie möchten …"). Optionen a und b sind zwei Stockwerke aus der Tafel, Option c heißt immer genau "anderes Stockwerk". Bei einer der zwei Aufgaben ist c richtig.`,
    },
    {
      skill: "hoeren", teil: 1, answer: "abc", itemsReal: 5, itemsPerBlock: 1,
      textTypes: ["Radio: Hinweis auf eine Veranstaltung", "Nachricht auf dem Anrufbeantworter", "Durchsage am Bahnhof oder im Kaufhaus"],
      length: { min: 20, max: 32, unit: "seconds" }, voices: { min: 1, max: 1 }, plays: 2,
      instruction: "Sie hören einen kurzen Text. Wählen Sie die richtige Antwort: a, b oder c. Sie hören jeden Text zweimal.",
      hint: "Ein Monolog, 45–65 Wörter, A2. Die Frage fragt nach einem Detail. Drei Text-Optionen, die falschen kommen im Text vor.",
    },
  ],
  // research/telc-a2.md §2–3
  "telc-a2": [
    {
      skill: "lesen", teil: 3, answer: "match", ads: 8, noMatch: true, itemsReal: 5, itemsPerBlock: 5, sample: 3,
      textTypes: ["Kurze Anzeigen und Webseiten-Teaser (Kurse, Freizeit, Dienstleistungen, Einkaufen)"],
      length: { min: 110, max: 190, unit: "words" },
      instruction: "Lesen Sie die Situationen und die Anzeigen. Welche Anzeige passt? Für eine Situation gibt es keine passende Anzeige. Dann wählen Sie x.",
      hint: "8 Anzeigen, je 15–25 Wörter, mit Titel. A2.",
    },
    {
      skill: "hoeren", teil: 2, answer: "abc", itemsReal: 5, itemsPerBlock: 1,
      textTypes: ["Radio: Programmhinweis", "Radio: Wetterbericht", "Radio: Verkehrsmeldung", "Radio: Gewinnspiel"],
      length: { min: 15, max: 45, unit: "seconds" }, voices: { min: 1, max: 1 }, plays: 1,
      instruction: "Sie hören eine Meldung im Radio. Wählen Sie die richtige Antwort: a, b oder c. Sie hören jeden Text einmal.",
      hint: "Eine Radiosprecherin oder ein Radiosprecher, 30–100 Wörter, A2. Nennt mehrere Details, nur eins ist gefragt.",
    },
  ],
  // research/oesd-a2.md §3
  "oesd-a2": [
    {
      skill: "lesen", teil: 1, answer: "match", headings: true, ads: 10, noMatch: false, itemsReal: 5, itemsPerBlock: 5, sample: 3,
      textTypes: ["Einfache Zeitungsmeldungen (Lokales, Angebote, Veranstaltungen)"],
      length: { min: 45, max: 60, unit: "words" },
      instruction: "Lesen Sie die Überschriften und die Texte. Welche Überschrift passt zu welchem Text?",
      hint: "10 Überschriften (nur Titel, 3–7 Wörter). 3 Zeitungsmeldungen, je 45–60 Wörter. Zu jeder Meldung passt genau eine Überschrift; mindestens eine andere Überschrift passt fast (gleiches Thema, anderes Detail). Die übrigen Überschriften sind Ablenker zu ähnlichen Themen.",
    },
    {
      skill: "lesen", teil: 2, answer: "abc", itemsReal: 5, itemsPerBlock: 5, sample: 2,
      textTypes: ["Zeitungsbericht über eine Person oder ein Projekt"],
      length: { min: 170, max: 230, unit: "words" },
      instruction: "Lesen Sie den Text. Wählen Sie für jede Aufgabe die richtige Antwort: a, b oder c.",
      hint: `Ein Zeitungsbericht über eine Person (z. B. jemand eröffnet ein Café, macht eine lange Reise, hilft im Ort), "sender" ist die Zeitung, "source" die Rubrik. Die Aufgaben sind Satzanfänge ("Frau Berger …"), die Optionen vervollständigen den Satz.`,
    },
  ],
  // research/goethe-oesd-b1.md §3.1–3.2
  "goethe-oesd-b1": [
    {
      skill: "lesen", teil: 5, answer: "abc", itemsReal: 4, itemsPerBlock: 4, sample: 2,
      textTypes: ["Hausordnung", "Benutzungsordnung (Bibliothek, Sportzentrum)", "Teilnahmebedingungen für einen Kurs"],
      length: { min: 220, max: 280, unit: "words" },
      instruction: "Lesen Sie die Aufgaben und den Text. Wählen Sie für jede Aufgabe die richtige Lösung: a, b oder c.",
      hint: `Ein Regeltext mit Überschrift in der ersten Zeile und Abschnitten (z. B. "§ 3 Öffnungszeiten"). Die Aufgaben sind Satzanfänge, die Optionen vervollständigen den Satz.`,
    },
    {
      skill: "hoeren", teil: 1, answer: "rf+abc", itemsReal: 10, itemsPerBlock: 2,
      textTypes: ["Nachricht auf der Mailbox (privat oder von einer Hausverwaltung)", "Durchsage am Bahnhof oder bei einer Stadtführung", "Radiowerbung"],
      length: { min: 30, max: 48, unit: "seconds" }, voices: { min: 1, max: 1 }, plays: 2,
      accents: ["at"],
      instruction: "Sie hören einen kurzen Text. Zu jedem Text gibt es zwei Aufgaben. Ist die Aussage richtig oder falsch? Und welche Antwort passt: a, b oder c? Sie hören jeden Text zweimal.",
      hint: "Eine Person spricht, 70–100 Wörter, B1. Die Person kommt aus Österreich: Ort und Details passen dazu (z. B. Graz, Linz, Wien). Die R/F-Aussage prüft, worum es geht; die a/b/c-Frage ein Detail.",
    },
  ],
  // research/telc-b1.md §3b–3c
  "telc-b1": [
    {
      skill: "lesen", teil: 4, label: "Sprachbausteine · Teil 1", answer: "gap", itemsReal: 10, itemsPerBlock: 10, sample: 5,
      textTypes: ["Persönliche E-Mail an eine Freundin oder einen Freund"],
      length: { min: 150, max: 170, unit: "words" },
      instruction: "Lesen Sie die E-Mail. Welches Wort passt in die Lücke? Wählen Sie a, b oder c.",
      hint: "Informelle E-Mail (du), mit Anrede und Gruß. Die Lücken prüfen Grammatik: Konnektoren, Artikel und Kasus, Hilfsverben, Adjektivendungen, Präpositionen, Relativpronomen, Pronomen. Die drei Optionen sind grammatische Varianten (z. B. \"weil / denn / deshalb\", \"dem / den / der\").",
    },
    {
      skill: "hoeren", teil: 3, answer: "rf", itemsReal: 5, itemsPerBlock: 1,
      textTypes: ["Nachricht auf dem Anrufbeantworter", "Kinoprogramm-Ansage", "Wetterbericht", "Durchsage im Zug", "Durchsage im Geschäft"],
      length: { min: 20, max: 40, unit: "seconds" }, voices: { min: 1, max: 1 }, plays: 2,
      instruction: "Sie hören fünf kurze Texte. Ist die Aussage richtig oder falsch? Sie hören jeden Text zweimal.",
      hint: "Ein Monolog, 45–95 Wörter, B1. Die Aussage prüft ein konkretes Detail (Zeit, Ort, Zahl, Bedingung).",
    },
  ],
}

// What the generator drafts per exam. Sized for the 5-minute taster (TASTER in blueprint.ts): every Teil once,
// 5 items per closed skill. research/start-deutsch-1.md §6 has the longer 10-item proposal for a full mock.
export const EXAM_KURZTEST: Partial<Record<ExamId, KurztestPlan>> = {
  "start-deutsch-1": {
    lesen: [
      { teil: 1, blocks: 1, items: 2 },
      { teil: 2, blocks: 2, items: 1 },
      { teil: 3, blocks: 1, items: 1 },
    ],
    hoeren: [
      { teil: 1, blocks: 2, items: 1 },
      { teil: 2, blocks: 1, items: 1 },
      { teil: 3, blocks: 2, items: 1 },
    ],
  },
}

// research/start-deutsch-1.md §3.3–3.4 and §6. Schreiben: only Teil 2 (the free message); Sprechen: all three Teile,
// shortened to one card each. Point maxima are the official per-task values.
export const EXAM_OPEN: Partial<Record<ExamId, OpenSpec[]>> = {
  "start-deutsch-1": [
    {
      skill: "schreiben", teil: 2, title: "Kurze Nachricht", minutes: 5,
      instruction: "Schreiben Sie eine kurze E-Mail. Schreiben Sie zu allen drei Punkten, etwa 30 Wörter. Vergessen Sie Anrede und Gruß nicht.",
      todo: "TODO(hannes): Teil 1 (form with 5 fields) is left out of the Kurztest; add it with a form component for the full mock.",
    },
    { skill: "sprechen", teil: 1, title: "Sich vorstellen", minutes: 2, instruction: "Stellen Sie sich vor. Die Stichwörter helfen. Dann buchstabieren Sie etwas und sagen eine Zahl." },
    { skill: "sprechen", teil: 2, title: "Fragen und antworten", minutes: 2, instruction: "Sie bekommen eine Karte mit einem Thema und einem Wort. Fragen Sie Ihre Partnerin oder Ihren Partner. Antworten Sie auf die Frage an Sie." },
    { skill: "sprechen", teil: 3, title: "Bitten und reagieren", minutes: 2, instruction: "Sie bekommen eine Karte mit einem Bild. Bitten Sie Ihre Partnerin oder Ihren Partner um etwas. Reagieren Sie auf die Bitte an Sie." },
  ],
}

export type RubricLine = { name: string; max: number; teil?: number }

/** Points-scored rubrics. Each line scores full, half or zero (research/<exam>.md). Sprechen is not scored in the
 * free test: answers are only transcribed, next to a sample answer (Hannes, 2026-10-12: cheapest option). */
export const EXAM_RUBRICS: Partial<Record<ExamId, { schreiben: RubricLine[] }>> = {
  // Schreiben Teil 2: 3 / 1.5 / 0 per content point + 1 / 0.5 / 0 for the form.
  "start-deutsch-1": {
    schreiben: [
      { name: "Punkt 1", max: 3 },
      { name: "Punkt 2", max: 3 },
      { name: "Punkt 3", max: 3 },
      { name: "Anrede und Gruß", max: 1 },
    ],
  },
}
