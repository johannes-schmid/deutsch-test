// Drafts Kurztest blocks with Claude. Output is status "draft"; a human reviews before anything ships.
// npx tsx scripts/generate-kurztest.ts --skill lesen --teil 3 [--count 1]
// npx tsx scripts/generate-kurztest.ts --skill hoeren --kurztest   (fills every missing block of the 10-item set)
// npx tsx scripts/generate-kurztest.ts --exam telc-b1 --skill hoeren --teil 3   (other exams: lib/exam/exam-blueprints.ts → data/gratis-test/<exam>)

import fs from "node:fs"
import path from "node:path"
import Anthropic from "@anthropic-ai/sdk"
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod"
import { z } from "zod"
import voices from "@/data/tts-voices.json"
import { kurztestItems, kurztestPlan, openParts, partSpec, partsOf, type PartSpec } from "@/lib/exam/blueprint"
import { EXAM_CONTEXT } from "@/lib/exam/exam-blueprints"
import type { ItemKey, KurztestBlock, KurztestItem, ScriptTurn } from "@/lib/exam/kurztest"
import { PICTO_KEYS } from "@/lib/exam/pictos"
import type { GapData, PartId, Person, Speaker, Turn } from "@/lib/exam/types"
import { EXAM_IDS, type ExamId } from "@/lib/exams"

const MODEL = "claude-opus-5-5"
const EXAM = (process.argv.includes("--exam") ? process.argv[process.argv.indexOf("--exam") + 1] : "dtz") as ExamId
if (!EXAM_IDS.includes(EXAM)) throw new Error(`Unknown exam "${EXAM}"`)
const DIR = EXAM === "dtz" ? "data/kurztest/drafts" : `data/gratis-test/${EXAM}`
const ID_PREFIX = EXAM === "dtz" ? "" : `${EXAM}-`
const TONES = ["var(--v-sk-lesen)", "var(--v-sk-schreiben)", "var(--v-sk-sprechen)"]
const client = new Anthropic()

const arg = (name: string) => {
  const i = process.argv.indexOf(`--${name}`)
  return i > -1 ? process.argv[i + 1] : undefined
}

const DTZ_SYSTEM = `Du schreibst Prüfungsaufgaben für den Deutsch-Test für Zuwanderer (DTZ, Niveau A2–B1).
Ziel: Wer unsere Aufgaben übt, erlebt am Prüfungstag keine Überraschung. Format, Länge, Textsorte und Register entsprechen der echten Prüfung.

Regeln:
- Schreibe alles neu. Übernimm nie Texte, Namen oder Aufgaben aus offiziellen Modelltests (telc, g.a.s.t.) oder von anderen Anbietern.
- Alltag in Deutschland: Behörden, Arbeit, Wohnen, Gesundheit, Kinder, Einkaufen, Verkehr. Realistische, aber erfundene Namen, Firmen, Adressen und Telefonnummern.
- Sprache wie in der echten Prüfung: natürlich, idiomatisch, nicht vereinfacht. Hörtexte klingen gesprochen (Begrüßung, kurze Sätze, Füllwörter in Gesprächen, Zahlen und Uhrzeiten ausgeschrieben, wie man sie spricht).
- Aufgaben im DTZ-Stil: Die falschen Antworten (Distraktoren) kommen im Text auch vor, passen aber nicht (andere Zeit, anderer Ort, wurde geändert, gilt nur für andere Personen). Die Lösung steht nie wörtlich gleich wie im Text; sie ist umformuliert.
- Richtig/Falsch-Aussagen: eindeutig entscheidbar aus dem Text.
- Antwortoptionen: genau drei, ähnlich lang, ohne Buchstaben davor.
- correct: bei Auswahl der Buchstabe a, b oder c; bei Richtig/Falsch das Wort richtig oder falsch.
- explanation: einfaches Deutsch, höchstens zwei kurze Sätze, du-Form. Sagt, warum die Lösung stimmt und warum die naheliegende falsche Antwort nicht.
- evidence: ein exakter, zusammenhängender Ausschnitt aus dem Text oder einem Sprecherbeitrag (Zeichen für Zeichen kopiert), der die Lösung belegt.
- situation (Hörtexte): kurzes Etikett mit 2–4 Wörtern, wie es über dem Player steht, z. B. "Durchsage am Bahnhof" oder "Gespräch in der Apotheke". Kein Satz.
- role (Hörtexte): kurze Rolle, z. B. "Apothekerin", "Kunde", "Ansage".
- delivery (nur Hörtexte): ein kurzer englischer Audio-Tag für die Sprechweise, z. B. "[calm, announcer]" oder "[friendly]". Sonst leer.`

