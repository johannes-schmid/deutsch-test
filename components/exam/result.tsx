"use client"

import { useState, type ReactNode } from "react"
import Link from "next/link"
import { ArrowRight, ChevronDown, Clock } from "lucide-react"
import { cn } from "@/lib/utils"
import type { CriterionResult, Level, PartResult, ReviewEntry, Score } from "@/lib/exam/types"
import { LevelScale } from "@/components/design/kit"
import { LevelSeal, PartIcon, ScoreSeal, type LevelId } from "@/components/design/variants/nachtzug-icons"
import { ExamButton, useExamCopy } from "./primitives"

const SEAL: Record<Level, LevelId> = { B1: "b1", A2: "a2", "unter A2": "unter-a2" }
const STEPS: Record<Level, number> = { "unter A2": 1, A2: 2, B1: 3 }

/**
 * The verdict. DTZ results are B1 / A2 / unter A2, never a percentage or "bestanden". Exams scored in points
 * (Goethe, telc, ÖSD) pass `score` + `pass` instead and show their own format: points and bestanden / nicht bestanden.
 */
export function ResultHero({ level, score, pass, meta, headline, summary, note, as: Heading = "h1" }: { level?: Level; score?: Score; pass?: number; meta: string; headline: ReactNode; summary: string; note?: string; as?: "h1" | "h2" }) {
  const t = useExamCopy()
  const share = score && score.max ? score.points / score.max : 0
  const passed = pass !== undefined && share >= pass
  return (
    <section className="nz-app grid grid-cols-[minmax(0,1fr)] items-center gap-8 rounded-[28px] p-6 sm:p-10 md:grid-cols-[minmax(0,1.3fr)_auto]">
      <div className="flex flex-col gap-4">
        <span className="text-[14px] text-v-muted">{meta}</span>
        <Heading className="v-display text-[clamp(38px,5.4vw,64px)] leading-[1.04]">{headline}</Heading>
        <p className="max-w-[46ch] text-[17px] leading-relaxed text-v-muted">{summary}</p>
        <span className="text-[12.5px] text-v-muted">{note ?? (level ? t.resultNote : t.resultNotePoints)}</span>
      </div>
      <div className="order-first flex flex-col items-center gap-4 justify-self-center md:order-none">
        {level ? (
          <>
            <LevelSeal level={SEAL[level]} size={168} ariaLabel={t.levelAria} />
            <LevelScale level={level} belowLabel={t.belowA2} ariaLabel={t.resultTitle} className="w-[220px]" />
          </>
        ) : score && pass !== undefined ? (
          <>
            <ScoreSeal share={share} pass={pass} passed={passed} size={168} ariaLabel={t.scoreAria} />
            <span className="flex flex-col items-center gap-1.5">
              <PassPill passed={passed} />
              <span className="v-num text-[13px] text-v-muted">{t.points(score.points, score.max)} · {t.passMark(Math.round(pass * 100))}</span>
            </span>
          </>
        ) : null}
      </div>
    </section>
  )
}

function PassPill({ passed }: { passed: boolean }) {
  const t = useExamCopy()
  return (
    <span className={cn("rounded-full px-3 py-1 text-[13px] font-semibold whitespace-nowrap", passed ? "bg-(--p-glow) text-[#0A0D18]" : "bg-v-ink text-v-bg")}>
      {passed ? t.passed : t.failed}
    </span>
  )
}

function LevelPill({ level }: { level: Level }) {
  const t = useExamCopy()
  return (
    <span className={cn("v-num rounded-full px-3 py-1 text-[13px] font-semibold whitespace-nowrap", level === "B1" ? "bg-(--p-glow) text-[#0A0D18]" : level === "A2" ? "bg-v-ink text-v-bg" : "bg-v-soft")}>
      {level === "unter A2" ? t.belowA2 : level}
    </span>
  )
}

/** Three steps: the level (unter A2 / A2 / B1) or the points band (0 / half / full). */
function Meter({ steps }: { steps: number }) {
  return (
    <span className="flex gap-0.5" aria-hidden="true">
      {[1, 2, 3].map((i) => (
        <span key={i} className={cn("h-1.5 w-4 rounded-full", i <= steps ? (steps === 3 ? "bg-(--p-glow)" : "bg-v-ink") : "bg-v-ink/12")} />
      ))}
    </span>
  )
}

