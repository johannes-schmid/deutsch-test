// Drafts full Modelltests with Claude, one call per Teil, checked against the official format (`full` in
// lib/exam/blueprint.ts) with up to 3 attempts that name the broken rules. Output is status "draft"; a human reviews
// before anything publishes. Topics come from the plan (scripts/modelltest/plan-dtz.ts), never from official material.
//
// npx tsx --env-file=.env.local scripts/modelltest/author.ts --skill lesen|hoeren|schreiben|sprechen --set 1 [--teil 3] [--force]
// → data/modelltest/dtz/lesen-01.json   (finished Teile are cached in .unit-cache/, so a run can resume)

import fs from "node:fs"
import path from "node:path"
import { z } from "zod"
import voices from "@/data/tts-voices.json"
import { openParts, partSpec } from "@/lib/exam/blueprint"
import type { Person } from "@/lib/exam/types"
import type { ItemKey, KurztestItem } from "@/lib/exam/kurztest"
import type { GapData, PartId, Speaker } from "@/lib/exam/types"
import { validateSprechen, validateTeil, validateWriting } from "@/lib/exam/validate-modelltest"
import type { ExamId } from "@/lib/exams"
import type { MtBlock, MtSet, MtSpeakTurn, SoundKey } from "@/lib/modelltest/types"
import { AdsOutput, cast, ChoiceOutput, DTZ_SYSTEM, GapOutput, letters, makeAsk, MODEL, TONES, WritingOutput } from "../lib/drafting"
import * as PLAN from "./plan-dtz"

const arg = (name: string) => {
  const i = process.argv.indexOf(`--${name}`)
  return i > -1 ? process.argv[i + 1] : undefined
}
const EXAM: ExamId = "dtz"
const SKILL = arg("skill") as PartId
const SET = Number(arg("set"))
const ONLY = arg("teil") ? Number(arg("teil")) : undefined
const FORCE = process.argv.includes("--force")
if (!["lesen", "hoeren", "schreiben", "sprechen"].includes(SKILL) || !(SET >= 1 && SET <= 10)) throw new Error("Usage: --skill lesen|hoeren|schreiben|sprechen --set 1..10 [--teil n]")
if (!process.env.ANTHROPIC_API_KEY) throw new Error("ANTHROPIC_API_KEY missing (run with --env-file=.env.local)")

const NN = String(SET).padStart(2, "0")
const DIR = `data/modelltest/${EXAM}`
const FILE = path.join(DIR, `${SKILL}-${NN}.json`)
const CACHE = `.unit-cache/modelltest/${EXAM}`
const ask = makeAsk(`${DTZ_SYSTEM}
- Das ist ein vollständiger Modelltest, keine gekürzte Übung: genau so viele Texte, Aufgaben und Wörter wie in der echten Prüfung.
- Schreibe die Lösung nicht immer an dieselbe Stelle; wo eine Zielantwort vorgegeben ist, halte dich daran.
- Daten ohne Jahreszahl oder mit "20.." (z. B. "12.03.20.."), damit der Test nicht veraltet.`)

/** Approved voices per role (Hannes, 2026-10-22, CLAUDE.md "Voice cast"). DTZ is German-only; Mark is the narrator. */
const POOL = ["man_ben", "man_christian", "man_simon", "woman_ela", "woman_irene", "woman_laura"]
/** Hören Teil 4 vox pop: mixed ages, plus Kathi as a speaker who came to Germany herself. */
const POOL_T4 = ["man_ben", "man_christian", "man_simon", "man_johann", "man_michael", "woman_ela", "woman_irene", "woman_laura", "woman_lisa", "woman_kathi"]
const AGE = { young: "jung (20–30)", middle: "mittleres Alter (35–55)", old: "älter (über 65)" } as const

/** Four different Teil 4 voices: one older, one young, at least one man and one woman. */
function voxPop(r: () => number) {
  const v = voices as Record<string, { gender: string; age: keyof typeof AGE }>
  for (;;) {
    const pick = shuffle(POOL_T4, r).slice(0, 4)
    const ages = pick.map((k) => v[k].age)
    const genders = new Set(pick.map((k) => v[k].gender))
    if (ages.includes("old") && ages.includes("young") && genders.size === 2) return pick
  }
}
const SOUND: Partial<Record<PLAN.Kind, SoundKey>> = { anrufbeantworter: "beep", privat: "beep", bahnhof: "station", radio: "radio", zug: "train" }

