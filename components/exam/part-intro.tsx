"use client"

import type { ReactNode } from "react"
import type { LucideIcon } from "lucide-react"
import type { PartId } from "@/lib/exam/types"
import { PartIcon } from "@/components/design/variants/nachtzug-icons"
import { ExamButton, useExamCopy } from "./primitives"

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
          <span className="v-num mt-1.5 text-[14px] text-v-muted">{minutes} {t.minutes} · {count} {t.items}</span>
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
