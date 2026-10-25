// Drafts ÖSD Zertifikat A1 / A2 Modelltests 2–10 in the style of set 1 (research/oesd-{a1,a2}-authoring.md); a copy of
// author-goethe.ts adapted to ÖSD:
//   1. plan: all skills of set n together (= Prüfungssimulation n), two sets per call → research/<exam>-plan.md
//   2. draft: one call per set × skill, writing the whole file in the JSON shape of set 1
//   3. check: check-oesd.ts (validateSet, AT voices with at most one DE voice, the narrator never cast, names across the
//      skills of a set, 6-word overlap with .unit-cache/official-<exam>/); units with issues are re-drafted, up to --rounds
// With DRAFT_BATCH=1 every round goes out as one Message Batch. Photos, audio and seeding follow per set as for set 1.
//
// DRAFT_BATCH=1 npx tsx --env-file=.env.local scripts/modelltest/author-oesd.ts --exam oesd-a1,oesd-a2 --sets 2-10 [--rounds 3] [--force]

import fs from "node:fs"
import path from "node:path"
import type { MtSet } from "@/lib/modelltest/types"
import { askText, examSystem, MODEL } from "../lib/drafting"
import { checkOesd } from "./check-oesd"

type Exam = "oesd-a1" | "oesd-a2"
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
if (!EXAMS.every((e) => e === "oesd-a1" || e === "oesd-a2") || !(from >= 2 && to <= 10 && from <= to)) throw new Error("Usage: --exam oesd-a1[,oesd-a2] --sets 2-10 [--rounds 3] [--force]")
if (!process.env.ANTHROPIC_API_KEY) throw new Error("ANTHROPIC_API_KEY missing (run with --env-file=.env.local)")
const NUMS = Array.from({ length: to - from + 1 }, (_, i) => from + i)
const PLAN_NUMS = [2, 3, 4, 5, 6, 7, 8, 9, 10]

const nn = (n: number) => String(n).padStart(2, "0")
const file = (exam: Exam, skill: Skill, n: number) => `data/modelltest/${exam}/${skill}-${nn(n)}.json`
const read = (p: string) => fs.readFileSync(p, "utf8")
const PLAN_FILE = (exam: Exam) => `research/${exam}-plan.md`
const DOCS: Record<Exam, { authoring: string; format: string; situations: string; set1: string; extra: string[]; cast: string }> = {
  "oesd-a1": { authoring: "research/oesd-a1-authoring.md", format: "research/oesd-a1.md", situations: "research/oesd-a1-official-situations.md", set1: "research/oesd-a1-set1.md", extra: ["research/austrian-swiss-glossary.md"], cast: "Sprechen: Assessor man_gruber_at, Interlokutorin woman_alexandra_at (jedes Set andere Namen)" },
  "oesd-a2": { authoring: "research/oesd-a2-authoring.md", format: "research/oesd-a2.md", situations: "research/oesd-a2-official-situations.md", set1: "research/oesd-a2-set1.md", extra: ["research/austrian-swiss-glossary.md"], cast: "Sprechen: Assessor man_gruber_at, Interlokutorin woman_emilia_at (jedes Set andere Namen)" },
}

/** Set 1 without what the pipeline adds later (src, duration, track, photo files), as the shape to copy. */
function example(exam: Exam, skill: Skill) {
  const strip = (v: unknown): unknown =>
    Array.isArray(v) ? v.map(strip) : v && typeof v === "object" ? Object.fromEntries(Object.entries(v).filter(([k]) => !["src", "duration", "track", "credit", "image"].includes(k)).map(([k, x]) => [k, strip(x)])) : v
  return JSON.stringify(strip(JSON.parse(read(file(exam, skill, 1)))))
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

So sah der Plan für Set 1 aus (Format und Detailtiefe von §2 übernehmen):
${read(DOCS[exam].set1)}

${others ? `Schon geplant (nichts davon wiederholen):\n${others}` : ""}

Regeln:
- Keine Situation, kein Thema, kein Personenname, keine Firma und keine Stadt aus Set 1, aus den offiziellen Sätzen oder aus TestGerman-Geschichten, und nichts doppelt zwischen den Sets ${missing.join(", ")}.
- Innerhalb eines Sets: kein Name, Ort, keine Firma und kein Thema in zwei Prüfungsteilen (auch nicht als Nebendetail, z. B. zweimal Picknick oder zweimal Umzug).
- ${DOCS[exam].cast}.
- Hören: österreichische Stimmen (accent "at"), Schweizer Stimmen nur für Sprecher aus der Schweiz, höchstens eine deutsche Stimme pro Set für eine Person aus Deutschland; nie woman_seda_at (Sprecherin) oder man_mark. Keine Stimme zweimal in einem Gespräch; Geschlecht passt zur Rolle.
- Jeder Text hat eine Region (A/D/CH) wie im Leitfaden; regionale Wörter nur in Texten dieser Region (Glossar §4), nie als Lösung.
- Lösungen pro Teil gemischt wie im Leitfaden.
- Pro Set: Tabellen wie oben (jede Aufgabe mit Situation, Namen/Orten, geprüftem Detail und Lösung), Casting, Cross-skill check.

Ausgabe: nur Markdown, jeder Set beginnt mit einer Zeile "## Set n" (n = Zahl), sonst keine Überschriften der Ebene 2.`,
    128000,
  )
  const fresh = [...text.matchAll(/^## Set (\d+)\n([\s\S]*?)(?=^## Set |(?![\s\S]))/gm)].filter(([, n]) => missing.includes(Number(n)))
  if (fresh.length !== missing.length) throw new Error(`plan ${exam}: got sets ${fresh.map(([, n]) => n).join(", ")}, wanted ${missing.join(", ")}`)
  for (const [, n, body] of fresh) have[Number(n)] = body.trim()
  const head = `# ${exam} Modelltests: plan per set (Prüfungssimulation n)\n\nDrafted by scripts/modelltest/author-oesd.ts (${MODEL}), ${new Date().toISOString().slice(0, 10)}. Set 1: research/${exam}-set1.md.\n\n`
  fs.writeFileSync(PLAN_FILE(exam), head + Object.entries(have).sort(([a], [b]) => +a - +b).map(([n, p]) => `## Set ${n}\n${p}`).join("\n\n") + "\n")
}

