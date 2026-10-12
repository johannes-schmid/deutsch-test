"use client"

import { useEffect, useRef, useState } from "react"
import { Check, Lock, Play } from "lucide-react"
import { cn } from "@/lib/utils"
import type { AudioClip } from "@/lib/exam/types"
import { fmt, useExamCopy } from "./primitives"

/**
 * Exam playback: plays to the end, no pause, no seek, a fixed number of plays.
 * With `src` it drives a real <audio>; without, it simulates the clip (design previews).
 */
export function useExamAudio(clip: AudioClip, onDone?: () => void) {
  const [time, setTime] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [count, setCount] = useState(0)
  const audio = useRef<HTMLAudioElement | null>(null)
  const done = useRef(onDone)
  useEffect(() => { done.current = onDone })

  useEffect(() => {
    if (!clip.src) return
    const el = new Audio(clip.src)
    el.preload = "auto"
    el.ontimeupdate = () => setTime(el.currentTime)
    el.onended = () => { setPlaying(false); setTime(clip.duration) }
    audio.current = el
    return () => { el.pause(); audio.current = null }
  }, [clip.src, clip.duration])

  useEffect(() => {
    if (!playing || clip.src) return
    const id = setInterval(() => setTime((t) => {
      const next = Math.min(t + 0.25, clip.duration)
      if (next >= clip.duration) setPlaying(false)
      return next
    }), 250)
    return () => clearInterval(id)
  }, [playing, clip.src, clip.duration])

  useEffect(() => {
    if (!playing && count >= clip.plays && time >= clip.duration) done.current?.()
  }, [playing, count, time, clip.plays, clip.duration])

  const start = () => {
    if (playing || count >= clip.plays) return
    setTime(0)
    setCount((c) => c + 1)
    setPlaying(true)
    if (audio.current) { audio.current.currentTime = 0; void audio.current.play() }
  }

  const left = clip.plays - count
  return { time, playing, count, left, progress: Math.min(1, time / clip.duration), finished: !playing && left === 0 && time >= clip.duration, start }
}

const BARS = [10, 18, 26, 14, 30, 22, 12, 28, 34, 18, 12, 24, 32, 16, 10, 20, 28, 14, 8, 20, 26, 12, 18, 10, 22, 14, 18, 10, 24, 16, 12, 20]

function Ring({ progress }: { progress: number }) {
  const r = 46
  const c = 2 * Math.PI * r
  return (
    <svg viewBox="0 0 100 100" className="absolute inset-0 size-full -rotate-90" aria-hidden="true">
      <circle cx="50" cy="50" r={r} fill="none" stroke="currentColor" strokeOpacity={0.12} strokeWidth="3" />
      <circle cx="50" cy="50" r={r} fill="none" stroke="var(--p-glow)" strokeWidth="3.5" strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c * (1 - progress)} className="transition-[stroke-dashoffset] duration-250 ease-linear" />
    </svg>
  )
}

export function ExamAudio({ clip, onDone, showLock = true }: { clip: AudioClip; onDone?: () => void; showLock?: boolean }) {
  const t = useExamCopy()
  const p = useExamAudio(clip, onDone)
  const speaking = p.playing ? clip.segments.find((s) => p.time >= s.from && p.time < s.to)?.speaker : undefined
  const ids = [...new Set(clip.segments.map((s) => s.speaker))]
  return (
    <div className="flex flex-col items-center gap-5 py-2">
      <button
        type="button"
        onClick={p.start}
        disabled={p.playing || p.left === 0}
        aria-label={p.finished ? t.heard : `${t.play}: ${clip.situation}`}
        className="relative grid size-28 cursor-pointer place-items-center rounded-full transition-transform duration-150 ease-out active:scale-95 disabled:cursor-default"
      >
        <Ring progress={p.progress} />
        <span className={cn("grid size-20 place-items-center rounded-full transition-colors duration-200", p.playing || p.finished ? "bg-v-soft" : "bg-v-ink text-v-bg", p.finished && "text-v-muted")}>
          {p.finished ? <Check className="size-7" strokeWidth={2.5} aria-hidden="true" /> : p.playing ? <span className="v-num text-[18px] font-medium">{fmt(p.time)}</span> : <Play className="ml-1 size-8 fill-current" aria-hidden="true" />}
        </span>
      </button>
      <div className="flex h-9 w-full max-w-[320px] items-center gap-[3px]" aria-hidden="true">
        {BARS.map((h, i) => (
          <span key={i} style={{ height: h }} className={cn("flex-1 rounded-full transition-colors duration-200", i / BARS.length < p.progress ? "bg-v-ink" : "bg-v-ink/15")} />
        ))}
      </div>
      {ids.length ? (
        <div className="flex flex-wrap justify-center gap-2">
          {ids.map((id) => (
            <span key={id} className={cn("flex items-center gap-2 rounded-full border py-1 pr-3 pl-1 text-[13px] transition-[border-color,background-color] duration-200", speaking === id ? "border-v-ink bg-v-surface" : "border-v-line")}>
              <span className={cn("size-6 rounded-full transition-transform duration-200 ease-out", speaking === id && "scale-110")} style={{ background: clip.speakers[id]?.tone }} />
              {clip.speakers[id]?.name}
            </span>
          ))}
        </div>
      ) : null}
      <p className="text-center text-[13.5px] text-v-muted" aria-live="polite">
        {p.finished ? t.noReplay : `${clip.situation} · ${clip.plays === 1 ? t.hearOnce : t.hearTwice}${clip.plays > 1 && p.count > 0 && p.left > 0 ? ` · ${t.playsLeft(p.left)}` : ""}`}
      </p>
      {showLock ? (
        <span className="flex items-center gap-2 text-[12.5px] text-v-muted">
          <Lock className="size-3.5" aria-hidden="true" /> {t.transcriptLocked}
        </span>
      ) : null}
    </div>
  )
}
