"use client"

// ÖSD Zertifikat A1 / A2 answer formats (research/oesd-a1.md, research/oesd-a2.md §9): the photo grid with a "Text Nr."
// box under each photo, tick grids (one or several per row), "mark 4 of 8" boxes, and the Sprechen material (topic card,
// photo + role choice, picture planning sheet). Same state vocabulary as items.tsx: chosen is ink, right is glow, wrong is
// rosé, and only after grading.

import { useState } from "react"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"
import { pictoIcon } from "@/lib/exam/pictos"
import { ticks, type GridData, type MarkData, type MatchData, type PlanSheet, type SpeakingData } from "@/lib/exam/types"
import { Mark, isChosen, optionState, stateSurface, useExamCopy, type OptionState } from "./primitives"

const label = "v-num text-[11.5px] tracking-[0.08em] text-v-muted uppercase"
const press = "transition-[background-color,border-color,box-shadow,transform] duration-150 ease-out active:scale-[0.97] disabled:cursor-default disabled:active:scale-100"

/** A multi-tick cell: ticked and right → right; ticked and wrong → wrong; missed → solution. */
const tickState = (on: boolean, right: boolean | undefined): OptionState => (right === undefined ? (on ? "selected" : "idle") : on ? (right ? "right" : "wrong") : right ? "solution" : "idle")
const toggle = (keys: string[], all: string[], k: string) => all.filter((x) => (x === k ? !keys.includes(k) : keys.includes(x))).join(",")

function StateMark({ s }: { s: OptionState }) {
  return s === "right" ? <Mark kind="right" inverse className="size-5" /> : s === "solution" ? <Mark kind="right" className="size-5" /> : s === "wrong" ? <Mark kind="wrong" className="size-5" /> : s === "selected" ? <Check className="size-4" strokeWidth={2.5} aria-hidden="true" /> : null
}

/**
 * ÖSD A1 Hören Aufgabe 1: six photos, the candidate writes a text number under one. The answer is stored per text
 * (text n → photo key), so a number sits under one photo at a time; choosing it again elsewhere moves it.
 */
export function PhotoNumberGrid({ data, value, onChange, review }: { data: MatchData; value: Record<number, string>; onChange?: (n: number, k: string) => void; review?: Record<number, string> }) {
  const t = useExamCopy()
  const [open, setOpen] = useState<string | null>(null)
  const numberOn = (key: string) => data.situations.find((s) => value[s.n] === key)?.n
  const solutionOn = (key: string) => (review ? data.situations.find((s) => review[s.n] === key)?.n : undefined)
  const active = data.ads.find((a) => a.key === open)
  const choose = (n: number | null) => {
    if (!active || !onChange) return
    const had = numberOn(active.key)
    if (had !== undefined) onChange(had, "")
    if (n !== null) onChange(n, active.key)
    setOpen(null)
  }
  return (
    <div className="flex flex-col gap-4">
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {data.ads.map((a) => {
          const mine = numberOn(a.key)
          const sol = solutionOn(a.key)
          const graded = review ? (mine === undefined ? (sol === undefined ? "idle" : "solution") : mine === sol ? "right" : "wrong") : null
          return (
            <li key={a.key} className="flex flex-col gap-2">
              <figure className="relative overflow-hidden rounded-2xl bg-v-soft ring-1 ring-v-line">
                {a.image ? (
                  // eslint-disable-next-line @next/next/no-img-element -- 800 px WebP from our Storage
                  <img src={a.image} alt={a.text} loading="lazy" className="aspect-[4/3] w-full object-cover" />
                ) : (
                  <div className="grid aspect-[4/3] place-items-center px-3 pt-8 pb-3 text-center text-[13px] leading-snug text-v-muted">{a.text}</div>
                )}
                <span className="v-num absolute top-2 left-2 grid size-7 place-items-center rounded-full bg-v-surface text-[13px] shadow-[0_2px_8px_-2px_rgb(14_19_34/0.3)]">{a.key}</span>
              </figure>
              <button
                type="button"
                disabled={!!review || !onChange}
                onClick={() => setOpen(open === a.key ? null : a.key)}
                aria-expanded={open === a.key}
                aria-label={`${t.textNo} · Foto ${a.key}${mine ? `: ${mine}` : ""}`}
                className={cn(
                  "flex h-11 cursor-pointer items-center justify-between gap-2 rounded-xl border px-3 text-[14px]",
                  press,
                  graded ? stateSurface[graded] : open === a.key ? "border-v-ink bg-v-ink text-v-bg" : mine ? stateSurface.selected : "border-dashed border-v-ink/35 bg-v-surface text-v-muted"
                )}
              >
                <span className={cn(open === a.key && "text-v-bg/70", !open && mine === undefined && "text-v-muted")}>{t.textNo}</span>
                <span className="flex items-center gap-1.5">
                  {graded === "wrong" ? <span className="v-num line-through opacity-60">{mine}</span> : null}
                  <b className="v-num text-[17px] font-semibold">{graded === "wrong" || graded === "solution" ? sol : mine ?? ""}</b>
                  {graded ? <StateMark s={graded} /> : null}
                </span>
              </button>
            </li>
          )
        })}
      </ul>
      {active && !review ? (
        // Docked above the action bar like the gap tray; no entrance animation (it opens for every photo).
        <div className="sticky bottom-[var(--exam-dock,12px)] z-10 flex flex-col gap-2.5 rounded-2xl bg-v-surface p-3 shadow-[0_8px_30px_-12px_rgb(14_19_34/0.35)] ring-1 ring-v-ink/15" role="radiogroup" aria-label={t.pickTextNo(active.key)}>
          <span className="px-1 text-[14px] font-semibold">{t.pickTextNo(active.key)}</span>
          <div className="flex flex-wrap gap-2">
            {data.situations.map((s) => {
              const here = value[s.n] === active.key
              const elsewhere = !here && !!value[s.n]
              return (
                <button key={s.n} type="button" role="radio" aria-checked={here} onClick={() => choose(s.n)} className={cn("v-num h-11 min-w-11 cursor-pointer rounded-full px-4 text-[16px] font-semibold", press, here ? "bg-v-ink text-v-bg" : "bg-v-soft hover:bg-v-line", elsewhere && "opacity-50")}>
                  {s.n}
                </button>
              )
            })}
            <button type="button" role="radio" aria-checked={numberOn(active.key) === undefined} onClick={() => choose(null)} className={cn("h-11 cursor-pointer rounded-full border border-dashed border-v-ink/35 px-4 text-[14.5px] text-v-muted", press)}>
              {t.noText}
            </button>
          </div>
        </div>
      ) : null}
    </div>
  )
}

