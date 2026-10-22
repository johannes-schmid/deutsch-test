// Design specimens for /design/pruefung. Written from scratch, not reviewed exam content.
// Solutions sit apart from items on purpose: real items never ship their answer to the client.

import { Bike, Bus, Car } from "lucide-react"
import type { AudioClip, ChoiceData, Evidence, GapData, MatchData, PartResult, Person, PictureData, ReadingData, ReviewEntry, SpeakingData, TrueFalse, TrueFalseData, Turn, WritingOption } from "./types"

export const SPEAKERS = {
  ben: { name: "Ben", tone: "var(--v-sk-lesen)" },
  irene: { name: "Kundin", tone: "var(--v-sk-schreiben)" },
  mark: { name: "Apotheker", tone: "var(--v-sk-sprechen)" },
}

export const DURCHSAGE: AudioClip = {
  duration: 16,
  plays: 1,
  situation: "Durchsage am Bahnhof",
  speakers: SPEAKERS,
  segments: [{ speaker: "ben", from: 0, to: 16 }],
}

export const APOTHEKE: AudioClip = {
  duration: 22,
  plays: 2,
  situation: "Gespräch in der Apotheke",
  speakers: SPEAKERS,
  segments: [
    { speaker: "irene", from: 0, to: 5 },
    { speaker: "mark", from: 5, to: 11 },
    { speaker: "irene", from: 11, to: 17 },
    { speaker: "mark", from: 17, to: 22 },
  ],
}

export const HOEREN_CHOICE: ChoiceData = {
  n: 2,
  prompt: "Wo fährt der Zug nach Aachen heute ab?",
  options: [
    { key: "a", label: "Von Gleis 7" },
    { key: "b", label: "Von Gleis 9" },
    { key: "c", label: "Von Gleis 12" },
  ],
}

export const HOEREN_FEEDBACK: { correct: string; explanation: string; evidence: Evidence } = {
  correct: "b",
  explanation: "Gleis 7 ist das normale Gleis. Die Durchsage sagt: Heute fährt der Zug von Gleis 9.",
  evidence: {
    text: "Achtung an Gleis 7. Der Regionalexpress 4 nach Aachen, Abfahrt 14:32, fährt heute von Gleis 9 ab. Grund ist eine Störung an einer Weiche.",
    hit: "fährt heute von Gleis 9 ab",
  },
}

export const HOEREN_TF: TrueFalseData = { n: 11, statement: "Die Frau soll die Tabletten vor dem Essen nehmen." }
export const HOEREN_TF_SOLUTION: TrueFalse = "falsch"

export const PICTURE: PictureData = {
  n: 4,
  prompt: "Wie kommt Herr Yilmaz morgen zur Arbeit?",
  options: [
    { key: "a", label: "Mit dem Bus", icon: Bus },
    { key: "b", label: "Mit dem Fahrrad", icon: Bike },
    { key: "c", label: "Mit dem Auto", icon: Car },
  ],
}

export const MATCH: MatchData = {
  ads: [
    { key: "a", title: "Deutsch am Abend", text: "Volkshochschule Mitte. Kurs A2–B1, Montag und Mittwoch, 18 bis 20 Uhr." },
    { key: "b", title: "Kinderbetreuung am Samstag", text: "Familienzentrum Nord. 9 bis 13 Uhr, für Kinder von 3 bis 6 Jahren." },
    { key: "c", title: "Fahrräder aus zweiter Hand", text: "Verkauf und Reparatur. Dienstag bis Samstag in der Hafenstraße 12." },
    { key: "d", title: "Nachhilfe in Mathe", text: "Für Kinder der Klassen 1 bis 4. Wir kommen zu Ihnen nach Hause." },
    { key: "e", title: "Radfahren lernen", text: "Kurs für Erwachsene ohne Vorkenntnisse. Sonntags auf dem Verkehrsübungsplatz." },
  ],
  situations: [
    { n: 6, text: "Sie arbeiten tagsüber und möchten abends Deutsch lernen." },
    { n: 7, text: "Sie können nicht Rad fahren und möchten es lernen." },
    { n: 8, text: "Sie suchen für Freitagabend einen Babysitter." },
  ],
}
export const MATCH_SOLUTION: Record<number, string> = { 6: "a", 7: "e", 8: "x" }

export const GAP: GapData = {
  parts: [
    "Sehr geehrte Damen und Herren,\nhiermit kündige ich meinen Vertrag ",
    { n: 21, options: ["zum", "am", "im"] },
    " 31. Mai. Bitte schicken Sie mir eine kurze ",
    { n: 22, options: ["Bestellung", "Bestätigung", "Bewerbung"] },
    " per E-Mail.\nMit freundlichen Grüßen\nAmina Haddad",
  ],
}
export const GAP_SOLUTION: Record<number, string> = { 21: "zum", 22: "Bestätigung" }