function examSystem(exam: Exclude<ExamId, "dtz">) {
  const c = EXAM_CONTEXT[exam]
  return `Du schreibst Prüfungsaufgaben für ${c.name}, Niveau ${c.level}.
Ziel: Wer unsere Aufgaben übt, erlebt am Prüfungstag keine Überraschung. Format, Länge, Textsorte, Register und Schwierigkeit entsprechen genau dieser Prüfung auf Niveau ${c.level}, nicht leichter und nicht schwerer.

Regeln:
- Schreibe alles neu. Übernimm nie Texte, Namen oder Aufgaben aus offiziellen Übungssätzen oder Modelltests (${c.copyright}) oder von anderen Anbietern.
- Themen und Orte: ${c.setting}. Realistische, aber erfundene Namen, Firmen, Adressen, Webadressen und Telefonnummern.
- Sprache wie in der echten Prüfung auf ${c.level}: natürlich, nicht künstlich. Hörtexte klingen gesprochen (Begrüßung, kurze Sätze, Zahlen und Uhrzeiten ausgeschrieben, wie man sie spricht; in Gesprächen und Interviews auch Füllwörter).
- Distraktoren: Die falschen Antworten kommen im Text auch vor oder passen fast, sind aber falsch (andere Zeit, anderer Ort, wurde geändert, gilt für andere Personen). Die Lösung steht nicht wörtlich gleich wie im Text; sie ist umformuliert (auf A1 darf sie näher am Text sein).
- Richtig/Falsch-Aussagen: eindeutig entscheidbar aus dem Text.
- Antwortoptionen: ähnlich lang, ohne Buchstaben davor.
- correct: bei Auswahl der Buchstabe (a, b, c …); bei Richtig/Falsch das Wort richtig oder falsch.
- explanation: einfaches Deutsch, höchstens zwei kurze Sätze, du-Form. Sagt, warum die Lösung stimmt und warum die naheliegende falsche Antwort nicht.
- evidence: ein exakter, zusammenhängender Ausschnitt aus dem Text oder einem Sprecherbeitrag (Zeichen für Zeichen kopiert), der die Lösung belegt.
- situation (Hörtexte): kurzes Etikett mit 2–4 Wörtern, wie es über dem Player steht, z. B. "Nachricht am Telefon". Kein Satz.
- role (Hörtexte): kurze Rolle, z. B. "Reporterin", "Ansage", oder bei Interviews der Vorname.
- delivery (nur Hörtexte): ein kurzer englischer Audio-Tag für die Sprechweise, z. B. "[calm, announcer]" oder "[friendly, spontaneous]". Sonst leer.`
}

const SYSTEM = EXAM === "dtz" ? DTZ_SYSTEM : examSystem(EXAM)

const HINTS: Record<string, string> = {
  "lesen-1": `Der Text ist ein Wegweiser oder eine Übersicht: jede Zeile in "paragraphs" ist eine Etage, Abteilung oder Rubrik mit Stichworten (z. B. "2. Stock: Meldeamt, Fundbüro, Kfz-Zulassung"). "sender" ist der Ort (z. B. "Bürgeramt Mitte"), "source" die Art ("Wegweiser im Eingang"). Die Frage beschreibt eine Situation ("Sie haben Ihren Ausweis verloren. Wohin gehen Sie?"), die Optionen sind drei Stellen aus dem Wegweiser. Die Distraktoren passen fast (ähnliches Stichwort).`,
  "lesen-3": `Ein kurzer Gebrauchstext (Aushang, E-Mail, Brief). "sender" ist der Absender, "source" die Art des Textes.`,
  "lesen-4": `Ein Regeltext (Hausordnung, Nutzungsbedingungen, Teilnahmebedingungen) mit Überschrift in der ersten Zeile und kurzen Absätzen. "sender" ist die Einrichtung, "source" die Textsorte.`,
  "hoeren-1": `Eine Person spricht. Bahnhof/Kaufhaus: Lautsprecherdurchsage. Anrufbeantworter: Ansage mit Begrüßung, Name, Anliegen, Rückrufbitte und Telefonnummer.`,
  "hoeren-2": `Eine Radiosprecherin oder ein Radiosprecher. Nennt den Sender, dann das Ereignis mit Ort, Datum, Uhrzeiten und Preisen. Mehrere Details, von denen nur eins gefragt ist.`,
  "hoeren-3": `Zwei Personen im Gespräch, abwechselnd, natürlich gesprochen.`,
}

const ChoiceOutput = z.object({
  textType: z.string(),
  reading: z.object({ sender: z.string(), source: z.string(), paragraphs: z.array(z.string()) }).nullable(),
  audio: z
    .object({
      situation: z.string(),
      speakers: z.array(z.object({ id: z.string(), role: z.string(), gender: z.enum(["male", "female"]) })),
      turns: z.array(z.object({ speaker: z.string(), text: z.string(), delivery: z.string() })),
    })
    .nullable(),
  items: z.array(z.object({ type: z.enum(["choice", "rf"]), prompt: z.string(), options: z.array(z.string()), pictos: z.array(z.enum(PICTO_KEYS)), correct: z.string(), explanation: z.string(), evidence: z.string() })),
})

const AdsOutput = z.object({
  textType: z.string(),
  ads: z.array(z.object({ title: z.string(), text: z.string() })),
  situations: z.array(z.object({ text: z.string(), correct: z.string(), explanation: z.string(), evidence: z.string() })),
})

