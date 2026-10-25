"use client"

import { useState } from "react"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"
import type { WritingOption } from "@/lib/exam/types"
import { stateSurface, useExamCopy } from "./primitives"

/** Schreiben: choose task A or B, then write. The learner ticks the points off; nothing grades live. */
export function WritingTask({ options, chosen, onChoose, value, onChange }: { options: WritingOption[]; chosen: string | null; onChoose: (k: string) => void; value: string; onChange: (v: string) => void }) {
  const t = useExamCopy()
  const [ticked, setTicked] = useState<string[]>([])
  // A single task (Start Deutsch 1) has nothing to choose: it is shown as the task, already picked.
  const single = options.length === 1 ? options[0] : null
  const task = single ?? options.find((o) => o.key === chosen)
  const words = value.trim() ? value.trim().split(/\s+/).length : 0
  return (
    <div className="flex flex-col gap-5">
      {single ? (
        <div className="flex flex-col gap-1.5">
          <span className="text-[13px] text-v-muted">{t.yourTask}</span>
          <b className="text-[17px] font-semibold">{single.title}</b>
          <p className="max-w-[60ch] text-[15.5px] leading-relaxed whitespace-pre-line">{single.situation}</p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          <span className="text-[13px] text-v-muted">{t.chooseTask}</span>
          <div className="grid grid-cols-[minmax(0,1fr)] gap-2 sm:grid-cols-2" role="radiogroup">
            {options.map((o) => (
              <button key={o.key} type="button" role="radio" aria-checked={chosen === o.key} onClick={() => onChoose(o.key)} className={cn("flex cursor-pointer gap-3 rounded-2xl border p-4 text-left transition-[border-color,box-shadow,transform] duration-150 ease-out active:scale-[0.99]", stateSurface[chosen === o.key ? "selected" : "idle"], chosen !== o.key && "hover:border-v-ink/30")}>
                <span className={cn("v-num grid size-8 shrink-0 place-items-center rounded-full text-[14px] font-semibold", chosen === o.key ? "bg-v-ink text-v-bg" : "bg-v-soft")}>{o.key}</span>
                <span className="flex flex-col gap-1">
                  <b className="text-[15.5px] font-semibold">{o.title}</b>
                  <span className="text-[14px] leading-snug whitespace-pre-line text-v-muted">{o.situation}</span>
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
      {task ? (
        <div key={task.key} className="nz-screen grid grid-cols-[minmax(0,1fr)] gap-5 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
          <div className="flex flex-col gap-3">
            <span className="text-[14px] font-semibold">{t.writeAbout}</span>
            <ul className="flex flex-col gap-1">
              {task.points.map((p) => {
                const on = ticked.includes(p)
                return (
                  <li key={p}>
                    <button type="button" aria-pressed={on} onClick={() => setTicked((x) => (on ? x.filter((y) => y !== p) : [...x, p]))} className="flex min-h-11 w-full cursor-pointer items-center gap-3 rounded-xl px-1 text-left text-[15.5px]">
                      <span className={cn("grid size-6 shrink-0 place-items-center rounded-full transition-colors duration-200", on ? "bg-(--p-glow) text-[#0A0D18]" : "border-2 border-v-ink/20")}>
                        {on ? <Check className="size-3.5" strokeWidth={3} aria-hidden="true" /> : null}
                      </span>
                      <span className={cn(on && "text-v-muted")}>{p}</span>
                    </button>
                  </li>
                )
              })}
            </ul>
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="exam-writing" className="text-[13px] text-v-muted">{t.letter}</label>
            {task.opener ? <p lang="de" className="rounded-2xl bg-v-soft px-4 py-3 text-[16.5px] leading-relaxed whitespace-pre-line text-v-ink/80">{task.opener}</p> : null}
            <textarea
              id="exam-writing"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              rows={10}
              spellCheck={false}
              className="w-full resize-y rounded-2xl border border-v-line bg-v-surface p-4 text-[16.5px] leading-relaxed text-v-ink caret-(--p-ember) outline-none focus:border-v-ink focus:shadow-[0_0_0_1px_var(--v-ink)]"
            />
            <span className="v-num self-end text-[13px] text-v-muted" aria-live="polite">{t.words(words)}</span>
          </div>
        </div>
      ) : null}
    </div>
  )
}
