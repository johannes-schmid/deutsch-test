"use client"

// Exam material in the shape of the printed test booklet (telc B1 Leseverstehen and Sprachbausteine): newspaper
// clippings with a headline slot, a magazine article, a page of small ads and a letter with one word pool a–o.
// Same state vocabulary as items.tsx: chosen is ink, right is glow, wrong is rosé, and only after grading.

import { useState, type ReactNode } from "react"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"
import type { GapData, MatchData, ReadingData } from "@/lib/exam/types"
import { SituationTabs } from "./items"
import { ItemHeader, Mark, isChosen, optionState, stateSurface, useExamCopy } from "./primitives"

const POOL_KEYS = "abcdefghijklmno"
const label = "v-num text-[11.5px] tracking-[0.08em] text-v-muted uppercase"
/** Newsprint setting: German hyphenation, justified from sm (a phone column is too narrow and opens rivers). */
const column = "hyphens-auto sm:text-justify sm:[text-align-last:left]"

/** One newspaper item with an empty headline slot that fills with the chosen headline. */
function Clipping({ n, text, headline, chosen }: { n: number; text: string; headline?: { key: string; title: string }; chosen?: ReactNode }) {
  const t = useExamCopy()
  return (
    <article lang="de" className="flex flex-col gap-3 rounded-[14px] bg-v-surface p-5 ring-1 ring-v-line">
      <span className={label}>{t.textN(n)}</span>
      {headline ? (
        <p className="flex items-start gap-2.5 text-[19px] leading-[1.2] font-semibold tracking-[-0.01em] text-balance">
          <span className="v-num mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-v-ink text-[12px] font-normal text-v-bg">{headline.key}</span>
          <span className="flex-1">{headline.title}</span>
          {chosen}
        </p>
      ) : (
        <p className="rounded-lg border border-dashed border-v-ink/30 px-3 py-2 text-[14.5px] text-v-muted">{t.pickHeadline}</p>
      )}
      <p className={cn("max-w-[44ch] text-[16px] leading-[1.6]", column)}>{text}</p>
    </article>
  )
}