const OpinionsOutput = z.object({
  textType: z.string(),
  situation: z.string(),
  speakers: z.array(z.object({ id: z.string(), name: z.string(), gender: z.enum(["male", "female"]), delivery: z.string() })),
  opinions: z.array(z.object({ speaker: z.string(), text: z.string() })),
  statements: z.array(z.string()),
  answers: z.array(z.object({ speaker: z.string(), correct: z.string(), explanation: z.string(), evidence: z.string() })),
})

const GapOutput = z.object({
  textType: z.string(),
  letter: z.string(),
  gaps: z.array(z.object({ options: z.array(z.string()), correct: z.string(), explanation: z.string() })),
})

const WritingOutput = z.object({
  tasks: z.array(z.object({ title: z.string(), situation: z.string(), points: z.array(z.string()), register: z.enum(["formell", "informell"]), modelAnswer: z.string() })),
})

const SpeakingOutput = z.object({
  textType: z.string(),
  title: z.string(),
  task: z.string(),
  points: z.array(z.string()),
  cards: z.array(z.object({ label: z.string(), picto: z.enum(PICTO_KEYS).nullable() })),
  pruefer: z.object({ gender: z.enum(["male", "female"]) }),
  partner: z.object({ name: z.string(), gender: z.enum(["male", "female"]) }),
  turns: z.array(z.object({ who: z.enum(["pruefer", "partner", "du"]), text: z.string(), sampleAnswer: z.string() })),
  pictureBrief: z.string().nullable(),
})

async function ask<T extends z.ZodType>(schema: T, prompt: string): Promise<z.infer<T>> {
  const res = await client.messages.parse({
    model: MODEL,
    max_tokens: 16000,
    output_config: { effort: "high", format: zodOutputFormat(schema) },
    system: SYSTEM,
    messages: [{ role: "user", content: prompt }],
  })
  if (res.stop_reason === "refusal") throw new Error(`Refused: ${res.stop_details?.explanation ?? ""}`)
  if (!res.parsed_output) throw new Error(`Unparseable output (stop_reason ${res.stop_reason})`)
  const cost = (res.usage.input_tokens * 4 + res.usage.output_tokens * 20) / 1e6
  console.log(`    in=${res.usage.input_tokens} out=${res.usage.output_tokens} ~$${cost.toFixed(3)}`)
  return res.parsed_output
}

function cast(speakers: { id: string; gender: "male" | "female" }[], accents: string[] = ["de"]) {
  const used = new Set<string>()
  const map = new Map<string, string>()
  for (const [i, s] of speakers.entries()) {
    const accent = accents[i] ?? "de"
    // Random among the fitting voices, so single-speaker clips don't all get the first voice in the file.
    const fits = Object.entries(voices).filter(([k, v]) => v.gender === s.gender && v.accent === accent && !used.has(k))
    const pick = fits[Math.floor(Math.random() * fits.length)]
    if (!pick) throw new Error(`No free ${s.gender} ${accent} voice for speaker ${s.id}`)
    used.add(pick[0])
    map.set(s.id, pick[0])
  }
  return map
}

const letters = "abcdefgh"
const header = (skill: PartId, teil: number, spec: PartSpec, textType: string, avoid: string[]) =>
  `Teil: ${spec.label ?? `${skill === "hoeren" ? "Hören" : "Lesen"}, Teil ${teil}`}.
Anweisung in der Prüfung: "${spec.instruction}"
Textsorte: ${textType}
${EXAM === "dtz" ? HINTS[`${skill}-${teil}`] ?? "" : spec.hint ?? ""}
${avoid.length ? `Schon vorhanden, wähle eine andere Situation und andere Namen: ${avoid.join("; ")}` : ""}`

function base(skill: PartId, teil: number, id: string, textType: string, instruction: string): KurztestBlock {
  return { id, ...(EXAM === "dtz" ? {} : { exam: EXAM }), skill, teil, status: "draft", generated: { model: MODEL, at: new Date().toISOString(), textType }, display: { instruction, items: [] }, key: { answers: [] } }
}

