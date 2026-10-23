import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { ExamMark } from "@/components/design/variants/nachtzug-icons"
import type { Brand } from "@/lib/exams"
import { PORTAL_COPY } from "@/lib/i18n/portal"
import { cn } from "@/lib/utils"

const T = PORTAL_COPY

const CHIP = "v-num rounded-full bg-v-soft px-2.5 py-1 text-[12px] font-medium tracking-[0.02em] text-v-ink"
const CARD = "nz-paper group relative flex h-full flex-col gap-6 rounded-[24px] p-5 transition-transform duration-200 ease-out has-[a:active]:scale-[0.99] sm:p-6 [@media(hover:hover)]:hover:-translate-y-0.5"
const STRETCH = "rounded outline-none after:absolute after:inset-0 after:rounded-[24px] focus-visible:after:ring-2 focus-visible:after:ring-v-ink"

/** Done of total as a thin ink bar; the text next to it carries the numbers for screen readers. */
export function ProgressBar({ done, total }: { done: number; total: number }) {
  const pct = total ? Math.min(100, (100 * done) / total) : 0
  return (
    <span className="block h-1.5 overflow-hidden rounded-full bg-v-soft" aria-hidden="true">
      <span className="block h-full rounded-full bg-v-ink" style={{ width: done ? `max(${pct}%, 10px)` : 0 }} />
    </span>
  )
}

function Footer({ done, total, started }: { done: number; total: number; started: boolean }) {
  return (
    <div className="mt-auto flex flex-col gap-4">
      <ProgressBar done={done} total={total} />
      <div className="flex min-h-11 items-center justify-between gap-3">
        <span className="v-num text-[13.5px] whitespace-nowrap text-v-muted">{T.family.progress(done, total)}</span>
        <span
          className={cn(
            "flex h-11 shrink-0 items-center gap-1.5 rounded-full px-5 text-[15px] font-semibold transition-[background-color,transform] duration-150 ease-out",
            started ? "bg-v-ink text-v-bg" : "bg-v-surface text-v-ink shadow-[inset_0_0_0_1px_var(--v-line)] group-hover:bg-v-soft"
          )}
          aria-hidden="true"
        >
          {started ? T.family.resume : T.family.begin}
          {started ? <ArrowRight className="size-4 transition-transform duration-200 ease-out group-hover:translate-x-0.5 rtl:-scale-x-100" strokeWidth={2.25} /> : null}
        </span>
      </div>
    </div>
  )
}

/** One exam family on the overview: badge, level range, last Modelltest or summary, progress. The whole card opens the family. */
export function FamilyCard({ name, brand, levels, href, line, done, total }: { name: string; brand: Brand; levels: string; href: string; line: string; done: number; total: number }) {
  return (
    <article className={CARD}>
      <div className="flex items-start justify-between gap-3">
        <ExamMark brand={brand} />
        <span className={CHIP}>{levels}</span>
      </div>
      <div className="flex flex-col gap-1.5">
        <h3 className="text-[23px] leading-tight font-semibold tracking-[-0.02em] text-balance">
          <Link href={href} className={STRETCH}>{name}</Link>
        </h3>
        <p className="text-[15px] text-v-muted text-pretty">{line}</p>
      </div>
      <Footer done={done} total={total} started={done > 0} />
    </article>
  )
}

/** One level of a family: the level as an ink tile, the exam's name and summary, progress. The whole card opens the exam. */
export function LevelCard({ level, name, summary, href, done, total }: { level: string; name: string; summary: string; href: string; done: number; total: number }) {
  return (
    <article className={CARD}>
      <div className="flex items-start justify-between gap-3">
        <span className="v-num grid size-12 shrink-0 place-items-center rounded-[14px] bg-v-ink text-[17px] font-semibold text-v-bg" aria-hidden="true">{level}</span>
      </div>
      <div className="flex flex-col gap-1.5">
        <h3 className="text-[23px] leading-tight font-semibold tracking-[-0.02em] text-balance">
          <Link href={href} className={STRETCH}>{name}</Link>
        </h3>
        <p className="text-[15px] text-v-muted text-pretty">{summary}</p>
      </div>
      <Footer done={done} total={total} started={done > 0} />
    </article>
  )
}

const PANEL = "nz-paper flex flex-col gap-4 rounded-[24px] p-5"

/** Mean share of points with the change since last week and a line of the last results. */
export function ScoreCard({ average, delta, trend }: { average: number | null; delta: number | null; trend: number[] }) {
  const lo = Math.min(...trend) - 5
  const span = Math.max(20, Math.max(...trend) + 5 - lo)
  const points = trend.length > 1 ? trend.map((v, i) => `${(i / (trend.length - 1)) * 100},${31 - ((v - lo) / span) * 30}`).join(" ") : null
  return (
    <section aria-labelledby="avg-h" className={PANEL}>
      <h2 id="avg-h" className="text-[15px] font-semibold">{T.stats.avgH}</h2>
      {average == null ? (
        <p className="text-[15px] text-v-muted text-pretty">{T.stats.avgEmpty}</p>
      ) : (
        <>
          <div className="flex items-center gap-3">
            <b className="v-display text-[44px] leading-none font-semibold tabular-nums">
              {average}
              <span className="ms-0.5 text-[24px]">%</span>
            </b>
            {delta != null ? (
              <span className="v-num rounded-full bg-v-soft px-2 py-0.5 text-[12.5px] font-semibold" title={T.stats.deltaLabel}>
                {T.stats.delta(delta)}
                <span className="sr-only"> {T.stats.deltaLabel}</span>
              </span>
            ) : null}
          </div>
          {points ? (
            <svg viewBox="0 0 100 32" preserveAspectRatio="none" className="h-12 w-full text-v-ink" aria-hidden="true">
              <polyline points={points} fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinejoin="round" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
            </svg>
          ) : null}
          <p className="text-[13px] text-v-muted text-pretty">{T.stats.avgNote}</p>
        </>
      )}
    </section>
  )
}

/** Finished Modelltests over the last 7 days, one bar per day, today last. */
export function WeekCard({ week }: { week: { day: string; count: number }[] }) {
  const total = week.reduce((a, d) => a + d.count, 0)
  return (
    <section aria-labelledby="week-h" className={PANEL}>
      <h2 id="week-h" className="text-[15px] font-semibold">{T.stats.weekH}</h2>
      <p className="flex items-baseline gap-2.5">
        <b className="v-display text-[44px] leading-none font-semibold tabular-nums">{total}</b>
        <span className="text-[15px] text-v-muted">{T.stats.weekDone(total)}</span>
      </p>
      <ol className="grid grid-cols-7 gap-1.5">
        {week.map((d, i) => (
          <li key={i} className="flex flex-col items-center gap-2">
            <span className={cn("h-1.5 w-full rounded-full", d.count ? "bg-v-ink" : "bg-v-soft")} aria-hidden="true" />
            <span className={cn("text-[12px] text-v-muted", i === week.length - 1 && "font-semibold text-v-ink")}>
              {d.day}
              <span className="sr-only">: {d.count}</span>
            </span>
          </li>
        ))}
      </ol>
    </section>
  )
}
