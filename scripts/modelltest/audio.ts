// Renders a Hören Modelltest as the real exam sounds (research/dtz-blueprint.md §2.1): every clip with ElevenLabs
// eleven_v4_turbo, tempo corrected to the official speed per Teil, sound design under it, then one continuous track
// with the narrator, "Nummer n", reading and answer pauses. Writes clip/track metadata back into the set file.
//
// Sprechen (--skill sprechen): every scripted examiner and partner line plus the fallbacks for the live turns
// (follow-up bank, Teil 3 partner lines), one file per line, deduplicated by text.
//
// telc Deutsch B1 (--exam telc-b1): the track follows the official Übungstest audio (research/telc-b1.md §3c, measured
// 2026-10-23): Teil 1 read 30 s, five statements once with ~16 s after each; Teil 2 read 60 s, the interview twice with
// 60 s after each play; Teil 3 five texts, each twice with ~5 s between.
//
// npx tsx --env-file=.env.local scripts/modelltest/audio.ts --set 1 [--skill hoeren|sprechen] [--exam dtz|telc-b1] [--force]
// Files go to .unit-cache/audio/<exam>/<skill>-NN/ (uploaded to Storage by the seeder) and the shared .unit-cache/audio/common/.

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
const EXAM = arg("exam") ?? "dtz"
const SKILL = arg("skill") ?? "hoeren"
const FORCE = process.argv.includes("--force")
const NN = String(SET).padStart(2, "0")
const EXAMS = ["dtz", "telc-b1", "start-deutsch-1", "telc-a2", "goethe-a2", "goethe-b1", "oesd-b1", "oesd-a1", "oesd-a2"]
if (!["hoeren", "sprechen"].includes(SKILL) || !(SET >= 1 && SET <= 10) || !EXAMS.includes(EXAM)) throw new Error(`Usage: --set 1..10 [--skill hoeren|sprechen] [--exam ${EXAMS.join("|")}]`)
const FILE = `data/modelltest/${EXAM}/${SKILL}-${NN}.json`
const OUT = `.unit-cache/audio/${EXAM}/${SKILL}-${NN}`
const SRC = `${EXAM}/${SKILL}-${NN}`
const COMMON = ".unit-cache/audio/common"
/** ÖSD gets an Austrian narrator (Hannes, 2026-10-24: Austrian voices for ÖSD). */
const NARRATOR = EXAM.startsWith("oesd-") ? "woman_seda_at" : "man_mark"
/** Official speaking rate per Teil, words per minute (measured on the g.a.s.t. audio). Narrator ≈ 125. */
const PACE: Record<number, number> = { 0: 125, 1: 125, 2: 130, 3: 150, 4: 160 }
const SAMPLE = ["-ar", "44100", "-ac", "1"]
// Concat joins re-frame the decoded audio: a plain copy into libmp3lame can fail with "inadequate AVFrame plane padding".
const JOIN = ["-af", "aresample=44100", ...SAMPLE]
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

/** Two or more voices in one natural exchange (text-to-dialogue), then tempo-corrected. Long discussions (Goethe B1
 * Hören Teil 4, ~800 words) go out in chunks of whole turns and are joined with a natural gap. */
async function converse(file: string, turns: { voice: string; text: string }[], pace: number) {
  if (!FORCE && fs.existsSync(file)) return file
  const chunks: (typeof turns)[] = [[]]
  for (const t of turns) {
    if (chunks.at(-1)!.length && chunks.at(-1)!.reduce((n, x) => n + x.text.length, 0) + t.text.length > 2400) chunks.push([])
    chunks.at(-1)!.push(t)
  }
  const raws: string[] = []
  let span = 0
  for (const [i, chunk] of chunks.entries()) {
    const res = await post("https://api.elevenlabs.io/v1/text-to-dialogue/with-timestamps?output_format=mp3_44100_128", {
      model_id: MODEL, language_code: "de", inputs: chunk.map((t) => ({ voice_id: voiceId(t.voice), text: t.text })),
    })
    const d = (await res.json()) as { audio_base64: string; voice_segments: { start_time_seconds: number; end_time_seconds: number }[] }
    characters += chunk.reduce((n, t) => n + t.text.length, 0)
    const raw = `${file}.raw${i}.mp3`
    fs.writeFileSync(raw, Buffer.from(d.audio_base64, "base64"))
    raws.push(raw)
    span += Math.max(...d.voice_segments.map((s) => s.end_time_seconds)) - Math.min(...d.voice_segments.map((s) => s.start_time_seconds))
  }
  const raw = `${file}.raw.mp3`
  if (raws.length === 1) fs.renameSync(raws[0], raw)
  else {
    const list = `${file}.raw.txt`
    fs.writeFileSync(list, raws.flatMap((f, i) => [`file '${path.resolve(f)}'`, ...(i < raws.length - 1 ? [`file '${path.resolve(silence(0.6))}'`] : [])]).join("\n"))
    ff("-f", "concat", "-safe", "0", "-i", list, ...JOIN, raw)
    for (const f of [...raws, list]) fs.rmSync(f)
  }
  retime(raw, file, (60 * turns.reduce((n, t) => n + words(t.text), 0)) / span, pace)
  return file
}