async function closedBlock(skill: PartId, teil: number, id: string, index: number, textType: string, avoid: string[]): Promise<KurztestBlock> {
  const spec = partSpec(skill, teil, EXAM)
  const k = kurztestItems(skill, teil, EXAM) ?? spec.sample ?? spec.itemsPerBlock
  const first = partsOf(EXAM).filter((p) => p.skill === skill && p.teil < teil).reduce((n, p) => n + p.itemsReal, 0) + 1 + index * k
  const nOpts = spec.options ?? 3
  const listening = spec.length.unit === "seconds"
  const head = header(skill, teil, spec, textType, avoid)
  const block = base(skill, teil, id, textType, spec.instruction)

  if (spec.answer === "match" && !listening && spec.headings) {
    const o = await ask(AdsOutput, `${head}
Schreibe genau ${spec.ads} Überschriften als "ads" (title = Überschrift, text = leer) und genau ${k} Zeitungsmeldungen als "situations" (text = die Meldung, ${spec.length.min}–${spec.length.max} Wörter). correct ist der Buchstabe (a–${letters[spec.ads! - 1]}) der passenden Überschrift.
evidence: Ausschnitt aus der Meldung, der zur Überschrift passt.`)
    block.generated.textType = o.textType
    const adList = o.ads.map((a, i) => ({ key: letters[i], title: a.title, text: a.text }))
    block.display.items = [{ type: "match", data: { ads: adList, situations: o.situations.map((s, i) => ({ n: first + i, text: s.text })) }, noMatch: false }]
    block.key.answers = o.situations.map((s, i) => ({ n: first + i, correct: s.correct.trim().toLowerCase(), explanation: s.explanation, evidence: s.text.includes(s.evidence) ? { text: s.text, hit: s.evidence } : undefined }))
    return block
  }

  if (spec.answer === "match" && !listening && EXAM !== "dtz") {
    const ads = spec.ads!
    const o = await ask(AdsOutput, `${head}
Schreibe genau ${ads} Anzeigen mit Titel und genau ${k} Situationen (ein Satz). correct ist der Buchstabe der passenden Anzeige (a–${letters[ads - 1]})${spec.noMatch ? ` oder "x", wenn keine passt. Genau eine Situation hat "x"` : `. Jede Anzeige passt höchstens zu einer Situation`}. Zu jeder Situation gibt es eine Anzeige, die fast passt.
evidence: Ausschnitt aus der passenden Anzeige${spec.noMatch ? `; bei "x" ein Ausschnitt aus der fast passenden Anzeige` : ""}.`)
    block.generated.textType = o.textType
    const adList = o.ads.map((a, i) => ({ key: letters[i], title: a.title, text: a.text }))
    block.display.items = [{ type: "match", data: { ads: adList, situations: o.situations.map((s, i) => ({ n: first + i, text: s.text })) }, noMatch: !!spec.noMatch }]
    block.key.answers = o.situations.map((s, i) => {
      const src = adList.find((a) => a.text.includes(s.evidence))
      return { n: first + i, correct: s.correct.trim().toLowerCase(), explanation: s.explanation, evidence: src ? { text: src.text, hit: s.evidence } : undefined }
    })
    return block
  }

  if (spec.answer === "match" && !listening) {
    const ads = 6
    const o = await ask(AdsOutput, `${head}
Schreibe genau ${ads} Kleinanzeigen (in der echten Prüfung 8 Anzeigen für 5 Situationen; hier gekürzt). Jede Anzeige 35–60 Wörter, mit Titel. Typische Inhalte: Kurse, Wohnungen, Möbel, Dienstleistungen, Kinderbetreuung, Freizeit.
Dann genau ${k} Situationen ("Sie …", ein Satz). correct ist der Buchstabe der passenden Anzeige (a–${letters[ads - 1]}) oder "x", wenn keine passt. Höchstens eine Situation hat "x". Zu jeder Situation gibt es eine Anzeige, die fast passt (anderer Tag, andere Zielgruppe, zu teuer).
evidence: Ausschnitt aus der passenden Anzeige; bei "x" ein Ausschnitt aus der fast passenden Anzeige.`)
    block.generated.textType = o.textType
    const adList = o.ads.map((a, i) => ({ key: letters[i], title: a.title, text: a.text }))
    const situations = o.situations.map((s, i) => ({ n: first + i, text: s.text }))
    block.display.items = [{ type: "match", data: { ads: adList, situations }, noMatch: true }]
    block.key.answers = o.situations.map((s, i) => {
      const src = adList.find((a) => a.text.includes(s.evidence))
      return { n: first + i, correct: s.correct.trim().toLowerCase(), explanation: s.explanation, evidence: src ? { text: src.text, hit: s.evidence } : undefined }
    })
    return block
  }

  if (spec.answer === "match" && listening) {
    const o = await ask(OpinionsOutput, `${head}
Eine Radiosendung: Hörerinnen und Hörer sagen ihre Meinung zu einem Thema. Genau 3 Personen (mindestens eine Frau und ein Mann), jede spricht einmal 25–30 Sekunden (etwa 60–70 Wörter), mit Vorname. Keine Moderation.
Schreibe 6 Aussagen (ohne Buchstaben): 3 passen je genau zu einer Person, 3 sind Distraktoren, die zum Thema passen, aber von keiner Person so gemeint sind.
answers: für jede Person in Reihenfolge der Buchstabe (a–f) der passenden Aussage.
evidence: Ausschnitt aus dem Beitrag der Person.`)
    block.generated.textType = o.textType
    const voiceOf = cast(o.speakers)
    const script: ScriptTurn[] = o.opinions.map((t) => {
      const sp = o.speakers.find((s) => s.id === t.speaker)
      return { speaker: t.speaker, voice: voiceOf.get(t.speaker)!, text: t.text, delivery: sp?.delivery || undefined }
    })
    block.key.script = script
    block.display.clip = {
      duration: 0, plays: spec.plays ?? 1, situation: o.situation, segments: [],
      speakers: Object.fromEntries(o.speakers.map((s, i) => [s.id, { name: s.name, tone: TONES[i % TONES.length] } satisfies Speaker])),
    }
    const situations = o.speakers.map((s, i) => ({ n: first + i, text: `Was meint ${s.name}?` }))
    block.display.items = [{ type: "match", data: { ads: o.statements.map((s, i) => ({ key: letters[i], title: "", text: s })), situations }, noMatch: false }]
    block.key.answers = o.answers.map((a, i) => {
      const op = o.opinions.find((x) => x.speaker === a.speaker)
      return { n: first + i, correct: a.correct.trim().toLowerCase(), explanation: a.explanation, evidence: op ? { text: op.text, hit: a.evidence } : undefined }
    })
    return block
  }

  if (spec.answer === "gap") {
    const o = await ask(GapOutput, `${head}
${EXAM === "dtz" ? `Ein formeller Brief, ${spec.length.min}–${spec.length.max} Wörter, mit Ort/Datum, Betreff, Anrede, Text und Gruß (Zeilenumbrüche mit \\n).
Genau ${k} Lücken (in der echten Prüfung 6; hier gekürzt). Markiere sie im Brief als {1}, {2} … Typische Lücken: Präpositionen, Konnektoren, Verben in der richtigen Form, feste Wendungen aus formellen Briefen.` : `Der Text, ${spec.length.min}–${spec.length.max} Wörter (Zeilenumbrüche mit \\n).
Genau ${k} Lücken (in der echten Prüfung ${spec.itemsReal}; hier gekürzt), verteilt über den ganzen Text. Markiere sie als {1}, {2} …`}
gaps: in Reihenfolge, je drei Optionen (einzelne Wörter oder kurze Wendungen). correct ist die richtige Option, wörtlich wie in options.`)
    block.generated.textType = o.textType
    const parts: GapData["parts"] = []
    let rest = o.letter
    o.gaps.forEach((g, i) => {
      const [before, after] = rest.split(`{${i + 1}}`)
      if (after === undefined) throw new Error(`${id}: marker {${i + 1}} missing`)
      parts.push(before, { n: first + i, options: g.options })
      rest = after
    })
    parts.push(rest)
    block.display.items = [{ type: "gap", data: { parts } }]
    block.key.answers = o.gaps.map((g, i) => ({ n: first + i, correct: g.correct, explanation: g.explanation }))
    return block
  }

  const len = listening
    ? `Länge gesprochen: ${spec.length.min}–${spec.length.max} Sekunden (etwa ${Math.round(spec.length.min * 2.3)}–${Math.round(spec.length.max * 2.3)} Wörter). Sprecher: ${spec.voices!.min}${spec.voices!.max !== spec.voices!.min ? `–${spec.voices!.max}` : ""}. Setze "reading" auf null.`
    : spec.noText
      ? `Kein eigener Text: Setze "reading" und "audio" auf null. Die Optionen sind die Texte, je ${spec.length.min}–${spec.length.max} Wörter.`
      : `Länge: ${spec.length.min}–${spec.length.max} Wörter (ohne sender und source). Setze "audio" auf null.`
  const items =
    spec.answer === "rf+abc"
      ? `Genau 2 Aufgaben in dieser Reihenfolge: 1. "rf" (Aussage in "prompt", "options" leer), 2. "choice" (Frage in "prompt", drei Optionen). "pictos" immer leer.`
      : spec.answer === "pic"
        ? `Genau ${k} Aufgabe${k > 1 ? "n" : ""} vom Typ "choice" (Frage in "prompt", genau ${nOpts} Optionen als kurze Beschriftung, und in "pictos" für jede Option in derselben Reihenfolge ein Piktogramm aus dieser Liste: ${PICTO_KEYS.join(", ")}). Die drei Piktogramme sind verschieden, außer bei Uhrzeiten oder Preisen (dann z. B. dreimal "uhr" mit verschiedenen Uhrzeiten).`
        : spec.answer === "abc"
        ? `Genau ${k} Aufgabe${k > 1 ? "n" : ""} vom Typ "choice" (Frage in "prompt", genau ${nOpts} Optionen, "pictos" leer).`
        : `Genau ${k} Aufgabe${k > 1 ? "n" : ""} vom Typ "rf" ("options" und "pictos" leer), in der Reihenfolge des Textes${k < spec.itemsReal ? ` (in der echten Prüfung ${spec.itemsReal}; hier gekürzt)` : ""}.`
  const o = await ask(ChoiceOutput, `${head}\n${len}\n${items}`)
  block.generated.textType = o.textType
  const sources = listening ? o.audio!.turns.map((t) => t.text) : spec.noText ? o.items.flatMap((it) => it.options) : o.reading!.paragraphs
  o.items.forEach((it, i) => {
    const n = first + i
    const item: KurztestItem =
      it.type === "rf"
        ? { type: "rf", item: { n, statement: it.prompt } }
        : spec.answer === "pic"
          ? { type: "picture", item: { n, prompt: it.prompt, options: it.options.map((label, j) => ({ key: letters[j], label, picto: it.pictos[j] })) } }
          : { type: "choice", item: { n, prompt: it.prompt, options: it.options.map((label, j) => ({ key: letters[j], label })) } }
    block.display.items.push(item)
    const src = sources.find((s) => s.includes(it.evidence))
    block.key.answers.push({ n, correct: it.correct.trim().toLowerCase(), explanation: it.explanation, evidence: { text: src ?? sources.join(" "), hit: it.evidence } } satisfies ItemKey)
  })
  if (listening) {
    const a = o.audio!
    const voiceOf = cast(a.speakers, spec.accents)
    block.key.script = a.turns.map((t) => {
      const voice = voiceOf.get(t.speaker)
      if (!voice) throw new Error(`Uncast speaker "${t.speaker}"`)
      return { speaker: t.speaker, voice, text: t.text, delivery: t.delivery || undefined }
    })
    block.display.clip = {
      duration: 0, plays: spec.plays ?? 1, situation: a.situation, segments: [],
      speakers: Object.fromEntries(a.speakers.map((s, i) => [s.id, { name: s.role, tone: TONES[i % TONES.length] } satisfies Speaker])),
    }
  } else if (!spec.noText) block.display.reading = o.reading!
  return block
}

