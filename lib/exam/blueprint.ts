// DTZ part specs the generator and validator work from.
// `full` on each Teil is the official format from research/dtz-blueprint.md (g.a.s.t. Übungssätze 1 and 2, checked
// 2026-10-22); full Modelltests are built and validated against it. The top-level fields describe the free-test
// blocks, which are shortened tasters (first measured on TestGerman's mocks, testgerman/mock-exams.md). Never derive
// real counts or timings from them. Structure only; no official or competitor text is ever reused.

import type { ExamId } from "@/lib/exams"
import { EXAM_KURZTEST, EXAM_OPEN, EXAM_PARTS, EXAM_TASTER } from "./exam-blueprints"
import type { PartId } from "./types"

/** "pic": a/b/c with picture options (Start Deutsch 1 Hören Teil 1). */
export type AnswerFormat = "abc" | "pic" | "rf+abc" | "rf" | "match" | "gap"

/** The real Teil as it appears in the exam. Lengths are per text or clip unless `perItem` says otherwise. */
export type FullSpec = {
  /** Scored items in this Teil and the exam's item numbers. */
  items: number
  first: number
  /** Texts or clips, and items per text or clip. */
  blocks: number
  itemsPerBlock: number
  length: { min: number; max: number; unit: "words" | "seconds" }
  /** A solved item 0 opens the Teil. */
  example: boolean
  /** Listening: seconds to read the tasks before the audio starts. */
  readingSeconds?: number
  /** Matching: options shown (ads, sentences) including the ones the example uses. */
  options?: number
  /** a/b/c where option c is always this text (Lesen Teil 1: "anderes Stockwerk"). */
  fixedLast?: string
  /** Listening: each item has its own clip (Hören Teil 4), not one clip per block. */
  clipPerItem?: boolean
  /** Listening: speaking rate of the clips in words per minute, measured on the official audio. */
  pace?: { min: number; max: number }
  /** Listening: silence before each clip (read the question) and after it (answer), in seconds. */
  pauses?: { before: number; after: number }
  /** Listening: sound design the clips carry (beeps, gongs, jingles, ambience). */
  sound?: string
  source: string
}

export type PartSpec = {
  skill: PartId
  teil: number
  answer: AnswerFormat
  itemsReal: number
  /** Items one block (one text or one clip) carries. */
  itemsPerBlock: number
  textTypes: string[]
  /** Reading: words per text. Listening: seconds per clip. */
  length: { min: number; max: number; unit: "words" | "seconds" }
  voices?: { min: number; max: number }
  plays?: 1 | 2
  instruction: string
  todo?: string
  /** Answer options per choice item. Default 3. */
  options?: number
  /** Matching: options shown (ads or headings) and whether "x" (no match) is one of them. */
  ads?: number
  noMatch?: boolean
  /** Matching where each text gets a heading; a heading may be used twice. */
  headings?: boolean
  /** No separate text: the options themselves are the texts (Start Deutsch 1 Lesen Teil 2). */
  noText?: boolean
  /** Items in one practice block, when it differs from itemsPerBlock. */
  sample?: number
  /** Voice accents, assigned to speakers in order. Default ["de"]. */
  accents?: ("de" | "at" | "ch")[]
  /** Extra writing brief for the generator. */
  hint?: string
  /** Shown instead of "Lesen · Teil n" (e.g. telc's Sprachbausteine). */
  label?: string
  /** The official Teil (DTZ so far). */
  full?: FullSpec
}

const U = "research/dtz-blueprint.md (g.a.s.t. Übungssatz 1 + 2, 06/2024)"

