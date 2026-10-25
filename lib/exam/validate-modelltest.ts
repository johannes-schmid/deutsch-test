import voices from "@/data/tts-voices.json"
import type { MtBlock } from "@/lib/modelltest/types"
import type { ExamId } from "@/lib/exams"
import { partSpec } from "./blueprint"
import { itemNumbers } from "./kurztest"
import type { PartId } from "./types"

const words = (s: string) => s.split(/\s+/).filter(Boolean).length
const range = (n: number, min: number, max: number, what: string) => (n < min || n > max ? [`${what} is ${n}, blueprint ${min}–${max}`] : [])

/** Hören Teile whose Beispiel has its own clip, so the Teil carries one extra block. */
const OWN_EXAMPLE_BLOCK = new Set(["dtz-hoeren-1", "dtz-hoeren-3", "start-deutsch-1-hoeren-1", "start-deutsch-1-hoeren-2", "start-deutsch-1-lesen-2", "start-deutsch-1-lesen-3", "telc-a2-hoeren-1", "telc-a2-hoeren-2", "goethe-b1-hoeren-1", "oesd-b1-hoeren-1"])

/** Goethe-Zertifikat A2 and B1; ÖSD Zertifikat B1 runs the Goethe B1 sets with Austrian voices (research/goethe-plan.md). */
export const GOETHE_EXAMS = new Set<ExamId>(["goethe-a2", "goethe-b1", "oesd-b1"])

/** ÖSD Zertifikat A1 / A2: their own formats (research/oesd-a1.md, research/oesd-a2.md §9). */
export const OESD_EXAMS = new Set<ExamId>(["oesd-a1", "oesd-a2"])

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
        // Start Deutsch 1 Lesen Teil 2 offers a or b.
        const keys = full.options === 2 ? "ab" : "abc"
        if (it.item.options.map((o) => o.key).join("") !== keys) out.push(`item ${it.item.n}: options must be ${keys.split("").join(", ")}`)
        if (it.item.n > 0 && !keys.includes(keyOf(it.item.n) || "?")) out.push(`item ${it.item.n}: correct is not ${keys.split("").join(" or ")}`)
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
        const [xMin, xMax] = exam === "dtz" || GOETHE_EXAMS.has(exam) ? [1, 1] : it.noMatch ? [1, 3] : [0, 0]
        if (skill === "lesen" && (xs < xMin || xs > xMax)) out.push(`${xs} situations without a match, blueprint ${xMin === xMax ? xMin : `${xMin}–${xMax}`}`)
        // Headline matching (telc Lesen Teil 1): the texts are the situations, the headlines carry no text.
        const headlines = it.data.ads.every((a) => !a.text)
        if (skill === "lesen" && headlines) for (const s of it.data.situations) out.push(...range(words(s.text), full.length.min, full.length.max, `text ${s.n} word count`))
        else if (skill === "lesen") out.push(...range(words(it.data.ads.map((a) => `${a.title} ${a.text}`).join(" ")), full.length.min, full.length.max, "ads word count"))
      }
      if (it.type === "gap") {
        const answerOf = (n: number) => (n === 0 ? b.exampleAnswers?.[0] : keyOf(n)) ?? ""
        // A typed gap (no options) needs only its key; Beispiel answers come from exampleAnswers.
        for (const p of it.data.parts) if (typeof p !== "string" && p.options.length && !p.options.includes(answerOf(p.n))) out.push(`gap ${p.n}: correct is not one of its options`)
        for (const p of it.data.parts) if (typeof p !== "string" && !p.options.length && !answerOf(p.n).trim()) out.push(`gap ${p.n}: typed field without an answer`)
        // Word pool (telc Sprachbausteine Teil 2): every gap offers the same pool, each word fits once.
        if (full.options) {
          const gaps = it.data.parts.filter((p) => typeof p !== "string")
          if (gaps.some((g) => g.options.length !== full.options)) out.push(`word pool is not ${full.options} words`)
          const answers = gaps.map((g) => answerOf(g.n))
          if (new Set(answers).size !== answers.length) out.push("two gaps share one word of the pool")
        }
        const text = it.data.parts.map((p) => (typeof p === "string" ? p : answerOf(p.n))).join("")
        if (full.length.unit === "words" && !it.data.sheet) out.push(...range(words(text), full.length.min, full.length.max, "letter word count"))
      }
    }
    if (full.length.unit === "words" && b.display.reading) out.push(...range(words(b.display.reading.paragraphs.join(" ")), full.length.min, full.length.max, `${b.example ? "Beispiel " : ""}text word count`))
    if (full.length.unit === "seconds") {
      const script = b.key.script ?? []
      if (!script.length) out.push("audio script missing")
      // A block with several clips (ÖSD) casts per clip: a voice may come back in a later dialogue, never twice in one.
      const groups: [number, typeof script][] = full.clips ? [...new Set(script.map((t) => t.clip ?? 0))].map((c) => [c, script.filter((t) => (t.clip ?? 0) === c)]) : [[0, script]]
      for (const [, turns] of groups) {
        const cast = new Map<string, string>()
        for (const t of turns) {
          if (!(t.voice in voices)) out.push(`voice "${t.voice}" is not in data/tts-voices.json`)
          if (cast.has(t.speaker) && cast.get(t.speaker) !== t.voice) out.push(`speaker ${t.speaker} switches voice`)
          cast.set(t.speaker, t.voice)
        }
        if (new Set(cast.values()).size !== cast.size) out.push("two speakers share one voice")
      }
      const w = spokenWords(full.length, full.pace ?? { min: 120, max: 160 })
      // Hören Teil 4: each statement is its own clip; the host intro is not counted. ÖSD: each numbered clip; the
      // interviewer's question (no clip number) is not counted.
      const clips = full.clipPerItem ? script.filter((t) => t.item !== undefined).map((t) => t.text)
        : full.clips ? groups.filter(([c]) => c > 0).map(([, turns]) => turns.map((t) => t.text).join(" "))
        : [script.map((t) => t.text).join(" ")]
      if (full.clips && clips.length !== full.clips) out.push(`${clips.length} clips, blueprint ${full.clips}`)
      for (const [i, c] of clips.entries()) out.push(...range(words(c), w.min, w.max, `${full.clipPerItem ? `statement ${i}` : full.clips ? `clip ${i + 1}` : b.example ? "Beispiel clip" : "clip"} words`))
      const clip = b.display.clip
      // Goethe A2 Teil 2 and 4 render their Beispiel as its own clip, so the stored clip is the text without it; the word count above covers both.
      const splitExample = GOETHE_EXAMS.has(exam) && script.some((t) => t.item === 0)
      if (clip?.src && !full.clipPerItem && !full.clips && !splitExample) out.push(...range(+clip.duration.toFixed(1), full.length.min - 3, full.length.max + 5, "clip seconds"))
    }
  }

  // The right answer must not cluster on one letter (inburgering: 248 of 250 on "a"; set 1 Lesen Teil 5 never used "a").
  const letters = blocks.flatMap((b) => b.display.items.flatMap((it) => {
    const keyOf = (n: number) => b.key.answers.find((a) => a.n === n)?.correct
    if (it.type === "choice") return it.item.n > 0 && it.item.options.length === 3 ? [keyOf(it.item.n)] : []
    if (it.type === "gap") return it.data.parts.flatMap((p) => (typeof p !== "string" && p.n > 0 && p.options.length === 3 ? ["abc"[p.options.indexOf(String(keyOf(p.n)))]] : []))
    return []
  }))
  if (letters.length >= 4 && new Set(letters).size === 1) out.push(`every a/b/c answer is "${letters[0]}"`)
  else if (letters.length >= 5) for (const l of "abc") if (!letters.includes(l)) out.push(`no a/b/c answer is "${l}"; spread the right answers`)

  // Richtig/falsch roughly balanced, as in the official keys (U2 Hören Teil 3: 2 richtig, 2 falsch).
  const rf = blocks.flatMap((b) => b.display.items.flatMap((it) => (it.type === "rf" && it.item.n > 0 ? [b.key.answers.find((a) => a.n === it.item.n)?.correct] : [])))
  const richtig = rf.filter((c) => c === "richtig").length
  // ÖSD A1 Lesen Aufgabe 2 is 2 JA / 4 NEIN with N N N in a row in the official key (MS S. 12): not flagged there.
  const oesd = OESD_EXAMS.has(exam)
  if (!oesd && rf.length >= 4 && Math.abs(richtig - (rf.length - richtig)) > 1) out.push(`${richtig} richtig and ${rf.length - richtig} falsch; balance them`)
  // telc: no three identical answers in a row within a Teil (Hannes 2026-10-23: R R R F F read as "everything is right").
  if (exam !== "dtz" && !oesd && rf.some((c, i) => i >= 2 && c === rf[i - 1] && c === rf[i - 2])) out.push(`richtig/falsch has three of the same in a row (${rf.map((c) => c?.[0]).join(" ")}); mix them`)

  // Matching: explanations name ads and sentences by content, never by letter. The letters are shuffled after drafting
  // (set 1 shipped four explanations pointing at the wrong ad).
  for (const b of blocks.filter((b) => b.display.items.some((it) => it.type === "match")))
    for (const a of b.key.answers) if (/\b(?:Anzeige|Satz|in|bei)\s+[a-h]\b(?![-\w])/.test(a.explanation ?? "")) out.push(`item ${a.n}: explanation names an ad or sentence by its letter; name it by its content`)

  if (GOETHE_EXAMS.has(exam)) out.push(...validateGoetheTeil(exam, skill, teil, blocks))
  if (oesd) out.push(...validateOesdTeil(exam, skill, teil, blocks))
  if (exam === "dtz" && skill === "hoeren" && teil === 4)
    for (const it of blocks[0]?.display.items ?? []) if (it.type === "match") for (const ad of it.data.ads) if (/^(ich|mein\w*|wir|uns\w*)\b/i.test(ad.text)) out.push(`sentence ${ad.key} is first person; the sentences a–f are general opinions ("Man sollte …", "X ist …")`)
  if (exam === "dtz" && skill === "hoeren" && teil === 3 && !scored.some((b) => (b.key.script ?? []).some((t) => /\b(du|dich|dir)\b/i.test(t.text)))) out.push("no dialogue between friends or family (du); the official sets mix du and Sie conversations")
  return out
}

