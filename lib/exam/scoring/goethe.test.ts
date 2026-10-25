// npx tsx --test lib/exam/scoring/goethe.test.ts
import assert from "node:assert/strict"
import { test } from "node:test"
import { b1Scaled, goetheA2Speaking, goetheA2Task, goetheA2Writing, goetheB1Speaking, goetheB1Task, goetheB1Writing, goetheClosed, slidesStep } from "./goethe"

const range = (from: number, to: number) => new Set(Array.from({ length: to - from + 1 }, (_, i) => from + i))

test("A2 Lesen/Hören: 1 point per item × 1.25, max 25, per Teil", () => {
  const r = goetheClosed("goethe-a2", "lesen", range(1, 20))
  assert.equal(r.points, 25)
  assert.equal(r.max, 25)
  assert.deepEqual(r.parts.map((p) => p.max), [6.25, 6.25, 6.25, 6.25])
  const some = goetheClosed("goethe-a2", "hoeren", new Set([1, 2, 6, 16, 17, 18]))
  assert.deepEqual(some.parts.map((p) => p.points), [2.5, 1.25, 0, 3.75])
  assert.equal(some.points, 7.5)
})

test("B1 Lesen/Hören: raw points per Teil, total by the official conversion (18 → 60, 17 → 57)", () => {
  assert.equal(b1Scaled(30), 100)
  assert.equal(b1Scaled(18), 60)
  assert.equal(b1Scaled(17), 57)
  assert.equal(b1Scaled(0), 0)
  const lesen = goetheClosed("goethe-b1", "lesen", range(1, 18))
  assert.deepEqual(lesen.parts.map((p) => [p.points, p.max]), [[6, 6], [6, 6], [6, 7], [0, 7], [0, 4]])
  assert.equal(lesen.points, 60)
  assert.equal(lesen.max, 100)
  const hoeren = goetheClosed("oesd-b1", "hoeren", range(1, 30))
  assert.deepEqual(hoeren.parts.map((p) => p.max), [10, 5, 7, 8])
  assert.equal(hoeren.points, 100)
})

test("A2 Schreiben: AE + Sprache 5 / 3.5 / 2 / 0.5 / 0; E in AE, under half the words or off topic zeroes the task", () => {
  assert.equal(goetheA2Task({ ae: "A", sprache: "A" }, { words: 25, min: 10 }), 10)
  assert.equal(goetheA2Task({ ae: "B", sprache: "C" }, { words: 25, min: 10 }), 5.5)
  assert.equal(goetheA2Task({ ae: "E", sprache: "A" }, { words: 25, min: 10 }), 0)
  assert.equal(goetheA2Task({ ae: "A", sprache: "A" }, { words: 9, min: 10 }), 0)
  assert.equal(goetheA2Task({ ae: "A", sprache: "A" }, { words: 30, min: 15, offTopic: true }), 0)
})

test("A2 Schreiben: raw points rounded to whole points before × 1.25", () => {
  assert.deepEqual(goetheA2Writing([10, 10]), { raw: 20, points: 25, max: 25 })
  assert.deepEqual(goetheA2Writing([5.5, 6]), { raw: 12, points: 15, max: 25 })
  assert.deepEqual(goetheA2Writing([5, 6.5]), { raw: 12, points: 15, max: 25 })
  assert.deepEqual(goetheA2Writing([5, 6]), { raw: 11, points: 13.75, max: 25 })
})

test("B1 Schreiben: Aufgabe 1–2 four criteria × 10, Aufgabe 3 4/4/6/6; steps A–E = 100/75/50/25/0 %", () => {
  const all = { erfuellung: "A", kohaerenz: "A", wortschatz: "A", strukturen: "A" } as const
  assert.equal(goetheB1Task(1, all, { words: 80 }), 40)
  assert.equal(goetheB1Task(3, all, { words: 40 }), 20)
  assert.equal(goetheB1Task(2, { erfuellung: "B", kohaerenz: "C", wortschatz: "D", strukturen: "B" }, { words: 80 }), 22.5)
  assert.equal(goetheB1Task(3, { erfuellung: "B", kohaerenz: "B", wortschatz: "B", strukturen: "C" }, { words: 40 }), 13.5)
})