export const PARTS: PartSpec[] = [
  {
    skill: "hoeren", teil: 1, answer: "abc", itemsReal: 4, itemsPerBlock: 1,
    textTypes: ["Durchsage am Bahnhof, in der U-Bahn oder im Zug", "Ansage auf dem Anrufbeantworter (Arztpraxis, Friseur, Werkstatt, Bürgerbüro, Versicherung)", "Bandansage einer Einrichtung (Öffnungszeiten, Preise)", "private Nachricht auf der Mailbox (du)"],
    length: { min: 19, max: 25, unit: "seconds" }, voices: { min: 1, max: 1 }, plays: 1,
    instruction: "Sie hören vier Ansagen. Zu jeder Ansage gibt es eine Aufgabe. Welche Lösung (a, b oder c) passt am besten?",
    full: { items: 4, first: 1, blocks: 4, itemsPerBlock: 1, length: { min: 20, max: 35, unit: "seconds" }, example: true, pace: { min: 105, max: 155 }, pauses: { before: 12, after: 15 }, sound: "Anrufbeantworter: Piepton, Wähltasten; Bahnhof: Gong, Zuggeräusche", source: U },
  },
  {
    skill: "hoeren", teil: 2, answer: "abc", itemsReal: 5, itemsPerBlock: 1,
    textTypes: ["Radioansage zu einer Veranstaltung (Stadtfest, Markt, Konzert, Kino)", "Verkehrsmeldung oder Fahrplanänderung", "Radiowerbung oder Gewinnspiel", "Durchsage im Zug"],
    length: { min: 28, max: 36, unit: "seconds" }, voices: { min: 1, max: 1 }, plays: 1,
    instruction: "Sie hören fünf Ansagen aus dem Radio. Zu jeder Ansage gibt es eine Aufgabe. Welche Lösung (a, b oder c) passt am besten?",
    full: { items: 5, first: 5, blocks: 5, itemsPerBlock: 1, length: { min: 22, max: 36, unit: "seconds" }, example: false, pace: { min: 105, max: 160 }, pauses: { before: 12, after: 15 }, sound: "Radio-Jingle oder Musikbett; Durchsage im Zug mit Signalton", source: U },
  },
  {
    skill: "hoeren", teil: 3, answer: "rf+abc", itemsReal: 8, itemsPerBlock: 2,
    textTypes: ["Alltagsgespräch beim Arzt oder in der Praxis", "Gespräch unter Nachbarn", "Gespräch mit Chef oder Kollegen", "Gespräch im Geschäft, am Schalter oder auf der Straße"],
    length: { min: 29, max: 40, unit: "seconds" }, voices: { min: 2, max: 2 }, plays: 1,
    instruction: "Sie hören vier Gespräche. Zu jedem Gespräch gibt es zwei Aufgaben. Entscheiden Sie bei jedem Gespräch, ob die Aussage richtig oder falsch ist und welche Antwort (a, b oder c) am besten passt.",
    full: { items: 8, first: 10, blocks: 4, itemsPerBlock: 2, length: { min: 48, max: 70, unit: "seconds" }, example: true, pace: { min: 140, max: 165 }, pauses: { before: 12, after: 15 }, sound: "leise Umgebung (Laden, Straße, Praxis), z. B. Klopfen an der Tür", source: U },
  },
  {
    skill: "hoeren", teil: 4, answer: "match", itemsReal: 3, itemsPerBlock: 3,
    textTypes: ["Radiosendung mit Hörermeinungen zu einem Alltagsthema"],
    // Free test: one clip with all three opinions, ~25–30 s each.
    length: { min: 70, max: 95, unit: "seconds" }, voices: { min: 3, max: 3 }, plays: 1,
    instruction: "Sie hören Aussagen zu einem Thema. Welcher der Sätze a–f passt zu den Aussagen? Lesen Sie jetzt die Sätze a–f. Dazu haben Sie eine Minute Zeit.",
    // Real: host intro, then the example statement and three statements, each its own clip and voice.
    full: { items: 3, first: 18, blocks: 1, itemsPerBlock: 3, length: { min: 20, max: 34, unit: "seconds" }, example: true, readingSeconds: 60, options: 6, clipPerItem: true, pace: { min: 140, max: 190 }, pauses: { before: 4, after: 15 }, source: U },
  },
  {
    skill: "lesen", teil: 1, answer: "abc", itemsReal: 5, itemsPerBlock: 1,
    textTypes: ["Wegweiser im Rathaus oder Bürgerbüro (Stockwerke)", "Inhaltsverzeichnis eines Ratgebers (Kapitel)", "Übersicht eines Stadtportals (Rubriken)"],
    length: { min: 90, max: 150, unit: "words" },
    instruction: "Lesen Sie die Aufgaben und die Übersicht. Wo (a, b oder c) finden Sie die Information?",
    full: { items: 5, first: 21, blocks: 1, itemsPerBlock: 5, length: { min: 120, max: 170, unit: "words" }, example: true, fixedLast: "anderes Stockwerk / anderes Kapitel / andere Rubrik", source: U },
  },
  {
    skill: "lesen", teil: 2, answer: "match", itemsReal: 5, itemsPerBlock: 5,
    textTypes: ["Kleinanzeigen (Wohnungen, Versicherungen, Kurse, Jobs, Dienstleistungen, Freizeit)"],
    length: { min: 300, max: 430, unit: "words" },
    instruction: "Lesen Sie die Situationen und die Anzeigen a–h. Finden Sie für jede Situation die passende Anzeige. Für eine Aufgabe gibt es keine Lösung. Markieren Sie in diesem Fall ein X.",
    full: { items: 5, first: 26, blocks: 1, itemsPerBlock: 5, length: { min: 380, max: 520, unit: "words" }, example: false, options: 8, source: U },
  },
  {
    skill: "lesen", teil: 3, answer: "rf+abc", itemsReal: 6, itemsPerBlock: 2,
    textTypes: ["Kurze Pressemeldung aus der Stadt", "Brief einer Kita, Schule oder eines Vereins", "E-Mail von einer Behörde, Sprachschule oder Firma", "Aushang im Haus", "Information zu Bauarbeiten im Nahverkehr"],
    length: { min: 80, max: 120, unit: "words" },
    instruction: "Lesen Sie die drei Texte. Zu jedem Text gibt es zwei Aufgaben. Entscheiden Sie bei jedem Text, ob die Aussage richtig oder falsch ist und welche Antwort (a, b oder c) am besten passt.",
    full: { items: 6, first: 31, blocks: 3, itemsPerBlock: 2, length: { min: 90, max: 130, unit: "words" }, example: false, source: U },
  },
  {
    skill: "lesen", teil: 4, answer: "rf", itemsReal: 3, itemsPerBlock: 3,
    textTypes: ["Regeln für Fahrgäste im Nahverkehr", "Elterninformation (Mittagsbetreuung, Kita)", "Hausordnung", "Nutzungsbedingungen (Bibliothek, Schwimmbad, Fitnessstudio)"],
    length: { min: 165, max: 230, unit: "words" },
    instruction: "Lesen Sie den Text. Entscheiden Sie, ob die Aussagen richtig oder falsch sind.",
    full: { items: 3, first: 37, blocks: 1, itemsPerBlock: 3, length: { min: 200, max: 260, unit: "words" }, example: false, source: U },
  },
  {
    skill: "lesen", teil: 5, answer: "gap", itemsReal: 6, itemsPerBlock: 6,
    textTypes: ["Formeller Brief: Beschwerde", "Formeller Brief: Bestätigung (Abo, Anmeldung, Vertrag)", "Formeller Brief: Kündigung", "Formeller Brief: Termin absagen"],
    length: { min: 95, max: 105, unit: "words" },
    instruction: "Lesen Sie den Text und schließen Sie die Lücken. Welche Lösung (a, b oder c) passt am besten?",
    full: { items: 6, first: 40, blocks: 1, itemsPerBlock: 6, length: { min: 85, max: 110, unit: "words" }, example: true, source: U },
  },
]

