// Goethe-Zertifikat A2: free-test specs from research/goethe-a2.md (checked 2026-10-12).
// Instructions are our own wording of what the real task asks; never the official text.
// Every Teil is listed with its real item count, so drafts carry the real item numbers (Lesen 1–20, Hören 1–20).

import type { ExamSpec } from "../exam-blueprints"

export const spec: ExamSpec = {
  context: { name: "Goethe-Zertifikat A2", level: "A2", setting: "Alltag in Deutschland", copyright: "Goethe-Institut" },
  parts: [
    {
      skill: "lesen", teil: 1, answer: "abc", itemsReal: 5, itemsPerBlock: 5,
      textTypes: ["Zeitungsartikel über eine Person oder ein Projekt"],
      length: { min: 200, max: 250, unit: "words" },
      instruction: "Lesen Sie den Artikel. Wählen Sie für jede Aufgabe die richtige Antwort: a, b oder c.",
      todo: "TODO(hannes): not in the taster (a ~220-word article doesn't fit 5 minutes next to the other Teile); not drafted yet.",
    },
    {
      skill: "lesen", teil: 2, answer: "abc", itemsReal: 5, itemsPerBlock: 1,
      textTypes: ["Informationstafel in einem Kaufhaus", "Wegweiser in einem Einkaufszentrum"],
      length: { min: 50, max: 100, unit: "words" },
      instruction: "Lesen Sie die Aufgaben und die Informationstafel. In welches Stockwerk gehen Sie? Wählen Sie a, b oder c.",
      hint: `Der Text ist eine Liste: jede Zeile in "paragraphs" ist ein Stockwerk mit Abteilungen (z. B. "2. Stock: Damenmode, Schuhe, Taschen"). Jede Aufgabe ist eine Situation ("Sie möchten …"). Optionen a und b sind zwei Stockwerke aus der Tafel, Option c heißt immer genau "anderes Stockwerk". Bei einer der zwei Aufgaben ist c richtig.`,
      todo: "TODO(hannes): unverified — the real Teil 2 text can also be a ~240-word event programme (research §9); the taster uses the store directory.",
    },
    {
      skill: "lesen", teil: 3, answer: "abc", itemsReal: 5, itemsPerBlock: 5,
      textTypes: ["Private E-Mail an eine Freundin oder einen Freund"],
      length: { min: 220, max: 270, unit: "words" },
      instruction: "Lesen Sie die E-Mail. Wählen Sie für jede Aufgabe die richtige Antwort: a, b oder c.",
      todo: "TODO(hannes): not in the taster (a ~250-word email doesn't fit 5 minutes); not drafted yet.",
    },
    {
      skill: "lesen", teil: 4, answer: "match", ads: 6, noMatch: true, itemsReal: 5, itemsPerBlock: 5,
      textTypes: ["Kurze Anzeigen im Internet (Kurse, Freizeit, Dienstleistungen, Einkaufen, Reisen)"],
      length: { min: 170, max: 260, unit: "words" },
      instruction: "Lesen Sie die Situationen und die Anzeigen. Welche Anzeige passt zu welcher Person? Für eine Person gibt es keine passende Anzeige. Dann wählen Sie x.",
      hint: `6 kurze Internetanzeigen (a–f), je 25–40 Wörter, mit Titel (z. B. Name der Firma, des Kurses oder der Webseite). Zusammen etwa 220 Wörter. Die Situationen nennen eine Person und was sie sucht, in einem Satz in der dritten Person (z. B. "Herr Kaya möchte am Wochenende mit seinen Kindern …"). Jede Anzeige passt höchstens zu einer Person. Bei der Person ohne Lösung gibt es eine Anzeige, die fast passt (anderer Tag, andere Zielgruppe, zu weit weg). A2, einfache Sätze.`,
      todo: "TODO(hannes): the real Teil has 5 people + an example whose ad can't be reused; the taster shows 3 people with all 6 ads.",
    },
    {
      skill: "hoeren", teil: 1, answer: "abc", itemsReal: 5, itemsPerBlock: 1,
      textTypes: ["Radio: Hinweis auf eine Veranstaltung", "Nachricht auf dem Anrufbeantworter", "Durchsage am Bahnhof oder im Kaufhaus", "Radio: Wetterbericht"],
      length: { min: 20, max: 32, unit: "seconds" }, voices: { min: 1, max: 1 }, plays: 2,
      instruction: "Sie hören einen kurzen Text. Wählen Sie die richtige Antwort: a, b oder c. Sie hören jeden Text zweimal.",
      hint: "Ein Monolog, 45–65 Wörter, A2. Anrufbeantworter: Begrüßung, Name, Anliegen, Bitte um Rückruf oder Info. Die Frage fragt nach einem Detail (Zeit, Ort, Treffpunkt, was mitbringen). Drei Text-Optionen, die falschen kommen im Text vor.",
    },
    {
      skill: "hoeren", teil: 2, answer: "match", itemsReal: 5, itemsPerBlock: 5,
      textTypes: ["Gespräch zwischen einer Frau und einem Mann über eine Woche oder eine Reise"],
      length: { min: 100, max: 130, unit: "seconds" }, voices: { min: 2, max: 2 }, plays: 1,
      instruction: "Sie hören ein Gespräch. Was hat die Person an welchem Tag gemacht? Wählen Sie für jede Aufgabe ein Bild. Sie hören den Text einmal.",
      todo: "TODO(hannes): not drafted. The kit's listening match is the opinions format; Teil 2 needs a dialogue matched to 9 pictures (a–i, each once). Needs a picture-match component.",
    },
    {
      skill: "hoeren", teil: 3, answer: "pic", itemsReal: 5, itemsPerBlock: 1,
      textTypes: ["Gespräch beim Einkaufen", "Gespräch über einen Termin", "Gespräch bei der Arbeit", "Gespräch zu Hause oder unter Nachbarn"],
      length: { min: 25, max: 35, unit: "seconds" }, voices: { min: 2, max: 2 }, plays: 1,
      instruction: "Sie hören ein kurzes Gespräch. Wählen Sie die richtige Antwort: a, b oder c. Sie hören jeden Text einmal.",
      hint: `Zwei Personen (eine Frau und ein Mann), ein Alltagsgespräch mit 4–8 Beiträgen, 60–75 Wörter, natürlich gesprochen (A2). Die Frage fragt nach etwas, das man auf einem Bild zeigen kann: was die Person kauft, isst, mitnimmt, womit sie fährt, wo sie sich treffen, wie das Wetter wird, um wie viel Uhr. Jede Option hat ein Piktogramm ("pictos", ein Schlüssel aus der Liste) und eine kurze Beschriftung (ein bis drei Wörter, eine Uhrzeit wie "15:30" oder ein Preis). Alle drei Optionen kommen im Gespräch vor; eine wird geändert oder abgelehnt, nur eine passt am Ende.`,
      todo: "TODO(hannes): the real options are drawings or text; pictograms + label stand in (lib/exam/pictos.ts).",
    },
    {
      skill: "hoeren", teil: 4, answer: "rf", itemsReal: 5, itemsPerBlock: 5,
      textTypes: ["Interview im Radio mit einer Person über ihr Leben oder ein Projekt"],
      length: { min: 90, max: 115, unit: "seconds" }, voices: { min: 2, max: 2 }, plays: 2,
      instruction: "Sie hören ein Interview. Sind die Aussagen richtig? Wählen Sie Ja oder Nein. Sie hören den Text zweimal.",
      todo: "TODO(hannes): not drafted. The real answer is Ja/Nein, the kit only renders richtig/falsch; ~100 s played twice also breaks the 4-minute taster.",
    },
  ],
  // What the generator drafts: exactly what the taster shows (Lesen 5 items, Hören 5 items).
  kurztest: {
    lesen: [
      { teil: 2, blocks: 1, items: 2 },
      { teil: 4, blocks: 1, items: 3 },
    ],
    hoeren: [
      { teil: 1, blocks: 2, items: 1 },
      { teil: 3, blocks: 3, items: 1 },
    ],
  },
  // research/goethe-a2.md §4–5. Schreiben: Teil 2 (semi-formal email), the research's pick. Sprechen: all three Teile,
  // shortened (Teil 1: 2 + 2 questions instead of 4 + 4; Teil 3: one short negotiation round).
  open: [
    {
      skill: "schreiben", teil: 2, title: "E-Mail mit drei Punkten", minutes: 5, tasks: 1, points: 3,
      instruction: "Schreiben Sie eine E-Mail mit 30–40 Wörtern. Schreiben Sie zu allen drei Punkten. Vergessen Sie Anrede und Gruß nicht.",
      hint: `situation: 2–3 kurze Sätze in Sie-Form (A2), z. B. "Ihre Chefin, Frau Lorenz, hat Sie zu einem Fest eingeladen. Sie können nicht kommen. Schreiben Sie Frau Lorenz eine E-Mail." Empfänger: Chefin oder Chef, Kursleiterin, Vermieter, Hotel, Sprachschule, Arztpraxis. Der Empfänger wird mit Sie angesprochen.
points: genau 3 Sprechhandlungen als kurze Aufforderung in Sie-Form, z. B. "Bedanken Sie sich.", "Nennen Sie einen Grund.", "Fragen Sie nach einem neuen Termin." Keine Stichwörter allein.
register: formell.
modelAnswer: 35–45 Wörter, mit Anrede, allen drei Punkten (je 1–2 einfache Sätze, A2) und Gruß mit Vornamen und Nachnamen.`,
      todo: "TODO(hannes): Teil 1 (informal message, 20–30 words) is left out of the taster; the real exam has both tasks in 30 minutes.",
    },
    {
      skill: "sprechen", teil: 1, title: "Fragen zur Person", minutes: 1,
      instruction: "Sie bekommen Karten mit einem Wort. Fragen Sie Ihre Partnerin oder Ihren Partner. Antworten Sie auf die Fragen an Sie.",
      hint: `Goethe A2 ist eine Paarprüfung mit Prüferin oder Prüfer. Teil 1: Beide stellen abwechselnd Fragen mit Wortkarten zum Thema "Fragen zur Person" und antworten. In der Prüfung sind es 4 Karten pro Person; hier 2.
cards: genau 2 Karten für "du": label = "Fragen zur Person · <Wort>" (Wörter wie Geburtstag, Wohnort, Beruf, Hobby, Familie, Sprachen, Lieblingsessen, Wochenende), picto = null. Der Partner hat 2 andere Wörter (nicht auf den Karten von "du"). points: die zwei Wörter von "du".
turns: 1. pruefer: erklärt kurz, dass beide mit den Karten fragen und antworten, und bittet den Partner anzufangen. 2. partner: stellt "du" eine Frage mit seinem ersten Wort. 3. du: Hinweis "Antworte auf die Frage." 4. du: Hinweis "Frag deine Partnerin (oder: deinen Partner) mit deiner ersten Karte: <Wort>." – passend zum gender des Partners. 5. partner: antwortet kurz (1–2 Sätze, A2). 6. partner: stellt die zweite Frage mit seinem zweiten Wort. 7. du: Hinweis "Antworte auf die Frage." 8. du: Hinweis "Frag mit deiner zweiten Karte: <Wort>." 9. partner: antwortet kurz. 10. pruefer: kurzer Dank, weiter zu Teil 2.
sampleAnswer: Antworten 1–2 Sätze, Fragen eine einfache W-Frage oder Ja/Nein-Frage in du-Form.`,
    },
    {
      skill: "sprechen", teil: 2, title: "Über sich erzählen", minutes: 1.5, partner: false,
      instruction: "Sie bekommen eine Karte mit einer Frage. Erzählen Sie von sich. Die vier Stichwörter helfen. Danach stellt die Prüferin oder der Prüfer Ihnen eine Frage.",
      hint: `Goethe A2 ist eine Paarprüfung; in Teil 2 spricht jede Person allein über ihr eigenes Leben, der Partner hört zu und spricht nicht.
cards: genau 1 Karte für "du": label = die Frage auf der Karte in Sie-Form wie in der Erwachsenenprüfung (z. B. "Was machen Sie am Wochenende?", "Wie feiern Sie Ihren Geburtstag?", "Was essen Sie gern?"), picto = passend aus der Liste oder null. points: genau 4 Stichwörter zur Frage (z. B. "Wo?", "Mit wem?", "Was?", "Warum?" oder kurze Nomen; Sie-Form).
turns: 1. pruefer: sagt, dass jetzt "du" über die Frage auf der Karte erzählt, und liest die Frage vor (Sie-Form). 2. du: Hinweis "Erzähl von dir. Die vier Stichwörter helfen." 3. pruefer: stellt eine Nachfrage zum Thema, die zu jeder Antwort passt (z. B. "Und was machen Sie am Wochenende nicht so gern?"). 4. du: Hinweis "Antworte auf die Frage." 5. pruefer: kurzer Dank.
sampleAnswer: bei 2. 5–7 einfache Sätze, alle vier Stichwörter; bei 4. 1–2 Sätze. Der Partner spricht in diesem Teil nicht.`,
    },
    {
      skill: "sprechen", teil: 3, title: "Gemeinsam etwas planen", minutes: 1.5,
      instruction: "Sie möchten zusammen etwas machen. Sie haben beide einen Kalender für den Tag. Finden Sie eine Zeit, in der Sie beide frei sind.",
      hint: `Goethe A2 ist eine Paarprüfung. In Teil 3 haben beide einen eigenen Kalender für denselben Tag; der Partner sieht den Kalender von "du" nicht und umgekehrt.
Thema: etwas gemeinsam machen, das ein bis zwei Stunden dauert (eine Kollegin im Krankenhaus besuchen, ein Geschenk für eine Freundin kaufen, für einen Freund ein Regal aufbauen, zusammen für den Kurs lernen).
cards: der Kalender von "du": genau 5 Einträge zwischen 8 und 20 Uhr, je label "HH:MM–HH:MM: <Termin>" (z. B. "9:00–11:00: Deutschkurs"), picto passend aus der Liste oder null. Im Kalender von "du" gibt es genau EINE freie Zeit von mindestens zwei Stunden (eine Lücke zwischen zwei Einträgen); alle anderen Zeiten sind belegt. points: genau 3 Planungspunkte, z. B. "Wann?", "Wo treffen?", "Was mitbringen?".
turns: 1. pruefer: nennt die Aufgabe (Sie-Form, 1–2 Sätze). 2. partner: schlägt eine Zeit vor, zu der "du" laut Kalender einen Termin hat. 3. du: Hinweis "Schau in deinen Kalender. Sag, dass du da nicht kannst, und warum." 4. partner: sagt, dass er zu einer anderen belegten Zeit von "du" auch nicht kann, und fragt: "Wann hast du denn Zeit?" 5. du: Hinweis "Schlag deine freie Zeit vor." 6. partner: stimmt genau dieser freien Zeit zu (sie passt auch für ihn) und schlägt einen Treffpunkt vor. 7. du: Hinweis "Reagiere und sag, was ihr mitbringen könnt." 8. partner: stimmt zu, kurzer Abschluss. 9. pruefer: beendet die Prüfung freundlich.
sampleAnswer: 1–3 einfache Sätze (A2), mit der Uhrzeit aus dem Kalender von "du".`,
    },
  ],
  // research/goethe-a2.md §4: per task Aufgabenerfüllung and Sprache, each A–E = 5 / 3.5 / 2 / 0.5 / 0.
  rubric: {
    schreiben: [
      { name: "Aufgabenerfüllung", max: 5, steps: [1, 0.7, 0.4, 0.1, 0] },
      { name: "Sprache", max: 5, steps: [1, 0.7, 0.4, 0.1, 0] },
    ],
  },
  taster: {
    lesen: [{ teil: 2, blocks: 1 }, { teil: 4, blocks: 1 }],
    hoeren: [{ teil: 1, blocks: 2 }, { teil: 3, blocks: 3 }],
    sprechen: [1, 2, 3],
    minutes: { lesen: 5, hoeren: 4, schreiben: 5, sprechen: 4 },
  },
}
