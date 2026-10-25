// Shared drafting pieces for the content generators (free tests and Modelltests): system prompts, output schemas,
// the Claude call and voice casting. Claude is called directly with the Anthropic API key, never via a gateway.

import Anthropic from "@anthropic-ai/sdk"
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod"
import { z } from "zod"
import voices from "@/data/tts-voices.json"
import { EXAM_CONTEXT } from "@/lib/exam/exam-blueprints"
import { PICTO_KEYS } from "@/lib/exam/pictos"
import type { ExamId } from "@/lib/exams"

export const MODEL = process.env.DRAFT_MODEL ?? "claude-opus-5-5"
/** medium beat high in the 2026-10-23 blind eval (LEARNINGS.md), at ~12% less cost. */
const EFFORT = (process.env.DRAFT_EFFORT ?? "medium") as "low" | "medium" | "high" | "xhigh" | "max"
/** $ per million tokens (input, output), for the cost line. */
const PRICE: Record<string, [number, number]> = { "claude-opus-5-5": [4, 20], "claude-sonnet-5-5": [2, 10], "claude-haiku-5-5": [0.1, 0.5], "claude-fable-5-1": [10, 50] }
export const TONES = ["var(--v-sk-lesen)", "var(--v-sk-schreiben)", "var(--v-sk-sprechen)"]
export const letters = "abcdefgh"
const client = new Anthropic()

