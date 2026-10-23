"use client"

import { useEffect, useState, type ReactNode } from "react"
import { Check, ChevronDown, Mic, NotebookPen, Square } from "lucide-react"
import { cn } from "@/lib/utils"
import { pictoIcon } from "@/lib/exam/pictos"
import type { Person, SpeakingData, Turn } from "@/lib/exam/types"
import { fmt, useExamCopy } from "./primitives"

const LEVEL = [4, 9, 14, 20, 26, 18, 10, 22, 30, 16, 8, 12]

/** Pair exam: examiner and partner are people with turns; the learner answers with the mic. */
/** `photo`: DTZ Teil 2, the picture the current speaker talks about (each candidate has a different one). */
/** `sheet`: a printed task sheet (telc, `SpeakingSheet`) in place of the task line and point chips. */
export function SpeakingTask({ data, people, turns, covered = [], onRecordStart, onRecordStop, canRecord = true, idleLabel, photo, sheet }: { data: SpeakingData; people: Record<Turn["who"], Person>; turns: Turn[]; covered?: string[]; onRecordStart?: () => void; onRecordStop?: () => void; canRecord?: boolean; idleLabel?: string; photo?: { src?: string; alt: string; caption?: string; credit?: { name: string; url: string } }; sheet?: ReactNode }) {
  const t = useExamCopy()
  const [rec, setRec] = useState(false)
  const [secs, setSecs] = useState(0)
  const [tick, setTick] = useState(0)
  useEffect(() => {
    if (!rec) return
    const s = setInterval(() => setSecs((x) => x + 1), 1000)
    const l = setInterval(() => setTick((x) => x + 1), 140)
    return () => { clearInterval(s); clearInterval(l) }
  }, [rec])
  const toggle = () => {
    if (rec) { onRecordStop?.(); setSecs(0) } else onRecordStart?.()
    setRec((r) => !r)
  }
  return (
    <div className="-mx-5 -mt-6 -mb-5 flex flex-col">
      {sheet ? <div className="border-b border-v-line p-3 sm:p-4">{sheet}</div> : null}
      <div className={cn("flex flex-col gap-2 border-b border-v-line p-5", sheet && "hidden")}>
        <span className="text-[13px] text-v-muted">{data.part} · {data.title}</span>
        <p className="text-[16px] leading-snug font-semibold">{data.task}</p>
        <div className="flex flex-wrap gap-1.5">
          {data.points.map((p) => {
            const on = covered.includes(p)
            return (
              <span key={p} className={cn("flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[13px] transition-colors duration-300", on ? "bg-(--p-glow) text-[#0A0D18]" : "bg-v-soft")}>
                {on ? <Check className="size-3.5" strokeWidth={3} aria-hidden="true" /> : null}
                {p}
              </span>
            )
          })}
        </div>
        {photo?.src ? (
          <figure className="mt-2 flex flex-col gap-1.5">
            {/* eslint-disable-next-line @next/next/no-img-element -- 1200 px WebP from our own Storage */}
            <img src={photo.src} alt={photo.alt} width={1200} height={800} className="aspect-[3/2] w-full rounded-2xl bg-v-soft object-cover" />
            <figcaption className="flex flex-wrap justify-between gap-x-3 text-[12.5px] text-v-muted">
              <span>{photo.caption}</span>
              {photo.credit ? <a href={photo.credit.url} target="_blank" rel="noreferrer" className="underline decoration-v-ink/20 underline-offset-4 hover:text-v-ink">Foto: {photo.credit.name} / Pexels</a> : null}
            </figcaption>
          </figure>
        ) : null}
        {data.cards?.length ? (
          <div className="mt-2 flex flex-col gap-2">
            <span className="text-[13px] text-v-muted">{t.cards}</span>
            <ul className="flex flex-wrap gap-2">
              {data.cards.map((c) => {
                const Icon = pictoIcon(c.picto)
                return (
                  <li key={c.label} className="flex min-h-14 items-center gap-2.5 rounded-xl border border-v-line bg-v-surface px-3.5 py-2 text-[14.5px] leading-snug font-medium">
                    {Icon ? <Icon className="size-7 shrink-0" strokeWidth={1.4} aria-hidden="true" /> : null}
                    {c.label}
                  </li>
                )
              })}
            </ul>
          </div>
        ) : null}
      </div>
      <div className="flex flex-col gap-3 p-5" aria-live="polite">
        {turns.map((turn, i) => {
          const me = turn.who === "du"
          const p = people[turn.who]
          return (
            <div key={i} className={cn("flex items-end gap-2", me && "flex-row-reverse")}>
              <span className="grid size-8 shrink-0 place-items-center rounded-full text-[11px] font-semibold text-[#0A0D18]" style={{ background: p.tone }} aria-label={p.name}>{p.initial}</span>
              <p className={cn("max-w-[80%] rounded-2xl px-4 py-2.5 text-[15px] leading-snug", me ? "rounded-br-md bg-v-ink text-v-bg" : "rounded-bl-md bg-v-soft", turn.who === "pruefer" && "bg-transparent px-0 text-[13.5px] text-v-muted")}>
                {turn.text}
              </p>
            </div>
          )
        })}
      </div>
      <div className="flex flex-col items-center gap-3 border-t border-v-line bg-v-surface/60 p-5">
        <div className="flex h-8 items-center gap-1" aria-hidden="true">
          {LEVEL.map((h, i) => (
            <span key={i} className="w-1.5 rounded-full bg-v-ink transition-[height] duration-150 ease-out" style={{ height: rec ? Math.max(4, ((h * ((tick + i) % 5)) / 4) % 32) : 4, opacity: rec ? 1 : 0.2 }} />
          ))}
        </div>
        <button type="button" onClick={toggle} disabled={!canRecord && !rec} aria-pressed={rec} aria-label={rec ? t.stopRecording : t.record} className={cn("grid size-18 cursor-pointer place-items-center rounded-full transition-[transform,background-color] duration-150 ease-out active:scale-95 disabled:cursor-default disabled:opacity-30 disabled:active:scale-100", rec ? "nz-rec bg-(--p-glow) text-[#0A0D18]" : "bg-v-ink text-v-bg")}>
          {rec ? <Square className="size-6 fill-current" aria-hidden="true" /> : <Mic className="size-7" aria-hidden="true" />}
        </button>
        <span className="text-[13.5px] text-v-muted">{rec ? <>{t.recording} · <span className="v-num">{fmt(secs)}</span></> : idleLabel ?? t.yourTurn(people.partner.name)}</span>
      </div>
    </div>
  )
}