export type OpenSpec = {
  skill: "schreiben" | "sprechen"
  teil: number
  title: string
  instruction: string
  minutes: number
  todo?: string
  /** Non-DTZ exams: the generator brief for this Teil (task shape, turn order, model answer length). */
  hint?: string
  /** Schreiben: tasks to choose from (default: DTZ 2, others 1) and Leitpunkte per task (default: DTZ 4, others 3). */
  tasks?: number
  points?: number
  /** Sprechen: false when the partner doesn't speak in this Teil. */
  partner?: boolean
  /** Sprechen: voice accents for examiner and partner, in that order. Default ["de", "de"]. */
  accents?: ("de" | "at" | "ch")[]
}

// Real DTZ: Schreiben is one letter (choice of two tasks), Sprechen is a pair exam in three parts with no preparation
// time. Source: research/dtz-blueprint.md §4–5.
export const OPEN_PARTS: OpenSpec[] = [
  {
    skill: "schreiben", teil: 1, title: "Brief oder E-Mail", minutes: 30,
    instruction: "Wählen Sie Aufgabe A oder Aufgabe B. Zeigen Sie, was Sie können. Schreiben Sie möglichst viel. Vergessen Sie nicht die Anrede und den Gruß.",
    hint: "Eine Aufgabe halbformell (E-Mail an Bekannte), eine formell (an Vermieter, Behörde, Firma). Keine Wortzahl vorgeben.",
  },
  {
    skill: "sprechen", teil: 1, title: "Über sich sprechen", minutes: 4,
    instruction: "Stellen Sie sich vor: Name, Geburtsort, Wohnort, Arbeit/Beruf, Familie, Sprachen. Danach stellt die Prüferin oder der Prüfer Fragen.",
  },
  {
    skill: "sprechen", teil: 2, title: "Über Erfahrungen sprechen", minutes: 6,
    instruction: "Was sehen Sie auf dem Foto? Was für eine Situation zeigt dieses Bild? Erzählen Sie dann: Welche Erfahrungen haben Sie damit?",
  },
  {
    skill: "sprechen", teil: 3, title: "Gemeinsam etwas planen", minutes: 6,
    instruction: "Planen Sie gemeinsam. Machen Sie Vorschläge und reagieren Sie auf die Vorschläge Ihrer Partnerin oder Ihres Partners.",
  },
]