/** Goethe/ÖSD details the generic checks don't cover (research/goethe-a2.md §11, research/goethe-oesd-b1.md §8). */
function validateGoetheTeil(exam: ExamId, skill: PartId, teil: number, blocks: MtBlock[]): string[] {
  const out: string[] = []
  const id = `${exam === "goethe-a2" ? "a2" : "b1"}-${skill}-${teil}`
  const items = blocks.flatMap((b) => b.display.items)
  const jaNein = ["a2-hoeren-4", "b1-lesen-4"].includes(id)
  for (const it of items) if (it.type === "rf" && jaNein !== (it.item.labels?.join("/") === "Ja/Nein")) out.push(`item ${it.item.n}: ${jaNein ? 'labels must be ["Ja", "Nein"]' : "richtig/falsch item with other labels"}`)
  for (const it of items) if (it.type === "match" && it.noMatch && it.data.noMatchLabel !== (exam === "goethe-a2" ? "X" : "0")) out.push(`no-match label must be "${exam === "goethe-a2" ? "X" : "0"}"`)
  const photo = (b: MtBlock, n: number, key: string) => !!b.photos?.[n]?.[key]?.query
  if (id === "a2-hoeren-2")
    for (const b of blocks) for (const it of b.display.items) if (it.type === "match") for (const a of it.data.ads) if (!a.image && !photo(b, 0, a.key)) out.push(`picture ${a.key}: no photo`)
  if (id === "a2-hoeren-3")
    for (const b of blocks) for (const it of b.display.items) if (it.type === "picture") for (const o of it.item.options) if (!o.image && !photo(b, it.item.n, o.key)) out.push(`item ${it.item.n}: option ${o.key} has no photo`)
  if (id === "a2-lesen-2") {
    const choices = items.flatMap((it) => (it.type === "choice" && it.item.n > 0 ? [it.item] : []))
    const c = choices[0]?.options[2]?.label
    if (c !== "andere Halle" && c !== "anderer Stock") out.push(`option c is "${c}"; the exam prints exactly "andere Halle" or "anderer Stock"`)
    if (choices.some((q) => q.options[2]?.label !== c)) out.push("option c differs between items")
    const cRight = choices.filter((q) => blocks.some((b) => b.key.answers.find((a) => a.n === q.n)?.correct === "c")).length
    if (cRight < 1 || cRight > 2) out.push(`option c is right ${cRight} times; official 1–2 of 5`)
  }
  if (id === "b1-hoeren-4") {
    const b = blocks[0]
    const keys = (b?.key.answers ?? []).map((a) => a.correct)
    if (keys.filter((k) => k === "a").length !== 1) out.push(`the moderator (a) owns ${keys.filter((k) => k === "a").length} statements, official 1 of 8`)
    if (new Set(b?.key.script?.map((t) => t.speaker)).size !== 3) out.push("the discussion needs exactly 3 speakers (moderator + 2 guests)")
  }
  if (id === "b1-hoeren-1") for (const b of blocks) if (b.display.items.map((it) => it.type).join() !== "rf,choice") out.push(`${b.id}: each text carries one richtig/falsch item, then one a/b/c item`)
  if (skill === "hoeren" && exam === "goethe-a2" && teil !== 2 && teil !== 4)
    for (const b of blocks) if (new Set(b.key.script?.map((t) => t.speaker)).size !== (teil === 1 ? 1 : 2)) out.push(`${b.id}: Teil ${teil} has ${teil === 1 ? "one speaker" : "two speakers"} per text`)
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
  const want: Record<number, [number, number]> = { 1: [60, 150], 2: [120, 270], 3: [120, 320] }
  out.push(...range(secs, ...want[b.teil], "du speaking seconds"))
  if (b.teil === 1 && sp.data.points.length < 6) out.push(`${sp.data.points.length} topics on the sheet, blueprint ~7`)
  if (b.teil === 2) {
    out.push(...range(words(sp.data.points[0] ?? ""), 35, 70, "your opinion sheet words"))
    if (!/Blatt von/.test(live?.persona ?? "")) out.push("the partner's opinion sheet is missing from the persona")
  }
  if (b.teil === 3 && sp.data.points.at(-1) !== "…") out.push(`planning sheet must end with "…"`)
  // Official order (Übungstest 1 p. 33): A opens Teil 1 and Teil 3; in Teil 2 the examiner asks B first, then A, then
  // invites both to discuss. The candidate is always A; the examiner opens and closes every Teil.
  const first = turns.find((t, i) => i > 0 && t.who !== "pruefer")
  if (turns[0]?.who !== "pruefer" || turns.at(-1)?.who !== "pruefer") out.push("the examiner opens and closes every Teil")
  if (b.teil !== 2 && first?.who !== "du") out.push(`in Teil ${b.teil} the candidate (A) speaks first`)
  if (b.teil === 2) {
    if (first?.who !== "partner") out.push("in Teil 2 the partner (B) reports first")
    const report = turns.findIndex((t) => t.who === "du")
    const next = turns.findIndex((t, i) => i > report && t.who !== "du")
    if (report < 0 || turns[next]?.who !== "pruefer") out.push("in Teil 2 the examiner invites both to discuss after the two reports")
  }
  if (b.teil > 1 && (live?.partnerLines?.length ?? 0) < 4) out.push("fewer than 4 partner fallback lines")
  return out
}

