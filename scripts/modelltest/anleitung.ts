// Renders the spoken "Anleitung" of each DTZ Modelltest part (lib/modelltest/anleitung.ts) with the narrator voice,
// eleven_v4_turbo, slowed to the narrator pace of the official audio (≈ 125 words/min), loudness levelled.
//
// npx tsx --env-file=.env.local scripts/modelltest/anleitung.ts [--skill hoeren] [--force]
// Files go to public/audio/modelltest/dtz-anleitung-<skill>.mp3.

import { execFileSync } from "node:child_process"
import fs from "node:fs"
import voices from "@/data/tts-voices.json"
import { DTZ_ANLEITUNG } from "@/lib/modelltest/anleitung"

const MODEL = "eleven_v4_turbo"
const NARRATOR = "man_mark"
const PACE = 125
const KEY = process.env.ELEVENLABS_API_KEY
if (!KEY) throw new Error("ELEVENLABS_API_KEY missing (run with --env-file=.env.local)")
const i = process.argv.indexOf("--skill")
const only = i > -1 ? process.argv[i + 1] : undefined
const FORCE = process.argv.includes("--force")

const ff = (...args: string[]) => execFileSync("ffmpeg", ["-hide_banner", "-loglevel", "error", "-y", ...args])
const words = (s: string) => s.split(/\s+/).filter(Boolean).length

async function main() {
  let characters = 0
  for (const [skill, a] of Object.entries(DTZ_ANLEITUNG)) {
    if (only && skill !== only) continue
    const file = `public${a.audio}`
    if (!FORCE && fs.existsSync(file)) continue
    fs.mkdirSync("public/audio/modelltest", { recursive: true })
    const text = [`${a.title}.`, a.lead, `${a.teileTitle}.`, ...a.teile.map((x) => `${x.label ? `${x.label}: ` : ""}${x.name}. ${x.what}`), "So geht es.", ...a.steps].join("\n\n").replace(/[„“]/g, "").replace(/a\/b\/c/g, "a, b, c").replace(/Richtig\/Falsch/g, "Richtig-oder-Falsch")
    const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voices[NARRATOR].id}/with-timestamps?output_format=mp3_44100_128`, {
      method: "POST",
      headers: { "xi-api-key": KEY!, "Content-Type": "application/json" },
      body: JSON.stringify({ text, model_id: MODEL, language_code: "de" }),
    })
    if (!res.ok) throw new Error(`ElevenLabs ${res.status} ${await res.text()}`)
    const d = (await res.json()) as { audio_base64: string; alignment: { character_start_times_seconds: number[]; character_end_times_seconds: number[] } }
    characters += text.length
    const raw = `${file}.raw.mp3`
    fs.writeFileSync(raw, Buffer.from(d.audio_base64, "base64"))
    const span = d.alignment.character_end_times_seconds.at(-1)! - d.alignment.character_start_times_seconds[0]
    const wpm = (60 * words(text)) / span
    const factor = Math.max(0.82, Math.min(1, PACE / wpm))
    ff("-i", raw, "-af", `atempo=${factor.toFixed(3)},silenceremove=start_periods=1:start_threshold=-50dB,areverse,silenceremove=start_periods=1:start_threshold=-50dB,areverse,loudnorm=I=-20:TP=-2:LRA=11`, "-ar", "44100", "-ac", "1", "-b:a", "64k", file)
    fs.rmSync(raw)
    console.log(`${file}: ${Math.round(wpm)} → ${Math.round(wpm * factor)} wpm`)
  }
  console.log(`${characters} characters rendered (${MODEL})`)
}

void main()
