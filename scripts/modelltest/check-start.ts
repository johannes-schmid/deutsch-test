// Checks a Start Deutsch 1 or telc A2 Modelltest set against its format (research/{start-deutsch-1,telc-a2}-authoring.md):
// items, numbering, Beispiele, keys, play counts, voices, lengths, Sprechen turns, names repeated across the skills of
// the set, and 6-word overlap with the official Übungstest text in .unit-cache/official-<exam>/ (when present).
//
// npx tsx scripts/modelltest/check-start.ts --exam start-deutsch-1|telc-a2 --set 1 [--skill hoeren|lesen|schreiben|sprechen]

import fs from "node:fs"
import path from "node:path"
import { itemNumbers, type KurztestItem } from "@/lib/exam/kurztest"
import { PICTO_KEYS } from "@/lib/exam/pictos"
import type { MtBlock, MtSet } from "@/lib/modelltest/types"
import { blockText, names } from "./clash"
import { grams } from "./util"

const arg = (name: string) => {
  const i = process.argv.indexOf(`--${name}`)
  return i > -1 ? process.argv[i + 1] : undefined
}
const EXAM = arg("exam") ?? ""
const SET = Number(arg("set"))
const ONLY = arg("skill")
if (!["start-deutsch-1", "telc-a2"].includes(EXAM) || !(SET >= 1 && SET <= 10)) throw new Error("Usage: --exam start-deutsch-1|telc-a2 --set 1..10 [--skill s]")
const NN = String(SET).padStart(2, "0")
const DIR = `data/modelltest/${EXAM}`
const SKILLS = ["hoeren", "lesen", "schreiben", "sprechen"]

type Kind = KurztestItem["type"] | "typed"
type Range = [number, number]
type Teil = { items: Range; kind: Kind; example: boolean; plays?: number; options?: string; words?: Range; per?: "block" | "text" | "option" | "ad" | "total" }
type Talk = { du: number; liveMin: number; pruefer?: RegExp }
type Spec = { hoeren: Record<number, Teil>; lesen: Record<number, Teil>; schreiben: { form: number; points: number; model: Range; situation?: Range }; sprechen: Record<number, Talk> }

const SPEC: Record<string, Spec> = {
  "start-deutsch-1": {
    hoeren: {
      1: { items: [1, 6], kind: "picture", example: true, plays: 2, options: "abc", words: [20, 70], per: "block" },
      2: { items: [7, 10], kind: "rf", example: true, plays: 1, words: [20, 50], per: "block" },
      3: { items: [11, 15], kind: "choice", example: false, plays: 2, options: "abc", words: [15, 50], per: "block" },
    },
    lesen: {
      1: { items: [1, 5], kind: "rf", example: true, words: [30, 90], per: "text" },
      2: { items: [6, 10], kind: "choice", example: true, options: "ab", words: [8, 30], per: "option" },
      3: { items: [11, 15], kind: "rf", example: true, words: [4, 25], per: "text" },
    },
    schreiben: { form: 5, points: 3, model: [25, 45], situation: [45, 80] },
    sprechen: { 1: { du: 3, liveMin: 0 }, 2: { du: 4, liveMin: 2 }, 3: { du: 4, liveMin: 2 } },
  },
  "telc-a2": {
    hoeren: {
      1: { items: [1, 5], kind: "typed", example: true, plays: 2, words: [25, 100], per: "block" },
      2: { items: [6, 10], kind: "choice", example: true, plays: 1, options: "abc", words: [25, 100], per: "block" },
      3: { items: [11, 15], kind: "match", example: true, plays: 2, options: "abcdefghi", words: [280, 420], per: "block" },
    },
    lesen: {
      1: { items: [1, 5], kind: "choice", example: true, options: "abc", words: [55, 110], per: "text" },
      2: { items: [6, 10], kind: "rf", example: true, words: [120, 180], per: "text" },
      3: { items: [11, 15], kind: "match", example: true, options: "abcdefgh", words: [110, 200], per: "total" },
    },
    schreiben: { form: 5, points: 4, model: [35, 55] },
    sprechen: { 1: { du: 3, liveMin: 0 }, 2: { du: 7, liveMin: 3 }, 3: { du: 6, liveMin: 4, pruefer: /wann|wo/i } },
  },
}
const spec = SPEC[EXAM]

