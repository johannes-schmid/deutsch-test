"use client"

import { useEffect, useRef, useState, type ReactNode } from "react"
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

/** Text and tasks: a "Text | Aufgaben" switch on phones, two panes from lg. Use inside a `wide` shell.
 * The switch sticks under the exam bar, so the way between text and tasks is always one tap away. */
export function ReadingLayout({ text, tasks, answered, total }: { text: ReactNode; tasks: ReactNode; answered: number; total: number }) {
  const t = useExamCopy()
  const [tab, setTab] = useState<"text" | "tasks">("text")
  const bar = useRef<HTMLDivElement>(null)
  const pane = useRef<HTMLDivElement>(null)
  const edge = useRef<HTMLDivElement>(null)
  const [stuck, setStuck] = useState(false)
  // The switch gets its frosted backing only while it is pinned under the exam bar; in place it sits bare on the card.
  useEffect(() => {
    const el = edge.current
    const top = bar.current ? parseFloat(getComputedStyle(bar.current).top) || 0 : 0
    if (!el) return
    const io = new IntersectionObserver(([e]) => setStuck(!e.isIntersecting && e.boundingClientRect.top < top + 1), { rootMargin: `-${top + 1}px 0px 0px 0px` })
    io.observe(el)
    return () => io.disconnect()
  }, [])
  const show = (k: "text" | "tasks") => {
    if (k === tab) return
    setTab(k)
    // Scrolled into the text? Start the other pane at its top, not mid-way down.
    const b = bar.current?.getBoundingClientRect()
    const p = pane.current?.getBoundingClientRect()
    if (b && p && p.top < b.bottom) requestAnimationFrame(() => pane.current?.scrollIntoView({ block: "start" }))
  }
  return (
    <>
      <div className="flex flex-col gap-3 lg:hidden">
        <div ref={edge} aria-hidden="true" className="-mb-3 h-0" />
        <div ref={bar} className={cn("sticky top-(--exam-top,0px) z-10 -mx-5 -my-1.5 px-5 py-1.5 transition-[background-color,box-shadow] duration-150", stuck && "bg-v-surface shadow-[0_1px_0_var(--v-line)]")}>
          <div className="flex gap-1 rounded-full bg-v-soft p-1" role="tablist">
            {(["text", "tasks"] as const).map((k) => (
              <button key={k} type="button" role="tab" aria-selected={tab === k} onClick={() => show(k)} className={cn("h-10 flex-1 cursor-pointer rounded-full text-[14.5px] font-semibold transition-[color,background-color,transform] duration-150 ease-out active:scale-[0.97]", tab === k ? "bg-v-ink text-v-bg" : "text-v-muted")}>
                {k === "text" ? t.text : t.tasks(answered, total)}
              </button>
            ))}
          </div>
        </div>
        <div ref={pane} key={tab} className="nz-screen mt-2 scroll-mt-[calc(var(--exam-top,0px)+60px)]">{tab === "text" ? text : tasks}</div>
      </div>
      <div className="hidden gap-8 lg:grid lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
        <div className="rounded-[20px] bg-v-surface p-7 ring-1 ring-v-line">{text}</div>
        <div className="flex flex-col gap-8 pt-1">{tasks}</div>
      </div>
    </>
  )
}
