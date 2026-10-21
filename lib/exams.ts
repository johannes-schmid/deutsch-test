// The exams on /gratis-test. Formats and merges come from research/*.md; an exam goes live only when it has reviewed content.

export const LEVELS = ["A1", "A2", "B1"] as const
export type Level = (typeof LEVELS)[number]

export const EXAM_IDS = ["start-deutsch-1", "oesd-a1", "goethe-a2", "telc-a2", "oesd-a2", "goethe-b1", "oesd-b1", "telc-b1", "dtz"] as const
export type ExamId = (typeof EXAM_IDS)[number]

/** Who runs the exam; drives the badge on the overview (ExamMark). */
export type Brand = "goethe" | "telc" | "oesd" | "sd1" | "dtz"

export type Exam = {
  name: string
  /** For tight spots like the portal sidebar; falls back to `name`. */
  short?: string
  provider: string
  brand: Brand
  /** Every level the exam can certify; the overview lists it under each. */
  levels: Level[]
  summary: string
  /** The official result format, which the practice result copies (research/<exam>.md). */
  result: string
  /** Points-scored exams: the pass mark as a share of the points. Absent on the DTZ, which reports a level. */
  pass?: number
}

export const EXAMS: Record<ExamId, Exam> = {
  "start-deutsch-1": {
    name: "Start Deutsch 1",
    provider: "Goethe-Institut · telc",
    brand: "sd1",
    levels: ["A1"],
    summary: "Goethe-Zertifikat A1 und telc Deutsch A1: gemeinsam entwickelt, gleiche Aufgaben",
    result: "bestanden / nicht bestanden",
    // research/start-deutsch-1.md §4: 60 % of all points, no minimum per skill.
    pass: 0.6,
  },
  "oesd-a1": {
    name: "ÖSD Zertifikat A1",
    provider: "ÖSD · Österreich",
    brand: "oesd",
    levels: ["A1"],
    summary: "Mit Sprecherinnen und Sprechern aus Österreich, Deutschland und der Schweiz",
    result: "bestanden / nicht bestanden",
    // research/oesd-a1.md §6: 50 of 100 overall (38/75 written, 12/25 oral).
    pass: 0.5,
  },
  "goethe-a2": {
    name: "Goethe-Zertifikat A2",
    provider: "Goethe-Institut",
    brand: "goethe",
    levels: ["A2"],
    summary: "Hören, Lesen, Schreiben und Sprechen zu zweit",
    result: "bestanden / nicht bestanden",
    // research/goethe-a2.md §6: 60 of 100, with at least 45/75 written and 15/25 oral.
    pass: 0.6,
  },
  "telc-a2": {
    name: "telc Deutsch A2",
    provider: "telc",
    brand: "telc",
    levels: ["A2"],
    summary: "Auch Start Deutsch 2 genannt. Lesen und Schreiben in einem Block",
    result: "bestanden / nicht bestanden",
    // research/telc-a2.md §6: 36 of 60.
    pass: 0.6,
  },
  "oesd-a2": {
    name: "ÖSD Zertifikat A2",
    provider: "ÖSD · Österreich",
    brand: "oesd",
    levels: ["A2"],
    summary: "Mit Sprecherinnen und Sprechern aus Österreich, Deutschland und der Schweiz",
    result: "bestanden / nicht bestanden",
    // research/oesd-a2.md §6: 45 of 90 overall (35/70 written, 10/20 oral).
    pass: 0.5,
  },
  "goethe-b1": {
    name: "Goethe-Zertifikat B1",
    provider: "Goethe-Institut",
    brand: "goethe",
    levels: ["B1"],
    summary: "Vier Module, die du einzeln machen kannst. Gleiche Aufgaben wie das ÖSD Zertifikat B1",
    result: "bestanden / nicht bestanden pro Modul",
    // research/goethe-oesd-b1.md §4: 60 of 100 per module, no compensation between modules.
    pass: 0.6,
  },
  "oesd-b1": {
    name: "ÖSD Zertifikat B1",
    provider: "ÖSD · Österreich",
    brand: "oesd",
    levels: ["B1"],
    summary: "Mit Stimmen aus Österreich und der Schweiz. Gleiche Aufgaben wie das Goethe-Zertifikat B1",
    result: "bestanden / nicht bestanden pro Modul",
    pass: 0.6,
  },
  "telc-b1": {
    name: "telc Deutsch B1",
    provider: "telc",
    brand: "telc",
    levels: ["B1"],
    summary: "Auch Zertifikat Deutsch genannt. Mit Sprachbausteinen",
    result: "bestanden / nicht bestanden",
    // research/telc-b1.md §4: 60 % written (135/225) and 60 % oral (45/75).
    pass: 0.6,
  },
  dtz: {
    name: "Deutsch-Test für Zuwanderer (DTZ)",
    short: "DTZ",
    provider: "telc · g.a.s.t.",
    brand: "dtz",
    levels: ["A2", "B1"],
    summary: "Die Prüfung am Ende vom Integrationskurs",
    result: "B1, A2 oder unter A2",
  },
}

export const examPath = (id: ExamId) => `/gratis-test/${id}`

/** The portal page for an exam, or one of its skills. Client-safe, unlike the rest of lib/portal.ts. */
export const portalPath = (exam: ExamId, skill?: string) => (skill ? `/dashboard/${exam}/${skill}` : `/dashboard/${exam}`)