/** telc speaks faster than the voices do by default (~185 words/min measured), so telc may speed up (pitch kept). */
const MAX_SPEEDUP: number = { "telc-b1": 1.35, "telc-a2": 1.25, "start-deutsch-1": 1.15, "goethe-a2": 1.2, "goethe-b1": 1.2, "oesd-b1": 1.2, "oesd-a1": 1.2, "oesd-a2": 1.3 }[EXAM] ?? 1

/** Brings speech to the target rate (DTZ: only slows down; telc: up to ×1.35 faster), trims silence, levels loudness. */
function retime(src: string, dst: string, wpm: number, pace: number) {
  const factor = Math.max(0.82, Math.min(MAX_SPEEDUP, pace / wpm))
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
  ring: { prompt: "German landline telephone ringing twice, then picked up, clean, no voice", sec: 3.5 },
  pool: { prompt: "Indoor swimming pool hall ambience, distant splashing and echo, no clear voices", sec: 20, loop: true },
  boatchime: { prompt: "Short ship public address chime on a lake passenger boat", sec: 2 },
  boat: { prompt: "On the deck of a lake passenger boat, low engine hum, water, wind, no voices", sec: 20, loop: true },
  music: { prompt: "Short calm instrumental radio talk show theme, 4 seconds, no voice", sec: 4 },
  // ÖSD (research/oesd-a1.md §9.2): a xylophone gong between steps, short cues before the A1 dialogues, street noise.
  xylo: { prompt: "Soft xylophone signal, three ascending notes, exam audio separator, clean, gentle decay", sec: 4 },
  market: { prompt: "Short outdoor farmers market ambience, murmuring people, a paper bag rustling, no clear words", sec: 3 },
  lobby: { prompt: "Short cinema lobby ambience, popcorn machine, distant murmur, no clear words", sec: 3 },
  roller: { prompt: "Paint roller rolling on a wall, close, a few strokes, indoor empty room", sec: 3 },
  river: { prompt: "River flowing under a bridge, a few birds, light wind, outdoors", sec: 3 },
  street: { prompt: "Quiet pedestrian street ambience in a small Austrian town, distant footsteps, no clear voices", sec: 20, loop: true },
  playback: { prompt: "Mobile phone voicemail playback starting: a short click and a soft electronic tone", sec: 1.5 },
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
  const before: Record<SoundKey, string | null> = { beep: "beep", gong: "gong", station: "gong", store: "storechime", radio: "jingle", train: "trainchime", phone: "ring", pool: "storechime", boat: "boatchime", market: "market", lobby: "lobby", roller: "roller", river: "river", street: null, playback: "playback" }
  const bed: Partial<Record<SoundKey, string>> = { station: "station", store: "store", train: "traininside", pool: "pool", boat: "boat", street: "street" }
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

// Mark's files keep their old names; other narrators get the voice in the hash so a cached line never switches voice.
const narr = async (text: string) => speak(path.join(COMMON, `narrator-${crypto.createHash("sha1").update(NARRATOR === "man_mark" ? text : `${NARRATOR}:${text}`).digest("hex").slice(0, 10)}.mp3`), NARRATOR, text, PACE[0])
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
  b.display.clip = { ...b.display.clip!, src: `${SRC}/${b.id}.mp3`, duration, segments: [] }
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
    return { src: `${SRC}/${name}`, duration: +seconds(file).toFixed(2) }
  }
  for (const b of set.blocks) {
    for (const t of b.display.speaking!.turns) if (t.who !== "du") Object.assign(t, await line(b, t.who, t.text))
    // ÖSD: the Interlokutorin (partner) asks the follow-ups; elsewhere the examiner does.
    for (const f of b.key.live?.followups ?? []) Object.assign(f, await line(b, EXAM === "oesd-a1" || EXAM === "oesd-a2" ? "partner" : "pruefer", f.text))
    for (const f of b.key.live?.partnerLines ?? []) Object.assign(f, await line(b, "partner", f.text))
  }
  fs.writeFileSync(FILE, JSON.stringify(set, null, 2) + "\n")
  console.log(`→ ${OUT}: ${fs.readdirSync(OUT).length} lines, ${characters} characters rendered (${MODEL})`)
}

/** German number words up to 99, as the narrator says item numbers ("einundvierzig"). */
function spell(n: number): string {
  if (n <= 20) return NUM[n]
  const tens = ["", "", "zwanzig", "dreißig", "vierzig", "fünfzig", "sechzig", "siebzig", "achtzig", "neunzig"][Math.floor(n / 10)]
  return n % 10 ? `${n % 10 === 1 ? "ein" : NUM[n % 10]}und${tens}` : tens
}
const spoken = (t: string) => t.replace(/(\d+)–(\d+)/g, (_, a, b) => `${spell(+a)} bis ${spell(+b)}`).replace(/\b([a-z])–([a-z])\b/g, "$1 bis $2")

