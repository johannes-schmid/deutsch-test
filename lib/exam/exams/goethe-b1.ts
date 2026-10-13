// Goethe-Zertifikat B1: free-test specs from research/goethe-oesd-b1.md (checked 2026-10-12).
// Same format as the ÖSD Zertifikat B1 (joint exam); this set is set in Germany with German voices.
// Instructions are our own wording of what the real task asks; never the official text.
// Every Teil before the last drafted one is listed with its real itemsReal, so item numbers match the real exam.

import type { ExamSpec } from "../exam-blueprints"

export const spec: ExamSpec = {
  context: { name: "Goethe-Zertifikat B1", level: "B1", setting: "Alltag, Arbeit und Ausbildung in Deutschland", copyright: "Goethe-Institut, ÖSD" },
  parts: [
    {
      skill: "lesen", teil: 1, answer: "rf", itemsReal: 6, itemsPerBlock: 6,
      textTypes: ["Persönliche E-Mail an eine Freundin oder einen Freund", "Blogbeitrag über ein Erlebnis"],
      length: { min: 290, max: 360, unit: "words" },
      instruction: "Lesen Sie den Text. Sind die Aussagen richtig oder falsch?",
      hint: "Ein persönlicher Text über das eigene Leben, mit Gefühlen und Erlebnissen. Die Aussagen in der Reihenfolge des Textes.",
      todo: "TODO(hannes): not in the taster (a ~330-word text doesn't fit 5 minutes); listed for item numbering and the full mock.",
    },
    {
      skill: "lesen", teil: 2, answer: "abc", itemsReal: 6, itemsPerBlock: 3,
      textTypes: ["Zeitungsartikel aus dem Lokalteil", "Bericht in einer Zeitschrift"],
      length: { min: 220, max: 280, unit: "words" },
      instruction: "Lesen Sie den Text und die Aufgaben. Wählen Sie für jede Aufgabe die richtige Lösung: a, b oder c.",
      todo: "TODO(hannes): not in the taster; listed for item numbering and the full mock (two texts × 3 items).",
    },
    {
      skill: "lesen", teil: 3, answer: "match", itemsReal: 7, itemsPerBlock: 7, sample: 3, ads: 5, noMatch: true,
      textTypes: ["Anzeigen zu Freizeit- und Kursangeboten", "Anzeigen zu Nebenjobs und Ehrenamt", "Anzeigen zu Reisen und Ausflügen"],
      length: { min: 120, max: 210, unit: "words" },
      instruction: "Lesen Sie die Situationen und die Anzeigen. Welche Anzeige passt zu welcher Person? Jede Anzeige passt nur einmal. Für eine Person gibt es keine passende Anzeige. Dann wählen Sie x.",
      hint: `Alle Anzeigen zu einem Thema, aus verschiedenen Medien (Zeitung, Internet, Aushang), je 25–40 Wörter mit Titel, mit konkreten Details (Tag, Uhrzeit, Ort, Preis, Zielgruppe, Bedingung). Die Situationen nennen eine Person mit Vornamen und was sie sucht, je ein Satz (z. B. "Jonas sucht …", "Meral möchte …"). Die fast passende Anzeige scheitert an einem Detail (anderer Tag, andere Zielgruppe, zu weit weg, Bedingung nicht erfüllt).`,
      todo: `TODO(hannes): the real Teil 3 has 10 ads for 7 situations and marks "no match" with 0; the kit shows x. The taster uses 5 ads for 3 situations, one without a match.`,
    },
    {
      skill: "lesen", teil: 4, answer: "rf", itemsReal: 7, itemsPerBlock: 7,
      textTypes: ["Leserbriefe zu einer Streitfrage", "Kommentare in einem Forum zu einer Streitfrage"],
      length: { min: 50, max: 70, unit: "words" },
      instruction: "Lesen Sie die Kommentare. Ist die Person für den Vorschlag? Ja oder Nein?",
      todo: "TODO(hannes): the real answer is Ja/Nein, which the kit can't render. Listed for item numbering only; not drafted.",
    },
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
      instruction: "Sie hören einen kurzen Text. Zu jedem Text gibt es zwei Aufgaben. Ist die Aussage richtig oder falsch? Und welche Antwort passt: a, b oder c? Sie hören jeden Text zweimal.",
      hint: "Eine Person spricht, 70–100 Wörter, B1. Die R/F-Aussage prüft, worum es geht; die a/b/c-Frage ein Detail.",
      todo: "TODO(hannes): clip seconds are estimated from word counts (research §3.2); time the official audio.",
    },
    {
      skill: "hoeren", teil: 2, answer: "abc", itemsReal: 5, itemsPerBlock: 5, sample: 1,
      textTypes: ["Begrüßung bei einer Führung (Museum, Betrieb, Stadtführung)", "Informationen für neue Teilnehmende (Kurs, Ehrenamt, Ferienjob)"],
      length: { min: 45, max: 75, unit: "seconds" }, voices: { min: 1, max: 1 }, plays: 1,
      instruction: "Sie hören einen Vortrag vor Publikum. Wählen Sie für jede Aufgabe die richtige Lösung: a, b oder c. Sie hören den Text einmal.",
      hint: `Eine Person (z. B. Leiterin einer Führung, Organisator) spricht vor einer Gruppe: Begrüßung, Ablauf, Regeln und praktische Hinweise, mit mehreren Details (Uhrzeiten, Orte, was man mitbringen oder beachten muss). situation: wer spricht wo (z. B. "Führung im Stadtmuseum"). Die Frage prüft ein Detail, die zwei falschen Optionen kommen im Text auch vor.`,
      todo: "TODO(hannes): shortened clip (~140 words, ~50 s) for the 5-minute taster; the real Teil 2 monologue is ~420 words (~3 min) with 5 items. Needs an on-page note if kept (research §6.2 option b).",
    },
    {
      skill: "hoeren", teil: 3, answer: "rf", itemsReal: 7, itemsPerBlock: 7, sample: 2,
      textTypes: ["Gespräch zwischen Bekannten in der Straßenbahn", "Gespräch zwischen Nachbarn im Café", "Gespräch zwischen Kollegen in der Mittagspause"],
      length: { min: 50, max: 80, unit: "seconds" }, voices: { min: 2, max: 2 }, plays: 1,
      instruction: "Sie hören ein Gespräch. Sind die Aussagen richtig oder falsch? Sie hören den Text einmal.",
      hint: `Zwei Personen (eine Frau, ein Mann, mit Vornamen, sagen du zueinander) unterhalten sich an einem öffentlichen Ort über ihren Alltag: Pläne, Erlebnisse, ein Problem. Natürlich gesprochen, mit Füllwörtern und Nachfragen, abwechselnd, 6–10 Beiträge. role: der Vorname. Die Aussagen in der Reihenfolge des Gesprächs, beide über eine der zwei Personen (z. B. "Lena hat …").`,
      todo: "TODO(hannes): shortened clip (~150 words, ~55 s) for the 5-minute taster; the real Teil 3 dialogue is ~480 words (~3.5 min) with 7 items.",
    },
  ],
  kurztest: {
    lesen: [
      { teil: 3, blocks: 1, items: 3 },
      { teil: 5, blocks: 1, items: 2 },
    ],
    hoeren: [
      { teil: 1, blocks: 1, items: 2 },
      { teil: 2, blocks: 1, items: 1 },
      { teil: 3, blocks: 1, items: 2 },
    ],
  },
  // research/goethe-oesd-b1.md §3.3–3.4, §5. Schreiben: Aufgabe 3 (ca. 40 words, the only one that fits a 5-minute
  // timer). Sprechen: Teil 1 "Gemeinsam etwas planen", the pair task.
  open: [
    {
      skill: "schreiben", teil: 3, title: "Kurze formelle E-Mail", minutes: 5, tasks: 1, points: 2,
      instruction: "Schreiben Sie eine kurze E-Mail, etwa 40 Wörter. Schreiben Sie zu beiden Punkten. Vergessen Sie Anrede und Gruß nicht.",
      hint: `situation: 2 Sätze in Sie-Form, wie im Prüfungsheft. Eine Person, die man nur formell kennt und mit Nachnamen anspricht (Kursleiterin, Lehrer, Trainerin im Verein, Vorgesetzte), hat Sie eingeladen oder um etwas gebeten (z. B. Abschlussessen des Kurses, Elternabend, Teamtreffen, Vereinsfest). Sie können nicht. Nennen Sie die Person mit Namen (z. B. "Frau Albers").
points: genau 2: "Entschuldigen Sie sich höflich." und ein zweiter Punkt passend zur Situation (z. B. "Erklären Sie, warum Sie nicht kommen können." oder "Bitten Sie um einen neuen Termin.").
register: formell.
modelAnswer: etwa 40–50 Wörter, mit formeller Anrede ("Sehr geehrte Frau …,"), beiden Punkten und Gruß ("Mit freundlichen Grüßen"). Natürliches B1-Deutsch.`,
      todo: "TODO(hannes): the taster uses Aufgabe 3 (real: 15 min, ca. 40 words, 20 of 100 points). Aufgabe 1 (informal email, ca. 80 words, 20 min) is the research's pick (§6.3) but can't be done in 5 minutes. The real Aufgabe 3 states its two functions in one sentence; here they are two ticks.",
    },
    {
      skill: "sprechen", teil: 1, title: "Gemeinsam etwas planen", minutes: 3,
      instruction: "Planen Sie gemeinsam mit Ihrer Partnerin oder Ihrem Partner. Machen Sie Vorschläge, reagieren Sie auf die Vorschläge und entscheiden Sie zusammen.",
      hint: `Goethe-Zertifikat B1 ist eine Paarprüfung; hier üben "du" und eine Partnerin oder ein Partner mit einer Prüferin oder einem Prüfer. Die Prüferin moderiert nur, die zwei sprechen miteinander.
Szenario: etwas für eine dritte Person oder eine Gruppe planen (z. B. eine Kollegin hat bald Abschied, eine Freundin liegt im Krankenhaus, ein Ausflug mit dem Deutschkurs, ein Nachbarschaftsfest). points: genau 4 Leitpunkte als kurze Fragen (z. B. "Wann treffen?", "Was mitbringen?", "Wie hinkommen?", "Wer macht was?"). cards: leer.
turns: 1. pruefer: nennt die Aufgabe in 1–2 Sätzen und bittet die beiden anzufangen. 2. partner: begrüßt kurz, macht einen konkreten Vorschlag zu Leitpunkt 1 mit Grund und fragt "du" nach der Meinung. 3. du: Hinweis "Reagiere auf <Name>s Vorschlag und mach einen Vorschlag zu <Leitpunkt 2>." 4. partner: stimmt zu oder widerspricht höflich mit Grund, macht einen Gegenvorschlag und bringt Leitpunkt 3 ein. Der Beitrag passt zu jeder vernünftigen Antwort von "du" (keine Details aus der Antwort wiederholen). 5. du: Hinweis "Reagiere und sag etwas zu <Leitpunkt 3> und <Leitpunkt 4>." 6. partner: reagiert kurz, fasst den Plan zusammen und fragt, ob noch etwas fehlt. 7. du: Hinweis "Ergänze etwas oder stimm zu. Entscheidet zusammen." 8. pruefer: beendet den Teil kurz und dankt.
Der Partner spricht natürlich, 2–4 Sätze pro Beitrag (B1). sampleAnswer bei "du": 2–4 Sätze, B1, mit Reaktion und eigenem Vorschlag mit Grund.`,
      todo: "TODO(hannes): no 15-minute preparation in the taster; the partner's turns are scripted and can't react to what the candidate says. du between candidates is inferred (research §5).",
    },
  ],
  // research §4: Aufgabe 3 = Erfüllung 4, Kohärenz 4, Wortschatz 6, Strukturen 6, each A–E (1 / 0.75 / 0.5 / 0.25 / 0).
  // TODO(hannes): the official "Erfüllung E → whole Aufgabe 0" and "< 50% of the word count → E" rules aren't applied by the grader.
  rubric: {
    schreiben: [
      { name: "Erfüllung", max: 4, steps: [1, 0.75, 0.5, 0.25, 0] },
      { name: "Kohärenz", max: 4, steps: [1, 0.75, 0.5, 0.25, 0] },
      { name: "Wortschatz", max: 6, steps: [1, 0.75, 0.5, 0.25, 0] },
      { name: "Strukturen", max: 6, steps: [1, 0.75, 0.5, 0.25, 0] },
    ],
  },
  taster: {
    lesen: [{ teil: 3, blocks: 1 }, { teil: 5, blocks: 1 }],
    hoeren: [{ teil: 1, blocks: 1 }, { teil: 2, blocks: 1 }, { teil: 3, blocks: 1 }],
    sprechen: [1],
    minutes: { lesen: 5, hoeren: 4, schreiben: 5, sprechen: 4 },
  },
}
