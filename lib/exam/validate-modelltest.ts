import voices from "@/data/tts-voices.json"
import type { MtBlock } from "@/lib/modelltest/types"
import type { ExamId } from "@/lib/exams"
import { partSpec } from "./blueprint"
import { itemNumbers } from "./kurztest"
import type { PartId } from "./types"

const words = (s: string) => s.split(/\s+/).filter(Boolean).length
const range = (n: number, min: number, max: number, what: string) => (n < min || n > max ? [`${what} is ${n}, blueprint ${min}–${max}`] : [])

/** Hören Teile whose Beispiel has its own clip, so the Teil carries one extra block. */
const OWN_EXAMPLE_BLOCK = new Set(["dtz-hoeren-1", "dtz-hoeren-3"])

/** Spoken words per clip, from the official clip length and speaking rate (research/dtz-blueprint.md §2.1). */
const spokenWords = (sec: { min: number; max: number }, pace: { min: number; max: number }) => ({
  min: Math.round((sec.min * pace.min) / 60),
  max: Math.round((sec.max * pace.max) / 60),
})

/** Deviations of one Teil of a Modelltest from the official format (`full`). Empty means it matches. */
export function validateTeil(exam: ExamId, skill: PartId, teil: number, blocks: MtBlock[]): string[] {
  const spec = partSpec(skill, teil, exam)
  const full = spec.full
  if (!full) return [`${skill} Teil ${teil}: no official format (full) in the blueprint`]
  const out: string[] = []
  const ownExample = full.example && OWN_EXAMPLE_BLOCK.has(`${exam}-${skill}-${teil}`)
  const scored = blocks.filter((b) => !b.example)
  if (scored.length !== full.blocks) out.push(`${scored.length} blocks, blueprint ${full.blocks}`)
  if (ownExample && blocks.filter((b) => b.example).length !== 1) out.push("Beispiel block missing")

  const ns = scored.flatMap((b) => itemNumbers(b.display.items)).filter((n) => n > 0)
  const want = Array.from({ length: full.items }, (_, i) => full.first + i)
  if (ns.join() !== want.join()) out.push(`item numbers ${ns.join(",")}, blueprint ${want.join(",")}`)
  const examples = blocks.flatMap((b) => itemNumbers(b.display.items)).filter((n) => n === 0).length
  if (full.example && !examples) out.push("Beispiel missing")
  if (!full.example && examples) out.push("Beispiel item present, blueprint has none")

  for (const b of blocks) {
    const keyOf = (n: number) => b.key.answers.find((a) => a.n === n)?.correct
    const exampleItems = itemNumbers(b.display.items).filter((n) => n === 0).length
    if ((b.exampleAnswers?.length ?? 0) !== exampleItems) out.push(`${exampleItems} Beispiel items but ${b.exampleAnswers?.length ?? 0} Beispiel answers`)
    if (b.key.answers.some((a) => a.n === 0)) out.push("Beispiel answer in the scoring key")
    for (const n of itemNumbers(b.display.items).filter((n) => n > 0)) {
      const key = b.key.answers.find((a) => a.n === n)
      if (!key) out.push(`item ${n}: no key`)
      else if (key.evidence && !key.evidence.text.includes(key.evidence.hit)) out.push(`item ${n}: evidence not found in its text`)
    }
    for (const it of b.display.items) {
      if (it.type === "choice") {
        if (it.item.options.map((o) => o.key).join("") !== "abc") out.push(`item ${it.item.n}: options must be a, b, c`)
        if (it.item.n > 0 && !"abc".includes(keyOf(it.item.n) || "?")) out.push(`item ${it.item.n}: correct is not a, b or c`)
        if (full.fixedLast && !/^andere[sr]? /i.test(it.item.options[2]?.label ?? "")) out.push(`item ${it.item.n}: option c must be "anderes …" (${full.fixedLast})`)
      }
      if (it.type === "rf" && it.item.n > 0 && !["richtig", "falsch"].includes(keyOf(it.item.n) ?? "")) out.push(`item ${it.item.n}: correct is not richtig/falsch`)
      if (it.type === "match") {
        if (full.options && it.data.ads.length !== full.options) out.push(`${it.data.ads.length} options, blueprint ${full.options}`)
        const allowed = [...it.data.ads.map((a) => a.key), ...(it.noMatch ? ["x"] : [])]
        const ex = [...(b.exampleAnswers ?? [])]
        const used = it.data.situations.map((s) => (s.n === 0 ? ex.shift() : keyOf(s.n)))
        for (const [i, s] of it.data.situations.entries()) if (!allowed.includes(used[i] ?? "")) out.push(`item ${s.n}: "${used[i]}" is not an option`)
        const real = used.filter((k) => k !== "x")
        if (new Set(real).size !== real.length) out.push("two items share one answer")
        const xs = used.filter((k) => k === "x").length
        // DTZ Lesen Teil 2: exactly one x. telc B1 Lesen Teil 3: 2 in Übungstest 1; the count is not fixed officially.
        const [xMin, xMax] = exam === "dtz" ? [1, 1] : it.noMatch ? [1, 3] : [0, 0]
        if (skill === "lesen" && (xs < xMin || xs > xMax)) out.push(`${xs} situations without a match, blueprint ${xMin === xMax ? xMin : `${xMin}–${xMax}`}`)
        // Headline matching (telc Lesen Teil 1): the texts are the situations, the headlines carry no text.
        const headlines = it.data.ads.every((a) => !a.text)
        if (skill === "lesen" && headlines) for (const s of it.data.situations) out.push(...range(words(s.text), full.length.min, full.length.max, `text ${s.n} word count`))
        else if (skill === "lesen") out.push(...range(words(it.data.ads.map((a) => `${a.title} ${a.text}`).join(" ")), full.length.min, full.length.max, "ads word count"))
      }
      if (it.type === "gap") {
        const answerOf = (n: number) => (n === 0 ? b.exampleAnswers?.[0] : keyOf(n)) ?? ""
        for (const p of it.data.parts) if (typeof p !== "string" && !p.options.includes(answerOf(p.n))) out.push(`gap ${p.n}: correct is not one of its options`)
        // Word pool (telc Sprachbausteine Teil 2): every gap offers the same pool, each word fits once.
        if (full.options) {
          const gaps = it.data.parts.filter((p) => typeof p !== "string")
          if (gaps.some((g) => g.options.length !== full.options)) out.push(`word pool is not ${full.options} words`)
          const answers = gaps.map((g) => answerOf(g.n))
          if (new Set(answers).size !== answers.length) out.push("two gaps share one word of the pool")
        }
        const text = it.data.parts.map((p) => (typeof p === "string" ? p : answerOf(p.n))).join("")
        out.push(...range(words(text), full.length.min, full.length.max, "letter word count"))
      }
    }
    if (full.length.unit === "words" && b.display.reading) out.push(...range(words(b.display.reading.paragraphs.join(" ")), full.length.min, full.length.max, `${b.example ? "Beispiel " : ""}text word count`))
    if (full.length.unit === "seconds") {
      const script = b.key.script ?? []
      if (!script.length) out.push("audio script missing")
      const cast = new Map<string, string>()
      for (const t of script) {
        if (!(t.voice in voices)) out.push(`voice "${t.voice}" is not in data/tts-voices.json`)
        if (cast.has(t.speaker) && cast.get(t.speaker) !== t.voice) out.push(`speaker ${t.speaker} switches voice`)
        cast.set(t.speaker, t.voice)
      }
      if (new Set(cast.values()).size !== cast.size) out.push("two speakers share one voice")
      const w = spokenWords(full.length, full.pace ?? { min: 120, max: 160 })
      // Hören Teil 4: each statement is its own clip; the host intro is not counted.
      const clips = full.clipPerItem ? script.filter((t) => t.item !== undefined).map((t) => t.text) : [script.map((t) => t.text).join(" ")]
      for (const [i, c] of clips.entries()) out.push(...range(words(c), w.min, w.max, `${full.clipPerItem ? `statement ${i}` : b.example ? "Beispiel clip" : "clip"} words`))
      const clip = b.display.clip
      if (clip?.src && !full.clipPerItem) out.push(...range(+clip.duration.toFixed(1), full.length.min - 3, full.length.max + 5, "clip seconds"))
    }
  }

  // The right answer must not cluster on one letter (inburgering: 248 of 250 on "a"; set 1 Lesen Teil 5 never used "a").
  const letters = blocks.flatMap((b) => b.display.items.flatMap((it) => {
    const keyOf = (n: number) => b.key.answers.find((a) => a.n === n)?.correct
    if (it.type === "choice") return it.item.n > 0 ? [keyOf(it.item.n)] : []
    if (it.type === "gap") return it.data.parts.flatMap((p) => (typeof p !== "string" && p.n > 0 && p.options.length === 3 ? ["abc"[p.options.indexOf(String(keyOf(p.n)))]] : []))
    return []
  }))
  if (letters.length >= 4 && new Set(letters).size === 1) out.push(`every a/b/c answer is "${letters[0]}"`)
  else if (letters.length >= 5) for (const l of "abc") if (!letters.includes(l)) out.push(`no a/b/c answer is "${l}"; spread the right answers`)

  // Richtig/falsch roughly balanced, as in the official keys (U2 Hören Teil 3: 2 richtig, 2 falsch).
  const rf = blocks.flatMap((b) => b.display.items.flatMap((it) => (it.type === "rf" && it.item.n > 0 ? [b.key.answers.find((a) => a.n === it.item.n)?.correct] : [])))
  const richtig = rf.filter((c) => c === "richtig").length
  if (rf.length >= 4 && Math.abs(richtig - (rf.length - richtig)) > 1) out.push(`${richtig} richtig and ${rf.length - richtig} falsch; balance them`)
  // telc: no three identical answers in a row within a Teil (Hannes 2026-10-23: R R R F F read as "everything is right").
  if (exam !== "dtz" && rf.some((c, i) => i >= 2 && c === rf[i - 1] && c === rf[i - 2])) out.push(`richtig/falsch has three of the same in a row (${rf.map((c) => c?.[0]).join(" ")}); mix them`)

  // Matching: explanations name ads and sentences by content, never by letter. The letters are shuffled after drafting
  // (set 1 shipped four explanations pointing at the wrong ad).
  for (const b of blocks.filter((b) => b.display.items.some((it) => it.type === "match")))
    for (const a of b.key.answers) if (/\b(?:Anzeige|Satz|in|bei)\s+[a-h]\b(?![-\w])/.test(a.explanation ?? "")) out.push(`item ${a.n}: explanation names an ad or sentence by its letter; name it by its content`)

  if (exam === "dtz" && skill === "hoeren" && teil === 4)
    for (const it of blocks[0]?.display.items ?? []) if (it.type === "match") for (const ad of it.data.ads) if (/^(ich|mein\w*|wir|uns\w*)\b/i.test(ad.text)) out.push(`sentence ${ad.key} is first person; the sentences a–f are general opinions ("Man sollte …", "X ist …")`)
  if (exam === "dtz" && skill === "hoeren" && teil === 3 && !scored.some((b) => (b.key.script ?? []).some((t) => /\b(du|dich|dir)\b/i.test(t.text)))) out.push("no dialogue between friends or family (du); the official sets mix du and Sie conversations")
  return out
}

