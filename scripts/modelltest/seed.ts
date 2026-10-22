// Seeds Modelltest files (data/modelltest/<exam>/<skill>-NN.json) into the mt_* tables and uploads their audio and
// photos to Storage. Local by default; production only with --production and .env.local as the only env file.
//
// Rules (CLAUDE.md §8): new rows land as draft; review_status is never written on an existing row; a reviewed row whose
// content changed is skipped with a warning (un-review it in the admin first); options are reconciled by label;
// nothing a candidate has answered is deleted.
//
// npx tsx --env-file=.env.development.local scripts/modelltest/seed.ts --skill hoeren --set 1 [--exam dtz]
// npx tsx --env-file=.env.local scripts/modelltest/seed.ts --skill hoeren --set 1 --production   (Hannes runs this)

import fs from "node:fs"
import path from "node:path"
import { createClient } from "@supabase/supabase-js"
import { isDeepStrictEqual } from "node:util"
import { itemNumbers, type KurztestItem } from "@/lib/exam/kurztest"
import type { MtBlock, MtSet } from "@/lib/modelltest/types"

const arg = (name: string) => {
  const i = process.argv.indexOf(`--${name}`)
  return i > -1 ? process.argv[i + 1] : undefined
}
const EXAM = arg("exam") ?? "dtz"
const SKILL = arg("skill")!
const SET = Number(arg("set"))
const NN = String(SET).padStart(2, "0")
if (!["hoeren", "lesen", "schreiben", "sprechen"].includes(SKILL) || !(SET >= 0 && SET <= 10)) throw new Error("Usage: --skill hoeren|lesen|schreiben|sprechen --set 0..10 [--exam dtz]")
const URL_ = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ""
const KEY = process.env.SUPABASE_SECRET_KEY
if (!KEY) throw new Error("SUPABASE_SECRET_KEY missing (run with --env-file=.env.development.local)")
/** The production project (Deutschtest Üben, eu-west-1). Seeding it needs the flag and exactly this URL. */
const PRODUCTION = "https://gtlxyzhlwrryrxodjooi.supabase.co"
const PROD = process.argv.includes("--production")
const local = /^http:\/\/(127\.0\.0\.1|localhost):/.test(URL_)
if (PROD ? URL_ !== PRODUCTION : !local) throw new Error(PROD ? `--production expects ${PRODUCTION}, got ${URL_}: run with --env-file=.env.local only` : `Refusing to seed ${URL_}: local stack only (production: --production)`)
console.log(`Seeding ${PROD ? "PRODUCTION" : "local"}: ${URL_}`)
// Realtime is never used here; the stub keeps supabase-js from requiring a native WebSocket (Node 20 has none).
const db = createClient(URL_, KEY, { auth: { persistSession: false, autoRefreshToken: false }, realtime: { transport: class {} as never } })

const FILE = `data/modelltest/${EXAM}/${SKILL}-${NN}.json`
const MINUTES: Record<string, number> = { lesen: 45, schreiben: 30, sprechen: 16 }
const warnings: string[] = []
const must = <T>(r: { data: T; error: { message: string } | null }, what: string) => {
  if (r.error) throw new Error(`${what}: ${r.error.message}`)
  return r.data
}

async function upload(bucket: "exam-audio" | "exam-images", src: string, dir: string, type: string) {
  const file = path.join(dir, src)
  if (!fs.existsSync(file)) return warnings.push(`missing file ${file}`)
  must(await db.storage.from(bucket).upload(src, fs.readFileSync(file), { contentType: type, upsert: true }), `upload ${src}`)
}

/** Every Storage file the set refers to. */
function media(set: MtSet) {
  const audio = new Set<string>()
  const images = new Set<string>()
  if (set.track) audio.add(set.track.src)
  for (const b of set.blocks) {
    if (b.display.clip?.src) audio.add(b.display.clip.src)
    for (const t of b.display.speaking?.turns ?? []) if (t.src) audio.add(t.src)
    for (const l of [...(b.key.live?.followups ?? []), ...(b.key.live?.partnerLines ?? [])]) if (l.src) audio.add(l.src)
    for (const p of Object.values(b.display.speaking?.photos ?? {})) if (p.src) images.add(p.src)
  }
  return { audio: [...audio], images: [...images] }
}

