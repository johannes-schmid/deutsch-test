// Goethe-Zertifikat A2 (research/goethe-a2.md §2–6, §11.1) and Goethe-/ÖSD-Zertifikat B1 (research/goethe-oesd-b1.md §4,
// §8.5–8.7), both verified against the official Übungs- and Modellsätze on 2026-10-24. Points and bestanden / nicht
// bestanden, never a level. ÖSD B1 is the same exam as Goethe B1; only the rounding of decimals differs.

export type GoetheExam = "goethe-a2" | "goethe-b1" | "oesd-b1"
export const GOETHE_EXAMS: readonly GoetheExam[] = ["goethe-a2", "goethe-b1", "oesd-b1"]
export const isGoetheExam = (exam: string): exam is GoetheExam => (GOETHE_EXAMS as readonly string[]).includes(exam)
export const isGoetheB1 = (exam: string): exam is "goethe-b1" | "oesd-b1" => exam === "goethe-b1" || exam === "oesd-b1"

/** Every Goethe/ÖSD rating criterion takes one of five steps. */
export type Step = "A" | "B" | "C" | "D" | "E"
const SHARE: Record<Step, number> = { A: 1, B: 0.75, C: 0.5, D: 0.25, E: 0 }
/** A2 Schreiben and A2 Aussprache: 5 / 3.5 / 2 / 0.5 / 0 of 5. */
const A2_FIVE: Record<Step, number> = { A: 5, B: 3.5, C: 2, D: 0.5, E: 0 }

/** Half up (≤ .49 down, ≥ .5 up), as Goethe rounds the mean of two ratings. */
const roundHalfUp = (n: number) => Math.floor(n + 0.5 + 1e-9)

type Teil = { skill: "lesen" | "hoeren"; teil: number; first: number; items: number }
const TEILE: Record<"A2" | "B1", Teil[]> = {
  A2: [
    { skill: "lesen", teil: 1, first: 1, items: 5 },
    { skill: "lesen", teil: 2, first: 6, items: 5 },
    { skill: "lesen", teil: 3, first: 11, items: 5 },
    { skill: "lesen", teil: 4, first: 16, items: 5 },
    { skill: "hoeren", teil: 1, first: 1, items: 5 },
    { skill: "hoeren", teil: 2, first: 6, items: 5 },
    { skill: "hoeren", teil: 3, first: 11, items: 5 },
    { skill: "hoeren", teil: 4, first: 16, items: 5 },
  ],
  B1: [
    { skill: "lesen", teil: 1, first: 1, items: 6 },
    { skill: "lesen", teil: 2, first: 7, items: 6 },
    { skill: "lesen", teil: 3, first: 13, items: 7 },
    { skill: "lesen", teil: 4, first: 20, items: 7 },
    { skill: "lesen", teil: 5, first: 27, items: 4 },
    { skill: "hoeren", teil: 1, first: 1, items: 10 },
    { skill: "hoeren", teil: 2, first: 11, items: 5 },
    { skill: "hoeren", teil: 3, first: 16, items: 7 },
    { skill: "hoeren", teil: 4, first: 23, items: 8 },
  ],
}

/** B1: 30 raw points × 3.33, rounded, by the official conversion table (18 → 60, 17 → 57). */
export const b1Scaled = (raw: number) => Math.round((raw * 100) / 30)

/**
 * A closed module from the item numbers answered right. A2: 1 point per item × 1.25 (25 per module). B1: the raw point
 * per item per Teil, the module total converted to /100.
 */
export function goetheClosed(exam: GoetheExam, skill: "lesen" | "hoeren", right: Set<number>) {
  const b1 = isGoetheB1(exam)
  const per = b1 ? 1 : 1.25
  const parts = TEILE[b1 ? "B1" : "A2"]
    .filter((t) => t.skill === skill)
    .map((t) => {
      const hits = Array.from({ length: t.items }, (_, i) => t.first + i).filter((n) => right.has(n)).length
      return { label: `Teil ${t.teil}`, points: hits * per, max: t.items * per }
    })
  const raw = parts.reduce((n, p) => n + p.points, 0)
  return b1 ? { points: b1Scaled(raw), max: 100, parts } : { points: raw, max: 25, parts }
}

