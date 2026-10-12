// Renders audio for drafts with ElevenLabs Text to Dialogue.
// Hören: one request per clip, so turns flow naturally; speaker segments are written back.
// Sprechen: one clip per examiner/partner turn, because the candidate answers in between.
// npx tsx scripts/tts-kurztest.ts data/kurztest/drafts/hoeren-t1-01.json [--model eleven_v4] [--force]
// npx tsx scripts/tts-kurztest.ts --all   (every draft that still needs audio)

import fs from "node:fs"
import path from "node:path"
import voices from "@/data/tts-voices.json"
import type { KurztestBlock } from "@/lib/exam/kurztest"

const DIR = "data/kurztest/drafts"
const OUT_DIR = "public/audio/kurztest"
const flag = (name: string) => process.argv.includes(`--${name}`)
const opt = (name: string) => {
  const i = process.argv.indexOf(`--${name}`)
  return i > -1 ? process.argv[i + 1] : undefined
}
const MODEL = opt("model") ?? "eleven_v4"
const files = flag("all")
  ? fs.readdirSync(DIR).filter((f) => f.endsWith(".json")).map((f) => path.join(DIR, f))
  : process.argv.slice(2).filter((a, i, all) => a.endsWith(".json") && all[i - 1] !== "--model")

type DialogueResponse = {
  audio_base64: string
  voice_segments: { voice_id: string; start_time_seconds: number; end_time_seconds: number; dialogue_input_index: number }[]
}

function voiceId(key: string, id: string) {
  const voice = voices[key as keyof typeof voices]
  if (!voice) throw new Error(`${id}: uncast voice "${key}"`)
  return voice.id
}

async function dialogue(inputs: { text: string; voice_id: string }[], out: string) {
  const res = await fetch("https://api.elevenlabs.io/v1/text-to-dialogue/with-timestamps?output_format=mp3_44100_128", {
    method: "POST",
    headers: { "xi-api-key": process.env.ELEVENLABS_API_KEY ?? "", "Content-Type": "application/json" },
    body: JSON.stringify({ model_id: MODEL, language_code: "de", inputs }),
  })
  if (!res.ok) throw new Error(`${out}: ElevenLabs ${res.status} ${await res.text()}`)
  const data = (await res.json()) as DialogueResponse
  fs.mkdirSync(OUT_DIR, { recursive: true })
  fs.writeFileSync(path.join(OUT_DIR, out), Buffer.from(data.audio_base64, "base64"))
  return data.voice_segments
}

async function renderClip(block: KurztestBlock) {
  const script = block.key.script!
  const clip = block.display.clip!
  const inputs = script.map((t) => ({ text: t.delivery ? `${t.delivery} ${t.text}` : t.text, voice_id: voiceId(t.voice, block.id) }))
  const segs = await dialogue(inputs, `${block.id}.mp3`)
  const segments = segs.map((s) => ({ speaker: script[s.dialogue_input_index].speaker, from: +s.start_time_seconds.toFixed(2), to: +s.end_time_seconds.toFixed(2) }))
  block.display.clip = { ...clip, src: `/audio/kurztest/${block.id}.mp3`, duration: Math.max(...segments.map((s) => s.to)), segments }
  return inputs.reduce((n, i) => n + i.text.length, 0)
}

async function renderSpeaking(block: KurztestBlock) {
  const sp = block.display.speaking!
  const cast = block.key.speaking!.voices
  let characters = 0
  for (const [i, turn] of sp.turns.entries()) {
    if (turn.who === "du" || (turn.src && !flag("force"))) continue
    const segs = await dialogue([{ text: turn.text, voice_id: voiceId(cast[turn.who], block.id) }], `${block.id}-${i}.mp3`)
    turn.src = `/audio/kurztest/${block.id}-${i}.mp3`
    turn.duration = +Math.max(...segs.map((s) => s.end_time_seconds)).toFixed(2)
    characters += turn.text.length
  }
  return characters
}

async function render(file: string) {
  const block = JSON.parse(fs.readFileSync(file, "utf8")) as KurztestBlock
  const speaking = block.display.speaking
  const needs = block.display.clip ? !block.display.clip.src : speaking ? speaking.turns.some((t) => t.who !== "du" && !t.src) : false
  if (!block.display.clip && !speaking) return 0
  if (!needs && !flag("force")) {
    if (!flag("all")) console.log(`${block.id}: already rendered (use --force)`)
    return 0
  }
  const characters = block.display.clip ? await renderClip(block) : await renderSpeaking(block)
  block.key.tts = { model: MODEL, characters, at: new Date().toISOString() }
  fs.writeFileSync(file, JSON.stringify(block, null, 2) + "\n")
  console.log(`${block.id}: ${block.display.clip ? `${block.display.clip.duration.toFixed(1)} s, ` : ""}${characters} characters (${MODEL})`)
  return characters
}

async function main() {
  if (!files.length) throw new Error("Pass draft .json files or --all")
  let total = 0
  for (const f of files) total += await render(f)
  console.log(`Total: ${total} characters ≈ ${total} credits`)
}

main().catch((e) => {
  console.error(e instanceof Error ? e.message : e)
  process.exit(1)
})