/**
 * Start Deutsch 1 / telc A2 Sprechen (research/start-deutsch-1.md §5, research/telc-a2.md §5): no preparation; the
 * examiner (Ela) leads each Teil, the partner is a learner (Kathi, de-learner). Partner answers to the candidate's
 * questions and requests are live; their written text is only a fallback and must not assume what was asked.
 */
export function validateSprechenStart(exam: ExamId, b: MtBlock | undefined): string[] {
  const sp = b?.display.speaking
  if (!b || !sp) return ["speaking block missing"]
  const out: string[] = []
  const turns = sp.turns
  for (const who of ["du", "pruefer"]) if (!turns.some((t) => t.who === who)) out.push(`no ${who} turn`)
  for (const [i, t] of turns.entries()) {
    if (!t.text.trim()) out.push(`turn ${i} (${t.who}) is empty`)
    if (t.who === "du" && !t.seconds) out.push(`turn ${i}: du turn without speaking time`)
    if (t.who === "pruefer" && SIE_ONLY.test(t.text)) out.push(`turn ${i}: the examiner says "du"; she says Sie to both`)
  }
  if (turns[0]?.who !== "pruefer" || turns.at(-1)?.who !== "pruefer") out.push("the examiner opens and closes every Teil")
  const v = b.key.speaking?.voices
  if (v?.pruefer !== "woman_ela" || v?.partner !== "woman_kathi") out.push("voices must be woman_ela (examiner) and woman_kathi (learner partner)")
  if (!b.key.live?.persona) out.push("partner persona missing")
  const du = turns.filter((t) => t.who === "du")
  if ((b.key.speaking?.sampleAnswers.length ?? 0) !== du.length) out.push(`${du.length} du turns but ${b.key.speaking?.sampleAnswers.length ?? 0} sample answers`)
  // A partner turn right after the candidate's question, request or proposal reacts to it: it has to be live.
  for (const [i, t] of turns.entries()) if (b.teil > 1 && t.who === "partner" && turns[i - 1]?.who === "du" && /^(Frag|Bitte|Mach|Schlag)/.test(turns[i - 1].text) && !t.live) out.push(`turn ${i}: the partner answers the candidate with a fixed line; make it live with a neutral fallback`)
  // Candidate turns per Teil: A1 intro, spelling, number · 2 questions + 2 answers · 2 requests + 2 reactions; A2 intro +
  // 2 follow-ups · 3 questions + 3 answers · the negotiation.
  const want = ({ "start-deutsch-1": { 1: 3, 2: 4, 3: 4 }, "telc-a2": { 1: 3, 2: 6, 3: 4 } } as Record<string, Record<number, number>>)[exam]?.[b.teil] ?? 0
  if (du.length < want) out.push(`${du.length} du turns, Teil ${b.teil} needs at least ${want}`)
  if (exam === "start-deutsch-1" && b.teil > 1 && (sp.data.cards?.length ?? 0) !== 2) out.push(`${sp.data.cards?.length ?? 0} cards; each candidate draws 2`)
  if (exam === "telc-a2" && b.teil === 2 && (sp.data.cards?.length ?? 0) !== 3) out.push(`${sp.data.cards?.length ?? 0} cards; each candidate draws 3`)
  if (exam === "telc-a2" && b.teil === 1 && (b.key.live?.followups?.length ?? 0) < 4) out.push("fewer than 4 follow-up questions in the bank")
  return out
}

