"use client"

import { Languages } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Evidence } from "@/lib/exam/types"
import { Mark, useExamCopy } from "./primitives"

/** Practice-mode explanation after "Prüfen". Exam mode shows this only in the Auswertung. `onLanguage` toggles a translated explanation and the German original; `language` names the one the button switches to. */
export function FeedbackSheet({ right, solution, explanation, evidence, language = "DE", onLanguage }: { right: boolean; solution: string; explanation: string; evidence?: Evidence; language?: string; onLanguage?: () => void }) {
  const t = useExamCopy()
  const [before, after] = evidence ? evidence.text.split(evidence.hit) : []
  return (
    <div className="nz-screen flex flex-col gap-3 rounded-[22px] bg-v-surface p-4 shadow-[0_-20px_40px_-30px_rgba(8,10,30,0.4)] ring-1 ring-v-line" role="status">
      <div className="flex items-center gap-2.5">
        <Mark kind={right ? "right" : "wrong"} className={cn("size-8", !right && "bg-[color-mix(in_srgb,var(--v-sk-schreiben)_45%,var(--v-surface))] text-v-ink")} />
        <b className="text-[17px] font-semibold">{right ? t.right : t.wrong(solution)}</b>
        {onLanguage ? (
          <button type="button" onClick={onLanguage} aria-label={t.switchLanguage} className="ml-auto flex h-8 cursor-pointer items-center gap-1 rounded-full bg-v-soft px-3 text-[12.5px] font-semibold transition-[background-color,transform] duration-150 ease-out hover:bg-v-line active:scale-[0.97]">
            <Languages className="size-3.5" aria-hidden="true" /> {language}
          </button>
        ) : null}
      </div>
      <p className="text-[15px] leading-relaxed text-v-muted">{explanation}</p>
      {evidence ? (
        <p className="rounded-xl bg-v-soft p-3 text-[14px] leading-relaxed">
          {before}
          <mark className="rounded-md bg-[color-mix(in_srgb,var(--p-glow)_55%,transparent)] px-1 text-v-ink">{evidence.hit}</mark>
          {after}
        </p>
      ) : null}
    </div>
  )
}