/** Official speaking rate per Teil, measured on the telc Übungstest 1 MP3 (2026-10-23): ≈ 180–190 words/min. */
const TELC_PACE: Record<number, number> = { 1: 180, 2: 185, 3: 180 }

async function telcTrack(set: MtSet) {
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

  push(await narr(`telc Deutsch B1. Modelltest ${NUM[SET] ?? SET}. Hörverstehen.`))
  gap(2)
  for (const teil of [1, 2, 3]) {
    const full = partSpec("hoeren", teil, "telc-b1").full!
    const blocks = set.blocks.filter((b) => b.teil === teil)
    const all = blocks.flatMap((b) => itemNumbers(b.display.items))
    push(await narr(`Hörverstehen, Teil ${NUM[teil]}. ${spoken(blocks[0].display.instruction)}`), { teil, phase: "instruction", items: all })
    // Every official Teil also names the answer sheet (+ / –). Teil 3 has no shared reading time, only per text.
    push(await narr("Markieren Sie Ihre Lösungen auf dem Antwortbogen: Plus für richtig, Minus für falsch."), { teil, phase: "instruction", items: all })
    if (full.readingSeconds && teil < 3) gap(full.readingSeconds, { teil, phase: "reading", items: all })
    else gap(1.5)
    if (teil === 1) {
      const b = blocks[0]
      const host = b.key.script!.find((s) => s.item === undefined)!
      push(await speak(path.join(OUT, `${b.id}-host.mp3`), host.voice, host.text, TELC_PACE[1]), { teil, phase: "instruction", items: all })
      gap(1.5)
      const parts = [path.join(OUT, `${b.id}-host.mp3`)]
      for (const turn of b.key.script!.filter((s) => s.item !== undefined)) {
        const n = turn.item!
        push(await narr(`Nummer ${spell(n)}.`), { teil, phase: "instruction", items: [n] })
        gap(full.pauses!.before)
        const file = await speak(path.join(OUT, `${b.id}-${n}.mp3`), turn.voice, turn.text, TELC_PACE[1])
        parts.push(file)
        push(file, { teil, phase: "clip", items: [n] })
        gap(full.pauses!.after, { teil, phase: "answer", items: [n] })
      }
      // One review file (host + statements); the exam itself plays the track.
      const list = path.join(OUT, `${b.id}.txt`)
      fs.writeFileSync(list, parts.flatMap((f, i) => [`file '${path.resolve(f)}'`, ...(i < parts.length - 1 ? [`file '${path.resolve(silence(1.5))}'`] : [])]).join("\n"))
      const joined = path.join(OUT, `${b.id}.mp3`)
      ff("-f", "concat", "-safe", "0", "-i", list, ...JOIN, joined)
      b.display.clip = { ...b.display.clip!, src: `${SRC}/${b.id}.mp3`, duration: +seconds(joined).toFixed(2), segments: [] }
    } else {
      for (const b of blocks) {
        const ns = itemNumbers(b.display.items)
        const script = b.key.script!
        const voiceFile = path.join(OUT, `${b.id}.voice.mp3`)
        if (new Set(script.map((s) => s.speaker)).size === 1) await speak(voiceFile, script[0].voice, script.map((s) => s.text).join(" "), TELC_PACE[teil])
        else await converse(voiceFile, script.map((s) => ({ voice: s.voice, text: s.text })), TELC_PACE[teil])
        const clip = path.join(OUT, `${b.id}.mp3`)
        if (FORCE || !fs.existsSync(clip)) await design(voiceFile, b.sound, clip)
        b.display.clip = { ...b.display.clip!, src: `${SRC}/${b.id}.mp3`, duration: +seconds(clip).toFixed(2), segments: [] }
        // Official framing: Teil 2 "Hören Sie jetzt das Gespräch"; Teil 3 per text a reading prompt, ~5 s, then
        // "Hören Sie jetzt den Text" and the narrator's situation sentence before each of the two plays.
        const lead = b.display.clip?.lead ? await narr(b.display.clip.lead) : null
        // The official narrator leaves ~1.5 s after each framing line (silence detection, 2026-10-23).
        const say = (file: string) => {
          push(file, { teil, phase: "instruction", items: ns })
          gap(1.5)
        }
        if (teil === 3) {
          say(await narr(`Lesen Sie jetzt die Aufgabe ${spell(ns[0])}.`))
          gap(full.pauses!.before, { teil, phase: "reading", items: ns })
        }
        say(await narr(teil === 2 ? "Hören Sie jetzt das Gespräch." : "Hören Sie jetzt den Text."))
        if (lead) say(lead)
        push(clip, { teil, phase: "clip", items: ns })
        gap(full.pauses!.after, { teil, phase: "answer", items: ns })
        say(await narr(teil === 2 ? "Sie hören das Gespräch noch einmal." : "Sie hören den Text noch einmal."))
        if (lead) say(lead)
        push(clip, { teil, phase: "clip", items: ns })
        gap(full.pauses!.after, { teil, phase: "answer", items: ns })
      }
    }
    push(await narr(teil < 3 ? `Ende von Teil ${NUM[teil]}.` : "Ende des Prüfungsteils Hörverstehen."))
    gap(4)
  }
  const list = path.join(OUT, "track.txt")
  fs.writeFileSync(list, seq.map((f) => `file '${path.resolve(f)}'`).join("\n"))
  const track = path.join(OUT, "track.mp3")
  ff("-f", "concat", "-safe", "0", "-i", list, "-ac", "1", "-ar", "44100", "-b:a", "64k", track)
  set.track = { src: `${SRC}/track.mp3`, duration: +seconds(track).toFixed(2), cues } satisfies HoerTrack
  fs.writeFileSync(FILE, JSON.stringify(set, null, 2) + "\n")
  console.log(`→ ${track}: ${(set.track.duration / 60).toFixed(1)} min, ${cues.length} cues, ${characters} characters rendered (${MODEL})`)
}

