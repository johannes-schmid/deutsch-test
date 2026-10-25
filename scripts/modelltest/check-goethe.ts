// Checks a Goethe/ÖSD Modelltest file against the official format (validateSet) and prints every deviation.
//
// npx tsx scripts/modelltest/check-goethe.ts --exam goethe-a2 --skill hoeren --set 1

import fs from "node:fs"
import { validateSet } from "@/lib/exam/validate-modelltest"
import type { PartId } from "@/lib/exam/types"
import type { ExamId } from "@/lib/exams"
import type { MtSet } from "@/lib/modelltest/types"

const arg = (name: string) => {
  const i = process.argv.indexOf(`--${name}`)
  return i > -1 ? process.argv[i + 1] : undefined
}
const EXAM = arg("exam") as ExamId
const SET = Number(arg("set"))
const skills = (arg("skill") ?? "hoeren,lesen,schreiben,sprechen").split(",") as PartId[]
if (!EXAM || !(SET >= 1 && SET <= 10)) throw new Error("Usage: --exam goethe-a2|goethe-b1|oesd-b1 --set 1..10 [--skill hoeren]")

let found = 0
for (const skill of skills) {
  const file = `data/modelltest/${EXAM}/${skill}-${String(SET).padStart(2, "0")}.json`
  if (!fs.existsSync(file)) {
    console.log(`${skill}: missing`)
    continue
  }
  const set = JSON.parse(fs.readFileSync(file, "utf8")) as MtSet
  const issues = validateSet(EXAM, skill, set.blocks)
  for (const x of issues) console.log(`${skill} ${x}`)
  if (!issues.length) console.log(`${skill}: matches the blueprint`)
  found += issues.length
}
process.exit(found ? 1 : 0)