// Seeded, so a re-run of the same set reshuffles the same way.
function rng(seed: string) {
  let h = 2166136261
  for (const c of seed) h = Math.imul(h ^ c.charCodeAt(0), 16777619)
  return () => {
    h = Math.imul(h ^ (h >>> 15), 2246822507)
    h = Math.imul(h ^ (h >>> 13), 3266489909)
    return ((h ^= h >>> 16) >>> 0) / 4294967296
  }
}
const shuffle = <T>(xs: T[], r: () => number) => {
  const a = [...xs]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(r() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}
/** Balanced target letters for k a/b/c items. */
const targets = (k: number, r: () => number) => shuffle(Array.from({ length: k }, (_, i) => "abc"[i % 3]), r)
/** Balanced richtig/falsch pattern. */
const rfPattern = (k: number, r: () => number) => shuffle(Array.from({ length: k }, (_, i) => (i % 2 ? "falsch" : "richtig")), r)

/** Moves the correct option to `to` and keeps the others in order. */
function place(options: string[], correct: string, to: string) {
  const i = letters.indexOf(correct)
  const right = options[i]
  const rest = options.filter((_, j) => j !== i)
  const t = letters.indexOf(to)
  return [...rest.slice(0, t), right, ...rest.slice(t)]
}

const id = (teil: number, i: number | "bsp") => `${EXAM}-${SKILL}-${NN}-t${teil}-${i === "bsp" ? "bsp" : String(i + 1).padStart(2, "0")}`

function blockBase(teil: number, blockId: string, textType: string, instruction: string, example = false): MtBlock {
  return { id: blockId, exam: EXAM, skill: SKILL, teil, status: "draft", generated: { model: MODEL, at: new Date().toISOString(), textType }, display: { instruction, items: [] }, key: { answers: [] }, ...(example ? { example } : {}) }
}

/** What the other sets already use for this Teil, so names, places and senders don't repeat. */
function avoidList(teil: number) {
  if (!fs.existsSync(DIR)) return []
  return fs.readdirSync(DIR).filter((f) => f.startsWith(`${SKILL}-`) && f !== path.basename(FILE)).flatMap((f) => {
    const set = JSON.parse(fs.readFileSync(path.join(DIR, f), "utf8")) as MtSet
    return set.blocks.filter((b) => b.teil === teil).map((b) => [b.generated.textType, b.display.reading?.sender, b.display.clip && Object.values(b.display.clip.speakers).map((s) => s.name).join("/")].filter(Boolean).join(" · "))
  })
}

/** The official situations for this Teil (research/dtz-official-situations.md), paraphrased. Never reuse one with its twist. */
function official(teil: number) {
  const text = fs.readFileSync("research/dtz-official-situations.md", "utf8")
  const name = SKILL === "hoeren" ? "Hören" : SKILL === "lesen" ? "Lesen" : SKILL === "sprechen" ? "Sprechen" : "SCHREIBEN"
  if (SKILL === "schreiben") return text.slice(text.indexOf("SCHREIBEN (Aufgabe"), text.indexOf("\nSPRECHEN\n")).split("\n").filter((l) => /^\w+ [AB] \|/.test(l)).join("\n")
  return text.split("\n--- ").filter((sec) => sec.startsWith(`${name} Teil ${teil}`)).map((sec) => sec.split("\n=====")[0].trim()).join("\n")
}
const officialNote = (teil: number) => `Offizielle Übungssätze (nur Format, urheberrechtlich geschützt). Verwende KEINE dieser Situationen mit ihrer Pointe, auch nicht umformuliert oder mit anderen Namen; die Prüflinge kennen sie:
${official(teil)}`

const head = (teil: number, extra: string, feedback: string[]) => {
  const spec = partSpec(SKILL, teil, EXAM)
  const avoid = avoidList(teil)
  return `Modelltest ${SET}, ${SKILL === "hoeren" ? "Hören" : "Lesen"} Teil ${teil}.
Anweisung in der Prüfung: "${spec.instruction}"
${extra}
${officialNote(teil)}
${avoid.length ? `Andere Modelltests verwenden schon (wähle andere Namen, Orte, Firmen): ${avoid.join("; ")}` : ""}
${feedback.length ? `Der letzte Entwurf hatte diese Fehler. Behebe sie alle:\n- ${feedback.join("\n- ")}` : ""}`
}

const norm = (t: string) => t.toLowerCase().replace(/-\s*\n\s*/g, "").replace(/[^a-zäöüß0-9]+/g, " ").trim().split(" ")
const grams = (t: string, n = 6) => {
  const w = norm(t)
  return new Set(w.slice(0, Math.max(0, w.length - n + 1)).map((_, i) => w.slice(i, i + n).join(" ")))
}
/** Official texts, local only (.unit-cache/official, gitignored): any 6 words in a row we share with them, minus the instructions. */
const OFFICIAL_DIR = ".unit-cache/official"
const officialGrams = fs.existsSync(OFFICIAL_DIR) ? grams(fs.readdirSync(OFFICIAL_DIR).map((f) => fs.readFileSync(path.join(OFFICIAL_DIR, f), "utf8")).join("\n")) : null
if (!officialGrams) console.warn(`  ${OFFICIAL_DIR} missing: no word-overlap check against the official sets`)

/** Stock formulas every German letter or service talk uses; they are not material taken from the official sets. */
const STOCK = /sehr geehrte damen und herren|mit freundlichen grüßen|was kann ich für sie tun|vielen dank für ihre? \w+|ich freue mich auf ihre antwort/gi

function copiedPhrases(blocks: MtBlock[]) {
  if (!officialGrams) return []
  const allowed = grams(blocks.map((b) => b.display.instruction).join(" \n "))
  const ours = grams(JSON.stringify(blocks.map((b) => ({ d: b.display, s: b.key.script?.map((t) => t.text), w: b.key.writing, sp: b.key.speaking?.sampleAnswers, l: b.key.live }))).replace(/\\n|[{}"\[\]:,]/g, " ").replace(STOCK, " xstockx "))
  const hits = [...ours].filter((g) => officialGrams.has(g) && !allowed.has(g))
  return hits.length ? [`these phrases are copied from an official Übungssatz, rewrite them: "${hits.slice(0, 8).join('", "')}"`] : []
}

const Overlaps = z.object({ overlaps: z.array(z.object({ ours: z.string(), official: z.string(), why: z.string() })) })
/** A second pass that compares situations, not words: the set 1 Hören re-skinned Übungssatz 2 item by item without copying a sentence. */
async function originality(teil: number, blocks: MtBlock[]) {
  const content = blocks.map((b) => ({ text: b.display.reading?.paragraphs ?? b.key.script?.map((t) => t.text) ?? b.display.writing ?? b.display.speaking?.turns.filter((t) => t.who !== "du").map((t) => t.text), items: b.display.items, statements: b.display.items }))
  const o = await ask(Overlaps, `Prüfe einen neuen Prüfungsteil auf zu große Nähe zu offiziellem Material.
${officialNote(teil)}

Neuer Teil (JSON):
${JSON.stringify(content).slice(0, 30000)}

Liste jede Aufgabe oder jeden Text, dessen Situation UND geprüftes Detail einer offiziellen Aufgabe entspricht (z. B. offiziell: "Zug fährt wegen Bauarbeiten von anderem Gleis, gefragt: welches Gleis" ↔ neu: "Regionalbahn wegen Bauarbeiten von Gleis 8 statt 3"), auch bei anderen Namen, Zahlen oder Orten. Ein gleiches Alltagsthema allein (Arzt, Bahnhof, Nachbarn) ist kein Treffer; die Textsorte ist vorgegeben und kein Treffer. Wenn nichts zu nah ist: leere Liste.`)
  return o.overlaps.map((x) => `too close to official material (${x.official}): "${x.ours}" — ${x.why}. Choose a different situation and a different detail to test`)
}

/** Moves the Beispiel solutions (n = 0) from the scoring key to `exampleAnswers`, in item order. */
function splitExamples(block: MtBlock) {
  const ex = block.key.answers.filter((a) => a.n === 0)
  if (ex.length) block.exampleAnswers = ex.map((a) => String(a.correct))
  block.key.answers = block.key.answers.filter((a) => a.n !== 0)
  return block
}

const evidenceOf = (sources: string[], hit: string) => {
  const src = sources.find((s) => s.includes(hit))
  return { text: src ?? sources.join(" "), hit }
}

/** One a/b/c or r/f block from a ChoiceOutput (a text or a clip). Options are moved to the target letters. */
function toBlock(o: z.infer<typeof ChoiceOutput>, teil: number, blockId: string, first: number, opts: { listening: boolean; want: string[]; example: boolean; voicePool?: string[]; sound?: SoundKey; keepOrder?: boolean }) {
  const spec = partSpec(SKILL, teil, EXAM)
  const block = blockBase(teil, blockId, o.textType, spec.instruction, opts.example)
  const sources = opts.listening ? o.audio!.turns.map((t) => t.text) : o.reading!.paragraphs
  let choice = 0
  o.items.forEach((it, i) => {
    const n = opts.example ? 0 : first + i
    if (it.type === "rf") {
      block.display.items.push({ type: "rf", item: { n, statement: it.prompt } })
      block.key.answers.push({ n, correct: it.correct.trim().toLowerCase(), explanation: it.explanation, evidence: evidenceOf(sources, it.evidence) })
      return
    }
    const correct = it.correct.trim().toLowerCase()
    const to = opts.keepOrder ? correct : opts.want[choice++] ?? correct
    const options = opts.keepOrder ? it.options : place(it.options, correct, to)
    const item: KurztestItem = { type: "choice", item: { n, prompt: it.prompt, options: options.map((label, j) => ({ key: letters[j], label })) } }
    block.display.items.push(item)
    block.key.answers.push({ n, correct: to, explanation: it.explanation, evidence: evidenceOf(sources, it.evidence) } satisfies ItemKey)
  })
  if (opts.listening) {
    const a = o.audio!
    const voiceOf = cast(a.speakers, ["de"], opts.voicePool)
    block.key.script = a.turns.map((t) => ({ speaker: t.speaker, voice: voiceOf.get(t.speaker)!, text: t.text, delivery: t.delivery || undefined }))
    block.display.clip = { duration: 0, plays: 1, situation: a.situation, segments: [], speakers: Object.fromEntries(a.speakers.map((s, i) => [s.id, { name: s.role, tone: TONES[i % TONES.length] } satisfies Speaker])) }
    if (opts.sound) block.sound = opts.sound
  } else block.display.reading = o.reading!
  return block
}

const Clips = z.object({ clips: z.array(ChoiceOutput) })
const Texts = z.object({ texts: z.array(ChoiceOutput) })
const OpinionsFull = z.object({
  textType: z.string(),
  intro: z.string(),
  speakers: z.array(z.object({ id: z.string(), name: z.string(), gender: z.enum(["male", "female"]) })),
  opinions: z.array(z.object({ speaker: z.string(), text: z.string() })),
  statements: z.array(z.string()),
  answers: z.array(z.object({ speaker: z.string(), correct: z.string(), explanation: z.string(), evidence: z.string() })),
})

// Spoken words per clip, from the official audio (research/dtz-blueprint.md §2.1): set 1 landed at the short end.
const LISTEN_WORDS: Record<number, string> = { 1: "50–70", 2: "55–80", 3: "120–150", 4: "60–85" }

async function hoeren(teil: number, feedback: string[]): Promise<MtBlock[]> {
  const spec = partSpec("hoeren", teil, EXAM)
  const full = spec.full!
  const r = rng(`${EXAM}-hoeren-${SET}-${teil}`)
  if (teil === 1 || teil === 2 || teil === 3) {
    const slots = (teil === 1 ? PLAN.HOEREN_1 : teil === 2 ? PLAN.HOEREN_2 : PLAN.HOEREN_3)[SET - 1]
    const n = slots.length
    const pairs = teil === 3
    // r/f balanced over the 4 scored dialogues (U2: 2 richtig, 2 falsch); the Beispiel is free.
    const rf = pairs ? [r() < 0.5 ? "richtig" : "falsch", ...rfPattern(n - 1, r)] : []
    const o = await ask(Clips, head(teil, `Schreibe genau ${n} Hörtexte als "clips"${full.example ? `; der erste ist das Beispiel (Aufgabe 0)` : ""}, in dieser Reihenfolge:
${slots.map((s, i) => `${i + 1}. ${s.kind}: ${s.topic}${pairs ? ` (Aussage: ${rf[i]})` : ""}`).join("\n")}
Jeder Hörtext: ${LISTEN_WORDS[teil]} Wörter gesprochen, ${pairs ? "zwei Personen (ein Mann und eine Frau, oder zwei Frauen), natürliches Gespräch mit Füllwörtern und kurzen Reaktionen. Gespräche, die im Plan mit \"(du)\" markiert sind, führen Freunde, Partner oder Familie: Sie duzen sich und sprechen locker (\"nee\", \"hab\", \"is\"). Alle anderen siezen sich" : "eine Person; die Sprecher wechseln zwischen Frau und Mann, mehr Frauen als Männer"}. Setze "reading" auf null.
${pairs ? `Je Hörtext genau 2 Aufgaben: zuerst "rf" (Aussage in "prompt", "options" leer, correct wie oben angegeben), dann "choice": meist ein Satzanfang mit Namen ("Frau Berger möchte …", "Der Termin ist …"), manchmal eine Frage; drei Optionen, die den Satz beenden, mit Punkt am Ende.` : `Je Hörtext genau 1 Aufgabe "choice" (kurze Frage, drei kurze Optionen mit Punkt am Ende).`} "pictos" immer leer.
${teil === 1 ? "anrufbeantworter: Nachricht auf dem Anrufbeantworter oder der Mailbox mit Begrüßung, Name, Anliegen, Bitte um Rückruf oder Hinweis (von einer Firma oder einem Amt). privat: Nachricht auf der Mailbox von einer Bekannten oder einem Freund, mit du. info: automatische Bandansage einer Einrichtung (Öffnungszeiten, Preise, Hinweise). bahnhof: Lautsprecherdurchsage am Bahnhof oder in der U-Bahn-Station. zug: Durchsage im Zug." : ""}${teil === 2 ? "radio: Moderation, Werbung oder Meldung im Radio, mit mehreren Details (Zeiten, Preise, Orte), nur eines ist gefragt. zug: Durchsage im Zug." : ""}`, feedback))
    const want = targets(n, r)
    return o.clips.map((c, i) => {
      const example = full.example && i === 0
      const scoredIndex = full.example ? i - 1 : i
      const first = full.first + scoredIndex * full.itemsPerBlock
      return splitExamples(toBlock(c, teil, example ? id(teil, "bsp") : id(teil, scoredIndex), first, { listening: true, want: [want[i]], example, voicePool: POOL, sound: SOUND[slots[i].kind] }))
    })
  }
  // Teil 4: host intro, Beispiel + 3 opinions, six sentences a–f.
  const pool = voxPop(r)
  const v = voices as Record<string, { gender: string; age: keyof typeof AGE }>
  const genders = pool.map((k) => `${v[k].gender === "male" ? "Mann" : "Frau"}, ${AGE[v[k].age]}${k === "woman_kathi" ? ", selbst nach Deutschland eingewandert, Vorname aus ihrem Herkunftsland" : ""}`)
  const o = await ask(OpinionsFull, head(4, `Thema: ${PLAN.HOEREN_4[SET - 1]}.
Eine Radiosendung: intro = die Moderation (25–40 Wörter), die das Thema vorstellt und mit einer Frage an die Hörer endet.
Dann genau 4 Personen (speakers, in dieser Reihenfolge: ${genders.join("; ")}), passend zu Alter und Lebenssituation, mit Vorname. Jede sagt einmal ihre Meinung (opinions, ${LISTEN_WORDS[4]} Wörter, ich-Form, gesprochen). Die erste Person ist das Beispiel.
statements: genau 6 kurze Sätze (ohne Buchstaben, 4–9 Wörter), jeder eine allgemeine Meinung zum Thema, nie in ich-Form, z. B. "Kinder brauchen beim Essen feste Zeiten." oder "Man sollte am Wochenende nicht arbeiten.". 4 fassen je genau die Meinung einer Person zusammen (umformuliert, keine Wörter aus ihrem Beitrag übernommen), 2 sind Distraktoren, die zum Thema passen, aber zu keiner Person.
answers: für jede Person in Reihenfolge die Nummer (1–6) des passenden Satzes in "correct", explanation (nenne Sätze nur mit ihrem Inhalt, nie mit Nummer oder Buchstaben), evidence (Ausschnitt aus ihrem Beitrag).`, feedback))
  const order = shuffle([0, 1, 2, 3, 4, 5], r)
  const stmts = order.map((i) => o.statements[i])
  const letterOf = (one: string) => letters[order.indexOf(Number(one.trim()) - 1)] ?? one
  const block = blockBase(4, id(4, 0), o.textType, spec.instruction)
  const voiceOf = new Map(o.speakers.map((s, i) => [s.id, pool[i]]))
  block.key.script = [
    { speaker: "moderation", voice: "man_mark", text: o.intro },
    ...o.opinions.map((t, i) => ({ speaker: t.speaker, voice: voiceOf.get(t.speaker)!, text: t.text, item: i === 0 ? 0 : full.first + i - 1 })),
  ]
  block.display.clip = { duration: 0, plays: 1, situation: o.textType, segments: [], speakers: Object.fromEntries(o.speakers.map((s, i) => [s.id, { name: s.name, tone: TONES[i % TONES.length] } satisfies Speaker])) }
  const ns = o.speakers.map((_, i) => (i === 0 ? 0 : full.first + i - 1))
  block.display.items = [{ type: "match", data: { ads: stmts.map((t, i) => ({ key: letters[i], title: "", text: t })), situations: ns.map((n) => ({ n, text: n === 0 ? "Beispiel" : `Aussage ${n}` })) }, noMatch: false }]
  block.key.answers = o.answers.map((a, i) => {
    const op = o.opinions.find((x) => x.speaker === a.speaker)
    return { n: ns[i], correct: letterOf(a.correct), explanation: a.explanation, evidence: op ? { text: op.text, hit: a.evidence } : undefined }
  })
  return [splitExamples(block)]
}

async function lesen(teil: number, feedback: string[]): Promise<MtBlock[]> {
  const spec = partSpec("lesen", teil, EXAM)
  const full = spec.full!
  const r = rng(`${EXAM}-lesen-${SET}-${teil}`)
  const len = `${full.length.min}–${full.length.max} Wörter`
  if (teil === 1) {
    const topic = PLAN.LESEN_1[SET - 1]
    const unit = /Kapitel/.test(topic) ? "Kapitel" : /Rubrik/.test(topic) ? "Rubrik" : "Stockwerk"
    const want = targets(6, r)
    const o = await ask(ChoiceOutput, head(1, `Textsorte: ${topic}. Ein einziger Text: "reading.paragraphs" ist die Übersicht, eine Zeile pro ${unit} mit Bezeichnung und Stichworten (z. B. "2. OG – Sozialamt: Wohngeld, …"), ${len} insgesamt. "sender" = Ort oder Titel, "source" = Art der Übersicht. "audio" = null.
Genau 6 Aufgaben vom Typ "choice", die erste ist das Beispiel. Jede: "prompt" = eine Situation ("Sie …" oder "Ihr Nachbar …"), options = zwei ${unit === "Stockwerk" ? "Stockwerke" : unit === "Kapitel" ? "Kapitel" : "Rubriken"} aus der Übersicht und als dritte Option genau "${unit === "Stockwerk" ? "anderes Stockwerk" : unit === "Kapitel" ? "anderes Kapitel" : "andere Rubrik"}". Wenn die Information weder bei a noch bei b steht, ist c richtig.
Zielantworten in Reihenfolge: ${want.join(", ")}. Die Distraktoren passen fast (ähnliches Stichwort). "pictos" leer.`, feedback))
    const block = toBlock(o, 1, id(1, 0), full.first, { listening: false, want, example: false, keepOrder: true })
    // The first item is the Beispiel: renumber 0, 21…25.
    block.display.items.forEach((it, i) => it.type === "choice" && (it.item.n = i === 0 ? 0 : full.first + i - 1))
    block.key.answers.forEach((a, i) => (a.n = i === 0 ? 0 : full.first + i - 1))
    return [splitExamples(block)]
  }
  if (teil === 2) {
    const o = await ask(AdsOutput, head(2, `Themen: ${PLAN.LESEN_2[SET - 1]}. Genau 8 Kleinanzeigen (title + text, je 35–80 Wörter, zusammen ${len}) und genau 5 Situationen ("Sie …", "Ihre Freundin …", ein Satz).
correct = Buchstabe der passenden Anzeige (a–h) oder "x". Genau eine Situation hat "x": für sie gibt es eine Anzeige, die fast passt, aber eine Bedingung nicht erfüllt (z. B. keine Haustiere, zu kaufen statt zu mieten). Jede Anzeige passt höchstens zu einer Situation; drei Anzeigen passen zu keiner.
Die Situationen umschreiben das Bedürfnis mit eigenen Worten; sie wiederholen keine Schlüsselwörter aus der passenden Anzeige (z. B. "keinen Platz in der Wohnung" statt "Lagerraum").
explanation: nenne andere Anzeigen nur mit ihrem Titel oder Namen, nie mit Buchstaben (die Buchstaben werden danach neu verteilt).
evidence: Ausschnitt aus der passenden Anzeige; bei "x" aus der fast passenden.`, feedback))
    const order = shuffle([0, 1, 2, 3, 4, 5, 6, 7], r)
    const ads = order.map((i, j) => ({ key: letters[j], title: o.ads[i].title, text: o.ads[i].text }))
    const remap = (c: string) => (c.trim().toLowerCase() === "x" ? "x" : letters[order.indexOf(letters.indexOf(c.trim().toLowerCase()))])
    const block = blockBase(2, id(2, 0), o.textType, spec.instruction)
    block.display.items = [{ type: "match", data: { ads, situations: o.situations.map((s, i) => ({ n: full.first + i, text: s.text })) }, noMatch: true }]
    block.key.answers = o.situations.map((s, i) => {
      const src = ads.find((a) => a.text.includes(s.evidence))
      return { n: full.first + i, correct: remap(s.correct), explanation: s.explanation, evidence: src ? { text: src.text, hit: s.evidence } : undefined }
    })
    return [block]
  }
  if (teil === 3) {
    const topics = PLAN.LESEN_3[SET - 1]
    const rf = rfPattern(3, r)
    const want = targets(3, r)
    const o = await ask(Texts, head(3, `Genau 3 Texte als "texts", in dieser Reihenfolge:
${topics.map((t, i) => `${i + 1}. ${t} (Aussage: ${rf[i]})`).join("\n")}
Jeder Text: ${len}, "source" = Textsorte. "sender": bei Briefen und E-Mails der Absender (mit Anrede und Gruß im Text); bei Zeitungsmeldungen leer, die Meldung beginnt mit Ort und Thema. "audio" = null.
Je Text genau 2 Aufgaben: zuerst "rf" (Aussage in "prompt", options leer, correct wie angegeben), dann "choice" (Frage oder Satzanfang, drei Optionen). "pictos" leer.`, feedback))
    return o.texts.map((t, i) => toBlock(t, 3, id(3, i), full.first + i * 2, { listening: false, want: [want[i]], example: false }))
  }
  if (teil === 4) {
    const rf = rfPattern(3, r)
    const o = await ask(ChoiceOutput, head(4, `Textsorte: ${PLAN.LESEN_4[SET - 1]}. Ein Informationstext mit Überschrift (erste Zeile) und kurzen Abschnitten mit Zwischenüberschriften, auch Aufzählungen, Zeiten und Preise; ${len} (ohne sender/source). "audio" = null.
Genau 3 Aufgaben "rf" in der Reihenfolge des Textes, correct: ${rf.join(", ")}. "pictos" leer.`, feedback))
    return [toBlock(o, 4, id(4, 0), full.first, { listening: false, want: [], example: false })]
  }
  // Teil 5: formal letter, gap {0} is the Beispiel.
  const o = await ask(GapOutput, head(5, `Textsorte: ${PLAN.LESEN_5[SET - 1]}. Ein formeller Brief mit Absenderblock, Ort und Datum, Betreff in Großbuchstaben, Anrede, Text und Gruß (Zeilenumbrüche mit \\n), ${len} mit den Lösungen eingesetzt.
Genau 7 Lücken: {0} ist das Beispiel (am besten in der Anrede), dann {1} bis {6}, über den ganzen Brief verteilt. Typisch: Anrede, Präpositionen, Konnektoren (weil, obwohl, wenn, deshalb), Artikel und Possessivartikel, feste Wendungen.
gaps: in Reihenfolge {0}…{6}, je drei Optionen (einzelne Wörter oder kurze Wendungen); correct wörtlich wie in options.`, feedback))
  const block = blockBase(5, id(5, 0), o.textType, spec.instruction)
  const parts: GapData["parts"] = []
  let rest = o.letter
  const nOf = (i: number) => (i === 0 ? 0 : full.first + i - 1)
  // The right word goes to balanced positions a/b/c (set 1 drew c b c c b b by chance).
  const want = ["abc"[Math.floor(r() * 3)], ...targets(6, r)]
  o.gaps.forEach((g, i) => {
    const [before, after] = rest.split(`{${i}}`)
    if (after === undefined) throw new Error(`gap marker {${i}} missing`)
    const others = shuffle(g.options.filter((x) => x !== g.correct), r)
    const t = letters.indexOf(want[i])
    parts.push(before, { n: nOf(i), options: [...others.slice(0, t), g.correct, ...others.slice(t)] })
    rest = after
  })
  parts.push(rest)
  block.display.items = [{ type: "gap", data: { parts } }]
  block.key.answers = o.gaps.map((g, i) => ({ n: nOf(i), correct: g.correct, explanation: g.explanation }))
  return [splitExamples(block)]
}

async function schreiben(feedback: string[]): Promise<MtBlock[]> {
  const spec = openParts(EXAM).find((p) => p.skill === "schreiben")!
  const [a, b] = PLAN.SCHREIBEN[SET - 1]
  const o = await ask(WritingOutput, `Modelltest ${SET}, Schreiben (${spec.minutes} Minuten). Anweisung: "${spec.instruction}"
Genau 2 Aufgaben wie in der echten Prüfung, die Person wählt eine:
A (halbformell, register "informell"): ${a}. Die Person kennt den Empfänger, siezt ihn aber: eine Bekannte, ein Kollege, eine Nachbarin mit Nachnamen (Frau …, Herr …). Kein Freund, kein du.
B (formell, register "formell"): ${b}. An eine Firma, ein Amt, eine Schule oder einen Verein.
Jede Aufgabe: title (2–3 Wörter); situation (2–3 Sätze in Sie-Form, wie im Prüfungsheft, endet mit "Schreiben Sie … eine E-Mail." oder "Schreiben Sie … einen Brief."); points: genau 4 Leitpunkte als neutrale Stichworte (1–4 Wörter, z. B. "Grund", "Zeitpunkt", "Was Sie mitbringen", "Wie oft?"), sie geben keinen Inhalt vor; bei B mindestens zwei B1-Funktionen (begründen, um etwas bitten, einen Vorschlag machen, sagen, was Sie tun, wenn …), keine Punkte, die die Situation schon beantwortet; modelAnswer: Musterlösung auf gutem B1, 90–120 Wörter, mit Anrede, allen vier Punkten und Gruß, natürliches Deutsch (Zeilenumbrüche mit \\n). Keine Wortzahl in der Aufgabe.
${officialNote(1)}
${feedback.length ? `Der letzte Entwurf hatte diese Fehler:\n- ${feedback.join("\n- ")}` : ""}`)
  const block = blockBase(1, `${EXAM}-schreiben-${NN}`, "Brief oder E-Mail", spec.instruction)
  block.display.writing = o.tasks.map((t, i) => ({ key: "AB"[i], title: t.title, situation: t.situation, points: t.points }))
  block.key.writing = o.tasks.map((t, i) => ({ key: "AB"[i], register: t.register, modelAnswer: t.modelAnswer }))
  return [block]
}


/** Sprechen voices (Hannes, 2026-10-22): examiner Ela, partner Ben. The partner is the same man in all three Teile. */
const PRUEFER = "woman_ela"
const PARTNER = "man_ben"
const Line = z.object({ level: z.enum(["A2", "B1"]), text: z.string(), sample: z.string() })
const QA = z.object({ q: z.string(), a: z.string() })
const Photo = z.object({ query: z.string(), alt: z.string() })
const Sprechen1 = z.object({
  partner: z.object({ firstName: z.string(), lastName: z.string(), bio: z.string() }),
  welcome: z.string(), duSample: z.string(), followups: z.array(Line), toPartner: z.string(), partnerIntro: z.string(), partnerQA: z.array(QA), close: z.string(),
})
const Sprechen2 = z.object({
  photoDu: Photo, photoPartner: Photo, intro: z.string(), partnerDescription: z.string(), partnerQA: z.array(QA), toDu: z.string(), duSample: z.string(), followups: z.array(Line), close: z.string(),
})
const Sprechen3 = z.object({
  situation: z.string(), points: z.array(z.string()), intro: z.string(), partnerOpening: z.string(), persona: z.string(), partnerLines: z.array(z.string()), duSamples: z.array(z.string()), close: z.string(),
})

const SPRECHEN_ROLES = `Paarprüfung DTZ: eine Prüferin (spricht beide mit Sie an, freundlich, ruhig, kurze klare Sätze), ein Partner (anderer Prüfungsteilnehmer, männlich, duzt die andere Person nur in Teil 3) und "du" (die Person, die übt).
Der Partner ist ein echter Lerner zwischen A2 und B1, kein Muttersprachler: kurze, einfache Sätze, Alltagswortschatz, keine B2-Wendungen; ab und zu "äh" oder eine kurze Pause; in etwa jedem zweiten Beitrag ein kleiner typischer Lernerfehler (Verb im Nebensatz nicht am Ende, falscher Artikel oder falsche Endung, "mehr gut"), nie mehr als einer pro Beitrag und nie so, dass man ihn nicht versteht.
Alles ist gesprochene Sprache: Zahlen ausgeschrieben, keine Aufzählungszeichen, keine Klammern.`

/** The partner and examiner from Teil 1 of this set, so Teil 2 and 3 keep the same people. */
function partnerOf(set: MtSet) {
  const t1 = set.blocks.find((b) => b.teil === 1)?.display.speaking
  return t1 ? { name: t1.people.partner.name, bio: set.blocks.find((b) => b.teil === 1)!.key.live?.persona ?? "" } : null
}

function speakBlock(teil: number, textType: string, data: { title: string; task: string; points: string[] }, partnerName: string, turns: MtSpeakTurn[], samples: string[]): MtBlock {
  const spec = openParts(EXAM).find((p) => p.skill === "sprechen" && p.teil === teil)!
  const block = blockBase(teil, `${EXAM}-sprechen-${NN}-t${teil}`, textType, spec.instruction)
  const people: Record<"pruefer" | "partner" | "du", Person> = {
    pruefer: { name: "Prüferin", initial: "P", tone: "var(--v-sk-lesen)" },
    partner: { name: partnerName, initial: partnerName[0], tone: "var(--v-sk-schreiben)" },
    du: { name: "Du", initial: "Du", tone: "var(--p-glow)" },
  }
  block.display.speaking = { data: { part: `Sprechen · Teil ${teil}`, ...data }, people, turns }
  block.key.speaking = { voices: { pruefer: PRUEFER, partner: PARTNER }, sampleAnswers: samples }
  return block
}

async function sprechen(teil: number, feedback: string[], set: MtSet): Promise<MtBlock[]> {
  const spec = openParts(EXAM).find((p) => p.skill === "sprechen" && p.teil === teil)!
  const fix = feedback.length ? `Der letzte Entwurf hatte diese Fehler. Behebe sie alle:\n- ${feedback.join("\n- ")}` : ""
  const avoid = fs.existsSync(DIR) ? fs.readdirSync(DIR).filter((f) => f.startsWith("sprechen-") && f !== path.basename(FILE)).map((f) => (JSON.parse(fs.readFileSync(path.join(DIR, f), "utf8")) as MtSet).blocks.find((b) => b.teil === 1)?.display.speaking?.people.partner.name).filter(Boolean) : []
  const P = (who: MtSpeakTurn["who"], phase: MtSpeakTurn["phase"], text: string, extra: Partial<MtSpeakTurn> = {}): MtSpeakTurn => ({ who, phase, text, ...extra })
  if (teil === 1) {
    const o = await ask(Sprechen1, `Modelltest ${SET}, Sprechen Teil 1 "${spec.title}" (ca. ${spec.minutes} Minuten für beide). ${SPRECHEN_ROLES}
Ablauf wie in der echten Prüfung: "du" ist Teilnehmer A und beginnt, dann der Partner (B).
partner: ein Mann, der in Deutschland lebt und Deutsch lernt; Vorname und Nachname aus seinem Herkunftsland${avoid.length ? ` (nicht: ${avoid.join(", ")})` : ""}. bio: 3–4 Sätze über ihn (Herkunft, seit wann in Deutschland, Wohnort, Beruf, Familie, Sprachen, ein Hobby). Er bleibt in Teil 2 und 3 dieselbe Person.
welcome: Die Prüferin begrüßt beide, stellt sich und die zweite Prüferin kurz vor und bittet "du" (Teilnehmer A), sich vorzustellen: Name, Geburtsort, Wohnort, Arbeit oder Beruf, Familie, Sprachen. 40–70 Wörter.
duSample: eine gute Vorstellung auf B1, 80–110 Wörter, ich-Form, für eine erfundene Person.
followups: Nachfragen der Prüferin zu einer Vorstellung (Teil 1B), allgemein genug für jede Person: genau 4 auf B1 und 2 auf A2 (level). Je 1 Satz, z. B. "Warum haben Sie diesen Beruf gewählt?". sample: Beispielantwort auf B1, 2–3 Sätze.
toPartner: Die Prüferin dankt und bittet den Partner mit "Herr <Nachname>" um seine Vorstellung, 1–2 Sätze.
partnerIntro: seine Vorstellung, passend zur bio, 70–100 Wörter, alle sechs Stichworte.
partnerQA: genau 2 Nachfragen der Prüferin an ihn (q) und seine Antworten (a, 20–40 Wörter).
close: Die Prüferin beendet Teil 1, ein Satz.
${officialNote(1)}
${fix}`)
    const name = o.partner.firstName
    const fu = o.followups
    const b1 = fu.filter((f) => f.level === "B1")
    const turns: MtSpeakTurn[] = [
      P("pruefer", "1A", o.welcome),
      P("du", "1A", "Stell dich vor: Name, Geburtsort, Wohnort, Arbeit/Beruf, Familie, Sprachen.", { seconds: 75 }),
      P("pruefer", "1B", b1[0]?.text ?? "", { live: "followup" }),
      P("du", "1B", "Antworte auf die Frage der Prüferin.", { seconds: 30 }),
      P("pruefer", "1B", b1[1]?.text ?? "", { live: "followup" }),
      P("du", "1B", "Antworte auf die Frage der Prüferin.", { seconds: 30 }),
      P("pruefer", "1A", o.toPartner),
      P("partner", "1A", o.partnerIntro),
      ...o.partnerQA.flatMap((qa) => [P("pruefer", "1B", qa.q), P("partner", "1B", qa.a)]),
      P("pruefer", "1B", o.close),
    ]
    const block = speakBlock(1, "Über sich sprechen", { title: spec.title, task: spec.instruction, points: ["Name", "Geburtsort", "Wohnort", "Arbeit/Beruf", "Familie", "Sprachen"] }, name, turns, [o.duSample, b1[0]?.sample ?? "", b1[1]?.sample ?? ""])
    block.key.live = { followups: fu.map((f) => ({ text: f.text, level: f.level, sample: f.sample })), persona: `${o.partner.firstName} ${o.partner.lastName}: ${o.partner.bio}` }
    return [block]
  }
  const partner = partnerOf(set)
  if (!partner) throw new Error("Teil 1 first: the partner is cast there")
  const who = `Der Partner ist ${partner.bio}`
  if (teil === 2) {
    const o = await ask(Sprechen2, `Modelltest ${SET}, Sprechen Teil 2 "${spec.title}" (ca. ${spec.minutes} Minuten für beide). ${SPRECHEN_ROLES}
${who}
Thema: ${PLAN.SPRECHEN_2[SET - 1]}. Jede Person bekommt ein anderes Foto zum selben Thema. Ablauf wie in der echten Prüfung: zuerst der Partner (B), dann "du" (A).
photoDu, photoPartner: je ein Foto, das man bei Pexels findet. query: englische Suchwörter (3–6 Wörter, konkrete Szene mit Menschen, Alltag, z. B. "neighbor helping elderly woman carry groceries"); alt: deutscher Alternativtext, 1 Satz. Zwei verschiedene Szenen.
intro: Die Prüferin leitet zu Teil 2 über, gibt dem Partner sein Foto und sagt sinngemäß wie im Prüfungsheft: Er hat das Foto in einer Zeitschrift gefunden und soll seinem Gesprächspartner kurz berichten: Was sehen Sie auf dem Foto? Was für eine Situation zeigt dieses Bild? 35–60 Wörter. Sie nennt das Thema NICHT; der Prüfling soll die Situation selbst deuten.
partnerDescription: der Partner beschreibt sein Foto (Personen, Ort, was passiert, Vermutung), 60–90 Wörter, passend zu photoPartner.
partnerQA: genau 2 Fragen der Prüferin zu seinen eigenen Erfahrungen mit dem Thema (q; die erste wie "Erzählen Sie bitte: Welche Erfahrungen haben Sie damit?") und seine Antworten (a, 25–45 Wörter).
toDu: Die Prüferin dankt, gibt "du" das andere Foto: "Bitte sehen Sie sich das Bild an und sagen Sie etwas dazu.", 1–2 Sätze.
duSample: gute Bildbeschreibung auf B1 zu photoDu, 60–90 Wörter.
followups: Fragen der Prüferin zu den eigenen Erfahrungen mit dem Thema (Teil 2B): genau 4 auf B1 (Erfahrung, Vergleich mit dem Heimatland, Meinung mit Begründung) und 3 auf A2 (einfacher: Wie oft? Mit wem? Was machen Sie gern?). Je 1 Satz. sample: Beispielantwort auf B1, 2–4 Sätze.
close: Die Prüferin beendet Teil 2, ein Satz.
${officialNote(2)}
${fix}`)
    const b1 = o.followups.filter((f) => f.level === "B1")
    const turns: MtSpeakTurn[] = [
      P("pruefer", "2A", o.intro),
      P("partner", "2A", o.partnerDescription),
      ...o.partnerQA.flatMap((qa) => [P("pruefer", "2B", qa.q), P("partner", "2B", qa.a)]),
      P("pruefer", "2A", o.toDu),
      P("du", "2A", "Beschreibe dein Foto: Wer ist zu sehen, wo ist das, was passiert? Was für eine Situation ist das?", { seconds: 75 }),
      // Handbuch: one or two questions in 2B.
      ...b1.slice(0, 2).flatMap((f) => [P("pruefer", "2B", f.text, { live: "followup" }), P("du", "2B", "Erzähle von deinen Erfahrungen.", { seconds: 45 })]),
      P("pruefer", "2B", o.close),
    ]
    const block = speakBlock(2, "Über Erfahrungen sprechen", { title: spec.title, task: spec.instruction, points: ["Was sehen Sie auf dem Foto?", "Was für eine Situation zeigt dieses Bild?"] }, partner.name, turns, [o.duSample, ...b1.slice(0, 2).map((f) => f.sample)])
    block.display.speaking!.photos = { du: o.photoDu, partner: o.photoPartner }
    block.key.live = { followups: o.followups.map((f) => ({ text: f.text, level: f.level, sample: f.sample })) }
    return [block]
  }
  const o = await ask(Sprechen3, `Modelltest ${SET}, Sprechen Teil 3 "${spec.title}" (ca. ${spec.minutes} Minuten). ${SPRECHEN_ROLES}
${who} Jetzt duzen sich die beiden.
Aufgabe: ${PLAN.SPRECHEN_3[SET - 1]}.
situation: der Text auf dem Aufgabenblatt, 1–2 Sätze in Sie-Form ("Sie und Ihre Partnerin / Ihr Partner …"), endet mit "Planen Sie, was Sie machen."
points: genau 5 Notizpunkte wie auf dem Blatt, je 1–3 Wörter mit Fragezeichen (z. B. "Wann?", "Was kaufen?", "Wer macht was?").
intro: Die Prüferin leitet zum letzten Teil über, gibt beiden das Blatt, umschreibt die Aufgabe ("Planen Sie, was Sie tun möchten. Hier sind einige Notizen als Hilfe.") und lässt kurz Zeit zum Lesen, 30–50 Wörter.
partnerOpening: der Partner beginnt das Gespräch mit "du" und einem ersten Vorschlag zum ersten Punkt, 15–30 Wörter.
persona: was der Partner bei jedem Punkt möchte, kann oder nicht kann, und wo er Kompromisse macht (5–7 Sätze, für eine KI, die ihn live spricht). Mindestens zwei Punkte, bei denen er zuerst etwas anderes möchte als die meisten.
partnerLines: genau 6 Beiträge des Partners (15–35 Wörter): je einer zu Punkt 2 bis 5 in Reihenfolge, dann einer mit einer eigenen zusätzlichen Idee (für "…?"), dann einer, der alles kurz zusammenfasst und fragt, ob "du" einverstanden ist. Das sind Ersatzsätze, falls die Live-Antwort ausfällt: Jeder beginnt mit einer neutralen Reaktion ("Okay.", "Hm, ich weiß nicht.", "Ja, gut.") und geht dann zum nächsten Punkt; er nimmt NIE Bezug auf einen bestimmten Inhalt, den "du" gesagt haben könnte (keine Vermutungen wie "Blumen sind …" oder "Samstag kann ich nicht"), und endet mit einer Frage an "du".
duSamples: genau 7 gute Beiträge von "du" auf B1 (20–40 Wörter): Reaktion auf den Eröffnungsvorschlag (Punkt 1), dann je einer zu Punkt 2 bis 5, zur zusätzlichen Idee und zur Zusammenfassung.
close: Die Prüferin beendet die Prüfung und dankt beiden, 1–2 Sätze ("Vielen Dank. Wir sind nun am Ende der Prüfung."). Kein Hinweis auf das Ergebnis.
${officialNote(3)}
${fix}`)
  const turns: MtSpeakTurn[] = [P("pruefer", "3", o.intro), P("partner", "3", o.partnerOpening)]
  // Official Teil 3 is ≈ 6 minutes for both: every note point, an own idea and a closing agreement.
  o.partnerLines.forEach((line, i) => {
    turns.push(P("du", "3", i === 0 ? "Reagiere auf den Vorschlag und mach einen eigenen." : "Reagiere, mach Vorschläge, frag nach.", { seconds: 35 }))
    turns.push(P("partner", "3", line, { live: "partner" }))
  })
  turns.push(P("du", "3", "Einigt euch und fasst zusammen.", { seconds: 30 }))
  turns.push(P("pruefer", "3", o.close))
  const block = speakBlock(3, "Gemeinsam etwas planen", { title: spec.title, task: o.situation, points: [...o.points, "…?"] }, partner.name, turns, o.duSamples)
  block.key.live = { persona: `${partner.bio}\n${o.persona}`, partnerLines: o.partnerLines.map((text) => ({ text })) }
  return [block]
}

async function unit(teil: number, set: MtSet): Promise<MtBlock[]> {
  const cacheFile = path.join(CACHE, `${SKILL}-${NN}-t${teil}.json`)
  if (!FORCE && fs.existsSync(cacheFile)) return JSON.parse(fs.readFileSync(cacheFile, "utf8"))
  let feedback: string[] = []
  let blocks: MtBlock[] = []
  for (let attempt = 1; attempt <= 3; attempt++) {
    console.log(`${SKILL} ${NN} Teil ${teil}, attempt ${attempt}`)
    try {
      blocks = SKILL === "schreiben" ? await schreiben(feedback) : SKILL === "sprechen" ? await sprechen(teil, feedback, set) : SKILL === "hoeren" ? await hoeren(teil, feedback) : await lesen(teil, feedback)
      feedback = SKILL === "schreiben" ? validateWriting(blocks) : SKILL === "sprechen" ? validateSprechen(blocks[0]) : validateTeil(EXAM, SKILL, teil, blocks).filter((i) => !/^clip seconds/.test(i))
      feedback.push(...copiedPhrases(blocks))
      if (!feedback.length) feedback = await originality(teil, blocks)
    } catch (e) {
      feedback = [e instanceof Error ? e.message : String(e)]
    }
    if (!feedback.length) break
    console.log(`  issues:\n  - ${feedback.join("\n  - ")}`)
  }
  if (feedback.length) throw new Error(`${SKILL} ${NN} Teil ${teil}: still ${feedback.length} issue(s) after 3 attempts`)
  fs.mkdirSync(CACHE, { recursive: true })
  fs.writeFileSync(cacheFile, JSON.stringify(blocks, null, 2))
  return blocks
}

async function main() {
  const teile = SKILL === "schreiben" ? [1] : SKILL === "sprechen" ? [1, 2, 3] : SKILL === "hoeren" ? [1, 2, 3, 4] : [1, 2, 3, 4, 5]
  const set: MtSet = fs.existsSync(FILE) ? JSON.parse(fs.readFileSync(FILE, "utf8")) : { exam: EXAM, skill: SKILL, number: SET, title: `Modelltest ${SET}`, blocks: [] }
  for (const teil of teile.filter((t) => !ONLY || t === ONLY)) {
    const blocks = await unit(teil, set)
    set.blocks = [...set.blocks.filter((b) => b.teil !== teil), ...blocks].sort((a, b) => a.teil - b.teil || Number(!a.example) - Number(!b.example))
    fs.mkdirSync(DIR, { recursive: true })
    fs.writeFileSync(FILE, JSON.stringify(set, null, 2) + "\n")
  }
  console.log(`→ ${FILE}`)
}

main().catch((e) => {
  console.error(e instanceof Error ? e.message : e)
  process.exit(1)
})