export const READING: ReadingData = {
  sender: "Stadtbibliothek Lindenau",
  source: "Aushang in der Bibliothek",
  paragraphs: [
    "Liebe Leserinnen und Leser,",
    "vom 3. bis 21. Juni renovieren wir die Räume im Erdgeschoss. In dieser Zeit ist die Kinderbibliothek geschlossen. Die Abteilung für Erwachsene im ersten Stock bleibt offen, aber nur von 10 bis 16 Uhr.",
    "Bücher können Sie wie immer am Automaten neben dem Eingang zurückgeben. Die Lesestunde für Kinder ist im Juni im Gemeindehaus, Kirchstraße 4, jeden Mittwoch um 15 Uhr.",
    "Bei Fragen erreichen Sie uns unter 0341 22 87 40.",
    "Ihr Team der Stadtbibliothek",
  ],
}
export const READING_TF: TrueFalseData = { n: 14, statement: "Im Juni ist die ganze Bibliothek geschlossen." }
export const READING_CHOICE: ChoiceData = {
  n: 15,
  prompt: "Wo ist die Lesestunde für Kinder im Juni?",
  options: [
    { key: "a", label: "Im ersten Stock der Bibliothek" },
    { key: "b", label: "Im Gemeindehaus in der Kirchstraße" },
    { key: "c", label: "In der Kinderbibliothek" },
  ],
}

export const WRITING: WritingOption[] = [
  {
    key: "A",
    title: "Heizung kaputt",
    situation: "Die Heizung in deiner Wohnung geht seit drei Tagen nicht. Schreib an die Hausverwaltung.",
    points: ["Was ist das Problem?", "Seit wann?", "Was soll die Hausverwaltung tun?", "Wann bist du zu Hause?"],
  },
  {
    key: "B",
    title: "Kurs absagen",
    situation: "Du kannst nächste Woche nicht zum Deutschkurs kommen. Schreib an deine Kursleiterin.",
    points: ["Warum kannst du nicht kommen?", "Entschuldige dich.", "Frag nach den Hausaufgaben.", "Wann kommst du wieder?"],
  },
]

export const SPEAKING: SpeakingData = {
  part: "Sprechen · Teil 3",
  title: "Gemeinsam etwas planen",
  task: "Eine Kollegin, Frau Sommer, hat nächste Woche Geburtstag. Plant zusammen ein Geschenk.",
  points: ["Was schenken?", "Wie viel Geld?", "Wer kauft es?", "Wann übergeben?"],
}
export const PEOPLE: Record<Turn["who"], Person> = {
  pruefer: { name: "Prüfer", initial: "P", tone: "var(--v-sk-lesen)" },
  partner: { name: "Ela", initial: "E", tone: "var(--v-sk-schreiben)" },
  du: { name: "Du", initial: "Du", tone: "var(--p-glow)" },
}
export const TURNS: Turn[] = [
  { who: "pruefer", text: "Bitte planen Sie jetzt zusammen. Sie haben etwa drei Minuten." },
  { who: "partner", text: "Frau Sommer hat ja nächste Woche Geburtstag. Was schenken wir ihr?" },
  { who: "du", text: "Vielleicht Blumen und ein Buch? Sie liest doch gern." },
  { who: "partner", text: "Gute Idee. Wie viel Geld sammeln wir pro Person?" },
]

export const HOEREN_TEILE = [
  { id: "t1", label: "Teil 1", count: 4 },
  { id: "t2", label: "Teil 2", count: 5 },
  { id: "t3", label: "Teil 3", count: 8 },
  { id: "t4", label: "Teil 4", count: 3 },
]

const marks = (from: number, wrong: number[], count: number) =>
  Array.from({ length: count }, (_, i) => ({ n: from + i, right: !wrong.includes(from + i) }))

