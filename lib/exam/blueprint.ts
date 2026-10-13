// DTZ part specs the generator and validator work from.
// Source until research/dtz-blueprint.md exists: TestGerman's 4 DTZ mocks, measured in
// testgerman/mock-exams.md (checked 2026-10-12). Their mocks are AI-made, so every number
// here is provisional. Structure only; their texts are never reused.

import type { ExamId } from "@/lib/exams"
import { EXAM_KURZTEST, EXAM_OPEN, EXAM_PARTS, EXAM_TASTER } from "./exam-blueprints"
import type { PartId } from "./types"

/** "pic": a/b/c with picture options (Start Deutsch 1 Hören Teil 1). */
export type AnswerFormat = "abc" | "pic" | "rf+abc" | "rf" | "match" | "gap"

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
}

export const PARTS: PartSpec[] = [
  {
    skill: "hoeren", teil: 1, answer: "abc", itemsReal: 4, itemsPerBlock: 1,
    textTypes: ["Durchsage am Bahnhof oder in der S-Bahn", "Ansage auf dem Anrufbeantworter (Arztpraxis, Friseur, Werkstatt)", "Durchsage im Supermarkt oder Kaufhaus"],
    length: { min: 19, max: 25, unit: "seconds" }, voices: { min: 1, max: 1 }, plays: 1,
    instruction: "Sie hören eine kurze Ansage. Lesen Sie zuerst die Frage. Wählen Sie dann die richtige Antwort: a, b oder c.",
    todo: "TODO(hannes): play count. TestGerman plays once; confirm against the official Modelltest.",
  },
  {
    skill: "hoeren", teil: 2, answer: "abc", itemsReal: 5, itemsPerBlock: 1,
    textTypes: ["Radioansage zu einer Veranstaltung (Stadtfest, Markt, Konzert)", "Verkehrsmeldung im Radio", "Wetterbericht im Radio"],
    length: { min: 28, max: 36, unit: "seconds" }, voices: { min: 1, max: 1 }, plays: 1,
    instruction: "Sie hören eine Ansage im Radio. Lesen Sie zuerst die Frage. Wählen Sie dann die richtige Antwort: a, b oder c.",
    todo: "TODO(hannes): play count, confirm against the official Modelltest.",
  },
  {
    skill: "hoeren", teil: 3, answer: "rf+abc", itemsReal: 8, itemsPerBlock: 2,
    textTypes: ["Alltagsgespräch beim Arzt oder in der Apotheke", "Gespräch unter Nachbarn oder Kollegen", "Gespräch im Geschäft oder am Schalter"],
    length: { min: 29, max: 40, unit: "seconds" }, voices: { min: 2, max: 2 }, plays: 1,
    instruction: "Sie hören ein Gespräch. Zu jedem Gespräch gibt es zwei Aufgaben. Ist die Aussage richtig oder falsch? Und welche Antwort passt: a, b oder c?",
    todo: "TODO(hannes): play count, confirm against the official Modelltest.",
  },
  {
    skill: "hoeren", teil: 4, answer: "match", itemsReal: 3, itemsPerBlock: 3,
    textTypes: ["Radiosendung mit Hörermeinungen zu einem Alltagsthema"],
    // One clip with all three opinions, ~25–30 s each.
    length: { min: 70, max: 95, unit: "seconds" }, voices: { min: 3, max: 3 }, plays: 1,
    instruction: "Sie hören drei Meinungen. Welche Aussage passt zu welcher Person? Es gibt mehr Aussagen als Personen.",
    todo: "TODO(hannes): play count (one TestGerman mock plays twice).",
  },
  {
    skill: "lesen", teil: 1, answer: "abc", itemsReal: 5, itemsPerBlock: 1,
    textTypes: ["Wegweiser im Bürgerbüro oder Rathaus", "Übersicht eines Stellenportals", "Stadtportal mit Rubriken"],
    length: { min: 90, max: 150, unit: "words" },
    instruction: "Lesen Sie die Situation und die Übersicht. Wo finden Sie die Information? Wählen Sie a, b oder c.",
  },
  {
    skill: "lesen", teil: 2, answer: "match", itemsReal: 5, itemsPerBlock: 5,
    textTypes: ["Kleinanzeigen (Kurse, Wohnungen, Dienstleistungen, Freizeit)"],
    length: { min: 300, max: 430, unit: "words" },
    instruction: "Welche Anzeige passt zu welcher Situation? Für eine Situation gibt es keine passende Anzeige. Dann schreiben Sie x.",
  },
  {
    skill: "lesen", teil: 3, answer: "rf+abc", itemsReal: 6, itemsPerBlock: 2,
    textTypes: ["Aushang im Haus oder in einer Einrichtung", "E-Mail von einer Behörde, Schule oder Firma", "Information zu Bauarbeiten im Nahverkehr", "Terminbrief"],
    length: { min: 80, max: 120, unit: "words" },
    instruction: "Lesen Sie den Text. Ist die Aussage richtig oder falsch? Welche Antwort passt: a, b oder c?",
  },
  {
    skill: "lesen", teil: 4, answer: "rf", itemsReal: 3, itemsPerBlock: 3,
    textTypes: ["Hausordnung", "Nutzungsbedingungen (Bibliothek, Schwimmbad, Fitnessstudio)", "Teilnahmebedingungen für einen Kurs"],
    length: { min: 165, max: 230, unit: "words" },
    instruction: "Lesen Sie den Text. Sind die Aussagen richtig oder falsch?",
  },
  {
    skill: "lesen", teil: 5, answer: "gap", itemsReal: 6, itemsPerBlock: 6,
    textTypes: ["Formeller Brief: Kündigung", "Formeller Brief: Lieferung fehlt", "Formeller Brief: Termin absagen"],
    length: { min: 95, max: 105, unit: "words" },
    instruction: "Lesen Sie den Brief. Welches Wort passt in die Lücke? Wählen Sie a, b oder c.",
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

// Real DTZ: Schreiben is one letter (choice of two tasks), Sprechen is a pair exam in three parts.
// Source: CLAUDE.md §2 exam facts; TestGerman's mocks lack the pair format, so they are no reference here.
export const OPEN_PARTS: OpenSpec[] = [
  {
    skill: "schreiben", teil: 1, title: "Brief oder E-Mail", minutes: 30,
    instruction: "Wählen Sie Aufgabe A oder B. Schreiben Sie zu allen vier Punkten. Vergessen Sie Anrede und Gruß nicht.",
    todo: "TODO(hannes): expected length and whether both tasks are always formal. Confirm with the Modelltest.",
  },
  {
    skill: "sprechen", teil: 1, title: "Über sich sprechen", minutes: 3,
    instruction: "Stellen Sie sich vor. Ihre Partnerin oder Ihr Partner stellt sich auch vor.",
    todo: "TODO(hannes): timings per Teil (~16 min total for the pair).",
  },
  {
    skill: "sprechen", teil: 2, title: "Über Erfahrungen sprechen", minutes: 6,
    instruction: "Beschreiben Sie Ihr Bild. Erzählen Sie dann von Ihren Erfahrungen mit dem Thema.",
    todo: "TODO(hannes): picture asset per task; the kit has no picture slot yet.",
  },
  {
    skill: "sprechen", teil: 3, title: "Gemeinsam etwas planen", minutes: 6,
    instruction: "Planen Sie gemeinsam. Machen Sie Vorschläge und reagieren Sie auf die Vorschläge Ihrer Partnerin oder Ihres Partners.",
  },
]

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
