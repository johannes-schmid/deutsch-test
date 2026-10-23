// After drafting a whole telc B1 set: lists every name or theme that repeats across its skills. Fix one by re-running
// the named Teil, which then sees the other skills' finished files:
//   npx tsx --env-file=.env.local scripts/modelltest/author-telc-b1.ts --skill <skill> --set <n> --teil <t> --force
//
// npx tsx scripts/modelltest/check-set.ts --set 2

import fs from "node:fs"
import type { MtSet } from "@/lib/modelltest/types"
import { clashes } from "./clash"
import { planBySkill } from "./plan-telc-b1"

const i = process.argv.indexOf("--set")
const SET = Number(process.argv[i + 1])
if (!(SET >= 1 && SET <= 10)) throw new Error("Usage: --set 1..10")
const NN = String(SET).padStart(2, "0")
const DIR = "data/modelltest/telc-b1"
const plan = planBySkill(SET)

let found = 0
for (const skill of ["lesen", "hoeren", "schreiben", "sprechen"]) {
  const file = `${DIR}/${skill}-${NN}.json`
  if (!fs.existsSync(file)) {
    console.log(`${skill}: missing`)
    continue
  }
  const set = JSON.parse(fs.readFileSync(file, "utf8")) as MtSet
  for (const teil of [...new Set(set.blocks.map((b) => b.teil))]) {
    const issues = clashes(DIR, skill, NN, set.blocks.filter((b) => b.teil === teil), plan, set.blocks.filter((b) => b.teil < teil))
    for (const x of issues) console.log(`${skill} Teil ${teil}: ${x}`)
    found += issues.length
  }
}
console.log(found ? `${found} repeat(s)` : "no repeats across skills")
process.exit(found ? 1 : 0)