/**
 * Start Deutsch 1 and telc A2: measured on the official Übungstest MP3s (2026-10-23, silencedetect + Scribe). A jingle
 * and "Teil n" + instruction open each Teil; per text "Beispiel"/"Nummer n", ~7 s to read, the clip, ~1.5 s + chime
 * + ~1.5 s and the repeat where played twice, then ~16 s to answer. Official totals: A1 16:54, A2 18:23.
 * A2 Teil 3 is one conversation for items 11–15 (its Beispiel is part of it, printed solved).
 */
const LEVEL_PACE: Record<string, Record<number, number>> = { "start-deutsch-1": { 1: 120, 2: 115, 3: 140 }, "telc-a2": { 1: 160, 2: 160, 3: 175 } }
const LEVEL_NAME: Record<string, string> = { "start-deutsch-1": "Start Deutsch 1", "telc-a2": "telc Deutsch A2" }

async function levelTrack(set: MtSet) {
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
  const pace = LEVEL_PACE[EXAM]

  push(await narr(`${LEVEL_NAME[EXAM]}. Modelltest ${NUM[SET] ?? SET}. Hören. Es gibt drei Teile. Zu jedem Text gibt es eine Aufgabe. Lesen Sie immer zuerst die Aufgabe. Hören Sie dann den Text und wählen Sie die richtige Lösung.`))
  gap(2)
  for (const teil of [1, 2, 3]) {
    const blocks = set.blocks.filter((b) => b.teil === teil)
    const all = blocks.flatMap((b) => itemNumbers(b.display.items))
    push(await sfx("jingle"))
    push(await narr(`Teil ${NUM[teil]}. ${spoken(blocks[0].display.instruction)}`), { teil, phase: "instruction", items: all })
    gap(2)
    for (const b of blocks) {
      const ns = itemNumbers(b.display.items)
      const script = b.key.script!
      const voiceFile = path.join(OUT, `${b.id}.voice.mp3`)
      if (new Set(script.map((s) => s.speaker)).size === 1) await speak(voiceFile, script[0].voice, script.map((s) => s.text).join(" "), pace[teil])
      else await converse(voiceFile, script.map((s) => ({ voice: s.voice, text: s.text })), pace[teil])
      const clip = path.join(OUT, `${b.id}.mp3`)
      if (FORCE || !fs.existsSync(clip)) await design(voiceFile, b.sound, clip)
      b.display.clip = { ...b.display.clip!, src: `${SRC}/${b.id}.mp3`, duration: +seconds(clip).toFixed(2), segments: [] }
      const scored = ns.filter((n) => n > 0)
      const label = b.example ? "Beispiel." : scored.length > 1 ? `Nummer ${spell(scored[0])} bis ${spell(scored.at(-1)!)}.` : `Nummer ${spell(scored[0])}.`
      push(await narr(label), { teil, phase: "instruction", items: ns })
      gap(7, { teil, phase: "reading", items: ns })
      push(clip, { teil, phase: "clip", items: ns })
      if ((b.display.clip.plays ?? 1) > 1) {
        gap(1.5)
        push(await sfx("number"))
        gap(1.5)
        push(clip, { teil, phase: "clip", items: ns })
      }
      gap(16, { teil, phase: "answer", items: ns })
    }
  }
  push(await sfx("jingle"))
  push(await narr("Ende des Prüfungsteils Hören."))
  gap(2)
  const list = path.join(OUT, "track.txt")
  fs.writeFileSync(list, seq.map((f) => `file '${path.resolve(f)}'`).join("\n"))
  const track = path.join(OUT, "track.mp3")
  ff("-f", "concat", "-safe", "0", "-i", list, "-ac", "1", "-ar", "44100", "-b:a", "64k", track)
  set.track = { src: `${SRC}/track.mp3`, duration: +seconds(track).toFixed(2), cues } satisfies HoerTrack
  fs.writeFileSync(FILE, JSON.stringify(set, null, 2) + "\n")
  console.log(`→ ${track}: ${(set.track.duration / 60).toFixed(1)} min, ${cues.length} cues, ${characters} characters rendered (${MODEL})`)
}

