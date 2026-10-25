// Photos for picture options (Goethe A2 Hören Teil 2: 9 pictures to match; Teil 3: 3 pictures per item). The drafts
// carry a Pexels query per option in block.photos[n][key]; this finds a photo, lets Claude check that it clearly shows
// the option (else the next result), re-encodes it to 800 px WebP q72 and writes its path into the option. The lock file
// keeps a reviewed photo stable and never uses one photo twice. Uploaded by the seeder.
//
// ÖSD A1 Sprechen (--skill sprechen): the three photos to choose from (speaking scenes, item 0).
//
// npx tsx --env-file=.env.local scripts/modelltest/images-options.ts --exam goethe-a2 --set 1 [--skill hoeren|sprechen] [--next <blockId>/<n>/<key>]

import { execFileSync } from "node:child_process"
import fs from "node:fs"
import path from "node:path"
import { z } from "zod"
import type { MtBlock, MtSet } from "@/lib/modelltest/types"
import { makeAsk } from "../lib/drafting"

const KEY = process.env.PEXELS_API_KEY
if (!KEY) throw new Error("PEXELS_API_KEY missing (run with --env-file=.env.local)")
const arg = (name: string) => {
  const i = process.argv.indexOf(`--${name}`)
  return i > -1 ? process.argv[i + 1] : undefined
}
const EXAM = arg("exam") ?? "goethe-a2"
const SET = Number(arg("set"))
const NEXT = arg("next")
const NN = String(SET).padStart(2, "0")
const SKILL = arg("skill") ?? "hoeren"
const FILE = `data/modelltest/${EXAM}/${SKILL}-${NN}.json`
const DIR = `${EXAM}/${SKILL}-${NN}`
const OUT = `.unit-cache/images/${DIR}`
const LOCK = "data/modelltest/photos.lock.json"

// PHOTO_MODEL: the fit check runs live (one photo after another), so a cheaper model can be chosen (sets 2–10: Sonnet).
const ask = makeAsk("Du prüfst Fotos für Bildaufgaben in einer Deutschprüfung (Niveau A2). Antworte knapp und ehrlich.", process.env.PHOTO_MODEL)
const Fit = z.object({ fits: z.boolean(), reason: z.string(), alt: z.string() })

type Lock = Record<string, { pexelsId: number; query: string; skipped: number[]; fitted?: boolean }>
type PexelsPhoto = { id: number; url: string; photographer: string; alt: string; src: { large: string } }

async function search(query: string) {
  const res = await fetch(`https://api.pexels.com/v1/search?${new URLSearchParams({ query, per_page: "15" })}`, { headers: { Authorization: KEY! } })
  if (!res.ok) throw new Error(`Pexels ${res.status} ${await res.text()}`)
  return ((await res.json()) as { photos: PexelsPhoto[] }).photos
}

/** The options a block's photos belong to: picture items by item number, a matching grid as item 0. */
function targets(b: MtBlock) {
  const out: { n: number; key: string; label: string; set: (src: string) => void }[] = []
  for (const it of b.display.items) {
    if (it.type === "picture") for (const o of it.item.options) out.push({ n: it.item.n, key: o.key, label: o.label, set: (src) => (o.image = src) })
    if (it.type === "match") for (const a of it.data.ads) out.push({ n: 0, key: a.key, label: a.text || a.title, set: (src) => (a.image = src) })
  }
  for (const sc of b.display.speaking?.data.scenes ?? []) out.push({ n: 0, key: sc.key, label: sc.label, set: (src) => (sc.image = src) })
  return out
}

async function main() {
  const set = JSON.parse(fs.readFileSync(FILE, "utf8")) as MtSet
  const lock: Lock = fs.existsSync(LOCK) ? JSON.parse(fs.readFileSync(LOCK, "utf8")) : {}
  fs.mkdirSync(OUT, { recursive: true })
  for (const b of set.blocks) {
    for (const t of targets(b)) {
      const ph = b.photos?.[t.n]?.[t.key]
      if (!ph) continue
      const slot = `${b.id}/${t.n}/${t.key}`
      const name = `${b.id}-${t.n}-${t.key}.webp`
      const file = path.join(OUT, name)
      let entry = lock[slot]
      const redo = NEXT === slot
      if (entry && entry.query === ph.query && !redo && fs.existsSync(file) && entry.fitted) {
        t.set(`${DIR}/${name}`)
        continue
      }
      const skipped = entry && entry.query === ph.query ? [...entry.skipped, ...(redo ? [entry.pexelsId] : [])] : []
      const taken = new Set(Object.entries(lock).filter(([k]) => k !== slot).map(([, v]) => v.pexelsId))
      const found = (await search(ph.query)).filter((p) => !taken.has(p.id) && !skipped.includes(p.id))
      let ok = false
      for (const pick of found.slice(0, 6)) {
        const raw = `${file}.jpg`
        fs.writeFileSync(raw, Buffer.from(await (await fetch(pick.src.large)).arrayBuffer()))
        execFileSync("ffmpeg", ["-hide_banner", "-loglevel", "error", "-y", "-i", raw, "-vf", "scale=800:800:force_original_aspect_ratio=increase,crop=800:800", "-c:v", "libwebp", "-quality", "72", file])
        fs.rmSync(raw)
        const o = await ask(Fit, `Bildoption "${t.key}" zur Aufgabe: soll klar zeigen: "${t.label}" (gesucht war: "${ph.query}"; geplante Beschreibung: "${ph.alt}").
fits: Erkennt man die Option auf dem Foto eindeutig, so dass man es nicht mit den anderen Optionen verwechselt? Nur das zählt: Farbe, Ort, Anzahl der Personen und andere Details der geplanten Beschreibung sind egal, wenn die Option klar zu sehen ist.
alt: deutscher Alternativtext, ein kurzer Satz, nur was zu sehen ist.`, { data: fs.readFileSync(file).toString("base64"), mediaType: "image/webp" })
        if (!o.fits) {
          console.log(`  ✗ ${slot}: ${pick.url} — ${o.reason}`)
          skipped.push(pick.id)
          continue
        }
        b.photos![t.n][t.key] = { ...ph, alt: o.alt, src: `${DIR}/${name}`, credit: { name: pick.photographer, url: pick.url, pexelsId: pick.id } }
        entry = lock[slot] = { pexelsId: pick.id, query: ph.query, skipped, fitted: true }
        t.set(`${DIR}/${name}`)
        console.log(`✓ ${slot}: ${pick.url} (${Math.round(fs.statSync(file).size / 1024)} KB)`)
        ok = true
        break
      }
      if (!ok) console.log(`! ${slot}: no fitting photo for "${ph.query}"; change the query in the draft and re-run`)
    }
  }
  fs.writeFileSync(FILE, JSON.stringify(set, null, 2) + "\n")
  // Another run (a batch for another exam) may have written the lock meanwhile: merge, ours win for our slots.
  const now = fs.existsSync(LOCK) ? (JSON.parse(fs.readFileSync(LOCK, "utf8")) as Lock) : {}
  const merged = { ...now, ...Object.fromEntries(Object.entries(lock).filter(([k]) => k.startsWith(`${EXAM}-${SKILL}-${NN}`))) }
  fs.writeFileSync(LOCK, JSON.stringify(Object.fromEntries(Object.entries(merged).sort()), null, 2) + "\n")
}

main().catch((e) => {
  console.error(e instanceof Error ? e.message : e)
  process.exit(1)
})
