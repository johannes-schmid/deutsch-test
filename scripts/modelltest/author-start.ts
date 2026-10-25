// Drafts Start Deutsch 1 / telc Deutsch A2 Modelltests 2–10 in the style of set 1 (research/<exam>-authoring.md):
//   1. plan: one call per exam plans all requested sets across the four skills (= Prüfungssimulation n), so no topic,
//      name or place repeats within a set or across sets → research/<exam>-plan.md (kept; delete a set's section to re-plan it)
//   2. draft: one call per set × skill, writing the whole file in the JSON shape of set 1 (the example in the prompt)
//   3. check: check-start.ts + validateSet; every unit with issues is re-drafted with the issue list, up to --rounds times
// With DRAFT_BATCH=1 every round goes out as one Message Batch. Output is status "draft"; Hannes reviews before publishing.
//
// DRAFT_BATCH=1 npx tsx --env-file=.env.local scripts/modelltest/author-start.ts --exam start-deutsch-1,telc-a2 --sets 2-10 [--rounds 3] [--force]

import { execFileSync } from "node:child_process"
import fs from "node:fs"
import { PICTO_KEYS } from "@/lib/exam/pictos"
import { validateSet } from "@/lib/exam/validate-modelltest"
import type { PartId } from "@/lib/exam/types"
import type { MtSet } from "@/lib/modelltest/types"
import { askText, examSystem, MODEL } from "../lib/drafting"
import { SETS as TELC_B1 } from "./plan-telc-b1"

type Exam = "start-deutsch-1" | "telc-a2"
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
if (!EXAMS.every((e) => e === "start-deutsch-1" || e === "telc-a2") || !(from >= 2 && to <= 10 && from <= to)) throw new Error("Usage: --exam start-deutsch-1[,telc-a2] --sets 2-10 [--rounds 3] [--force]")
if (!process.env.ANTHROPIC_API_KEY) throw new Error("ANTHROPIC_API_KEY missing (run with --env-file=.env.local)")
const NUMS = Array.from({ length: to - from + 1 }, (_, i) => from + i)
/** Plans always cover sets 2–10 in one call, so later sets never repeat earlier ones. */
const PLAN_NUMS = [2, 3, 4, 5, 6, 7, 8, 9, 10]

const nn = (n: number) => String(n).padStart(2, "0")
const file = (exam: Exam, skill: Skill, n: number) => `data/modelltest/${exam}/${skill}-${nn(n)}.json`
const read = (p: string) => fs.readFileSync(p, "utf8")
const PLAN_FILE = (exam: Exam) => `research/${exam}-plan.md`

/** Set 1 without what audio.ts adds later (src, duration, track), as the shape to copy. */
function example(exam: Exam, skill: Skill) {
  const strip = (v: unknown): unknown =>
    Array.isArray(v) ? v.map(strip) : v && typeof v === "object" ? Object.fromEntries(Object.entries(v).filter(([k]) => !["src", "duration", "track"].includes(k)).map(([k, x]) => [k, strip(x)])) : v
  return JSON.stringify(strip(JSON.parse(read(file(exam, skill, 1)))))
}

function guide(exam: Exam) {
  return `${examSystem(exam)}

# Leitfaden (verbindlich)
${read(`research/${exam}-authoring.md`)}

# Format der echten Prüfung (research/${exam}.md)
${read(`research/${exam}.md`)}`
}

// ---- 1. Plan ----

