// ÖSD Zertifikat B1: free-test specs from research/goethe-oesd-b1.md (checked 2026-10-12).
// Same format as the Goethe-Zertifikat B1 (joint exam); this set uses Austrian and Swiss settings and voices (ÖSD's audio has D, A and CH speakers).
// The Goethe set takes other Teile where it makes sense, so the two tests don't share texts or feel identical.
// Instructions are our own wording of what the real task asks; never the official text.

import type { ExamSpec } from "../exam-blueprints"
import type { PartSpec } from "../blueprint"
import { spec as goethe, withFull } from "./goethe-b1"

const SHORT_CLIP = "TODO(hannes): shortened clip (research §6.2 option b) so Hören stays a ~4-minute taster; the page says the clips are shorter than in the exam."

/** The Modelltests are the Goethe sets with Austrian voices (Hannes, 2026-10-24), so every Teil ÖSD has no taster spec for comes from Goethe. */
const sameAsGoethe = (own: PartSpec[]) => [...own, ...goethe.parts.filter((g) => !own.some((o) => o.skill === g.skill && o.teil === g.teil))]

export const spec: ExamSpec = {
  context: { name: "ÖSD Zertifikat B1", level: "B1", setting: "Alltag, Arbeit und Ausbildung in Österreich, Deutschland und der Schweiz; viele Texte aus Österreich (Preise in Euro oder Franken). Standardsprache, regionale Wörter nur, wenn sie aus dem Zusammenhang klar sind", copyright: "ÖSD, Goethe-Institut" },
  parts: withFull(sameAsGoethe([
    {
      skill: "lesen", teil: 1, answer: "rf", itemsReal: 6, itemsPerBlock: 6,
      textTypes: ["Persönliche E-Mail an eine Freundin oder einen Freund", "Blogeintrag über ein Erlebnis"],
      length: { min: 200, max: 260, unit: "words" },
      instruction: "Lesen Sie den Text. Sind die Aussagen richtig oder falsch?",
      hint: `Ein persönlicher Text in der Ich-Form über etwas, das die Person erlebt hat (z. B. Umzug, neue Arbeit, Reise, Fest, Kurs), mit Gefühlen und Meinungen, B1. Die Person lebt in Österreich (z. B. Innsbruck, Salzburg, Graz). E-Mail: Anrede und Gruß als eigene Zeilen in "paragraphs"; Blog: Titel in der ersten Zeile. "sender" ist der Vorname (bei einem Blog der Name des Blogs), "source" ist "E-Mail" oder "Blog". Die Aussagen sprechen über die Person in der 3. Person (z. B. "Lena hat …"), in der Reihenfolge des Textes; eine falsche Aussage nennt ein Detail, das im Text anders ist.`,
      todo: "TODO(hannes): shortened. The real Teil 1 is one ~330-word text with 6 items; the taster uses ~230 words with 2 items to fit 5 minutes.",
    },
    {
      skill: "lesen", teil: 2, answer: "abc", itemsReal: 6, itemsPerBlock: 3,
      textTypes: ["Zeitungsbericht über ein Projekt in einer Stadt oder Gemeinde", "Bericht aus einer Zeitschrift über Arbeit oder Ausbildung"],
      length: { min: 230, max: 270, unit: "words" },
      instruction: "Lesen Sie den Text und die Aufgaben. Wählen Sie für jede Aufgabe die richtige Lösung: a, b oder c.",
      todo: "TODO(hannes): not drafted for the taster (two ~250-word press texts don't fit 5 minutes). Listed so Teil 3 gets its real item numbers; draft it for the full mock.",
    },
    {
      skill: "lesen", teil: 3, answer: "match", itemsReal: 7, itemsPerBlock: 7, ads: 6, noMatch: true,
      textTypes: ["Anzeigen zu Kursen und Weiterbildung", "Anzeigen zu Freizeitangeboten am Wochenende", "Anzeigen zu Wohnungen und Zimmern"],
      // All 6 ads together, titles included (25–45 words each).
      length: { min: 160, max: 280, unit: "words" },
      instruction: "Lesen Sie die Situationen und die Anzeigen. Welche Anzeige passt zu welcher Person? Jede Anzeige passt nur einmal. Für eine Person gibt es keine passende Anzeige: Dann wählen Sie x.",
      hint: `Alle Anzeigen zu einem Thema, aus verschiedenen Medien (Zeitung, Website, Aushang), je 25–45 Wörter, mit Titel. Orte vor allem in Österreich (z. B. Wien, Linz, Klagenfurt), Preise in Euro. Situationen: je ein Satz über eine bekannte Person mit Vornamen und einem konkreten Wunsch, z. B. "Ihre Nachbarin Sabine möchte abends Italienisch lernen." Jede fast passende Anzeige scheitert an genau einem Detail (Zeit, Ort, Preis, Zielgruppe), das im Text klar steht.`,
      todo: `TODO(hannes): the real Teil 3 has 10 ads for 7 people, and the person without a matching ad is marked "0"; the kit's no-match option is "x". Taster: 6 ads, 3 people, one without a match.`,
    },
    {
      skill: "hoeren", teil: 1, answer: "rf+abc", itemsReal: 10, itemsPerBlock: 2,
      textTypes: ["Nachricht auf der Mailbox (privat oder von einer Hausverwaltung)", "Durchsage am Bahnhof oder bei einer Stadtführung", "Radiowerbung"],
      length: { min: 30, max: 48, unit: "seconds" }, voices: { min: 1, max: 1 }, plays: 2,
      accents: ["at"],
      instruction: "Sie hören einen kurzen Text. Zu jedem Text gibt es zwei Aufgaben. Ist die Aussage richtig oder falsch? Und welche Antwort passt: a, b oder c? Sie hören jeden Text zweimal.",
      hint: "Eine Person spricht, 70–100 Wörter, B1. Die Person kommt aus Österreich: Ort und Details passen dazu (z. B. Graz, Linz, Wien). Die R/F-Aussage prüft, worum es geht; die a/b/c-Frage ein Detail.",
      todo: "TODO(hannes): the taster plays one Teil 1 text (2 of 10 items) to stay near 4 minutes.",
    },
    {
      skill: "hoeren", teil: 2, answer: "abc", itemsReal: 5, itemsPerBlock: 5,
      textTypes: ["Begrüßung und Ablauf vor einer Stadtführung", "Information der Kursleitung am ersten Kurstag", "Einführung vor einem Betriebs- oder Museumsbesuch"],
      length: { min: 55, max: 85, unit: "seconds" }, voices: { min: 1, max: 1 }, plays: 1,
      accents: ["ch"],
      instruction: "Sie hören einen Vortrag. Lesen Sie zuerst die Aufgabe. Wählen Sie dann die richtige Antwort: a, b oder c. Sie hören den Text einmal.",
      hint: `Eine Person spricht vor einer Gruppe (Monolog): Begrüßung, Ablauf, Hinweise, B1, 130–190 Wörter. In der Prüfung ist dieser Text etwa dreimal so lang; hier gekürzt, aber mit derselben Textsorte. Die Person kommt aus der Schweiz, der Ort liegt in der Schweiz (z. B. Luzern, Bern, St. Gallen), Preise in Franken. "situation" nennt den Rahmen, z. B. "Vor einer Stadtführung". Die Frage prüft ein Detail aus der Mitte des Textes; die zwei falschen Optionen kommen im Text auch vor.`,
      todo: `${SHORT_CLIP} Real Teil 2: one ~420-word monologue (~3 min) with 5 items; taster: ~70 s with 1 item.`,
    },
    {
      skill: "hoeren", teil: 3, answer: "rf", itemsReal: 7, itemsPerBlock: 7,
      textTypes: ["Gespräch in der Straßenbahn", "Gespräch im Zug", "Gespräch in einem Café"],
      length: { min: 60, max: 95, unit: "seconds" }, voices: { min: 2, max: 2 }, plays: 1,
      accents: ["at", "ch"],
      instruction: "Sie hören ein Gespräch. Lesen Sie zuerst die Aussagen. Sind sie richtig oder falsch? Sie hören das Gespräch einmal.",
      hint: `Zwei Personen, eine Frau und ein Mann, unterhalten sich locker an einem öffentlichen Ort über ein Alltagsthema (Wohnung, Urlaub, Arbeit, Familie, Freizeit). "role" ist der Vorname. Die erste Person lebt in Österreich (z. B. Wien, Graz), die zweite kommt aus der Schweiz. Natürlich gesprochen, mit Füllwörtern, B1, 140–210 Wörter, 8–12 Beiträge. Die Aussagen folgen der Reihenfolge des Gesprächs und prüfen Details oder Meinungen.`,
      todo: `${SHORT_CLIP} Real Teil 3: one ~480-word dialogue (~3.5 min) with 7 items; taster: ~80 s with 2 items.`,
    },
  ])),
  // What the generator drafts. research §6 proposes 10 items per skill; the free test is capped at ~5 minutes per skill.
  // Hören Teil 4 (radio discussion, 3 speakers, 8 statements → a/b/c speaker) is left out: too long for the taster, and
  // the kit's listening match is the DTZ opinions format, not the B1 one.
  kurztest: {
    lesen: [
      { teil: 1, blocks: 1, items: 2 },
      { teil: 3, blocks: 1, items: 3 },
    ],
    hoeren: [
      { teil: 1, blocks: 1, items: 2 },
      { teil: 2, blocks: 1, items: 1 },
      { teil: 3, blocks: 1, items: 2 },
    ],
  },
  // research §3.3–3.4, §5. The Goethe set takes Schreiben Aufgabe 3 and Sprechen Teil 1; this set takes the other big
  // tasks: Schreiben Aufgabe 2 (opinion post, 40 of 100 points) and Sprechen Teile 2+3 (presentation, then questions).
  // Sprechen Teil 1 stays specced and drafted for the full mock; the taster doesn't show it.
  open: [
    {
      skill: "schreiben", teil: 2, title: "Meinung im Gästebuch", minutes: 5, tasks: 1, points: 3,
      instruction: "Schreiben Sie Ihre Meinung zum Thema, etwa 80 Wörter.",
      hint: `situation: wie im Prüfungsheft, in Sie-Form: "Sie haben im Fernsehen eine Diskussionssendung zum Thema „<Thema>" gesehen. Im Online-Gästebuch der Sendung finden Sie folgende Meinung:" Dann in einer neuen Zeile (\n\n) der Beitrag einer anderen Person in Anführungszeichen, 40–50 Wörter, B1, mit klarer Meinung, darunter in einer eigenen Zeile Vorname und Wohnort (z. B. "Martina, Linz" oder "Beat, Bern"). Thema: eine Alltagsfrage, zu der man verschiedene Meinungen haben kann (z. B. Handy in der Schule, Haustiere in der Stadt, Arbeiten im Homeoffice, Einkaufen am Sonntag, Mode und Marken). Kein Thema, das mit Politik, Religion oder Migration zu tun hat.
points: genau 3, kurz: "Sagen Sie Ihre Meinung zum Thema.", "Begründen Sie Ihre Meinung." und ein dritter passender Punkt (z. B. "Erzählen Sie von eigenen Erfahrungen." oder "Vergleichen Sie mit Ihrem Heimatland.").
register: informell (Beitrag in einem Online-Gästebuch, ohne Anrede an eine bestimmte Person).
modelAnswer: etwa 80–90 Wörter, B1, reagiert kurz auf den Beitrag, sagt eine klare Meinung mit Gründen und einem Beispiel und hat einen Schlusssatz.`,
      todo: "TODO(hannes): the real Aufgabe 2 has no bullet points (just \"write your opinion\"); we show 3 points so learners can tick them off. Real time 25 min, taster 5. The E rule (Erfüllung E → whole Aufgabe 0, also below half the word count or off topic) is not encoded in the grader.",
    },
    {
      skill: "sprechen", teil: 1, title: "Gemeinsam etwas planen", minutes: 3,
      accents: ["at", "ch"],
      instruction: "Planen Sie etwas gemeinsam mit Ihrer Partnerin oder Ihrem Partner. Machen Sie Vorschläge, reagieren Sie auf die Vorschläge und entscheiden Sie zusammen.",
      hint: `Paarprüfung: eine Prüferin oder ein Prüfer (moderiert), eine Partnerin oder ein Partner (andere Prüfungsteilnehmende) und "du". Die beiden sprechen miteinander, nicht mit der Prüferin.
Situation: ihr beide plant etwas für andere oder zusammen, z. B. eine Abschiedsfeier für eine Kollegin, einen Ausflug mit dem Deutschkurs, einen Besuch bei einer kranken Kurskollegin, Hilfe für einen Freund beim Umzug. Ort in Österreich (z. B. Wien, Graz, Salzburg). cards: leer.
points: genau 4 Leitpunkte als kurze Fragen (z. B. "Wann treffen?", "Was mitbringen?", "Wie hinkommen?", "Wer kümmert sich um …?").
turns: 1. pruefer: nennt kurz die Aufgabe und bittet die beiden anzufangen. 2. partner: begrüßt "du" kurz, macht einen Vorschlag zum ersten Leitpunkt und fragt nach der Meinung. 3. du: Hinweis "Reagiere auf den Vorschlag und mach einen Vorschlag zum zweiten Punkt." 4. partner: ist beim zweiten Punkt nicht einverstanden, sagt höflich warum und macht einen Gegenvorschlag. 5. du: Hinweis "Reagiere, einigt euch und sprich den dritten Punkt an." 6. partner: stimmt zu, ergänzt etwas und fragt nach dem vierten Punkt. 7. du: Hinweis "Mach einen Vorschlag zum vierten Punkt." 8. partner: fasst kurz zusammen, was ihr entschieden habt. 9. pruefer: fragt, ob sie an alles gedacht haben, und beendet den Teil.
Partner-Beiträge je 2–4 Sätze (B1), Beispielantworten von "du" je 2–4 Sätze.`,
      todo: "TODO(hannes): not in the taster (the Goethe set uses Teil 1); drafted for the full mock. Scripted partner turns can't react to what the candidate says.",
    },
    {
      skill: "sprechen", teil: 2, title: "Ein Thema präsentieren", minutes: 3, partner: false,
      accents: ["at", "ch"],
      instruction: "Präsentieren Sie ein Thema. Die fünf Folien helfen Ihnen. Sprechen Sie frei und vergessen Sie Einleitung und Schluss nicht.",
      hint: `Paarprüfung: eine Prüferin oder ein Prüfer (moderiert) und "du". Die Partnerin oder der Partner hört in diesem Teil nur zu und spricht nicht.
Thema: eine Alltagsfrage mit zwei Seiten, z. B. "Mit dem Auto oder mit Öffis in die Arbeit?", "Sollen Kinder ein eigenes Handy haben?", "Online einkaufen oder im Geschäft?", "Wohnen in der Stadt oder auf dem Land?". Kein Thema, das mit Politik, Religion oder Migration zu tun hat. task: das Thema als Frage, so wie es auf der ersten Folie steht.
points: genau 5 Folien in dieser Reihenfolge, kurz und mit dem Thema: 1. das Thema vorstellen und sagen, worüber man spricht; 2. eigene Erfahrungen mit dem Thema; 3. das Thema im Heimatland, mit Beispielen; 4. Vor- und Nachteile und die eigene Meinung, mit Beispielen; 5. Abschluss und Dank. cards: leer.
turns: 1. pruefer: bittet "du", das Thema vorzustellen; erinnert an Einleitung und Schluss und daran, nicht abzulesen. 2.–6. du: je ein Hinweis zu einer Folie (z. B. "Folie 1: Stell dein Thema vor und sag, worüber du sprichst."), sampleAnswer je 2–4 Sätze auf B1. 7. pruefer: kurzer Dank.`,
      todo: "TODO(hannes): shortened. The real Teil 2 is ~3–4 min after 15 min preparation, with a choice of 2 topics; the taster gives one topic, one answer per slide (~2 min). The kit has no topic choice yet.",
    },
    {
      skill: "sprechen", teil: 3, title: "Über ein Thema sprechen", minutes: 1,
      accents: ["at", "ch"],
      instruction: "Ihre Partnerin oder Ihr Partner gibt Ihnen eine Rückmeldung zu Ihrer Präsentation und stellt eine Frage. Dann fragt die Prüferin. Antworten Sie.",
      hint: `Direkt nach der Präsentation aus Teil 2. Thema der Präsentation: "Urlaub im eigenen Land oder im Ausland?" (wie im Entwurf zu Teil 2). Gleiche Prüferin und gleicher Partner. cards: leer. points: leer. task: kurz, z. B. "Antworten Sie auf die Fragen zu Ihrer Präsentation."
turns: 1. pruefer: bittet den Partner kurz um eine Rückmeldung und eine Frage. 2. partner: sagt in 1–2 Sätzen, was ihm oder ihr allgemein gefallen hat oder neu war, so dass es zu jeder Präsentation über dieses Thema passt (nichts behaupten, was "du" vielleicht nicht gesagt hat), und stellt dann eine Frage zum Thema. 3. du: Hinweis "Antworte auf die Frage." 4. pruefer: stellt eine eigene Frage zum Thema. 5. du: Hinweis "Antworte auf die Frage der Prüferin." 6. pruefer: kurzer Dank und Ende der Prüfung.`,
      todo: "TODO(hannes): the real questions refer to what the candidate actually said (research §5); scripted questions can only refer to the topic. Round B (partner presents, candidate gives feedback) is left out.",
    },
  ],
  // Aufgabe 2: Erfüllung, Kohärenz, Wortschatz, Strukturen at 10 each (= 40); each scored A–E (research §4).
  rubric: {
    schreiben: [
      { name: "Erfüllung", max: 10, steps: [1, 0.75, 0.5, 0.25, 0] },
      { name: "Kohärenz", max: 10, steps: [1, 0.75, 0.5, 0.25, 0] },
      { name: "Wortschatz", max: 10, steps: [1, 0.75, 0.5, 0.25, 0] },
      { name: "Strukturen", max: 10, steps: [1, 0.75, 0.5, 0.25, 0] },
    ],
  },
  taster: {
    lesen: [{ teil: 1, blocks: 1 }, { teil: 3, blocks: 1 }],
    hoeren: [{ teil: 1, blocks: 1 }, { teil: 2, blocks: 1 }, { teil: 3, blocks: 1 }],
    sprechen: [2, 3],
    minutes: { lesen: 5, hoeren: 4, schreiben: 5, sprechen: 4 },
  },
}
