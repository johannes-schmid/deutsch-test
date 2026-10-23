"use client"

// The letter or email of a gap text (Sprachbausteine, DTZ Lesen Teil 5), set as a sheet of paper as in the booklet:
// a mono label (E-Mail for "Liebe/r …", Brief for "Sehr geehrte …"), real paragraph spacing instead of blank lines.

import type { ReactNode } from "react"
import { cn } from "@/lib/utils"
import type { GapData } from "@/lib/exam/types"

/** Splits the text parts at blank lines, so each paragraph is its own block; gaps stay where they are. */
export function letterParagraphs(parts: GapData["parts"]) {
  const paras: GapData["parts"][] = [[]]
  for (const p of parts) {
    if (typeof p !== "string") {
      paras.at(-1)!.push(p)
      continue
    }
    p.split(/\n[ \t]*\n+/).forEach((chunk, i) => {
      if (i > 0) paras.push([])
      if (chunk) paras.at(-1)!.push(chunk)
    })
  }
  // A paragraph neither starts nor ends with a line break (the spacing comes from the paragraph gap).
  return paras
    .filter((para) => para.some((x) => typeof x !== "string" || x.trim()))
    .map((para) => para.map((x, i) => (typeof x !== "string" ? x : i === 0 ? x.replace(/^\s+/, "") : i === para.length - 1 ? x.replace(/\s+$/, "") : x)))
}

export function LetterSheet({ parts, children, className }: { parts: GapData["parts"]; children: (para: GapData["parts"], i: number) => ReactNode; className?: string }) {
  const first = parts.find((p): p is string => typeof p === "string") ?? ""
  const kind = /^\s*(Sehr geehrte|Betreff|[A-ZÄÖÜ][^\n]*\n[^\n]*\d{5})/.test(first) ? "Brief" : "E-Mail"
  return (
    <article lang="de" className={cn("flex max-w-[68ch] flex-col gap-4 rounded-[14px] bg-v-surface p-5 ring-1 ring-v-line sm:p-8", className)}>
      <span className="v-num text-[11.5px] tracking-[0.08em] text-v-muted uppercase">{kind}</span>
      <div className="flex flex-col gap-4 text-[17px] leading-[1.95]">
        {letterParagraphs(parts).map((para, i) => (
          <p key={i} className="whitespace-pre-line">
            {children(para, i)}
          </p>
        ))}
      </div>
    </article>
  )
}
