// ÖSD Zertifikat A1: free-test specs from research/oesd-a1.md (checked 2026-10-12).
// Instructions are our own wording of what the real task asks; never the official text.
// Speakers come from Austria, Germany and Switzerland (research §2, Hannes 2026-10-13): `accents` per Teil.

import type { ExamSpec } from "../exam-blueprints"

const U = "research/oesd-a1.md §9 (Modellsatz 2026 = Broschüre 2024, transcript + audio measured, verified 2026-10-24)"

export const spec: ExamSpec = {
  context: { name: "ÖSD Zertifikat A1", level: "A1", setting: "Alltag in Österreich, Deutschland und der Schweiz; Texte aus allen drei Ländern (Preise in Euro oder Franken, Orte aus allen drei Ländern). Standardsprache, regionale Wörter nur, wenn sie aus dem Zusammenhang klar sind", copyright: "ÖSD" },
  parts: [
    {
      // Real: 5 situations, 6 ads (~170 words). Taster cut: 3 situations, 4 ads, still one ad extra.
      skill: "lesen", teil: 1, answer: "match", ads: 4, noMatch: false, itemsReal: 5, itemsPerBlock: 5,
      // Ads 1–6, one extra; ~160 words of ads in the MS (20–30 each). Length = all six ads together.
      full: { items: 5, first: 1, blocks: 1, itemsPerBlock: 5, length: { min: 120, max: 200, unit: "words" }, example: false, options: 6, source: U },
      textTypes: ["Zeitungsanzeigen (Arbeit, Dienstleistungen, Geschäfte, Freizeit, Handytarife)"],
      length: { min: 80, max: 150, unit: "words" },
      instruction: "Sie suchen etwas in der Zeitung. Welche Anzeige passt zu welcher Situation? Achtung: Eine Anzeige passt nicht.",
      hint: "4 Anzeigen, je 20–35 Wörter, mit Titel. 3 Situationen (\"Sie brauchen …\", \"Sie möchten …\"), ein Satz, sehr einfach (A1). Jede Anzeige passt höchstens einmal, eine Anzeige bleibt übrig. Die übrige Anzeige passt fast zu einer Situation (anderer Tag, mieten statt reparieren).",
    },
    {
      skill: "lesen", teil: 2, answer: "rf", itemsReal: 6, itemsPerBlock: 2,
      full: { items: 6, first: 6, blocks: 3, itemsPerBlock: 2, length: { min: 26, max: 44, unit: "words" }, example: false, source: U },
      textTypes: ["Anzeige: Angebot in einem Geschäft", "Anzeige: Veranstaltung oder Kurs", "Anzeige: Wohnung oder Zimmer"],
      length: { min: 25, max: 40, unit: "words" },
      instruction: "Sie lesen eine Anzeige. Sind die Aussagen richtig oder falsch?",
      hint: `Eine kurze Anzeige oder Information aus Österreich, Deutschland oder der Schweiz (Preise in Euro oder Franken). "sender" ist der Name des Geschäfts, Vereins oder der Person, "source" ist "Anzeige". "paragraphs": Titel in der ersten Zeile, dann 2–3 kurze Zeilen. Genau 2 Aussagen in der Reihenfolge des Textes, eine richtig und eine falsch; die falsche ändert ein Detail (Tag, Preis, Ort, für wen). Sehr einfach (A1).`,
      todo: "TODO(hannes): the real Aufgabe 2 asks JA/NEIN questions (3 ads × 2); the kit renders them as richtig/falsch statements, one ad per block.",
    },
    {
      skill: "lesen", teil: 3, answer: "pic", itemsReal: 5, itemsPerBlock: 1,
      // Notices 1–5 → pictograms 1–6, one extra; length per notice.
      full: { items: 5, first: 12, blocks: 1, itemsPerBlock: 5, length: { min: 14, max: 32, unit: "words" }, example: false, options: 6, source: U },
      textTypes: ["Schild im Park", "Aushang im Krankenhaus oder in der Arztpraxis", "Schild in einem Amt", "Schild im Restaurant", "Aushang an der Haltestelle oder im Bahnhof"],
      length: { min: 12, max: 30, unit: "words" },
      instruction: "Sie lesen einen kurzen Text. Welches Bild passt? Wählen Sie a, b oder c.",
      hint: `Ein Schild oder Aushang an einem öffentlichen Ort. "sender" sagt, wo der Text hängt, aber ohne die Lösung zu verraten (z. B. "Ein Schild", "Ein Aushang"), "source" ist "Schild" oder "Aushang". "paragraphs": der Text in 1–3 kurzen Zeilen, 12–30 Wörter. Die Frage ist immer "Wo lesen Sie diesen Text?". Die Optionen sind Orte (kurze Beschriftung wie "Im Park", "Im Krankenhaus"); der Text nennt den Ort nicht direkt, aber Wörter im Text zeigen ihn (z. B. Hunde, Wiese → Park). Die zwei falschen Orte passen zu einem Wort im Text fast.`,
      todo: "TODO(hannes): the real Aufgabe 3 matches 5 notices to 6 photos (one extra); the taster shows one notice with 3 pictogram options (lib/exam/pictos.ts) until a picture-matching component and photos exist.",
    },
    {
      skill: "hoeren", teil: 1, answer: "pic", itemsReal: 5, itemsPerBlock: 1,
      // One photo grid A–F over five dialogues (33–45 words, 14–17 s, mean ~154 wpm), once, 30 s to look first.
      full: { items: 5, first: 1, blocks: 1, itemsPerBlock: 5, length: { min: 14, max: 17, unit: "seconds" }, example: false, readingSeconds: 30, options: 6, clips: 5, pace: { min: 140, max: 160 }, sound: "Gong zwischen den Schritten; vor jedem Text ein Geräusch (2–4 s)", source: U },
      textTypes: ["Gespräch im Urlaub", "Gespräch auf der Reise (Bahnhof, Flughafen, Hotel)", "Gespräch beim Einkaufen", "Gespräch im Restaurant oder Café", "Gespräch zu Hause oder bei Freunden"],
      length: { min: 14, max: 24, unit: "seconds" }, voices: { min: 2, max: 2 }, plays: 1,
      accents: ["at", "de"],
      instruction: "Sie hören ein kurzes Gespräch. Welches Bild passt zum Gespräch? Wählen Sie a, b oder c. Sie hören den Text einmal.",
      hint: `Zwei Personen, ein kurzes Alltagsgespräch mit 4–6 Beiträgen, 33–45 Wörter zusammen, langsam und sehr einfach (A1). Der Ort wird nicht direkt genannt; man hört ihn an Wörtern (z. B. Zimmer, Schlüssel, Frühstück → Hotel). Die Frage ist immer "Welches Bild passt zum Gespräch?". Die Optionen sind Orte oder Situationen als sehr kurze Beschriftung (z. B. "Im Hotel", "Am Bahnhof", "Im Geschäft") mit Piktogramm; die zwei falschen passen zu einem Wort im Gespräch fast.`,
      todo: "TODO(hannes): the real Aufgabe 1 matches 5 dialogues to 6 photos (one extra); the taster shows one dialogue with 3 pictogram options until a picture-matching component and photos exist.",
    },
    {
      skill: "hoeren", teil: 2, answer: "abc", itemsReal: 5, itemsPerBlock: 5, sample: 2,
      // Voicemail ~96 words at ~112 wpm, twice; "Was:" printed as the Beispiel; 30 s to read, 20 s to check.
      full: { items: 5, first: 6, blocks: 1, itemsPerBlock: 5, length: { min: 49, max: 53, unit: "seconds" }, example: true, readingSeconds: 30, pace: { min: 112, max: 118 }, sound: "Piepton vor und nach der Nachricht", source: U },
      textTypes: ["Nachricht auf der Sprachbox (privat)", "Ansage einer Arztpraxis, eines Kurses oder einer Firma am Telefon"],
      length: { min: 40, max: 58, unit: "seconds" }, voices: { min: 1, max: 1 }, plays: 2,
      accents: ["ch"],
      instruction: "Sie hören eine Nachricht am Telefon. Lesen Sie zuerst die Fragen. Wählen Sie die richtige Antwort: a, b oder c. Sie hören den Text zweimal.",
      hint: `Eine Person spricht eine Nachricht auf die Sprachbox oder eine Ansage, 95–100 Wörter, langsam und deutlich (A1). Mit Begrüßung, Name, Grund und mehreren Details: Tag oder Datum, Uhrzeit, Straße mit Hausnummer, Telefonnummer (Ziffern einzeln oder in Paaren gesprochen), eventuell ein buchstabierter Name. Die 2 Fragen fragen nach zwei dieser Details (z. B. "Wann ist der Termin?", "Wie ist die Telefonnummer?"). Optionen sehr kurz (1–4 Wörter oder eine Zahl); die falschen kommen im Text auch vor oder sind fast gleich (anderer Tag, Zahlendreher, alte Uhrzeit).`,
      todo: "TODO(hannes): the real Aufgabe 2 is a note sheet with 5 gaps (write the detail). The kit has no listening gap-fill, so the taster asks 2 a/b/c questions about the same kind of details.",
    },
    {
      skill: "hoeren", teil: 3, answer: "abc", options: 4, itemsReal: 5, itemsPerBlock: 5, sample: 3,
      // Interviewer asks once, then "Text eins" … five answers (39–54 words, 15–20 s); 10 s to read, 60 s to check.
      full: { items: 5, first: 11, blocks: 1, itemsPerBlock: 5, length: { min: 15, max: 20, unit: "seconds" }, example: false, readingSeconds: 10, options: 4, clips: 5, pace: { min: 150, max: 165 }, sound: "leichte Straßengeräusche", source: U },
      textTypes: ["Kurzinterviews auf der Straße zu einer Alltagsfrage"],
      length: { min: 45, max: 80, unit: "seconds" }, voices: { min: 4, max: 4 }, plays: 1,
      accents: ["de", "at", "de", "ch"],
      instruction: "Sie hören Kurzinterviews. Eine Reporterin fragt Personen auf der Straße. Was sagt jede Person? Wählen Sie für jede Person eine Antwort. Sie hören die Interviews einmal.",
      hint: `Zuerst stellt die Reporterin (Sprecherin "reporter") die Frage, einmal, kurz. Dann antworten 3 Personen nacheinander, spontan gesprochen, je 40–55 Wörter, mit "äh", Wiederholungen, einfachen Sätzen (A1). Jede Person nennt ihren Vornamen. Items: eine Aufgabe pro Person, prompt = "Was sagt <Vorname>?". Alle Aufgaben haben dieselben 4 Optionen in derselben Reihenfolge (wie eine Tabelle mit 4 Spalten); jede Person passt zu genau einer Option, zwei Personen dürfen nicht dieselbe Option haben. Jede Person erwähnt auch eine zweite Möglichkeit, entscheidet sich aber für eine.`,
      todo: "TODO(hannes): the real task is a 5×4 tick grid. Until the grid component exists, each row renders as one 4-option choice.",
    },
  ],
  // What the generator drafts; research/oesd-a1.md §7 has the longer 10-item proposal for a full mock.
  kurztest: {
    lesen: [
      { teil: 1, blocks: 1, items: 3 },
      { teil: 2, blocks: 1, items: 2 },
      { teil: 3, blocks: 1, items: 1 },
    ],
    hoeren: [
      { teil: 1, blocks: 2, items: 1 },
      { teil: 2, blocks: 1, items: 2 },
      { teil: 3, blocks: 1, items: 3 },
    ],
  },
  // research/oesd-a1.md §4–5. Schreiben: only Aufgabe 2 (reply to a friend's email). Sprechen: an individual exam,
  // all three Aufgaben shortened; the examiner leads, asks the follow-up questions and plays the role in Aufgabe 3.
  open: [
    {
      skill: "schreiben", teil: 2, title: "Antwort an eine Freundin", minutes: 5, tasks: 1, points: 3,
      instruction: "Ihre Freundin oder Ihr Freund hat Ihnen eine E-Mail geschrieben. Antworten Sie auf alle drei Fragen. Schreiben Sie etwa 30 Wörter und am Ende einen Gruß.",
      hint: `situation: zuerst ein Satz in Sie-Form ("Ihre Freundin Lena schreibt Ihnen:"), dann ihre E-Mail in Anführungszeichen „…“ in einer Zeile (keine Zeilenumbrüche): Anrede, 3–4 sehr einfache Sätze in du-Form (A1) mit genau drei Fragen, Gruß und Vorname. Themen: Wochenende, Wohnung, Familie, Arbeit, Urlaub, Einladung, Essen. Die Freundin oder der Freund wohnt in Österreich, Deutschland oder der Schweiz.
points: genau die drei Fragen aus der E-Mail, kurz, als Frage (z. B. "Wo wohnst du jetzt?").
register: informell.
modelAnswer: etwa 30–40 Wörter, mit Anrede ("Liebe Lena," / "Hallo Lena,"), kurzem Bezug auf ihre E-Mail, je 1–2 einfachen Sätzen zu allen drei Fragen, einfachen Verbindungen wie "und" oder "dann", und Gruß mit Vorname. Niveau A1.`,
      todo: "TODO(hannes): Aufgabe 1 (form with 10 items) is left out of the taster; add it with a form component for the full mock. The input email renders inside the situation paragraph, not as its own email.",
    },
    {
      skill: "sprechen", teil: 1, title: "Sich vorstellen", minutes: 2, partner: false, accents: ["at", "de"],
      instruction: "Stellen Sie sich vor. Wählen Sie vier von sechs Themen und sagen Sie zu jedem ein paar Sätze. Danach stellt die Prüferin oder der Prüfer eine Frage.",
      hint: `ÖSD A1 ist eine Einzelprüfung: nur "du" und die Prüferin oder der Prüfer. Der Partner spricht in keinem Teil.
points: genau 6 Themen-Stichwörter wie auf einer Themenkarte, z. B. Beruf, Sprachen, Familie, Hobbys, Sport, Lieblingsessen. cards: leer.
turns: 1. pruefer: kurze Begrüßung (Sie-Form) und Aufgabe: vier von sechs Themen wählen, zu jedem ein paar Sätze. 2. du: Hinweis "Wähl vier Themen und sag zu jedem zwei oder drei Sätze." 3. pruefer: eine einfache persönliche Nachfrage, die zu jeder Person passt (z. B. "Was machen Sie gern am Wochenende?"). 4. du: Hinweis "Antworte auf die Frage." 5. pruefer: kurzer Dank.
sampleAnswer zu Turn 2: vier Themen, je 2 einfache Sätze (A1), etwa 50–60 Wörter.`,
      todo: "TODO(hannes): the real exam has two examiners (Assessor explains, Interlokutor asks) and 10 minutes of preparation; the taster uses one examiner voice and no preparation step.",
    },
    {
      skill: "sprechen", teil: 2, title: "Ein Foto beschreiben", minutes: 1, partner: false, accents: ["at", "de"],
      instruction: "Beschreiben Sie das Foto: Was sehen Sie? Wie viele Personen sind da? Wo sind sie? Was machen sie? Danach stellt die Prüferin oder der Prüfer eine Frage.",
      hint: `ÖSD A1 ist eine Einzelprüfung: nur "du" und die Prüferin oder der Prüfer. Der Partner spricht in keinem Teil.
Das Foto zeigt immer diese Situation: In einer Bäckerei. Eine Verkäuferin steht hinter der Theke mit Brot, Semmeln und Kuchen. Ein Mann kauft Brot und zahlt mit Karte. Hinter ihm wartet eine Frau mit einem Kind.
cards: genau 1 Karte: label = "Foto: In der Bäckerei – Verkäuferin, Mann kauft Brot, Frau mit Kind wartet", picto = "croissant".
points: genau die vier Fragen "Was sehen Sie?", "Wie viele Personen?", "Wo sind sie?", "Was machen sie?".
pictureBrief: Pflicht, 2–3 Sätze, genau diese Situation (für eine Illustration).
turns: 1. pruefer: erklärt kurz: das Foto beschreiben, die vier Fragen helfen. 2. du: Hinweis "Beschreib das Foto. Die vier Fragen helfen." 3. pruefer: eine einfache Frage zum Foto, die man mit dem Foto beantworten kann (z. B. "Was kauft der Mann?"). 4. du: Hinweis "Antworte auf die Frage." 5. pruefer: kurzer Dank.
sampleAnswer zu Turn 2: 4–5 einfache Sätze (A1), die alle vier Fragen beantworten.`,
      todo: "TODO(hannes): the real candidate picks 1 of 3 photos; the taster gives one fixed situation as a pictogram card + pictureBrief until photos exist.",
    },
    {
      skill: "sprechen", teil: 3, title: "Rollenspiel zum Foto", minutes: 1, partner: false, accents: ["at", "de"],
      instruction: "Spielen Sie die Situation vom Foto. Sie sind Kundin oder Kunde in der Bäckerei. Die Prüferin oder der Prüfer verkauft.",
      hint: `ÖSD A1 ist eine Einzelprüfung: nur "du" und die Prüferin oder der Prüfer. Der Partner spricht in keinem Teil.
Dieselbe Situation wie beim Foto in Teil 2: in der Bäckerei. "du" ist Kundin oder Kunde, die Prüferin spielt die Verkäuferin (der Prüfer: den Verkäufer) und sagt Sie. Standardsprache; "Semmel" nur mit "Brötchen" erklärt oder gar nicht.
cards: genau 1 Karte: label = "Rollenspiel: Du kaufst in der Bäckerei ein", picto = "croissant".
points: genau 4 kurze Stichwörter: "Grüßen", "Etwas bestellen", "Nach dem Preis fragen", "Bezahlen und verabschieden".
turns: 1. pruefer: ein Satz Erklärung, dann in der Rolle: "Guten Tag! Was darf es sein?" (oder ähnlich). 2. du: Hinweis "Grüß und bestell etwas." 3. pruefer: reagiert so, dass es zu jeder Bestellung passt, und fragt "Möchten Sie noch etwas?" (oder ähnlich). 4. du: Hinweis "Antworte und frag nach dem Preis." 5. pruefer: nennt einen Preis in Euro, ausgeschrieben wie gesprochen. 6. du: Hinweis "Bezahl und verabschiede dich." 7. pruefer: kurzer Dank und Gruß in der Rolle.`,
    },
  ],
  // Schreiben Aufgabe 2 (Auswertungsbogen Vers. 6.0, research §4). The official sheet deducts for content (−1 per missing
  // question, max −2) and length (−1 per 5 words under 25, max −2) from 10 points; the rubric only adds, so both
  // are positive 2-point lines here (max 14 instead of 10).
  // TODO(hannes): a deduction line type in RubricLine would keep the official 10-point scale.
  rubric: {
    schreiben: [
      { name: "Aufgabe: alle drei Fragen beantwortet", max: 2, steps: [1, 0.5, 0] },
      { name: "Textlänge: mindestens 25 Wörter", max: 2, steps: [1, 0.5, 0] },
      { name: "Kommunikative Angemessenheit (Anrede, Bezug auf die E-Mail, Gruß)", max: 1, steps: [1, 0] },
      { name: "Textaufbau (einfache Verbindungen wie und, dann)", max: 1, steps: [1, 0] },
      { name: "Wortschatz", max: 4, steps: [1, 0.75, 0.5, 0.25, 0] },
      { name: "Formale Richtigkeit", max: 4, steps: [1, 0.75, 0.5, 0.25, 0] },
    ],
  },
  taster: {
    lesen: [{ teil: 1, blocks: 1 }, { teil: 2, blocks: 1 }, { teil: 3, blocks: 1 }],
    hoeren: [{ teil: 1, blocks: 1 }, { teil: 2, blocks: 1 }, { teil: 3, blocks: 1 }],
    sprechen: [1, 2, 3],
    minutes: { lesen: 5, hoeren: 4, schreiben: 5, sprechen: 4 },
  },
}
