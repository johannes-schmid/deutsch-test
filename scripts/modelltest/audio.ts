// Renders a Hören Modelltest as the real exam sounds (research/dtz-blueprint.md §2.1): every clip with ElevenLabs
// eleven_v4_turbo, tempo corrected to the official speed per Teil, sound design under it, then one continuous track
// with the narrator, "Nummer n", reading and answer pauses. Writes clip/track metadata back into the set file.
//
// Sprechen (--skill sprechen): every scripted examiner and partner line plus the fallbacks for the live turns
// (follow-up bank, Teil 3 partner lines), one file per line, deduplicated by text.
//
// npx tsx --env-file=.env.local scripts/modelltest/audio.ts --set 1 [--skill hoeren|sprechen] [--force]
// Files go to .unit-cache/audio/dtz/<skill>-NN/ (uploaded to Storage by the seeder) and the shared .unit-cache/audio/common/.

import crypto from "node:crypto"
import { execFileSync } from "node:child_process"
import fs from "node:fs"
import path from "node:path"
import voices from "@/data/tts-voices.json"
import { partSpec } from "@/lib/exam/blueprint"
import { itemNumbers } from "@/lib/exam/kurztest"
import type { HoerTrack, MtBlock, MtSet, SoundKey, TrackCue } from "@/lib/modelltest/types"

const MODEL = "eleven_v4_turbo"
const KEY = process.env.ELEVENLABS_API_KEY
if (!KEY) throw new Error("ELEVENLABS_API_KEY missing (run with --env-file=.env.local)")
const arg = (name: string) => {
  const i = process.argv.indexOf(`--${name}`)
  return i > -1 ? process.argv[i + 1] : undefined
}
const SET = Number(arg("set"))
const SKILL = arg("skill") ?? "hoeren"
const FORCE = process.argv.includes("--force")
const NN = String(SET).padStart(2, "0")
if (!["hoeren", "sprechen"].includes(SKILL) || !(SET >= 1 && SET <= 10)) throw new Error("Usage: --set 1..10 [--skill hoeren|sprechen]")
const FILE = `data/modelltest/dtz/${SKILL}-${NN}.json`
const OUT = `.unit-cache/audio/dtz/${SKILL}-${NN}`
const COMMON = ".unit-cache/audio/common"
const NARRATOR = "man_mark"
/** Official speaking rate per Teil, words per minute (measured on the g.a.s.t. audio). Narrator ≈ 125. */
const PACE: Record<number, number> = { 0: 125, 1: 125, 2: 130, 3: 150, 4: 160 }
const SAMPLE = ["-ar", "44100", "-ac", "1"]
let characters = 0

