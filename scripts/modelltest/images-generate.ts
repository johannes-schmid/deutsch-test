// Photorealistic images for the picture slots no stock photo fit (images-options.ts left them without `src`). One image
// per slot on the OpenAI Image API, checked by Claude with the same fit question as the Pexels photos plus a realism
// check; a miss is redrawn with the reason (3 tries). Writes the 800 px WebP, the option image and `generated` on the
// photo. Every attempt stays in .unit-cache/generated/ for review. Seed the changed sets afterwards.
//
// IMAGE_MODEL=gpt-image-2.5-flare [IMAGE_QUALITY=medium] npx tsx --env-file=.env.local scripts/modelltest/images-generate.ts [--slot <blockId>/<n>/<key>] [--dry]
// --slot replaces a slot that already has a Pexels photo; its lock entry is dropped.
// Also the Sprechen Teil 2 presentation photos (speaking.photos du/partner, B1: slide 1 of each topic), landscape at
// 1200 px. A set that shares its topics with an earlier one (ÖSD B1 = Goethe B1) reuses that image.

import { execFileSync } from "node:child_process"
import fs from "node:fs"
import path from "node:path"
import { z } from "zod"
import type { MtBlock, MtPhoto, MtSet } from "@/lib/modelltest/types"
import { makeAsk } from "../lib/drafting"

const KEY = process.env.OPENAI_API_KEY ?? process.env.OPEN_AI_API_KEY
const MODEL = process.env.IMAGE_MODEL
const DRY = process.argv.includes("--dry")
if (!DRY && (!KEY || !MODEL)) throw new Error("OPEN_AI_API_KEY and IMAGE_MODEL are required")
const ONLY = process.argv.includes("--slot") ? process.argv[process.argv.indexOf("--slot") + 1] : undefined
const DATA = "data/modelltest"
const RAW = ".unit-cache/generated"
const LOCK = `${DATA}/photos.lock.json`
const TRIES = 2
const QUALITY = process.env.IMAGE_QUALITY ?? "medium"

const ask = makeAsk("Du prüfst Bilder für Bildaufgaben in einer Deutschprüfung (Niveau A1/A2). Antworte knapp und ehrlich.", process.env.PHOTO_MODEL)
const Fit = z.object({ fits: z.boolean(), real: z.boolean(), reason: z.string(), alt: z.string() })

function targets(b: MtBlock) {
  const out: { n: number; key: string; label: string; set: (src: string) => void }[] = []
  for (const it of b.display.items) {
    if (it.type === "picture") for (const o of it.item.options) out.push({ n: it.item.n, key: o.key, label: o.label, set: (src) => (o.image = src) })
    if (it.type === "match") for (const a of it.data.ads) out.push({ n: 0, key: a.key, label: a.text || a.title, set: (src) => (a.image = src) })
  }
  for (const sc of b.display.speaking?.data.scenes ?? []) out.push({ n: 0, key: sc.key, label: sc.label, set: (src) => (sc.image = src) })
  return out
}

function prompt(exam: string, skill: string, label: string, plan: string, others: string[], fix?: string) {
  const country = exam.startsWith("oesd") ? "Austria" : "Germany"
  return [
    `A photorealistic, unposed documentary photograph of an everyday scene in ${country}, the kind printed as a picture option in a language exam.`,
    `Scene: ${label}. ${plan}`,
    skill === "sprechen" ? "The people are clearly visible: faces, what they wear, what they do. Ordinary people of different ages and backgrounds, not models." : "The place and the key object are obvious at first glance.",
    `It must be clearly different from these other pictures in the same task: ${others.join(" | ")}.`,
    "Square frame with the main subject in the centre. Natural available light, eye-level 35 mm look, real textures, slight everyday clutter. No readable text, signs, labels, logos or brand names anywhere. Not glossy, no studio light, no illustration, no film-look filter.",
    fix ? `A previous attempt was rejected: ${fix}. Fix that.` : "",
  ].filter(Boolean).join("\n")
}

