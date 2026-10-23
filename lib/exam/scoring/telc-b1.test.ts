// npx tsx --test lib/exam/scoring/telc-b1.test.ts
import assert from "node:assert/strict"
import { test } from "node:test"
import { aufgabeStep, closedScore, speakingTeilScore, telcB1Result, writingScore } from "./telc-b1"

const all = (from: number, to: number) => Array.from({ length: to - from + 1 }, (_, i) => from + i)

test("Lesen: every item right is 75 Leseverstehen + 30 Sprachbausteine = 105", () => {
  const s = closedScore("lesen", new Set(all(1, 40)))
  assert.equal(s.points, 105)
  assert.equal(s.max, 105)
  assert.deepEqual(s.parts.map((p) => [p.label, p.points, p.max]), [
    ["Leseverstehen Teil 1", 25, 25],
    ["Leseverstehen Teil 2", 25, 25],
    ["Leseverstehen Teil 3", 25, 25],
    ["Sprachbausteine Teil 1", 15, 15],
    ["Sprachbausteine Teil 2", 15, 15],
  ])
})

test("Lesen weights: LV1/LV2 5, LV3 2.5, SB 1.5 per item", () => {
  assert.equal(closedScore("lesen", new Set([1])).points, 5)
  assert.equal(closedScore("lesen", new Set([6])).points, 5)
  assert.equal(closedScore("lesen", new Set([11])).points, 2.5)
  assert.equal(closedScore("lesen", new Set([21, 31])).points, 3)
})

test("Hören weights: Teil 1 and 3 5 per item, Teil 2 2.5; max 75", () => {
  assert.equal(closedScore("hoeren", new Set(all(41, 60))).points, 75)
  assert.equal(closedScore("hoeren", new Set([41])).points, 5)
  assert.equal(closedScore("hoeren", new Set([46])).points, 2.5)
  assert.equal(closedScore("hoeren", new Set([60])).points, 5)
  assert.equal(closedScore("hoeren", new Set()).points, 0)
})

test("items outside the skill score nothing", () => {
  assert.equal(closedScore("hoeren", new Set([1, 2, 3])).points, 0)
})

test("Schreiben criterion I follows the Leitpunkte: 4 A, 3 B, 2 C, 1 or 0 D", () => {
  assert.deepEqual([4, 3, 2, 1, 0].map(aufgabeStep), ["A", "B", "C", "D", "D"])
})

test("Schreiben: A/B/C/D = 5/3/1/0 per criterion, sum × 3, max 45", () => {
  assert.deepEqual(writingScore(["A", "A", "A"]), { points: 45, max: 45 })
  assert.deepEqual(writingScore(["B", "C", "D"]), { points: 12, max: 45 })
  assert.deepEqual(writingScore(["A", "B", "B"], true), { points: 0, max: 45 })
})

test("Sprechen Teil 1 max 15 (4/3/1/0, Aussprache 3/2/1/0)", () => {
  assert.equal(speakingTeilScore(1, { ausdruck: "A", aufgabe: "A", formal: "A", aussprache: "A" }), 15)
  assert.equal(speakingTeilScore(1, { ausdruck: "B", aufgabe: "C", formal: "D", aussprache: "B" }), 6)
})

test("Sprechen Teil 2 and 3 max 30 (8/6/2/0, Aussprache 6/4/2/0)", () => {
  assert.equal(speakingTeilScore(2, { ausdruck: "A", aufgabe: "A", formal: "A", aussprache: "A" }), 30)
  assert.equal(speakingTeilScore(3, { ausdruck: "B", aufgabe: "B", formal: "C", aussprache: "C" }), 16)
})

test("pass needs 60 % written (135/225) AND 60 % oral (45/75)", () => {
  assert.equal(telcB1Result({ written: 135, oral: 45 }).passed, true)
  assert.equal(telcB1Result({ written: 134.5, oral: 75 }).passed, false)
  assert.equal(telcB1Result({ written: 225, oral: 44.5 }).passed, false)
  const r = telcB1Result({ written: 225, oral: 44.5 })
  assert.equal(r.writtenPassed, true)
  assert.equal(r.oralPassed, false)
  assert.equal(r.grade, "nicht bestanden")
})

test("grades on the total only when both parts pass", () => {
  assert.equal(telcB1Result({ written: 210, oral: 60 }).grade, "sehr gut")
  assert.equal(telcB1Result({ written: 200, oral: 40 + 29.5 }).grade, "gut")
  assert.equal(telcB1Result({ written: 180, oral: 45 }).grade, "befriedigend")
  assert.equal(telcB1Result({ written: 135, oral: 45 }).grade, "ausreichend")
  assert.equal(telcB1Result({ written: 135, oral: 45 }).total, 180)
})
