// Drafts Goethe-Zertifikat A2 / B1 Modelltests 2–10 in the style of set 1 (research/goethe-{a2,b1}-authoring.md):
//   1. plan: all skills of set n together (= Prüfungssimulation n), two sets per call → research/<exam>-plan.md
//   2. draft: one call per set × skill, writing the whole file in the JSON shape of set 1
//   3. check: validateSet, names repeated across the skills of a set, DE voices only, B1 Hören regions, 6-word overlap
//      with the official texts in .unit-cache/official-<exam>/; units with issues are re-drafted, up to --rounds times
// With DRAFT_BATCH=1 every round goes out as one Message Batch. ÖSD B1 is derived afterwards (derive-oesd.ts).
//
// DRAFT_BATCH=1 npx tsx --env-file=.env.local scripts/modelltest/author-goethe.ts --exam goethe-a2,goethe-b1 --sets 2-10 [--rounds 3] [--force]

import fs from "node:fs"
import path from "node:path"
import voices from "@/data/tts-voices.json"
import { validateSet } from "@/lib/exam/validate-modelltest"
import type { PartId } from "@/lib/exam/types"
import type { MtSet } from "@/lib/modelltest/types"
import { askText, examSystem, MODEL } from "../lib/drafting"
import { blockText, names } from "./clash"
import { SETS as TELC_B1 } from "./plan-telc-b1"
import { grams } from "./util"

type Exam = "goethe-a2" | "goethe-b1"
const SKILLS = ["hoeren", "lesen", "schreiben", "sprechen"] as const
type Skill = (typeof SKILLS)[number]

const arg = (name: string) => {
  const i = process.argv.indexOf(`--${name}`)
  return i > -1 ? process.argv[i + 1] : undefined
}
const EXAMS = (arg("exam") ?? "").split(",") as Exam[]
const [from, to = from] = (arg("sets") ?? "").split("-").map(Number)
const ROUNDS = Number(arg("rounds") ?? 3)
const FORCE = process.argv.includes("--force")
if (!EXAMS.every((e) => e === "goethe-a2" || e === "goethe-b1") || !(from >= 2 && to <= 10 && from <= to)) throw new Error("Usage: --exam goethe-a2[,goethe-b1] --sets 2-10 [--rounds 3] [--force]")
if (!process.env.ANTHROPIC_API_KEY) throw new Error("ANTHROPIC_API_KEY missing (run with --env-file=.env.local)")
const NUMS = Array.from({ length: to - from + 1 }, (_, i) => from + i)
const PLAN_NUMS = [2, 3, 4, 5, 6, 7, 8, 9, 10]

const nn = (n: number) => String(n).padStart(2, "0")
const file = (exam: Exam, skill: Skill, n: number) => `data/modelltest/${exam}/${skill}-${nn(n)}.json`
const regionsFile = (n: number) => `data/modelltest/goethe-b1/regions-${nn(n)}.json`
const read = (p: string) => fs.readFileSync(p, "utf8")
const PLAN_FILE = (exam: Exam) => `research/${exam}-plan.md`
const DOCS: Record<Exam, { authoring: string; format: string; situations: string; extra: string[]; partner: string }> = {
  "goethe-a2": { authoring: "research/goethe-a2-authoring.md", format: "research/goethe-a2.md", situations: "research/goethe-a2-official-situations.md", extra: [], partner: "woman_kathi (eine Lernerin, jedes Set eine andere Person)" },
  "goethe-b1": { authoring: "research/goethe-b1-authoring.md", format: "research/goethe-oesd-b1.md", situations: "research/goethe-oesd-b1-official-situations.md", extra: ["research/austrian-swiss-glossary.md"], partner: "man_ben (ein Mitprüfling, jedes Set eine andere Person)" },
}

/** Set 1 without what the pipeline adds later (src, duration, track, photo files), as the shape to copy. */
function example(exam: Exam, skill: Skill) {
  const strip = (v: unknown): unknown =>
    Array.isArray(v) ? v.map(strip) : v && typeof v === "object" ? Object.fromEntries(Object.entries(v).filter(([k]) => !["src", "duration", "track", "credit", "image"].includes(k)).map(([k, x]) => [k, strip(x)])) : v
  const set = strip(JSON.parse(read(file(exam, skill, 1)))) as Record<string, unknown>
  if (exam === "goethe-b1" && skill === "hoeren") set.regions = JSON.parse(read(regionsFile(1)))
  return JSON.stringify(set)
}

function guide(exam: Exam) {
  const d = DOCS[exam]
  return `${examSystem(exam)}

# Leitfaden (verbindlich)
${read(d.authoring)}

# Format der echten Prüfung
${read(d.format)}

# Offizielle Situationen (nie wiederverwenden)
${read(d.situations)}
${d.extra.map((f) => `\n# ${path.basename(f)}\n${read(f)}`).join("")}`
}