const VOICES = JSON.parse(fs.readFileSync("data/tts-voices.json", "utf8")) as Record<string, { gender: string; accent: string }>
const FEMALE = /^(Frau|Mutter|Oma|Tochter|Freundin|Kollegin|Ärztin|Verkäuferin|Lehrerin|Erzieherin|Mitarbeiterin|Nachbarin|Schwester|Sprecherin|Moderatorin)\b/
const MALE = /^(Mann|Herr|Vater|Opa|Sohn|Freund|Kollege|Arzt|Verkäufer|Lehrer|Erzieher|Mitarbeiter|Nachbar|Bruder|Sprecher|Moderator)\b/
const ANNOUNCE = new Set(["gong", "station", "train", "store", "radio"])

const words = (t: string) => t.split(/\s+/).filter(Boolean).length
const issues: string[] = []
const flag = (where: string, msg: string) => issues.push(`${where}: ${msg}`)

function load(skill: string) {
  const file = `${DIR}/${skill}-${NN}.json`
  return fs.existsSync(file) ? (JSON.parse(fs.readFileSync(file, "utf8")) as MtSet) : null
}

function pickKeys(it: KurztestItem): string[] | null {
  if (it.type === "choice" || it.type === "picture") return it.item.options.map((o) => o.key)
  if (it.type === "rf") return ["richtig", "falsch"]
  if (it.type === "match") return [...it.data.ads.map((a) => a.key), ...(it.noMatch ? ["x"] : [])]
  return null
}

function checkKeys(b: MtBlock) {
  const nums = itemNumbers(b.display.items)
  const real = nums.filter((n) => n > 0)
  const examples = nums.filter((n) => n === 0).length
  if ((b.exampleAnswers?.length ?? 0) !== examples) flag(b.id, `${examples} Beispiel item(s) but ${b.exampleAnswers?.length ?? 0} exampleAnswers`)
  const keyed = b.key.answers.map((a) => a.n)
  for (const n of real) if (keyed.filter((k) => k === n).length !== 1) flag(b.id, `item ${n} needs exactly one key`)
  for (const n of keyed) if (!real.includes(n)) flag(b.id, `key for item ${n}, which the block does not show`)
  const used = new Map<string, number>()
  for (const it of b.display.items) {
    if (it.type === "gap") {
      if (!it.data.sheet) flag(b.id, "gap without sheet (Formular or Notiz)")
      for (const p of it.data.parts) {
        if (typeof p === "string") continue
        const a = p.n === 0 ? { correct: b.exampleAnswers?.[0] ?? "" } : b.key.answers.find((k) => k.n === p.n)
        if (!a || !String(a.correct).trim()) flag(b.id, `gap ${p.n} has no answer`)
        else if (p.options.length && !p.options.includes(String(a.correct))) flag(b.id, `gap ${p.n}: "${a.correct}" is not one of its options`)
        const acc = b.key.answers.find((k) => k.n === p.n)?.accept ?? []
        if (acc.some((x) => x.trim().toLowerCase() === String(a?.correct).trim().toLowerCase())) flag(b.id, `gap ${p.n}: accept repeats the answer`)
        if (new Set(acc).size !== acc.length) flag(b.id, `gap ${p.n}: duplicate accept entries`)
      }
      continue
    }
    const keys = pickKeys(it)!
    if (new Set(keys).size !== keys.length) flag(b.id, "duplicate option keys")
    const ns = itemNumbers([it])
    ns.forEach((n) => {
      const c = n === 0 ? b.exampleAnswers?.[0] : b.key.answers.find((a) => a.n === n)?.correct
      if (c === undefined || !keys.includes(String(c))) flag(b.id, `item ${n}: key "${c}" is not one of ${keys.join("/")}`)
      else if (it.type === "match" && c !== "x") used.set(String(c), (used.get(String(c)) ?? 0) + 1)
    })
  }
  for (const [k, n] of used) if (n > 1) flag(b.id, `option ${k} is the answer ${n} times`)
  for (const a of b.key.answers) {
    if (!a.explanation?.trim()) flag(b.id, `item ${a.n} has no explanation`)
    if (a.evidence && !a.evidence.text.includes(a.evidence.hit)) flag(b.id, `item ${a.n}: evidence hit is not in its text`)
  }
}