function slidePrompt(exam: string, topic: string, quote: string, plan: string, fix?: string) {
  const country = exam.startsWith("oesd") ? "Austria" : "Germany"
  return [
    `A photorealistic, unposed documentary photograph of an everyday scene in ${country}, used as the picture on the title slide of a short presentation in a language exam.`,
    `Topic: ${topic}${quote ? ` (quote on the slide: ${quote})` : ""}. Picture: ${plan}`,
    "The topic is obvious at a glance, and the picture takes no side in the pro/contra question. Ordinary people and places, not models, not an ad.",
    "Landscape frame, main subject in the centre. Natural available light, eye-level 35 mm look, real textures. No readable text, signs, labels, logos or brand names anywhere. Not glossy, no studio light, no illustration, no film-look filter.",
    fix ? `A previous attempt was rejected: ${fix}. Fix that.` : "",
  ].filter(Boolean).join("\n")
}

async function generate(p: string, size = "1024x1024") {
  const res = await fetch("https://api.openai.com/v1/images/generations", {
    method: "POST",
    headers: { Authorization: `Bearer ${KEY}`, "content-type": "application/json" },
    body: JSON.stringify({ model: MODEL, prompt: p, size, quality: QUALITY, output_format: "jpeg", n: 1 }),
  })
  const j = (await res.json()) as { data?: { b64_json: string }[]; usage?: { output_tokens?: number }; error?: { message: string } }
  if (!res.ok || !j.data?.[0]) throw new Error(`OpenAI ${res.status}: ${j.error?.message ?? "no image"}`)
  if (j.usage?.output_tokens) console.log(`    image out=${j.usage.output_tokens} ~$${((j.usage.output_tokens * 30) / 1e6).toFixed(3)}`)
  return Buffer.from(j.data[0].b64_json, "base64")
}

const shared = new Map<string, MtPhoto>()

