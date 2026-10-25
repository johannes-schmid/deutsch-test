// ÖSD Zertifikat A1 (ZA1) and A2 (ZA2): the official scoring (research/oesd-a1.md §2–6, research/oesd-a2.md §2–6, both
// verified against the 2026 Modellsätze and Bewertungsbögen on 2026-10-24). The result is points per module with the
// subtest minimums, bestanden / nicht bestanden and a Prädikat, labelled as a practice result. Never a level.

import type { ItemKey } from "@/lib/exam/kurztest"
import { ticks } from "@/lib/exam/types"
import { typedRight } from "./start"

export type OesdExam = "oesd-a1" | "oesd-a2"
export const OESD_EXAM_IDS: readonly OesdExam[] = ["oesd-a1", "oesd-a2"]
export const isOesdExam = (exam: string): exam is OesdExam => (OESD_EXAM_IDS as readonly string[]).includes(exam)

const fold = (s: string) => s.toLowerCase().replace(/ä/g, "ae").replace(/ö/g, "oe").replace(/ü/g, "ue").replace(/ß/g, "ss").replace(/[^a-z0-9]/g, "")

/** A spelled word or a phone number: every letter and digit right (case, spaces and dashes don't count). */
export const exactRight = (answer: string, correct: string, accept: string[] = []) => !!answer.trim() && [correct, ...accept].some((c) => fold(answer) === fold(c))

/** Typed answers: exact where the exam says so, else with spelling tolerance (digits always exact). */
export const typedOesd = (answer: string, k: Pick<ItemKey, "correct" | "accept" | "exact">) => (k.exact ? exactRight(answer, String(k.correct), k.accept) : typedRight(answer, String(k.correct), k.accept))

/** ZA2 Hören Aufgabe 3, per row (max 2): all right → 2; one error (an extra or a missing tick) → 1; more, or every box or
 * no box ticked → 0. TODO(hannes): unverified whether one missing tick (no wrong one) scores 1; the key names only "one
 * wrong extra tick". */
export function gridRowPoints(chosen: string[], correct: string[], columns: number) {
  if (!chosen.length || chosen.length >= columns) return 0
  const wrong = chosen.filter((c) => !correct.includes(c)).length
  const missing = correct.filter((c) => !chosen.includes(c)).length
  const errors = wrong + missing
  return errors === 0 ? 2 : errors === 1 ? 1 : 0
}

/** ZA2 Hören Aufgabe 1 (max 10): 4 right → 10, 3 → 7, 2 → 4, 1 → 1; five marks cost 3 points; more than five → 0. */
export function marksPoints(marked: string[], correct: string[]) {
  if (marked.length > 5) return 0
  const hits = marked.filter((m) => correct.includes(m)).length
  const base = [0, 1, 4, 7, 10][Math.min(hits, 4)]
  return Math.max(0, base - (marked.length === 5 ? 3 : 0))
}

/** A tick group with several right boxes (ZA1 form, 2 of 4): one point per right box, 0 if any box is wrong. */
export function tickGroupPoints(chosen: string[], correct: string[]) {
  if (chosen.some((c) => !correct.includes(c))) return 0
  return chosen.filter((c) => correct.includes(c)).length
}

/** ZA1 Schreiben Aufgabe 1, the raw count: one per field, a two-tick group (`pick`) one per right box (10 in all). */
export function formRight(fields: { n: number; options: string[]; pick?: number }[], keys: Pick<ItemKey, "n" | "correct" | "accept" | "exact">[], given: Record<number, string>) {
  return keys.reduce((sum, k) => {
    const f = fields.find((x) => x.n === k.n)
    if (!f) return sum
    const a = given[k.n] ?? ""
    if (f.pick) return sum + tickGroupPoints(ticks(a), ticks(String(k.correct)))
    if (f.options.length) return sum + (a === k.correct ? 1 : 0)
    return sum + (typedOesd(a, k) ? 1 : 0)
  }, 0)
}

/** ZA1 Schreiben Aufgabe 1 (max 5 of 10 form points): 10 → 5, 9–8 → 4, 7–6 → 3, 5–4 → 2, 3–2 → 1, 1–0 → 0. */
export const formPoints = (right: number) => Math.floor(Math.max(0, Math.min(10, right)) / 2)