function checkClosed(skill: "hoeren" | "lesen", set: MtSet) {
  const teile = spec[skill]
  for (const [t, s] of Object.entries(teile)) {
    const teil = Number(t)
    const blocks = set.blocks.filter((b) => b.teil === teil)
    const where = `${skill} Teil ${teil}`
    if (!blocks.length) {
      flag(where, "missing")
      continue
    }
    const nums = blocks.flatMap((b) => itemNumbers(b.display.items))
    const real = nums.filter((n) => n > 0)
    const want = Array.from({ length: s.items[1] - s.items[0] + 1 }, (_, i) => s.items[0] + i)
    if (real.join() !== want.join()) flag(where, `items ${real.join(",")}; expected ${want.join(",")}`)
    if (s.example !== nums.includes(0)) flag(where, s.example ? "Beispiel (item 0) missing" : "has a Beispiel, the official Teil has none")
    for (const b of blocks) {
      if (b.status !== "draft" && b.status !== "reviewed") flag(b.id, `status ${b.status}`)
      if (!b.id.startsWith(`${EXAM}-${skill}-${NN}-t${teil}`)) flag(b.id, `id should start with ${EXAM}-${skill}-${NN}-t${teil}`)
      checkKeys(b)
      for (const it of b.display.items) {
        const kind: Kind = it.type === "gap" && it.data.parts.some((p) => typeof p !== "string" && !p.options.length) ? "typed" : it.type
        if (kind !== s.kind) flag(b.id, `item type ${kind}, expected ${s.kind}`)
        if (s.options && (it.type === "choice" || it.type === "picture") && it.item.options.map((o) => o.key).join("") !== s.options) flag(b.id, `options ${it.item.options.map((o) => o.key).join("")}, expected ${s.options}`)
        if (s.options && it.type === "match" && it.data.ads.map((a) => a.key).join("") !== s.options) flag(b.id, `options ${it.data.ads.map((a) => a.key).join("")}, expected ${s.options}`)
        if (it.type === "picture") {
          for (const o of it.item.options) if (!o.picto || !(PICTO_KEYS as string[]).includes(o.picto)) flag(b.id, `picture option ${o.key}: picto "${o.picto}" is not in lib/exam/pictos.ts`)
          if (!b.key.pictureBrief) flag(b.id, "picture item without key.pictureBrief")
        }
      }
      if (skill === "hoeren") checkAudio(b, s)
      if (skill === "lesen") checkReading(b, s)
    }
    if (skill === "lesen" && s.per === "total") {
      const it = blocks[0].display.items[0]
      const n = it.type === "match" ? words(it.data.ads.map((a) => `${a.title} ${a.text}`).join(" ")) : 0
      if (s.words && (n < s.words[0] || n > s.words[1])) flag(where, `${n} words in the ads; expected ${s.words[0]}–${s.words[1]}`)
    }
  }
}