const SIE_ONLY = /\b(du|dich|dir|dein\w*)\b/i

/** Deviations of one Sprechen Teil from the pair-exam format (research/dtz-blueprint.md §5). */
export function validateSprechen(b: MtBlock | undefined): string[] {
  const sp = b?.display.speaking
  if (!b || !sp) return ["speaking block missing"]
  const out: string[] = []
  const turns = sp.turns
  const du = turns.filter((t) => t.who === "du")
  const want: Record<number, string[]> = { 1: ["1A", "1B"], 2: ["2A", "2B"], 3: ["3"] }
  for (const ph of want[b.teil]) for (const who of ["du", "partner"]) if (!turns.some((t) => t.phase === ph && t.who === who)) out.push(`no ${who} turn in ${ph}`)
  for (const [i, t] of turns.entries()) {
    if (!t.text.trim()) out.push(`turn ${i} (${t.who}) is empty`)
    if (t.who === "du" && !t.seconds) out.push(`turn ${i}: du turn without speaking time`)
    if (t.who === "pruefer" && SIE_ONLY.test(t.text)) out.push(`turn ${i}: the examiner says "du"; she says Sie to both`)
  }
  if ((b.key.speaking?.sampleAnswers.length ?? 0) !== du.length) out.push(`${du.length} du turns but ${b.key.speaking?.sampleAnswers.length ?? 0} sample answers`)
  if (b.key.speaking?.sampleAnswers.some((s) => !s.trim())) out.push("empty sample answer")
  const duText = (b.key.speaking?.sampleAnswers ?? []).join(" ")
  const othersText = [...turns.filter((t) => t.who === "partner").map((t) => t.text), b.key.live?.persona ?? ""].join(" ")
  for (const t of turns.filter((t) => t.who === "pruefer"))
    for (const [, name] of t.text.matchAll(/\b(?:Frau|Herr) ([A-ZÄÖÜ][\wäöüß-]+)/g))
      if (duText.includes(name) && !othersText.includes(name)) out.push(`the examiner calls the candidate "${name}"; the person practising has their own name`)
  if (b.key.speaking?.voices.pruefer !== "woman_ela" || b.key.speaking?.voices.partner !== "man_ben") out.push("voices must be woman_ela (examiner) and man_ben (partner)")
  const live = b.key.live
  const fu = live?.followups ?? []
  const partnerSays = (ph: string) => turns.filter((t) => t.who === "partner" && t.phase === ph).map((t) => t.text).join(" ")
  if (b.teil === 1) {
    if (sp.data.points.length !== 6) out.push(`${sp.data.points.length} keywords, blueprint 6`)
    if (fu.filter((f) => f.level === "B1").length < 3) out.push("fewer than 3 B1 follow-up questions")
    out.push(...range(words(partnerSays("1A")), 60, 110, "partner introduction words"))
    if (!live?.persona) out.push("partner persona missing")
  }
  if (b.teil === 2) {
    const ph = sp.photos
    if (!ph?.du.query || !ph?.partner.query) out.push("two photos (du, partner) required")
    else if (ph.du.query === ph.partner.query) out.push("both candidates have the same photo; the DTZ gives each a different one")
    if (fu.filter((f) => f.level === "B1").length < 3) out.push("fewer than 3 B1 follow-up questions")
    if (fu.filter((f) => f.level === "A2").length < 2) out.push("fewer than 2 A2 follow-up questions")
    out.push(...range(words(partnerSays("2A")), 50, 100, "partner photo description words"))
  }
  if (b.teil === 3) {
    if (sp.data.points.length !== 6 || sp.data.points.at(-1) !== "…?") out.push(`planning sheet has ${sp.data.points.length} points, blueprint 5 + "…?"`)
    if (!live?.persona) out.push("partner persona missing")
    if ((live?.partnerLines?.length ?? 0) < 6) out.push("fewer than 6 partner fallback lines (points 2–5, own idea, summary)")
  }
  for (const t of turns.filter((t) => t.live === "followup")) if (!fu.some((f) => f.text === t.text)) out.push(`follow-up "${t.text.slice(0, 30)}…" is not in the bank`)
  return out
}

