// ÖSD Zertifikat B1 is the Goethe-Zertifikat B1 under another name (one item bank, research/goethe-oesd-b1.md §8.1).
// Hannes, 2026-10-24: same tasks, Austrian voices. This copies data/modelltest/goethe-b1/<skill>-NN.json to oesd-b1 and
// recasts every voice: Swiss-set speakers (regions-NN.json) get Swiss voices, everyone else Austrian ones, by gender and
// age, never one voice twice in a block or back to back across blocks. Rendered audio is not copied; run audio.ts after.
//
// npx tsx scripts/modelltest/derive-oesd.ts --set 1

import fs from "node:fs"
import voices from "@/data/tts-voices.json"
import { GOETHE_VOICES } from "@/lib/exam/validate-modelltest"
import type { MtBlock, MtSet } from "@/lib/modelltest/types"

const i = process.argv.indexOf("--set")
const SET = Number(process.argv[i + 1])
if (!(SET >= 1 && SET <= 10)) throw new Error("Usage: --set 1..10")
const NN = String(SET).padStart(2, "0")
const FROM = "data/modelltest/goethe-b1"
const TO = "data/modelltest/oesd-b1"

type Voice = { gender: string; accent: string; age: string }
const V = voices as Record<string, Voice>
/** Kept out of the clips: the ÖSD narrator (audio.ts), Thomas (not approved), and Martin, whose stronger accent is only a
 * last resort (ÖSD: standard German with a light accent). */
const RESERVED = new Set(["woman_seda_at", "man_thomas_ch", "man_martin_at"])
const pool = (accent: string, gender: string) => Object.keys(V).filter((k) => V[k].accent === accent && V[k].gender === gender && !RESERVED.has(k))
const lastResort = (gender: string) => (gender === "male" ? ["man_martin_at"] : [])

const regions: Record<string, Record<string, string>> = fs.existsSync(`${FROM}/regions-${NN}.json`) ? JSON.parse(fs.readFileSync(`${FROM}/regions-${NN}.json`, "utf8")) : {}
let last = new Set<string>()

function recast(b: MtBlock, oldId: string) {
  const script = b.key.script
  if (!script?.length) return
  const map = new Map<string, string>()
  const used = new Set<string>()
  for (const t of script) {
    if (map.has(t.speaker)) continue
    const src = V[t.voice]
    if (!src) throw new Error(`${oldId}: uncast voice "${t.voice}"`)
    const region = regions[oldId]?.[t.speaker] === "ch" ? "ch" : "at"
    const options = [...pool(region, src.gender), ...(region === "at" ? lastResort(src.gender) : []), ...pool(region === "ch" ? "at" : "ch", src.gender), ...lastResort(src.gender)]
    const free = options.filter((k) => !used.has(k) && !last.has(k))
    const pick = free.find((k) => V[k].age === src.age) ?? free[0] ?? options.find((k) => !used.has(k))
    if (!pick) throw new Error(`${oldId}: no ${region} ${src.gender} voice left for ${t.speaker}`)
    map.set(t.speaker, pick)
    used.add(pick)
  }
  for (const t of script) t.voice = map.get(t.speaker)!
  last = used
}

for (const skill of ["hoeren", "lesen", "schreiben", "sprechen"]) {
  const file = `${FROM}/${skill}-${NN}.json`
  if (!fs.existsSync(file)) {
    console.log(`${skill}: no Goethe file, skipped`)
    continue
  }
  const set = JSON.parse(fs.readFileSync(file, "utf8")) as MtSet
  delete set.track
  set.exam = "oesd-b1"
  for (const b of set.blocks) {
    const oldId = b.id
    b.id = b.id.replace(/^goethe-b1-/, "oesd-b1-")
    b.exam = "oesd-b1"
    if (b.display.clip) b.display.clip = { ...b.display.clip, src: undefined, duration: 0 }
    recast(b, oldId)
    if (b.key.speaking) {
      b.key.speaking.voices = GOETHE_VOICES["oesd-b1"]
      for (const t of b.display.speaking?.turns ?? []) delete (t as { src?: string }).src
    }
  }
  fs.mkdirSync(TO, { recursive: true })
  fs.writeFileSync(`${TO}/${skill}-${NN}.json`, JSON.stringify(set, null, 2) + "\n")
  const cast = [...new Set(set.blocks.flatMap((b) => b.key.script?.map((t) => t.voice) ?? []))]
  console.log(`${skill}: → ${TO}/${skill}-${NN}.json${cast.length ? ` (voices: ${cast.join(", ")})` : ""}`)
}