export const DTZ_SYSTEM = `Du schreibst Prüfungsaufgaben für den Deutsch-Test für Zuwanderer (DTZ, Niveau A2–B1).
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

export function examSystem(exam: Exclude<ExamId, "dtz">) {
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

export const ChoiceOutput = z.object({
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

export const AdsOutput = z.object({
  textType: z.string(),
  ads: z.array(z.object({ title: z.string(), text: z.string() })),
  situations: z.array(z.object({ text: z.string(), correct: z.string(), explanation: z.string(), evidence: z.string() })),
})

export const OpinionsOutput = z.object({
  textType: z.string(),
  situation: z.string(),
  speakers: z.array(z.object({ id: z.string(), name: z.string(), gender: z.enum(["male", "female"]), delivery: z.string() })),
  opinions: z.array(z.object({ speaker: z.string(), text: z.string() })),
  statements: z.array(z.string()),
  answers: z.array(z.object({ speaker: z.string(), correct: z.string(), explanation: z.string(), evidence: z.string() })),
})

export const GapOutput = z.object({
  textType: z.string(),
  letter: z.string(),
  gaps: z.array(z.object({ options: z.array(z.string()), correct: z.string(), explanation: z.string() })),
})

export const WritingOutput = z.object({
  tasks: z.array(z.object({ title: z.string(), situation: z.string(), points: z.array(z.string()), register: z.enum(["formell", "informell"]), modelAnswer: z.string() })),
})

export const SpeakingOutput = z.object({
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

type Usage = { input_tokens: number; output_tokens: number }
type Done = { stop_reason: string | null; text: string; usage: Usage; refusal?: string }

/** DRAFT_BATCH=1: requests go through the Message Batches API at 50% of the price; slower (minutes per round trip). */
const BATCH = process.env.DRAFT_BATCH === "1"
const queue: { id: string; params: Anthropic.MessageCreateParamsNonStreaming; resolve: (d: Done) => void; reject: (e: unknown) => void }[] = []
let flushTimer: NodeJS.Timeout | undefined
let seq = 0

/** Sends everything queued within 3 s as one batch, then polls until it ends. */
async function flush() {
  const jobs = queue.splice(0)
  try {
    const batch = await client.messages.batches.create({ requests: jobs.map((j) => ({ custom_id: j.id, params: j.params })) })
    console.log(`    batch ${batch.id}: ${jobs.length} request(s)`)
    let status = batch.processing_status
    while (status !== "ended") {
      await new Promise((r) => setTimeout(r, 30_000))
      status = (await client.messages.batches.retrieve(batch.id)).processing_status
    }
    const byId = new Map(jobs.map((j) => [j.id, j]))
    for await (const r of await client.messages.batches.results(batch.id)) {
      const job = byId.get(r.custom_id)
      if (!job) continue
      byId.delete(r.custom_id)
      if (r.result.type !== "succeeded") { job.reject(new Error(`Batch request ${r.result.type}${r.result.type === "errored" ? `: ${r.result.error.error.message}` : ""}`)); continue }
      const m = r.result.message
      job.resolve({ stop_reason: m.stop_reason, usage: m.usage, text: m.content.flatMap((c) => (c.type === "text" ? [c.text] : [])).join(""), refusal: m.stop_details?.explanation ?? undefined })
    }
    for (const job of byId.values()) job.reject(new Error("Batch request missing from results"))
  } catch (e) {
    for (const job of jobs) job.reject(e)
  }
}

function viaBatch(params: Anthropic.MessageCreateParamsNonStreaming): Promise<Done> {
  return new Promise((resolve, reject) => {
    queue.push({ id: `r${process.pid}-${++seq}`, params, resolve, reject })
    clearTimeout(flushTimer)
    flushTimer = setTimeout(flush, 3000)
  })
}

async function viaStream(params: Anthropic.MessageCreateParamsNonStreaming): Promise<Done> {
  const m = await client.messages.stream(params).finalMessage()
  return { stop_reason: m.stop_reason, usage: m.usage, text: m.content.flatMap((c) => (c.type === "text" ? [c.text] : [])).join(""), refusal: m.stop_details?.explanation ?? undefined }
}

/** `image`: an optional picture the model looks at before answering (base64, e.g. a Sprechen photo). */
export const makeAsk = (system: string, model = MODEL) => async function ask<T extends z.ZodType>(schema: T, prompt: string, image?: { data: string; mediaType: "image/webp" | "image/jpeg" | "image/png" }): Promise<z.infer<T>> {
  const format = zodOutputFormat(schema)
  const params: Anthropic.MessageCreateParamsNonStreaming = {
    model,
    max_tokens: 32000,
    output_config: { effort: EFFORT, format: { type: format.type, schema: format.schema } },
    system,
    messages: [{ role: "user", content: image ? [{ type: "image", source: { type: "base64", media_type: image.mediaType, data: image.data } }, { type: "text", text: prompt }] : prompt }],
  }
  const res = await (BATCH ? viaBatch(params) : viaStream(params))
  if (res.stop_reason === "refusal") throw new Error(`Refused: ${res.refusal ?? ""}`)
  if (res.stop_reason === "max_tokens" || !res.text) throw new Error(`Unparseable output (stop_reason ${res.stop_reason})`)
  const [pin, pout] = PRICE[model] ?? [4, 20]
  const cost = ((res.usage.input_tokens * pin + res.usage.output_tokens * pout) / 1e6) * (BATCH ? 0.5 : 1)
  console.log(`    in=${res.usage.input_tokens} out=${res.usage.output_tokens} ~$${cost.toFixed(3)}${BATCH ? " (batch)" : ""}`)
  return format.parse(res.text) as z.infer<T>
}

/** Free-text output (e.g. a whole Modelltest file as JSON); the system prompt is cached across the requests that share it. */
export async function askText(system: string, prompt: string, maxTokens = 64000, model = MODEL) {
  const params: Anthropic.MessageCreateParamsNonStreaming = {
    model,
    max_tokens: maxTokens,
    output_config: { effort: EFFORT },
    system: [{ type: "text", text: system, cache_control: { type: "ephemeral" } }],
    messages: [{ role: "user", content: prompt }],
  }
  const res = await (BATCH ? viaBatch(params) : viaStream(params))
  if (res.stop_reason === "refusal") throw new Error(`Refused: ${res.refusal ?? ""}`)
  if (res.stop_reason === "max_tokens" || !res.text) throw new Error(`No usable output (stop_reason ${res.stop_reason})`)
  const [pin, pout] = PRICE[model] ?? [4, 20]
  const cost = ((res.usage.input_tokens * pin + res.usage.output_tokens * pout) / 1e6) * (BATCH ? 0.5 : 1)
  console.log(`    in=${res.usage.input_tokens} out=${res.usage.output_tokens} ~$${cost.toFixed(3)}${BATCH ? " (batch)" : ""}`)
  return res.text
}

/** Picks a free voice per speaker. `pool` restricts the choice to approved voice keys (e.g. per DTZ Teil). */
export function cast(speakers: { id: string; gender: "male" | "female" }[], accents: string[] = ["de"], pool?: string[]) {
  const used = new Set<string>()
  const map = new Map<string, string>()
  for (const [i, s] of speakers.entries()) {
    const accent = accents[i] ?? "de"
    // Random among the fitting voices, so single-speaker clips don't all get the first voice in the file.
    const fits = Object.entries(voices).filter(([k, v]) => v.gender === s.gender && v.accent === accent && !used.has(k) && (!pool || pool.includes(k)))
    const pick = fits[Math.floor(Math.random() * fits.length)]
    if (!pick) throw new Error(`No free ${s.gender} ${accent} voice for speaker ${s.id}`)
    used.add(pick[0])
    map.set(s.id, pick[0])
  }
  return map
}