function checkAudio(b: MtBlock, s: Teil) {
  const clip = b.display.clip
  if (!clip) return flag(b.id, "no clip")
  if (clip.plays !== s.plays) flag(b.id, `plays ${clip.plays}, the official Teil plays ${s.plays}×`)
  if (!clip.situation) flag(b.id, "clip.situation missing")
  const script = b.key.script ?? []
  if (!script.length) return flag(b.id, "no key.script")
  const n = words(script.map((t) => t.text).join(" "))
  if (s.words && (n < s.words[0] || n > s.words[1])) flag(b.id, `${n} words spoken; expected ${s.words[0]}–${s.words[1]}`)
  const bySpeaker = new Map<string, Set<string>>()
  for (const t of script) {
    const v = VOICES[t.voice]
    if (!v) flag(b.id, `voice ${t.voice} is not in data/tts-voices.json`)
    else {
      if (!["de", "de-learner"].includes(v.accent)) flag(b.id, `${t.voice}: ${EXAM} uses DE voices only`)
      const role = clip.speakers?.[t.speaker]?.name ?? ""
      const g = FEMALE.test(role) ? "female" : MALE.test(role) ? "male" : null
      if (g && g !== v.gender) flag(b.id, `${t.speaker} (${role}) is ${g} but ${t.voice} is ${v.gender}`)
      if (v.accent === "de-learner" && ANNOUNCE.has(b.sound ?? "")) flag(b.id, `${t.voice} (learner accent) reads an official announcement`)
    }
    if (t.voice === "man_mark") flag(b.id, "man_mark is the narrator only")
    bySpeaker.set(t.speaker, (bySpeaker.get(t.speaker) ?? new Set()).add(t.voice))
  }
  for (const [sp, vs] of bySpeaker) if (vs.size > 1) flag(b.id, `speaker ${sp} has ${vs.size} voices`)
  const voices = [...bySpeaker.values()].map((v) => [...v][0])
  if (new Set(voices).size !== voices.length) flag(b.id, "two speakers share one voice")
}

function checkReading(b: MtBlock, s: Teil) {
  if (!s.words) return
  const it = b.display.items[0]
  const counts =
    s.per === "text" ? [words((b.display.reading?.paragraphs ?? []).join(" "))]
    : s.per === "option" && (it.type === "choice" || it.type === "picture") ? it.item.options.map((o) => words(o.label))
    : []
  for (const n of counts) if (n < s.words[0] || n > s.words[1]) flag(b.id, `${n} words; expected ${s.words[0]}–${s.words[1]}`)
}

function checkSchreiben(set: MtSet) {
  const t1 = set.blocks.find((b) => b.teil === 1)
  const t2 = set.blocks.find((b) => b.teil === 2)
  if (!t1) flag("schreiben Teil 1", "missing")
  else {
    checkKeys(t1)
    const gap = t1.display.items.find((it) => it.type === "gap")
    if (!gap || gap.type !== "gap") flag(t1.id, "the form must be one gap item")
    else {
      if (gap.data.sheet !== "Formular") flag(t1.id, 'sheet must be "Formular"')
      const ns = gap.data.parts.flatMap((p) => (typeof p === "string" ? [] : [p.n]))
      if (ns.join() !== [0, ...Array.from({ length: spec.schreiben.form }, (_, i) => i + 1)].join()) flag(t1.id, `fields ${ns.join(",")}; expected Beispiel 0 and 1–${spec.schreiben.form}`)
      const ex = gap.data.parts.find((p) => typeof p !== "string" && p.n === 0)
      if (ex && typeof ex !== "string" && ex.options.length) flag(t1.id, "the Beispiel field must be typed (options: [])")
    }
    if ((t1.display as { form?: unknown }).form) flag(t1.id, "display.form is the old shape; use a gap item")
    const situation = words((t1.display.reading?.paragraphs ?? []).join(" "))
    const r = spec.schreiben.situation
    if (r && (situation < r[0] || situation > r[1])) flag(t1.id, `situation ${situation} words; expected ${r[0]}–${r[1]}`)
    const text = (t1.display.reading?.paragraphs ?? []).join(" ").toLowerCase()
    for (const a of t1.key.answers) {
      const forms = [String(a.correct), ...(a.accept ?? [])].map((x) => x.toLowerCase())
      const digits = (x: string) => x.match(/\d{2,}/g) ?? []
      if (digits(String(a.correct)).length && !digits(String(a.correct)).every((d) => text.replace(/\s/g, "").includes(d))) flag(t1.id, `field ${a.n}: the digits of "${a.correct}" are not in the text`)
      if (!forms.some((f) => text.includes(f)) && !digits(String(a.correct)).length && a.correct.length > 3) flag(t1.id, `field ${a.n}: "${a.correct}" is not in the text (check it can be found there)`)
    }
  }
  if (!t2) flag("schreiben Teil 2", "missing")
  else {
    const w = t2.display.writing ?? []
    if (w.length !== 1) flag(t2.id, `${w.length} writing tasks; expected 1`)
    for (const task of w) if (task.points.length !== spec.schreiben.points) flag(t2.id, `${task.points.length} points; expected ${spec.schreiben.points}`)
    for (const k of t2.key.writing ?? []) {
      const n = words(k.modelAnswer)
      if (n < spec.schreiben.model[0] || n > spec.schreiben.model[1]) flag(t2.id, `model answer ${n} words; expected ${spec.schreiben.model[0]}–${spec.schreiben.model[1]}`)
      if (!["formell", "informell"].includes(k.register)) flag(t2.id, `register ${k.register}`)
      if (k.register === "informell" && /\b(Sie|Ihnen|Ihr)\b/.test(k.modelAnswer.split("\n").slice(1).join(" "))) flag(t2.id, "informell register but the model answer uses Sie")
      if (k.register === "formell" && /\b(du|dir|dich|dein)\b/i.test(k.modelAnswer)) flag(t2.id, "formell register but the model answer uses du")
    }
    if ((t2.key.writing?.length ?? 0) !== w.length) flag(t2.id, "every writing task needs a model answer")
  }
}