// ---- Schreiben ----

/** A2, one task (max 10): Aufgabenerfüllung + Sprache. E in AE, fewer than half the words (`min`) or off topic → 0. */
export function goetheA2Task(s: { ae: Step; sprache: Step }, t: { words: number; min: number; offTopic?: boolean }) {
  if (s.ae === "E" || t.words < t.min || t.offTopic) return 0
  return A2_FIVE[s.ae] + A2_FIVE[s.sprache]
}

/** One A2 Schreiben criterion (Aufgabenerfüllung or Sprache), 5 / 3.5 / 2 / 0.5 / 0. */
export const a2WritingPoints = (s: Step) => A2_FIVE[s]

/** A2 module: raw points of both tasks rounded to whole points, then × 1.25 (max 25). */
export function goetheA2Writing(tasks: number[]) {
  const raw = roundHalfUp(tasks.reduce((n, p) => n + p, 0))
  return { raw, points: raw * 1.25, max: 25 }
}

export type B1WritingSteps = { erfuellung: Step; kohaerenz: Step; wortschatz: Step; strukturen: Step }
export const B1_WRITING_CRITERIA: Record<keyof B1WritingSteps, string> = { erfuellung: "Erfüllung", kohaerenz: "Kohärenz", wortschatz: "Wortschatz", strukturen: "Strukturen" }
/** Maxima per criterion: Aufgabe 1 and 2 10 each (40), Aufgabe 3 4/4/6/6 (20). */
export const B1_WRITING_MAX: Record<1 | 2 | 3, Record<keyof B1WritingSteps, number>> = {
  1: { erfuellung: 10, kohaerenz: 10, wortschatz: 10, strukturen: 10 },
  2: { erfuellung: 10, kohaerenz: 10, wortschatz: 10, strukturen: 10 },
  3: { erfuellung: 4, kohaerenz: 4, wortschatz: 6, strukturen: 6 },
}
/** The word guidance per Aufgabe (ca. 80 / 80 / 40); below half of it the Aufgabe scores 0. */
export const B1_WRITING_WORDS: Record<1 | 2 | 3, number> = { 1: 80, 2: 80, 3: 40 }

export const b1CriterionPoints = (aufgabe: 1 | 2 | 3, k: keyof B1WritingSteps, s: Step) => B1_WRITING_MAX[aufgabe][k] * SHARE[s]

/** B1, one Aufgabe. E in Erfüllung, fewer than half the words or off topic → 0. */
export function goetheB1Task(aufgabe: 1 | 2 | 3, s: B1WritingSteps, t: { words: number; offTopic?: boolean }) {
  if (s.erfuellung === "E" || t.words < B1_WRITING_WORDS[aufgabe] / 2 || t.offTopic) return 0
  return (Object.keys(s) as (keyof B1WritingSteps)[]).reduce((n, k) => n + b1CriterionPoints(aufgabe, k, s[k]), 0)
}

/** B1 module (max 100): Goethe rounds half up, ÖSD rounds decimals up. */
export function goetheB1Writing(exam: "goethe-b1" | "oesd-b1", tasks: number[]) {
  const sum = tasks.reduce((n, p) => n + p, 0)
  return { points: exam === "oesd-b1" ? Math.ceil(sum - 1e-9) : roundHalfUp(sum), max: 100 }
}

// ---- Sprechen ----

export type A2SpeakingSteps = { ae: Step; sprache: Step }
export const A2_SPEAKING_TEILE: Record<1 | 2 | 3, string> = { 1: "Fragen zur Person", 2: "Von sich erzählen", 3: "Gemeinsam etwas planen" }
/** Per candidate: T1 2 + 2, T2 4 + 4, T3 4 + 4, Aussprache 5 over the whole exam (25). */
export const A2_SPEAKING_MAX: Record<1 | 2 | 3, number> = { 1: 2, 2: 4, 3: 4 }
/** One A2 Sprechen criterion of a Teil (Aufgabenerfüllung or Sprache). */
export const a2SpeakingPoints = (teil: 1 | 2 | 3, s: Step) => A2_SPEAKING_MAX[teil] * SHARE[s]

