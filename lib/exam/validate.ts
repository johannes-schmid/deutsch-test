import voices from "@/data/tts-voices.json"
import { kurztestItems, openParts, partSpec } from "./blueprint"
import { pictoIcon } from "./pictos"
import { itemNumbers, type KurztestBlock } from "./kurztest"

const words = (s: string) => s.split(/\s+/).filter(Boolean).length
const range = (n: number, min: number, max: number, what: string) => (n < min || n > max ? [`${what} is ${n}, blueprint ${min}–${max}`] : [])

function validateCast(b: KurztestBlock, pairs: [string, string][]): string[] {
  const out: string[] = []
  const cast = new Map<string, string>()
  for (const [speaker, voice] of pairs) {
    if (!(voice in voices)) out.push(`voice "${voice}" is not in data/tts-voices.json`)
    if (cast.has(speaker) && cast.get(speaker) !== voice) out.push(`speaker ${speaker} switches voice`)
    cast.set(speaker, voice)
  }
  if (new Set(cast.values()).size !== cast.size) out.push("two speakers share one voice")
  return out
}

function validateOpen(b: KurztestBlock): string[] {
  const out: string[] = []
  if (b.skill === "schreiben") {
    const w = b.display.writing ?? []
    // DTZ: choose A or B, four points each. Start Deutsch 1: one task with three points.
    const tasks = b.exam === "start-deutsch-1" ? 1 : 2
    const points = b.exam === "start-deutsch-1" ? 3 : 4
    if (w.length !== tasks) out.push(`expected ${tasks} task(s), got ${w.length}`)
    if (!openParts(b.exam).some((p) => p.skill === "schreiben" && p.teil === b.teil)) out.push(`no Schreiben spec for Teil ${b.teil}`)
    for (const t of w) {
      if (t.points.length !== points) out.push(`task ${t.key}: ${t.points.length} points, expected ${points}`)
      const model = b.key.writing?.find((m) => m.key === t.key)
      if (!model) out.push(`task ${t.key}: no model answer`)
    }
    return out
  }
  const sp = b.display.speaking
  if (!sp) return ["speaking data missing"]
  const v = b.key.speaking!.voices
  out.push(...validateCast(b, [["pruefer", v.pruefer], ["partner", v.partner]]))
  const mine = sp.turns.filter((t) => t.who === "du").length
  if (!mine) out.push("no turn for the candidate")
  if (mine !== b.key.speaking!.sampleAnswers.length) out.push("sample answers do not match the candidate turns")
  // DTZ: a pair exam in every Teil, with a picture in Teil 2. Start Deutsch 1 Teil 1 is examiner-only (research §5).
  const dtz = !b.exam || b.exam === "dtz"
  if ((dtz || b.teil > 1) && !sp.turns.some((t) => t.who === "partner")) out.push("no partner turn: Sprechen is a pair exam")
  if (dtz && b.teil === 2 && !b.key.speaking!.pictureBrief) out.push("Teil 2 needs a picture brief")
  if (sp.turns.some((t) => t.who !== "du" && !t.src)) out.push("no audio rendered yet (run scripts/tts-kurztest.ts)")
  return out
}

