// Start Deutsch 1: free-test specs from research/start-deutsch-1.md (checked 2026-10-12).
// Instructions are our own wording of what the real task asks; never the official text.

import type { ExamSpec } from "../exam-blueprints"

export const spec: ExamSpec = {
  context: { name: "Start Deutsch 1 (Goethe-Zertifikat A1 / telc Deutsch A1)", level: "A1", setting: "Alltag in Deutschland", copyright: "Goethe-Institut, telc" },
  parts: [
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
  // What the generator drafts; research/start-deutsch-1.md §6 has the longer 10-item proposal for a full mock.
  kurztest: {
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
  // research/start-deutsch-1.md §3.3–3.4, §5. Schreiben: only Teil 2 (the free message). Sprechen: all three Teile,
  // shortened to one card each. A group exam at A1, here with one partner; each card is answered once.
  open: [
    {
      skill: "schreiben", teil: 2, title: "Kurze Nachricht", minutes: 5, tasks: 1, points: 3,
      instruction: "Schreiben Sie eine kurze E-Mail. Schreiben Sie zu allen drei Punkten, etwa 30 Wörter. Vergessen Sie Anrede und Gruß nicht.",
      hint: `situation: 1–2 sehr einfache Sätze in Sie-Form (A1), z. B. "Sie können am Samstag nicht zum Kurs kommen. Schreiben Sie Ihrer Lehrerin eine E-Mail." Empfänger: eine Freundin, ein Kollege, eine Lehrerin, ein Büro (z. B. Touristeninformation, Sprachschule).
points: wie im Prüfungsheft (z. B. "Warum schreiben Sie?", "Neuer Termin?", "Bitte um Antwort").
register: informell (Freundin, Freund, Kollege) oder formell (Büro).
modelAnswer: etwa 30–40 Wörter, mit passender Anrede, allen drei Punkten (je 1–2 einfache Sätze) und Gruß.`,
      todo: "TODO(hannes): Teil 1 (form with 5 fields) is left out of the Kurztest; add it with a form component for the full mock.",
    },
    {
      skill: "sprechen", teil: 1, title: "Sich vorstellen", minutes: 2, partner: false,
      instruction: "Stellen Sie sich vor. Die Stichwörter helfen. Dann buchstabieren Sie etwas und sagen eine Zahl.",
      hint: `Start Deutsch 1 ist eine Gruppenprüfung; hier üben "du" und eine Partnerin oder ein Partner mit einer Prüferin oder einem Prüfer. Beim Buchstabieren steht die Beispielantwort mit Bindestrichen (z. B. "K-A-R-I-M").
Die Prüferin begrüßt kurz und bittet "du", sich vorzustellen. points: genau die Stichwörter Name, Alter, Land, Wohnort, Sprachen, Beruf, Hobby. cards: leer.
turns: 1. pruefer: Bitte um Vorstellung. 2. du: Hinweis "Stell dich vor. Die Stichwörter helfen." 3. pruefer: bittet "du", etwas zu buchstabieren (Nachname oder Straße). 4. du: Hinweis "Buchstabier deinen Nachnamen." (oder die Straße) 5. pruefer: fragt nach einer Zahl (Telefonnummer, Hausnummer oder Postleitzahl). 6. du: Hinweis zur Zahl. 7. pruefer: kurzer Dank. Der Partner spricht in diesem Teil nicht.`,
    },
    {
      skill: "sprechen", teil: 2, title: "Fragen und antworten", minutes: 2,
      instruction: "Sie bekommen eine Karte mit einem Thema und einem Wort. Fragen Sie Ihre Partnerin oder Ihren Partner. Antworten Sie auf die Frage an Sie.",
      hint: `Start Deutsch 1 ist eine Gruppenprüfung; hier üben "du" und eine Partnerin oder ein Partner mit einer Prüferin oder einem Prüfer.
Thema der Runde, z. B. Essen und Trinken, Einkaufen, Wochenende, Freizeit, Arbeit. cards: genau 1 Karte für "du": label = "Thema: <Thema> · <ein Wort>" (z. B. "Thema: Essen und Trinken · Frühstück"), picto = null. points: das Thema.
turns: 1. pruefer: nennt das Thema und erklärt kurz. 2. partner: stellt "du" eine einfache Frage zum Thema mit dem Wort von seiner Karte (z. B. "Was trinkst du gern?"). 3. du: Hinweis "Antworte auf die Frage." 4. du: Hinweis "Frag deine Partnerin (oder: deinen Partner) mit deiner Karte: <Wort>." – passend zum gender des Partners. 5. partner: antwortet kurz (1–2 Sätze, A1). 6. pruefer: kurzer Dank.`,
    },
    {
      skill: "sprechen", teil: 3, title: "Bitten und reagieren", minutes: 2,
      instruction: "Sie bekommen eine Karte mit einem Bild. Bitten Sie Ihre Partnerin oder Ihren Partner um etwas. Reagieren Sie auf die Bitte an Sie.",
      hint: `Start Deutsch 1 ist eine Gruppenprüfung; hier üben "du" und eine Partnerin oder ein Partner mit einer Prüferin oder einem Prüfer.
cards: genau 1 Karte für "du" mit einem Gegenstand oder Schild als Bild (picto aus der Liste, label = das Wort, z. B. "Regenschirm"). points: leer.
turns: 1. pruefer: erklärt kurz, dass man um etwas bittet. 2. du: Hinweis "Bitte deine Partnerin (oder: deinen Partner) um etwas. Deine Karte: <Wort>." – passend zum gender des Partners. 3. partner: reagiert kurz auf die Bitte (ja oder höflich nein, 1 Satz). 4. partner: bittet "du" um etwas Anderes (eine einfache Bitte, z. B. "Gibst du mir bitte den Kuli?"). 5. du: Hinweis "Reagiere auf die Bitte." 6. pruefer: beendet die Prüfung freundlich.`,
    },
  ],
  // Schreiben Teil 2: 3 / 1.5 / 0 per content point + 1 / 0.5 / 0 for the form.
  rubric: {
    schreiben: [
      { name: "Punkt 1", max: 3 },
      { name: "Punkt 2", max: 3 },
      { name: "Punkt 3", max: 3 },
      { name: "Anrede und Gruß", max: 1 },
    ],
  },
  taster: {
    lesen: [{ teil: 1, blocks: 1 }, { teil: 2, blocks: 2 }, { teil: 3, blocks: 1 }],
    hoeren: [{ teil: 1, blocks: 2 }, { teil: 2, blocks: 1 }, { teil: 3, blocks: 2 }],
    sprechen: [1, 2, 3],
    minutes: { lesen: 5, hoeren: 4, schreiben: 5, sprechen: 4 },
  },
}