/** Upserts a content row by its natural key. Reviewed rows are left alone; a changed reviewed row is reported. */
async function upsertRow(table: "mt_stimuli" | "mt_open_tasks", match: Record<string, unknown>, row: Record<string, unknown>) {
  let q = db.from(table).select("id, review_status, display, key")
  for (const [k, v] of Object.entries(match)) q = q.eq(k, v as string)
  const existing = must(await q.maybeSingle(), `read ${table}`) as { id: string; review_status: string; display: unknown; key: unknown } | null
  if (!existing) return (must(await db.from(table).insert({ ...match, ...row }).select("id").single(), `insert ${table}`) as { id: string }).id
  if (existing.review_status === "reviewed") {
    const same = isDeepStrictEqual(existing.display, row.display) && isDeepStrictEqual(existing.key, row.key)
    if (!same) warnings.push(`${table} ${JSON.stringify(match)} is reviewed but the file changed: skipped. Un-review it in the admin to take the new version.`)
    return existing.id
  }
  must(await db.from(table).update(row).eq("id", existing.id), `update ${table}`)
  return existing.id
}

type Opt = { label: string; body: string | null; correct: boolean }
type Q = { n: number; format: "choice" | "rf" | "match" | "gap" | "picture"; prompt: string | null; options: Opt[] }

/** One question per item number, with its options and the right one marked (Beispiel answers come from exampleAnswers). */
function questions(b: MtBlock): Q[] {
  const examples = [...(b.exampleAnswers ?? [])]
  const correctOf = (n: number) => (n === 0 ? examples.shift() : String(b.key.answers.find((a) => a.n === n)?.correct ?? ""))
  const out: Q[] = []
  for (const it of b.display.items as KurztestItem[]) {
    if (it.type === "choice") {
      const c = correctOf(it.item.n)
      out.push({ n: it.item.n, format: "choice", prompt: it.item.prompt, options: it.item.options.map((o) => ({ label: o.key, body: o.label, correct: o.key === c })) })
    } else if (it.type === "picture") {
      const c = correctOf(it.item.n)
      out.push({ n: it.item.n, format: "picture", prompt: it.item.prompt, options: it.item.options.map((o) => ({ label: o.key, body: o.label ?? null, correct: o.key === c })) })
    } else if (it.type === "rf") {
      const c = correctOf(it.item.n)
      out.push({ n: it.item.n, format: "rf", prompt: it.item.statement, options: ["richtig", "falsch"].map((l) => ({ label: l, body: null, correct: l === c })) })
    } else if (it.type === "match") {
      for (const s of it.data.situations) {
        const c = correctOf(s.n)
        const labels = [...it.data.ads.map((a) => a.key), ...(it.noMatch ? ["x"] : [])]
        out.push({ n: s.n, format: "match", prompt: s.text, options: labels.map((l) => ({ label: l, body: null, correct: l === c })) })
      }
    } else if (it.type === "gap") {
      for (const p of it.data.parts) {
        if (typeof p === "string") continue
        const c = correctOf(p.n)
        out.push({ n: p.n, format: "gap", prompt: null, options: p.options.map((o) => ({ label: o, body: null, correct: o === c })) })
      }
    }
  }
  return out
}

