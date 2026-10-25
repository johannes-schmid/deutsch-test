// npx tsx --test lib/exam/scoring/oesd.test.ts
import assert from "node:assert/strict"
import { test } from "node:test"
import { exactRight, formPoints, gridRowPoints, marksPoints, oralModule, overallResult, scoreOesdClosed, speakingPoints, tickGroupPoints, writtenModule, za1Writing, za2Writing } from "./oesd"

test("exact: a spelled name or phone number must be fully right", () => {
  assert.ok(exactRight("Lerchengasse", "Lerchengasse"))
  assert.ok(exactRight("lerchen-gasse", "Lerchengasse"))
  assert.ok(!exactRight("Lärchengasse", "Lerchengasse"))
  assert.ok(exactRight("438 12 70", "4381270"))
  assert.ok(!exactRight("4381207", "4381270"))
  assert.ok(!exactRight("", "4381270"))
})

test("ZA2 Hören 3: per row 2 / 1 / 0", () => {
  assert.equal(gridRowPoints(["b", "d"], ["b", "d"], 5), 2)
  assert.equal(gridRowPoints(["b", "c", "d"], ["b", "d"], 5), 1)
  assert.equal(gridRowPoints(["a", "b", "c", "d"], ["b", "d"], 5), 0)
  assert.equal(gridRowPoints(["a", "b", "c", "d", "e"], ["b", "d"], 5), 0)
  assert.equal(gridRowPoints([], ["b"], 5), 0)
  assert.equal(gridRowPoints(["a", "c"], ["b", "d"], 5), 0)
})

test("ZA2 Hören 1: 4 of 8 with the over-marking penalty", () => {
  const right = ["b", "d", "e", "h"]
  assert.equal(marksPoints(["b", "d", "e", "h"], right), 10)
  assert.equal(marksPoints(["b", "d", "e", "a"], right), 7)
  assert.equal(marksPoints(["b", "d"], right), 4)
  assert.equal(marksPoints(["b"], right), 1)
  assert.equal(marksPoints([], right), 0)
  assert.equal(marksPoints(["b", "d", "e", "h", "a"], right), 7)
  assert.equal(marksPoints(["b", "a", "c", "f", "g"], right), 0)
  assert.equal(marksPoints(["a", "b", "c", "d", "e", "h"], right), 0)
})

test("ZA1 form: tick group and the 10 → 5 table", () => {
  assert.equal(tickGroupPoints(["Führerschein", "Kinder"], ["Führerschein", "Kinder"]), 2)
  assert.equal(tickGroupPoints(["Kinder"], ["Führerschein", "Kinder"]), 1)
  assert.equal(tickGroupPoints(["Kinder", "Sport"], ["Führerschein", "Kinder"]), 0)
  assert.deepEqual([10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0].map(formPoints), [5, 4, 4, 3, 3, 2, 2, 1, 1, 0, 0])
})

test("ZA1 closed: Aufgabe tables (5 → 10, Lesen 2: 6 → 10 … 1–0 → 0)", () => {
  const items = Array.from({ length: 16 }, (_, i) => ({ n: i + 1, kind: "plain" as const }))
  const keys = items.map((i) => ({ n: i.n, correct: i.n <= 5 || i.n >= 12 ? "1" : "richtig" }))
  const all = Object.fromEntries(keys.map((k) => [k.n, k.correct]))
  assert.equal(scoreOesdClosed("oesd-a1", "lesen", items, keys, all).points, 30)
  const one = { ...all, 6: "falsch", 7: "falsch", 8: "falsch", 9: "falsch", 10: "falsch" }
  const r = scoreOesdClosed("oesd-a1", "lesen", items, keys, one)
  assert.deepEqual(r.parts.map((p) => p.points), [10, 0, 10])
  const two = { ...one, 7: "richtig" }
  assert.deepEqual(scoreOesdClosed("oesd-a1", "lesen", items, keys, two).parts.map((p) => p.points), [10, 2, 10])
})