const label = "v-num text-[11.5px] tracking-[0.08em] text-v-muted uppercase"

export type SheetKind = "topics" | "opinion" | "plan"

/** "Name, 52 Jahre, Beruf: „…“" → the quote and who said it. */
function opinion(text: string) {
  const m = text.match(/^(.+?):\s*„([\s\S]+)“\s*$/)
  return m ? { by: m[1], quote: m[2] } : { by: "", quote: text }
}

/**
 * A printed task sheet of a pair exam (telc Mündlicher Ausdruck): paper with the Teil as a mono label and, by kind,
 * the cue topics (Teil 1), one quoted opinion from a magazine with name, age and job (Teil 2) or the planning list
 * ending in "…" (Teil 3). `tag` says whose sheet it is.
 */
export function SpeakingSheet({ label: head, task, kind, title, points, tag, className }: { label: string; task: string; kind: SheetKind; title: string; points: string[]; tag?: string; className?: string }) {
  const t = useExamCopy()
  return (
    <article lang="de" className={cn("flex flex-col gap-4 rounded-[14px] bg-v-surface p-5 ring-1 ring-v-line sm:p-6", className)}>
      <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
        <span className={label}>{head}</span>
        {tag ? <span className="text-[12.5px] text-v-muted">{tag}</span> : null}
      </div>
      <p className="text-[15.5px] leading-[1.6] text-pretty">{task}</p>
      {kind === "topics" ? (
        <ul className="grid gap-x-6 sm:grid-cols-2">
          {points.map((p) => (
            <li key={p} className="border-t border-v-line py-2.5 text-[16px] font-medium">{p}</li>
          ))}
        </ul>
      ) : kind === "opinion" ? (
        <div className="flex flex-col gap-3 border-t border-v-line pt-4">
          <span className={label}>{t.magazine}</span>
          <h3 className="text-[22px] leading-tight font-semibold tracking-[-0.015em] text-balance">{title}</h3>
          {points.map((p) => {
            const o = opinion(p)
            return (
              <figure key={p} className="flex flex-col gap-2.5">
                <blockquote className="border-s-2 border-v-ink ps-4 text-[17px] leading-[1.65] text-pretty">„{o.quote}“</blockquote>
                {o.by ? <figcaption className="ps-4 text-[14px] text-v-muted">{o.by}</figcaption> : null}
              </figure>
            )
          })}
        </div>
      ) : (
        <div className="flex flex-col gap-1 border-t border-v-line pt-4">
          <h3 className="mb-1 text-[18px] font-semibold tracking-[-0.01em]">{title}</h3>
          <ul className="flex flex-col">
            {points.map((p) => (
              <li key={p} className="flex items-baseline gap-3 py-1.5 text-[16px]">
                <span className="size-1.5 shrink-0 translate-y-[-2px] rounded-full bg-v-ink" aria-hidden="true" />
                {p}
              </li>
            ))}
          </ul>
        </div>
      )}
    </article>
  )
}

