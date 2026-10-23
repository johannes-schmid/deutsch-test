"use client"

import { useEffect, useRef, useState, type ReactNode } from "react"
import { Info, Pause, Play, type LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import type { PartId } from "@/lib/exam/types"
import { PartIcon } from "@/components/design/variants/nachtzug-icons"
import { ExamButton, fmt, useExamCopy } from "./primitives"

/**
 * Before each part: what comes, how long, and the rules that differ from normal practice.
 * `about` explains what happens (free tests); `action` replaces the start button (e.g. an email form).
 */
export function PartIntro({ part, name, minutes, count, teile, rules, about, action, onStart }: { part: PartId; name: string; minutes: number; count: number; teile: { label: string; detail: string }[]; rules: { icon: LucideIcon; text: string }[]; about?: ReactNode; action?: ReactNode; onStart?: () => void }) {
  const t = useExamCopy()
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <PartIcon part={part} size="lg" />
        <div className="flex flex-col">
          <h2 className="text-[30px] leading-none font-semibold tracking-[-0.03em]">{name}</h2>
          <span className="v-num mt-1.5 text-[14px] text-v-muted">{minutes} {t.minutes} · {t.items(count)}</span>
        </div>
      </div>
      {about ? <div className="flex flex-col gap-2 text-[15.5px] leading-relaxed">{about}</div> : null}
      <ol className="flex flex-col">
        {teile.map((x) => (
          <li key={x.label} className="flex items-baseline justify-between gap-4 border-b border-v-line py-3 text-[15.5px] last:border-b-0">
            <b className="font-semibold">{x.label}</b>
            <span className="text-right text-v-muted">{x.detail}</span>
          </li>
        ))}
      </ol>
      <ul className="flex flex-col gap-2 rounded-2xl bg-v-soft p-4">
        {rules.map((r) => (
          <li key={r.text} className="flex items-center gap-3 text-[15px]">
            <r.icon className="size-4.5 shrink-0" strokeWidth={2} aria-hidden="true" />
            {r.text}
          </li>
        ))}
      </ul>
      {action ?? (onStart ? <ExamButton onClick={onStart} className="w-full">{t.start}</ExamButton> : null)}
    </div>
  )
}

/**
 * The "Anleitung" before a Modelltest part, like the official exam's front page: a lead, the rules as numbered
 * steps in the Sie-form, and an optional spoken version that can be paused and replayed (it is not exam audio).
 */
export function ExamInstructions({ title, lead, teileTitle, teile, steps, together, audio, action }: { title: string; lead: string; teileTitle?: string; teile?: { label?: string; name: string; what: string; meta?: string }[]; steps: string[]; together?: { title: string; lines: string[] }; audio?: string; action?: ReactNode }) {
  const t = useExamCopy()
  return (
    <div className="flex flex-col gap-7">
      <div className="flex flex-col gap-2">
        <span className="flex items-center gap-2 text-[14px] font-medium text-v-muted">
          <Info className="size-4" strokeWidth={2} aria-hidden="true" />
          {t.instructions}
        </span>
        <h2 className="text-[28px] leading-tight font-semibold tracking-[-0.03em]">{title}</h2>
        <p className="text-[16px] leading-relaxed">{lead}</p>
      </div>
      {audio ? <InstructionAudio src={audio} /> : null}
      {teile?.length ? (
        <section className="flex flex-col gap-1">
          <h3 className="text-[17px] font-semibold tracking-[-0.01em]">{teileTitle}</h3>
          <ol className="flex flex-col">
            {teile.map((x) => (
              <li key={x.name} className={cn("grid gap-x-2 border-b border-v-line py-3.5 last:border-b-0 sm:gap-x-3", x.label ? "grid-cols-[3.5rem_1fr] sm:grid-cols-[4.25rem_1fr]" : "grid-cols-1")}>
                {x.label ? <span className="v-num pt-0.5 text-[13px] font-medium text-v-muted">{x.label}</span> : null}
                <div className="flex flex-col gap-1">
                  <span className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5">
                    <b className="text-[15.5px] font-semibold">{x.name}</b>
                    {x.meta ? <span className="text-[13.5px] text-v-muted">{x.meta}</span> : null}
                  </span>
                  <span className="text-[15px] leading-relaxed text-v-muted">{x.what}</span>
                </div>
              </li>
            ))}
          </ol>
        </section>
      ) : null}
      <section className="flex flex-col gap-3.5">
        <h3 className="text-[17px] font-semibold tracking-[-0.01em]">{t.howItWorks}</h3>
        <ol className="flex flex-col gap-3.5">
          {steps.map((s, i) => (
            <li key={s} className="flex gap-3 text-[15.5px] leading-relaxed">
              <span className="v-num grid size-6.5 shrink-0 place-items-center rounded-full bg-v-soft text-[13px] font-medium">{i + 1}</span>
              <span className="pt-px">{s}</span>
            </li>
          ))}
        </ol>
      </section>
      {together ? (
        <section className="flex flex-col gap-2.5 rounded-2xl bg-v-soft p-4 sm:p-5">
          <h3 className="text-[15.5px] font-semibold">{together.title}</h3>
          <ul className="flex flex-col gap-2">
            {together.lines.map((l) => (
              <li key={l} className="text-[14.5px] leading-relaxed">{l}</li>
            ))}
          </ul>
        </section>
      ) : null}
      {action}
    </div>
  )
}

function InstructionAudio({ src }: { src: string }) {
  const t = useExamCopy()
  const el = useRef<HTMLAudioElement>(null)
  const [time, setTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [broken, setBroken] = useState(false)
  useEffect(() => {
    const a = el.current
    const stop = () => a?.pause()
    window.addEventListener("pagehide", stop)
    return () => {
      window.removeEventListener("pagehide", stop)
      stop()
    }
  }, [])
  if (broken) return null
  const toggle = () => {
    const a = el.current
    if (!a) return
    if (a.paused) void a.play().catch(() => setPlaying(false))
    else a.pause()
  }
  const progress = duration ? Math.min(1, time / duration) : 0
  return (
    <div className="flex items-center gap-4 rounded-2xl bg-v-soft p-3 pr-4">
      <audio
        ref={el}
        src={src}
        preload="metadata"
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
        onTimeUpdate={(e) => setTime(e.currentTarget.currentTime)}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => setTime(0)}
        onError={() => setBroken(true)}
      />
      <button
        type="button"
        onClick={toggle}
        aria-label={`${t.instructions}: ${playing ? t.pause : t.play}`}
        className="grid size-11 shrink-0 cursor-pointer place-items-center rounded-full bg-v-ink text-v-bg transition-transform duration-150 ease-out active:scale-95"
      >
        {playing ? <Pause className="size-4.5 fill-current" aria-hidden="true" /> : <Play className="ml-0.5 size-4.5 fill-current" aria-hidden="true" />}
      </button>
      <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-v-ink/12" aria-hidden="true">
        <span className="block h-full origin-left rounded-full bg-v-ink transition-transform duration-250 ease-linear" style={{ transform: `scaleX(${progress})` }} />
      </span>
      {duration ? <span className="v-num shrink-0 text-[13px] text-v-muted">{fmt(time)} / {fmt(duration)}</span> : null}
    </div>
  )
}
