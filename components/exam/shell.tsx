"use client"

import { useEffect, useRef, useState, type ReactNode } from "react"
import { createPortal } from "react-dom"
import { Grid2x2, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { PartIcon } from "@/components/design/variants/nachtzug-icons"
import type { OverviewItem, PartId, Scene } from "@/lib/exam/types"
import { ExamButton, fmt, useExamCopy } from "./primitives"

const SCENES: Record<Scene, string> = {
  intro: "var(--g-photo-6)",
  hoeren: "var(--g-photo-1)",
  lesen: "var(--g-photo-3)",
  schreiben: "var(--g-photo-2)",
  sprechen: "var(--g-photo-4)",
  ergebnis: "var(--g-photo-5)",
}

/** The blurred photo field every exam screen sits on. `framed` for previews inside a page. */
export function ExamStage({ scene, framed, className, children }: { scene: Scene; framed?: boolean; className?: string; children: ReactNode }) {
  return (
    <div
      style={{ ["--photo" as string]: SCENES[scene] }}
      className={cn("photo v-noise", framed ? "rounded-[28px] p-3 sm:p-6" : "min-h-dvh px-3 py-4 sm:px-6 sm:py-8", className)}
    >
      {children}
    </div>
  )
}

/**
 * Focus mode, after inburgeringoefenen.nl's player: once a test starts it takes the whole screen, with no site nav,
 * page header or footer. A fixed layer over the page (portalled into the nearest `.v-frame` for the tokens), the
 * photo field pinned behind it, the page itself locked so only the layer scrolls. Dialogs (z-50) still sit above it.
 */
export function FocusLayer({ scene, label, children }: { scene: Scene; label: string; children: ReactNode }) {
  const anchor = useRef<HTMLSpanElement>(null)
  const [frame, setFrame] = useState<HTMLElement | null>(null)
  useEffect(() => setFrame(anchor.current?.closest<HTMLElement>(".v-frame") ?? document.body), [])
  useEffect(() => {
    const root = document.documentElement
    const prev = root.style.overflow
    root.style.overflow = "hidden"
    return () => {
      root.style.overflow = prev
    }
  }, [])
  return (
    <>
      <span ref={anchor} hidden />
      {frame
        ? createPortal(
            <div aria-label={label} className="fixed inset-0 z-40 overflow-y-auto overscroll-contain">
              <div aria-hidden="true" className="pointer-events-none fixed inset-0">
                <div style={{ ["--photo" as string]: SCENES[scene] }} className="photo v-noise h-full" />
              </div>
              <div className="relative px-3 py-3 sm:px-6 sm:py-5">{children}</div>
            </div>,
            frame
          )
        : null}
    </>
  )
}

export function useExamTimer(seconds: number, running: boolean) {
  const [left, setLeft] = useState(seconds)
  useEffect(() => {
    if (!running) return
    const id = setInterval(() => setLeft((l) => Math.max(0, l - 1)), 1000)
    return () => clearInterval(id)
  }, [running])
  return left
}

/** `lowAt`: from how many seconds left the chip lights up (default 5 minutes; a 3-minute Teil clock uses less). */
export function TimerChip({ seconds, lowAt = 300 }: { seconds: number; lowAt?: number }) {
  const t = useExamCopy()
  const low = seconds < lowAt
  return (
    <span
      role="timer"
      aria-label={`${t.timeLeft} ${fmt(seconds)}`}
      className={cn("v-num rounded-full px-3 py-1.5 text-[13.5px] font-medium transition-colors duration-300", low ? "bg-(--p-glow) text-[#0A0D18]" : "bg-v-soft")}
    >
      {fmt(seconds)}
    </span>
  )
}

export type ShellSection = { id: string; label: string; count: number; done: number }

export function Progress({ sections, label }: { sections: ShellSection[]; label: string }) {
  return (
    <div className="flex flex-1 gap-1" role="progressbar" aria-label={label} aria-valuemin={0} aria-valuemax={sections.reduce((s, x) => s + x.count, 0)} aria-valuenow={sections.reduce((s, x) => s + x.done, 0)}>
      {sections.map((s) => (
        <span key={s.id} className="h-1.5 overflow-hidden rounded-full bg-v-ink/10" style={{ flex: s.count }} title={s.label}>
          <span className="block h-full rounded-full bg-v-ink transition-[width] duration-300 ease-out" style={{ width: `${(s.done / s.count) * 100}%` }} />
        </span>
      ))}
    </div>
  )
}

function OverviewSheet({ open, onClose, title, items, onJump }: { open: boolean; onClose: () => void; title: string; items: OverviewItem[]; onJump?: (n: number) => void }) {
  const t = useExamCopy()
  return (
    <div
      role="dialog"
      aria-label={title}
      aria-hidden={!open}
      inert={!open}
      className={cn(
        "absolute inset-x-0 bottom-0 z-10 rounded-t-[24px] border-t border-v-line bg-v-surface p-5 shadow-[0_-30px_60px_-30px_rgba(8,10,30,0.35)] transition-[translate,opacity] duration-300 ease-(--ease-out-strong)",
        open ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-full opacity-0"
      )}
    >
      <div className="mb-4 flex items-center justify-between">
        <b className="text-[16px] font-semibold">{title}</b>
        <ExamButton kind="iconSm" onClick={onClose} aria-label={t.close}>
          <X className="size-4" aria-hidden="true" />
        </ExamButton>
      </div>
      <div className="grid grid-cols-5 gap-2">
        {items.map((it) => (
          <button
            key={it.n}
            type="button"
            onClick={() => { onJump?.(it.n); onClose() }}
            aria-current={it.state === "current" ? "step" : undefined}
            className={cn(
              "v-num grid h-11 cursor-pointer place-items-center rounded-xl text-[14px] transition-transform active:scale-95",
              it.state === "current" ? "bg-v-ink text-v-bg" : it.state === "done" ? "bg-v-soft" : "border border-v-line text-v-muted"
            )}
          >
            {it.n}
          </button>
        ))}
      </div>
    </div>
  )
}

/**
 * The glass bar above every exam screen: exit, the skill, progress per Teil, done/total, and the timer.
 * Sticky, so the clock and the way out stay in view over a long text.
 */
export function ExamBar({ part, sections, label, seconds, lowAt, onExit, className }: { part?: PartId; sections: ShellSection[]; label: string; seconds?: number; lowAt?: number; onExit?: () => void; className?: string }) {
  const t = useExamCopy()
  const done = sections.reduce((n, x) => n + x.done, 0)
  const total = sections.reduce((n, x) => n + x.count, 0)
  return (
    <div className={cn("nz-app sticky top-3 z-20 flex items-center gap-2.5 rounded-full py-2 ps-2 pe-3 sm:gap-3", className)}>
      <ExamButton kind="iconSm" onClick={onExit} aria-label={t.exit}>
        <X className="size-4" aria-hidden="true" />
      </ExamButton>
      {part ? <span className="max-sm:hidden"><PartIcon part={part} size="sm" /></span> : null}
      <Progress sections={sections} label={label} />
      <span className="v-num shrink-0 text-[12.5px] text-v-muted" aria-hidden="true">{done}/{total}</span>
      {seconds !== undefined ? <TimerChip seconds={seconds} lowAt={lowAt} /> : null}
    </div>
  )
}

/**
 * The exam frame: the glass bar, then the task in one card with a sticky action bar.
 * `wide` lets reading and writing split into two panes from `lg`.
 */
export function ExamShell({
  part,
  sections,
  progressLabel,
  seconds,
  lowAt,
  onExit,
  overview,
  action,
  wide,
  children,
}: {
  part?: PartId
  sections: ShellSection[]
  progressLabel: string
  seconds?: number
  lowAt?: number
  onExit?: () => void
  overview?: { title: string; items: OverviewItem[]; onJump?: (n: number) => void }
  action?: ReactNode
  wide?: boolean
  children: ReactNode
}) {
  const t = useExamCopy()
  const [open, setOpen] = useState(false)
  return (
    <div className={cn("mx-auto flex w-full flex-col gap-3", wide ? "max-w-[1040px]" : "max-w-[560px]")}>
      <ExamBar part={part} sections={sections} label={progressLabel} seconds={seconds} lowAt={lowAt} onExit={onExit} />
      {/* --exam-dock: where docked option trays (gaps, word pool) stop, just above the sticky action bar. */}
      <div className={cn("nz-app relative flex w-full flex-col overflow-clip rounded-[24px]", (action || overview) && "[--exam-dock:84px]")}>
        <div className="flex flex-col gap-5 px-5 pt-6 pb-5">{children}</div>
        {action || overview ? (
          <div className="sticky bottom-0 mt-auto flex items-center gap-2 border-t border-v-line bg-v-surface/70 p-3 backdrop-blur-md">
            {overview ? (
              <ExamButton kind="icon" onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-label={t.overview}>
                <Grid2x2 className="size-5" aria-hidden="true" />
              </ExamButton>
            ) : null}
            <div className="flex flex-1 gap-2 [&>*]:flex-1">{action}</div>
          </div>
        ) : null}
        {overview ? <OverviewSheet open={open} onClose={() => setOpen(false)} {...overview} /> : null}
      </div>
    </div>
  )
}
