// Drafts full telc Deutsch B1 Modelltests with Claude, one call per Teil, checked against the official format (`full`
// in lib/exam/exams/telc-b1.ts, research/telc-b1.md) with up to 3 attempts that name the broken rules. Output is status
// "draft"; a human reviews before anything publishes. Topics come from the plan (scripts/modelltest/plan-telc-b1.ts),
// which covers all skills of set n together, never from official material.
// Independent Teile run at the same time, so with DRAFT_BATCH=1 they share one Message Batch.
//
// DRAFT_BATCH=1 npx tsx --env-file=.env.local scripts/modelltest/author-telc-b1.ts --skill lesen|hoeren|schreiben|sprechen --set 1 [--teil 3] [--force]
// → data/modelltest/telc-b1/lesen-01.json   (finished Teile are cached in .unit-cache/, so a run can resume)
// Lesen holds Leseverstehen Teil 1–3 and the Sprachbausteine as Teil 4–5 (one 90-minute block in the real exam).

import fs from "node:fs"
import path from "node:path"
import { z } from "zod"
import voices from "@/data/tts-voices.json"
import { openParts, partSpec } from "@/lib/exam/blueprint"
import type { ItemKey } from "@/lib/exam/kurztest"
import type { GapData, PartId, Person, Speaker } from "@/lib/exam/types"
import { validateSprechenTelc, validateTeil, validateWriting } from "@/lib/exam/validate-modelltest"
import type { ExamId } from "@/lib/exams"
import type { MtBlock, MtSet, MtSpeakTurn, SoundKey } from "@/lib/modelltest/types"
import { AdsOutput, ChoiceOutput, examSystem, makeAsk, MODEL, TONES, WritingOutput } from "../lib/drafting"
import { SETS, type H3Kind } from "./plan-telc-b1"
import { grams, mixedPattern, place, rng, shuffle, targets } from "./util"

const arg = (name: string) => {
  const i = process.argv.indexOf(`--${name}`)
  return i > -1 ? process.argv[i + 1] : undefined
}
const EXAM: ExamId = "telc-b1"
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
const PLAN = SETS[SET - 1]
const LETTERS = "abcdefghijklmno"
const SYSTEM = `${examSystem(EXAM)}
- Das ist ein vollständiger Modelltest, keine gekürzte Übung: genau so viele Texte, Aufgaben und Wörter wie in der echten Prüfung.
- Schwierigkeit B1: Zeitungs- und Alltagssprache mit Nebensätzen, Konnektoren und Passiv, wie in der echten telc-Prüfung; nicht vereinfacht.
- Schreibe die Lösung nicht immer an dieselbe Stelle; wo eine Zielantwort vorgegeben ist, halte dich daran.
- Daten ohne Jahreszahl, damit der Test nicht veraltet.`
const ask = makeAsk(SYSTEM)
/** The originality check stays on Opus whichever model drafts. */
const judge = makeAsk(SYSTEM, "claude-opus-5-5")

/** The task texts on the sheet, in our words (research/telc-b1.md §3: what each official instruction asks). */
const INSTRUCTION: Record<string, string> = {
  "lesen-1": "Lesen Sie die Überschriften a–j und die Texte 1–5. Welche Überschrift passt zu welchem Text? Jede Überschrift können Sie nur einmal verwenden.",
  "lesen-2": "Lesen Sie den Text und die Aufgaben 6–10. Welche Antwort (a, b oder c) ist richtig?",
  "lesen-3": "Lesen Sie die Situationen 11–20 und die Anzeigen a–l. Welche Anzeige passt zu welcher Situation? Jede Anzeige können Sie nur einmal verwenden. Wenn keine Anzeige passt, wählen Sie x.",
  "lesen-4": "Lesen Sie den Text und schließen Sie die Lücken 21–30. Welche Lösung (a, b oder c) ist richtig?",
  "lesen-5": "Lesen Sie den Text und schließen Sie die Lücken 31–40 mit den Wörtern a–o. Jedes Wort passt nur einmal.",
  "hoeren-1": "Sie hören jetzt fünf kurze Texte. Sie hören jeden Text nur einmal. Entscheiden Sie beim Hören, ob die Aussagen 41–45 richtig oder falsch sind. Lesen Sie jetzt die Aussagen. Dafür haben Sie 30 Sekunden Zeit.",
  "hoeren-2": "Sie hören jetzt ein Gespräch. Sie hören das Gespräch zweimal. Entscheiden Sie beim Hören, ob die Aussagen 46–55 richtig oder falsch sind. Lesen Sie jetzt die Aussagen. Dafür haben Sie eine Minute Zeit.",
  "hoeren-3": "Sie hören jetzt fünf kurze Texte. Sie hören jeden Text zweimal. Entscheiden Sie beim Hören, ob die Aussagen 56–60 richtig oder falsch sind.",
}

/** Approved DE voices (CLAUDE.md "Voice cast"); Mark is the narrator only. */
const POOL = ["man_ben", "man_christian", "man_simon", "woman_ela", "woman_irene", "woman_laura"]
const VOX = ["man_ben", "man_christian", "man_simon", "man_johann", "man_michael", "woman_ela", "woman_irene", "woman_laura", "woman_lisa", "woman_kathi"]
const V = voices as Record<string, { gender: "male" | "female"; age: "young" | "middle" | "old" }>
const AGE = { young: "jung (20–30)", middle: "mittleres Alter (35–55)", old: "älter (über 65)" } as const
const who = (k: string) => `${V[k].gender === "male" ? "Mann" : "Frau"}, ${AGE[V[k].age]}${k === "woman_kathi" ? ", selbst nach Deutschland eingewandert" : ""}`

const id = (teil: number, i = 0) => `${EXAM}-${SKILL}-${NN}-t${teil}-${String(i + 1).padStart(2, "0")}`
function blockBase(teil: number, blockId: string, textType: string, instruction: string): MtBlock {
  return { id: blockId, exam: EXAM, skill: SKILL, teil, status: "draft", generated: { model: MODEL, at: new Date().toISOString(), textType }, display: { instruction, items: [] }, key: { answers: [] } }
}

/** What the other skills of this set are about: set n is Prüfungssimulation n, so nothing may repeat across its sections. */
function otherSkills() {
  const p = PLAN
  const all: Record<string, string[]> = {
    lesen: [...p.lesen1, p.lesen2, p.lesen3, p.sb1, p.sb2],
    hoeren: [p.hoeren1, p.hoeren2, ...p.hoeren3.map(([, t]) => t)],
    schreiben: [p.schreiben],
    sprechen: [p.sprechen2, p.sprechen3],
  }
  return Object.entries(all).filter(([s]) => s !== SKILL).flatMap(([, t]) => t)
}