// TODO(hannes): verify against the official DTZ result sheet how parts are grouped (Hören and Lesen
// separately or together) and how the overall level is derived. The UI just renders what it gets.
// TODO(hannes): criterion names are placeholders until the official DTZ Bewertungskriterien are in research/.
export const RESULT = {
  level: "A2" as const,
  meta: "DTZ · Modelltest 1 · 12. Oktober 2026",
  summary: "Hören, Schreiben und Sprechen sind schon auf B1. Für B1 fehlt dir vor allem Lesen.",
  parts: [
    { part: "hoeren", name: "Hören", level: "B1", teile: [{ label: "Teil 1", items: marks(1, [2], 4) }, { label: "Teil 2", items: marks(5, [], 5) }, { label: "Teil 3", items: marks(10, [11, 15], 8) }, { label: "Teil 4", items: marks(18, [], 3) }] },
    { part: "lesen", name: "Lesen", level: "A2", teile: [{ label: "Teil 1", items: marks(1, [3], 5) }, { label: "Teil 2", items: marks(6, [7, 8, 9], 5) }, { label: "Teil 3", items: marks(11, [14], 6) }, { label: "Teil 4", items: marks(17, [], 3) }, { label: "Teil 5", items: marks(20, [21, 23, 25], 6) }] },
    {
      part: "schreiben",
      name: "Schreiben",
      level: "B1",
      criteria: [
        { name: "Aufgabe erfüllt", level: "B1", comment: "Du schreibst zu allen vier Punkten. Der Grund und die Bitte sind klar." },
        { name: "Anrede und Gruß", level: "B1", comment: "Die formelle Anrede und der Gruß passen zu einem Brief an die Hausverwaltung." },
        { name: "Wortschatz", level: "A2", comment: "Du nutzt oft einfache Wörter. Versuch ein paar genauere Wörter.", quote: { yours: "Die Heizung ist nicht gut.", better: "Die Heizung funktioniert nicht." } },
        { name: "Grammatik", level: "A2", comment: "Im Nebensatz steht das Verb noch oft an der falschen Stelle.", quote: { yours: "weil ich habe kleine Kinder", better: "weil ich kleine Kinder habe" } },
      ],
    },
    {
      part: "sprechen",
      name: "Sprechen",
      level: "B1",
      criteria: [
        { name: "Aufgabe erfüllt", level: "B1", comment: "Ihr habt alle vier Punkte besprochen und euch geeinigt." },
        { name: "Auf die Partnerin reagieren", level: "B1", comment: "Du gehst auf Elas Vorschläge ein und machst eigene." },
        { name: "Aussprache", level: "A2", comment: "Lange Wörter sind manchmal schwer zu verstehen. Sprich sie langsamer." },
      ],
    },
  ] as PartResult[],
  review: [
    { n: 7, part: "Lesen · Teil 2", prompt: "Sie können nicht Rad fahren und möchten es lernen.", yours: "c", solution: "e" },
    { n: 21, part: "Lesen · Teil 5", prompt: "hiermit kündige ich meinen Vertrag … 31. Mai", yours: "am", solution: "zum" },
    { n: 2, part: "Hören · Teil 1", prompt: "Wo fährt der Zug nach Aachen heute ab?", yours: "a", solution: "b" },
  ] as ReviewEntry[],
  next: { text: "Übe Lesen Teil 2 und Teil 5. Dort hast du die meisten Punkte verloren.", cta: "Lesen üben" },
}

// Start Deutsch 1 specimens: pictogram options with a label, drawn cards, one writing task, a result in points.
export const PICTO_PICTURE: PictureData = {
  n: 2,
  prompt: "Wann beginnt der Kurs?",
  options: [
    { key: "a", label: "8:30", picto: "uhr" },
    { key: "b", label: "9:00", picto: "uhr" },
    { key: "c", label: "9:30", picto: "uhr" },
  ],
}

export const SPEAKING_CARDS: SpeakingData = {
  part: "Sprechen · Teil 3",
  title: "Bitten und reagieren",
  task: "Bitten Sie Ihren Partner um etwas. Reagieren Sie auf seine Bitte.",
  points: [],
  cards: [{ label: "Regenschirm", picto: "regenschirm" }],
}

export const CARD_TURNS: Turn[] = [
  { who: "pruefer", text: "Jetzt bitten Sie um etwas. Sie haben eine Karte mit einem Bild." },
  { who: "du", text: "Bitte deinen Partner um etwas. Deine Karte: Regenschirm." },
  { who: "partner", text: "Ja, klar. Hier, bitte." },
]

export const WRITING_SINGLE: WritingOption[] = [
  { key: "A", title: "Kurs absagen", situation: "Sie können am Samstag nicht zum Deutschkurs kommen. Schreiben Sie Ihrer Lehrerin, Frau Brandt, eine E-Mail.", points: ["Warum schreiben Sie?", "Grund", "Hausaufgaben?"] },
]

export const RESULT_POINTS: PartResult = {
  part: "schreiben",
  name: "Schreiben",
  score: { points: 7.5, max: 10 },
  passed: true,
  criteria: [
    { name: "Warum schreiben Sie?", points: { points: 3, max: 3 }, comment: "Klar: Du sagst gleich am Anfang, dass du nicht kommen kannst." },
    { name: "Grund", points: { points: 1.5, max: 3 }, comment: "Der Grund ist da, aber der Satz ist schwer zu verstehen.", quote: { yours: "Ich habe Arzt Termin Samstag.", better: "Ich habe am Samstag einen Arzttermin." } },
    { name: "Hausaufgaben?", points: { points: 3, max: 3 }, comment: "Gut gefragt, und die Frage ist klar." },
    { name: "Anrede und Gruß", points: { points: 0, max: 1 }, comment: "Der Gruß am Ende fehlt. Schreib zum Beispiel: Viele Grüße." },
  ],
}

/** A short stand-in for a Hören track (one real free-test clip), cut into cues as the Modelltest track is. */
export const TRACK = {
  src: "/audio/kurztest/goethe-a2-hoeren-t1-01.mp3",
  duration: 22.8,
  cues: [
    { teil: 1, phase: "instruction" as const, items: [0], from: 0, to: 3 },
    { teil: 1, phase: "reading" as const, items: [1], from: 3, to: 6 },
    { teil: 1, phase: "clip" as const, items: [1], from: 6, to: 12 },
    { teil: 2, phase: "reading" as const, items: [5], from: 12, to: 14 },
    { teil: 2, phase: "clip" as const, items: [5], from: 14, to: 20 },
    { teil: 2, phase: "answer" as const, items: [5], from: 20, to: 22.8 },
  ],
}