/**
 * Goethe-Zertifikat A2 (research/goethe-a2.md §11.2, measured on the Modellsatz clips 2026-10-24): Teil 1 five texts
 * played twice, Teil 2 "Sie hören jetzt das Beispiel" + example + "Sie hören jetzt den Text" + the rest once, Teil 3 five
 * dialogues once, Teil 4 example + interview, the interview twice; ~3 min transfer at the end (paper exam clock).
 * TODO(hannes): the reading pauses and the gap between plays are not measured (the Übungssatz master MP3 was not
 * reachable); the values below are our assumptions.
 */
const GOETHE_A2_PACE: Record<number, number> = { 1: 155, 2: 166, 3: 160, 4: 160 }
/**
 * Goethe-/ÖSD-Zertifikat B1 (research/goethe-oesd-b1.md §8.3, both official tracks measured 2026-10-24): Teil 1 per text
 * "Lesen Sie nun die Aufgaben …" + 10.5 s, the situation line, the text, "noch einmal", the text; Teile 2–4 60 s reading,
 * the situation line, the text (Teil 4 with music and twice), ~9 s, "Ende von Hören Teil n"; 5 min transfer at the end.
 */
const GOETHE_B1_PACE: Record<number, number> = { 1: 140, 2: 140, 3: 150, 4: 155 }

/** The Beispiel turns (item 0) at the start of a block's script, and the rest. */
const splitExample = (script: NonNullable<MtBlock["key"]["script"]>) => {
  const last = script.map((t) => t.item).lastIndexOf(0)
  return last < 0 ? [[], script] : [script.slice(0, last + 1), script.slice(last + 1)]
}

