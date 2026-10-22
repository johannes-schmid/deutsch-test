"use client"

import { useEffect, useState } from "react"
import { Check, Mic, Square } from "lucide-react"
import { cn } from "@/lib/utils"
import { pictoIcon } from "@/lib/exam/pictos"
import type { Person, SpeakingData, Turn } from "@/lib/exam/types"
import { fmt, useExamCopy } from "./primitives"

const LEVEL = [4, 9, 14, 20, 26, 18, 10, 22, 30, 16, 8, 12]

/** Pair exam: examiner and partner are people with turns; the learner answers with the mic. */
/** `photo`: DTZ Teil 2, the picture the current speaker talks about (each candidate has a different one). */
export function SpeakingTask({ data, people, turns, covered = [], onRecordStart, onRecordStop, canRecord = true, idleLabel, photo }: { data: SpeakingData; people: Record<Turn["who"], Person>; turns: Turn[]; covered?: string[]; onRecordStart?: () => void; onRecordStop?: () => void; canRecord?: boolean; idleLabel?: string; photo?: { src?: string; alt: string; caption?: string; credit?: { name: string; url: string } } }) {
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
      <div className="flex flex-col gap-2 border-b border-v-line p-5">
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