async function main() {
  fs.mkdirSync(RAW, { recursive: true })
  for (const exam of fs.readdirSync(DATA).filter((d) => fs.statSync(`${DATA}/${d}`).isDirectory()).sort()) {
    for (const f of fs.readdirSync(`${DATA}/${exam}`).filter((f) => f.endsWith(".json")).sort()) {
      const file = `${DATA}/${exam}/${f}`
      const set = JSON.parse(fs.readFileSync(file, "utf8")) as MtSet
      if (!Array.isArray(set.blocks)) continue
      const dir = `${exam}/${f.replace(".json", "")}`
      let changed = false
      for (const b of set.blocks) {
        const ts = targets(b)
        for (const t of ts) {
          const ph = b.photos?.[t.n]?.[t.key]
          const slot = `${b.id}/${t.n}/${t.key}`
          if (!ph || ph.draw || ph.generated || (ONLY ? ONLY !== slot : ph.src)) continue
          const others = ts.filter((o) => o.n === t.n && o.key !== t.key).map((o) => `${o.key}: ${o.label}`)
          let fix: string | undefined
          for (let i = 1; i <= TRIES; i++) {
            const p = prompt(exam, b.skill, t.label, ph.alt, others, fix)
            if (DRY) { console.log(`— ${slot}\n${p}\n`); break }
            const raw = path.join(RAW, `${slot.replace(/\//g, "_")}-${i}.jpg`)
            fs.writeFileSync(raw, await generate(p))
            const name = `${b.id}-${t.n}-${t.key}.webp`
            const out = path.join(".unit-cache/images", dir, name)
            fs.mkdirSync(path.dirname(out), { recursive: true })
            execFileSync("ffmpeg", ["-hide_banner", "-loglevel", "error", "-y", "-i", raw, "-vf", "scale=800:800", "-c:v", "libwebp", "-quality", "72", out])
            const o = await ask(Fit, `Bild "${t.key}" soll klar zeigen: "${t.label}" (geplante Beschreibung: "${ph.alt}"). Die anderen Bilder derselben Aufgabe zeigen: ${others.join("; ")}.
fits: Erkennt man die Situation (Ort und wichtigster Gegenstand) eindeutig, so dass man das Bild keiner der anderen Optionen zuordnen würde?${b.skill === "sprechen" ? " Die Personen müssen gut zu sehen sein." : ""} Nein, wenn Text im Bild die Lösung verrät.
real: Geht es als normales Foto durch? Nein nur bei auffälligen Fehlern, die ein Prüfling sofort sieht: verformte Hände oder Gesichter, kaputte Gegenstände, Kauderwelsch-Text. Kleine Unschärfen oder Unvollkommenheiten sind in Ordnung.
alt: deutscher Alternativtext, ein kurzer Satz, nur was zu sehen ist.`, { data: fs.readFileSync(out).toString("base64"), mediaType: "image/webp" })
            if (!o.fits || !o.real) {
              console.log(`  ✗ ${slot} (${i}/${TRIES}): ${o.reason}`)
              fix = o.reason
              fs.rmSync(out)
              continue
            }
            b.photos![t.n][t.key] = { query: ph.query, alt: o.alt, src: `${dir}/${name}`, generated: { model: MODEL!, prompt: p } }
            t.set(`${dir}/${name}`)
            changed = true
            const lock = JSON.parse(fs.readFileSync(LOCK, "utf8")) as Record<string, unknown>
            if (lock[slot]) {
              delete lock[slot]
              fs.writeFileSync(LOCK, JSON.stringify(lock, null, 2) + "\n")
            }
            console.log(`✓ ${slot} (${i}/${TRIES}): ${o.alt}`)
            break
          }
          if (!DRY && !b.photos![t.n][t.key].generated) console.log(`! ${slot}: no image passed after ${TRIES} tries; see ${RAW}`)
        }
        const sp = b.display.speaking
        for (const role of ["du", "partner"] as const) {
          const ph = sp?.photos?.[role]
          const slot = `${b.id}/${role}`
          const sameAs = ph && `${ph.query}|${sp!.data.cards?.[role === "du" ? 0 : 1]?.label}`
          if (!ph || ph.draw || ph.generated || (ONLY ? ONLY !== slot : ph.src)) {
            if (ph?.generated) shared.set(sameAs!, ph)
            continue
          }
          const reuse = shared.get(sameAs!)
          if (reuse && !ONLY) {
            sp!.photos![role] = reuse
            changed = true
            console.log(`= ${slot}: reuses ${reuse.src}`)
            continue
          }
          const card = sp!.data.cards?.[role === "du" ? 0 : 1]
          const topic = card?.label ?? ""
          const quote = role === "du" ? (sp!.data.points?.[0]?.match(/^„([^“]+)“/)?.[1] ?? "") : ""
          let fix: string | undefined
          for (let i = 1; i <= TRIES; i++) {
            const p = slidePrompt(exam, topic, quote, ph.alt, fix)
            if (DRY) { console.log(`— ${slot}\n${p}\n`); break }
            const raw = path.join(RAW, `${slot.replace(/\//g, "_")}-${i}.jpg`)
            fs.writeFileSync(raw, await generate(p, "1536x1024"))
            const name = `${b.id}-photo-${role}.webp`
            const out = path.join(".unit-cache/images", dir, name)
            fs.mkdirSync(path.dirname(out), { recursive: true })
            execFileSync("ffmpeg", ["-hide_banner", "-loglevel", "error", "-y", "-i", raw, "-vf", "scale=1200:-2", "-c:v", "libwebp", "-quality", "72", out])
            const o = await ask(Fit, `Bild auf der ersten Folie einer kurzen Präsentation zum Thema "${topic}" (geplant: "${ph.alt}").
fits: Passt das Bild auf einen Blick zum Thema, ohne eine Seite der Pro/Contra-Frage zu nehmen? Nein, wenn es vor allem etwas anderes zeigt oder lesbarer Text darin steht.
real: Geht es als normales Foto durch? Nein nur bei auffälligen Fehlern, die ein Prüfling sofort sieht: verformte Hände oder Gesichter, kaputte Gegenstände, Kauderwelsch-Text. Kleine Unvollkommenheiten sind in Ordnung.
alt: deutscher Alternativtext, ein kurzer Satz, nur was zu sehen ist.`, { data: fs.readFileSync(out).toString("base64"), mediaType: "image/webp" })
            if (!o.fits || !o.real) {
              console.log(`  ✗ ${slot} (${i}/${TRIES}): ${o.reason}`)
              fix = o.reason
              fs.rmSync(out)
              continue
            }
            sp!.photos![role] = { query: ph.query, alt: o.alt, src: `${dir}/${name}`, generated: { model: MODEL!, prompt: p } }
            shared.set(sameAs!, sp!.photos![role])
            changed = true
            console.log(`✓ ${slot} (${i}/${TRIES}): ${o.alt}`)
            break
          }
          if (!DRY && !sp!.photos![role].generated) console.log(`! ${slot}: no image passed after ${TRIES} tries; see ${RAW}`)
        }
      }
      if (changed) fs.writeFileSync(file, JSON.stringify(set, null, 2) + "\n")
    }
  }
}

main().catch((e) => {
  console.error(e instanceof Error ? e.message : e)
  process.exit(1)
})