async function writingBlock(id: string, teil: number): Promise<KurztestBlock> {
  const spec = openParts(EXAM).find((p) => p.skill === "schreiben" && p.teil === teil)!
  const prompt =
    EXAM === "dtz"
      ? `Teil: Schreiben (${spec.minutes} Minuten). Anweisung: "${spec.instruction}"
Schreibe genau 2 Aufgaben, A und B, wie in der echten Prüfung: Die Person wählt eine. Jede Aufgabe:
- title: 2–3 Wörter.
- situation: 2–3 Sätze in Sie-Form, wie im Prüfungsheft (z. B. "Sie haben … Schreiben Sie an …"). Typische Empfänger: Hausverwaltung, Arztpraxis, Kursleitung, Arbeitgeber, Schule, Behörde, Nachbarn.
- points: genau 4 Leitpunkte, kurz und als Frage oder Stichwort.
- register: meistens formell; höchstens eine Aufgabe informell.
- modelAnswer: eine Musterlösung auf B1-Niveau, etwa 80–110 Wörter, mit Anrede, allen vier Punkten und Gruß. Natürliches Deutsch, keine perfekte Muttersprache.
Die beiden Aufgaben haben verschiedene Themen.`
      : `Teil: Schreiben, Teil ${teil} "${spec.title}". Anweisung: "${spec.instruction}"
Schreibe genau 1 Aufgabe wie in der echten Prüfung (keine Wahl):
- title: 2–3 Wörter.
- situation: 1–2 sehr einfache Sätze in Sie-Form (A1), z. B. "Sie können am Samstag nicht zum Kurs kommen. Schreiben Sie Ihrer Lehrerin eine E-Mail." Empfänger: eine Freundin, ein Kollege, eine Lehrerin, ein Büro (z. B. Touristeninformation, Sprachschule).
- points: genau 3 Leitpunkte, kurz, wie im Prüfungsheft (z. B. "Warum schreiben Sie?", "Neuer Termin?", "Bitte um Antwort").
- register: informell (Freundin, Freund, Kollege) oder formell (Büro).
- modelAnswer: eine Musterlösung auf A1, etwa 30–40 Wörter, mit passender Anrede, allen drei Punkten (je 1–2 einfache Sätze) und Gruß. Zeilenumbrüche mit \\n.`
  const o = await ask(WritingOutput, prompt)
  const block = base("schreiben", teil, id, spec.title, spec.instruction)
  block.display.writing = o.tasks.map((t, i) => ({ key: "AB"[i], title: t.title, situation: t.situation, points: t.points }))
  block.key.writing = o.tasks.map((t, i) => ({ key: "AB"[i], register: t.register, modelAnswer: t.modelAnswer }))
  return block
}