/** Start Deutsch 1 / telc A2 Schreiben: Teil 1 a form with 5 fields and a Beispiel, Teil 2 one message (3 / 4 points). */
function validateWritingStart(exam: ExamId, blocks: MtBlock[]) {
  const out: string[] = []
  const form = blocks.find((b) => b.teil === 1)
  const letter = blocks.find((b) => b.teil === 2)
  const gaps = form?.display.items.flatMap((it) => (it.type === "gap" ? it.data.parts.filter((p) => typeof p !== "string") : [])) ?? []
  if (!form || form.display.items[0]?.type !== "gap" || (form.display.items[0].type === "gap" && form.display.items[0].data.sheet !== "Formular")) out.push("Teil 1: the form (gap sheet Formular) is missing")
  if (gaps.filter((g) => g.n > 0).map((g) => g.n).join() !== "1,2,3,4,5") out.push(`Teil 1: fields ${gaps.map((g) => g.n).join(",")}, blueprint Beispiel + 1–5`)
  if (!gaps.some((g) => g.n === 0) || !form?.exampleAnswers?.length) out.push("Teil 1: Beispiel field or its answer missing")
  for (const g of gaps.filter((g) => g.n > 0)) {
    const k = form!.key.answers.find((a) => a.n === g.n)
    if (!k) out.push(`Teil 1: field ${g.n} has no key`)
    else if (g.options.length && !g.options.includes(String(k.correct))) out.push(`Teil 1: field ${g.n}: correct is not one of its options`)
  }
  if (!form?.display.reading) out.push("Teil 1: the text the form is filled from is missing")
  const w = letter?.display.writing ?? []
  const points = exam === "telc-a2" ? 4 : 3
  if (w.length !== 1) out.push(`Teil 2: ${w.length} tasks, blueprint 1`)
  for (const t of w) if (t.points.length !== points) out.push(`Teil 2: ${t.points.length} points, blueprint ${points}`)
  if (!letter?.key.writing?.[0]?.modelAnswer) out.push("Teil 2: model answer missing")
  return out
}

/** Goethe A2 (2 tasks, 3 Leitpunkte each, 20–30 / 30–40 words) and Goethe/ÖSD B1 (3 Aufgaben, ~80 / ~80 / ~40 words). */
function validateWritingGoethe(exam: ExamId, blocks: MtBlock[]) {
  const out: string[] = []
  const a2 = exam === "goethe-a2"
  const want = a2 ? [[1, 3, 20, 30], [2, 3, 30, 40]] : [[1, 3, 70, 100], [2, 0, 70, 100], [3, 0, 35, 55]]
  if (blocks.length !== want.length) out.push(`${blocks.length} tasks, blueprint ${want.length}`)
  for (const [teil, points, min, max] of want) {
    const b = blocks.find((x) => x.teil === teil)
    const w = b?.display.writing ?? []
    if (w.length !== 1) { out.push(`Teil ${teil}: ${w.length} tasks, blueprint 1`); continue }
    if (points && w[0].points.length !== points) out.push(`Teil ${teil}: ${w[0].points.length} Leitpunkte, blueprint ${points}`)
    const model = b!.key.writing?.[0]?.modelAnswer ?? ""
    if (!model) out.push(`Teil ${teil}: model answer missing`)
    else out.push(...range(words(model), min, max, `Teil ${teil}: model answer words`))
  }
  return out
}

/** Goethe/ÖSD Sprechen: a pair exam with an examiner; the voices come from the exam's cast (Goethe DE, ÖSD AT). */
export const GOETHE_VOICES: Record<string, { pruefer: string; partner: string }> = {
  "goethe-a2": { pruefer: "woman_irene", partner: "woman_kathi" },
  "goethe-b1": { pruefer: "woman_irene", partner: "man_ben" },
  "oesd-b1": { pruefer: "woman_alexandra_at", partner: "man_gruber_at" },
}