/** Names, places and senders the other sets of this skill already use. */
function avoidList(teil: number) {
  if (!fs.existsSync(DIR)) return []
  return fs.readdirSync(DIR).filter((f) => f.startsWith(`${SKILL}-`) && f !== path.basename(FILE)).flatMap((f) => {
    const set = JSON.parse(fs.readFileSync(path.join(DIR, f), "utf8")) as MtSet
    return set.blocks.filter((b) => b.teil === teil).map((b) => [b.generated.textType, b.display.reading?.sender, b.display.clip && Object.values(b.display.clip.speakers).map((s) => s.name).join("/")].filter(Boolean).join(" · "))
  })
}

const SECTION: Record<string, string> = { "lesen-1": "Lesen Teil 1", "lesen-2": "Lesen Teil 2", "lesen-3": "Lesen Teil 3", "lesen-4": "Sprachbausteine Teil 1", "lesen-5": "Sprachbausteine Teil 2", "hoeren-1": "Hören Teil 1", "hoeren-2": "Hören Teil 2", "hoeren-3": "Hören Teil 3", "schreiben-1": "Schreiben", "sprechen-1": "Sprechen Teil 1", "sprechen-2": "Sprechen Teil 2", "sprechen-3": "Sprechen Teil 3" }
/** The official situations for this Teil (research/telc-b1-official-situations.md), paraphrased. */
function official(teil: number) {
  const text = fs.readFileSync("research/telc-b1-official-situations.md", "utf8")
  const name = SECTION[`${SKILL}-${teil}`]
  return text.split("\n--- ").filter((sec) => sec.startsWith(name)).map((sec) => sec.split("\n=====")[0].trim()).join("\n")
}
const officialNote = (teil: number) => `Offizieller telc-Übungstest (nur Format, urheberrechtlich geschützt). Verwende KEINE dieser Situationen mit ihrem geprüften Detail, auch nicht umformuliert oder mit anderen Namen:
${official(teil)}`

const head = (teil: number, extra: string, feedback: string[]) => {
  const avoid = avoidList(teil)
  return `Modelltest ${SET}, ${SECTION[`${SKILL}-${teil}`]}.
Anweisung im Prüfungsheft: "${INSTRUCTION[`${SKILL}-${teil}`]}"
${extra}
${officialNote(teil)}
Andere Prüfungsteile dieses Modelltests behandeln schon diese Themen; verwende sie hier nicht (auch keine Namen oder Orte daraus): ${otherSkills().join("; ")}
${avoid.length ? `Andere Modelltests verwenden schon (wähle andere Namen, Orte, Firmen): ${avoid.join("; ")}` : ""}
${feedback.length ? `Der letzte Entwurf hatte diese Fehler. Behebe sie alle:\n- ${feedback.join("\n- ")}` : ""}`
}

/** Official texts, local only (.unit-cache/official-telc-b1, gitignored): any 6 words in a row we share with them. */
const OFFICIAL_DIR = ".unit-cache/official-telc-b1"
const officialGrams = fs.existsSync(OFFICIAL_DIR) ? grams(fs.readdirSync(OFFICIAL_DIR).map((f) => fs.readFileSync(path.join(OFFICIAL_DIR, f), "utf8")).join("\n")) : null
if (!officialGrams) console.warn(`  ${OFFICIAL_DIR} missing: no word-overlap check against the official Übungstest`)
const STOCK = /sehr geehrte damen und herren|mit freundlichen grüßen|vielen dank für ihre? \w+|ich freue mich auf ihre antwort|liebe grüße/gi