const SPEAKING_HINTS: Record<number, string> = {
  1: `Die Prüferin oder der Prüfer begrüßt beide und bittet sie, sich vorzustellen (Name, Herkunft, Wohnort, Familie, Arbeit/Ausbildung, Sprachen, Freizeit). Der Partner oder die Partnerin stellt sich auch vor (2–4 Sätze). Danach je eine Nachfrage der Prüferin an "du". points: die Stichworte zum Vorstellen.`,
  2: `"du" bekommt ein Bild zu einem Alltagsthema (z. B. Einkaufen, Arbeit, Wohnen, Familie, Freizeit) und beschreibt es kurz. Dann erzählt "du" von eigenen Erfahrungen mit dem Thema; die Prüferin stellt Nachfragen. Der Partner hat ein eigenes Bild zum selben Thema und spricht auch kurz darüber. pictureBrief: genaue Beschreibung des Bildes für "du" (für eine Illustration), 2–3 Sätze. points: Leitfragen zum Erzählen.`,
  3: `Beide planen gemeinsam etwas (z. B. ein Fest im Kurs, einen Ausflug, einen Umzug helfen, ein Geschenk). Die Prüferin gibt die Aufgabe. Der Partner macht Vorschläge, stimmt zu, widerspricht höflich, fragt nach. points: genau 4 Planungspunkte (z. B. "Wann?", "Was mitbringen?", "Wer macht was?", "Wie viel kostet es?").`,
}

