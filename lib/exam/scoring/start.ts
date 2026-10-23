// Start Deutsch 1 / telc Deutsch A1 and telc Deutsch A2 (research/start-deutsch-1.md §3–4, research/telc-a2.md §2–6):
// 15 points per skill, 60 in all; telc grades from 36 up, below that "teilgenommen". Every rated task is full / half /
// zero. Typed answers tolerate spelling but every number must be exact (telc Übungstests, Bewertung Schreiben Teil 1).

export type Grade = "full" | "half" | "none"
export type StartExam = "start-deutsch-1" | "telc-a2"

export const START_EXAMS: readonly StartExam[] = ["start-deutsch-1", "telc-a2"]
export const isStartExam = (exam: string): exam is StartExam => (START_EXAMS as readonly string[]).includes(exam)

const SHARE: Record<Grade, number> = { full: 1, half: 0.5, none: 0 }

export const ratedPoints = (tasks: { max: number; grade: Grade }[]) => tasks.reduce((n, t) => n + t.max * SHARE[t.grade], 0)

const fold = (s: string) =>
  s
    .toLowerCase()
    .replace(/ä/g, "ae")
    .replace(/ö/g, "oe")
    .replace(/ü/g, "ue")
    .replace(/ß/g, "ss")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
const digits = (s: string) => s.replace(/\D/g, "")
const letters = (s: string) => fold(s).replace(/[^a-z]/g, "")

function distance(a: string, b: string) {
  const row = Array.from({ length: b.length + 1 }, (_, j) => j)
  for (let i = 1; i <= a.length; i++) {
    let prev = row[0]
    row[0] = i
    for (let j = 1; j <= b.length; j++) {
      const keep = row[j]
      row[j] = Math.min(row[j] + 1, row[j - 1] + 1, prev + (a[i - 1] === b[j - 1] ? 0 : 1))
      prev = keep
    }
  }
  return row[b.length]
}

/** Spelling slack grows with the word: none up to 3 letters, 1 up to 7, then 2. */
const slack = (n: number) => (n <= 3 ? 0 : n <= 7 ? 1 : 2)

export function typedRight(answer: string, correct: string, accept: string[] = []) {
  if (!answer.trim()) return false
  return [correct, ...accept].some((c) => {
    if (digits(answer) !== digits(c)) return false
    const want = letters(c)
    return distance(letters(answer), want) <= slack(want.length)
  })
}

/** Schreiben Teil 2 (max 10): the best three content points × 3, plus 1 for text type (greeting, closing). */
export const writingTeil2 = (points: Grade[], form: Grade) =>
  [...points]
    .map((g) => 3 * SHARE[g])
    .sort((a, b) => b - a)
    .slice(0, 3)
    .reduce((n, p) => n + p, 0) + SHARE[form]

/** The rated tasks of each Sprechen Teil per candidate: 3 / 6 / 6. */
export const START_SPEAKING: Record<StartExam, { teil: 1 | 2 | 3; key: string; label: string; max: number }[]> = {
  "start-deutsch-1": [
    { teil: 1, key: "vorstellen", label: "Sich vorstellen", max: 1 },
    { teil: 1, key: "buchstabieren", label: "Buchstabieren", max: 1 },
    { teil: 1, key: "zahl", label: "Eine Zahl nennen", max: 1 },
    { teil: 2, key: "frage1", label: "Frage zum ersten Thema", max: 2 },
    { teil: 2, key: "antwort1", label: "Antwort zum ersten Thema", max: 1 },
    { teil: 2, key: "frage2", label: "Frage zum zweiten Thema", max: 2 },
    { teil: 2, key: "antwort2", label: "Antwort zum zweiten Thema", max: 1 },
    { teil: 3, key: "bitte1", label: "Erste Bitte", max: 2 },
    { teil: 3, key: "reaktion1", label: "Reaktion auf die erste Bitte", max: 1 },
    { teil: 3, key: "bitte2", label: "Zweite Bitte", max: 2 },
    { teil: 3, key: "reaktion2", label: "Reaktion auf die zweite Bitte", max: 1 },
  ],
  "telc-a2": [
    { teil: 1, key: "vorstellen", label: "Sich vorstellen", max: 1 },
    { teil: 1, key: "zusatz1", label: "Erste Frage der Prüferin", max: 1 },
    { teil: 1, key: "zusatz2", label: "Zweite Frage der Prüferin", max: 1 },
    { teil: 2, key: "frage1", label: "Erste Frage", max: 1 },
    { teil: 2, key: "antwort1", label: "Erste Antwort", max: 1 },
    { teil: 2, key: "frage2", label: "Zweite Frage", max: 1 },
    { teil: 2, key: "antwort2", label: "Zweite Antwort", max: 1 },
    { teil: 2, key: "frage3", label: "Dritte Frage", max: 1 },
    { teil: 2, key: "antwort3", label: "Dritte Antwort", max: 1 },
    { teil: 3, key: "aufgabe", label: "Erfüllung der Aufgabenstellung", max: 3 },
    { teil: 3, key: "sprache", label: "Sprachliche Realisierung", max: 3 },
  ],
}

export const START_SPEAKING_TEILE: Record<StartExam, Record<1 | 2 | 3, string>> = {
  "start-deutsch-1": { 1: "Sich vorstellen", 2: "Um Informationen bitten und Informationen geben", 3: "Bitten formulieren und darauf reagieren" },
  "telc-a2": { 1: "Sich vorstellen", 2: "Ein Alltagsgespräch führen", 3: "Etwas aushandeln" },
}

/** telc grades out of 60 (0.5 steps); below 36 the certificate says "teilgenommen". */
export function startGrade(points: number) {
  return points >= 54 ? "sehr gut" : points >= 48 ? "gut" : points >= 42 ? "befriedigend" : points >= 36 ? "ausreichend" : "teilgenommen"
}

/** Lesen and Schreiben share one block in the written exam (minutes). */
export const START_BLOCK_MINUTES: Record<StartExam, number> = { "start-deutsch-1": 45, "telc-a2": 50 }