async function goetheTrack(set: MtSet) {
  const a2 = EXAM === "goethe-a2"
  const pace = a2 ? GOETHE_A2_PACE : GOETHE_B1_PACE
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
  /** Renders a script (one voice or a dialogue) with its sound design into <name>.mp3. */
  const render = async (b: MtBlock, name: string, script: NonNullable<MtBlock["key"]["script"]>, teil: number) => {
    const voiceFile = path.join(OUT, `${name}.voice.mp3`)
    if (new Set(script.map((s) => s.speaker)).size === 1) await speak(voiceFile, script[0].voice, script.map((s) => s.text).join(" "), pace[teil])
    else await converse(voiceFile, script.map((s) => ({ voice: s.voice, text: s.text })), pace[teil])
    const clip = path.join(OUT, `${name}.mp3`)
    if (FORCE || !fs.existsSync(clip)) await design(voiceFile, b.sound, clip)
    return clip
  }
  const setClip = (b: MtBlock, file: string) => (b.display.clip = { ...b.display.clip!, src: `${SRC}/${path.basename(file)}`, duration: +seconds(file).toFixed(2), segments: [] })
  const range = (ns: number[]) => (ns.length > 1 ? `${spell(ns[0])} bis ${spell(ns.at(-1)!)}` : spell(ns[0]))

  push(await narr(a2 ? `Goethe-Zertifikat A2. Modelltest ${NUM[SET] ?? SET}. Hören. Der Test Hören hat vier Teile. Lesen Sie zuerst die Aufgaben. Hören Sie dann den Text. Wählen Sie bei jeder Aufgabe die richtige Lösung.` : `Zertifikat B1. Modul Hören. Modelltest ${NUM[SET] ?? SET}.`))
  gap(2)
  for (const teil of [1, 2, 3, 4]) {
    const blocks = set.blocks.filter((b) => b.teil === teil)
    const all = blocks.flatMap((b) => itemNumbers(b.display.items)).filter((n) => n > 0)
    push(await narr(`${a2 ? "Teil" : "Hören Teil"} ${NUM[teil]}. ${spoken(blocks[0].display.instruction)}`), { teil, phase: "instruction", items: all })
    gap(2)
    const lead = async (b: MtBlock) => {
      if (!b.display.clip?.lead) return
      push(await narr(b.display.clip.lead), { teil, phase: "instruction", items: itemNumbers(b.display.items) })
      gap(1.5)
    }
    if (a2 && (teil === 2 || teil === 4)) {
      // One block: the Beispiel exchange, then the text (Teil 4 twice).
      const b = blocks[0]
      const [ex, rest] = splitExample(b.key.script!)
      push(await narr(teil === 2 ? "Sehen Sie sich jetzt die Bilder an." : `Lesen Sie jetzt die Aufgaben ${range(all)}.`), { teil, phase: "instruction", items: all })
      gap(teil === 2 ? 20 : 30, { teil, phase: "reading", items: all })
      const exClip = await render(b, `${b.id}-bsp`, ex, teil)
      const clip = await render(b, b.id, rest, teil)
      push(await narr("Sie hören jetzt das Beispiel."), { teil, phase: "instruction", items: [0] })
      gap(teil === 2 ? 1.9 : 3.7)
      push(exClip, { teil, phase: "clip", items: [0] })
      gap(2.2)
      push(await narr("Sie hören jetzt den Text."), { teil, phase: "instruction", items: all })
      gap(3.2)
      push(clip, { teil, phase: "clip", items: all })
      gap(5, { teil, phase: "answer", items: all })
      if (teil === 4) {
        push(await narr("Sie hören den Text noch einmal."), { teil, phase: "instruction", items: all })
        gap(2)
        push(clip, { teil, phase: "clip", items: all })
        gap(5, { teil, phase: "answer", items: all })
      }
      setClip(b, clip)
    } else if (a2 || teil === 1) {
      for (const b of blocks) {
        const ns = itemNumbers(b.display.items)
        const real = ns.filter((n) => n > 0)
        const clip = await render(b, b.id, b.key.script!, teil)
        setClip(b, clip)
        if (a2) push(await narr(`Nummer ${spell(real[0])}.`), { teil, phase: "instruction", items: ns })
        else push(await narr(b.example ? "Lesen Sie nun das Beispiel. Dazu haben Sie zehn Sekunden Zeit." : `Lesen Sie nun die Aufgaben ${spell(real[0])} und ${spell(real[1])}. Dazu haben Sie zehn Sekunden Zeit.`), { teil, phase: "instruction", items: ns })
        gap(a2 ? 5 : 10.5, { teil, phase: "reading", items: ns })
        await lead(b)
        push(clip, { teil, phase: "clip", items: ns })
        if ((b.display.clip?.plays ?? 1) > 1) {
          gap(2)
          push(await narr("Sie hören den Text noch einmal."), { teil, phase: "instruction", items: ns })
          gap(1)
          push(clip, { teil, phase: "clip", items: ns })
        }
        gap(a2 ? 5 : 2.5, { teil, phase: "answer", items: ns })
      }
    } else {
      // B1 Teile 2–4: one long text after 60 s reading; Teil 4 is a radio discussion with music, played twice.
      const b = blocks[0]
      const clip = await render(b, b.id, b.key.script!, teil)
      setClip(b, clip)
      push(await narr(`Lesen Sie jetzt die Aufgaben ${range(all)}. Dazu haben Sie sechzig Sekunden Zeit.`), { teil, phase: "instruction", items: all })
      gap(60, { teil, phase: "reading", items: all })
      await lead(b)
      const plays = teil === 4 ? 2 : 1
      for (let p = 0; p < plays; p++) {
        if (p) {
          push(await narr("Sie hören die Diskussion jetzt noch einmal."), { teil, phase: "instruction", items: all })
          gap(1.5)
        }
        if (teil === 4) push(await sfx("music"))
        push(clip, { teil, phase: "clip", items: all })
        if (teil === 4) push(await sfx("music"))
        gap(teil === 4 && !p ? 3 : 9, { teil, phase: "answer", items: all })
      }
    }
    if (!a2) {
      push(await narr(`Ende von Hören Teil ${NUM[teil]}.`))
      gap(5)
    }
  }
  const items = set.blocks.flatMap((b) => itemNumbers(b.display.items)).filter((n) => n > 0)
  push(await narr(a2 ? "Ende des Prüfungsteils Hören. Sie haben jetzt drei Minuten Zeit. Übertragen Sie Ihre Lösungen auf den Antwortbogen." : "Sie haben nun fünf Minuten Zeit, Ihre Ergebnisse auf den Antwortbogen zu übertragen."), { teil: 4, phase: "instruction", items })
  gap(a2 ? 180 : 300, { teil: 4, phase: "answer", items })
  push(await narr(a2 ? "Ende des Tests Hören." : "Ende des Moduls Hören."))
  gap(2)
  const list = path.join(OUT, "track.txt")
  fs.writeFileSync(list, seq.map((f) => `file '${path.resolve(f)}'`).join("\n"))
  const track = path.join(OUT, "track.mp3")
  ff("-f", "concat", "-safe", "0", "-i", list, "-ac", "1", "-ar", "44100", "-b:a", "64k", track)
  set.track = { src: `${SRC}/track.mp3`, duration: +seconds(track).toFixed(2), cues } satisfies HoerTrack
  fs.writeFileSync(FILE, JSON.stringify(set, null, 2) + "\n")
  console.log(`→ ${track}: ${(set.track.duration / 60).toFixed(1)} min, ${cues.length} cues, ${characters} characters rendered (${MODEL})`)
}

/**
 * ÖSD Zertifikat A1 / A2 (research/oesd-a1.md, oesd-a2.md §9.2, both Modellsatz tracks measured 2026-10-24): a gong
 * between every step; per Aufgabe the preview line, the reading pause (A1 30 / 30 / 10 s, A2 30 / 30 / 30 s), the spoken
 * situation, then the texts. A1: "Text n." before each dialogue and interview answer, a beep around the voicemail;
 * A2: a radio jingle around the two texts, the playback sound before each voicemail play, answers ~4 s apart without
 * labels. 20 s to check after Aufgabe 2, 60 s after Aufgabe 3. Totals: A1 11:39, A2 10:22.
 */
