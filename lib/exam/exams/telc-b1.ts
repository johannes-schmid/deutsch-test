// telc Deutsch B1: free-test specs from research/telc-b1.md (checked 2026-10-12).
// Instructions are our own wording of what the real task asks; never the official text.
// Lesen Teil 4 and 5 are the Sprachbausteine subtest; it sits in the same 90-minute block as Lesen (research §6).

import type { ExamSpec } from "../exam-blueprints"

// Hören timings and pace measured on the official Übungstest 1 MP3 (2026-10-23): ~180–190 words/min.
const U = "research/telc-b1.md (telc Übungstest 1, 2020; audio measured 2026-10-23)"

export const spec: ExamSpec = {
  context: { name: "telc Deutsch B1 (Zertifikat Deutsch)", level: "B1", setting: "Alltag und Arbeit in Deutschland", copyright: "telc" },
  parts: [
    {
      skill: "lesen", teil: 1, answer: "match", headings: true, noMatch: false, ads: 4, itemsReal: 5, itemsPerBlock: 5, sample: 2,
      textTypes: ["Kurze Zeitungsmeldungen (Studien, Verbrauchertipps, Reiseangebote, Buchtipps)"],
      length: { min: 50, max: 80, unit: "words" },
      instruction: "Lesen Sie die Überschriften und die Texte. Welche Überschrift passt zu welchem Text? Jede Überschrift passt nur einmal.",
      hint: `Kurze Meldungen aus Zeitung oder Zeitschrift, je etwa 65 Wörter, B1, sachlicher Pressestil (Studie, Verbrauchertipp, Reiseangebot, Buchtipp, Neues aus der Stadt). Die Überschriften sind kurz (3–7 Wörter) wie in der Zeitung. Genau eine Überschrift passt zu jeder Meldung; die übrigen Überschriften greifen ein Wort oder Thema aus einer Meldung auf, treffen aber nicht den Kern. Die Überschrift fasst die Meldung zusammen, sie wiederholt nicht ihre Wörter.`,
      todo: "TODO(hannes): the real Teil 1 has 5 texts and 10 headlines; the taster keeps the 2:1 ratio with 2 texts and 4 headlines.",
      full: { items: 5, first: 1, blocks: 1, itemsPerBlock: 5, length: { min: 50, max: 90, unit: "words" }, example: false, options: 10, source: U },
    },
    {
      skill: "lesen", teil: 2, answer: "abc", itemsReal: 5, itemsPerBlock: 5,
      textTypes: ["Artikel aus Zeitung oder Zeitschrift zu einem Thema aus Gesellschaft oder Arbeit"],
      length: { min: 290, max: 350, unit: "words" },
      instruction: "Lesen Sie den Artikel. Welche Antwort passt: a, b oder c?",
      todo: "TODO(hannes): not in the taster: a ~320-word article does not fit the 5-minute timer next to the other Teile.",
      full: { items: 5, first: 6, blocks: 1, itemsPerBlock: 5, length: { min: 280, max: 370, unit: "words" }, example: false, source: U },
    },
    {
      skill: "lesen", teil: 3, answer: "match", noMatch: true, ads: 3, itemsReal: 10, itemsPerBlock: 10, sample: 2,
      textTypes: ["Kleinanzeigen (Restaurants, Reisen, Nachhilfe, Kurse, Vereine)"],
      // All ads of one taster block together: 3 ads of ~15–50 words.
      length: { min: 60, max: 140, unit: "words" },
      instruction: "Lesen Sie die Situationen und die Anzeigen. Welche Anzeige passt zu welcher Situation? Jede Anzeige passt nur einmal. Passt keine Anzeige, wählen Sie x.",
      hint: `Kleinanzeigen wie in der Zeitung oder im Internet, je 20–45 Wörter, mit Titel. Die Situationen: 1–2 Sätze über eine Person mit einem konkreten Wunsch ("Ihre Nachbarin sucht …", "Sie möchten …"). Die Anzeigen enthalten Details (Tage, Uhrzeiten, Preise, Zielgruppe, Ort). Die Anzeige, die fast passt, scheitert an genau einem Detail.`,
      todo: "TODO(hannes): the real Teil 3 has 10 situations, 12 ads and 2 \"x\" answers (Übungstest 1); the taster uses 2 situations and 3 ads with one \"x\", so x is overrepresented here.",
      // Modelltest: all 12 ads together (~15–50 words each).
      full: { items: 10, first: 11, blocks: 1, itemsPerBlock: 10, length: { min: 250, max: 520, unit: "words" }, example: false, options: 12, source: U },
    },
    {
      skill: "lesen", teil: 4, label: "Sprachbausteine · Teil 1", answer: "gap", itemsReal: 10, itemsPerBlock: 10, sample: 2,
      textTypes: ["Persönliche E-Mail an eine Freundin oder einen Freund"],
      length: { min: 150, max: 170, unit: "words" },
      instruction: "Lesen Sie die E-Mail. Welches Wort passt in die Lücke? Wählen Sie a, b oder c.",
      hint: "Informelle E-Mail (du), mit Anrede und Gruß. Die Lücken prüfen Grammatik: Konnektoren, Artikel und Kasus, Hilfsverben, Adjektivendungen, Präpositionen, Relativpronomen, Pronomen. Die drei Optionen sind grammatische Varianten (z. B. \"weil / denn / deshalb\", \"dem / den / der\"). Die zwei Lücken prüfen zwei verschiedene Bereiche.",
      todo: "TODO(hannes): Sprachbausteine Teil 2 (10 gaps from a pool of 15 words) is left out: the kit has no shared word pool for gaps.",
      full: { items: 10, first: 21, blocks: 1, itemsPerBlock: 10, length: { min: 140, max: 195, unit: "words" }, example: false, source: U },
    },
    {
      skill: "lesen", teil: 5, label: "Sprachbausteine · Teil 2", answer: "gap", itemsReal: 10, itemsPerBlock: 10,
      textTypes: ["Halbformeller oder formeller Brief: Anfrage, Antwort auf eine Anzeige, Bitte um Information"],
      length: { min: 150, max: 200, unit: "words" },
      instruction: "Lesen Sie den Text und schließen Sie die Lücken 31–40. Benutzen Sie die Wörter a–o. Jedes Wort passt nur einmal.",
      todo: "TODO(hannes): not in the free test. In the Modelltest each gap shows the whole 15-word pool until the word-pool component exists (research/telc-plan.md Phase 2).",
      full: { items: 10, first: 31, blocks: 1, itemsPerBlock: 10, length: { min: 150, max: 205, unit: "words" }, example: false, options: 15, source: U },
    },
    {
      skill: "hoeren", teil: 1, answer: "rf", itemsReal: 5, itemsPerBlock: 5, sample: 3,
      textTypes: ["Radiosendung: Umfrage auf der Straße zu einer Alltagsfrage"],
      // One clip: a short intro by the presenter, then 3 people (the real Teil has 5), each ~20–30 s.
      length: { min: 70, max: 115, unit: "seconds" }, voices: { min: 4, max: 4 }, plays: 1,
      instruction: "Sie hören eine Umfrage im Radio. Zu jeder Person gibt es eine Aussage. Ist die Aussage richtig oder falsch? Sie hören den Text einmal.",
      hint: `Eine Radiomoderatorin (Sprecherin "M", female) stellt in 1–2 Sätzen die Frage der Umfrage vor. Dann sagen genau drei Personen nacheinander ihre Meinung, jede einmal, 45–65 Wörter: zuerst ein Mann, dann eine Frau, dann ein Mann (genau 2 Frauen und 2 Männer insgesamt). Jede Person nennt am Anfang ihren Vornamen ("Ich bin Jonas …"); role ist der Vorname. Spontan gesprochen, mit Füllwörtern ("also", "na ja"), B1.
Genau eine Aussage pro Person, in der Reihenfolge der Personen, beginnend mit dem Vornamen ("Jonas findet …"). Die Aussage prüft die Meinung oder Haltung der Person, nicht ein einzelnes Wort. Mindestens eine Aussage ist richtig und mindestens eine falsch; eine falsche Aussage nimmt etwas auf, das die Person erwähnt, aber anders meint.`,
      todo: "TODO(hannes): the real Teil 1 has 5 speakers and 30 s reading time before the clip; the taster has 3 and no reading pause.",
      // Modelltest: a host intro, then each statement its own clip (5 voices), ~16 s pause after each.
      full: { items: 5, first: 41, blocks: 1, itemsPerBlock: 5, length: { min: 15, max: 28, unit: "seconds" }, example: false, readingSeconds: 30, clipPerItem: true, pace: { min: 170, max: 195 }, pauses: { before: 2, after: 16 }, source: U },
    },
    {
      skill: "hoeren", teil: 2, answer: "rf", itemsReal: 10, itemsPerBlock: 10,
      textTypes: ["Radiointerview: Moderation und ein Gast"],
      length: { min: 160, max: 210, unit: "seconds" }, voices: { min: 2, max: 2 }, plays: 2,
      instruction: "Sie hören ein Interview im Radio. Sind die Aussagen richtig oder falsch? Sie hören das Interview zweimal.",
      todo: "TODO(hannes): not in the taster: a ~3-minute interview played twice takes 6 minutes alone.",
      full: { items: 10, first: 46, blocks: 1, itemsPerBlock: 10, length: { min: 140, max: 175, unit: "seconds" }, example: false, readingSeconds: 60, pace: { min: 170, max: 195 }, pauses: { before: 0, after: 60 }, source: U },
    },
    {
      skill: "hoeren", teil: 3, answer: "rf", itemsReal: 5, itemsPerBlock: 1,
      textTypes: ["Nachricht auf dem Anrufbeantworter", "Durchsage im Zug", "Wetterbericht im Radio", "Ansage zum Kinoprogramm", "Durchsage im Geschäft"],
      length: { min: 20, max: 40, unit: "seconds" }, voices: { min: 1, max: 1 }, plays: 2,
      instruction: "Sie hören fünf kurze Texte. Ist die Aussage richtig oder falsch? Sie hören jeden Text zweimal.",
      hint: "Ein Monolog, 45–95 Wörter, B1. Die Aussage prüft ein konkretes Detail (Zeit, Ort, Zahl, Bedingung).",
      full: { items: 5, first: 56, blocks: 5, itemsPerBlock: 1, length: { min: 16, max: 36, unit: "seconds" }, example: false, readingSeconds: 5, pace: { min: 165, max: 195 }, pauses: { before: 5, after: 6 }, sound: "Anrufbeantworter: Piepton; Radio: Jingle; Zug: Signalton; Kaufhaus: Gong", source: U },
    },
  ],
  // What the generator drafts; research/telc-b1.md §6 has the longer 10-item proposal for a full mock.
  kurztest: {
    lesen: [
      { teil: 1, blocks: 1, items: 2 },
      { teil: 3, blocks: 1, items: 2 },
      { teil: 4, blocks: 1, items: 2 },
    ],
    hoeren: [
      { teil: 1, blocks: 1, items: 3 },
      { teil: 3, blocks: 2, items: 1 },
    ],
  },
  // research/telc-b1.md §3d–3e, §5. Schreiben: the one email (no choice of tasks). Sprechen: Teil 2 and 3, the
  // pair parts worth 60 of 75 points, each shortened to ~2 minutes; Teil 1 (introductions) is left out.
  open: [
    {
      skill: "schreiben", teil: 1, title: "Antwort auf eine E-Mail", minutes: 5, tasks: 1, points: 4,
      instruction: "Sie haben eine E-Mail bekommen. Antworten Sie. Schreiben Sie zu allen vier Punkten, in einer Reihenfolge, die Ihnen passt. Denken Sie an Betreff, Anrede, Einleitung und Schluss.",
      hint: `situation: zuerst ein Satz in Sie-Form, wer geschrieben hat (z. B. "Ihre Freundin Lena hat Ihnen geschrieben:"). Dann die erhaltene E-Mail wörtlich in „…“, 60–80 Wörter, als ein Absatz ohne Zeilenumbrüche: Anrede, Neuigkeit oder Anliegen, eine Bitte oder Frage, Gruß. Absender: meist ein Freund, eine Freundin oder eine Bekannte (informell, du); manchmal halbformell (z. B. Vermieterin, Kursleiter, Nachbarin, Sie).
points: genau 4 Leitpunkte, kurz wie im Prüfungsheft (z. B. "Dank für die Einladung", "Warum Sie nicht kommen können", "Vorschlag für ein Treffen", "Frage nach …"). Mindestens ein Punkt verlangt eine Begründung oder eigene Erfahrung, einer einen Vorschlag oder eine Frage.
modelAnswer: 110–150 Wörter auf B1, mit Betreff in der ersten Zeile ("Betreff: …"), Anrede, kurzer Einleitung, allen vier Punkten in eigener Reihenfolge, verbunden mit Konnektoren (weil, deshalb, außerdem, trotzdem), Schluss und Gruß. Nicht jeder Satz beginnt mit "Ich".`,
      todo: "TODO(hannes): no official word count exists; the model answer length (110–150 words) is our choice. The received email is shown inside the situation text, because the kit has no slot for a stimulus email. Real time is 30 minutes, the taster timer 5.",
    },
    {
      skill: "sprechen", teil: 2, title: "Über ein Thema sprechen", minutes: 2,
      instruction: "Sie haben eine Meinung zu einem Thema auf Ihrem Blatt. Ihre Partnerin oder Ihr Partner hat eine andere Meinung. Berichten Sie, was auf Ihrem Blatt steht. Sprechen Sie dann zusammen über das Thema und Ihre Erfahrungen.",
      hint: `telc B1 ist eine Paarprüfung. Thema aus dem Alltag, über das man streiten kann (z. B. Homeoffice, Kinder und Handy, Fleisch essen, Leben in der Stadt oder auf dem Land, Online einkaufen). "du" und der Partner haben verschiedene Blätter mit gegensätzlichen Meinungen.
points: genau 4 Punkte. points[0] ist das Blatt von "du": "Vorname, Alter, Beruf: „Meinung“" mit einer kurzen Meinung (35–50 Wörter, Ich-Form, B1). points[1–3]: "Sag, was auf deinem Blatt steht.", "Sag deine Meinung und begründe sie.", "Erzähl von deinen Erfahrungen." cards: leer.
turns (genau diese Reihenfolge): 1. pruefer: nennt kurz das Thema und bittet zuerst den Partner, von seinem Blatt zu berichten. 2. partner: berichtet in 2–3 Sätzen die Gegenmeinung von seinem Blatt (mit Name und Beruf der Person dort). 3. pruefer: bittet "du", von seinem Blatt zu berichten. 4. du: Hinweis "Berichte, was auf deinem Blatt steht." 5. pruefer: "Und wie sehen Sie das?" oder ähnlich, an beide. 6. partner: sagt die eigene Meinung mit einem Beispiel aus dem eigenen Leben und fragt "du" nach der Meinung. 7. du: Hinweis "Sag deine Meinung und erzähl von deiner Erfahrung." 8. partner: reagiert auf "du" (stimmt teilweise zu oder widerspricht höflich) und stellt eine Nachfrage. 9. du: Hinweis "Antworte auf die Frage." 10. pruefer: kurzer Dank, Ende von Teil 2. Die Prüferin spricht so wenig wie möglich.`,
      todo: "TODO(hannes): the real Teil 2 takes ~6 minutes after 20 minutes of preparation; the taster shortens it to ~2 minutes with no preparation time. Teil 1 (getting to know each other) is left out.",
    },
    {
      skill: "sprechen", teil: 3, title: "Gemeinsam etwas planen", minutes: 2,
      instruction: "Planen Sie zusammen mit Ihrer Partnerin oder Ihrem Partner. Machen Sie Vorschläge, reagieren Sie auf die Vorschläge und einigen Sie sich auf einen Plan.",
      hint: `telc B1 ist eine Paarprüfung. Situation: beide planen zusammen etwas (z. B. ein Abschiedsfest für eine Kollegin, einen Ausflug mit dem Deutschkurs, ein Geschenk für eine Nachbarin, einen Besuch bei einem kranken Freund).
points: genau 5 Stichpunkte wie auf dem Aufgabenblatt, der letzte ist "…" (z. B. "Wann?", "Wo?", "Essen und Trinken?", "Wer bezahlt?", "…"). cards: leer.
turns (genau diese Reihenfolge): 1. pruefer: stellt die Situation in 1–2 Sätzen vor und bittet "du", mit einem Vorschlag zu beginnen. 2. du: Hinweis "Mach einen ersten Vorschlag." 3. partner: reagiert auf den Vorschlag (stimmt zu oder hat Bedenken, mit Grund) und macht selbst einen Vorschlag zu einem anderen Punkt. 4. du: Hinweis "Reagiere auf den Vorschlag von <Partnername>." 5. partner: fragt, wer was übernimmt, und schlägt eine Aufteilung vor. 6. du: Hinweis "Sag, was du übernimmst, und einigt euch." 7. partner: fasst den gemeinsamen Plan in 1–2 Sätzen zusammen. 8. pruefer: beendet die Prüfung freundlich. Die Prüferin spricht so wenig wie möglich.`,
      todo: "TODO(hannes): the real Teil 3 takes ~6 minutes; the taster shortens it to ~2 minutes.",
    },
  ],
  // research/telc-b1.md §4: three criteria, each A/B/C/D = 5/3/1/0, the sum ×3 = 45. Here each line carries the ×3.
  rubric: {
    schreiben: [
      { name: "Aufgabenbewältigung: Leitpunkte behandelt (4 → 15, 3 → 9, 2 → 3, sonst 0)", max: 15, steps: [1, 0.6, 0.2, 0] },
      { name: "Kommunikative Gestaltung: Aufbau, Satzverbindungen, Register", max: 15, steps: [1, 0.6, 0.2, 0] },
      { name: "Formale Richtigkeit: Wortschatz, Grammatik, Rechtschreibung", max: 15, steps: [1, 0.6, 0.2, 0] },
    ],
  },
  taster: {
    lesen: [{ teil: 1, blocks: 1 }, { teil: 3, blocks: 1 }, { teil: 4, blocks: 1 }],
    hoeren: [{ teil: 1, blocks: 1 }, { teil: 3, blocks: 2 }],
    sprechen: [2, 3],
    minutes: { lesen: 5, hoeren: 4, schreiben: 5, sprechen: 4 },
  },
}