type Rule = "x2" | "a1lesen2" | "x3" | "marks" | "rows"
type Teil = { exam: OesdExam; skill: "lesen" | "hoeren"; teil: number; label: string; first: number; items: number; rule: Rule; max: number }

/** Every closed Aufgabe with its conversion rule. ZA1: 5 right → 10, −2 per error (Lesen 2: 6 → 10 … 1–0 → 0).
 * ZA2: Lesen 1 3 per item, Lesen 2 2 per item, Hören 1 the 4-of-8 table, Hören 2 2 per item, Hören 3 2/1/0 per row. */
export const OESD_TEILE: Teil[] = [
  { exam: "oesd-a1", skill: "lesen", teil: 1, label: "Lesen Aufgabe 1", first: 1, items: 5, rule: "x2", max: 10 },
  { exam: "oesd-a1", skill: "lesen", teil: 2, label: "Lesen Aufgabe 2", first: 6, items: 6, rule: "a1lesen2", max: 10 },
  { exam: "oesd-a1", skill: "lesen", teil: 3, label: "Lesen Aufgabe 3", first: 12, items: 5, rule: "x2", max: 10 },
  { exam: "oesd-a1", skill: "hoeren", teil: 1, label: "Hören Aufgabe 1", first: 1, items: 5, rule: "x2", max: 10 },
  { exam: "oesd-a1", skill: "hoeren", teil: 2, label: "Hören Aufgabe 2", first: 6, items: 5, rule: "x2", max: 10 },
  { exam: "oesd-a1", skill: "hoeren", teil: 3, label: "Hören Aufgabe 3", first: 11, items: 5, rule: "x2", max: 10 },
  { exam: "oesd-a2", skill: "lesen", teil: 1, label: "Lesen Aufgabe 1", first: 1, items: 5, rule: "x3", max: 15 },
  { exam: "oesd-a2", skill: "lesen", teil: 2, label: "Lesen Aufgabe 2", first: 6, items: 5, rule: "x2", max: 10 },
  { exam: "oesd-a2", skill: "hoeren", teil: 1, label: "Hören Aufgabe 1", first: 1, items: 4, rule: "marks", max: 10 },
  { exam: "oesd-a2", skill: "hoeren", teil: 2, label: "Hören Aufgabe 2", first: 5, items: 5, rule: "x2", max: 10 },
  { exam: "oesd-a2", skill: "hoeren", teil: 3, label: "Hören Aufgabe 3", first: 10, items: 5, rule: "rows", max: 10 },
]

/** What one item is: a plain item, a row of a multi-tick grid, or one of the boxes of a mark-N-of-M group. */
export type OesdItem = { n: number; kind: "plain" | "row" | "marks"; columns?: number; group?: number[]; typed?: boolean }

export type OesdClosed = { right: Map<number, boolean>; parts: { label: string; points: number; max: number }[]; points: number; max: number }

/** Scores a closed subtest: which items are right (for the per-item review) and the official points per Aufgabe. */
export function scoreOesdClosed(exam: OesdExam, skill: "lesen" | "hoeren", items: OesdItem[], keys: Pick<ItemKey, "n" | "correct" | "accept" | "exact">[], answers: Record<number, string>): OesdClosed {
  const keyOf = (n: number) => keys.find((k) => k.n === n)
  const item = (n: number) => items.find((i) => i.n === n)
  const right = new Map<number, boolean>()
  const rowPts = new Map<number, number>()
  for (const k of keys) {
    const it = item(k.n)
    const a = answers[k.n] ?? ""
    if (it?.kind === "row") {
      const p = gridRowPoints(ticks(a), ticks(String(k.correct)), it.columns ?? 5)
      rowPts.set(k.n, p)
      right.set(k.n, p === 2)
    } else if (it?.kind === "marks") right.set(k.n, ticks(a).length <= 5 && ticks(a).includes(String(k.correct)))
    else if (it?.typed) right.set(k.n, typedOesd(a, k))
    else right.set(k.n, !!a && a === String(k.correct))
  }
  const parts = OESD_TEILE.filter((t) => t.exam === exam && t.skill === skill).map((t) => {
    const ns = Array.from({ length: t.items }, (_, i) => t.first + i)
    const hits = ns.filter((n) => right.get(n)).length
    let points = 0
    if (t.rule === "x2") points = 2 * hits
    else if (t.rule === "x3") points = 3 * hits
    else if (t.rule === "a1lesen2") points = Math.max(0, 2 * hits - 2)
    else if (t.rule === "rows") points = ns.reduce((n, x) => n + (rowPts.get(x) ?? 0), 0)
    else {
      const marked = ticks(answers[ns[0]] ?? "")
      points = marksPoints(marked, ns.map((n) => String(keyOf(n)?.correct ?? "")))
    }
    return { label: t.label, points, max: t.max }
  })
  return { right, parts, points: parts.reduce((n, p) => n + p.points, 0), max: parts.reduce((n, p) => n + p.max, 0) }
}