const OESD_PACE: Record<string, Record<number, number>> = { "oesd-a1": { 1: 154, 2: 112, 3: 155 }, "oesd-a2": { 1: 166, 2: 180, 3: 175 } }

async function oesdTrack(set: MtSet) {
  const a1 = EXAM === "oesd-a1"
  const pace = OESD_PACE[EXAM]
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
  const gong = async () => {
    gap(0.6)
    push(await sfx("xylo"))
    gap(0.8)
  }
  /** One clip of a script (one voice or a dialogue), with the sound cue its first turn names. */
  const render = async (name: string, turns: NonNullable<MtBlock["key"]["script"]>, teil: number, sound?: SoundKey) => {
    const voiceFile = path.join(OUT, `${name}.voice.mp3`)
    if (new Set(turns.map((s) => s.speaker)).size === 1) await speak(voiceFile, turns[0].voice, turns.map((s) => s.text).join(" "), pace[teil])
    else await converse(voiceFile, turns.map((s) => ({ voice: s.voice, text: s.text })), pace[teil])
    const clip = path.join(OUT, `${name}.mp3`)
    if (FORCE || !fs.existsSync(clip)) await design(voiceFile, sound, clip)
    return clip
  }
  /** The block's review clip: its clips joined with a short pause (the exam itself plays the track). */
  const review = (b: MtBlock, files: string[]) => {
    const list = path.join(OUT, `${b.id}.txt`)
    fs.writeFileSync(list, files.flatMap((f, i) => [`file '${path.resolve(f)}'`, ...(i < files.length - 1 ? [`file '${path.resolve(silence(1.5))}'`] : [])]).join("\n"))
    const joined = path.join(OUT, `${b.id}.review.mp3`)
    ff("-f", "concat", "-safe", "0", "-i", list, ...JOIN, joined)
    b.display.clip = { ...b.display.clip!, src: `${SRC}/${path.basename(joined)}`, duration: +seconds(joined).toFixed(2), segments: [] }
  }
  const READ: Record<number, number> = a1 ? { 1: 30, 2: 30, 3: 10 } : { 1: 30, 2: 30, 3: 30 }
  const SEC = ["", "", "", "", "", "", "", "", "", "", "zehn", "", "", "", "", "", "", "", "", "", "zwanzig", "", "", "", "", "", "", "", "", "", "dreißig"]

  push(await narr(`ÖSD Zertifikat ${a1 ? "A1" : "A2"}. Modelltest ${NUM[SET] ?? SET}. Hören.`))
  await gong()
  for (const teil of [1, 2, 3]) {
    const b = set.blocks.find((x) => x.teil === teil)!
    const all = itemNumbers(b.display.items).filter((n) => n > 0)
    const script = b.key.script!
    const preview = a1 && teil === 1 ? "Sehen Sie sich die Fotos an." : `Lesen Sie die Aufgabe ${NUM[teil]}.`
    push(await narr(`Aufgabe ${NUM[teil]}. ${preview} Sie haben dafür ${SEC[READ[teil]]} Sekunden Zeit.`), { teil, phase: "instruction", items: all })
    gap(READ[teil], { teil, phase: "reading", items: all })
    push(await narr(spoken(b.display.instruction)), { teil, phase: "instruction", items: all })
    await gong()
    const clipNos = [...new Set(script.map((s) => s.clip ?? 0))].filter((c) => c > 0)
    const turnsOf = (c: number) => script.filter((s) => s.clip === c)
    if (teil === 2) {
      // The voicemail, twice. A1: beep before and after each play; A2: the playback sound before each play.
      const voice = await render(b.id, script, teil)
      const play = async () => {
        if (a1) push(await sfx("beep"))
        else push(await sfx("playback"))
        gap(0.4)
        push(voice, { teil, phase: "clip", items: all })
        gap(0.4)
        if (a1) push(await sfx("beep"))
      }
      await play()
      await gong()
      push(await narr("Sie hören den Text jetzt zum zweiten Mal."), { teil, phase: "instruction", items: all })
      await gong()
      await play()
      await gong()
      push(await narr("Sie haben jetzt zwanzig Sekunden Zeit. Kontrollieren Sie Ihre Notizen."), { teil, phase: "instruction", items: all })
      gap(20, { teil, phase: "answer", items: all })
      b.display.clip = { ...b.display.clip!, src: `${SRC}/${path.basename(voice)}`, duration: +seconds(voice).toFixed(2), segments: [] }
    } else if (!a1 && teil === 1) {
      // Two radio texts with the same news, a jingle before, between and after.
      const files: string[] = []
      push(await sfx("jingle"))
      for (const c of clipNos) {
        const f = await render(`${b.id}-${c}`, turnsOf(c), teil)
        files.push(f)
        gap(0.6)
        push(f, { teil, phase: "clip", items: all })
        gap(0.6)
        push(await sfx("jingle"))
      }
      review(b, files)
    } else {
      // A1 Aufgabe 1: "Text n." + cue + dialogue. Aufgabe 3: the interviewer once, then the answers (A1 labelled).
      const files: string[] = []
      const intro = script.filter((s) => s.clip === undefined)
      if (intro.length) {
        const f = await render(`${b.id}-0`, intro, teil)
        files.push(f)
        push(f, { teil, phase: "clip", items: all })
        gap(1.5)
      }
      for (const [i, c] of clipNos.entries()) {
        const turns = turnsOf(c)
        const f = await render(`${b.id}-${c}`, turns, teil, (turns[0].sound as SoundKey | undefined) ?? (teil === 3 ? b.sound : undefined))
        files.push(f)
        const n = all[i] ?? all[0]
        if (a1) {
          push(await narr(`Text ${NUM[c]}.`), { teil, phase: "instruction", items: [n] })
          gap(0.6)
        }
        push(f, { teil, phase: "clip", items: teil === 1 ? all : [n] })
        gap(a1 ? 2 : 4)
      }
      review(b, files)
    }
    await gong()
    if (teil === 3) {
      push(await narr("Sie haben jetzt sechzig Sekunden Zeit. Kontrollieren Sie Ihre Antworten."), { teil, phase: "instruction", items: all })
      gap(60, { teil, phase: "answer", items: all })
      await gong()
    }
  }
  push(await narr("Ende des Prüfungsteils Hören."))
  await gong()
  gap(2)
  const list = path.join(OUT, "track.txt")
  fs.writeFileSync(list, seq.map((f) => `file '${path.resolve(f)}'`).join("\n"))
  const track = path.join(OUT, "track.mp3")
  ff("-f", "concat", "-safe", "0", "-i", list, "-ac", "1", "-ar", "44100", "-b:a", "64k", track)
  set.track = { src: `${SRC}/track.mp3`, duration: +seconds(track).toFixed(2), cues } satisfies HoerTrack
  fs.writeFileSync(FILE, JSON.stringify(set, null, 2) + "\n")
  console.log(`→ ${track}: ${(set.track.duration / 60).toFixed(1)} min, ${cues.length} cues, ${characters} characters rendered (${MODEL})`)
}