/** telc B1 Sprechen (research/telc-b1.md §3e, §5): a pair exam; the partner talks in every Teil, the Interlokutor as little as possible. */
export function validateSprechenTelc(b: MtBlock | undefined): string[] {
  const sp = b?.display.speaking
  if (!b || !sp) return ["speaking block missing"]
  const out: string[] = []
  const turns = sp.turns
  for (const who of ["du", "partner", "pruefer"]) if (!turns.some((t) => t.who === who)) out.push(`no ${who} turn`)
  for (const [i, t] of turns.entries()) {
    if (!t.text.trim()) out.push(`turn ${i} (${t.who}) is empty`)
    if (t.who === "du" && !t.seconds) out.push(`turn ${i}: du turn without speaking time`)
    if (t.who === "pruefer" && SIE_ONLY.test(t.text)) out.push(`turn ${i}: the examiner says "du"; she says Sie to both`)
  }
  const du = turns.filter((t) => t.who === "du")
  if ((b.key.speaking?.sampleAnswers.length ?? 0) !== du.length) out.push(`${du.length} du turns but ${b.key.speaking?.sampleAnswers.length ?? 0} sample answers`)
  if (b.key.speaking?.sampleAnswers.some((s) => !s.trim())) out.push("empty sample answer")
  if (b.key.speaking?.voices.pruefer !== "woman_ela" || b.key.speaking?.voices.partner !== "man_ben") out.push("voices must be woman_ela (examiner) and man_ben (partner)")
  const examiner = turns.filter((t) => t.who === "pruefer").length
  if (examiner > Math.ceil(turns.length / 3)) out.push(`the examiner has ${examiner} of ${turns.length} turns; she speaks as little as possible`)
  const live = b.key.live
  if (!live?.persona) out.push("partner persona missing")
  const secs = du.reduce((n, t) => n + (t.seconds ?? 0), 0)
  const want: Record<number, [number, number]> = { 1: [60, 150], 2: [120, 270], 3: [120, 270] }
  out.push(...range(secs, ...want[b.teil], "du speaking seconds"))
  if (b.teil === 1 && sp.data.points.length < 6) out.push(`${sp.data.points.length} topics on the sheet, blueprint ~7`)
  if (b.teil === 2) {
    out.push(...range(words(sp.data.points[0] ?? ""), 35, 70, "your opinion sheet words"))
    if (!/Blatt von/.test(live?.persona ?? "")) out.push("the partner's opinion sheet is missing from the persona")
  }
  if (b.teil === 3 && sp.data.points.at(-1) !== "…") out.push(`planning sheet must end with "…"`)
  if (b.teil > 1 && (live?.partnerLines?.length ?? 0) < 4) out.push("fewer than 4 partner fallback lines")
  return out
}

