"use client"

import { useState } from "react"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"
import { pictoIcon } from "@/lib/exam/pictos"
import type { ChoiceData, GapData, MatchData, PictureData, TrueFalse, TrueFalseData } from "@/lib/exam/types"
import { ItemHeader, Mark, OptionCard, isChosen, optionState, stateSurface, useExamCopy } from "./primitives"

type Review = { correct: string }

export function ChoiceItem({ item, label, value, onChange, review }: { item: ChoiceData; label?: string; value: string | null; onChange?: (k: string) => void; review?: Review }) {
  return (
    <div className="flex flex-col gap-4">
      <ItemHeader n={item.n} label={label}>{item.prompt}</ItemHeader>
      <div className="flex flex-col gap-2" role="radiogroup" aria-label={item.prompt}>
        {item.options.map((o) => (
          <OptionCard key={o.key} k={o.key} label={o.label} state={optionState(o.key, value, review)} onSelect={review || !onChange ? undefined : () => onChange(o.key)} />
        ))}
      </div>
    </div>
  )
}

export function TrueFalseItem({ item, label, value, onChange, review }: { item: TrueFalseData; label?: string; value: TrueFalse | null; onChange?: (v: TrueFalse) => void; review?: { correct: TrueFalse } }) {
  const t = useExamCopy()
  return (
    <div className="flex flex-col gap-4">
      <ItemHeader n={item.n} label={label}>{item.statement}</ItemHeader>
      <div className="grid grid-cols-2 gap-2" role="radiogroup" aria-label={item.statement}>
        {(["richtig", "falsch"] as const).map((v) => {
          const s = optionState(v, value, review)
          return (
            <button
              key={v}
              type="button"
              role="radio"
              aria-checked={isChosen(s)}
              disabled={!!review || !onChange}
              onClick={() => onChange?.(v)}
              className={cn(
                "flex h-14 cursor-pointer items-center justify-center gap-2 rounded-2xl border text-[16.5px] font-semibold transition-[background-color,border-color,box-shadow,transform] duration-150 ease-out active:scale-[0.98] disabled:cursor-default disabled:active:scale-100",
                s === "selected" ? "border-v-ink bg-v-ink text-v-bg" : stateSurface[s],
                s === "idle" && !review && "hover:border-v-ink/30"
              )}
            >
              {s === "right" ? <Mark kind="right" inverse className="size-5" /> : s === "solution" ? <Mark kind="right" className="size-5" /> : s === "wrong" ? <Mark kind="wrong" className="size-5" /> : null}
              {v === "richtig" ? t.richtig : t.falsch}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export function PictureItem({ item, label, value, onChange, review }: { item: PictureData; label?: string; value: string | null; onChange?: (k: string) => void; review?: Review }) {
  return (
    <div className="flex flex-col gap-4">
      <ItemHeader n={item.n} label={label}>{item.prompt}</ItemHeader>
      <div className="grid grid-cols-3 gap-2" role="radiogroup" aria-label={item.prompt}>
        {item.options.map((o) => {
          const s = optionState(o.key, value, review)
          const Icon = o.icon ?? pictoIcon(o.picto)
          return (
            <button
              key={o.key}
              type="button"
              role="radio"
              aria-checked={isChosen(s)}
              aria-label={`${o.key}: ${o.label}`}
              disabled={!!review || !onChange}
              onClick={() => onChange?.(o.key)}
              className={cn(
                "relative grid aspect-square cursor-pointer place-items-center overflow-hidden rounded-2xl border transition-[border-color,box-shadow,transform,background-color] duration-150 ease-out active:scale-[0.97] disabled:cursor-default disabled:active:scale-100",
                stateSurface[s]
              )}
            >
              {o.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={o.image} alt="" className="absolute inset-0 size-full object-cover" />
              ) : Icon ? (
                <span className="flex flex-col items-center gap-2 px-1.5 pt-4">
                  <Icon className="size-10 sm:size-11" strokeWidth={1.25} aria-hidden="true" />
                  {o.picto ? <span className="v-num text-center text-[14px] leading-tight font-semibold sm:text-[15px]" aria-hidden="true">{o.label}</span> : null}
                </span>
              ) : null}
              <span className={cn("v-num absolute top-2 left-2 grid size-6 place-items-center rounded-full text-[12px]", s === "selected" ? "bg-v-ink text-v-bg" : "bg-v-soft")}>{o.key}</span>
              {s === "right" || s === "solution" ? <Mark kind="right" className="absolute top-2 right-2" /> : s === "wrong" ? <Mark kind="wrong" className="absolute top-2 right-2" /> : null}
            </button>
          )
        })}
      </div>
    </div>
  )
}

/** Numbered tabs for the situations or texts of a matching task, with what was chosen and, in review, right/wrong. */
export function SituationTabs({ items, active, onActive, value, review, label }: { items: { n: number }[]; active: number; onActive: (i: number) => void; value: Record<number, string>; review?: Record<number, string>; label: string }) {
  return (
    <div className="flex flex-wrap items-center gap-2" role="tablist" aria-label={label}>
      {items.map((x, j) => {
        const graded = review ? (value[x.n] === review[x.n] ? "right" : "wrong") : null
        return (
          <button
            key={x.n}
            type="button"
            role="tab"
            aria-selected={j === active}
            onClick={() => onActive(j)}
            className={cn(
              "v-num flex h-9 cursor-pointer items-center gap-1.5 rounded-full px-3.5 text-[13.5px] transition-colors",
              j === active ? "bg-v-ink text-v-bg" : graded === "right" ? "bg-(--p-glow) text-[#0A0D18]" : graded === "wrong" ? "bg-[color-mix(in_srgb,var(--v-sk-schreiben)_30%,var(--v-surface))]" : value[x.n] ? "bg-v-soft" : "border border-v-line text-v-muted"
            )}
          >
            {x.n}{value[x.n] ? ` · ${value[x.n]}` : ""}
          </button>
        )
      })}
    </div>
  )
}

/** Situations to ads (+ x for "no match"). One situation at a time; the ads scroll sideways. */
export function MatchItem({ data, value, onChange, review, noMatch = true }: { data: MatchData; value: Record<number, string>; onChange?: (n: number, k: string) => void; review?: Record<number, string>; noMatch?: boolean }) {
  const t = useExamCopy()
  const [i, setI] = useState(0)
  const s = data.situations[i]
  const ads = noMatch ? [...data.ads, { key: "x", title: t.noMatch, text: t.noMatchText }] : data.ads
  return (
    <div className="flex flex-col gap-4">
      <SituationTabs items={data.situations} active={i} onActive={setI} value={value} review={review} label={t.situations} />
      <ItemHeader>{s.text}</ItemHeader>
      <div className="-mx-5 flex snap-x snap-mandatory scroll-px-5 gap-2 overflow-x-auto px-5 pb-1" role="radiogroup" aria-label={s.text}>
        {ads.map((a) => {
          const st = optionState(a.key, value[s.n], review ? { correct: review[s.n] } : undefined)
          return (
            <button
              key={a.key}
              type="button"
              role="radio"
              aria-checked={isChosen(st)}
              disabled={!!review || !onChange}
              onClick={() => onChange?.(s.n, a.key)}
              className={cn(
                "flex w-[200px] shrink-0 cursor-pointer snap-start flex-col gap-2 rounded-2xl border p-3.5 text-left text-[14px] leading-snug transition-[border-color,box-shadow,transform,background-color] duration-150 ease-out active:scale-[0.98] disabled:cursor-default disabled:active:scale-100",
                stateSurface[st],
                a.key === "x" && st === "idle" && "border-dashed"
              )}
            >
              <span className="flex items-center justify-between">
                <span className={cn("v-num grid size-7 place-items-center rounded-full text-[13px]", st === "selected" ? "bg-v-ink text-v-bg" : "bg-v-soft")}>{a.key}</span>
                {st === "selected" ? <Check className="size-4" strokeWidth={2.5} aria-hidden="true" /> : st === "right" ? <Mark kind="right" inverse /> : st === "solution" ? <Mark kind="right" /> : st === "wrong" ? <Mark kind="wrong" /> : null}
              </span>
              <b className="font-semibold">{a.title}</b>
              <span className={cn(st === "right" ? "opacity-75" : "text-v-muted")}>{a.text}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

/** A letter with gaps. Tapping a gap opens its options under the text. */
export function GapItem({ data, value, onChange, review }: { data: GapData; value: Record<number, string>; onChange?: (n: number, v: string) => void; review?: Record<number, string> }) {
  const t = useExamCopy()
  const gaps = data.parts.filter((p) => typeof p !== "string")
  const [open, setOpen] = useState<number | null>(review ? null : gaps.find((g) => !value[g.n])?.n ?? null)
  const active = gaps.find((g) => g.n === open)
  return (
    <div className="flex flex-col gap-4">
      <p className="text-[17px] leading-[2] whitespace-pre-line">
        {data.parts.map((p, i) => {
          if (typeof p === "string") return <span key={i}>{p}</span>
          const graded = review ? (value[p.n] === review[p.n] ? "right" : "wrong") : null
          return (
            <button
              key={i}
              type="button"
              onClick={() => !review && setOpen(p.n)}
              aria-expanded={open === p.n}
              aria-label={`${t.gap(p.n)}${value[p.n] ? `: ${value[p.n]}` : ""}`}
              className={cn(
                "mx-0.5 inline-flex h-8 min-w-24 cursor-pointer items-center justify-center gap-1.5 rounded-full px-3 align-middle text-[15px] font-semibold transition-colors",
                graded === "right" ? "bg-(--p-glow) text-[#0A0D18]" : graded === "wrong" ? "bg-[color-mix(in_srgb,var(--v-sk-schreiben)_30%,var(--v-surface))]" : open === p.n ? "bg-v-ink text-v-bg" : value[p.n] ? "bg-v-soft" : "border border-dashed border-v-ink/40 text-v-muted"
              )}
            >
              {graded === "wrong" ? <span className="line-through opacity-60">{value[p.n]}</span> : value[p.n] ?? <span className="v-num font-normal">{p.n}</span>}
              {graded === "wrong" ? <span>{review![p.n]}</span> : null}
            </button>
          )
        })}
      </p>
      {active && !review ? (
        <div key={active.n} className="nz-screen flex flex-wrap items-center gap-2 rounded-2xl bg-v-soft p-2" role="radiogroup" aria-label={t.gap(active.n)}>
          <span className="v-num px-2 text-[13px] text-v-muted">{active.n}</span>
          {active.options.map((o) => (
            <button
              key={o}
              type="button"
              role="radio"
              aria-checked={value[active.n] === o}
              onClick={() => {
                onChange?.(active.n, o)
                setOpen(gaps.find((g) => g.n !== active.n && !value[g.n])?.n ?? null)
              }}
              className={cn("h-11 cursor-pointer rounded-full px-5 text-[15.5px] font-medium transition-[background-color,transform] duration-150 active:scale-[0.97]", value[active.n] === o ? "bg-v-ink text-v-bg" : "bg-v-surface")}
            >
              {o}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  )
}
