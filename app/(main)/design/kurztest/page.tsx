import fs from "node:fs"
import path from "node:path"
import type { Metadata } from "next"
import { DesignShell } from "@/components/design/shell"
import { KurztestReview } from "@/components/design/kurztest-review"
import type { KurztestBlock } from "@/lib/exam/kurztest"

export const metadata: Metadata = {
  title: "Kurztest-Entwürfe · Design",
  robots: { index: false, follow: false },
}

const ROOT = path.join(process.cwd(), "data/gratis-test")
const DIRS = [path.join(process.cwd(), "data/kurztest/drafts"), ...(fs.existsSync(ROOT) ? fs.readdirSync(ROOT).map((d) => path.join(ROOT, d)) : [])]
const ORDER = { hoeren: 0, lesen: 1, schreiben: 2, sprechen: 3 }

function loadDrafts(): KurztestBlock[] {
  return DIRS.filter((d) => fs.existsSync(d))
    .flatMap((d) => fs.readdirSync(d).filter((f) => f.endsWith(".json")).map((f) => JSON.parse(fs.readFileSync(path.join(d, f), "utf8")) as KurztestBlock))
    .sort((a, b) => ORDER[a.skill] - ORDER[b.skill] || a.teil - b.teil || a.id.localeCompare(b.id))
}

export default function KurztestDraftsPage() {
  return (
    <DesignShell id="nachtzug" lang="de">
      <KurztestReview blocks={loadDrafts()} />
    </DesignShell>
  )
}
