// Shared drafting pieces for the content generators (free tests and Modelltests): system prompts, output schemas,
// the Claude call and voice casting. Claude is called directly with the Anthropic API key, never via a gateway.

import Anthropic from "@anthropic-ai/sdk"
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod"
import { z } from "zod"
import voices from "@/data/tts-voices.json"
import { EXAM_CONTEXT } from "@/lib/exam/exam-blueprints"
import { PICTO_KEYS } from "@/lib/exam/pictos"
import type { ExamId } from "@/lib/exams"

export const MODEL = "claude-opus-5-5"
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

/** `image`: an optional picture the model looks at before answering (base64, e.g. a Sprechen photo). */
export const makeAsk = (system: string) => async function ask<T extends z.ZodType>(schema: T, prompt: string, image?: { data: string; mediaType: "image/webp" | "image/jpeg" | "image/png" }): Promise<z.infer<T>> {
  const res = await client.messages.parse({
    model: MODEL,
    max_tokens: 16000,
    output_config: { effort: "high", format: zodOutputFormat(schema) },
    system,
    messages: [{ role: "user", content: image ? [{ type: "image", source: { type: "base64", media_type: image.mediaType, data: image.data } }, { type: "text", text: prompt }] : prompt }],
  })
  if (res.stop_reason === "refusal") throw new Error(`Refused: ${res.stop_details?.explanation ?? ""}`)
  if (!res.parsed_output) throw new Error(`Unparseable output (stop_reason ${res.stop_reason})`)
  const cost = (res.usage.input_tokens * 4 + res.usage.output_tokens * 20) / 1e6
  console.log(`    in=${res.usage.input_tokens} out=${res.usage.output_tokens} ~$${cost.toFixed(3)}`)
  return res.parsed_output
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