function checkSprechen(set: MtSet) {
  const partners = new Set<string>()
  for (const [t, s] of Object.entries(spec.sprechen)) {
    const b = set.blocks.find((x) => x.teil === Number(t))
    if (!b) {
      flag(`sprechen Teil ${t}`, "missing")
      continue
    }
    const sp = b.display.speaking
    if (!sp) {
      flag(b.id, "no speaking")
      continue
    }
    const v = b.key.speaking?.voices
    if (!v) flag(b.id, "key.speaking.voices missing")
    else {
      for (const r of ["pruefer", "partner"] as const) if (!VOICES[v[r]]) flag(b.id, `${r} voice ${v[r]} is not in data/tts-voices.json`)
      if (v.pruefer === v.partner) flag(b.id, "examiner and partner share one voice")
      if (VOICES[v.pruefer]?.accent === "de-learner") flag(b.id, "the examiner is a native role; never the learner voice")
      const g = VOICES[v.partner]?.gender
      const said = sp.turns.filter((x) => x.who === "pruefer").map((x) => x.text).join(" ")
      const surname = (b.key.live?.persona ?? "").match(/^[A-ZÄÖÜ][\p{L}-]+ ([A-ZÄÖÜ][\p{L}-]+)/u)?.[1]
      if (surname && g === "female" && new RegExp(`Herr ${surname}`).test(said)) flag(b.id, `the examiner says "Herr ${surname}" to a female partner voice`)
      if (surname && g === "male" && new RegExp(`Frau ${surname}`).test(said)) flag(b.id, `the examiner says "Frau ${surname}" to a male partner voice`)
    }
    partners.add(sp.people.partner.name)
    const du = sp.turns.filter((x) => x.who === "du")
    if (du.length !== s.du) flag(b.id, `${du.length} du turns; expected ${s.du}`)
    for (const x of du) if (!x.seconds || x.seconds < 8 || x.seconds > 90) flag(b.id, `du turn "${x.text.slice(0, 30)}…" needs seconds (8–90)`)
    if (sp.turns[0]?.who !== "pruefer") flag(b.id, "every Teil opens with the examiner")
    const live = sp.turns.filter((x) => x.live === "partner")
    if (live.length < s.liveMin) flag(b.id, `${live.length} live partner turns; expected at least ${s.liveMin}`)
    for (const x of live) {
      const prev = sp.turns[sp.turns.indexOf(x) - 1]
      if (prev?.who !== "du") flag(b.id, `live partner turn "${x.text.slice(0, 30)}…" must follow a du turn`)
      if (!x.text.trim()) flag(b.id, "live partner turn without a fallback text")
    }
    const lines = (b.key.live?.partnerLines ?? []).map((l) => l.text)
    if (live.length && lines.join("|") !== live.map((x) => x.text).join("|")) flag(b.id, "key.live.partnerLines must list the live turns' fallbacks in order")
    if (sp.turns.some((x) => x.who === "partner") && !b.key.live?.persona) flag(b.id, "partner persona missing")
    if (s.pruefer && !sp.turns.slice(1, -1).some((x) => x.who === "pruefer" && s.pruefer!.test(x.text))) flag(b.id, "the examiner's mid-Teil intervention is missing")
    for (const c of sp.data.cards ?? []) if (c.picto && !(PICTO_KEYS as string[]).includes(c.picto)) flag(b.id, `card picto "${c.picto}" is not in lib/exam/pictos.ts`)
  }
  if (partners.size > 1) flag("sprechen", `the partner changes name across Teile: ${[...partners].join(", ")}`)
}

