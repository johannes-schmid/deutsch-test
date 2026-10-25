// Picture options no stock photo can show (a clock at a given time, which kind of ticket): drawn as SVG → 800 px WebP.
// A slot opts in with `draw` in block.photos ("clock 8:00", "ticket Tageskarte"); images-options.ts leaves it alone.
//
// npx tsx scripts/modelltest/draw-options.ts --exam goethe-a2 --skill hoeren --set 2

import fs from "node:fs"
import path from "node:path"
import sharp from "sharp"
import type { MtSet } from "@/lib/modelltest/types"

const arg = (name: string) => {
  const i = process.argv.indexOf(`--${name}`)
  return i > -1 ? process.argv[i + 1] : undefined
}
const EXAM = arg("exam") ?? "goethe-a2"
const SKILL = arg("skill") ?? "hoeren"
const NN = String(Number(arg("set"))).padStart(2, "0")
const FILE = `data/modelltest/${EXAM}/${SKILL}-${NN}.json`
const DIR = `${EXAM}/${SKILL}-${NN}`
const OUT = `.unit-cache/images/${DIR}`
const FONT = `font-family="Helvetica, Arial, sans-serif"`

const wall = `<defs><radialGradient id="bg" cx="50%" cy="40%" r="75%"><stop offset="0" stop-color="#f1ede6"/><stop offset="1" stop-color="#d9d3c8"/></radialGradient></defs>
<rect width="800" height="800" fill="url(#bg)"/>`

function clock(spec: string) {
  const m = /^(\d{1,2}):(\d{2})$/.exec(spec)
  if (!m) throw new Error(`clock "${spec}": expected h:mm`)
  const hour = Number(m[1])
  const minute = Number(m[2])
  const c = 400
  const at = (deg: number, r: number) => [c + r * Math.sin((deg * Math.PI) / 180), c - r * Math.cos((deg * Math.PI) / 180)]
  const ticks = Array.from({ length: 60 }, (_, i) => {
    const [x1, y1] = at(i * 6, i % 5 ? 268 : 250)
    const [x2, y2] = at(i * 6, 282)
    return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#222" stroke-width="${i % 5 ? 3 : 9}" stroke-linecap="round"/>`
  }).join("")
  const numerals = Array.from({ length: 12 }, (_, i) => {
    const [x, y] = at((i + 1) * 30, 208)
    return `<text x="${x}" y="${y + 18}" ${FONT} font-size="52" font-weight="600" fill="#222" text-anchor="middle">${i + 1}</text>`
  }).join("")
  const hand = (deg: number, len: number, width: number) => {
    const [x, y] = at(deg, len)
    const [bx, by] = at(deg + 180, 34)
    return `<line x1="${bx}" y1="${by}" x2="${x}" y2="${y}" stroke="#1c1c1c" stroke-width="${width}" stroke-linecap="round"/>`
  }
  return `${wall}
<circle cx="${c + 10}" cy="${c + 16}" r="322" fill="#000" opacity="0.12"/>
<circle cx="${c}" cy="${c}" r="322" fill="#2b2b2b"/>
<circle cx="${c}" cy="${c}" r="296" fill="#fbfaf7"/>
${ticks}${numerals}
${hand((hour % 12) * 30 + minute / 2, 150, 20)}
${hand(minute * 6, 250, 7)}
<circle cx="${c}" cy="${c}" r="18" fill="#b3261e"/>`
}

// What each ticket says under its title; the title itself is the option the candidate hears.
const TICKETS: Record<string, { valid: string; color: string }> = {
  Einzelfahrschein: { valid: "1 Fahrt · 90 Minuten", color: "#c0392b" },
  Tageskarte: { valid: "1 Tag · bis 3 Uhr früh", color: "#1f6f8b" },
  Wochenkarte: { valid: "7 Tage · Mo bis So", color: "#2e7d4f" },
}

function ticket(title: string) {
  const t = TICKETS[title]
  if (!t) throw new Error(`ticket "${title}": add it to TICKETS`)
  const bars = Array.from({ length: 34 }, (_, i) => `<rect x="${470 + i * 6}" y="512" width="${[2, 3, 1, 4][(i * 7) % 4]}" height="58" fill="#222"/>`).join("")
  return `${wall}
<g transform="rotate(-6 400 400)">
<rect x="128" y="236" width="560" height="356" rx="18" fill="#000" opacity="0.14"/>
<rect x="112" y="216" width="576" height="368" rx="18" fill="#fdfcf8"/>
<rect x="112" y="216" width="576" height="84" rx="18" fill="${t.color}"/>
<rect x="112" y="282" width="576" height="18" fill="${t.color}"/>
<text x="148" y="272" ${FONT} font-size="34" font-weight="700" fill="#fff" letter-spacing="2">FAHRKARTE</text>
<text x="652" y="272" ${FONT} font-size="30" font-weight="600" fill="#fff" text-anchor="end">Bus · Bahn</text>
<text x="148" y="378" ${FONT} font-size="62" font-weight="700" fill="#1c1c1c">${title}</text>
<text x="148" y="436" ${FONT} font-size="34" fill="#444">${t.valid}</text>
<text x="148" y="500" ${FONT} font-size="28" fill="#666">Erwachsene · Zone A–B</text>
<line x1="148" y1="474" x2="652" y2="474" stroke="#ddd" stroke-width="2"/>
${bars}
</g>`
}

const DRAW: Record<string, (spec: string) => string> = { clock, ticket }

async function main() {
  const set = JSON.parse(fs.readFileSync(FILE, "utf8")) as MtSet
  fs.mkdirSync(OUT, { recursive: true })
  for (const b of set.blocks) {
    for (const [n, opts] of Object.entries(b.photos ?? {})) {
      for (const [key, ph] of Object.entries(opts)) {
        if (!ph.draw) continue
        const [kind, ...rest] = ph.draw.split(" ")
        if (!DRAW[kind]) throw new Error(`${b.id}/${n}/${key}: unknown drawing "${kind}"`)
        const name = `${b.id}-${n}-${key}.webp`
        const body = DRAW[kind](rest.join(" "))
        await sharp(Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="800" height="800" viewBox="0 0 800 800">${body}</svg>`)).webp({ quality: 80 }).toFile(path.join(OUT, name))
        opts[key] = { query: ph.query, alt: ph.alt, draw: ph.draw, src: `${DIR}/${name}` }
        const item = b.display.items.find((it) => it.type === "picture" && it.item.n === Number(n))
        const option = item?.type === "picture" ? item.item.options.find((o) => o.key === key) : undefined
        if (!option) throw new Error(`${b.id}/${n}/${key}: no picture option`)
        option.image = `${DIR}/${name}`
        console.log(`✓ ${b.id}/${n}/${key}: ${ph.draw}`)
      }
    }
  }
  fs.writeFileSync(FILE, JSON.stringify(set, null, 2) + "\n")
}

main().catch((e) => {
  console.error(e instanceof Error ? e.message : e)
  process.exit(1)
})
