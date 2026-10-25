// ÖSD Zertifikat A2: free-test specs from research/oesd-a2.md (checked 2026-10-12).
// Instructions are our own wording of what the real task asks; never the official text.

import type { ExamSpec } from "../exam-blueprints"

const U = "research/oesd-a2.md §9 (Modellsatz 2026, audio measured with Scribe + silencedetect, verified 2026-10-24)"

export const spec: ExamSpec = {
  context: { name: "ÖSD Zertifikat A2", level: "A2", setting: "Alltag in Österreich, Deutschland und der Schweiz; Texte aus allen drei Ländern (Preise in Euro oder Franken, Orte aus allen drei Ländern). Standardsprache, regionale Wörter nur, wenn sie aus dem Zusammenhang klar sind", copyright: "ÖSD" },
  parts: [
    {
      skill: "hoeren", teil: 1, answer: "rf", itemsReal: 4, itemsPerBlock: 4, sample: 2,
      // Two radio texts (f, then m) with the same four facts, 66–73 words, ~25 s, 161–170 wpm, jingle between; mark 4 of 8.
      full: { items: 4, first: 1, blocks: 1, itemsPerBlock: 4, length: { min: 23, max: 27, unit: "seconds" }, example: false, readingSeconds: 30, options: 8, clips: 2, pace: { min: 160, max: 172 }, sound: "Radio-Jingle vor, zwischen und nach den Texten", source: U },
      // The official set uses a weekend weather report (research/oesd-a2-official-situations.md): never as a text type here.
      textTypes: ["Zwei kurze Radiomeldungen zum selben Thema (Veranstaltung in der Stadt)", "Zwei kurze Radiomeldungen zum selben Thema (Verkehr am Feiertag)", "Zwei kurze Radiomeldungen zum selben Thema (Neueröffnung im Ort)"],
      length: { min: 40, max: 60, unit: "seconds" }, voices: { min: 2, max: 2 }, plays: 1,
      accents: ["at", "ch"],
      instruction: "Sie hören zwei kurze Meldungen im Radio. Beide sagen dasselbe, aber mit anderen Worten. Ist die Aussage richtig oder falsch? Sie hören die Meldungen einmal.",
      hint: `Zwei Radiosender bringen dieselbe Meldung. Sprecher 1 (erster Sender) liest Meldung 1, dann liest Sprecher 2 (zweiter Sender) Meldung 2: jede 65–75 Wörter, ruhige Radiosprache (A2), mit Sendername am Anfang. Beide Meldungen enthalten dieselben Informationen, aber in anderen Worten und anderer Reihenfolge. role: "Radio 1" und "Radio 2" (oder die erfundenen Sendernamen). Die Aussagen prüfen je eine Information (Tag, Ort, Zeit, Wetter, Preis); eine ist richtig, eine falsch, weil ein Detail nicht stimmt (z. B. anderer Tag). Die Lösung muss in beiden Meldungen gleich sein.`,
      todo: "TODO(hannes): the real Aufgabe 1 is 'mark 4 of 8 keywords' (one topic sheet, over-marking penalty). The kit has no pick-N-of-M format, so the taster asks 2 richtig/falsch statements.",
    },
    {
      skill: "hoeren", teil: 2, answer: "abc", itemsReal: 5, itemsPerBlock: 5, sample: 2,
      // Informal voice message ~124 words, 40.5 s, ~184 wpm, twice; playback sound before each play.
      full: { items: 5, first: 5, blocks: 1, itemsPerBlock: 5, length: { min: 38, max: 43, unit: "seconds" }, example: false, readingSeconds: 30, pace: { min: 172, max: 182 }, sound: "Abspielton vor jeder Wiedergabe", source: U },
      textTypes: ["Sprachnachricht von einer Freundin oder einem Freund", "Sprachnachricht vom Sportverein oder von der Kursleitung", "Sprachnachricht von einer Kollegin oder einem Kollegen"],
      length: { min: 28, max: 42, unit: "seconds" }, voices: { min: 1, max: 1 }, plays: 2,
      accents: ["at"],
      instruction: "Sie hören eine Sprachnachricht. Notieren Sie die wichtigen Informationen: Wählen Sie für jede Aufgabe die richtige Antwort, a, b oder c. Sie hören die Nachricht zweimal.",
      hint: `Eine Person spricht eine Sprachnachricht (Handy), locker und natürlich (A2): Begrüßung, Anlass (z. B. ein Ausflug, ein Fest, ein Kurs), dann mehrere Details zum Notieren: Datum, Uhrzeit, Treffpunkt, was man mitbringt, Preis in Euro, Telefonnummer. 70–95 Wörter. Die Fragen sind wie Stichwörter auf einem Notizzettel ("Treffpunkt:", "Mitbringen:", "Kosten pro Person:"). Die Optionen sind sehr kurz (1–4 Wörter oder eine Zahl); die zwei falschen kommen in der Nachricht auch vor (z. B. ein Preis, der geändert wird, oder etwas, das man nicht mitbringen muss).`,
      todo: "TODO(hannes): the real Aufgabe 2 is a note sheet where you write each detail yourself (5 gaps). The kit has no free-text note gap, so the taster uses a/b/c.",
    },
    {
      skill: "hoeren", teil: 3, answer: "abc", options: 5, itemsReal: 5, itemsPerBlock: 5, sample: 2,
      // Interviewer once, five answers (36–67 words, 12–23 s, 149–191 wpm), ~4 s apart, no labels; multi-select grid.
      full: { items: 5, first: 10, blocks: 1, itemsPerBlock: 5, length: { min: 12, max: 22, unit: "seconds" }, example: false, readingSeconds: 30, options: 5, clips: 5, pace: { min: 160, max: 180 }, sound: "leichte Straßengeräusche", source: U },
      textTypes: ["Straßeninterview im Radio zu einer Alltagsfrage (Freizeit, Einkaufen, Wohnen, Arbeit, Urlaub)"],
      length: { min: 38, max: 60, unit: "seconds" }, voices: { min: 3, max: 3 }, plays: 1,
      accents: ["at", "ch", "de"],
      instruction: "Sie hören ein Interview. Eine Reporterin fragt Personen auf der Straße. Was sagt jede Person? Wählen Sie für jede Person eine Antwort. Sie hören das Interview einmal.",
      hint: `Zuerst stellt die Reporterin oder der Reporter (Sprecher "reporter", erster Sprecher) die Frage, einmal, kurz (z. B. "Was machen Sie am Wochenende am liebsten?"). Dann antworten 2 Personen nacheinander, spontan gesprochen (A2), je 35–50 Wörter, mit "äh", "also", einfachen Sätzen. Jede Person nennt ihren Vornamen. Items: eine Aufgabe pro Person, prompt = "Was sagt <Vorname>?". Beide Aufgaben haben dieselben 5 Optionen in derselben Reihenfolge (wie eine Tabelle mit 5 Spalten, kurze Stichworte, z. B. "Sport machen"). Jede Person passt zu genau einer Option, die zwei Personen haben verschiedene Optionen. Jede Person erwähnt auch eine zweite Möglichkeit, sagt aber, dass sie das nicht (mehr) macht oder nicht mag.`,
      todo: "TODO(hannes): the real Aufgabe 3 is a 5×5 tick grid with several answers per person and per-row partial credit. Until the grid component exists, each row renders as one 5-option choice with one answer.",
    },
    {
      skill: "lesen", teil: 1, answer: "match", headings: true, ads: 6, noMatch: false, itemsReal: 5, itemsPerBlock: 5, sample: 3,
      // 10 headings A–I, K → 5 texts of 35–54 words with origin labels; a letter may be used twice.
      full: { items: 5, first: 1, blocks: 1, itemsPerBlock: 5, length: { min: 35, max: 55, unit: "words" }, example: false, options: 10, source: U },
      textTypes: ["Einfache Zeitungsmeldungen (Lokales, Angebote, Veranstaltungen)"],
      length: { min: 35, max: 55, unit: "words" },
      instruction: "Lesen Sie die Überschriften und die Texte. Welche Überschrift passt zu welchem Text?",
      hint: "6 Überschriften (nur Titel, 3–7 Wörter). 3 Zeitungsmeldungen, je 35–55 Wörter, jede beginnt mit dem Ort (\"Graz.\"). Zu jeder Meldung passt genau eine Überschrift; zu jeder Meldung passt eine andere Überschrift fast (gleiches Thema, anderes Detail). Die übrigen Überschriften sind Ablenker zu ähnlichen Themen.",
      todo: "TODO(hannes): the real Aufgabe 1 has 10 headings for 5 texts. The taster keeps the 2:1 ratio with 6 headings for 3 texts (research/oesd-a2.md §7).",
    },
    {
      skill: "lesen", teil: 2, answer: "abc", itemsReal: 5, itemsPerBlock: 5, sample: 2,
      // ~200 words (207 in the MS), Beispiel 0 + 5 sentence completions A/B/C in text order.
      full: { items: 5, first: 6, blocks: 1, itemsPerBlock: 5, length: { min: 185, max: 225, unit: "words" }, example: true, source: U },
      textTypes: ["Zeitungsbericht über eine Person oder ein Projekt"],
      length: { min: 170, max: 230, unit: "words" },
      instruction: "Lesen Sie den Text. Wählen Sie für jede Aufgabe die richtige Antwort: a, b oder c.",
      hint: `Ein Zeitungsbericht über eine Person (z. B. jemand eröffnet ein Café, macht eine lange Reise, hilft im Ort), "sender" ist die Zeitung, "source" die Rubrik. Die Aufgaben sind Satzanfänge ("Frau Berger …"), die Optionen vervollständigen den Satz.`,
    },
  ],
  kurztest: {
    lesen: [
      { teil: 1, blocks: 1, items: 3 },
      { teil: 2, blocks: 1, items: 2 },
    ],
    hoeren: [
      { teil: 1, blocks: 1, items: 2 },
      { teil: 2, blocks: 1, items: 2 },
      { teil: 3, blocks: 1, items: 2 },
    ],
  },
  // research/oesd-a2.md §4–5. Schreiben is the full task (one email, 4 questions) with a 5-minute timer.
  // Sprechen: both Aufgaben, shortened; the pair version, with the partner as a peer candidate.
  open: [
    {
      skill: "schreiben", teil: 1, title: "E-Mail an einen Freund", minutes: 5, tasks: 1, points: 4,
      instruction: "Lesen Sie die E-Mail. Antworten Sie Ihrer Freundin oder Ihrem Freund. Beantworten Sie alle vier Fragen und schreiben Sie etwa 50 Wörter. Vergessen Sie den Gruß am Ende nicht.",
      hint: `situation: Zuerst 1 Satz in Sie-Form ("Sie bekommen diese E-Mail von Ihrer Freundin Lena."), dann die E-Mail selbst (informell, du-Form, 60–80 Wörter, mit Anrede und Gruß, ohne Zeilenumbrüche, weil die Situation als ein Absatz erscheint; die E-Mail in Anführungszeichen „…“). Die E-Mail erzählt kurz etwas Neues (z. B. Umzug, Urlaub, neue Arbeit, Fest) und stellt genau 4 Fragen an die Person (z. B. wie es geht, was sie am Wochenende macht, ob sie mitkommt, was sie mitbringen soll). Österreich, Deutschland oder Schweiz.
points: die 4 Fragen aus der E-Mail, kurz, als Frage ("Wie war dein Urlaub?").
register: informell.
modelAnswer: etwa 50–60 Wörter (A2), mit Anrede, Antwort auf alle 4 Fragen (je 1–2 einfache Sätze, mit "und", "aber", "weil"), Bezug auf Lenas E-Mail und Gruß.`,
      todo: "TODO(hannes): the real task gives 30 minutes; the taster gives 5. The official text-length deduction (< 40 words) and the '< 50% covered → 0' rule are not modelled in the rubric.",
    },
    {
      skill: "sprechen", teil: 1, title: "Sich vorstellen", minutes: 2, partner: false, accents: ["at", "ch"],
      instruction: "Sie sehen sechs Themen. Wählen Sie fünf und sagen Sie zu jedem Thema ein paar Sätze über sich. Danach stellt die Prüferin oder der Prüfer noch eine Frage.",
      hint: `ÖSD prüft Sprechen zu zweit oder einzeln, mit zwei Prüfenden; hier üben "du" und eine Partnerin oder ein Partner mit einer Prüferin oder einem Prüfer. In diesem Teil spricht nur "du" mit der Prüferin; der Partner spricht nicht.
cards: genau 6 Karten mit je einem Thema als label und einem passenden picto aus der Liste (z. B. "Beruf", "Sprachen", "Musik", "Reisen", "Familie", "Das mache ich gern"). points: leer.
turns: 1. pruefer: begrüßt kurz und erklärt die Aufgabe (6 Themen, 5 wählen, zu jedem ein paar Sätze). 2. du: Hinweis "Wähl 5 Themen und sprich zu jedem 1–2 Sätze." sampleAnswer: 5 der 6 Themen, je 1–2 einfache Sätze (A2), zusammen 70–90 Wörter. 3. pruefer: eine Nachfrage zu einem der Themen (allgemein gestellt, damit sie zu jeder Antwort passt, z. B. "Und wohin möchten Sie gern einmal reisen? Warum?"). 4. du: Hinweis "Antworte auf die Frage." sampleAnswer 2–3 Sätze. 5. pruefer: kurzer Dank und Überleitung zur nächsten Aufgabe.`,
      todo: "TODO(hannes): the real exam has 10 minutes of preparation and two examiners (Assessor explains, Interlokutor asks follow-ups); the taster has no preparation step and one examiner voice.",
    },
    {
      skill: "sprechen", teil: 2, title: "Gemeinsam etwas planen", minutes: 2, accents: ["at", "ch"],
      instruction: "Planen Sie zusammen mit Ihrer Partnerin oder Ihrem Partner eine Aktivität. Machen Sie Vorschläge, reagieren Sie auf die Vorschläge und einigen Sie sich.",
      hint: `ÖSD prüft Sprechen zu zweit oder einzeln; hier die Paarprüfung: "du" plant mit einer Partnerin oder einem Partner (andere Prüfungsteilnehmende), die Prüferin hört zu.
Die Aktivität: z. B. ein Fest für eine Kollegin, ein Picknick mit Nachbarn, ein Flohmarkt im Haus (nie ein Ausflug mit dem Deutschkurs: das ist die offizielle Aufgabe). points: genau 5 Stichworte wie auf dem Aufgabenblatt: "Wohin?", "Wann?", "Wie hinfahren?", "Was mitnehmen?", "Sonst noch etwas?". cards: genau 3 Karten = drei Ziele zur Auswahl (label = Ort, picto aus der Liste passend).
turns (8–10): 1. pruefer: erklärt die Aufgabe kurz. 2. partner: macht einen ersten Vorschlag zu "Wohin?". 3. du: Hinweis "Reagiere und mach einen anderen Vorschlag." 4. partner: widerspricht höflich oder nimmt an, fragt nach "Wann?". 5. du: Hinweis zum Termin. 6. partner: schlägt vor, wie man hinfährt. 7. du: Hinweis "Sag, was ihr mitnehmt." 8. partner: stimmt zu, fragt nach "Sonst noch etwas?" oder fasst zusammen. 9. du: Hinweis zum Abschluss. 10. pruefer: beendet die Prüfung freundlich. Der Partner spricht natürlich, 1–3 Sätze pro Beitrag (A2), widerspricht mindestens einmal. sampleAnswer je 1–3 Sätze.`,
      todo: "TODO(hannes): pair or individual version (both are official; in the individual exam the Interlokutor is the partner). The taster simulates the pair version.",
    },
  ],
  // Auswertungsbogen Schriftlich Vers. 4.0 (research/oesd-a2.md §4). Max 15 in the real exam.
  rubric: {
    schreiben: [
      // Real: +1 (all 4 + extra content) / 0 (all 4) / −1 (one missing) / −2 (two missing). Shifted by +2 so the line
      // stays ≥ 0: the rubric total is 17 here, not 15.
      { name: "Aufgabe: alle vier Fragen beantwortet", max: 3, steps: [1, 2 / 3, 1 / 3, 0] },
      { name: "Kommunikative Angemessenheit (Anrede, Gruß, Bezug, Ton)", max: 2 },
      { name: "Textaufbau und Kohärenz", max: 2 },
      { name: "Wortschatz", max: 5, steps: [1, 0.8, 0.6, 0.4, 0.2, 0] },
      { name: "Formale Richtigkeit", max: 5, steps: [1, 0.8, 0.6, 0.4, 0.2, 0] },
    ],
  },
  taster: {
    lesen: [{ teil: 1, blocks: 1 }, { teil: 2, blocks: 1 }],
    hoeren: [{ teil: 1, blocks: 1 }, { teil: 2, blocks: 1 }, { teil: 3, blocks: 1 }],
    sprechen: [1, 2],
    minutes: { lesen: 5, hoeren: 4, schreiben: 5, sprechen: 4 },
  },
}