/** Deviations from the blueprint. An empty list means the block matches. */
export function validateBlock(b: KurztestBlock): string[] {
  if (b.skill === "schreiben" || b.skill === "sprechen") return validateOpen(b)
  const spec = partSpec(b.skill, b.teil, b.exam)
  const out: string[] = []
  const { items } = b.display
  const ns = itemNumbers(items)
  const want = kurztestItems(b.skill, b.teil, b.exam) ?? spec.sample ?? spec.itemsPerBlock
  const keys = "abcdefgh".slice(0, spec.options ?? 3)
  if (ns.length !== want) out.push(`expected ${want} items, got ${ns.length}`)

  const types = items.map((i) => i.type).join("+")
  const expected = { abc: Array(spec.answer === "abc" ? want : 1).fill("choice").join("+"), pic: Array(want).fill("picture").join("+"), "rf+abc": "rf+choice", rf: Array(want).fill("rf").join("+"), match: "match", gap: "gap" }[spec.answer]
  if (types !== expected) out.push(`answer format ${types}, blueprint wants ${expected}`)

  for (const n of ns) {
    const key = b.key.answers.find((a) => a.n === n)
    if (!key) { out.push(`item ${n}: no key`); continue }
    if (key.evidence && !key.evidence.text.includes(key.evidence.hit)) out.push(`item ${n}: evidence hit not found in its text`)
  }
  for (const it of items) {
    const keyOf = (n: number) => b.key.answers.find((a) => a.n === n)?.correct
    if (it.type === "choice") {
      if (it.item.options.map((o) => o.key).join("") !== keys) out.push(`item ${it.item.n}: options must be ${keys.split("").join(", ")}`)
      if (!keys.includes(keyOf(it.item.n) || "?")) out.push(`item ${it.item.n}: correct is not one of ${keys}`)
      if (spec.noText) for (const o of it.item.options) out.push(...range(words(o.label), spec.length.min, spec.length.max, `item ${it.item.n} option ${o.key} word count`))
    }
    if (it.type === "picture") {
      if (it.item.options.map((o) => o.key).join("") !== keys) out.push(`item ${it.item.n}: options must be ${keys.split("").join(", ")}`)
      if (!keys.includes(keyOf(it.item.n) || "?")) out.push(`item ${it.item.n}: correct is not one of ${keys}`)
      for (const o of it.item.options) if (!pictoIcon(o.picto)) out.push(`item ${it.item.n} option ${o.key}: unknown picto "${o.picto}"`)
    }
    if (it.type === "rf" && !["richtig", "falsch"].includes(keyOf(it.item.n) ?? "")) out.push(`item ${it.item.n}: correct is not richtig/falsch`)
    if (it.type === "match") {
      const allowed = [...it.data.ads.map((a) => a.key), ...(it.noMatch ? ["x"] : [])]
      for (const s of it.data.situations) if (!allowed.includes(keyOf(s.n) ?? "")) out.push(`item ${s.n}: correct "${keyOf(s.n)}" is not an option`)
      const used = it.data.situations.map((s) => keyOf(s.n)).filter((k) => k !== "x")
      if (!spec.headings && new Set(used).size !== used.length) out.push("two situations share one answer")
      if (!!it.noMatch !== !!(spec.noMatch ?? b.skill === "lesen")) out.push(`"x" option ${it.noMatch ? "shown" : "missing"}, blueprint says ${spec.noMatch ? "yes" : "no"}`)
      if (b.exam && spec.noMatch && !used.length) out.push("no situation has a match")
      if (b.exam && spec.noMatch && it.data.situations.length - used.length !== 1) out.push(`${it.data.situations.length - used.length} situations without a match, expected 1`)
      if (spec.ads && it.data.ads.length !== spec.ads) out.push(`${it.data.ads.length} options, blueprint ${spec.ads}`)
      if (spec.headings) for (const s of it.data.situations) out.push(...range(words(s.text), spec.length.min, spec.length.max, `text ${s.n} word count`))
      else if (b.exam) out.push(...range(words(it.data.ads.map((a) => `${a.title} ${a.text}`).join(" ")), spec.length.min, spec.length.max, "ads word count"))
      else if (!it.noMatch && it.data.ads.length !== 6) out.push(`${it.data.ads.length} statements, blueprint 6`)
      else if (it.noMatch) out.push(...range(words(it.data.ads.map((a) => `${a.title} ${a.text}`).join(" ")), Math.round((spec.length.min * it.data.ads.length) / 8), Math.round((spec.length.max * it.data.ads.length) / 8), "ads word count"))
    }
    if (it.type === "gap") {
      for (const p of it.data.parts) if (typeof p !== "string" && !p.options.includes(keyOf(p.n) ?? "")) out.push(`gap ${p.n}: correct is not one of its options`)
      const text = it.data.parts.map((p) => (typeof p === "string" ? p : keyOf(p.n) ?? "")).join("")
      out.push(...range(words(text), spec.length.min, spec.length.max, "letter word count"))
    }
  }

  if (spec.length.unit === "words") {
    const r = b.display.reading
    if (r) out.push(...range(words(r.paragraphs.join(" ")), spec.length.min, spec.length.max, "text word count"))
    else if (!["match", "gap"].includes(spec.answer) && !spec.noText) out.push("reading text missing")
  } else {
    const script = b.key.script ?? []
    if (!script.length) out.push("audio script missing")
    const speakers = new Set(script.map((t) => t.speaker))
    if (spec.voices) out.push(...range(speakers.size, spec.voices.min, spec.voices.max, "speaker count"))
    out.push(...validateCast(b, script.map((t) => [t.speaker, t.voice])))
    const clip = b.display.clip
    if (clip?.src) out.push(...range(+clip.duration.toFixed(1), spec.length.min - 3, spec.length.max + 5, "clip seconds"))
    else out.push("no audio rendered yet (run scripts/tts-kurztest.ts)")
    if (clip && spec.plays && clip.plays !== spec.plays) out.push(`plays ${clip.plays}, blueprint ${spec.plays}`)
  }
  return out
}