const pointSteps = (p: Score) => (p.points >= p.max ? 3 : p.points > 0 ? 2 : 1)

function Criterion({ c }: { c: CriterionResult }) {
  const t = useExamCopy()
  return (
    <li className="flex flex-col gap-2 border-b border-v-line py-3 last:border-b-0">
      <div className="flex items-center justify-between gap-3">
        <b className="text-[15px] font-semibold">{c.name}</b>
        <span className="flex shrink-0 items-center gap-2 text-[13px] text-v-muted">
          {c.points ? (
            <>
              <Meter steps={pointSteps(c.points)} />
              <span className="v-num w-14 text-right">{t.pointsShort(c.points.points, c.points.max)}</span>
            </>
          ) : c.level ? (
            <>
              <Meter steps={STEPS[c.level]} />
              <span className="v-num w-14 text-right">{c.level === "unter A2" ? t.belowA2 : c.level}</span>
            </>
          ) : null}
        </span>
      </div>
      <p className="text-[14.5px] leading-relaxed text-v-muted">{c.comment}</p>
      {c.quote ? (
        <div className="grid grid-cols-[minmax(0,1fr)] gap-1.5 rounded-xl bg-v-soft p-3 text-[14px] leading-snug">
          <span><span className="text-v-muted">{t.yourText}: </span><s className="decoration-v-ink/40">{c.quote.yours}</s></span>
          <span><span className="text-v-muted">{t.better}: </span><mark className="rounded-md bg-[color-mix(in_srgb,var(--p-glow)_55%,transparent)] px-1 text-v-ink">{c.quote.better}</mark></span>
        </div>
      ) : null}
    </li>
  )
}

export function PartResultCard({ result, defaultOpen = false }: { result: PartResult; defaultOpen?: boolean }) {
  const t = useExamCopy()
  const [open, setOpen] = useState(defaultOpen)
  const criteria = result.criteria ?? []
  const shown = open ? criteria : criteria.slice(0, 2)
  return (
    <article className="nz-app flex flex-col gap-4 rounded-[24px] p-5">
      <header className="flex items-center gap-3">
        <PartIcon part={result.part} />
        <h3 className="flex-1 text-[19px] font-semibold tracking-[-0.01em]">{result.name}</h3>
        {result.level ? <LevelPill level={result.level} /> : result.passed !== undefined ? <PassPill passed={result.passed} /> : null}
        {result.score ? <span className="v-num text-[13px] text-v-muted">{t.pointsShort(result.score.points, result.score.max)}</span> : null}
      </header>
      {result.teile ? (
        <ul className="flex flex-col gap-3">
          {result.teile.map((teil) => {
            const right = teil.items.filter((i) => i.right).length
            return (
              <li key={teil.label} className="flex flex-col gap-2">
                <div className="flex items-baseline justify-between text-[14px]">
                  <span className="font-medium">{teil.label}</span>
                  <span className="text-v-muted">{t.correctOf(right, teil.items.length)}</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {teil.items.map((i) => (
                    <span
                      key={i.n}
                      aria-label={`${t.task} ${i.n}: ${i.right ? t.richtig : t.falsch}`}
                      className={cn("v-num grid size-7 place-items-center rounded-full text-[11.5px]", i.right ? "bg-(--p-glow) text-[#0A0D18]" : "bg-[color-mix(in_srgb,var(--v-sk-schreiben)_50%,var(--v-surface))] text-v-ink")}
                    >
                      {i.n}
                    </span>
                  ))}
                </div>
              </li>
            )
          })}
        </ul>
      ) : null}
      {criteria.length ? (
        <>
          <ul className="flex flex-col">{shown.map((c) => <Criterion key={c.name} c={c} />)}</ul>
          {criteria.length > 2 ? (
            <button type="button" onClick={() => setOpen((o) => !o)} aria-expanded={open} className="flex cursor-pointer items-center gap-1.5 self-start rounded-full bg-v-soft px-3.5 py-2 text-[13.5px] font-medium">
              {open ? t.showLess : `${t.showAll} (${criteria.length})`}
              <ChevronDown className={cn("size-4 transition-transform duration-200 ease-out", open && "rotate-180")} aria-hidden="true" />
            </button>
          ) : null}
        </>
      ) : null}
    </article>
  )
}