function plans(exam: Exam) {
  const out: Record<number, string> = {}
  if (!fs.existsSync(PLAN_FILE(exam))) return out
  for (const [, n, body] of read(PLAN_FILE(exam)).matchAll(/^## Set (\d+)\n([\s\S]*?)(?=^## Set |(?![\s\S]))/gm)) out[Number(n)] = body.trim()
  return out
}

async function plan(exam: Exam) {
  // Two sets per call (more overran the output limit); each call sees the sets planned before it.
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
  const telcB1 = exam === "telc-a2" ? `\n\nAuch nicht verwenden (telc B1, gleiche Plattform, pro Set n): ${JSON.stringify(TELC_B1.map((s, i) => ({ n: i + 1, ...s })))}` : ""
  const text = await askText(
    guide(exam),
    `Plane die Modelltests ${missing.join(", ")} für ${exam}. Jeder Plan deckt alle vier Prüfungsteile von Set n gemeinsam ab (= Prüfungssimulation n), wie im Leitfaden §1.

So sah der Plan für Set 1 aus (Format und Detailtiefe übernehmen; Casting-Regeln aus dem Leitfaden §4 gelten, der Leitfaden hat Vorrang: Sprechen-Partnerin ist immer eine Frau, woman_kathi):
${read(`.unit-cache/plans/${exam}-01.md`)}

${others ? `Schon geplant (nichts davon wiederholen):\n${others}` : ""}${telcB1}

Regeln:
- Keine Situation, kein Thema, kein Personenname, keine Firma und keine Stadt aus Set 1 (Leitfaden §9 "Sets used"), aus den offiziellen Übungstests oder dem Gratistest (§9), und nichts doppelt zwischen den Sets ${missing.join(", ")}.
- Innerhalb eines Sets: kein Name, Ort, keine Firma und kein Thema in zwei Prüfungsteilen.
- Die Sprechen-Partnerin ist in jedem Set eine andere Frau (anderer Name, anderes Herkunftsland, andere Stadt, anderer Beruf).
- Lösungen pro Teil gemischt; die Verteilung steht im Plan.
- Pro Set eine Tabelle wie oben (jede Aufgabe mit Situation, Namen/Orten, geprüftem Detail und Lösung), dann Hören-Casting und Cross-skill check.

Ausgabe: nur Markdown, jeder Set beginnt mit einer Zeile "## Set n" (n = Zahl), sonst keine Überschriften der Ebene 2.`,
    128000,
  )
  const fresh = [...text.matchAll(/^## Set (\d+)\n([\s\S]*?)(?=^## Set |(?![\s\S]))/gm)].filter(([, n]) => missing.includes(Number(n)))
  if (fresh.length !== missing.length) throw new Error(`plan ${exam}: got sets ${fresh.map(([, n]) => n).join(", ")}, wanted ${missing.join(", ")}`)
  for (const [, n, body] of fresh) have[Number(n)] = body.trim()
  const head = `# ${exam} Modelltests: plan per set (Prüfungssimulation n)\n\nDrafted by scripts/modelltest/author-start.ts (${MODEL}), ${new Date().toISOString().slice(0, 10)}. Set 1: see research/${exam}-authoring.md §9.\n\n`
  fs.writeFileSync(PLAN_FILE(exam), head + Object.entries(have).sort(([a], [b]) => +a - +b).map(([n, p]) => `## Set ${n}\n${p}`).join("\n\n") + "\n")
}

// ---- 2. Draft / fix ----

type Unit = { exam: Exam; skill: Skill; n: number }
const label = (u: Unit) => `${u.exam} ${u.skill} ${u.n}`

function instructions(u: Unit) {
  return `Schreibe jetzt die Datei ${file(u.exam, u.skill, u.n)}: ein MtSet-Objekt mit exam "${u.exam}", skill "${u.skill}", number ${u.n}, title "Modelltest ${u.n}".
- Genau die Form des Beispiels (Set 1, ${u.skill}) im System-Prompt: gleiche Blöcke, gleiche Felder, gleiche Item-Typen und -Nummern, gleiche Anzahl Sprecher/Turns-Struktur; nur der Inhalt ist neu und folgt dem Plan.
- Block-IDs "${u.exam}-${u.skill}-${nn(u.n)}-t<teil>-<suffix>", status "draft", generated { model: "${MODEL}", at: "${new Date().toISOString()}", textType }.
- Keine Felder src, duration oder track (die Audio-Pipeline füllt sie).
- Alle Qualitätsregeln aus dem Leitfaden §6 gelten.
Gib nur das JSON-Objekt aus, ohne Markdown-Zaun und ohne Text davor oder danach.`
}

function setPlan(u: Unit) {
  return `Plan für ${u.exam} Modelltest ${u.n} (alle vier Prüfungsteile; du schreibst nur ${u.skill}, die anderen Teile zeigen dir, welche Namen, Orte und Themen schon vergeben sind):\n\n${plans(u.exam)[u.n]}`
}

function parse(u: Unit, text: string): MtSet {
  const json = text.slice(text.indexOf("{"), text.lastIndexOf("}") + 1)
  const set = JSON.parse(json) as MtSet
  Object.assign(set, { exam: u.exam, skill: u.skill, number: u.n, title: `Modelltest ${u.n}` })
  for (const b of set.blocks) b.status = "draft"
  return set
}

async function draft(u: Unit, issues?: string[]) {
  const p = file(u.exam, u.skill, u.n)
  const prev = issues && fs.existsSync(p) ? read(p) : null
  const prompt = prev
    ? `${setPlan(u)}\n\nDein letzter Entwurf von ${p}:\n${prev}\n\nDer Prüfer meldet:\n${issues!.map((i) => `- ${i}`).join("\n")}\n\nKorrigiere genau diese Punkte (ändere sonst nur, was dafür nötig ist) und gib die vollständige Datei aus.\n\n${instructions(u)}`
    : `${setPlan(u)}\n\n${instructions(u)}`
  const system = `${guide(u.exam)}\n\n# Beispiel: Set 1, ${u.skill} (Form exakt übernehmen)\n${example(u.exam, u.skill)}\n\n# Erlaubte picto-Werte (nur diese; ein Ding ohne passendes Picto bekommt kein Bild, sondern eine andere Option)\n${PICTO_KEYS.join(", ")}`
  try {
    const set = parse(u, await askText(system, prompt))
    fs.writeFileSync(p, JSON.stringify(set, null, 2) + "\n")
    console.log(`  ${prev ? "fixed" : "drafted"} ${label(u)}`)
  } catch (e) {
    console.log(`  FAILED ${label(u)}: ${e instanceof Error ? e.message : e}`)
  }
}

// ---- 3. Check ----

function check(exam: Exam, n: number): Record<Skill, string[]> {
  const out = Object.fromEntries(SKILLS.map((s) => [s, [] as string[]])) as Record<Skill, string[]>
  let text = ""
  try {
    text = execFileSync("npx", ["tsx", "scripts/modelltest/check-start.ts", "--exam", exam, "--set", String(n)], { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] })
  } catch (e) {
    text = (e as { stdout?: string }).stdout ?? ""
  }
  for (const line of text.split("\n")) {
    const m = line.match(/^(\S+(?: \+ \S+)?): (.+)$/)
    if (!m) continue
    const [, where, msg] = m
    // "hoeren + lesen: name repeated" → the later skill renames.
    const skill = where.includes(" + ") ? (where.split(" + ")[1] as Skill) : SKILLS.find((s) => where === s || where.includes(`-${s}-`))
    if (skill && !(/^missing /.test(msg))) out[skill].push(`${where}: ${msg}`)
  }
  for (const s of SKILLS) {
    const p = file(exam, s, n)
    if (!fs.existsSync(p)) continue
    try {
      out[s].push(...validateSet(exam, s as PartId, (JSON.parse(read(p)) as MtSet).blocks).map((i) => `validateSet ${i}`))
    } catch (e) {
      out[s].push(`file does not load: ${e instanceof Error ? e.message : e}`)
    }
  }
  return out
}

async function main() {
  fs.mkdirSync(".unit-cache/plans", { recursive: true })
  const scratch = (exam: Exam) => `.unit-cache/plans/${exam}-01.md`
  for (const exam of EXAMS) if (!fs.existsSync(scratch(exam))) throw new Error(`${scratch(exam)} missing: the set 1 plan is the format example`)

  await Promise.all(EXAMS.map(plan))

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
