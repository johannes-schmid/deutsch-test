import "server-only"
import { goetheA2Writing, goetheB1Writing, isGoetheB1, type GoetheExam } from "@/lib/exam/scoring/goethe"
import { formPoints, formRight, moduleShare, type OesdExam } from "@/lib/exam/scoring/oesd"
import type { WritingOption } from "@/lib/exam/types"
import type { MtGradedResult } from "./grade"
import { gradeGoetheA2Task, gradeGoetheB1Task, type TaskGrade } from "./grade-goethe"
import { gradeOesdTask } from "./grade-oesd"
import type { MtBlock } from "./types"

// A whole Schreiben module of Goethe A2 (2 tasks), Goethe/ÖSD B1 (3 Aufgaben), ÖSD A1 (form + reply) or ÖSD A2 (reply):
// every task graded on its own official criteria, then added up the official way.

export type Letter = { block: MtBlock; task: WritingOption; modelAnswer: string; register: string; text: string }

/** ÖSD A1 Aufgabe 1: one point per field (a two-tick group counts per right box), 10 → 5 points. */
export function oesdForm(sheet: MtBlock, form: Record<string, string>) {
  const fields = sheet.display.items.flatMap((it) => (it.type === "gap" ? it.data.parts.flatMap((p) => (typeof p !== "string" && p.n > 0 ? [p] : [])) : []))
  const given = Object.fromEntries(fields.map((f) => [f.n, String(form[f.n] ?? "").slice(0, 60)]))
  const keys = sheet.key.answers.filter((a) => fields.some((f) => f.n === a.n))
  const right = formRight(fields, keys, given)
  return { given, keys, right, points: formPoints(right) }
}

export async function gradeModule(exam: GoetheExam | OesdExam, letters: Letter[], sheet?: { block: MtBlock; form: Record<string, string> }): Promise<{ result: MtGradedResult; formGiven?: Record<number, string> }> {
  const grades: TaskGrade[] = await Promise.all(
    letters.map((l) =>
      exam === "goethe-a2"
        ? gradeGoetheA2Task(l.block.teil, l.task, l.modelAnswer, l.register, l.text)
        : isGoetheB1(exam)
          ? gradeGoetheB1Task(Math.min(3, Math.max(1, l.block.teil)) as 1 | 2 | 3, l.task, l.modelAnswer, l.register, l.text)
          : gradeOesdTask(exam as OesdExam, l.task, l.modelAnswer, l.text),
    ),
  )
  const unit = isGoetheB1(exam) ? "Aufgabe" : "Teil"
  const parts = letters.map((l, i) => ({ label: `${unit} ${l.block.teil}: ${l.task.title}`, points: grades[i].points, max: grades[i].max }))
  const form = sheet && exam === "oesd-a1" ? oesdForm(sheet.block, sheet.form) : undefined
  if (form) parts.unshift({ label: `Teil ${sheet!.block.teil}: Formular`, points: form.points, max: 5 })

  const sum = grades.reduce((n, g) => n + g.points, 0)
  const score =
    exam === "goethe-a2"
      ? { points: goetheA2Writing(grades.map((g) => g.points)).points, max: 25 }
      : isGoetheB1(exam)
        ? goetheB1Writing(exam, grades.map((g) => g.points))
        : { points: sum + (form?.points ?? 0), max: 15 }
  const pass = exam === "oesd-a1" || exam === "oesd-a2" ? moduleShare(exam, "written") : 0.6
  const many = letters.length > 1
  const result: MtGradedResult = {
    kind: "graded",
    pass,
    score,
    summary: many ? letters.map((l, i) => `${unit} ${l.block.teil}: ${grades[i].summary}`).join(" ") : (grades[0]?.summary ?? ""),
    criteria: grades.flatMap((g) => g.criteria),
    offTopic: grades.every((g) => g.offTopic),
    parts: parts.length > 1 ? parts : undefined,
    letters: letters.map((l) => ({ label: many ? `${unit} ${l.block.teil}: ${l.task.title}` : l.task.title, text: l.text, modelAnswer: l.modelAnswer })),
    ...(form ? { form: { keys: form.keys } } : {}),
  }
  return { result, formGiven: form?.given }
}