// ---- Schreiben ----

/** ZA1 Schreiben Aufgabe 2 (Auswertungsbogen Vers. 6.0, max 10). `answered`: questions answered properly (0–3).
 * Below 15 words or off topic the task scores 0 ("n. b."). Deductions never go below 0. */
export function za1Writing(r: { words: number; answered: number; offTopic?: boolean; k: number; t: number; l: number; f: number }) {
  if (r.offTopic || r.words < 15) return { points: 0, max: 10, nb: true }
  const tl = r.words >= 25 ? 0 : r.words >= 20 ? 1 : 2
  const a = r.answered >= 3 ? 0 : r.answered === 2 ? 1 : 2
  const sum = clamp(r.k, 1) + clamp(r.t, 1) + clamp(r.l, 4) + clamp(r.f, 4)
  return { points: Math.max(0, sum - tl - a), max: 10, nb: false }
}

/** ZA2 Schreiben (Auswertungsbogen Vers. 4.0, max 15). `content`: "extra" (all 4 + own content, +1), "all", "three"
 * (−1), "two" (−2), "under-half" (task 0). Below 26 words the task scores 0. */
export function za2Writing(r: { words: number; content: "extra" | "all" | "three" | "two" | "under-half"; k: number; t: number; l: number; f: number }) {
  if (r.content === "under-half" || r.words < 26) return { points: 0, max: 15, nb: true }
  const tl = r.words >= 40 ? 0 : r.words >= 36 ? 1 : r.words >= 31 ? 2 : 3
  const a = { extra: 1, all: 0, three: -1, two: -2 }[r.content]
  const sum = clamp(r.k, 2) + clamp(r.t, 2) + clamp(r.l, 5) + clamp(r.f, 5)
  return { points: Math.min(15, Math.max(0, sum + a - tl)), max: 15, nb: false }
}

const clamp = (v: number, max: number) => Math.max(0, Math.min(max, Math.round(v)))

// ---- Sprechen ----

/** Rating criteria and maxima (Auswertungsbogen Mündlich Vers. 4.0): ZA1 25, ZA2 20. */
export const OESD_SPEAKING: Record<OesdExam, { name: string; max: number }[]> = {
  "oesd-a1": [
    { name: "Aufgabe 1: Aufgabenerfüllung", max: 4 },
    { name: "Aufgabe 2: Aufgabenerfüllung", max: 4 },
    { name: "Aufgabe 3: Aufgabenerfüllung, kommunikativ", max: 4 },
    { name: "Ausdruck, Wortschatz", max: 5 },
    { name: "Verständlichkeit, Aussprache/Intonation, Flüssigkeit", max: 4 },
    { name: "Formale Richtigkeit", max: 4 },
  ],
  "oesd-a2": [
    { name: "Aufgabe 1: Aufgabenerfüllung, Textproduktion", max: 3 },
    { name: "Aufgabe 2: Aufgabenerfüllung, kommunikativ", max: 3 },
    { name: "Ausdruck, Wortschatz", max: 5 },
    { name: "Verständlichkeit, Aussprache/Intonation, Flüssigkeit", max: 4 },
    { name: "Formale Richtigkeit", max: 5 },
  ],
}

export const speakingPoints = (exam: OesdExam, scores: number[]) => OESD_SPEAKING[exam].reduce((n, c, i) => n + clamp(scores[i] ?? 0, c.max), 0)