// ---- 2. Draft / fix ----

type Unit = { exam: Exam; skill: Skill; n: number }
const label = (u: Unit) => `${u.exam} ${u.skill} ${u.n}`

function instructions(u: Unit) {
  return `Schreibe jetzt die Datei ${file(u.exam, u.skill, u.n)}: ein MtSet-Objekt mit exam "${u.exam}", skill "${u.skill}", number ${u.n}, title "Modelltest ${u.n}".
- Genau die Form des Beispiels (Set 1, ${u.skill}) im System-Prompt: gleiche Blöcke, Felder, Item-Typen und -Nummern, gleiche Turn-Struktur; nur der Inhalt ist neu und folgt dem Plan.
- Block-IDs "${u.exam}-${u.skill}-${nn(u.n)}-t<teil>-<suffix>", status "draft", generated { model: "${MODEL}", at: "${new Date().toISOString()}", textType }.
- Keine Felder src, duration, track, image oder credit (die Pipeline füllt sie). Fotos (wo das Beispiel "photos" hat): konkrete englische Pexels-Suchbegriffe für eine Szene mit genau zwei Personen, ohne Text im Bild.
- Wortzahlen genau einhalten (selbst zählen).
Gib nur das JSON-Objekt aus, ohne Markdown-Zaun und ohne Text davor oder danach.`
}

const setPlan = (u: Unit) => `Plan für ${u.exam} Modelltest ${u.n} (alle vier Prüfungsteile; du schreibst nur ${u.skill}, die anderen Teile zeigen dir, welche Namen, Orte und Themen schon vergeben sind):\n\n${plans(u.exam)[u.n]}`

function save(u: Unit, text: string) {
  const json = text.slice(text.indexOf("{"), text.lastIndexOf("}") + 1)
  const set = JSON.parse(json) as MtSet
  Object.assign(set, { exam: u.exam, skill: u.skill, number: u.n, title: `Modelltest ${u.n}` })
  for (const b of set.blocks) b.status = "draft"
  fs.writeFileSync(file(u.exam, u.skill, u.n), JSON.stringify(set, null, 2) + "\n")
}

async function draft(u: Unit, issues?: string[]) {
  const p = file(u.exam, u.skill, u.n)
  const prev = issues && fs.existsSync(p) ? read(p) : null
  const prompt = prev
    ? `${setPlan(u)}\n\nDein letzter Entwurf von ${p}:\n${prev}\n\nDer Prüfer meldet:\n${issues!.map((i) => `- ${i}`).join("\n")}\n\nKorrigiere genau diese Punkte (ändere sonst nur, was dafür nötig ist) und gib die vollständige Datei aus.\n\n${instructions(u)}`
    : `${setPlan(u)}\n\n${instructions(u)}`
  const system = `${guide(u.exam)}\n\n# Beispiel: Set 1, ${u.skill} (Form exakt übernehmen)\n${example(u.exam, u.skill)}`
  try {
    save(u, await askText(system, prompt))
    console.log(`  ${prev ? "fixed" : "drafted"} ${label(u)}`)
  } catch (e) {
    console.log(`  FAILED ${label(u)}: ${e instanceof Error ? e.message : e}`)
  }
}

// ---- 3. Check ----

const check = (exam: Exam, n: number) => checkOesd(exam, n)

async function main() {
  for (const exam of EXAMS) for (const s of SKILLS) if (!fs.existsSync(file(exam, s, 1))) throw new Error(`${file(exam, s, 1)} missing: set 1 is the format example`)
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
          else if (found[skill].length) bad.push({ u, issues: found[skill].filter((i) => i !== "missing") })
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