export function ReviewList({ entries }: { entries: ReviewEntry[] }) {
  const t = useExamCopy()
  return (
    <section className="nz-app flex flex-col gap-2 rounded-[24px] p-5">
      <h2 className="text-[19px] font-semibold tracking-[-0.01em]">{t.review}</h2>
      <p className="text-[14.5px] text-v-muted">{t.reviewNote}</p>
      <ul className="mt-2 flex flex-col">
        {entries.map((e) => (
          <li key={e.n} className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 border-b border-v-line py-3 last:border-b-0">
            <span className="v-num grid size-9 place-items-center rounded-full bg-v-soft text-[13px]">{e.n}</span>
            <span className="flex min-w-0 flex-col">
              <span className="text-[12.5px] text-v-muted">{e.part}</span>
              <span className="truncate text-[15px] font-medium">{e.prompt}</span>
              <span className="text-[13px] text-v-muted">
                {t.yours}: <s>{e.yours}</s> · {t.solution}: <b className="font-semibold text-v-ink">{e.solution}</b>
              </span>
            </span>
            <a href={e.href ?? "#"} className="rounded-full bg-v-soft px-3.5 py-2 text-[13.5px] font-medium transition-transform active:scale-[0.97]">{t.open}</a>
          </li>
        ))}
      </ul>
    </section>
  )
}

/** Routing is rule-based (AI Act boundary): weakest part first, then a new full mock. */
export function NextStepCard({ text, cta, onCta, onNewTest, secondary }: { text: string; cta: string; onCta?: () => void; onNewTest?: () => void; secondary?: string }) {
  const t = useExamCopy()
  return (
    <section className="flex flex-col gap-4 rounded-[24px] bg-(--p-glow) p-6 text-[#0A0D18] sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-col gap-1">
        <span className="text-[13px] opacity-70">{t.nextStep}</span>
        <p className="max-w-[40ch] text-[19px] leading-snug font-semibold tracking-[-0.01em]">{text}</p>
      </div>
      <div className="flex shrink-0 flex-wrap gap-2">
        <ExamButton onClick={onCta} className="bg-[#0A0D18] text-white">{cta}</ExamButton>
        <ExamButton kind="soft" onClick={onNewTest} className="bg-white/55 text-[#0A0D18]">{secondary ?? t.newTest}</ExamButton>
      </div>
    </section>
  )
}

/** Correct out of total as a ring of one segment per task, filled in one run from the top: "3 of 5" reads as 3 of 5. */
export function ScoreRing({ correct, total, caption, size = 150 }: { correct: number; total: number; caption: string; size?: number }) {
  const c = size / 2
  const r = c - 10
  const gap = total > 1 ? Math.min(14, 120 / total) : 0
  const step = 360 / Math.max(total, 1)
  const point = (deg: number) => {
    const a = ((deg - 90) * Math.PI) / 180
    return `${c + r * Math.cos(a)} ${c + r * Math.sin(a)}`
  }
  const arc = (i: number) => {
    const from = i * step + gap / 2
    const to = (i + 1) * step - gap / 2
    return `M ${point(from)} A ${r} ${r} 0 ${to - from > 180 ? 1 : 0} 1 ${point(to)}`
  }
  return (
    <div className="relative grid shrink-0 place-items-center" style={{ width: size, height: size }} role="img" aria-label={`${correct} / ${total} ${caption}`}>
      <svg viewBox={`0 0 ${size} ${size}`} className="absolute inset-0" aria-hidden="true">
        {Array.from({ length: total }, (_, i) => (
          <path key={i} d={arc(i)} fill="none" strokeWidth={9} strokeLinecap="round" className={i < correct ? "stroke-v-ink" : "stroke-v-ink/10"} />
        ))}
      </svg>
      <span className="flex flex-col items-center" aria-hidden="true">
        <b className="v-num text-[40px] leading-none font-semibold tracking-[-0.04em]">
          {correct}
          <span className="text-[18px] font-normal text-v-muted">/{total}</span>
        </b>
        <small className="v-num mt-1.5 text-[11px] tracking-[0.08em] text-v-muted uppercase">{caption}</small>
      </span>
    </div>
  )
}