async function seedQuestions(setId: string, stimulusId: string, b: MtBlock) {
  const want = questions(b)
  const have = must(await db.from("mt_questions").select("id, n").eq("stimulus_id", stimulusId).order("created_at").order("id"), "read questions") as { id: string; n: number }[]
  // A Beispiel can carry two items that are both n = 0 (Hören Teil 3): match the k-th item with number n to the k-th row.
  const nth = (list: { n: number }[], i: number) => list.slice(0, i).filter((x) => x.n === list[i].n).length
  const matched = new Set<string>()
  for (const [i, q] of want.entries()) {
    const key = b.key.answers.find((a) => a.n === q.n)
    const row = { format: q.format, prompt: q.prompt, explanation: key?.explanation ?? null, evidence: key?.evidence ?? null }
    if (q.options.filter((o) => o.correct).length !== 1) warnings.push(`item ${q.n}: ${q.options.filter((o) => o.correct).length} correct options`)
    const found = have.filter((h) => h.n === q.n)[nth(want, i)]
    if (found) matched.add(found.id)
    const qid = found
      ? (must(await db.from("mt_questions").update(row).eq("id", found.id), "update question"), found.id)
      : (must(await db.from("mt_questions").insert({ ...row, stimulus_id: stimulusId, set_id: setId, n: q.n, example: q.n === 0 }).select("id").single(), `insert item ${q.n}`) as { id: string }).id
    // Reconcile options by label: clear the old right answer first (one correct per question), then upsert.
    must(await db.from("mt_options").update({ is_correct: false }).eq("question_id", qid), "reset correct")
    must(await db.from("mt_options").upsert(q.options.map((o, i) => ({ question_id: qid, label: o.label, body: o.body, sort_order: i, is_correct: o.correct })), { onConflict: "question_id,label" }), `options item ${q.n}`)
    const stale = (must(await db.from("mt_options").select("id, label").eq("question_id", qid), "read options") as { id: string; label: string }[]).filter((o) => !q.options.some((w) => w.label === o.label))
    // A stale option goes only while no candidate has picked it (answers store the label); otherwise it stays, with a warning.
    for (const o of stale) {
      const { count, error } = await db.from("mt_answers").select("id", { count: "exact", head: true }).eq("question_id", qid).eq("chosen", o.label)
      if (error) throw new Error(`read answers: ${error.message}`)
      if (count) warnings.push(`item ${q.n}: option ${o.label} is no longer in the file (kept: ${count} answers chose it)`)
      else must(await db.from("mt_options").delete().eq("id", o.id), `delete stale option ${o.label}`)
    }
  }
  for (const h of have.filter((h) => !matched.has(h.id))) {
    const { count, error } = await db.from("mt_answers").select("id", { count: "exact", head: true }).eq("question_id", h.id)
    if (error) throw new Error(`count answers: ${error.message}`)
    if (!count) must(await db.from("mt_questions").delete().eq("id", h.id), "delete question")
    else warnings.push(`item ${h.n} is gone from the file but has answers: kept`)
  }
}

async function main() {
  const set = JSON.parse(fs.readFileSync(FILE, "utf8")) as MtSet
  const duration = set.track ? Math.round(set.track.duration) : MINUTES[SKILL] * 60
  const setRow = must(await db.from("mt_sets").upsert({ exam: EXAM, skill: SKILL, number: SET, title: set.title, is_free: SET === 1, duration_seconds: duration, track: set.track ?? null }, { onConflict: "exam,skill,number" }).select("id").single(), "upsert set") as { id: string }

  const { audio, images } = media(set)
  for (const src of audio) await upload("exam-audio", src, ".unit-cache/audio", "audio/mpeg")
  for (const src of images) await upload("exam-images", src, ".unit-cache/images", "image/webp")

  const open = SKILL === "schreiben" || SKILL === "sprechen"
  const order = new Map<number, number>()
  for (const b of set.blocks) {
    const sort = order.get(b.teil) ?? 0
    order.set(b.teil, sort + 1)
    const display = { blockId: b.id, ...(b.example ? { example: true } : {}), ...(b.sound ? { sound: b.sound } : {}), ...(b.exampleAnswers ? { exampleAnswers: b.exampleAnswers } : {}), ...b.display }
    if (open) {
      await upsertRow("mt_open_tasks", { set_id: setRow.id, teil: b.teil, sort_order: sort }, { kind: SKILL, display, key: b.key, generated: b.generated })
      continue
    }
    const kind = b.display.clip ? "audio" : "text"
    const stimulusId = await upsertRow("mt_stimuli", { set_id: setRow.id, teil: b.teil, sort_order: sort }, {
      kind, text_type: b.generated.textType, display, key: b.key, generated: b.generated,
      audio_path: kind === "audio" ? b.display.clip?.src || set.track?.src || null : null,
      audio_seconds: b.display.clip?.duration || null,
    })
    await seedQuestions(setRow.id, stimulusId, b)
  }

  const counts = await Promise.all(["mt_stimuli", "mt_questions", "mt_open_tasks"].map(async (t) => `${t} ${(await db.from(t).select("id", { count: "exact", head: true }).eq("set_id", setRow.id)).count}`))
  const options = (await db.from("mt_options").select("id, mt_questions!inner(set_id)", { count: "exact", head: true }).eq("mt_questions.set_id", setRow.id)).count
  console.log(`${EXAM} ${SKILL} ${NN}: ${counts.join(", ")}, mt_options ${options}; uploaded ${audio.length} audio, ${images.length} images`)
  if (warnings.length) console.log(`warnings:\n- ${warnings.join("\n- ")}`)
}

main().catch((e) => {
  console.error(e instanceof Error ? e.message : e)
  process.exit(1)
})