const PLACE = /\b(?:in|aus|nach|bei)\s+(?:der |dem |den )?([A-ZÄÖÜ][a-zäöüß]{3,}(?:-[A-ZÄÖÜ][a-zäöüß]+)?)\b/g
const NOT_PLACE = new Set(["Deutschland", "Ordnung", "Ruhe", "Zukunft", "Wirklichkeit", "Urlaub", "Rente", "Pause", "Hause", "Arbeit", "Woche", "Stadt", "Schule", "Küche", "Wohnung", "Nähe", "Mitte", "Kantine", "Ihnen", "Ihrer", "Ihrem", "Ihren", "Euch"])
function people(text: string) {
  const out = names(text)
  for (const [, p] of text.matchAll(PLACE)) if (!NOT_PLACE.has(p)) out.add(p)
  return out
}

const sets = Object.fromEntries(SKILLS.map((s) => [s, load(s)])) as Record<string, MtSet | null>
for (const skill of SKILLS.filter((s) => !ONLY || s === ONLY)) {
  const set = sets[skill]
  if (!set) {
    flag(skill, `missing ${DIR}/${skill}-${NN}.json`)
    continue
  }
  if (set.exam !== EXAM || set.skill !== skill || set.number !== SET) flag(skill, "exam/skill/number header does not match the file")
  for (const b of set.blocks) if (b.status !== "draft" && b.status !== "reviewed") flag(b.id, `status ${b.status}`)
  if (skill === "hoeren" || skill === "lesen") checkClosed(skill, set)
  if (skill === "schreiben") checkSchreiben(set)
  if (skill === "sprechen") checkSprechen(set)
}

const found = Object.fromEntries(SKILLS.filter((s) => sets[s]).map((s) => [s, people(sets[s]!.blocks.map(blockText).join("\n"))]))
for (const [a, i] of Object.entries(found))
  for (const [b, j] of Object.entries(found)) {
    if (a >= b || (ONLY && ONLY !== a && ONLY !== b)) continue
    const shared = [...i].filter((n) => j.has(n))
    if (shared.length) flag(`${a} + ${b}`, `name/place repeated across skills of set ${SET}: ${shared.join(", ")}`)
  }

const OFF = `.unit-cache/official-${EXAM}`
const STOCK = new Set(["sie hören jeden text zweimal", "sie hören jede nachricht zweimal", "wählen sie richtig oder falsch", "name alter land wohnort sprachen beruf", "alter land wohnort sprachen beruf hobby"])
if (fs.existsSync(OFF)) {
  const official = grams(fs.readdirSync(OFF).filter((f) => f.endsWith(".txt")).map((f) => fs.readFileSync(path.join(OFF, f), "utf8")).join("\n"))
  for (const skill of SKILLS.filter((s) => sets[s] && (!ONLY || s === ONLY))) {
    for (const b of sets[skill]!.blocks) {
      const text = [b.display.instruction, blockText(b), ...(b.key.speaking?.sampleAnswers ?? []), ...(b.key.writing ?? []).map((w) => w.modelAnswer), ...(b.key.live?.followups ?? []).map((f) => `${f.text} ${f.sample ?? ""}`), ...b.key.answers.map((a) => a.explanation)].join("\n")
      const hits = [...grams(text)].filter((g) => official.has(g) && !STOCK.has(g))
      if (hits.length) flag(b.id, `6-word overlap with the official Übungstest: "${hits.join('", "')}"`)
    }
  }
} else console.log(`(no ${OFF}: overlap check skipped)`)

for (const x of issues) console.log(x)
console.log(issues.length ? `${issues.length} issue(s) in ${EXAM} set ${SET}` : `${EXAM} set ${SET}: ok`)
process.exit(issues.length ? 1 : 0)