/** Schreiben: Aufgabe A and B, 4 Leitpunkte each, no word count (research/dtz-blueprint.md §4). */
export function validateWriting(blocks: MtBlock[], exam: ExamId = "dtz") {
  const w = blocks[0]?.display.writing ?? []
  const out: string[] = []
  // telc B1: one email reply, no choice of tasks (research/telc-b1.md §3d).
  const tasks = exam === "dtz" ? 2 : 1
  if (w.length !== tasks) out.push(`${w.length} tasks, blueprint ${tasks}${tasks === 2 ? " (A and B)" : ""}`)
  for (const t of w) if (t.points.length !== 4) out.push(`task ${t.key}: ${t.points.length} Leitpunkte, blueprint 4`)
  if (/\b\d+\s*Wörter\b/.test(JSON.stringify(w))) out.push("the task names a word count; the official task gives none")
  return out
}

/** Every format deviation of a whole Modelltest set, labelled per Teil. Empty means it matches the blueprint. */
export function validateSet(exam: ExamId, skill: PartId, blocks: MtBlock[]): string[] {
  if (skill === "schreiben") return validateWriting(blocks, exam)
  if (skill === "sprechen") return blocks.flatMap((b) => (exam === "telc-b1" ? validateSprechenTelc(b) : validateSprechen(b)).map((i) => `Teil ${b.teil}: ${i}`))
  const teile = [...new Set(blocks.map((b) => b.teil))].sort()
  return teile.flatMap((t) => validateTeil(exam, skill, t, blocks.filter((b) => b.teil === t)).map((i) => `Teil ${t}: ${i}`))
}