const words = (s: string) => s.replace(/\[[^\]]*\]/g, "").split(/\s+/).filter(Boolean).length
const ff = (...args: string[]) => execFileSync("ffmpeg", ["-hide_banner", "-loglevel", "error", "-y", ...args])
const seconds = (file: string) => Number(execFileSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", file]).toString())
const voiceId = (k: string) => {
  const v = voices[k as keyof typeof voices]
  if (!v) throw new Error(`uncast voice "${k}"`)
  return v.id
}
const NUM = ["null", "eins", "zwei", "drei", "vier", "fünf", "sechs", "sieben", "acht", "neun", "zehn", "elf", "zwölf", "dreizehn", "vierzehn", "fünfzehn", "sechzehn", "siebzehn", "achtzehn", "neunzehn", "zwanzig"]

async function post(url: string, body: unknown) {
  for (let attempt = 1; ; attempt++) {
    const res = await fetch(url, { method: "POST", headers: { "xi-api-key": KEY!, "Content-Type": "application/json" }, body: JSON.stringify(body) })
    if (res.ok) return res
    if (res.status === 429 && attempt < 5) {
      await new Promise((r) => setTimeout(r, 5000 * attempt))
      continue
    }
    throw new Error(`ElevenLabs ${res.status} ${await res.text()}`)
  }
}

/** Speech for one voice, tempo-corrected to `pace`. Returns the file and the speech span after correction. */
async function speak(file: string, voice: string, text: string, pace: number) {
  if (!FORCE && fs.existsSync(file)) return file
  const res = await post(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId(voice)}/with-timestamps?output_format=mp3_44100_128`, { text, model_id: MODEL, language_code: "de" })
  const d = (await res.json()) as { audio_base64: string; alignment: { character_start_times_seconds: number[]; character_end_times_seconds: number[] } }
  characters += text.length
  const raw = `${file}.raw.mp3`
  fs.writeFileSync(raw, Buffer.from(d.audio_base64, "base64"))
  const span = d.alignment.character_end_times_seconds.at(-1)! - d.alignment.character_start_times_seconds[0]
  retime(raw, file, (60 * words(text)) / span, pace)
  return file
}

/** Two or more voices in one natural exchange (text-to-dialogue), then tempo-corrected. */
async function converse(file: string, turns: { voice: string; text: string }[], pace: number) {
  if (!FORCE && fs.existsSync(file)) return file
  const res = await post("https://api.elevenlabs.io/v1/text-to-dialogue/with-timestamps?output_format=mp3_44100_128", {
    model_id: MODEL, language_code: "de", inputs: turns.map((t) => ({ voice_id: voiceId(t.voice), text: t.text })),
  })
  const d = (await res.json()) as { audio_base64: string; voice_segments: { start_time_seconds: number; end_time_seconds: number }[] }
  characters += turns.reduce((n, t) => n + t.text.length, 0)
  const raw = `${file}.raw.mp3`
  fs.writeFileSync(raw, Buffer.from(d.audio_base64, "base64"))
  const span = Math.max(...d.voice_segments.map((s) => s.end_time_seconds)) - Math.min(...d.voice_segments.map((s) => s.start_time_seconds))
  retime(raw, file, (60 * turns.reduce((n, t) => n + words(t.text), 0)) / span, pace)
  return file
}

/** Slows speech down to the target rate (never speeds up, never below ×0.82), trims silence, levels loudness. */
function retime(src: string, dst: string, wpm: number, pace: number) {
  const factor = Math.max(0.82, Math.min(1, pace / wpm))
  ff("-i", src, "-af", `atempo=${factor.toFixed(3)},silenceremove=start_periods=1:start_threshold=-50dB,areverse,silenceremove=start_periods=1:start_threshold=-50dB,areverse,loudnorm=I=-20:TP=-2:LRA=11`, ...SAMPLE, dst)
  fs.rmSync(src)
  console.log(`  ${path.basename(dst)}: ${Math.round(wpm)} → ${Math.round(wpm * factor)} wpm (×${factor.toFixed(2)})`)
}

const silence = (sec: number) => {
  const f = path.join(COMMON, `silence-${sec}.mp3`)
  if (!fs.existsSync(f)) ff("-f", "lavfi", "-i", `anullsrc=r=44100:cl=mono`, "-t", String(sec), f)
  return f
}

/** Shared sound effects. beep, gong and station were approved by Hannes (2026-10-22). */
const SFX: Record<string, { prompt: string; sec: number; loop?: boolean }> = {
  beep: { prompt: "Single answering machine beep, short, clean", sec: 1 },
  gong: { prompt: "Two-tone German train station announcement chime, clean, indoor PA", sec: 2.5 },
  station: { prompt: "Busy German train station platform ambience, distant train, murmuring people, no voices in foreground", sec: 20, loop: true },
  store: { prompt: "Department store ambience, soft background music, distant shoppers murmuring, no clear voices", sec: 20, loop: true },
  storechime: { prompt: "Soft three-note public address chime in a shopping mall", sec: 2 },
  jingle: { prompt: "Short cheerful radio station jingle, 3 seconds, instrumental, no voice", sec: 3 },
  trainchime: { prompt: "Short soft chime before an announcement inside a German regional train", sec: 1.5 },
  traininside: { prompt: "Inside a moving regional train, steady rolling noise, quiet, no voices", sec: 20, loop: true },
  number: { prompt: "Very short soft neutral two-note chime for an exam audio, clean", sec: 1 },
}

async function sfx(key: string) {
  const f = path.join(COMMON, `sfx-${key}.mp3`)
  if (fs.existsSync(f)) return f
  const s = SFX[key]
  const res = await post("https://api.elevenlabs.io/v1/sound-generation?output_format=mp3_44100_128", { text: s.prompt, duration_seconds: s.sec, prompt_influence: 0.6, loop: !!s.loop })
  const raw = `${f}.raw.mp3`
  fs.writeFileSync(raw, Buffer.from(await res.arrayBuffer()))
  ff("-i", raw, "-af", "loudnorm=I=-24:TP=-2", ...SAMPLE, f)
  fs.rmSync(raw)
  return f
}

/** Puts sound design around a voice clip. Ambience stays low and ducks under the voice, so the voice always leads. */
async function design(voice: string, sound: SoundKey | undefined, dst: string) {
  const before: Record<SoundKey, string | null> = { beep: "beep", gong: "gong", station: "gong", store: "storechime", radio: "jingle", train: "trainchime" }
  const bed: Partial<Record<SoundKey, string>> = { station: "station", store: "store", train: "traininside" }
  if (!sound) return fs.copyFileSync(voice, dst)
  const lead = before[sound] ? await sfx(before[sound]!) : null
  const amb = bed[sound] ? await sfx(bed[sound]!) : null
  const inputs = ["-i", voice, ...(lead ? ["-i", lead] : []), ...(amb ? ["-stream_loop", "-1", "-i", amb] : [])]
  const L = lead ? 1 : -1
  const A = amb ? (lead ? 2 : 1) : -1
  const parts: string[] = []
  // Voice: a short breath after the lead sound.
  parts.push(`[0:a]adelay=${lead ? 600 : 0}|${lead ? 600 : 0},apad=pad_dur=0.6[v]`)
  const chain = lead ? `[${L}:a][v]concat=n=2:v=0:a=1[sp]` : `[v]anull[sp]`
  parts.push(chain)
  if (amb) {
    parts.push(`[sp]asplit=2[sp1][sc]`)
    parts.push(`[${A}:a]volume=0.10[bg]`)
    parts.push(`[bg][sc]sidechaincompress=threshold=0.02:ratio=6:attack=20:release=400[duck]`)
    parts.push(`[sp1][duck]amix=inputs=2:duration=first:dropout_transition=0:normalize=0[out]`)
  } else parts.push(`[sp]anull[out]`)
  ff(...inputs, "-filter_complex", parts.join(";"), "-map", "[out]", ...SAMPLE, dst)
}

const narr = async (text: string) => speak(path.join(COMMON, `narrator-${crypto.createHash("sha1").update(text).digest("hex").slice(0, 10)}.mp3`), NARRATOR, text, PACE[0])
const numberLine = (ns: number[]) => `Nummer ${ns.length === 2 ? `${NUM[ns[0]]} und ${NUM[ns[1]]}` : NUM[ns[0]]}.`

async function renderBlock(b: MtBlock) {
  const script = b.key.script!
  const dst = path.join(OUT, `${b.id}.mp3`)
  const voiceFile = path.join(OUT, `${b.id}.voice.mp3`)
  const pace = PACE[b.teil]
  if (b.teil === 4) return null
  const speakers = new Set(script.map((t) => t.speaker))
  if (speakers.size === 1) await speak(voiceFile, script[0].voice, script.map((t) => t.text).join(" "), pace)
  else await converse(voiceFile, script.map((t) => ({ voice: t.voice, text: t.text })), pace)
  if (FORCE || !fs.existsSync(dst)) await design(voiceFile, b.sound, dst)
  const duration = +seconds(dst).toFixed(2)
  b.display.clip = { ...b.display.clip!, src: `dtz/hoeren-${NN}/${b.id}.mp3`, duration, segments: [] }
  return dst
}

/** Sprechen speaking rates (wpm): the examiner calm and clear, the partner a little slower, as a B1 speaker. */
const SPEAK_PACE = { pruefer: 135, partner: 118 }

async function sprechen() {
  const set = JSON.parse(fs.readFileSync(FILE, "utf8")) as MtSet
  fs.mkdirSync(OUT, { recursive: true })
  const line = async (b: MtBlock, who: "pruefer" | "partner", text: string) => {
    const name = `${b.id}-${crypto.createHash("sha1").update(`${who}:${text}`).digest("hex").slice(0, 8)}.mp3`
    const file = await speak(path.join(OUT, name), b.key.speaking!.voices[who], text, SPEAK_PACE[who])
    return { src: `dtz/sprechen-${NN}/${name}`, duration: +seconds(file).toFixed(2) }
  }
  for (const b of set.blocks) {
    for (const t of b.display.speaking!.turns) if (t.who !== "du") Object.assign(t, await line(b, t.who, t.text))
    for (const f of b.key.live?.followups ?? []) Object.assign(f, await line(b, "pruefer", f.text))
    for (const f of b.key.live?.partnerLines ?? []) Object.assign(f, await line(b, "partner", f.text))
  }
  fs.writeFileSync(FILE, JSON.stringify(set, null, 2) + "\n")
  console.log(`→ ${OUT}: ${fs.readdirSync(OUT).length} lines, ${characters} characters rendered (${MODEL})`)
}

async function main() {
  if (SKILL === "sprechen") return sprechen()
  const set = JSON.parse(fs.readFileSync(FILE, "utf8")) as MtSet
  fs.mkdirSync(OUT, { recursive: true })
  fs.mkdirSync(COMMON, { recursive: true })
  const seq: string[] = []
  const cues: TrackCue[] = []
  let t = 0
  const push = (file: string, cue?: Omit<TrackCue, "from" | "to">) => {
    const d = seconds(file)
    if (cue) cues.push({ ...cue, from: +t.toFixed(2), to: +(t + d).toFixed(2) })
    seq.push(file)
    t += d
  }
  const gap = (sec: number, cue?: Omit<TrackCue, "from" | "to">) => push(silence(sec), cue)

  push(await narr(`Deutsch-Test für Zuwanderer. Modelltest ${NUM[SET] ?? SET}. Hören.`))
  gap(2)
  for (const teil of [1, 2, 3, 4]) {
    const spec = partSpec("hoeren", teil, "dtz")
    const full = spec.full!
    const blocks = set.blocks.filter((b) => b.teil === teil)
    const all = blocks.flatMap((b) => itemNumbers(b.display.items))
    const spoken = spec.instruction.replace(/\b([a-z])–([a-z])\b/g, "$1 bis $2")
    push(await narr(`Hören, Teil ${NUM[teil]}. ${spoken}`), { teil, phase: "instruction", items: all })
    gap(3)
    if (teil < 4) {
      for (const b of blocks) {
        const ns = itemNumbers(b.display.items)
        const clip = await renderBlock(b)
        if (!b.example) push(await sfx("number"))
        push(await narr(b.example ? "Beispiel." : numberLine(ns)), { teil, phase: "instruction", items: ns })
        gap(full.pauses!.before, { teil, phase: "reading", items: ns })
        push(clip!, { teil, phase: "clip", items: ns })
        gap(full.pauses!.after, { teil, phase: "answer", items: ns })
      }
    } else {
      const b = blocks[0]
      const script = b.key.script!
      // Official audio: ≈ 72 s from the instruction to the host (60 s reading + jingle), ≈ 3 s host → Beispiel.
      gap(full.readingSeconds! + 10, { teil, phase: "reading", items: all })
      const host = script.find((s) => s.item === undefined)!
      push(await speak(path.join(OUT, `${b.id}-host.mp3`), host.voice, host.text, PACE[0]), { teil, phase: "instruction", items: all })
      gap(3)
      for (const turn of script.filter((s) => s.item !== undefined)) {
        const n = turn.item!
        if (n > 0) push(await sfx("number"))
        push(await narr(n === 0 ? "Beispiel." : numberLine([n])), { teil, phase: "instruction", items: [n] })
        gap(full.pauses!.before)
        push(await speak(path.join(OUT, `${b.id}-${n}.mp3`), turn.voice, turn.text, PACE[4]), { teil, phase: "clip", items: [n] })
        gap(full.pauses!.after, { teil, phase: "answer", items: [n] })
      }
      // One review/replay file for Teil 4 (host + statements); the exam itself plays the track.
      const parts = [path.join(OUT, `${b.id}-host.mp3`), ...script.filter((s) => s.item !== undefined).map((s) => path.join(OUT, `${b.id}-${s.item}.mp3`))]
      const list4 = path.join(OUT, `${b.id}.txt`)
      fs.writeFileSync(list4, parts.flatMap((f, i) => [`file '${path.resolve(f)}'`, ...(i < parts.length - 1 ? [`file '${path.resolve(silence(1.5))}'`] : [])]).join("\n"))
      const joined = path.join(OUT, `${b.id}.mp3`)
      ff("-f", "concat", "-safe", "0", "-i", list4, ...SAMPLE, joined)
      b.display.clip = { ...b.display.clip!, src: `dtz/hoeren-${NN}/${b.id}.mp3`, duration: +seconds(joined).toFixed(2), segments: [] }
    }
    push(await sfx("number"))
    push(await narr(teil < 4 ? `Ende von Teil ${NUM[teil]}.` : "Ende des Prüfungsteils Hören."))
    gap(6)
  }

  const list = path.join(OUT, "track.txt")
  fs.writeFileSync(list, seq.map((f) => `file '${path.resolve(f)}'`).join("\n"))
  const track = path.join(OUT, "track.mp3")
  ff("-f", "concat", "-safe", "0", "-i", list, "-ac", "1", "-ar", "44100", "-b:a", "64k", track)
  set.track = { src: `dtz/hoeren-${NN}/track.mp3`, duration: +seconds(track).toFixed(2), cues } satisfies HoerTrack
  fs.writeFileSync(FILE, JSON.stringify(set, null, 2) + "\n")
  console.log(`→ ${track}: ${(set.track.duration / 60).toFixed(1)} min, ${cues.length} cues, ${characters} characters rendered (${MODEL})`)
}

main().catch((e) => {
  console.error(e instanceof Error ? e.message : e)
  process.exit(1)
})