test("ZA2 closed Hören: marks, exact phone, rows", () => {
  const items = [
    ...[1, 2, 3, 4].map((n) => ({ n, kind: "marks" as const, group: [1, 2, 3, 4] })),
    ...[5, 6, 7, 8].map((n) => ({ n, kind: "plain" as const, typed: true })),
    { n: 9, kind: "plain" as const, typed: true },
    ...[10, 11, 12, 13, 14].map((n) => ({ n, kind: "row" as const, columns: 5 })),
  ]
  const keys = [
    { n: 1, correct: "b" }, { n: 2, correct: "d" }, { n: 3, correct: "e" }, { n: 4, correct: "h" },
    { n: 5, correct: "Samstag" }, { n: 6, correct: "8.15" }, { n: 7, correct: "21" }, { n: 8, correct: "Handtuch" },
    { n: 9, correct: "2954138", exact: true },
    { n: 10, correct: "b,e" }, { n: 11, correct: "a" }, { n: 12, correct: "c,d,e" }, { n: 13, correct: "b,d" }, { n: 14, correct: "a,c" },
  ]
  const marks = "b,d,e,h"
  const answers = { 1: marks, 2: marks, 3: marks, 4: marks, 5: "Samstag", 6: "8.15", 7: "21", 8: "Handtuh", 9: "295 41 38", 10: "b,e", 11: "a,b", 12: "c,d", 13: "b,d", 14: "" }
  const r = scoreOesdClosed("oesd-a2", "hoeren", items, keys, answers)
  assert.deepEqual(r.parts.map((p) => p.points), [10, 10, 2 + 1 + 1 + 2 + 0])
  assert.equal(r.max, 30)
  assert.equal(r.right.get(8), true)
  assert.equal(r.right.get(11), false)
})

test("ZA1 Schreiben Aufgabe 2: length and content deductions, n. b.", () => {
  assert.deepEqual(za1Writing({ words: 30, answered: 3, k: 1, t: 1, l: 4, f: 4 }), { points: 10, max: 10, nb: false })
  assert.equal(za1Writing({ words: 22, answered: 2, k: 1, t: 1, l: 3, f: 3 }).points, 6)
  assert.equal(za1Writing({ words: 14, answered: 3, k: 1, t: 1, l: 4, f: 4 }).points, 0)
  assert.equal(za1Writing({ words: 16, answered: 1, k: 0, t: 0, l: 1, f: 1 }).points, 0)
})

test("ZA2 Schreiben: bonus, length steps, cap 15", () => {
  assert.equal(za2Writing({ words: 55, content: "extra", k: 2, t: 2, l: 5, f: 5 }).points, 15)
  assert.equal(za2Writing({ words: 55, content: "all", k: 2, t: 2, l: 4, f: 4 }).points, 12)
  assert.equal(za2Writing({ words: 33, content: "three", k: 1, t: 1, l: 3, f: 3 }).points, 5)
  assert.equal(za2Writing({ words: 25, content: "all", k: 2, t: 2, l: 5, f: 5 }).points, 0)
})

test("ZA1 modules: minimums and Prädikat", () => {
  const w = writtenModule("oesd-a1", { lesen: 24, hoeren: 22, schreiben: 12 })
  assert.deepEqual([w.points, w.passed, w.grade], [58, true, "gut"])
  const low = writtenModule("oesd-a1", { lesen: 30, hoeren: 30, schreiben: 3 })
  assert.equal(low.passed, false)
  assert.deepEqual(low.missed, ["schreiben 3 < 4"])
  assert.equal(writtenModule("oesd-a1", { lesen: 14, hoeren: 14, schreiben: 9 }).passed, false)
  assert.equal(oralModule("oesd-a1", 22).grade, "sehr gut")
  assert.equal(oralModule("oesd-a1", 11).passed, false)
  assert.equal(speakingPoints("oesd-a1", [4, 4, 4, 5, 4, 4]), 25)
  const all = overallResult("oesd-a1", w, oralModule("oesd-a1", 18))
  assert.deepEqual([all.points, all.grade], [76, "gut"])
})

test("ZA2 modules: 70 / 20 / 90", () => {
  const w = writtenModule("oesd-a2", { lesen: 25, hoeren: 30, schreiben: 15 })
  assert.deepEqual([w.points, w.grade], [70, "sehr gut"])
  assert.equal(writtenModule("oesd-a2", { lesen: 4, hoeren: 30, schreiben: 15 }).passed, false)
  assert.equal(writtenModule("oesd-a2", { lesen: 10, hoeren: 15, schreiben: 10 }).grade, "bestanden")
  assert.equal(oralModule("oesd-a2", 10).grade, "bestanden")
  assert.equal(oralModule("oesd-a2", 17).grade, "gut")
  assert.equal(speakingPoints("oesd-a2", [3, 3, 5, 4, 5]), 20)
  assert.equal(overallResult("oesd-a2", w, oralModule("oesd-a2", 9)).passed, false)
})
