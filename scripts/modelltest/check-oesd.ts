// Checks an ÖSD Zertifikat A1 / A2 Modelltest set against the official format (validateSet) and the set rules: AT voices
// (CH only for Swiss-set speakers, at most one DE voice for a Germany-set speaker), the narrator never cast, no name in
// two skills of the set, no 6-word overlap with the official texts in .unit-cache/official-<exam>/ (when present).
//
// npx tsx scripts/modelltest/check-oesd.ts --exam oesd-a1 --set 1 [--skill hoeren,lesen]

import fs from "node:fs"
import path from "node:path"
import voices from "@/data/tts-voices.json"
import { validateSet } from "@/lib/exam/validate-modelltest"
import type { PartId } from "@/lib/exam/types"
import type { MtSet } from "@/lib/modelltest/types"
import { blockText, names } from "./clash"
import { grams } from "./util"

export type OesdCheckExam = "oesd-a1" | "oesd-a2"
export const OESD_SKILLS = ["hoeren", "lesen", "schreiben", "sprechen"] as const
type Skill = (typeof OESD_SKILLS)[number]
const NARRATOR = "woman_seda_at"

export const oesdFile = (exam: OesdCheckExam, skill: Skill, n: number) => `data/modelltest/${exam}/${skill}-${String(n).padStart(2, "0")}.json`

const officialGrams = (exam: OesdCheckExam) => {
  const dir = `.unit-cache/official-${exam}`
  return fs.existsSync(dir) ? grams(fs.readdirSync(dir).filter((f) => f.endsWith(".txt")).map((f) => fs.readFileSync(path.join(dir, f), "utf8")).join("\n")) : new Set<string>()
}

/** Every issue of set n, per skill. Missing files are reported as "missing". */
export function checkOesd(exam: OesdCheckExam, n: number, skills: readonly Skill[] = OESD_SKILLS): Record<Skill, string[]> {
  const out = Object.fromEntries(OESD_SKILLS.map((s) => [s, [] as string[]])) as Record<Skill, string[]>
  const official = officialGrams(exam)
  const sets: Partial<Record<Skill, MtSet>> = {}
  for (const s of skills) {
    const p = oesdFile(exam, s, n)
    if (!fs.existsSync(p)) {
      out[s].push("missing")
      continue
    }
    try {
      sets[s] = JSON.parse(fs.readFileSync(p, "utf8")) as MtSet
    } catch (e) {
      out[s].push(`file does not load: ${e instanceof Error ? e.message : e}`)
      continue
    }
    const set = sets[s]!
    out[s].push(...validateSet(exam, s as PartId, set.blocks))
    for (const b of set.blocks) {
      // The instruction line follows the official rubric on purpose (format fidelity), so only content is checked.
      const text = [blockText(b), ...(b.key.speaking?.sampleAnswers ?? []), ...b.key.answers.map((a) => a.explanation)].join("\n")
      const hits = [...grams(text)].filter((g) => official.has(g))
      if (hits.length) out[s].push(`${b.id}: 6-word overlap with the official set: "${hits.slice(0, 5).join('", "')}"; rephrase`)
    }
  }
  const hoeren = sets.hoeren
  if (hoeren) {
    const v = voices as Record<string, { accent: string; gender: string }>
    const de = new Map<string, number>()
    for (const b of hoeren.blocks)
      for (const t of b.key.script ?? []) {
        if (t.voice === NARRATOR || t.voice === "man_mark") out.hoeren.push(`${b.id}: ${t.voice} is the narrator; cast someone else`)
        const accent = v[t.voice]?.accent
        if (accent === "de" || accent === "de-learner") de.set(t.voice, (de.get(t.voice) ?? 0) + 1)
      }
    if (de.size > 1) out.hoeren.push(`${de.size} German voices (${[...de.keys()].join(", ")}); ÖSD uses AT voices and one DE voice for a Germany-set speaker`)
  }
  // Names repeated across the skills of the set (Prüfungssimulation n).
  const found = Object.fromEntries(Object.entries(sets).map(([s, set]) => [s, names(set!.blocks.map(blockText).join("\n"))])) as Record<string, Set<string>>
  for (const [a, i] of Object.entries(found))
    for (const [b, j] of Object.entries(found)) {
      if (OESD_SKILLS.indexOf(a as Skill) >= OESD_SKILLS.indexOf(b as Skill)) continue
      const shared = [...i].filter((x) => j.has(x))
      if (shared.length) out[b as Skill].push(`name(s) ${shared.join(", ")} also appear in ${a} of this set; choose other names`)
    }
  return out
}

if (process.argv[1]?.endsWith("check-oesd.ts")) {
  const arg = (name: string) => {
    const i = process.argv.indexOf(`--${name}`)
    return i > -1 ? process.argv[i + 1] : undefined
  }
  const exam = arg("exam") as OesdCheckExam
  const n = Number(arg("set"))
  const skills = (arg("skill") ?? OESD_SKILLS.join(",")).split(",") as Skill[]
  if (!["oesd-a1", "oesd-a2"].includes(exam) || !(n >= 1 && n <= 10)) throw new Error("Usage: --exam oesd-a1|oesd-a2 --set 1..10 [--skill hoeren,lesen]")
  const found = checkOesd(exam, n, skills)
  let count = 0
  for (const s of skills) {
    for (const x of found[s]) console.log(`${s} ${x}`)
    if (!found[s].length) console.log(`${s}: matches the blueprint`)
    count += found[s].length
  }
  process.exit(count ? 1 : 0)
}