/**
 * ÖSD Hören Aufgabe 3: a tick grid, one row per person. One tick per row (A1, radio) or several (A2, checkboxes; the
 * answer is the ticked column keys in column order). Phones: a row is its label plus pill toggles; from sm a printed grid.
 */
export function TickGrid({ data, value, onChange, review }: { data: GridData; value: Record<number, string>; onChange?: (n: number, v: string) => void; review?: Record<number, string> }) {
  const t = useExamCopy()
  const cols = data.columns.map((c) => c.key)
  const template = { "--cols": `repeat(${data.columns.length}, minmax(0, 1fr))` } as React.CSSProperties
  return (
    <div className="flex flex-col gap-3">
      {data.title ? <p className="text-[16.5px] leading-snug font-semibold text-balance">{data.title}</p> : null}
      {data.multi ? <span className={label}>{t.tickMany}</span> : null}
      <div className="flex flex-col rounded-[14px] bg-v-surface ring-1 ring-v-line" style={template}>
        <div className="hidden border-b border-v-line px-3 py-2.5 sm:grid sm:grid-cols-[8rem_var(--cols)] sm:gap-2" aria-hidden="true">
          <span />
          {data.columns.map((c) => <span key={c.key} lang="de" className="min-w-0 text-center text-[12.5px] leading-tight font-semibold break-words hyphens-auto">{c.label}</span>)}
        </div>
        {data.rows.map((r) => {
          const mine = ticks(value[r.n])
          const right = review ? ticks(review[r.n]) : null
          return (
            <div key={r.n} className="grid grid-cols-[minmax(0,1fr)] gap-2 border-b border-v-line px-3 py-3 last:border-b-0 sm:grid-cols-[8rem_var(--cols)] sm:items-center" role={data.multi ? "group" : "radiogroup"} aria-label={`${r.n} · ${r.text}`}>
              <span className="flex items-center gap-2 text-[15px] font-semibold">
                <span className="v-num grid size-6 place-items-center rounded-full bg-v-soft text-[12px] font-normal">{r.n}</span>
                {r.text}
              </span>
              <div className="flex flex-wrap gap-2 sm:contents">
                {data.columns.map((c) => {
                  const s = data.multi ? tickState(mine.includes(c.key), right ? right.includes(c.key) : undefined) : optionState(c.key, value[r.n], review ? { correct: review[r.n] } : undefined)
                  return (
                    <button
                      key={c.key}
                      type="button"
                      role={data.multi ? "checkbox" : "radio"}
                      aria-checked={isChosen(s)}
                      aria-label={c.label}
                      disabled={!!review || !onChange}
                      onClick={() => onChange?.(r.n, data.multi ? toggle(mine, cols, c.key) : c.key)}
                      className={cn("flex h-11 cursor-pointer items-center justify-center gap-1.5 rounded-full border px-3.5 text-[14.5px] sm:justify-self-center sm:px-0 sm:w-11", press, stateSurface[s], s === "selected" && "bg-v-ink text-v-bg", s === "idle" && !review && "hover:border-v-ink/30")}
                    >
                      <span className="sm:hidden">{c.label}</span>
                      <span className={cn(s === "idle" && "hidden sm:inline-block sm:size-4 sm:rounded-[4px] sm:border-2 sm:border-v-ink/25")} aria-hidden="true">
                        {s === "idle" ? null : <StateMark s={s === "selected" ? "selected" : s} />}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

/** ÖSD A2 Hören Aufgabe 1: mark `pick` of the boxes. More marks are allowed (they cost points), so the counter warns. */
export function MarkBoxes({ data, value, onChange, review }: { data: MarkData; value: Record<number, string>; onChange?: (n: number, v: string) => void; review?: Record<number, string> }) {
  const t = useExamCopy()
  const keys = data.options.map((o) => o.key)
  const mine = ticks(value[data.ns[0]])
  const right = review ? data.ns.map((n) => review[n]) : null
  const set = (v: string) => data.ns.forEach((n) => onChange?.(n, v))
  return (
    <div className="@container flex flex-col gap-3">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <p className="text-[17px] font-semibold tracking-[-0.01em]">{data.title}</p>
        <span className={cn("v-num text-[13px]", mine.length > data.pick ? "text-(--p-ember)" : "text-v-muted")} aria-live="polite">
          {t.marked(mine.length, data.pick)}
          {mine.length > data.pick ? ` · ${t.tooMany}` : ""}
        </span>
      </div>
      <div lang="de" className="grid grid-cols-2 gap-2 @2xl:grid-cols-4" role="group" aria-label={data.title}>
        {data.options.map((o) => {
          const s = tickState(mine.includes(o.key), right ? right.includes(o.key) : undefined)
          return (
            <button
              key={o.key}
              type="button"
              role="checkbox"
              aria-checked={isChosen(s)}
              disabled={!!review || !onChange}
              onClick={() => set(toggle(mine, keys, o.key))}
              className={cn("flex min-h-14 min-w-0 cursor-pointer items-center gap-2 rounded-xl border px-2.5 py-2 text-left text-[15px] leading-tight", press, stateSurface[s], s === "idle" && !review && "hover:border-v-ink/30")}
            >
              <span className={cn("grid size-5 shrink-0 place-items-center rounded-[5px] border-2", isChosen(s) ? "border-v-ink bg-v-ink text-v-bg" : "border-v-ink/25")}>
                {isChosen(s) ? <Check className="size-3.5" strokeWidth={3} aria-hidden="true" /> : null}
              </span>
              <span className="min-w-0 flex-1 font-medium break-words hyphens-auto">{o.label}</span>
              {s !== "selected" ? <StateMark s={s} /> : null}
            </button>
          )
        })}
      </div>
    </div>
  )
}

/** ÖSD Sprechen Aufgabe 1: the topic card. The candidate ticks the topics they will talk about (A1 4, A2 5 of 6). */
export function TopicCard({ data, picked, onPick }: { data: SpeakingData; picked?: string[]; onPick?: (topics: string[]) => void }) {
  const t = useExamCopy()
  const want = data.choose ?? data.points.length
  const mine = picked ?? []
  return (
    <section lang="de" className="flex flex-col gap-3 rounded-[14px] bg-v-surface p-4 ring-1 ring-v-line sm:p-5" aria-label={data.title}>
      <div className="flex items-baseline justify-between gap-2">
        <span className={label}>{t.planSheet}</span>
        <span className="v-num text-[12.5px] text-v-muted" aria-live="polite">{t.chooseTopics(want, data.points.length)}{onPick ? ` · ${mine.length}/${want}` : ""}</span>
      </div>
      <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {data.points.map((p) => {
          const on = mine.includes(p)
          return (
            <li key={p}>
              <button
                type="button"
                aria-pressed={on}
                disabled={!onPick || (!on && mine.length >= want)}
                onClick={() => onPick?.(on ? mine.filter((x) => x !== p) : [...mine, p])}
                className={cn("flex min-h-12 w-full cursor-pointer items-center gap-2 rounded-xl border px-3 text-left text-[15.5px] font-semibold disabled:opacity-100", press, on ? stateSurface.selected : "border-v-line bg-v-surface", onPick && !on && mine.length >= want && "opacity-45")}
              >
                {onPick ? <span className={cn("grid size-5 shrink-0 place-items-center rounded-full", on ? "bg-v-ink text-v-bg" : "border-2 border-v-ink/20")}>{on ? <Check className="size-3" strokeWidth={3} aria-hidden="true" /> : null}</span> : null}
                {p}
              </button>
            </li>
          )
        })}
      </ul>
    </section>
  )
}

/** ÖSD A1 Sprechen Aufgabe 2–3: choose one of three photos, then (Aufgabe 3) one of its two roles. */
export function SceneChoice({ scenes, value, onChange, role, onRole }: { scenes: NonNullable<SpeakingData["scenes"]>; value?: string; onChange?: (key: string) => void; role?: string; onRole?: (role: string) => void }) {
  const t = useExamCopy()
  const chosen = scenes.find((s) => s.key === value)
  return (
    <div className="flex flex-col gap-3">
      <span className={label}>{t.choosePhoto}</span>
      <div className="-mx-1 flex snap-x snap-mandatory gap-2 overflow-x-auto px-1 pb-1 sm:grid sm:grid-cols-3 sm:overflow-visible" role="radiogroup" aria-label={t.choosePhoto}>
        {scenes.map((s) => {
          const on = s.key === value
          return (
            <button key={s.key} type="button" role="radio" aria-checked={on} disabled={!onChange} onClick={() => onChange?.(s.key)} className={cn("flex w-[72%] shrink-0 cursor-pointer snap-start flex-col gap-2 rounded-2xl border p-2 text-left sm:w-auto", press, stateSurface[on ? "selected" : "idle"])}>
              {s.image ? (
                // eslint-disable-next-line @next/next/no-img-element -- 800 px WebP from our Storage
                <img src={s.image} alt={s.label} loading="lazy" className="aspect-[3/2] w-full rounded-xl bg-v-soft object-cover" />
              ) : (
                <div className="grid aspect-[3/2] w-full place-items-center rounded-xl bg-v-soft text-[13px] text-v-muted">{s.label}</div>
              )}
              <span className="flex items-center gap-2 px-1 pb-1 text-[14.5px] font-semibold">
                <span className={cn("v-num grid size-6 place-items-center rounded-full text-[12px] font-normal", on ? "bg-v-ink text-v-bg" : "bg-v-soft")}>{s.key}</span>
                {s.label}
              </span>
            </button>
          )
        })}
      </div>
      {chosen?.roles && onRole !== undefined ? (
        <div className="flex flex-col gap-2">
          <span className={label}>{t.chooseRole}</span>
          <div className="grid grid-cols-2 gap-2" role="radiogroup" aria-label={t.chooseRole}>
            {chosen.roles.map((r) => (
              <button key={r} type="button" role="radio" aria-checked={role === r} onClick={() => onRole(r)} className={cn("h-12 cursor-pointer rounded-full border px-4 text-[15px] font-semibold", press, role === r ? "border-v-ink bg-v-ink text-v-bg" : stateSurface.idle)}>
                {r}
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  )
}

/** ÖSD A2 Sprechen Aufgabe 2: the planning sheet, one row of picture prompts per question and the open box at the end. */
export function PlanningSheet({ sheet }: { sheet: PlanSheet }) {
  const t = useExamCopy()
  return (
    <section lang="de" className="flex flex-col gap-4 rounded-[14px] bg-v-surface p-4 ring-1 ring-v-line sm:p-6" aria-label={sheet.title}>
      <span className={label}>{t.planSheet}</span>
      <h3 className="text-[19px] leading-tight font-semibold tracking-[-0.01em] text-balance">{sheet.title}</h3>
      <dl className="flex flex-col">
        {sheet.rows.map((r) => (
          <div key={r.label} className="grid grid-cols-[minmax(0,1fr)] gap-2 border-t border-v-line py-3 sm:grid-cols-[9rem_minmax(0,1fr)] sm:items-center">
            <dt className="text-[16px] font-semibold">{r.label}</dt>
            <dd className="grid grid-cols-3 gap-2">
              {r.pictures.map((p) => {
                const Icon = pictoIcon(p.picto)
                return (
                  <figure key={p.label} className="flex flex-col items-center gap-1.5 rounded-xl bg-v-soft px-1.5 py-2.5 text-center">
                    {p.image ? (
                      // eslint-disable-next-line @next/next/no-img-element -- small WebP from our Storage
                      <img src={p.image} alt="" className="aspect-square w-full rounded-lg object-cover" />
                    ) : Icon ? (
                      <Icon className="size-8" strokeWidth={1.3} aria-hidden="true" />
                    ) : null}
                    <figcaption className="text-[12.5px] leading-tight font-medium text-balance">{p.label}</figcaption>
                  </figure>
                )
              })}
            </dd>
          </div>
        ))}
        <div className="border-t border-v-line pt-3">
          <dt className="sr-only">{sheet.more ?? t.sheetMore}</dt>
          <dd className="rounded-xl border border-dashed border-v-ink/30 px-3 py-3 text-[15px] text-v-muted">{sheet.more ?? t.sheetMore}</dd>
        </div>
      </dl>
    </section>
  )
}