export function validateSprechenGoethe(exam: ExamId, b: MtBlock | undefined): string[] {
  const sp = b?.display.speaking
  if (!b || !sp) return ["speaking block missing"]
  const out: string[] = []
  const turns = sp.turns
  for (const [i, t] of turns.entries()) {
    if (!t.text.trim()) out.push(`turn ${i} (${t.who}) is empty`)
    if (t.who === "du" && !t.seconds) out.push(`turn ${i}: du turn without speaking time`)
    if (t.who === "pruefer" && SIE_ONLY.test(t.text)) out.push(`turn ${i}: the examiner says "du"; she says Sie to both`)
  }
  if (turns[0]?.who !== "pruefer" || turns.at(-1)?.who !== "pruefer") out.push("the examiner opens and closes every Teil")
  const v = b.key.speaking?.voices
  const cast = GOETHE_VOICES[exam]
  if (v?.pruefer !== cast?.pruefer || v?.partner !== cast?.partner) out.push(`voices must be ${cast?.pruefer} (examiner) and ${cast?.partner} (partner)`)
  if (!b.key.live?.persona) out.push("partner persona missing")
  const du = turns.filter((t) => t.who === "du")
  if ((b.key.speaking?.sampleAnswers.length ?? 0) !== du.length) out.push(`${du.length} du turns but ${b.key.speaking?.sampleAnswers.length ?? 0} sample answers`)
  if (b.key.speaking?.sampleAnswers.some((s) => !s.trim())) out.push("empty sample answer")
  const fu = b.key.live?.followups ?? []
  if (exam === "goethe-a2") {
    if (b.teil === 1) {
      if ((sp.data.cards?.length ?? 0) !== 4) out.push(`${sp.data.cards?.length ?? 0} cards; each candidate has 4`)
      if (du.length < 8) out.push(`${du.length} du turns; 4 questions + 4 answers`)
    }
    if (b.teil === 2) {
      if (sp.data.points.length !== 4) out.push(`${sp.data.points.length} prompts on the card, blueprint 4`)
      if (fu.length < 3) out.push("fewer than 3 examiner follow-up questions in the bank")
    }
    if (b.teil === 3) {
      if ((sp.data.cards?.length ?? 0) < 5) out.push("the calendar (cards) or mind map needs at least 5 entries")
      if ((b.key.live?.partnerLines?.length ?? 0) < 4) out.push("fewer than 4 partner fallback lines")
      if (du.length < 4) out.push(`${du.length} du turns; the negotiation needs at least 4`)
    }
  } else {
    if (b.teil === 1) {
      if (sp.data.points.length < 4) out.push(`${sp.data.points.length} Leitpunkte, blueprint 4 (+ "…")`)
      if ((b.key.live?.partnerLines?.length ?? 0) < 4) out.push("fewer than 4 partner fallback lines")
      if (du.length < 4) out.push(`${du.length} du turns; planning needs at least 4`)
    }
    if (b.teil === 2) {
      if (sp.data.points.length !== 5) out.push(`${sp.data.points.length} slides, blueprint 5`)
      if ((sp.data.cards?.length ?? 0) !== 2) out.push(`${sp.data.cards?.length ?? 0} topics; the candidate chooses 1 of 2`)
    }
    if (b.teil === 3) {
      if (fu.length < 3) out.push("fewer than 3 questions in the bank (partner and examiner)")
      if (du.length < 3) out.push(`${du.length} du turns; answer the partner, answer the examiner, give feedback in round B`)
    }
  }
  return out
}

/** Schreiben: Aufgabe A and B, 4 Leitpunkte each, no word count (research/dtz-blueprint.md §4). */
export function validateWriting(blocks: MtBlock[], exam: ExamId = "dtz") {
  if (exam === "start-deutsch-1" || exam === "telc-a2") return validateWritingStart(exam, blocks)
  if (OESD_EXAMS.has(exam)) return validateWritingOesd(exam, blocks)
  if (GOETHE_EXAMS.has(exam)) return validateWritingGoethe(exam, blocks)
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
  if (skill === "sprechen" && OESD_EXAMS.has(exam)) return validateSprechenOesdSet(exam, blocks)
  if (skill === "sprechen") return blocks.flatMap((b) => (exam === "telc-b1" ? validateSprechenTelc(b) : GOETHE_EXAMS.has(exam) ? validateSprechenGoethe(exam, b) : exam === "start-deutsch-1" || exam === "telc-a2" ? validateSprechenStart(exam, b) : validateSprechen(b)).map((i) => `Teil ${b.teil}: ${i}`))
  const teile = [...new Set(blocks.map((b) => b.teil))].sort()
  return teile.flatMap((t) => validateTeil(exam, skill, t, blocks.filter((b) => b.teil === t)).map((i) => `Teil ${t}: ${i}`))
}

// ---- ÖSD Zertifikat A1 / A2 (research/oesd-a1.md §9, research/oesd-a2.md §9) ----

const gender = (voice: string) => (voices as Record<string, { gender?: string }>)[voice]?.gender