/**
 * The end screen's one result card, after inburgeringoefenen.nl's free-practice result: the ring (or the seal) on
 * the left, a mono line with the raw score, the verdict, where points went, then the scale and the time.
 */
export function ResultSummary({ visual, eyebrow, headline, lead, scale, time, note }: { visual: ReactNode; eyebrow: string; headline: ReactNode; lead?: ReactNode; scale?: ReactNode; time?: string; note: string }) {
  return (
    <section className="nz-app grid grid-cols-[minmax(0,1fr)] gap-6 rounded-[28px] p-6 sm:grid-cols-[auto_minmax(0,1fr)] sm:items-start sm:gap-8 sm:p-8">
      <div className="justify-self-center">{visual}</div>
      <div className="flex min-w-0 flex-col gap-3">
        <span className="v-num text-[12px] tracking-[0.08em] text-v-muted uppercase">{eyebrow}</span>
        <h2 className="text-[clamp(26px,3.4vw,34px)] leading-[1.12] font-semibold tracking-[-0.025em] text-balance">{headline}</h2>
        {lead ? <p className="max-w-[60ch] text-[15.5px] leading-relaxed text-v-muted text-pretty">{lead}</p> : null}
        {scale ? <div className="pt-1">{scale}</div> : null}
        {time ? (
          <p className="flex items-start gap-2 text-[14.5px] leading-snug text-v-muted">
            <Clock className="mt-px size-4 shrink-0" aria-hidden="true" />
            {time}
          </p>
        ) : null}
        <span className="text-[12.5px] text-v-muted">{note}</span>
      </div>
    </section>
  )
}

/** Points against the pass mark on one bar, with a tick at the mark. For exams scored in points. */
export function PointsBar({ score, pass }: { score: Score; pass: number }) {
  const t = useExamCopy()
  const share = score.max ? score.points / score.max : 0
  const passed = share >= pass
  return (
    <div className="flex flex-col gap-2">
      <div className="relative h-2.5 overflow-hidden rounded-full bg-v-ink/8" role="img" aria-label={`${t.points(score.points, score.max)} · ${t.passMark(Math.round(pass * 100))}`}>
        <span className={cn("absolute inset-y-0 left-0 rounded-full", passed ? "bg-(--p-glow)" : "bg-v-ink")} style={{ width: `${share * 100}%` }} />
        <span className="absolute inset-y-0 w-0.5 bg-v-ink/50" style={{ left: `${pass * 100}%` }} />
      </div>
      <span className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[13px] text-v-muted">
        <PassPill passed={passed} />
        <span className="v-num">{t.points(score.points, score.max)} · {t.passMark(Math.round(pass * 100))}</span>
      </span>
    </div>
  )
}

/** The way on: one big ink button, a note under it, then quiet text links. */
export function ContinueCard({ href, cta, note, links }: { href: string; cta: string; note?: ReactNode; links?: ReactNode }) {
  return (
    <section className="nz-app flex flex-col items-center gap-3 rounded-[28px] p-5 text-center sm:p-6">
      <Link href={href} className="group flex h-14 w-full items-center justify-center gap-2 rounded-full bg-v-ink px-6 text-[16.5px] font-semibold text-v-bg shadow-[0_18px_36px_-18px_rgba(8,10,30,0.6)] transition-transform duration-150 ease-out active:scale-[0.98]">
        {cta}
        <ArrowRight className="size-5 transition-transform duration-150 ease-out group-hover:translate-x-0.5" aria-hidden="true" />
      </Link>
      {note ? <p className="text-[13.5px] leading-relaxed text-v-muted">{note}</p> : null}
      {links ? <div className="flex flex-wrap justify-center gap-x-5 gap-y-1 text-[14px] font-semibold">{links}</div> : null}
    </section>
  )
}