/** Leseverstehen Teil 1: texts (the situations) to headlines (the ads, title only); each headline fits once. */
export function HeadlineMatch({ data, value, onChange, review }: { data: MatchData; value: Record<number, string>; onChange?: (n: number, k: string) => void; review?: Record<number, string> }) {
  const t = useExamCopy()
  const [i, setI] = useState(0)
  const s = data.situations[i]
  const pick = data.ads.find((a) => a.key === value[s.n])
  const usedBy = (key: string) => data.situations.find((x) => x.n !== s.n && value[x.n] === key)?.n
  const graded = review ? (value[s.n] === review[s.n] ? <Mark kind="right" /> : <Mark kind="wrong" />) : null
  return (
    <div className="flex flex-col gap-4">
      <SituationTabs items={data.situations} active={i} onActive={setI} value={value} review={review} label={t.situations} />
      <div className="grid grid-cols-[minmax(0,1fr)] gap-5 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:items-start">
        <Clipping key={s.n} n={s.n} text={s.text} headline={pick} chosen={graded} />
        <div className="flex flex-col gap-2" role="radiogroup" aria-label={t.headlines}>
          <span className={label}>{t.headlines}</span>
          {data.ads.map((a) => {
            const st = optionState(a.key, value[s.n], review ? { correct: review[s.n] } : undefined)
            const other = usedBy(a.key)
            return (
              <button
                key={a.key}
                type="button"
                role="radio"
                aria-checked={isChosen(st)}
                disabled={!!review || !onChange}
                onClick={() => onChange?.(s.n, a.key)}
                className={cn(
                  "flex min-h-12 w-full cursor-pointer items-center gap-3 rounded-xl border px-3.5 py-2.5 text-left text-[15.5px] leading-snug transition-[background-color,border-color,box-shadow,opacity,transform] duration-150 ease-out active:scale-[0.985] disabled:cursor-default disabled:active:scale-100",
                  stateSurface[st],
                  st === "idle" && other !== undefined && "opacity-50",
                  st === "idle" && !review && onChange && "hover:border-v-ink/30"
                )}
              >
                <span className={cn("v-num grid size-6 shrink-0 place-items-center rounded-full text-[12px]", st === "selected" ? "bg-v-ink text-v-bg" : "bg-v-soft")}>{a.key}</span>
                <span className="flex-1 font-medium">{a.title}</span>
                {st === "selected" ? <Check className="size-4" strokeWidth={2.5} aria-hidden="true" /> : st === "right" ? <Mark kind="right" inverse /> : st === "solution" ? <Mark kind="right" /> : st === "wrong" ? <Mark kind="wrong" /> : other !== undefined ? <span className="v-num text-[12px] text-v-muted">{t.textN(other)}</span> : null}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

/** Leseverstehen Teil 2: a magazine article. paragraphs[0] is the headline, [1] the standfirst, the rest the body. */
export function ArticleText({ data, highlight }: { data: ReadingData; highlight?: string }) {
  const [head, lead, ...body] = data.paragraphs
  const mark = (p: string) => {
    if (!highlight || !p.includes(highlight)) return p
    const [a, b] = p.split(highlight)
    return (
      <>
        {a}
        <mark className="rounded-md bg-[color-mix(in_srgb,var(--p-glow)_55%,transparent)] px-1 text-v-ink">{highlight}</mark>
        {b}
      </>
    )
  }
  return (
    <article lang="de" className="flex flex-col gap-4">
      <span className={label}>{[data.source, data.sender].filter(Boolean).join(" · ")}</span>
      <h3 className="text-[clamp(24px,3vw,30px)] leading-[1.12] font-semibold tracking-[-0.02em] text-balance">{head}</h3>
      {lead ? <p className="text-[17px] leading-[1.55] font-semibold">{mark(lead)}</p> : null}
      <div className="h-px bg-v-line" />
      <div className={cn("text-[17px] leading-[1.7] [&>p+p]:indent-[1.4em]", column)}>
        {body.map((p, i) => <p key={i}>{mark(p)}</p>)}
      </div>
    </article>
  )
}

/** Five print styles a small-ads page mixes; all ink on paper, so the single accent stays free for state. */
const AD_STYLE = [
  { box: "rounded-md border-2 border-v-ink/80", title: "text-[14.5px] font-bold tracking-[0.04em] uppercase", body: "" },
  { box: "rounded-md border border-v-ink/60 pt-0", title: "-mx-3.5 mb-1 bg-v-ink px-3.5 py-1.5 text-[15px] font-semibold text-v-bg", body: "" },
  { box: "rounded-none border-y-2 border-v-ink", title: "text-center text-[18px] font-semibold tracking-[-0.01em]", body: "text-center" },
  { box: "rounded-md border-[3px] border-double border-v-ink/70", title: "text-[16px] font-semibold italic", body: "" },
  { box: "rounded-md border border-v-line", title: "text-[15px] font-semibold", body: "text-v-muted" },
] as const

/** Leseverstehen Teil 3: situations to a page of small ads, each ad once, x when none fits. */
export function AdBoard({ data, value, onChange, review, noMatch = true }: { data: MatchData; value: Record<number, string>; onChange?: (n: number, k: string) => void; review?: Record<number, string>; noMatch?: boolean }) {
  const t = useExamCopy()
  const [i, setI] = useState(0)
  const s = data.situations[i]
  const state = (key: string) => optionState(key, value[s.n], review ? { correct: review[s.n] } : undefined)
  const ring: Record<ReturnType<typeof state>, string> = {
    idle: "",
    selected: "outline-2 outline-offset-2 outline-v-ink",
    right: "bg-(--p-glow) text-[#0A0D18]",
    solution: "outline-2 outline-offset-2 outline-(--p-glow)",
    wrong: "bg-[color-mix(in_srgb,var(--v-sk-schreiben)_30%,var(--v-surface))]",
  }
  const x = state("x")
  return (
    <div className="flex flex-col gap-4">
      <SituationTabs items={data.situations} active={i} onActive={setI} value={value} review={review} label={t.situations} />
      <ItemHeader>{s.text}</ItemHeader>
      <div lang="de" className="columns-1 gap-3 sm:columns-2 xl:columns-3" role="radiogroup" aria-label={t.ads}>
        {data.ads.map((a, j) => {
          const st = state(a.key)
          const style = AD_STYLE[j % AD_STYLE.length]
          return (
            <button
              key={a.key}
              type="button"
              role="radio"
              aria-checked={isChosen(st)}
              disabled={!!review || !onChange}
              onClick={() => onChange?.(s.n, a.key)}
              className={cn(
                "relative mb-3 flex w-full cursor-pointer break-inside-avoid flex-col gap-1.5 overflow-hidden bg-v-surface p-3.5 text-left text-[14px] leading-snug transition-[outline-color,background-color,transform] duration-150 ease-out active:scale-[0.985] disabled:cursor-default disabled:active:scale-100",
                style.box,
                ring[st]
              )}
            >
              <span className={cn("pr-8", style.title)}>{a.title}</span>
              <span className={cn(column, style.body, st === "right" && "text-[#0A0D18]/80")}>{a.text}</span>
              <span className={cn("v-num absolute top-2 right-2 grid size-6 place-items-center rounded-full text-[12px]", st === "selected" ? "bg-v-ink text-v-bg" : "bg-v-soft text-v-ink")}>{a.key}</span>
              {st === "right" || st === "solution" ? <Mark kind="right" className="absolute right-2 bottom-2" /> : st === "wrong" ? <Mark kind="wrong" className="absolute right-2 bottom-2" /> : null}
            </button>
          )
        })}
      </div>
      {noMatch ? (
        <button
          type="button"
          role="radio"
          aria-checked={isChosen(x)}
          disabled={!!review || !onChange}
          onClick={() => onChange?.(s.n, "x")}
          className={cn("flex min-h-12 cursor-pointer items-center gap-3 rounded-xl border px-3.5 text-left text-[15px] transition-[border-color,box-shadow,transform,background-color] duration-150 ease-out active:scale-[0.985] disabled:cursor-default disabled:active:scale-100", stateSurface[x], x === "idle" && "border-dashed")}
        >
          <span className={cn("v-num grid size-6 place-items-center rounded-full text-[12px]", x === "selected" ? "bg-v-ink text-v-bg" : "bg-v-soft")}>x</span>
          <span className="flex-1">{t.noMatch}</span>
          {x === "right" ? <Mark kind="right" inverse /> : x === "solution" ? <Mark kind="right" /> : x === "wrong" ? <Mark kind="wrong" /> : null}
        </button>
      ) : null}
    </div>
  )
}

/**
 * Sprachbausteine Teil 2: a letter with gaps and ONE word pool a–o printed under it, as in the booklet. Every gap
 * carries the same options (the pool). A word already used in another gap shows that gap's number and moves when
 * picked again, so each word is used once.
 */
export function WordPoolGap({ data, value, onChange, review }: { data: GapData; value: Record<number, string>; onChange?: (n: number, v: string) => void; review?: Record<number, string> }) {
  const t = useExamCopy()
  const gaps = data.parts.filter((p) => typeof p !== "string")
  const pool = gaps[0]?.options ?? []
  const [open, setOpen] = useState<number | null>(review ? null : gaps.find((g) => !value[g.n])?.n ?? gaps[0]?.n ?? null)
  const usedIn = (w: string) => gaps.find((g) => value[g.n] === w)?.n
  const choose = (w: string) => {
    if (open === null || !onChange) return
    const prev = usedIn(w)
    if (prev !== undefined && prev !== open) onChange(prev, "")
    onChange(open, w)
    setOpen(gaps.find((g) => g.n !== open && !value[g.n])?.n ?? null)
  }
  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-5 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:items-start">
      <p lang="de" className="text-[17px] leading-[2.05] whitespace-pre-line">
        {data.parts.map((p, i) => {
          if (typeof p === "string") return <span key={i}>{p}</span>
          const graded = review ? (value[p.n] === review[p.n] ? "right" : "wrong") : null
          const key = value[p.n] ? POOL_KEYS[pool.indexOf(value[p.n])] : null
          return (
            <button
              key={i}
              type="button"
              onClick={() => !review && setOpen(p.n)}
              aria-expanded={open === p.n}
              aria-label={`${t.gap(p.n)}${value[p.n] ? `: ${value[p.n]}` : ""}`}
              className={cn(
                "mx-0.5 inline-flex h-8 min-w-20 cursor-pointer items-center justify-center gap-1.5 rounded-full px-3 align-middle text-[15px] font-semibold transition-colors",
                graded === "right" ? "bg-(--p-glow) text-[#0A0D18]" : graded === "wrong" ? "bg-[color-mix(in_srgb,var(--v-sk-schreiben)_30%,var(--v-surface))]" : open === p.n ? "bg-v-ink text-v-bg" : value[p.n] ? "bg-v-soft" : "border border-dashed border-v-ink/40 text-v-muted"
              )}
            >
              {graded === "wrong" ? (
                <>
                  <span className="line-through opacity-60">{value[p.n] || "–"}</span>
                  <span>{review![p.n]}</span>
                </>
              ) : value[p.n] ? (
                <>
                  <span className="v-num text-[11px] font-normal opacity-60">{key}</span>
                  {value[p.n]}
                </>
              ) : (
                <span className="v-num font-normal">{p.n}</span>
              )}
            </button>
          )
        })}
      </p>
      <div className="flex flex-col gap-2.5 rounded-2xl bg-v-soft p-3 lg:sticky lg:top-24">
        <span className={cn(label, "px-1")}>
          {t.wordPool} a–{POOL_KEYS[pool.length - 1]}
          {open !== null && !review ? ` · ${t.gap(open)}` : ""}
        </span>
        <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-3" role="radiogroup" aria-label={t.wordPool}>
          {pool.map((w, j) => {
            const where = usedIn(w)
            const here = open !== null && where === open
            return (
              <button
                key={w}
                type="button"
                role="radio"
                aria-checked={here}
                disabled={!!review || !onChange || open === null}
                onClick={() => choose(w)}
                className={cn(
                  "flex h-11 cursor-pointer items-center gap-2 rounded-xl border px-2.5 text-left text-[15px] transition-[background-color,border-color,opacity,transform] duration-150 ease-out active:scale-[0.97] disabled:cursor-default disabled:active:scale-100",
                  here ? "border-v-ink bg-v-surface shadow-[0_0_0_1px_var(--v-ink)]" : "border-transparent bg-v-surface",
                  where !== undefined && !here && "opacity-45"
                )}
              >
                <span className="v-num w-3 text-[12px] text-v-muted">{POOL_KEYS[j]}</span>
                <span className="flex-1 truncate font-medium">{w}</span>
                {where !== undefined && !here ? <span className="v-num text-[11.5px] text-v-muted">{where}</span> : null}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