// research/start-deutsch-1.md §3.4, §5: a group exam at A1, here with one partner. Each card is answered once.
const SD1_SPEAKING_HINTS: Record<number, string> = {
  1: `Die Prüferin begrüßt kurz und bittet "du", sich vorzustellen. points: genau die Stichwörter Name, Alter, Land, Wohnort, Sprachen, Beruf, Hobby. cards: leer.
turns: 1. pruefer: Bitte um Vorstellung. 2. du: Hinweis "Stell dich vor. Die Stichwörter helfen." 3. pruefer: bittet "du", etwas zu buchstabieren (Nachname oder Straße). 4. du: Hinweis "Buchstabier deinen Nachnamen." (oder die Straße) 5. pruefer: fragt nach einer Zahl (Telefonnummer, Hausnummer oder Postleitzahl). 6. du: Hinweis zur Zahl. 7. pruefer: kurzer Dank. Der Partner spricht in diesem Teil nicht.`,
  2: `Thema der Runde, z. B. Essen und Trinken, Einkaufen, Wochenende, Freizeit, Arbeit. cards: genau 1 Karte für "du": label = "Thema: <Thema> · <ein Wort>" (z. B. "Thema: Essen und Trinken · Frühstück"), picto = null. points: das Thema.
turns: 1. pruefer: nennt das Thema und erklärt kurz. 2. partner: stellt "du" eine einfache Frage zum Thema mit dem Wort von seiner Karte (z. B. "Was trinkst du gern?"). 3. du: Hinweis "Antworte auf die Frage." 4. du: Hinweis "Frag deine Partnerin (oder: deinen Partner) mit deiner Karte: <Wort>." – passend zum gender des Partners. 5. partner: antwortet kurz (1–2 Sätze, A1). 6. pruefer: kurzer Dank.`,
  3: `cards: genau 1 Karte für "du" mit einem Gegenstand oder Schild als Bild (picto aus der Liste, label = das Wort, z. B. "Regenschirm"). points: leer.
turns: 1. pruefer: erklärt kurz, dass man um etwas bittet. 2. du: Hinweis "Bitte deine Partnerin (oder: deinen Partner) um etwas. Deine Karte: <Wort>." – passend zum gender des Partners. 3. partner: reagiert kurz auf die Bitte (ja oder höflich nein, 1 Satz). 4. partner: bittet "du" um etwas Anderes (eine einfache Bitte, z. B. "Gibst du mir bitte den Kuli?"). 5. du: Hinweis "Reagiere auf die Bitte." 6. pruefer: beendet die Prüfung freundlich.`,
}

