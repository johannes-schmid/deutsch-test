"use client"

import { useState, type ReactNode } from "react"
import { ChevronDown } from "lucide-react"
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
export function NextStepCard({ text, cta, onCta, onNewTest }: { text: string; cta: string; onCta?: () => void; onNewTest?: () => void }) {
  const t = useExamCopy()
  return (
    <section className="flex flex-col gap-4 rounded-[24px] bg-(--p-glow) p-6 text-[#0A0D18] sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-col gap-1">
        <span className="text-[13px] opacity-70">{t.nextStep}</span>
        <p className="max-w-[40ch] text-[19px] leading-snug font-semibold tracking-[-0.01em]">{text}</p>
      </div>
      <div className="flex shrink-0 flex-wrap gap-2">
        <ExamButton onClick={onCta} className="bg-[#0A0D18] text-white">{cta}</ExamButton>
        <ExamButton kind="soft" onClick={onNewTest} className="bg-white/55 text-[#0A0D18]">{t.newTest}</ExamButton>
      </div>
    </section>
  )
}
