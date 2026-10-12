import "server-only"
import { indicativeLevel } from "@/lib/exam/band"
import { itemNumbers } from "@/lib/exam/kurztest"
import { EXAMS, type ExamId } from "@/lib/exams"
import { loadSet } from "./data"
import type { ClosedResult, Outcome } from "./types"

/** The DTZ maps to a level; points-scored exams compare against their pass mark. */
export function outcome(exam: ExamId, points: number, max: number): Outcome {
  const pass = EXAMS[exam].pass
  if (pass === undefined) return { level: indicativeLevel(points, max) }
  return { score: { points, max }, passed: max > 0 && points / max >= pass }
}

export function scoreClosed(exam: ExamId, skill: "lesen" | "hoeren", answers: Record<number, string>): ClosedResult {
  const blocks = loadSet(exam, skill)
  const keys = blocks.flatMap((b) => b.key.answers)
  const right = (n: number) => answers[n] !== undefined && answers[n] === keys.find((k) => k.n === n)?.correct
  const teile = [...new Set(blocks.map((b) => b.teil))].map((teil) => ({
    label: `Teil ${teil}`,
    items: blocks.filter((b) => b.teil === teil).flatMap((b) => itemNumbers(b.display.items)).map((n) => ({ n, right: right(n) })),
  }))
  const correct = keys.filter((k) => right(k.n)).length
  const transcripts = Object.fromEntries(
    blocks.filter((b) => b.key.script && b.display.clip).map((b) => [b.id, b.key.script!.map((t) => ({ speaker: b.display.clip!.speakers[t.speaker]?.name ?? t.speaker, text: t.text }))])
  )
  return { kind: "closed", ...outcome(exam, correct, keys.length), correct, total: keys.length, teile, keys, transcripts }
}