async function speakingBlock(teil: number, id: string, avoid: string[]): Promise<KurztestBlock> {
  const spec = openParts(EXAM).find((p) => p.skill === "sprechen" && p.teil === teil)!
  const sd1 = EXAM === "start-deutsch-1"
  // The real exam keeps one partner through all three Teile: reuse the one already cast.
  const known = existing(`${ID_PREFIX}sprechen-`)[0]
  const partner = known && { name: known.display.speaking!.people.partner.name, voice: known.key.speaking!.voices.partner, pruefer: known.key.speaking!.voices.pruefer }
  const o = await ask(SpeakingOutput, sd1 ? `Teil: Sprechen, Teil ${teil} "${spec.title}". Anweisung: "${spec.instruction}"
Start Deutsch 1 ist eine Gruppenprüfung; hier üben "du" und eine Partnerin oder ein Partner (andere Prüfungsteilnehmende, Niveau A1) mit einer Prüferin oder einem Prüfer.
${SD1_SPEAKING_HINTS[teil]}
title: "${spec.title}". task: die Aufgabe, wie die Prüferin sie stellt, 1–2 sehr einfache Sätze.
Bei "pruefer" und "partner" steht in text ihr echter Text (sehr einfach, A1). Bei "du" steht in text der Hinweis, in sampleAnswer eine gute Beispielantwort auf A1 (1–3 kurze Sätze; beim Buchstabieren die Buchstaben mit Bindestrich, z. B. "K-A-R-I-M"). Bei den anderen ist sampleAnswer leer.
Partner und "du" sagen du zueinander, die Prüferin sagt Sie.
pictureBrief: null.
${partner ? `Der Partner oder die Partnerin heißt ${partner.name} (partner.name = "${partner.name}", partner.gender = "${voices[partner.voice as keyof typeof voices].gender}") und ist dieselbe Person wie in den anderen Teilen. Die Prüferin hat gender "${voices[partner.pruefer as keyof typeof voices].gender}".` : `partner.name: ein Vorname, der zu Prüfungsteilnehmenden in Deutschland passt.`}
${avoid.length ? `Schon vorhanden, wähle ein anderes Thema: ${avoid.join("; ")}` : ""}` : `Teil: Sprechen, Teil ${teil} "${spec.title}" (Paarprüfung, etwa ${spec.minutes} Minuten). Anweisung: "${spec.instruction}"
Der DTZ prüft Sprechen zu zweit: Prüferin oder Prüfer, eine Partnerin oder ein Partner (andere Prüfungsteilnehmende, Niveau B1, mit leichten Fehlern ist okay) und "du".
cards: leer.
${SPEAKING_HINTS[teil]}
title: "${spec.title}". task: die Aufgabe, wie die Prüferin sie stellt, 1–2 Sätze.
turns: 6–10 Beiträge im natürlichen Ablauf. "pruefer" und "partner" sprechen ihren echten Text. Bei "du" steht in text ein kurzer Hinweis in du-Form, was du jetzt sagst (z. B. "Stell dich vor." oder "Reagiere auf Elas Vorschlag."), und in sampleAnswer eine gute Beispielantwort auf B1 (2–4 Sätze). Bei den anderen ist sampleAnswer leer.
Der Partner spricht "du" mit du an, die Prüferin spricht beide mit Sie an.
pictureBrief: ${teil === 2 ? "Pflicht." : "null."}
${partner ? `Der Partner oder die Partnerin heißt ${partner.name} (partner.name = "${partner.name}", partner.gender = "${voices[partner.voice as keyof typeof voices].gender}") und ist dieselbe Person wie in den anderen Teilen. Die Prüferin hat gender "${voices[partner.pruefer as keyof typeof voices].gender}".` : `partner.name: ein Vorname, der zu Prüfungsteilnehmenden in Deutschland passt. Die Prüferin nennt den Partner mit Nachnamen; erfinde einen passenden.`}
${avoid.length ? `Schon vorhanden, wähle ein anderes Thema: ${avoid.join("; ")}` : ""}`)
  const voiceOf = partner ? null : cast([{ id: "pruefer", gender: o.pruefer.gender }, { id: "partner", gender: o.partner.gender }])
  const pv = partner?.pruefer ?? voiceOf!.get("pruefer")!
  const av = partner?.voice ?? voiceOf!.get("partner")!
  const partnerName = partner?.name ?? o.partner.name.split(" ")[0]
  const people: Record<Turn["who"], Person> = {
    pruefer: { name: o.pruefer.gender === "female" ? "Prüferin" : "Prüfer", initial: "P", tone: "var(--v-sk-lesen)" },
    partner: { name: partnerName, initial: partnerName[0], tone: "var(--v-sk-schreiben)" },
    du: { name: "Du", initial: "Du", tone: "var(--p-glow)" },
  }
  const block = base("sprechen", teil, id, o.textType, spec.instruction)
  const cards = o.cards.map((c) => ({ label: c.label, ...(c.picto ? { picto: c.picto } : {}) }))
  block.display.speaking = { data: { part: `Sprechen · Teil ${teil}`, title: o.title, task: o.task, points: o.points, ...(cards.length ? { cards } : {}) }, people, turns: o.turns.map((t) => ({ who: t.who, text: t.text })) }
  block.key.speaking = { voices: { pruefer: pv, partner: av }, sampleAnswers: o.turns.filter((t) => t.who === "du").map((t) => t.sampleAnswer), pictureBrief: o.pictureBrief ?? undefined }
  return block
}

function existing(prefix: string) {
  fs.mkdirSync(DIR, { recursive: true })
  return fs.readdirSync(DIR).filter((f) => f.startsWith(prefix)).map((f) => JSON.parse(fs.readFileSync(path.join(DIR, f), "utf8")) as KurztestBlock)
}

async function generate(skill: PartId, teil: number, count: number) {
  const prefix = `${ID_PREFIX}${skill}-t${teil}-`
  const have = existing(prefix)
  const avoid = have.map((b) => `${b.generated.textType}${b.display.clip ? ` (${b.display.clip.situation})` : b.display.reading ? ` (${b.display.reading.sender})` : b.display.speaking ? ` (${b.display.speaking.data.task})` : ""}`)
  for (let i = 0; i < count; i++) {
    const index = have.length + i
    const id = `${prefix}${String(index + 1).padStart(2, "0")}`
    console.log(`${id}`)
    let block: KurztestBlock
    if (skill === "schreiben") block = await writingBlock(id, teil)
    else if (skill === "sprechen") block = await speakingBlock(teil, id, avoid)
    else {
      const spec = partSpec(skill, teil, EXAM)
      block = await closedBlock(skill, teil, id, index, spec.textTypes[index % spec.textTypes.length], avoid)
    }
    fs.writeFileSync(path.join(DIR, `${id}.json`), JSON.stringify(block, null, 2) + "\n")
    avoid.push(block.generated.textType)
  }
}

async function main() {
  const skill = arg("skill") as PartId
  if (process.argv.includes("--kurztest")) {
    const open = openParts(EXAM).filter((p) => p.skill === skill)
    const plan = skill === "schreiben" || skill === "sprechen" ? open.map((p) => ({ teil: p.teil, blocks: 1 })) : kurztestPlan(EXAM)?.[skill as "lesen" | "hoeren"] ?? []
    for (const p of plan) {
      const missing = p.blocks - existing(`${ID_PREFIX}${skill}-t${p.teil}-`).length
      if (missing > 0) await generate(skill, p.teil, missing)
    }
    return
  }
  await generate(skill, Number(arg("teil") ?? 1), Number(arg("count") ?? 1))
}

main().catch((e) => {
  console.error(e instanceof Error ? e.message : e)
  process.exit(1)
})