/** Official DTZ Schreiben criteria, 0–5 points each (research/dtz-blueprint.md §4). */
export const DTZ_WRITING_CRITERIA = [
  { name: "Aufgabenbewältigung", about: "alle vier Leitpunkte inhaltlich präzise bearbeitet" },
  { name: "Kommunikative Gestaltung", about: "passende Redemittel, Anrede und Gruß, Sätze verbunden" },
  { name: "Korrektheit", about: "Grammatik, Rechtschreibung; klar, was gemeint ist" },
  { name: "Wortschatz", about: "genug Wörter für das Thema, Umschreibungen" },
] as const

/** Official DTZ Sprechen points (research/dtz-blueprint.md §5): task per Teil plus language over the whole talk. */
export const DTZ_SPEAKING_POINTS = {
  task: { "1A": 5, "1B": 5, "2A": 10, "2B": 10, "3": 20 },
  language: { "Aussprache/Intonation": 10, "Flüssigkeit": 10, "Korrektheit": 15, "Wortschatz": 15 },
} as const

export type KurztestPlan = Record<"lesen" | "hoeren", { teil: number; blocks: number; items: number }[]>

/** The 10-item Kurztest per skill: which Teile, how many blocks, items per block. */
export const KURZTEST: KurztestPlan = {
  lesen: [
    { teil: 1, blocks: 2, items: 1 },
    { teil: 2, blocks: 1, items: 2 },
    { teil: 3, blocks: 1, items: 2 },
    { teil: 4, blocks: 1, items: 2 },
    { teil: 5, blocks: 1, items: 2 },
  ],
  hoeren: [
    { teil: 1, blocks: 2, items: 1 },
    { teil: 2, blocks: 3, items: 1 },
    { teil: 3, blocks: 1, items: 2 },
    { teil: 4, blocks: 1, items: 3 },
  ],
}

/**
 * The free test is a 5-minute taster per skill (Hannes, 2026-10-12): a few reviewed blocks from the generated
 * set, every format type once where it fits. `minutes` is the timer (Lesen, Schreiben) or the expected run time.
 */
export type Taster = { lesen: { teil: number; blocks: number }[]; hoeren: { teil: number; blocks: number }[]; sprechen: number[]; minutes: Record<PartId, number> }

export const TASTER: Partial<Record<ExamId, Taster>> = {
  dtz: {
    lesen: [{ teil: 1, blocks: 1 }, { teil: 3, blocks: 1 }, { teil: 5, blocks: 1 }],
    hoeren: [{ teil: 1, blocks: 2 }, { teil: 2, blocks: 1 }, { teil: 3, blocks: 1 }],
    // Teil 3 is the pair task (planning with the partner), the part no other free test simulates.
    sprechen: [3],
    minutes: { lesen: 5, hoeren: 4, schreiben: 5, sprechen: 4 },
  },
  ...EXAM_TASTER,
}

export const kurztestPlan = (exam: ExamId = "dtz") => (exam === "dtz" ? KURZTEST : EXAM_KURZTEST[exam])

export const kurztestItems = (skill: PartId, teil: number, exam: ExamId = "dtz") =>
  (kurztestPlan(exam) as Record<string, { teil: number; items: number }[]> | undefined)?.[skill]?.find((k) => k.teil === teil)?.items

export const openParts = (exam: ExamId = "dtz") => (exam === "dtz" ? OPEN_PARTS : EXAM_OPEN[exam] ?? [])

export const partsOf = (exam: ExamId = "dtz") => (exam === "dtz" ? PARTS : EXAM_PARTS[exam] ?? [])

export const partSpec = (skill: PartId, teil: number, exam: ExamId = "dtz") => {
  const spec = partsOf(exam).find((p) => p.skill === skill && p.teil === teil)
  if (!spec) throw new Error(`No blueprint for ${exam} ${skill} Teil ${teil}`)
  return spec
}