test("B1 Schreiben: E in Erfüllung, under half the words or off topic zeroes the Aufgabe", () => {
  const all = { erfuellung: "A", kohaerenz: "A", wortschatz: "A", strukturen: "A" } as const
  assert.equal(goetheB1Task(1, { ...all, erfuellung: "E" }, { words: 80 }), 0)
  assert.equal(goetheB1Task(1, all, { words: 39 }), 0)
  assert.equal(goetheB1Task(3, all, { words: 20 }), 20)
  assert.equal(goetheB1Task(3, all, { words: 19 }), 0)
  assert.equal(goetheB1Task(2, all, { words: 80, offTopic: true }), 0)
})

test("B1 Schreiben total: Goethe rounds half up, ÖSD rounds decimals up", () => {
  assert.deepEqual(goetheB1Writing("goethe-b1", [22.5, 30, 13.5]), { points: 66, max: 100 })
  assert.deepEqual(goetheB1Writing("oesd-b1", [22.5, 30, 13.5]), { points: 66, max: 100 })
  assert.deepEqual(goetheB1Writing("goethe-b1", [40, 40, 20]), { points: 100, max: 100 })
})

test("A2 Sprechen: T1 2+2, T2 4+4, T3 4+4, Aussprache 5 = 25; E in AE zeroes that Teil", () => {
  const top = { ae: "A", sprache: "A" } as const
  const full = goetheA2Speaking({ 1: top, 2: top, 3: top }, "A")
  assert.equal(full.points, 25)
  assert.deepEqual(full.parts.map((p) => [p.points, p.max]), [[4, 4], [8, 8], [8, 8], [5, 5]])
  const mid = goetheA2Speaking({ 1: { ae: "B", sprache: "C" }, 2: { ae: "B", sprache: "B" }, 3: { ae: "E", sprache: "A" } }, "B")
  assert.deepEqual(mid.parts.map((p) => p.points), [2.5, 6, 0, 3.5])
  assert.equal(mid.points, 12)
})

test("A2 Sprechen: the total is rounded half up", () => {
  const r = goetheA2Speaking({ 1: { ae: "B", sprache: "A" }, 2: { ae: "A", sprache: "A" }, 3: { ae: "A", sprache: "A" } }, "D")
  assert.equal(r.parts.reduce((n, p) => n + p.points, 0), 20)
  const half = goetheA2Speaking({ 1: { ae: "B", sprache: "B" }, 2: { ae: "A", sprache: "A" }, 3: { ae: "A", sprache: "A" } }, "B")
  assert.equal(half.parts.reduce((n, p) => n + p.points, 0), 22.5)
  assert.equal(half.points, 23)
})

test("B1 Sprechen: T1 28 (8/4/8/8), T2 40 (12/4/12/12), T3 16, Aussprache 16 = 100", () => {
  const a = goetheB1Speaking({ 1: { erfuellung: "A", interaktion: "A", wortschatz: "A", strukturen: "A" }, 2: { erfuellung: "A", kohaerenz: "A", wortschatz: "A", strukturen: "A" }, 3: "A", aussprache: "A" })
  assert.equal(a.points, 100)
  assert.deepEqual(a.parts.map((p) => p.max), [28, 40, 16, 16])
  const b = goetheB1Speaking({ 1: { erfuellung: "B", interaktion: "C", wortschatz: "B", strukturen: "D" }, 2: { erfuellung: "C", kohaerenz: "B", wortschatz: "B", strukturen: "C" }, 3: "B", aussprache: "B" })
  assert.deepEqual(b.parts.map((p) => p.points), [6 + 2 + 6 + 2, 6 + 3 + 9 + 6, 12, 12])
  assert.equal(b.points, 64)
})

test("B1 Sprechen Teil 2: Erfüllung follows the slides covered", () => {
  assert.equal(slidesStep(5), "A")
  assert.equal(slidesStep(4), "B")
  assert.equal(slidesStep(3), "B")
  assert.equal(slidesStep(2), "C")
  assert.equal(slidesStep(5, true), "C")
  assert.equal(slidesStep(1), "D")
  assert.equal(slidesStep(0), "E")
})