/** ÖSD details the generic checks don't cover: answer formats, picture options, key patterns of the Modellsatz. */
function validateOesdTeil(exam: ExamId, skill: PartId, teil: number, blocks: MtBlock[]): string[] {
  const out: string[] = []
  const a1 = exam === "oesd-a1"
  const id = `${a1 ? "a1" : "a2"}-${skill}-${teil}`
  const items = blocks.flatMap((b) => b.display.items)
  const keys = blocks.flatMap((b) => b.key.answers)
  const keyOf = (n: number) => keys.find((a) => a.n === n)
  const matches = items.flatMap((it) => (it.type === "match" ? [it] : []))
  const grids = items.flatMap((it) => (it.type === "grid" ? [it.data] : []))
  const gaps = items.flatMap((it) => (it.type === "gap" ? [it.data] : []))
  const photo = (b: MtBlock, n: number, key: string) => !!b.photos?.[n]?.[key]?.query
  /** Clips of a multi-clip block: their turns by clip number (1…n). */
  const clipTurns = (b: MtBlock) => {
    const script = b.key.script ?? []
    return [...new Set(script.map((t) => t.clip ?? 0))].filter((c) => c > 0).map((c) => script.filter((t) => t.clip === c))
  }
  const oneUnused = (m: (typeof matches)[number], what: string) => {
    const used = new Set(m.data.situations.map((x) => String(keyOf(x.n)?.correct ?? "")))
    const unused = m.data.ads.filter((a) => !used.has(a.key)).length
    if (unused !== 1) out.push(`${unused} ${what} unused; the exam has exactly one extra`)
  }

  if (id === "a1-lesen-1" || id === "a1-lesen-3") {
    const m = matches[0]
    if (!m) return [`Aufgabe ${teil}: the matching item is missing`]
    if (m.data.ads.map((a) => a.key).join() !== "1,2,3,4,5,6") out.push(`${id === "a1-lesen-1" ? "ads" : "pictures"} must be numbered 1–6`)
    oneUnused(m, id === "a1-lesen-1" ? "ads" : "pictures")
    if (id === "a1-lesen-1") for (const a of m.data.ads) if (!a.title || !a.text) out.push(`ad ${a.key}: title and text required (a newspaper ad)`)
    if (id === "a1-lesen-3") for (const a of m.data.ads) if (!a.picto || a.text) out.push(`picture ${a.key}: a pictogram (picto) with a label in title, no text`)
  }
  if (id === "a1-lesen-2") {
    for (const b of blocks) {
      const rf = b.display.items.flatMap((it) => (it.type === "rf" ? [it.item] : []))
      if (rf.length !== 2) out.push(`${b.id}: ${rf.length} questions, blueprint 2 per text`)
      for (const q of rf) if (q.labels?.join("/") !== "Ja/Nein") out.push(`item ${q.n}: labels must be ["Ja", "Nein"]`)
      if (rf.filter((q) => keyOf(q.n)?.correct === "richtig").length > 1) out.push(`${b.id}: two JA answers in one text; the Modellsatz has at most one per text`)
      if (!b.display.reading) out.push(`${b.id}: text missing`)
    }
    const ja = keys.filter((k) => k.correct === "richtig").length
    if (ja < 2 || ja > 3) out.push(`${ja} JA of 6; the Modellsatz has 2 (keep 2–3)`)
  }
  if (id === "a2-lesen-1") {
    const m = matches[0]
    if (!m) return ["Aufgabe 1: the headings item is missing"]
    if (m.data.ads.map((a) => a.key).join("") !== "ABCDEFGHIK") out.push("headings must be A–I and K (no J), as printed")
    for (const a of m.data.ads) if (!a.title || a.text) out.push(`heading ${a.key}: title only`)
    for (const x of m.data.situations) if (!x.origin) out.push(`text ${x.n}: origin label missing ("aus einer … Zeitung")`)
    if (!m.data.situations.some((x) => x.table?.length)) out.push("no text with a small table or chart; the Modellsatz has one")
    const answers = m.data.situations.map((x) => keyOf(x.n)?.correct)
    if (new Set(answers).size !== answers.length) out.push("two texts share one heading in the key")
  }
  if (id === "a2-lesen-2") {
    const r = blocks[0]?.display.reading
    if (r && !/Zeitung/.test(`${r.source} ${r.sender}`)) out.push("origin label missing (source: \"aus einer österreichischen Zeitung\")")
  }

  if (id === "a1-hoeren-1") {
    const m = matches[0]
    const b = blocks[0]
    if (!m || !b) return ["Aufgabe 1: the photo grid is missing"]
    if (m.data.layout !== "textNumber") out.push('layout must be "textNumber" (text numbers under the photos)')
    if (m.data.ads.map((a) => a.key).join("") !== "ABCDEF") out.push("photos must be A–F")
    for (const a of m.data.ads) if (!a.image && !photo(b, 0, a.key)) out.push(`photo ${a.key}: no photo`)
    oneUnused(m, "photos")
    const clips = clipTurns(b)
    for (const [i, c] of clips.entries()) {
      if (new Set(c.map((t) => t.speaker)).size !== 2) out.push(`clip ${i + 1}: a dialogue of two people`)
      if (c.length < 2 || c.length > 4) out.push(`clip ${i + 1}: ${c.length} turns, the Modellsatz has 2–4`)
      if (!c[0]?.sound) out.push(`clip ${i + 1}: no sound cue before the dialogue`)
    }
  }
  if (id === "a1-hoeren-2" || id === "a2-hoeren-2") {
    const g = gaps[0]
    if (!g || g.sheet !== "Notiz") return [`Aufgabe 2: the note sheet (gap sheet Notiz) is missing`]
    const fields = g.parts.filter((p) => typeof p !== "string")
    if (fields.some((f) => f.options.length)) out.push("every note field is typed (no options)")
    if (a1 && !fields.some((f) => f.n === 0)) out.push('the first line ("Was:") is printed as the Beispiel');
    if (!a1 && fields.some((f) => f.n === 0)) out.push("ZA2 prints no Beispiel line")
    const phone = keys.find((k) => /^[\d\s/]{6,}$/.test(String(k.correct)))
    if (!phone) out.push("no phone number on the note sheet")
    else if (!phone.exact) out.push(`item ${phone.n}: the phone number must be exact ("exact": true)`)
    if (a1 && !keys.some((k) => k.exact && /[a-zäöü]/i.test(String(k.correct)))) out.push("the spelled street name must be exact (\"exact\": true)")
    if (new Set((blocks[0]?.key.script ?? []).map((t) => t.speaker)).size !== 1) out.push("one speaker leaves the message")
  }
  if (id === "a1-hoeren-3" || id === "a2-hoeren-3") {
    const g = grids[0]
    const b = blocks[0]
    if (!g || !b) return ["Aufgabe 3: the tick grid is missing"]
    if (g.columns.length !== (a1 ? 4 : 5) || g.rows.length !== 5) out.push(`grid ${g.rows.length} × ${g.columns.length}, blueprint 5 × ${a1 ? 4 : 5}`)
    if (!!g.multi === a1) out.push(a1 ? "ZA1: one tick per row (multi off)" : "ZA2: several ticks per row (multi on)")
    const cols = g.columns.map((c) => c.key)
    const rowTicks = g.rows.map((r) => String(keyOf(r.n)?.correct ?? "").split(",").filter(Boolean))
    for (const [i, t] of rowTicks.entries()) if (t.some((k) => !cols.includes(k))) out.push(`row ${g.rows[i].n}: "${t.join(",")}" is not a column`)
    if (a1) {
      if (rowTicks.some((t) => t.length !== 1)) out.push("every row has exactly one answer")
      if (new Set(rowTicks.flat()).size !== cols.length) out.push("all four columns are used (one twice), as in the Modellsatz")
    } else {
      if (rowTicks.flat().length !== 10) out.push(`${rowTicks.flat().length} ticks, the Modellsatz has 10 of 25`)
      for (const c of cols) if (rowTicks.flat().filter((k) => k === c).length !== 2) out.push(`column ${c} ticked ${rowTicks.flat().filter((k) => k === c).length} times; every column exactly twice`)
      for (const [i, t] of rowTicks.entries()) if (t.length < 1 || t.length > 3) out.push(`row ${g.rows[i].n}: ${t.length} ticks, keep 1–3`)
      for (const [i, t] of rowTicks.entries()) if (t.join(",") !== cols.filter((c) => t.includes(c)).join(",")) out.push(`row ${g.rows[i].n}: ticks out of column order`)
    }
    const script = b.key.script ?? []
    if (script[0]?.clip !== undefined) out.push("the interviewer asks the question first (a turn without clip)")
    const clips = clipTurns(b)
    for (const [i, c] of clips.entries()) if (new Set(c.map((t) => t.speaker)).size !== 1) out.push(`clip ${i + 1}: one person answers`)
    const answerVoices = clips.map((c) => c[0]?.voice)
    if (new Set(answerVoices).size !== answerVoices.length) out.push("two interviewees share one voice")
    if (answerVoices.includes(script[0]?.voice)) out.push("an interviewee has the interviewer's voice")
  }
  if (id === "a2-hoeren-1") {
    const m = items.flatMap((it) => (it.type === "marks" ? [it.data] : []))[0]
    const b = blocks[0]
    if (!m || !b) return ["Aufgabe 1: the 4-of-8 boxes are missing"]
    if (m.options.length !== 8 || m.pick !== 4 || m.ns.join() !== "1,2,3,4") out.push("8 boxes, mark 4, items 1–4")
    const right = m.ns.map((n) => String(keyOf(n)?.correct ?? ""))
    if (new Set(right).size !== 4 || right.some((k) => !m.options.some((o) => o.key === k))) out.push("the four answers must be four different boxes")
    const clips = clipTurns(b)
    if (clips.some((c) => new Set(c.map((t) => t.speaker)).size !== 1)) out.push("each radio text has one speaker")
    if (clips.length === 2 && !(gender(clips[0][0].voice) === "female" && gender(clips[1][0].voice) === "male")) out.push("text 1 is read by a woman, text 2 by a man (Modellsatz)")
  }
  return out
}

