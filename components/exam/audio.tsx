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

export type ExamTrackCue = { teil: number; phase: "instruction" | "reading" | "clip" | "answer"; items: number[]; from: number; to: number }
export type ExamTrackData = { src: string; duration: number; cues: ExamTrackCue[] }

/**
 * The whole Hören part as one track, as in the real exam: one start, then it runs to the end. No pause, no seek, no
 * replay. `cue` is where the track is now, so the runner can show the matching task.
 */
export function useExamTrack(track: ExamTrackData) {
  const [time, setTime] = useState(0)
  const [state, setState] = useState<"idle" | "playing" | "blocked" | "ended">("idle")
  const audio = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    if (!track.src) return
    const el = new Audio(track.src)
    el.preload = "auto"
    el.ontimeupdate = () => setTime(el.currentTime)
    el.onended = () => { setTime(track.duration); setState("ended") }
    // The exam does not stop when the candidate looks away; only the OS can pause us (calls, headphones out).
    el.onpause = () => !el.ended && setState((s) => (s === "playing" ? "blocked" : s))
    audio.current = el
    return () => { el.onpause = null; el.pause(); audio.current = null }
  }, [track.src, track.duration])

  const start = () => {
    const el = audio.current
    if (!el || state === "playing" || state === "ended") return
    void el.play().then(() => setState("playing")).catch(() => setState("blocked"))
  }

  const cue = track.cues.findLast((c) => c.from <= time) ?? track.cues[0]
  return { time, state, cue, left: Math.max(0, track.duration - time), progress: Math.min(1, time / track.duration), start }
}

/** The track's face: start once, then Teil segments filling up, the current phase and what is left. */
export function ExamTrack({ track, player }: { track: ExamTrackData; player: ReturnType<typeof useExamTrack> }) {
  const t = useExamCopy()
  const teile = [...new Set(track.cues.map((c) => c.teil))].map((teil) => {
    const own = track.cues.filter((c) => c.teil === teil)
    return { teil, from: own[0].from, to: own.at(-1)!.to }
  })
  const { state, cue, time } = player
  const idle = state === "idle" || state === "blocked"
  const status = state === "ended" ? t.track.ended : idle ? t.track.startNote : [`${t.part} ${cue.teil}`, t.track.item(cue.items), t.track.phase[cue.phase]].filter(Boolean).join(" · ")
  return (
    <div className="flex items-center gap-4 rounded-[20px] bg-v-soft p-3 pe-4">
      <button
        type="button"
        onClick={player.start}
        disabled={!idle}
        aria-label={t.track.start}
        className="relative grid size-14 shrink-0 cursor-pointer place-items-center rounded-full transition-transform duration-150 ease-out active:scale-95 disabled:cursor-default"
      >
        <Ring progress={player.progress} />
        <span className={cn("grid size-10 place-items-center rounded-full transition-colors duration-200", idle ? "bg-v-ink text-v-bg" : "bg-v-surface", state === "ended" && "text-v-muted")}>
          {state === "ended" ? <Check className="size-5" strokeWidth={2.5} aria-hidden="true" /> : idle ? <Play className="ml-0.5 size-5 fill-current" aria-hidden="true" /> : <Lock className="size-4" aria-hidden="true" />}
        </span>
      </button>
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <p className="truncate text-[14.5px] font-medium" aria-live="polite">{status}</p>
        <div className="flex gap-1" aria-hidden="true">
          {teile.map((x) => (
            <span key={x.teil} className="h-1.5 overflow-hidden rounded-full bg-v-ink/10" style={{ flex: x.to - x.from }}>
              <span className="block h-full rounded-full bg-v-ink transition-[width] duration-250 ease-linear" style={{ width: `${Math.max(0, Math.min(1, (time - x.from) / (x.to - x.from))) * 100}%` }} />
            </span>
          ))}
        </div>
      </div>
      {idle && state === "idle" ? null : <span className="v-num shrink-0 text-[13px] text-v-muted">{fmt(player.left)}</span>}
    </div>
  )
}
