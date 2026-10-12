// The exams on /gratis-test. Formats and merges come from research/*.md; an exam goes live only when it has reviewed content.

export const LEVELS = ["A1", "A2", "B1"] as const
export type Level = (typeof LEVELS)[number]

export const EXAM_IDS = ["start-deutsch-1", "oesd-a1", "goethe-a2", "telc-a2", "oesd-a2", "goethe-oesd-b1", "telc-b1", "dtz"] as const
export type ExamId = (typeof EXAM_IDS)[number]

export type Exam = {
  name: string
  provider: string
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
    levels: ["A1"],
    summary: "Goethe-Zertifikat A1 und telc Deutsch A1: gemeinsam entwickelt, gleiche Aufgaben",
    result: "bestanden / nicht bestanden",
    // research/start-deutsch-1.md §4: 60 % of all points, no minimum per skill.
    pass: 0.6,
  },
  "oesd-a1": {
    name: "ÖSD Zertifikat A1",
    provider: "ÖSD",
    levels: ["A1"],
    summary: "Mit Sprecherinnen und Sprechern aus Österreich, Deutschland und der Schweiz",
    result: "bestanden / nicht bestanden",
  },
  "goethe-a2": {
    name: "Goethe-Zertifikat A2",
    provider: "Goethe-Institut",
    levels: ["A2"],
    summary: "Hören, Lesen, Schreiben und Sprechen zu zweit",
    result: "bestanden / nicht bestanden",
  },
  "telc-a2": {
    name: "telc Deutsch A2",
    provider: "telc",
    levels: ["A2"],
    summary: "Hören, Lesen, Schreiben und Sprechen zu zweit",
    result: "bestanden / nicht bestanden",
  },
  "oesd-a2": {
    name: "ÖSD Zertifikat A2",
    provider: "ÖSD",
    levels: ["A2"],
    summary: "Mit Sprecherinnen und Sprechern aus Österreich, Deutschland und der Schweiz",
    result: "bestanden / nicht bestanden",
  },
  "goethe-oesd-b1": {
    name: "Goethe-Zertifikat B1 · ÖSD Zertifikat B1",
    provider: "Goethe-Institut · ÖSD",
    levels: ["B1"],
    summary: "Gemeinsam entwickelt, gleiche Aufgaben. Vier Module, die du einzeln machen kannst",
    result: "bestanden / nicht bestanden pro Modul",
  },
  "telc-b1": {
    name: "telc Deutsch B1",
    provider: "telc",
    levels: ["B1"],
    summary: "Auch Zertifikat Deutsch genannt. Mit Sprachbausteinen",
    result: "bestanden / nicht bestanden",
  },
  dtz: {
    name: "Deutsch-Test für Zuwanderer (DTZ)",
    provider: "telc · g.a.s.t.",
    levels: ["A2", "B1"],
    summary: "Die Prüfung am Ende vom Integrationskurs",
    result: "B1, A2 oder unter A2",
  },
}

export const examPath = (id: ExamId) => `/gratis-test/${id}`