/** ÖSD Schreiben. A1: Aufgabe 1 a form (10 points incl. one 2-of-4 tick group, surname printed), Aufgabe 2 a reply of
 * ~30 words to 3 questions. A2: one reply of ~50 words to 4 questions, the first "Wie geht es dir?". */
function validateWritingOesd(exam: ExamId, blocks: MtBlock[]) {
  const out: string[] = []
  const a1 = exam === "oesd-a1"
  if (/\beine E-Mail\b/.test(JSON.stringify(blocks.map((b) => b.display)))) out.push('ÖSD sheets say "ein/das E-Mail" (neuter), not "eine E-Mail"')
  if (a1) {
    const form = blocks.find((b) => b.teil === 1)
    const g = form?.display.items[0]?.type === "gap" ? form.display.items[0].data : undefined
    if (!form || g?.sheet !== "Formular") out.push("Aufgabe 1: the form (gap sheet Formular) is missing")
    else {
      const fields = g.parts.filter((p) => typeof p !== "string")
      const scored = fields.filter((f) => f.n > 0)
      const points = scored.reduce((n, f) => n + (f.pick ?? 1), 0)
      if (points !== 10) out.push(`Aufgabe 1: the form is worth ${points} points, blueprint 10`)
      if (!fields.some((f) => f.n === 0) || !form.exampleAnswers?.length) out.push("Aufgabe 1: the surname is printed as the Beispiel (n = 0)")
      const typed = scored.filter((f) => !f.options.length).length
      if (typed !== 5) out.push(`Aufgabe 1: ${typed} written fields, the Modellsatz has 5 (+ 5 tick points)`)
      const groups = scored.filter((f) => (f.pick ?? 1) > 1)
      if (groups.length !== 1 || groups[0].options.length !== 4 || groups[0].pick !== 2) out.push("Aufgabe 1: one tick group of 4 boxes with 2 right answers")
      for (const f of scored) {
        const k = form.key.answers.find((a) => a.n === f.n)
        if (!k) { out.push(`Aufgabe 1: field ${f.n} has no key`); continue }
        const want = String(k.correct).split(",")
        if (f.options.length && (want.length !== (f.pick ?? 1) || want.some((w) => !f.options.includes(w)))) out.push(`Aufgabe 1: field ${f.n}: key "${k.correct}" does not fit its boxes`)
      }
      const situation = form.display.reading?.paragraphs.join(" ") ?? ""
      if (!situation) out.push("Aufgabe 1: the situation text is missing")
      else out.push(...range(words(situation), 38, 60, "Aufgabe 1: situation words"))
    }
  }
  const letter = blocks.find((b) => b.teil === (a1 ? 2 : 1))
  const w = letter?.display.writing ?? []
  if (w.length !== 1) out.push(`${a1 ? "Aufgabe 2" : "Schreibaufgabe"}: ${w.length} tasks, blueprint 1`)
  for (const t of w) {
    if (t.points.length !== (a1 ? 3 : 4)) out.push(`${t.points.length} questions, blueprint ${a1 ? 3 : 4}`)
    if (!a1 && t.points[0] !== "Wie geht es dir?") out.push('the first question is "Wie geht es dir?" (Modellsatz)')
    out.push(...range(words(t.situation), a1 ? 35 : 60, a1 ? 75 : 105, "input email words (with the frame sentence)"))
    if (!t.opener?.trim()) out.push("the printed opener of the answer sheet (salutation + first line) is missing")
  }
  const model = letter?.key.writing?.[0]?.modelAnswer ?? ""
  if (!model) out.push("model answer missing")
  else out.push(...range(words(model), a1 ? 25 : 45, a1 ? 45 : 70, "model answer words"))
  if (letter?.key.writing?.[0]?.register !== "informell") out.push("the reply is informal (du)")
  return out
}

/** ÖSD Sprechen voices: Assessor (pruefer) Gruber; Interlokutor (partner) Alexandra (A1) / Emilia (A2). */
export const OESD_VOICES: Record<string, { pruefer: string; partner: string }> = {
  "oesd-a1": { pruefer: "man_gruber_at", partner: "woman_alexandra_at" },
  "oesd-a2": { pruefer: "man_gruber_at", partner: "woman_emilia_at" },
}

/** ÖSD Sprechen: an individual exam. The Assessor (pruefer) explains, the Interlokutor (partner) asks the follow-ups and
 * plays the other role (A1 Aufgabe 3) or plans with the candidate on du (A2 Aufgabe 2). */