// ---- 1. Plan ----

function plans(exam: Exam) {
  const out: Record<number, string> = {}
  if (!fs.existsSync(PLAN_FILE(exam))) return out
  for (const [, n, body] of read(PLAN_FILE(exam)).matchAll(/^## Set (\d+)\n([\s\S]*?)(?=^## Set |(?![\s\S]))/gm)) out[Number(n)] = body.trim()
  return out
}

async function plan(exam: Exam) {
  for (;;) {
    const left = PLAN_NUMS.filter((n) => !plans(exam)[n])
    if (!left.length) return
    await planChunk(exam, left.slice(0, 2))
  }
}

async function planChunk(exam: Exam, missing: number[]) {
  const have = plans(exam)
  console.log(`plan ${exam}: sets ${missing.join(", ")}`)
  const others = Object.entries(have).map(([n, p]) => `## Set ${n}\n${p}`).join("\n\n")
  const text = await askText(
    guide(exam),
    `Plane die Modelltests ${missing.join(", ")} für ${exam}. Jeder Plan deckt alle vier Prüfungsteile von Set n gemeinsam ab (= Prüfungssimulation n).

So sah der Plan für Set 1 aus (Format und Detailtiefe übernehmen):
${read(`.unit-cache/plans/${exam}-01.md`)}

${others ? `Schon geplant (nichts davon wiederholen):\n${others}` : ""}

Auch nicht verwenden (telc B1 auf derselben Plattform, pro Set n): ${JSON.stringify(TELC_B1.map((s, i) => ({ n: i + 1, ...s })))}

Regeln:
- Keine Situation, kein Thema, kein Personenname, keine Firma und keine Stadt aus Set 1, aus den offiziellen Sätzen oder aus TestGerman-Geschichten, und nichts doppelt zwischen den Sets ${missing.join(", ")}.
- Innerhalb eines Sets: kein Name, Ort, keine Firma und kein Thema in zwei Prüfungsteilen (auch nicht als Nebendetail, z. B. zweimal Picknick oder zweimal Umzug).
- Prüferin ist woman_irene; Partner/Partnerin in Sprechen ist ${DOCS[exam].partner}.
- Hören: nur deutsche Stimmen (accent "de"; woman_kathi nur als Lernerin), nie man_mark. Geschlecht passt zur Rolle.${exam === "goethe-b1" ? "\n- B1: jeder Text hat eine Region (D/A/CH) wie im Leitfaden; pro Set etwa 50–55 % D, 25–30 % A, 20 % CH. Österreichische und Schweizer Texte mit 1–3 regionalen Wörtern (Glossar), genau ein Wort pro Set mit Fußnote." : "\n- A2: Lesen Teil 2 wechselt zwischen Messeprogramm (\"andere Halle\") und Kaufhaus-Wegweiser (\"anderer Stock\"); Sprechen Teil 3 wechselt zwischen Kalender und Mindmap (Set 1: Kalender)."}
- Lösungen pro Teil gemischt wie im Leitfaden.
- Pro Set: Tabellen wie oben (jede Aufgabe mit Situation, Namen/Orten, geprüftem Detail und Lösung), Casting, Cross-skill check.

Ausgabe: nur Markdown, jeder Set beginnt mit einer Zeile "## Set n" (n = Zahl), sonst keine Überschriften der Ebene 2.`,
    128000,
  )
  const fresh = [...text.matchAll(/^## Set (\d+)\n([\s\S]*?)(?=^## Set |(?![\s\S]))/gm)].filter(([, n]) => missing.includes(Number(n)))
  if (fresh.length !== missing.length) throw new Error(`plan ${exam}: got sets ${fresh.map(([, n]) => n).join(", ")}, wanted ${missing.join(", ")}`)
  for (const [, n, body] of fresh) have[Number(n)] = body.trim()
  const head = `# ${exam} Modelltests: plan per set (Prüfungssimulation n)\n\nDrafted by scripts/modelltest/author-goethe.ts (${MODEL}), ${new Date().toISOString().slice(0, 10)}. Set 1: research/${exam === "goethe-a2" ? "goethe-a2" : "goethe-oesd-b1"}-set1.md.\n\n`
  fs.writeFileSync(PLAN_FILE(exam), head + Object.entries(have).sort(([a], [b]) => +a - +b).map(([n, p]) => `## Set ${n}\n${p}`).join("\n\n") + "\n")
}

// ---- 2. Draft / fix ----

type Unit = { exam: Exam; skill: Skill; n: number }
const label = (u: Unit) => `${u.exam} ${u.skill} ${u.n}`

function instructions(u: Unit) {
  return `Schreibe jetzt die Datei ${file(u.exam, u.skill, u.n)}: ein MtSet-Objekt mit exam "${u.exam}", skill "${u.skill}", number ${u.n}, title "Modelltest ${u.n}".
- Genau die Form des Beispiels (Set 1, ${u.skill}) im System-Prompt: gleiche Blöcke, Felder, Item-Typen und -Nummern, gleiche Turn-Struktur; nur der Inhalt ist neu und folgt dem Plan.
- Block-IDs "${u.exam}-${u.skill}-${nn(u.n)}-t<teil>-<suffix>", status "draft", generated { model: "${MODEL}", at: "${new Date().toISOString()}", textType }.
- Keine Felder src, duration, track, image oder credit (die Pipeline füllt sie). Fotos (wo das Beispiel "photos" hat): konkrete englische Pexels-Suchbegriffe für einen Gegenstand oder Ort, keine Tätigkeiten mit Text im Bild.${u.exam === "goethe-b1" && u.skill === "hoeren" ? `\n- Zusätzlich ein Feld "regions" auf oberster Ebene wie im Beispiel: { "<Block-ID>": { "<speaker>": "de" | "at" | "ch" } } für jeden Sprecher jedes Blocks.` : ""}
- Wortzahlen genau einhalten (selbst zählen).
Gib nur das JSON-Objekt aus, ohne Markdown-Zaun und ohne Text davor oder danach.`
}

const setPlan = (u: Unit) => `Plan für ${u.exam} Modelltest ${u.n} (alle vier Prüfungsteile; du schreibst nur ${u.skill}, die anderen Teile zeigen dir, welche Namen, Orte und Themen schon vergeben sind):\n\n${plans(u.exam)[u.n]}`

function save(u: Unit, text: string) {
  const json = text.slice(text.indexOf("{"), text.lastIndexOf("}") + 1)
  const set = JSON.parse(json) as MtSet & { regions?: Record<string, Record<string, string>> }
  Object.assign(set, { exam: u.exam, skill: u.skill, number: u.n, title: `Modelltest ${u.n}` })
  for (const b of set.blocks) b.status = "draft"
  if (set.regions) {
    fs.writeFileSync(regionsFile(u.n), JSON.stringify(set.regions, null, 2) + "\n")
    delete set.regions
  }
  fs.writeFileSync(file(u.exam, u.skill, u.n), JSON.stringify(set, null, 2) + "\n")
}

async function draft(u: Unit, issues?: string[]) {
  const p = file(u.exam, u.skill, u.n)
  const prev = issues && fs.existsSync(p) ? read(p) : null
  const prompt = prev
    ? `${setPlan(u)}\n\nDein letzter Entwurf von ${p}:\n${prev}${u.exam === "goethe-b1" && u.skill === "hoeren" && fs.existsSync(regionsFile(u.n)) ? `\n\nregions: ${read(regionsFile(u.n))}` : ""}\n\nDer Prüfer meldet:\n${issues!.map((i) => `- ${i}`).join("\n")}\n\nKorrigiere genau diese Punkte (ändere sonst nur, was dafür nötig ist) und gib die vollständige Datei aus.\n\n${instructions(u)}`
    : `${setPlan(u)}\n\n${instructions(u)}`
  const system = `${guide(u.exam)}\n\n# Beispiel: Set 1, ${u.skill} (Form exakt übernehmen)\n${example(u.exam, u.skill)}`
  try {
    // A B1 Hören file is ~30k output tokens before thinking; 64k ran out on 7 of 9 drafts.
    save(u, await askText(system, prompt, u.exam === "goethe-b1" && u.skill === "hoeren" ? 128000 : undefined))
    console.log(`  ${prev ? "fixed" : "drafted"} ${label(u)}`)
  } catch (e) {
    console.log(`  FAILED ${label(u)}: ${e instanceof Error ? e.message : e}`)
  }
}

// ---- 3. Check ----

const officialGrams = (exam: Exam) => {
  const dir = `.unit-cache/official-${exam}`
  return fs.existsSync(dir) ? grams(fs.readdirSync(dir).filter((f) => f.endsWith(".txt")).map((f) => read(path.join(dir, f))).join("\n")) : new Set<string>()
}
const OFFICIAL = Object.fromEntries(EXAMS.map((e) => [e, officialGrams(e)])) as Record<Exam, Set<string>>
/** Instruction frames ("Sie hören fünf kurze Texte …") that the approved set 1 shares with the official sets are stock, not copying. */
const STOCK = Object.fromEntries(EXAMS.map((e) => [e, new Set(SKILLS.flatMap((s) => (JSON.parse(read(file(e, s, 1))) as MtSet).blocks.flatMap((b) => [...grams([b.display.instruction, blockText(b)].join("\n"))])).filter((g) => OFFICIAL[e].has(g)))])) as Record<Exam, Set<string>>

function check(exam: Exam, n: number): Record<Skill, string[]> {
  const out = Object.fromEntries(SKILLS.map((s) => [s, [] as string[]])) as Record<Skill, string[]>
  const sets: Partial<Record<Skill, MtSet>> = {}
  for (const s of SKILLS) {
    const p = file(exam, s, n)
    if (!fs.existsSync(p)) continue
    try {
      sets[s] = JSON.parse(read(p)) as MtSet
    } catch (e) {
      out[s].push(`file does not load: ${e instanceof Error ? e.message : e}`)
      continue
    }
    const set = sets[s]!
    out[s].push(...validateSet(exam, s as PartId, set.blocks).map((i) => `validateSet ${i}`))
    for (const b of set.blocks) {
      for (const t of b.key.script ?? []) {
        const v = (voices as Record<string, { accent: string }>)[t.voice]
        if (v && !["de", "de-learner"].includes(v.accent)) out[s].push(`${b.id}: ${t.voice} is not a German voice; Goethe uses DE voices only`)
        if (t.voice === "man_mark") out[s].push(`${b.id}: man_mark is the narrator; cast someone else`)
      }
      // The instruction line follows the official rubric on purpose (format fidelity), so only content is checked.
      const text = [blockText(b), ...(b.key.speaking?.sampleAnswers ?? []), ...b.key.answers.map((a) => a.explanation)].join("\n")
      const hits = [...grams(text)].filter((g) => OFFICIAL[exam].has(g) && !STOCK[exam].has(g))
      if (hits.length) out[s].push(`${b.id}: 6-word overlap with the official sets: "${hits.slice(0, 5).join('", "')}"; rephrase`)
    }
  }
  if (exam === "goethe-b1" && sets.hoeren) {
    const regions = fs.existsSync(regionsFile(n)) ? (JSON.parse(read(regionsFile(n))) as Record<string, Record<string, string>>) : {}
    for (const b of sets.hoeren.blocks) for (const sp of new Set((b.key.script ?? []).map((t) => t.speaker))) if (!["de", "at", "ch"].includes(regions[b.id]?.[sp] ?? "")) out.hoeren.push(`${b.id}: speaker ${sp} has no region in "regions"`)
  }
  // Names repeated across the skills of the set (the Sprechen partner's persona is shared within Sprechen only).
  const found = Object.fromEntries(Object.entries(sets).map(([s, set]) => [s, names(set!.blocks.map(blockText).join("\n"))])) as Record<string, Set<string>>
  for (const [a, i] of Object.entries(found))
    for (const [b, j] of Object.entries(found)) {
      if (SKILLS.indexOf(a as Skill) >= SKILLS.indexOf(b as Skill)) continue
      const shared = [...i].filter((x) => j.has(x))
      if (shared.length) out[b as Skill].push(`name(s) ${shared.join(", ")} also appear in ${a} of this set; choose other names`)
    }
  return out
}

async function main() {
  for (const exam of EXAMS) if (!fs.existsSync(`.unit-cache/plans/${exam}-01.md`)) throw new Error(`.unit-cache/plans/${exam}-01.md missing: the set 1 plan is the format example`)
  await Promise.all(EXAMS.map(plan))
  // --plan-only: plans are few, sequential calls; run them live (DRAFT_BATCH=0) and batch only the drafting.
  if (process.argv.includes("--plan-only")) return console.log("plans done")

  const units = EXAMS.flatMap((exam) => NUMS.flatMap((n) => SKILLS.map((skill) => ({ exam, skill, n }))))
  const todo = units.filter((u) => FORCE || !fs.existsSync(file(u.exam, u.skill, u.n)))
  console.log(`draft: ${todo.length} unit(s)`)
  await Promise.all(todo.map((u) => draft(u)))

  for (let round = 1; round <= ROUNDS + 1; round++) {
    const bad: { u: Unit; issues: string[] }[] = []
    for (const exam of EXAMS)
      for (const n of NUMS) {
        const found = check(exam, n)
        for (const skill of SKILLS) {
          const u = { exam, skill, n }
          if (!fs.existsSync(file(exam, skill, n))) bad.push({ u, issues: [] })
          else if (found[skill].length) bad.push({ u, issues: found[skill] })
        }
      }
    console.log(`check ${round}: ${bad.length} unit(s) with issues`)
    for (const { u, issues } of bad) console.log(`  ${label(u)}: ${issues.length ? issues.join(" | ") : "missing"}`)
    if (!bad.length || round > ROUNDS) {
      console.log(bad.length ? "STILL FAILING after all rounds" : "ALL OK")
      process.exit(bad.length ? 1 : 0)
    }
    await Promise.all(bad.map(({ u, issues }) => draft(u, issues.length ? issues : undefined)))
  }
}

main()