async function main() {
  if (SKILL === "sprechen") return sprechen()
  if (EXAM === "oesd-a1" || EXAM === "oesd-a2") {
    fs.mkdirSync(OUT, { recursive: true })
    fs.mkdirSync(COMMON, { recursive: true })
    return oesdTrack(JSON.parse(fs.readFileSync(FILE, "utf8")) as MtSet)
  }
  if (EXAM in LEVEL_PACE) {
    fs.mkdirSync(OUT, { recursive: true })
    fs.mkdirSync(COMMON, { recursive: true })
    return levelTrack(JSON.parse(fs.readFileSync(FILE, "utf8")) as MtSet)
  }
  if (["goethe-a2", "goethe-b1", "oesd-b1"].includes(EXAM)) {
    fs.mkdirSync(OUT, { recursive: true })
    fs.mkdirSync(COMMON, { recursive: true })
    return goetheTrack(JSON.parse(fs.readFileSync(FILE, "utf8")) as MtSet)
  }
  if (EXAM === "telc-b1") {
    fs.mkdirSync(OUT, { recursive: true })
    fs.mkdirSync(COMMON, { recursive: true })
    return telcTrack(JSON.parse(fs.readFileSync(FILE, "utf8")) as MtSet)
  }
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
      ff("-f", "concat", "-safe", "0", "-i", list4, ...JOIN, joined)
      b.display.clip = { ...b.display.clip!, src: `${SRC}/${b.id}.mp3`, duration: +seconds(joined).toFixed(2), segments: [] }
    }
    push(await sfx("number"))
    push(await narr(teil < 4 ? `Ende von Teil ${NUM[teil]}.` : "Ende des Prüfungsteils Hören."))
    gap(6)
  }

  const list = path.join(OUT, "track.txt")
  fs.writeFileSync(list, seq.map((f) => `file '${path.resolve(f)}'`).join("\n"))
  const track = path.join(OUT, "track.mp3")
  ff("-f", "concat", "-safe", "0", "-i", list, "-ac", "1", "-ar", "44100", "-b:a", "64k", track)
  set.track = { src: `${SRC}/track.mp3`, duration: +seconds(track).toFixed(2), cues } satisfies HoerTrack
  fs.writeFileSync(FILE, JSON.stringify(set, null, 2) + "\n")
  console.log(`→ ${track}: ${(set.track.duration / 60).toFixed(1)} min, ${cues.length} cues, ${characters} characters rendered (${MODEL})`)
}

main().catch((e) => {
  console.error(e instanceof Error ? e.message : e)
  process.exit(1)
})