function validateSprechenOesdSet(exam: ExamId, blocks: MtBlock[]) {
  const a1 = exam === "oesd-a1"
  const want = a1 ? [1, 2, 3] : [1, 2]
  const out = blocks.map((b) => b.teil).join() !== want.join() ? [`Aufgaben ${blocks.map((b) => b.teil).join(", ")}, blueprint ${want.join(", ")}`] : []
  return [...out, ...blocks.flatMap((b) => validateSprechenOesd(exam, b).map((i) => `Aufgabe ${b.teil}: ${i}`))]
}

export function validateSprechenOesd(exam: ExamId, b: MtBlock | undefined): string[] {
  const sp = b?.display.speaking
  if (!b || !sp) return ["speaking block missing"]
  const out: string[] = []
  const a1 = exam === "oesd-a1"
  const turns = sp.turns
  for (const [i, t] of turns.entries()) {
    if (!t.text.trim()) out.push(`turn ${i} (${t.who}) is empty`)
    if (t.who === "du" && !t.seconds) out.push(`turn ${i}: du turn without speaking time`)
    if (t.who === "pruefer" && SIE_ONLY.test(t.text)) out.push(`turn ${i}: the Assessor says "du"; he says Sie`)
    // A1: the Interlokutor says Sie in the follow-ups; in the role-play it depends on the role. A2 Aufgabe 2: du.
    if (t.who === "partner" && a1 && b.teil < 3 && SIE_ONLY.test(t.text)) out.push(`turn ${i}: the Interlokutor says "du" outside the role-play`)
  }
  if (turns[0]?.who !== "pruefer" || turns.at(-1)?.who !== "pruefer") out.push("the Assessor opens and closes every Aufgabe")
  const v = b.key.speaking?.voices
  const cast = OESD_VOICES[exam]
  if (v?.pruefer !== cast.pruefer || v?.partner !== cast.partner) out.push(`voices must be ${cast.pruefer} (Assessor) and ${cast.partner} (Interlokutor)`)
  const du = turns.filter((t) => t.who === "du")
  if ((b.key.speaking?.sampleAnswers.length ?? 0) !== du.length) out.push(`${du.length} du turns but ${b.key.speaking?.sampleAnswers.length ?? 0} sample answers`)
  if (b.key.speaking?.sampleAnswers.some((s) => !s.trim())) out.push("empty sample answer")
  const fu = b.key.live?.followups ?? []
  for (const t of turns.filter((t) => t.live === "followup")) if (!fu.some((f) => f.text === t.text)) out.push(`follow-up "${t.text.slice(0, 30)}…" is not in the bank`)
  const followups = turns.filter((t) => t.who === "partner" && t.live === "followup").length
  const partnerLive = turns.filter((t) => t.who === "partner" && t.live === "partner").length
  if (b.teil === 1) {
    // A1: six keywords with "?"; A2 (Folienblatt): five with "?" and one open sentence ("… mache gern …").
    const open = sp.data.points.filter((p) => !/\?$/.test(p))
    if (sp.data.points.length !== 6 || (a1 ? open.length : open.length > 1 || (open[0] && !open[0].includes("…")))) out.push(a1 ? "the topic card has 6 keywords, each with \"?\"" : "the Folienblatt has 6 topics: keywords with \"?\", at most one open \"… … …\" sentence")
    if (sp.data.choose !== (a1 ? 4 : 5)) out.push(`choose ${a1 ? 4 : 5} of 6 topics`)
    if (followups !== (a1 ? 3 : 5)) out.push(`${followups} Interlokutor follow-ups, the official video has ${a1 ? 3 : 5}`)
    if (fu.length < (a1 ? 5 : 7)) out.push(`only ${fu.length} follow-ups in the bank; keep at least ${a1 ? 5 : 7} to pick from`)
    if (!/Name|heißen|wie geht/i.test(turns.slice(0, 3).map((t) => t.text).join(" "))) out.push("no warm-up (greeting, name, how are you) before Aufgabe 1")
  }
  if (a1 && b.teil === 2) {
    const sc = sp.data.scenes ?? []
    if (sc.length !== 3) out.push(`${sc.length} photos, the candidate chooses 1 of 3`)
    for (const s of sc) {
      if (!s.image && !b.photos?.[0]?.[s.key]?.query) out.push(`photo ${s.key}: no photo`)
      if (s.roles?.length !== 2) out.push(`photo ${s.key}: two roles for the role-play`)
    }
    if (sp.data.points.length !== 4) out.push("the four questions under the photo")
    if (followups !== 2) out.push(`${followups} Interlokutor questions about the photo, the official video has 2`)
  }
  if (a1 && b.teil === 3) {
    if (!/Rolle/.test(turns.filter((t) => t.who === "pruefer").map((t) => t.text).join(" "))) out.push("the Assessor asks which role the candidate takes")
    if (partnerLive < 6) out.push(`${partnerLive} role-play turns of the Interlokutor, the official video has ~8`)
    if (!b.key.live?.persona) out.push("role-play brief (persona) missing")
    if ((b.key.live?.partnerLines?.length ?? 0) < 6) out.push("fewer than 6 fallback lines for the role-play")
    if ((sp.data.scenes?.length ?? 0) !== 3) out.push("the three photos with their roles (the run uses the chosen one)")
  }
  if (!a1 && b.teil === 2) {
    const sh = sp.data.sheet
    if (!sh) out.push("the picture planning sheet is missing")
    else {
      if (sh.rows.map((r) => r.pictures.length).join() !== "3,3,3,2") out.push(`picture rows ${sh.rows.map((r) => r.pictures.length).join("/")}, the Modellsatz has 3/3/3/2`)
      if (!sh.more) out.push('the open box ("noch etwas?") is missing')
      for (const r of sh.rows) if (!/\?$/.test(r.label)) out.push(`row "${r.label}" is a question with "?"`)
    }
    if (!b.key.live?.persona) out.push("partner persona missing")
    if ((b.key.live?.partnerLines?.length ?? 0) < 6) out.push("fewer than 6 partner fallback lines")
    if (du.length < 5) out.push(`${du.length} du turns; the plan covers all rows`)
    if (!turns.some((t) => t.who === "partner" && /\b(du|dir|dich)\b/i.test(t.text))) out.push("the Interlokutor plans with the candidate on du")
  }
  return out
}