// ---- Module results ----

export type Praedikat = "sehr gut" | "gut" | "bestanden" | "nicht bestanden"
type Band = { from: number; grade: Praedikat }
const grade = (points: number, bands: Band[]): Praedikat => bands.find((b) => points >= b.from)?.grade ?? "nicht bestanden"

/** Gesamtbogen Vers. 3.0 (5 Jun 2026): maxima, subtest minimums and Prädikat bands per module. */
const MODULES = {
  "oesd-a1": {
    written: { max: 75, pass: 38, minima: { lesen: [30, 6], hoeren: [30, 6], schreiben: [15, 4] }, bands: [{ from: 66, grade: "sehr gut" }, { from: 56, grade: "gut" }, { from: 38, grade: "bestanden" }] },
    oral: { max: 25, pass: 12, bands: [{ from: 22, grade: "sehr gut" }, { from: 19, grade: "gut" }, { from: 12, grade: "bestanden" }] },
    overall: { max: 100, pass: 50, bands: [{ from: 88, grade: "sehr gut" }, { from: 75, grade: "gut" }, { from: 50, grade: "bestanden" }] },
  },
  "oesd-a2": {
    written: { max: 70, pass: 35, minima: { lesen: [25, 5], hoeren: [30, 6], schreiben: [15, 3] }, bands: [{ from: 62, grade: "sehr gut" }, { from: 50, grade: "gut" }, { from: 35, grade: "bestanden" }] },
    oral: { max: 20, pass: 10, bands: [{ from: 18, grade: "sehr gut" }, { from: 15, grade: "gut" }, { from: 10, grade: "bestanden" }] },
    overall: { max: 90, pass: 45, bands: [{ from: 80, grade: "sehr gut" }, { from: 64, grade: "gut" }, { from: 45, grade: "bestanden" }] },
  },
} as const satisfies Record<OesdExam, unknown>

export type ModuleResult = { points: number; max: number; passed: boolean; grade: Praedikat; missed: string[] }

/** The written module: Lesen + Hören + Schreiben. Passed with the module minimum and every subtest minimum. */
export function writtenModule(exam: OesdExam, p: { lesen: number; hoeren: number; schreiben: number }): ModuleResult {
  const m = MODULES[exam].written
  const points = p.lesen + p.hoeren + p.schreiben
  const missed = (Object.entries(m.minima) as [keyof typeof p, readonly [number, number]][]).filter(([k, [, min]]) => p[k] < min).map(([k, [, min]]) => `${k} ${p[k]} < ${min}`)
  if (points < m.pass) missed.unshift(`gesamt ${points} < ${m.pass}`)
  const passed = !missed.length
  return { points, max: m.max, passed, grade: passed ? grade(points, [...m.bands]) : "nicht bestanden", missed }
}

/** The oral module (Sprechen). */
export function oralModule(exam: OesdExam, points: number): ModuleResult {
  const m = MODULES[exam].oral
  const passed = points >= m.pass
  return { points, max: m.max, passed, grade: passed ? grade(points, [...m.bands]) : "nicht bestanden", missed: passed ? [] : [`sprechen ${points} < ${m.pass}`] }
}

/** A module's pass mark as a share of its points (ZA1 written 38/75, oral 12/25; ZA2 35/70, 10/20). */
export const moduleShare = (exam: OesdExam, module: "written" | "oral") => MODULES[exam][module].pass / MODULES[exam][module].max

/** Preparation before the oral module, alone with notes (ZA1 and ZA2: 10 minutes). */
export const OESD_SPEAKING_PREP_MINUTES = 10

/** The optional overall result: both modules passed and the overall minimum reached. */
export function overallResult(exam: OesdExam, written: ModuleResult, oral: ModuleResult): ModuleResult {
  const m = MODULES[exam].overall
  const points = written.points + oral.points
  const missed = [...written.missed, ...oral.missed, ...(points < m.pass ? [`gesamt ${points} < ${m.pass}`] : [])]
  const passed = written.passed && oral.passed && points >= m.pass
  return { points, max: m.max, passed, grade: passed ? grade(points, [...m.bands]) : "nicht bestanden", missed }
}