export function goetheA2Speaking(teile: Record<1 | 2 | 3, A2SpeakingSteps>, aussprache: Step) {
  const parts = ([1, 2, 3] as const).map((teil) => {
    const s = teile[teil]
    const max = A2_SPEAKING_MAX[teil]
    const points = s.ae === "E" ? 0 : max * SHARE[s.ae] + max * SHARE[s.sprache]
    return { label: `Teil ${teil}: ${A2_SPEAKING_TEILE[teil]}`, points, max: 2 * max }
  })
  parts.push({ label: "Aussprache", points: A2_FIVE[aussprache], max: 5 })
  return { points: roundHalfUp(parts.reduce((n, p) => n + p.points, 0)), max: 25, parts }
}

export type B1SpeakingT1 = { erfuellung: Step; interaktion: Step; wortschatz: Step; strukturen: Step }
export type B1SpeakingT2 = { erfuellung: Step; kohaerenz: Step; wortschatz: Step; strukturen: Step }
export const B1_SPEAKING_TEILE: Record<1 | 2 | 3, string> = { 1: "Gemeinsam etwas planen", 2: "Ein Thema präsentieren", 3: "Über ein Thema sprechen" }
export const B1_SPEAKING_CRITERIA = { erfuellung: "Erfüllung", interaktion: "Interaktion", kohaerenz: "Kohärenz", wortschatz: "Wortschatz/Register", strukturen: "Strukturen" } as const
/** T1 28 (8/4/8/8), T2 40 (12/4/12/12), T3 16 (Erfüllung), Aussprache 16 = 100. */
export const B1_SPEAKING_MAX = {
  1: { erfuellung: 8, interaktion: 4, wortschatz: 8, strukturen: 8 },
  2: { erfuellung: 12, kohaerenz: 4, wortschatz: 12, strukturen: 12 },
  3: 16,
  aussprache: 16,
} as const

export const b1SpeakingPoints = (max: number, s: Step) => max * SHARE[s]

export function goetheB1Speaking(s: { 1: B1SpeakingT1; 2: B1SpeakingT2; 3: Step; aussprache: Step }) {
  const sum = <T extends Record<string, Step>>(steps: T, max: Record<keyof T, number>) => (Object.keys(steps) as (keyof T)[]).reduce((n, k) => n + max[k] * SHARE[steps[k]], 0)
  const parts = [
    { label: `Teil 1: ${B1_SPEAKING_TEILE[1]}`, points: sum(s[1], B1_SPEAKING_MAX[1]), max: 28 },
    { label: `Teil 2: ${B1_SPEAKING_TEILE[2]}`, points: sum(s[2], B1_SPEAKING_MAX[2]), max: 40 },
    { label: `Teil 3: ${B1_SPEAKING_TEILE[3]}`, points: 16 * SHARE[s[3]], max: 16 },
    { label: "Aussprache", points: 16 * SHARE[s.aussprache], max: 16 },
  ]
  return { points: roundHalfUp(parts.reduce((n, p) => n + p.points, 0)), max: 100, parts }
}

/** Teil 2 Erfüllung from the slides covered: all 5 → A, 3–4 → B, 2 or all too brief → C, 1 → D, none → E. */
export function slidesStep(covered: number, brief = false): Step {
  if (covered <= 0) return "E"
  if (covered === 1) return "D"
  if (covered === 2 || brief) return "C"
  return covered >= 5 ? "A" : "B"
}

/** Speaking and writing preparation in minutes (B1: 15 alone with notes; A2: none). */
export const GOETHE_SPEAKING_PREP_MINUTES: Record<GoetheExam, number> = { "goethe-a2": 0, "goethe-b1": 15, "oesd-b1": 15 }
