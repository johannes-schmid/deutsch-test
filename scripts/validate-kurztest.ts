// npx tsx scripts/validate-kurztest.ts [files...]   (default: every draft, DTZ and data/gratis-test/*)

import fs from "node:fs"
import path from "node:path"
import type { KurztestBlock } from "@/lib/exam/kurztest"
import { validateBlock } from "@/lib/exam/validate"

const ROOT = "data/gratis-test"
const DIRS = ["data/kurztest/drafts", ...(fs.existsSync(ROOT) ? fs.readdirSync(ROOT).map((d) => path.join(ROOT, d)) : [])]
const files = process.argv.slice(2).length ? process.argv.slice(2) : DIRS.flatMap((d) => fs.readdirSync(d).filter((f) => f.endsWith(".json")).map((f) => path.join(d, f)))

let failed = 0
for (const f of files) {
  const block = JSON.parse(fs.readFileSync(f, "utf8")) as KurztestBlock
  const issues = validateBlock(block)
  console.log(`${issues.length ? "✗" : "✓"} ${block.id} (${block.status})${issues.map((i) => `\n    - ${i}`).join("")}`)
  if (issues.length) failed++
}
process.exit(failed ? 1 : 0)
