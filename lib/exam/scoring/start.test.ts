// npx tsx --test lib/exam/scoring/start.test.ts
import assert from "node:assert/strict"
import { test } from "node:test"
import { ratedPoints, startGrade, START_SPEAKING, typedRight, writingTeil2 } from "./start"

test("typed: case, spacing and umlaut spelling are tolerated", () => {
  assert.ok(typedRight("pension seeblick", "Pension Seeblick"))
  assert.ok(typedRight("  Krankenpflegerin ", "Krankenpflegerin"))
  assert.ok(typedRight("Muenchen", "München"))
  assert.ok(typedRight("Strasse", "Straße"))
})

test("typed: a small spelling error is tolerated, a different word is not", () => {
  assert.ok(typedRight("Pension Seeblik", "Pension Seeblick"))
  assert.ok(typedRight("Krimi", "Krimis"))
  assert.ok(!typedRight("Comics", "Krimis"))
  assert.ok(!typedRight("Verkäuferin", "Krankenpflegerin"))
})

test("typed: short words get no tolerance", () => {
  assert.ok(typedRight("ja", "ja"))
  assert.ok(!typedRight("je", "ja"))
})

test("typed: numbers must be exactly right", () => {
  assert.ok(typedRight("0157 3398 2140", "0157 3398 2140"))
  assert.ok(typedRight("015733982140", "0157 3398 2140"))
  assert.ok(typedRight("0157-3398-2140", "0157 3398 2140"))
  assert.ok(!typedRight("0157 3389 2140", "0157 3398 2140"))
  assert.ok(!typedRight("10:00", "10:10"))
  assert.ok(typedRight("10.10", "10:10"))
})

test("typed: accepted alternatives count", () => {
  assert.ok(typedRight("zwei", "2", ["zwei"]))
  assert.ok(typedRight("12.7.", "12. Juli", ["12.07.", "12.7."]))
  assert.ok(!typedRight("13. Juli", "12. Juli", ["12.7."]))
  assert.ok(!typedRight("", "2"))
})

test("Schreiben Teil 2: 3 content points × 3/1.5/0 + form 1/0.5/0 = 10", () => {
  assert.equal(writingTeil2(["full", "full", "full"], "full"), 10)
  assert.equal(writingTeil2(["full", "half", "none"], "half"), 5)
  assert.equal(writingTeil2([], "none"), 0)
})

test("Schreiben Teil 2 telc A2: the best three of four points count", () => {
  assert.equal(writingTeil2(["none", "full", "full", "full"], "full"), 10)
  assert.equal(writingTeil2(["half", "full", "half", "none"], "full"), 7)
})

test("Sprechen: maxima are 3 / 6 / 6 for both exams", () => {
  for (const exam of ["start-deutsch-1", "telc-a2"] as const) {
    const per = [1, 2, 3].map((t) => START_SPEAKING[exam].filter((x) => x.teil === t).reduce((n, x) => n + x.max, 0))
    assert.deepEqual(per, [3, 6, 6], exam)
  }
})

test("rated points: full, half, none", () => {
  assert.equal(ratedPoints([{ max: 2, grade: "full" }, { max: 1, grade: "half" }, { max: 3, grade: "none" }]), 2.5)
})

test("telc grade bands out of 60, below 36 teilgenommen", () => {
  assert.equal(startGrade(60), "sehr gut")
  assert.equal(startGrade(54), "sehr gut")
  assert.equal(startGrade(53.5), "gut")
  assert.equal(startGrade(42), "befriedigend")
  assert.equal(startGrade(36), "ausreichend")
  assert.equal(startGrade(35.5), "teilgenommen")
})
