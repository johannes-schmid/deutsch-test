"use client"

import { createContext, useContext, type ComponentProps, type ReactNode } from "react"
import { Check, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { EXAM_COPY, type ExamCopy, type ExamLocale } from "@/lib/exam/copy"

const CopyContext = createContext<ExamCopy>(EXAM_COPY.de)

export function ExamCopyProvider({ locale, children }: { locale: ExamLocale; children: ReactNode }) {
  return <CopyContext.Provider value={EXAM_COPY[locale]}>{children}</CopyContext.Provider>
}

export const useExamCopy = () => useContext(CopyContext)

export type OptionState = "idle" | "selected" | "right" | "wrong" | "solution"

/** Exam mode passes no review, so nothing reveals right or wrong until grading. */
export function optionState(key: string, value: string | null | undefined, review?: { correct: string }): OptionState {
  if (!review) return value === key ? "selected" : "idle"
  if (key === review.correct) return value === key ? "right" : "solution"
  return value === key ? "wrong" : "idle"
}

export const isChosen = (s: OptionState) => s === "selected" || s === "right" || s === "wrong"

export function Radio({ on }: { on: boolean }) {
  return (
    <span className={cn("grid size-6 shrink-0 place-items-center rounded-full border-2 transition-colors duration-150", on ? "border-v-ink bg-v-ink" : "border-v-ink/25")}>
      <span className={cn("size-2 rounded-full bg-v-bg transition-transform duration-200 ease-out", on ? "scale-100" : "scale-0")} />
    </span>
  )
}

export function Mark({ kind, inverse, className }: { kind: "right" | "wrong"; inverse?: boolean; className?: string }) {
  return (
    <span
      className={cn(
        "grid size-6 shrink-0 place-items-center rounded-full",
        kind === "right" ? (inverse ? "bg-[#0A0D18] text-(--p-glow)" : "bg-(--p-glow) text-[#0A0D18]") : "bg-v-ink text-v-bg",
        className
      )}
    >
      {kind === "right" ? <Check className="size-3.5" strokeWidth={3} aria-hidden="true" /> : <X className="size-3.5" strokeWidth={3} aria-hidden="true" />}
    </span>
  )
}

/** The fill every chosen/graded surface uses: cards, tiles, toggles. */
export const stateSurface: Record<OptionState, string> = {
  idle: "border-v-line bg-v-surface",
  selected: "border-v-ink bg-v-surface shadow-[0_0_0_1px_var(--v-ink)]",
  right: "border-transparent bg-(--p-glow) text-[#0A0D18]",
  solution: "border-(--p-glow) bg-v-surface shadow-[0_0_0_1px_var(--p-glow)]",
  wrong: "border-transparent bg-[color-mix(in_srgb,var(--v-sk-schreiben)_30%,var(--v-surface))]",
}

export function OptionCard({ k, label, state, onSelect }: { k: string; label: ReactNode; state: OptionState; onSelect?: () => void }) {
  const t = useExamCopy()
  return (
    <button
      type="button"
      role="radio"
      aria-checked={isChosen(state)}
      disabled={!onSelect}
      onClick={onSelect}
      className={cn(
        "flex min-h-14 w-full cursor-pointer items-center gap-3.5 rounded-2xl border px-4 py-3 text-left text-[16.5px] transition-[background-color,border-color,box-shadow,transform] duration-150 ease-out active:scale-[0.985] disabled:cursor-default disabled:active:scale-100",
        stateSurface[state],
        state === "idle" && onSelect && "hover:border-v-ink/30"
      )}
    >
      {state === "right" ? <Mark kind="right" inverse /> : state === "solution" ? <Mark kind="right" /> : state === "wrong" ? <Mark kind="wrong" /> : <Radio on={state === "selected"} />}
      <span className="flex-1">{label}</span>
      {state === "wrong" ? <span className="text-[12.5px] opacity-70">{t.yourAnswer}</span> : state === "solution" ? <span className="text-[12.5px] text-v-muted">{t.solution}</span> : null}
      <span className="v-num text-[13px] opacity-50">{k}</span>
    </button>
  )
}

const buttonKinds = {
  primary: "h-12 rounded-full bg-v-ink px-6 text-[16px] font-semibold text-v-bg",
  soft: "h-12 rounded-full bg-v-soft px-6 text-[15px] font-semibold text-v-ink",
  icon: "grid size-12 shrink-0 place-items-center rounded-full bg-v-soft text-v-ink",
  iconSm: "grid size-9 shrink-0 place-items-center rounded-full bg-v-soft text-v-ink",
}

export function ExamButton({ kind = "primary", className, ...props }: ComponentProps<"button"> & { kind?: keyof typeof buttonKinds }) {
  return (
    <button
      type="button"
      className={cn(
        "cursor-pointer transition-[transform,opacity,background-color] duration-150 ease-out active:scale-[0.97] disabled:cursor-default disabled:opacity-30 disabled:active:scale-100",
        buttonKinds[kind],
        className
      )}
      {...props}
    />
  )
}

export function ItemHeader({ n, label, children }: { n?: number; label?: string; children: ReactNode }) {
  const t = useExamCopy()
  return (
    <div className="flex flex-col gap-1">
      {label || n ? (
        <span className="text-[13px] text-v-muted">
          {label}
          {label && n ? " · " : ""}
          {n ? `${t.task} ${n}` : ""}
        </span>
      ) : null}
      <h3 className="text-[21px] leading-tight font-semibold tracking-[-0.02em] text-balance sm:text-[23px]">{children}</h3>
    </div>
  )
}

export const fmt = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`