/**
 * The sheet during the talk: folded to its label and a compact line (cue words, or the quote's author) so the turns
 * and the mic stay in view on a phone; one tap opens the full sheet.
 */
export function SheetPeek(props: { label: string; task: string; kind: SheetKind; title: string; points: string[]; tag?: string }) {
  const [open, setOpen] = useState(false)
  const compact = props.kind === "opinion" ? props.points.map((p) => opinion(p).by).filter(Boolean) : props.points
  return (
    <div className="flex flex-col gap-2">
      <button type="button" onClick={() => setOpen((o) => !o)} aria-expanded={open} className="flex min-h-11 w-full cursor-pointer items-center gap-2 rounded-xl px-2 text-start">
        <span className={cn(label, "flex-1")}>{props.label}</span>
        <ChevronDown className={cn("size-4 shrink-0 text-v-muted transition-transform duration-200 ease-out", open && "rotate-180")} aria-hidden="true" />
      </button>
      {open ? (
        <SpeakingSheet {...props} />
      ) : (
        <div className="flex flex-wrap gap-1.5 px-2 pb-1">
          {props.kind === "opinion" ? <span className="text-[15px] font-semibold">{props.title}</span> : null}
          {compact.map((p) => (
            <span key={p} className={cn("text-[13px]", props.kind === "opinion" ? "text-v-muted" : "rounded-full bg-v-soft px-3 py-1.5")}>{props.kind === "opinion" ? `· ${p}` : p}</span>
          ))}
        </div>
      )}
    </div>
  )
}

/**
 * The preparation before a pair exam (telc: 20 minutes with all sheets): the sheets, then a notes pad. Notes stay on
 * this device and are shown during the talk; the exam says to use them but not to read them out.
 */
export function SpeakingPrep({ sheets, notes, onNotes, lead }: { sheets: ReactNode; notes: string; onNotes: (v: string) => void; lead: string }) {
  const t = useExamCopy()
  return (
    <div className="flex flex-col gap-5">
      <p className="text-[15px] leading-relaxed text-v-muted">{lead}</p>
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
        <div className="flex flex-col gap-4">{sheets}</div>
        <label className="flex flex-col gap-2 lg:sticky lg:top-20">
          <span className="flex items-center gap-2 text-[15px] font-semibold">
            <NotebookPen className="size-4" aria-hidden="true" /> {t.notes}
          </span>
          <textarea
            value={notes}
            onChange={(e) => onNotes(e.target.value.slice(0, 2000))}
            placeholder={t.notesPlaceholder}
            rows={10}
            className="min-h-[220px] w-full resize-y rounded-2xl border border-v-line bg-v-surface p-4 text-[16px] leading-relaxed outline-none placeholder:text-v-muted focus-visible:ring-2 focus-visible:ring-v-ink/40 lg:min-h-[420px]"
          />
          <span className="text-[13px] leading-snug text-v-muted">{t.notesHint}</span>
        </label>
      </div>
    </div>
  )
}

/** During the talk: the notes from the preparation, folded away by default. */
export function NotesPeek({ notes }: { notes: string }) {
  const t = useExamCopy()
  const [open, setOpen] = useState(false)
  if (!notes.trim()) return null
  return (
    <div className="rounded-2xl bg-v-soft">
      <button type="button" onClick={() => setOpen((o) => !o)} aria-expanded={open} className="flex min-h-11 w-full cursor-pointer items-center gap-2 px-4 text-[14.5px] font-semibold">
        <NotebookPen className="size-4" aria-hidden="true" />
        {t.notes}
        <span className="ms-auto text-[12.5px] font-normal text-v-muted">{t.notesHintShort}</span>
        <ChevronDown className={cn("size-4 transition-transform duration-200 ease-out", open && "rotate-180")} aria-hidden="true" />
      </button>
      {open ? <p className="px-4 pb-4 text-[15px] leading-relaxed whitespace-pre-line">{notes}</p> : null}
    </div>
  )
}
