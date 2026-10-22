// Finds the Sprechen Teil 2 photos on Pexels (one per candidate), re-encodes them to 1200 px WebP q72 and records them
// in a lock file, so a re-run never swaps a reviewed photo and no photo is used in two sets. Uploaded by the seeder.
// Claude then looks at the chosen photo and rewrites what depends on it (alt text, the partner's description, the
// sample answer), so the spoken text never describes a different picture.
//
// npx tsx --env-file=.env.local scripts/modelltest/images.ts --set 1 [--next du|partner]
// --next skips the current photo for that role and takes the next unused search result.

import { execFileSync } from "node:child_process"
import fs from "node:fs"
import path from "node:path"
import { z } from "zod"
import type { MtBlock, MtPhoto, MtSet } from "@/lib/modelltest/types"
import { DTZ_SYSTEM, makeAsk } from "../lib/drafting"
import { SPRECHEN_2 } from "./plan-dtz"

const KEY = process.env.PEXELS_API_KEY
if (!KEY) throw new Error("PEXELS_API_KEY missing (run with --env-file=.env.local)")
const arg = (name: string) => {
  const i = process.argv.indexOf(`--${name}`)
  return i > -1 ? process.argv[i + 1] : undefined
}
const SET = Number(arg("set"))
const NEXT = arg("next")
const NN = String(SET).padStart(2, "0")
const FILE = `data/modelltest/dtz/sprechen-${NN}.json`
const OUT = `.unit-cache/images/dtz/sprechen-${NN}`
const LOCK = "data/modelltest/photos.lock.json"

const ask = makeAsk(DTZ_SYSTEM)
const Fit = z.object({ fits: z.boolean(), reason: z.string(), alt: z.string(), description: z.string() })

/** Rewrites the alt text and the description of this photo (partner's turn, or the du sample answer) to the real picture. */
async function fitText(b: MtBlock, role: "du" | "partner", file: string, topic: string) {
  const sp = b.display.speaking!
  const partnerTurn = sp.turns.find((t) => t.who === "partner" && t.phase === "2A")!
  const current = role === "partner" ? partnerTurn.text : b.key.speaking!.sampleAnswers[0]
  const o = await ask(Fit, `DTZ Sprechen Teil 2, Thema "${topic}". Das ist das Foto ${role === "partner" ? "des Partners" : "für die Person, die übt"}.
fits: passt das Foto zum Thema und zeigt eine Alltagssituation, die man auf B1 beschreiben kann?
alt: deutscher Alternativtext, 1 Satz, nur was wirklich zu sehen ist.
description: schreibe diese Bildbeschreibung so um, dass sie genau zu diesem Foto passt (Personen, Ort, was passiert, eine Vermutung zur Situation). Gleiche Länge (60–90 Wörter), gleicher Stil${role === "partner" ? " (gesprochen, B1, ein- oder zweimal \"äh\")" : " (gute B1-Antwort)"}. Nichts erfinden, was man nicht sieht, außer als Vermutung ("Ich glaube …", "Vielleicht …").
Bisher: "${current}"`, { data: fs.readFileSync(file).toString("base64"), mediaType: "image/webp" })
  if (!o.fits) console.log(`  ! ${role}: Claude says the photo does not fit: ${o.reason}`)
  if (role === "partner") partnerTurn.text = o.description
  else b.key.speaking!.sampleAnswers[0] = o.description
  return o.alt
}

type Lock = Record<string, { pexelsId: number; query: string; skipped: number[]; fitted?: boolean }>
type PexelsPhoto = { id: number; url: string; photographer: string; alt: string; src: { large2x: string } }

async function search(query: string) {
  const res = await fetch(`https://api.pexels.com/v1/search?${new URLSearchParams({ query, orientation: "landscape", per_page: "30" })}`, { headers: { Authorization: KEY! } })
  if (!res.ok) throw new Error(`Pexels ${res.status} ${await res.text()}`)
  return ((await res.json()) as { photos: PexelsPhoto[] }).photos
}

async function main() {
  const set = JSON.parse(fs.readFileSync(FILE, "utf8")) as MtSet
  const lock: Lock = fs.existsSync(LOCK) ? JSON.parse(fs.readFileSync(LOCK, "utf8")) : {}
  fs.mkdirSync(OUT, { recursive: true })
  for (const b of set.blocks) {
    const photos = b.display.speaking?.photos
    if (!photos) continue
    for (const role of ["du", "partner"] as const) {
      const ph: MtPhoto = photos[role]
      const slot = `dtz/sprechen-${NN}/${role}`
      const entry = lock[slot]
      const file = path.join(OUT, `photo-${role}.webp`)
      const keep = entry && entry.query === ph.query && NEXT !== role && ph.src && fs.existsSync(file)
      if (!keep) {
        const skipped = entry && entry.query === ph.query ? [...entry.skipped, ...(NEXT === role ? [entry.pexelsId] : [])] : []
        const taken = new Set(Object.entries(lock).filter(([k]) => k !== slot).map(([, v]) => v.pexelsId))
        const pick = (await search(ph.query)).find((p) => !taken.has(p.id) && !skipped.includes(p.id))
        if (!pick) throw new Error(`no unused Pexels photo for "${ph.query}"`)
        const raw = `${file}.jpg`
        fs.writeFileSync(raw, Buffer.from(await (await fetch(pick.src.large2x)).arrayBuffer()))
        execFileSync("ffmpeg", ["-hide_banner", "-loglevel", "error", "-y", "-i", raw, "-vf", "scale=1200:-2", "-c:v", "libwebp", "-quality", "72", file])
        fs.rmSync(raw)
        photos[role] = { ...ph, src: `dtz/sprechen-${NN}/photo-${role}.webp`, credit: { name: pick.photographer, url: pick.url, pexelsId: pick.id } }
        lock[slot] = { pexelsId: pick.id, query: ph.query, skipped }
        console.log(`${role}: ${pick.url} (${Math.round(fs.statSync(file).size / 1024)} KB) — Pexels alt: "${pick.alt}"`)
      }
      if (lock[slot].fitted) continue
      photos[role] = { ...photos[role], alt: await fitText(b, role, file, SPRECHEN_2[SET - 1]) }
      lock[slot].fitted = true
    }
  }
  fs.writeFileSync(FILE, JSON.stringify(set, null, 2) + "\n")
  fs.writeFileSync(LOCK, JSON.stringify(Object.fromEntries(Object.entries(lock).sort()), null, 2) + "\n")
}

main().catch((e) => {
  console.error(e instanceof Error ? e.message : e)
  process.exit(1)
})