function copiedPhrases(blocks: MtBlock[]) {
  if (!officialGrams) return []
  const allowed = grams(blocks.map((b) => b.display.instruction).join(" \n "))
  const ours = grams(JSON.stringify(blocks.map((b) => ({ d: b.display, s: b.key.script?.map((t) => t.text), w: b.key.writing, sp: b.key.speaking?.sampleAnswers, l: b.key.live }))).replace(/\\n|[{}"\[\]:,]/g, " ").replace(STOCK, " xstockx "))
  const hits = [...ours].filter((g) => officialGrams.has(g) && !allowed.has(g))
  return hits.length ? [`these phrases are copied from the official Übungstest, rewrite them: "${hits.slice(0, 8).join('", "')}"`] : []
}

const Overlaps = z.object({ overlaps: z.array(z.object({ ours: z.string(), official: z.string(), why: z.string() })) })
/** Compares situations, not words: a re-skinned official task is as bad as a copied one. */
async function originality(teil: number, blocks: MtBlock[]) {
  const content = blocks.map((b) => ({ text: b.display.reading?.paragraphs ?? b.key.script?.map((t) => t.text) ?? b.display.writing ?? b.display.speaking?.turns.filter((t) => t.who !== "du").map((t) => t.text), items: b.display.items }))
  const o = await judge(Overlaps, `Prüfe einen neuen Prüfungsteil auf zu große Nähe zu offiziellem Material.
${officialNote(teil)}

Neuer Teil (JSON):
${JSON.stringify(content).slice(0, 30000)}

Liste jede Aufgabe oder jeden Text, dessen Situation UND geprüftes Detail einer offiziellen Aufgabe entspricht, auch bei anderen Namen, Zahlen oder Orten. Ein gleiches Alltagsthema allein (Reise, Restaurant, Wetter) ist kein Treffer; die Textsorte ist vorgegeben und kein Treffer. Wenn nichts zu nah ist: leere Liste.`)
  return o.overlaps.map((x) => `too close to official material (${x.official}): "${x.ours}" — ${x.why}. Choose a different situation and a different detail to test`)
}

const evidenceOf = (sources: string[], hit: string) => ({ text: sources.find((s) => s.includes(hit)) ?? sources.join(" "), hit })

/** a/b/c or r/f items of one text or clip; options move to the target letters. */
function choiceBlock(o: z.infer<typeof ChoiceOutput>, teil: number, blockId: string, first: number, want: string[]) {
  const block = blockBase(teil, blockId, o.textType, INSTRUCTION[`${SKILL}-${teil}`])
  const sources = o.audio ? o.audio.turns.map((t) => t.text) : o.reading!.paragraphs
  let choice = 0
  o.items.forEach((it, i) => {
    const n = first + i
    if (it.type === "rf") {
      block.display.items.push({ type: "rf", item: { n, statement: it.prompt } })
      block.key.answers.push({ n, correct: it.correct.trim().toLowerCase(), explanation: it.explanation, evidence: evidenceOf(sources, it.evidence) })
      return
    }
    const correct = it.correct.trim().toLowerCase()
    const to = want[choice++] ?? correct
    const options = place(it.options, correct, to)
    block.display.items.push({ type: "choice", item: { n, prompt: it.prompt, options: options.map((label, j) => ({ key: LETTERS[j], label })) } })
    block.key.answers.push({ n, correct: to, explanation: it.explanation, evidence: evidenceOf(sources, it.evidence) } satisfies ItemKey)
  })
  if (o.reading) block.display.reading = o.reading
  return block
}

/** The spoken words of a clip, cast to the given voices in speaker order. */
function clipOf(block: MtBlock, a: NonNullable<z.infer<typeof ChoiceOutput>["audio"]>, voiceList: string[], plays: 1 | 2) {
  const voiceOf = new Map(a.speakers.map((s, i) => [s.id, voiceList[i]]))
  for (const s of a.speakers) if (!voiceOf.get(s.id)) throw new Error(`uncast speaker ${s.id}`)
  for (const s of a.speakers) if (V[voiceOf.get(s.id)!].gender !== s.gender) throw new Error(`speaker ${s.id} is ${s.gender}, but the cast voice is not; keep the genders as given`)
  block.key.script = a.turns.map((t) => ({ speaker: t.speaker, voice: voiceOf.get(t.speaker)!, text: t.text, delivery: t.delivery || undefined }))
  block.display.clip = { duration: 0, plays, situation: a.situation, segments: [], speakers: Object.fromEntries(a.speakers.map((s, i) => [s.id, { name: s.role, tone: TONES[i % TONES.length] } satisfies Speaker])) }
}

const Headlines = z.object({
  textType: z.string(),
  texts: z.array(z.object({ text: z.string(), headline: z.string(), explanation: z.string(), evidence: z.string() })),
  distractors: z.array(z.string()),
})
const Pool = z.object({ textType: z.string(), letter: z.string(), gaps: z.array(z.object({ correct: z.string(), explanation: z.string() })), distractors: z.array(z.string()) })
const Grammar = z.object({ textType: z.string(), letter: z.string(), gaps: z.array(z.object({ options: z.array(z.string()), correct: z.string(), explanation: z.string() })) })

async function lesen(teil: number, feedback: string[]): Promise<MtBlock[]> {
  const full = partSpec("lesen", teil, EXAM).full!
  const r = rng(`${EXAM}-lesen-${SET}-${teil}`)
  if (teil === 1) {
    const o = await ask(Headlines, head(1, `Genau 5 kurze Meldungen aus Zeitung oder Zeitschrift ("texts"), in dieser Reihenfolge:
${PLAN.lesen1.map((t, i) => `${i + 1}. ${t}`).join("\n")}
Jede Meldung 55–80 Wörter, sachlicher Pressestil, mit konkreten Details (Institut oder Quelle, Zahlen, Ort, Preis, Termin), ohne eigene Überschrift im Text.
headline: die passende Überschrift (3–8 Wörter, wie in der Zeitung); sie fasst den Kern zusammen und wiederholt nicht die Schlüsselwörter der Meldung.
distractors: genau 5 weitere Überschriften, die zu keiner Meldung passen: jede greift ein Wort oder Thema aus einer der Meldungen auf, trifft aber nicht ihren Kern (z. B. andere Zielgruppe, Gegenteil, Nebensache).
explanation: nenne Überschriften nur mit ihrem Inhalt, nie mit Buchstaben. evidence: Ausschnitt aus der Meldung.`, feedback))
    const heads = shuffle([...o.texts.map((t) => t.headline), ...o.distractors], r)
    const block = blockBase(1, id(1), o.textType, INSTRUCTION["lesen-1"])
    block.display.items = [{ type: "match", data: { ads: heads.map((h, i) => ({ key: LETTERS[i], title: h, text: "" })), situations: o.texts.map((t, i) => ({ n: full.first + i, text: t.text })) }, noMatch: false }]
    block.key.answers = o.texts.map((t, i) => ({ n: full.first + i, correct: LETTERS[heads.indexOf(t.headline)], explanation: t.explanation, evidence: { text: t.text, hit: t.evidence } }))
    return [block]
  }
  if (teil === 2) {
    const o = await ask(ChoiceOutput, head(2, `Thema: ${PLAN.lesen2}.
Ein Artikel aus einer Zeitschrift oder Zeitung, ${full.length.min + 20}–${full.length.max - 20} Wörter: "reading.paragraphs" beginnt mit der Überschrift, dann ein kurzer Vorspann (1–2 Sätze), dann 4–6 Absätze. Menschen mit Namen, Alter oder Beruf, Zitate, Zahlen. "sender" leer, "source" = "Zeitschrift" oder "Zeitung". "audio" = null.
Genau 5 Aufgaben vom Typ "choice" in der Reihenfolge des Textes: "prompt" ist meist ein Satzanfang ("In dem Kurs können die Teilnehmer …"), die drei Optionen beenden den Satz. Die falschen Optionen nehmen Wörter oder Details aus dem Text auf, sagen aber etwas anderes. "pictos" leer.`, feedback))
    return [choiceBlock(o, 2, id(2), full.first, targets(5, r))]
  }
  if (teil === 3) {
    const o = await ask(AdsOutput, head(3, `Welt der Anzeigen: ${PLAN.lesen3}.
Genau 12 kleine Anzeigen ("ads", title + text, je 15–45 Wörter, zusammen ${full.length.min + 30}–${full.length.max - 40} Wörter) wie in einer Stadtzeitung oder im Internet: Name, Angebot, Zeiten, Preise, Adresse oder Telefon, Zielgruppe.
Genau 10 Situationen (1–2 Sätze: "Sie möchten …", "Ihr Sohn …", "Eine Freundin sucht …").
correct = Buchstabe der passenden Anzeige (a–l, in der Reihenfolge deiner Liste) oder "x". Genau 2 Situationen haben "x": für sie gibt es eine Anzeige zum Thema, die aber an einem Detail scheitert (andere Zielgruppe, falscher Ort oder Tag, nur Verkauf statt Kurs). Jede Anzeige passt höchstens zu einer Situation; vier Anzeigen passen zu keiner.
Die Situationen umschreiben das Bedürfnis mit eigenen Worten; sie wiederholen keine Schlüsselwörter der passenden Anzeige.
explanation: nenne andere Anzeigen nur mit Titel oder Namen, nie mit Buchstaben. evidence: Ausschnitt aus der passenden Anzeige; bei "x" aus der fast passenden.`, feedback))
    const order = shuffle(Array.from({ length: o.ads.length }, (_, i) => i), r)
    const ads = order.map((i, j) => ({ key: LETTERS[j], title: o.ads[i].title, text: o.ads[i].text }))
    const remap = (c: string) => (c.trim().toLowerCase() === "x" ? "x" : LETTERS[order.indexOf(LETTERS.indexOf(c.trim().toLowerCase()))])
    const block = blockBase(3, id(3), o.textType, INSTRUCTION["lesen-3"])
    block.display.items = [{ type: "match", data: { ads, situations: o.situations.map((s, i) => ({ n: full.first + i, text: s.text })) }, noMatch: true }]
    block.key.answers = o.situations.map((s, i) => {
      const src = ads.find((a) => a.text.includes(s.evidence) || a.title.includes(s.evidence))
      return { n: full.first + i, correct: remap(s.correct), explanation: s.explanation, evidence: src ? { text: `${src.title}. ${src.text}`, hit: s.evidence } : undefined }
    })
    return [block]
  }
  if (teil === 4) {
    const o = await ask(Grammar, head(4, `Thema: ${PLAN.sb1}.
Eine persönliche E-Mail (du) mit Anrede, Text und Gruß (Zeilenumbrüche mit \\n), ${full.length.min + 10}–${full.length.max - 10} Wörter mit den Lösungen eingesetzt.
Genau 10 Lücken {1} bis {10}, über den ganzen Text verteilt. Jede prüft Grammatik, alle Bereiche gemischt: Konnektoren (aber, denn, sondern, trotzdem, weil, obwohl), Artikel und Kasus, Hilfsverben (sein/haben/werden), Adjektivendungen, Präpositionen, Relativpronomen, Personal- und Reflexivpronomen, Verbformen (Partizip, Infinitiv).
gaps: in Reihenfolge {1}…{10}, je genau drei Optionen derselben Wortart (z. B. "dem / denen / die", "denn / weil / deshalb"); correct wörtlich wie in options; explanation nennt die Regel. Die zwei falschen Optionen müssen im Satz grammatisch falsch sein (Wortstellung, Kasus, Endung), nicht nur weniger passend: kein Paar wie "denn / aber", bei dem beide einen korrekten Satz ergeben.`, feedback))
    return [gapBlock(4, o.textType, o.letter, o.gaps.map((g) => ({ options: g.options, correct: g.correct, explanation: g.explanation })), full.first, targets(10, r), r)]
  }
  const o = await ask(Pool, head(5, `Thema: ${PLAN.sb2}.
Ein halbformeller oder formeller Brief (Sie) mit Anrede ("Sehr geehrte …"), Text und Gruß (Zeilenumbrüche mit \\n), ${full.length.min + 10}–${full.length.max - 10} Wörter mit den Lösungen eingesetzt. Konkrete Fragen und Bitten, wie man sie einer Firma, Schule oder Vermieterin schreibt.
Genau 10 Lücken {1} bis {10}, über den ganzen Text verteilt. Jede Lücke ist EIN Wort: Präposition, Konnektor, Adverb, Modalverb im Konjunktiv, Adjektiv in einer festen Wendung (z. B. "dankbar"), Fragewort.
gaps: in Reihenfolge {1}…{10}, correct = das Wort (klein geschrieben, außer Nomen), explanation nennt den Grund.
distractors: genau 5 weitere einzelne Wörter derselben Arten, die in keine Lücke passen (aber auf den ersten Blick möglich wirken). Alle 15 Wörter sind verschieden.`, feedback))
  const words = [...o.gaps.map((g) => g.correct.trim()), ...o.distractors.map((d) => d.trim())]
  if (new Set(words.map((w) => w.toLowerCase())).size !== 15) throw new Error(`the pool needs 15 different words (10 gaps + 5 distractors), got ${words.join(", ")}`)
  const pool = shuffle(words, r)
  return [gapBlock(5, o.textType, o.letter, o.gaps.map((g) => ({ options: pool, correct: g.correct.trim(), explanation: g.explanation })), full.first, [], r)]
}

/** A gap text with markers {1}…{10}. `want`: target letters for a/b/c gaps; empty for a word pool (options as given). */
function gapBlock(teil: number, textType: string, letter: string, gaps: { options: string[]; correct: string; explanation: string }[], first: number, want: string[], r: () => number) {
  const block = blockBase(teil, id(teil), textType, INSTRUCTION[`lesen-${teil}`])
  const parts: GapData["parts"] = []
  let rest = letter
  gaps.forEach((g, i) => {
    const [before, after] = rest.split(`{${i + 1}}`)
    if (after === undefined) throw new Error(`gap marker {${i + 1}} missing`)
    let options = g.options
    if (want.length) {
      const others = shuffle(g.options.filter((x) => x !== g.correct), r)
      const t = "abc".indexOf(want[i])
      options = [...others.slice(0, t), g.correct, ...others.slice(t)]
    }
    parts.push(before, { n: first + i, options })
    rest = after
  })
  parts.push(rest)
  block.display.items = [{ type: "gap", data: { parts } }]
  block.key.answers = gaps.map((g, i) => ({ n: first + i, correct: g.correct, explanation: g.explanation }))
  return block
}

const Vox = z.object({
  textType: z.string(),
  intro: z.string(),
  statements: z.array(z.object({ text: z.string(), delivery: z.string() })),
  items: z.array(z.object({ statement: z.string(), correct: z.string(), explanation: z.string(), evidence: z.string() })),
})
const Clips = z.object({ clips: z.array(ChoiceOutput) })
const SOUND: Record<H3Kind, SoundKey> = { anrufbeantworter: "beep", programm: "radio", wetter: "radio", verkehr: "radio", zug: "train", geschaeft: "store" }

async function hoeren(teil: number, feedback: string[]): Promise<MtBlock[]> {
  const full = partSpec("hoeren", teil, EXAM).full!
  const r = rng(`${EXAM}-hoeren-${SET}-${teil}`)
  if (teil === 1) {
    // A host and five people: both genders, at least one older and one young voice.
    const host = shuffle(["woman_irene", "woman_laura", "man_christian"], r)[0]
    let five: string[] = []
    for (;;) {
      five = shuffle(VOX.filter((k) => k !== host), r).slice(0, 5)
      const ages = five.map((k) => V[k].age)
      const g = five.filter((k) => V[k].gender === "female").length
      if (ages.includes("old") && ages.includes("young") && g >= 2 && g <= 3) break
    }
    const rf = mixedPattern(5, r)
    const o = await ask(Vox, head(1, `Eine Radiosendung: Umfrage zur Frage "${PLAN.hoeren1}".
intro: die Moderation (${who(host)}), 30–50 Wörter: stellt das Thema vor, sagt, wen man gefragt hat, und kündigt die Antworten an.
statements: genau 5 Personen in dieser Reihenfolge: ${five.map((k, i) => `${i + 1}. ${who(k)}`).join("; ")}. Jede sagt spontan ihre Meinung oder erzählt, wie es bei ihr ist: 55–85 Wörter, ich-Form, gesprochen mit Füllwörtern ("also", "na ja", "ähm"), passend zu Alter und Lebenssituation, OHNE ihren Namen zu nennen. Die Personen sind verschieden: Zustimmung, Ablehnung, "kommt drauf an". delivery: kurzer englischer Audio-Tag.
items: genau 5 Aussagen, eine pro Person in derselben Reihenfolge, beginnend mit "Der Sprecher …" oder "Die Sprecherin …" (passend zum Geschlecht). Jede prüft die Haltung oder das Wesentliche, nicht ein einzelnes Wort. correct in dieser Reihenfolge: ${rf.join(", ")}. Eine falsche Aussage nimmt etwas auf, das die Person erwähnt, aber anders meint.`, feedback))
    const block = blockBase(1, id(1), o.textType, INSTRUCTION["hoeren-1"])
    const ns = five.map((_, i) => full.first + i)
    block.key.script = [{ speaker: "moderation", voice: host, text: o.intro }, ...o.statements.map((s, i) => ({ speaker: `p${i + 1}`, voice: five[i], text: s.text, delivery: s.delivery || undefined, item: ns[i] }))]
    block.display.clip = { duration: 0, plays: 1, situation: "Umfrage im Radio", segments: [], speakers: Object.fromEntries([["moderation", { name: "Moderation", tone: TONES[0] }], ...five.map((k, i) => [`p${i + 1}`, { name: V[k].gender === "male" ? "Sprecher" : "Sprecherin", tone: TONES[(i + 1) % TONES.length] }])]) }
    block.display.items = o.items.map((it, i) => ({ type: "rf" as const, item: { n: ns[i], statement: it.statement } }))
    block.key.answers = o.items.map((it, i) => ({ n: ns[i], correct: it.correct.trim().toLowerCase(), explanation: it.explanation, evidence: { text: o.statements[i]?.text ?? "", hit: it.evidence } }))
    return [block]
  }
  if (teil === 2) {
    const [presenter, guest] = r() < 0.5 ? ["woman", "man"] : ["man", "woman"]
    const cast = shuffle(POOL.filter((k) => k.startsWith(presenter)), r).slice(0, 1).concat(shuffle(POOL.filter((k) => k.startsWith(guest)), r).slice(0, 1))
    const rf = mixedPattern(10, r)
    const o = await ask(ChoiceOutput, head(2, `Ein Interview im Radio: ${PLAN.hoeren2}.
"audio": genau 2 Sprecher, zuerst die Moderation (${presenter === "woman" ? "female" : "male"}, role = "Moderatorin" oder "Moderator"), dann der Gast (${guest === "woman" ? "female" : "male"}, role = Vorname und Beruf). Die Moderation begrüßt, stellt den Gast vor, fragt nach; der Gast erzählt ausführlich mit Beispielen, Zahlen und eigenen Erfahrungen. Zusammen ${Math.round(full.length.min * 2.5) + 20}–${Math.round(full.length.max * 2.5) - 20} Wörter, natürlich gesprochen (kurze Reaktionen, "ja, genau", "also"), am Ende Dank und Verabschiedung. situation: "Interview im Radio". "reading" = null.
Genau 10 Aufgaben vom Typ "rf" in der Reihenfolge des Gesprächs, über das ganze Interview verteilt ("prompt" = Aussage, options leer, "pictos" leer). correct in dieser Reihenfolge: ${rf.join(", ")}. Falsche Aussagen verändern ein Detail, das im Gespräch vorkommt (andere Zahl, andere Person, Gegenteil).`, feedback))
    const block = choiceBlock(o, 2, id(2), full.first, [])
    clipOf(block, o.audio!, cast, 2)
    return [block]
  }
  const slots = PLAN.hoeren3
  const cast = shuffle(POOL, r).slice(0, 5)
  const rf = mixedPattern(5, r)
  const KIND: Record<H3Kind, string> = {
    anrufbeantworter: "Nachricht auf dem Anrufbeantworter oder Bandansage einer Praxis, Firma oder eines Amtes",
    programm: "Programmhinweis im Radio (Termine, Orte, Preise)",
    wetter: "Wetterbericht im Radio (mehrere Regionen oder Tageszeiten)",
    verkehr: "Verkehrsmeldung im Radio",
    zug: "Durchsage im Zug oder am Bahnhof",
    geschaeft: "Durchsage in einem Geschäft oder Kaufhaus",
  }
  const o = await ask(Clips, head(3, `Genau 5 kurze Hörtexte als "clips", in dieser Reihenfolge:
${slots.map(([k, t], i) => `${i + 1}. ${KIND[k]}: ${t} (Sprecher: ${who(cast[i])}; Aussage: ${rf[i]})`).join("\n")}
Jeder Hörtext: genau ein Sprecher (gender wie angegeben), 55–85 Wörter, gesprochen, mit mehreren Details (Zeiten, Orte, Zahlen, Preise); nur eines davon wird gefragt, die anderen sind Distraktoren. "reading" = null. situation: Etikett mit 2–4 Wörtern.
Je Hörtext genau 1 Aufgabe "rf": eine Aussage zu einem konkreten Detail (Zeit, Ort, Zahl, Bedingung), correct wie angegeben. options und pictos leer.`, feedback))
  return o.clips.map((c, i) => {
    const block = choiceBlock(c, 3, id(3, i), full.first + i, [])
    clipOf(block, c.audio!, [cast[i]], 2)
    block.sound = SOUND[slots[i][0]]
    return block
  })
}

async function schreiben(feedback: string[]): Promise<MtBlock[]> {
  const spec = openParts(EXAM).find((p) => p.skill === "schreiben")!
  const o = await ask(WritingOutput, `Modelltest ${SET}, Schreiben (30 Minuten, eine E-Mail). Anweisung im Prüfungsheft: "${spec.instruction}"
Situation: ${PLAN.schreiben}.
Genau 1 Aufgabe (tasks hat ein Element), register "informell" bei du, "formell" bei Sie:
title: 2–4 Wörter.
situation: zuerst ein Satz in Sie-Form, wer geschrieben hat (z. B. "Sie haben von Ihrem Freund Malik diese E-Mail bekommen:"), dann die erhaltene E-Mail wörtlich in „…“, 70–100 Wörter, mit Anrede, Anliegen, zwei oder drei Fragen oder Bitten und Gruß, als ein Absatz.
points: genau 4 Leitpunkte wie im telc-Prüfungsheft: kurze indirekte Fragen oder Stichworte in Sie-Form (z. B. "wann Sie Zeit haben", "warum Sie …", "was Sie vorschlagen", "Frage nach …"). Mindestens einer verlangt eine Begründung, einer einen Vorschlag; ein Punkt darf etwas verlangen, das nicht in der E-Mail steht.
modelAnswer: Musterlösung auf gutem B1, 120–160 Wörter, erste Zeile "Betreff: …", dann Anrede, kurze Einleitung, alle vier Punkte in eigener Reihenfolge mit Konnektoren (weil, deshalb, außerdem, trotzdem), Schluss und Gruß (Zeilenumbrüche mit \\n). Nicht jeder Satz beginnt mit "Ich". Keine Wortzahl in der Aufgabe.
${officialNote(1)}
Andere Prüfungsteile dieses Modelltests behandeln schon: ${otherSkills().join("; ")}
${feedback.length ? `Der letzte Entwurf hatte diese Fehler:\n- ${feedback.join("\n- ")}` : ""}`)
  const block = blockBase(1, `${EXAM}-schreiben-${NN}`, "E-Mail beantworten", spec.instruction)
  block.display.writing = o.tasks.map((t) => ({ key: "A", title: t.title, situation: t.situation, points: t.points }))
  block.key.writing = o.tasks.map((t) => ({ key: "A", register: t.register, modelAnswer: t.modelAnswer }))
  return [block]
}

/** Interlokutor Ela, partner Ben (the approved Sprechen pair). The partner is the same man in all three Teile. */
const PRUEFER = "woman_ela"
const PARTNER = "man_ben"
const SPRECHEN_ROLES = `telc-B1-Paarprüfung: eine Prüferin (Moderatorin; siezt beide; spricht so wenig wie möglich, nur Einleitung, Übergänge und Ende), ein Partner (anderer Prüfungsteilnehmer, männlich; die beiden duzen sich) und "du" (die Person, die übt; Teilnehmer A). Die beiden sprechen miteinander, nicht mit der Prüferin.
Die Prüferin spricht "du" nie mit Namen an. Der Partner ist ein echter Lerner auf B1, kein Muttersprachler: einfache, aber vollständige Sätze, Alltagswortschatz; ab und zu "äh"; in etwa jedem zweiten Beitrag ein kleiner typischer Lernerfehler (falscher Artikel, Verbstellung im Nebensatz), nie mehr als einer und immer verständlich.
Alles ist gesprochene Sprache: Zahlen ausgeschrieben, keine Aufzählungszeichen, keine Klammern.
Ersatzsätze des Partners (falls die Live-Antwort ausfällt) beginnen mit einer neutralen Reaktion ("Ah, okay.", "Hm, verstehe.", "Ja, gut.") und nehmen NIE Bezug auf einen bestimmten Inhalt, den "du" gesagt haben könnte.`
const Sprechen1 = z.object({
  partner: z.object({ firstName: z.string(), lastName: z.string(), bio: z.string() }),
  welcome: z.string(), partnerLines: z.array(z.string()), extra: z.object({ text: z.string(), sample: z.string() }), duSamples: z.array(z.string()), close: z.string(),
})
const Sheet = z.object({ name: z.string(), age: z.number(), job: z.string(), opinion: z.string() })
const Sprechen2 = z.object({ topic: z.string(), duSheet: Sheet, partnerSheet: Sheet, partnerView: z.string(), intro: z.string(), partnerReport: z.string(), toDu: z.string(), partnerLines: z.array(z.string()), duSamples: z.array(z.string()), close: z.string() })
const Sprechen3 = z.object({ situation: z.string(), title: z.string(), points: z.array(z.string()), intro: z.string(), persona: z.string(), partnerLines: z.array(z.string()), duSamples: z.array(z.string()), close: z.string() })

function partnerOf(set: MtSet) {
  const t1 = set.blocks.find((b) => b.teil === 1)
  return t1?.display.speaking ? { name: t1.display.speaking.people.partner.name, bio: t1.key.live?.persona ?? "" } : null
}

function speakBlock(teil: number, textType: string, data: { title: string; task: string; points: string[] }, partnerName: string, turns: MtSpeakTurn[], samples: string[]): MtBlock {
  const block = blockBase(teil, `${EXAM}-sprechen-${NN}-t${teil}`, textType, data.task)
  const people: Record<"pruefer" | "partner" | "du", Person> = {
    pruefer: { name: "Prüferin", initial: "P", tone: "var(--v-sk-lesen)" },
    partner: { name: partnerName, initial: partnerName[0], tone: "var(--v-sk-schreiben)" },
    du: { name: "Du", initial: "Du", tone: "var(--p-glow)" },
  }
  block.display.speaking = { data: { part: `Sprechen · Teil ${teil}`, ...data }, people, turns }
  block.key.speaking = { voices: { pruefer: PRUEFER, partner: PARTNER }, sampleAnswers: samples }
  return block
}

const sheetText = (s: z.infer<typeof Sheet>) => `${s.name}, ${s.age} Jahre, ${s.job}: „${s.opinion}“`

async function sprechen(teil: number, feedback: string[], set: MtSet): Promise<MtBlock[]> {
  const fix = feedback.length ? `Der letzte Entwurf hatte diese Fehler. Behebe sie alle:\n- ${feedback.join("\n- ")}` : ""
  const avoid = fs.existsSync(DIR) ? fs.readdirSync(DIR).filter((f) => f.startsWith("sprechen-") && f !== path.basename(FILE)).map((f) => (JSON.parse(fs.readFileSync(path.join(DIR, f), "utf8")) as MtSet).blocks.find((b) => b.teil === 1)?.display.speaking?.people.partner.name).filter(Boolean) : []
  const T = (who: MtSpeakTurn["who"], text: string, extra: Partial<MtSpeakTurn> = {}): MtSpeakTurn => ({ who, phase: String(teil) as MtSpeakTurn["phase"], text, ...extra })
  const others = `Andere Prüfungsteile dieses Modelltests behandeln schon: ${otherSkills().join("; ")}`
  if (teil === 1) {
    const points = ["Name", "Herkunft", "Wohnung oder Haus", "Familie", "Wo hast du Deutsch gelernt?", "Arbeit, Ausbildung oder Schule", "Sprachen"]
    const o = await ask(Sprechen1, `Modelltest ${SET}, Sprechen Teil 1 "Einander kennenlernen" (ca. 3 Minuten für beide). ${SPRECHEN_ROLES}
Auf dem Blatt stehen diese Themen: ${points.join(", ")}. Die beiden stellen sich gegenseitig Fragen dazu und erzählen von sich.
partner: ein Mann, der in Deutschland lebt und Deutsch lernt; Vor- und Nachname aus seinem Herkunftsland${avoid.length ? ` (nicht: ${avoid.join(", ")})` : ""}. bio: 3–4 Sätze (Herkunft, seit wann hier, Wohnort und Wohnung, Familie, wo er Deutsch gelernt hat, Beruf, Sprachen). Er bleibt in Teil 2 und 3 dieselbe Person.
welcome: Die Prüferin begrüßt beide, stellt sich und die Kollegin kurz vor, sagt, dass die Prüfung drei Teile hat, und bittet die beiden, sich kennenzulernen und sich gegenseitig Fragen zu den Themen auf dem Blatt zu stellen; "du" beginnt. 45–75 Wörter.
partnerLines: genau 4 Beiträge des Partners (25–45 Wörter): jeder reagiert kurz neutral, erzählt etwas über sich passend zur bio und endet mit einer Frage an "du" zu einem anderen Thema des Blatts. Der letzte Beitrag stellt eine Frage zu einem Thema, das noch fehlt.
extra: eine Zusatzfrage der Prüferin an "du" zu Freizeit, Wochenende oder Hobbys (1 Satz, Sie-Form) und eine Beispielantwort (sample, 2–3 Sätze).
duSamples: genau 5 gute Beiträge von "du" auf B1 (25–45 Wörter, für eine erfundene Person): Beginn mit eigener Vorstellung und Frage an den Partner, dann Antworten auf seine Fragen 1–3 jeweils mit Gegenfrage, zuletzt Antwort auf seine Frage 4.
close: Die Prüferin beendet Teil 1, ein Satz.
${others}
${officialNote(1)}
${fix}`)
    const name = o.partner.firstName
    const turns: MtSpeakTurn[] = [
      T("pruefer", o.welcome),
      T("du", `Stell dich kurz vor und frag ${name} nach einem Thema vom Blatt.`, { seconds: 30 }),
      ...o.partnerLines.flatMap((line, i) => [T("partner", line, { live: "partner" }), T("du", i < o.partnerLines.length - 1 ? `Antworte ${name} und frag zurück.` : `Antworte ${name}.`, { seconds: 25 })]),
      T("pruefer", o.extra.text, { live: "followup" }),
      T("du", "Antworte auf die Frage der Prüferin.", { seconds: 20 }),
      T("pruefer", o.close),
    ]
    const block = speakBlock(1, "Einander kennenlernen", { title: "Einander kennenlernen", task: "Unterhalten Sie sich mit Ihrer Partnerin oder Ihrem Partner. Stellen Sie sich gegenseitig Fragen zu diesen Themen und erzählen Sie von sich.", points }, name, turns, [...o.duSamples, o.extra.sample])
    block.key.live = { followups: [{ text: o.extra.text, level: "B1", sample: o.extra.sample }], persona: `${o.partner.firstName} ${o.partner.lastName}: ${o.partner.bio}`, partnerLines: o.partnerLines.map((text) => ({ text })) }
    return [block]
  }
  const partner = partnerOf(set)
  if (!partner) throw new Error("Teil 1 first: the partner is cast there")
  if (teil === 2) {
    const o = await ask(Sprechen2, `Modelltest ${SET}, Sprechen Teil 2 "Über ein Thema sprechen" (ca. 6 Minuten für beide). ${SPRECHEN_ROLES}
Der Partner ist ${partner.bio}
Thema: ${PLAN.sprechen2}. topic: der Titel auf dem Blatt (2–5 Wörter).
Jeder hat in einer Zeitschrift eine andere Meinung gelesen: duSheet (für "du") und partnerSheet (für den Partner) mit gegensätzlicher Meinung. Jede Meinung: Vorname und Nachname, Alter, Beruf, opinion = 40–55 Wörter in Ich-Form mit zwei Gründen, B1.
partnerView: was der Partner selbst denkt und erlebt hat (2–3 Sätze, für eine KI, die ihn live spricht); er ist eher auf der Seite seines Blatts, aber nicht extrem.
intro: Die Prüferin leitet zu Teil 2 über und bittet zuerst den Partner ("Herr <Nachname>"), zu erzählen, was er gelesen hat. 20–40 Wörter, in eigenen Worten.
partnerReport: der Partner berichtet in eigenen Worten (3. Person), was auf seinem Blatt steht, 40–60 Wörter.
toDu: Die Prüferin bittet "du", von seinem Blatt zu berichten, 1 Satz.
partnerLines: genau 4 Beiträge (30–50 Wörter): 1. reagiert auf das Gehörte und sagt seine eigene Meinung mit einer Erfahrung, Frage an "du" nach der Meinung; 2. widerspricht teilweise höflich mit einem Beispiel, fragt nach Erfahrungen von "du"; 3. erzählt, wie das in seinem Herkunftsland ist, und fragt zurück; 4. fasst zusammen, wo man einig ist und wo nicht.
duSamples: genau 4 gute Beiträge von "du" auf B1 (35–60 Wörter): 1. Bericht über das eigene Blatt (3. Person), 2. eigene Meinung mit Grund, 3. eigene Erfahrung, 4. Reaktion auf die Zusammenfassung.
close: Die Prüferin dankt und beendet Teil 2, ein Satz.
${others}
${officialNote(2)}
${fix}`)
    const turns: MtSpeakTurn[] = [
      T("pruefer", o.intro),
      T("partner", o.partnerReport),
      T("pruefer", o.toDu),
      T("du", "Berichte, was auf deinem Blatt steht.", { seconds: 45 }),
      T("partner", o.partnerLines[0] ?? "", { live: "partner" }),
      T("du", "Sag deine Meinung und begründe sie.", { seconds: 50 }),
      T("partner", o.partnerLines[1] ?? "", { live: "partner" }),
      T("du", "Erzähl von deinen Erfahrungen.", { seconds: 45 }),
      T("partner", o.partnerLines[2] ?? "", { live: "partner" }),
      T("du", "Antworte und reagiere.", { seconds: 40 }),
      T("partner", o.partnerLines[3] ?? "", { live: "partner" }),
      T("pruefer", o.close),
    ]
    const task = `Sie haben in einer Zeitschrift eine Meinung zum Thema „${o.topic}“ gelesen. Berichten Sie Ihrer Partnerin oder Ihrem Partner davon. Sie oder er hat eine andere Meinung gelesen und berichtet Ihnen auch. Sprechen Sie dann zusammen über das Thema: Sagen Sie Ihre Meinung und erzählen Sie von Ihren Erfahrungen.`
    const block = speakBlock(2, "Über ein Thema sprechen", { title: o.topic, task, points: [sheetText(o.duSheet)] }, partner.name, turns, o.duSamples)
    block.key.live = { persona: `${partner.bio}\nBlatt von ${partner.name}: ${sheetText(o.partnerSheet)}\nEigene Sicht: ${o.partnerView}`, partnerLines: o.partnerLines.map((text) => ({ text })) }
    return [block]
  }
  const o = await ask(Sprechen3, `Modelltest ${SET}, Sprechen Teil 3 "Gemeinsam etwas planen" (ca. 6 Minuten für beide). ${SPRECHEN_ROLES}
Der Partner ist ${partner.bio}
Aufgabe: ${PLAN.sprechen3}.
situation: der Text auf dem Aufgabenblatt, 2–3 Sätze in Sie-Form: was der Anlass ist und dass Sie es zusammen mit Ihrer Partnerin / Ihrem Partner planen und überlegen, was zu tun ist und wer was übernimmt.
title: Überschrift der Liste (1–3 Wörter).
points: genau 5 Notizpunkte wie auf dem Blatt, je 1–4 Wörter (z. B. "Wann?", "Wo?", "Essen", "Wer bezahlt wofür?"), ohne den Punkt "…".
intro: Die Prüferin leitet zum letzten Teil über, umschreibt die Aufgabe in eigenen Worten und bittet "du", anzufangen. 25–45 Wörter.
persona: was der Partner bei jedem Punkt möchte, kann oder nicht kann, und wo er Kompromisse macht (5–7 Sätze, für eine KI, die ihn live spricht). Bei mindestens zwei Punkten möchte er zuerst etwas anderes als die meisten.
partnerLines: genau 6 Beiträge (20–40 Wörter): je einer zu Punkt 1 bis 5 in Reihenfolge (Vorschlag mit Grund und Frage an "du"), dann einer, der die Aufgaben verteilt und den Plan zusammenfasst und fragt, ob "du" einverstanden ist.
duSamples: genau 6 gute Beiträge von "du" auf B1 (25–45 Wörter): erster Vorschlag zu Punkt 1, dann Reaktion und eigener Vorschlag zu Punkt 2 bis 5, zuletzt Zustimmung und eine eigene Aufgabe.
close: Die Prüferin beendet die Prüfung und dankt beiden, 1–2 Sätze. Kein Hinweis auf das Ergebnis.
${others}
${officialNote(3)}
${fix}`)
  const turns: MtSpeakTurn[] = [T("pruefer", o.intro)]
  o.partnerLines.forEach((line, i) => {
    turns.push(T("du", i === 0 ? "Mach einen ersten Vorschlag und begründe ihn." : "Reagiere, mach Vorschläge, einigt euch.", { seconds: 30 }))
    turns.push(T("partner", line, { live: "partner" }))
  })
  turns.push(T("pruefer", o.close))
  const task = `${o.situation} Machen Sie Vorschläge, reagieren Sie auf die Vorschläge Ihrer Partnerin oder Ihres Partners und einigen Sie sich auf einen gemeinsamen Plan.`
  const block = speakBlock(3, "Gemeinsam etwas planen", { title: o.title, task, points: [...o.points, "…"] }, partner.name, turns, o.duSamples)
  block.key.live = { persona: `${partner.bio}\n${o.persona}`, partnerLines: o.partnerLines.map((text) => ({ text })) }
  return [block]
}

function validate(teil: number, blocks: MtBlock[]) {
  if (SKILL === "schreiben") return validateWriting(blocks, EXAM)
  if (SKILL === "sprechen") return validateSprechenTelc(blocks[0])
  return validateTeil(EXAM, SKILL, teil, blocks).filter((i) => !/^clip seconds/.test(i))
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
      feedback = validate(teil, blocks)
      feedback.push(...copiedPhrases(blocks))
      if (!feedback.length) feedback = await originality(teil, blocks)
    } catch (e) {
      if (e instanceof Error && /credit balance/i.test(e.message)) throw new Error("Anthropic credit balance too low, stopping")
      feedback = [e instanceof Error ? e.message : String(e)]
    }
    if (!feedback.length) break
    console.log(`  ${SKILL} Teil ${teil} issues:\n  - ${feedback.join("\n  - ")}`)
  }
  if (feedback.length) throw new Error(`${SKILL} ${NN} Teil ${teil}: still ${feedback.length} issue(s) after 3 attempts`)
  fs.mkdirSync(CACHE, { recursive: true })
  fs.writeFileSync(cacheFile, JSON.stringify(blocks, null, 2))
  return blocks
}

async function main() {
  const teile = SKILL === "schreiben" ? [1] : SKILL === "sprechen" ? [1, 2, 3] : SKILL === "hoeren" ? [1, 2, 3] : [1, 2, 3, 4, 5]
  const set: MtSet = fs.existsSync(FILE) ? JSON.parse(fs.readFileSync(FILE, "utf8")) : { exam: EXAM, skill: SKILL, number: SET, title: `Modelltest ${SET}`, blocks: [] }
  const save = (teil: number, blocks: MtBlock[]) => {
    set.blocks = [...set.blocks.filter((b) => b.teil !== teil), ...blocks].sort((a, b) => a.teil - b.teil)
    fs.mkdirSync(DIR, { recursive: true })
    fs.writeFileSync(FILE, JSON.stringify(set, null, 2) + "\n")
  }
  const run = (teil: number) => unit(teil, set).then((b) => save(teil, b))
  const wanted = teile.filter((t) => !ONLY || t === ONLY)
  // Sprechen Teil 2 and 3 need the partner cast in Teil 1; everything else runs at once (one batch).
  if (SKILL === "sprechen" && wanted.includes(1)) await run(1)
  const results = await Promise.allSettled(wanted.filter((t) => !(SKILL === "sprechen" && t === 1)).map(run))
  const failed = results.flatMap((r) => (r.status === "rejected" ? [r.reason instanceof Error ? r.reason.message : String(r.reason)] : []))
  if (failed.length) throw new Error(failed.join("\n"))
  console.log(`→ ${FILE}`)
}

main().catch((e) => {
  console.error(e instanceof Error ? e.message : e)
  process.exit(1)
})
