"use client"

import { useState, type ReactNode } from "react"
import { cn } from "@/lib/utils"
import type { ReadingData } from "@/lib/exam/types"
import { useExamCopy } from "./primitives"

export function ReadingText({ data, highlight }: { data: ReadingData; highlight?: string }) {
  return (
    <article className="flex flex-col gap-3 text-[18px] leading-[1.7]">
      <header className="flex flex-wrap items-baseline justify-between gap-x-3 text-[14px]">
        <b className="font-semibold">{data.sender}</b>
        <span className="text-v-muted">{data.source}</span>
      </header>
      {data.paragraphs.map((p, i) => {
        if (!highlight || !p.includes(highlight)) return <p key={i}>{p}</p>
        const [a, b] = p.split(highlight)
        return (
          <p key={i}>
            {a}
            <mark className="rounded-md bg-[color-mix(in_srgb,var(--p-glow)_55%,transparent)] px-1 text-v-ink">{highlight}</mark>
            {b}
          </p>
        )
      })}
    </article>
  )
}

/** Text and tasks: a "Text | Aufgaben" switch on phones, two panes from lg. Use inside a `wide` shell. */
export function ReadingLayout({ text, tasks, answered, total }: { text: ReactNode; tasks: ReactNode; answered: number; total: number }) {
  const t = useExamCopy()
  const [tab, setTab] = useState<"text" | "tasks">("text")
  return (
    <>
      <div className="flex flex-col gap-5 lg:hidden">
        <div className="flex gap-1 rounded-full bg-v-soft p-1" role="tablist">
          {(["text", "tasks"] as const).map((k) => (
            <button key={k} type="button" role="tab" aria-selected={tab === k} onClick={() => setTab(k)} className={cn("h-10 flex-1 cursor-pointer rounded-full text-[14.5px] font-semibold transition-colors duration-150", tab === k ? "bg-v-ink text-v-bg" : "text-v-muted")}>
              {k === "text" ? t.text : t.tasks(answered, total)}
            </button>
          ))}
        </div>
        <div key={tab} className="nz-screen">{tab === "text" ? text : tasks}</div>
      </div>
      <div className="hidden gap-8 lg:grid lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
        <div className="rounded-[20px] bg-v-surface p-7 ring-1 ring-v-line">{text}</div>
        <div className="flex flex-col gap-8 pt-1">{tasks}</div>
      </div>
    </>
  )
}
