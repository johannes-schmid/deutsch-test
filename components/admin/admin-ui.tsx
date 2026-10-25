import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

// Page frame, panels and tables for every /admin page, on the Nachtzug tokens. Pages compose these instead of
// restyling tables one by one.

export type Crumb = { label: string; href: string }

export function AdminPage({ title, description, crumbs, actions, children }: { title: React.ReactNode; description?: React.ReactNode; crumbs?: Crumb[]; actions?: React.ReactNode; children: React.ReactNode }) {
  return (
    <main className="mx-auto flex w-full max-w-[1120px] flex-col gap-8 px-4 pt-6 pb-16 sm:px-8 lg:pt-10">
      <header className="flex flex-col gap-3">
        {crumbs?.length ? (
          <nav aria-label="Pfad" className="flex flex-wrap items-center gap-1 text-[13.5px] text-v-muted">
            {crumbs.map((c) => (
              <span key={c.href} className="flex items-center gap-1">
                <Link href={c.href} className="rounded-sm font-medium transition-colors duration-150 ease-out hover:text-v-ink">{c.label}</Link>
                <ChevronRight className="size-3.5 opacity-60" aria-hidden="true" />
              </span>
            ))}
          </nav>
        ) : null}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex min-w-0 flex-col gap-1.5">
            <h1 className="text-[28px] leading-[1.15] font-semibold tracking-[-0.025em] text-balance sm:text-[32px]">{title}</h1>
            {description ? <p className="max-w-[68ch] text-[15px] leading-relaxed text-v-muted">{description}</p> : null}
          </div>
          {actions ? <div className="flex shrink-0 items-center gap-2">{actions}</div> : null}
        </div>
      </header>
      {children}
    </main>
  )
}

export function Section({ title, aside, note, children }: { title: string; aside?: React.ReactNode; note?: React.ReactNode; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-3">
      <div className="flex items-baseline justify-between gap-4">
        <h2 className="text-[18px] font-semibold tracking-[-0.01em]">{title}</h2>
        {aside}
      </div>
      {children}
      {note ? <p className="max-w-[80ch] text-[13px] leading-relaxed text-v-muted">{note}</p> : null}
    </section>
  )
}

export function Panel({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn("nz-paper overflow-hidden rounded-[22px]", className)}>{children}</div>
}

/** A table on a panel: mono column heads, soft row lines, tabular numbers. */
export function DataTable({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <Panel>
      <div className="overflow-x-auto">
        <table className={cn("w-full text-[14px] tabular-nums", className)}>{children}</table>
      </div>
    </Panel>
  )
}

export const TH = "px-3 py-3 text-start font-[family-name:var(--v-font-mono)] text-[11px] font-normal tracking-[0.08em] whitespace-nowrap text-v-muted uppercase first:ps-5 last:pe-5"
export const TD = "px-3 py-3 first:ps-5 last:pe-5"
export const THEAD = "border-b border-v-line bg-v-bg/60"
export const TBODY = "divide-y divide-v-line"
export const TOTAL = "border-t border-v-line bg-v-bg/60 font-semibold"

export function Empty({ children }: { children: React.ReactNode }) {
  return <p className="rounded-[22px] border border-dashed border-v-line p-6 text-[14.5px] leading-relaxed text-v-muted">{children}</p>
}

/** Loading shape for a panel of rows: the page keeps its layout while the data streams in. */
export function PanelSkeleton({ rows = 6 }: { rows?: number }) {
  return (
    <Panel>
      <div aria-hidden="true" className="flex flex-col divide-y divide-v-line">
        <div className="h-11 bg-v-bg/60" />
        {Array.from({ length: rows }, (_, i) => (
          <div key={i} className="flex h-12 items-center gap-6 px-5">
            <span className="h-3 w-24 animate-pulse rounded-full bg-v-soft motion-reduce:animate-none" />
            <span className="h-3 flex-1 animate-pulse rounded-full bg-v-soft/70 motion-reduce:animate-none" />
            <span className="h-3 w-10 animate-pulse rounded-full bg-v-soft motion-reduce:animate-none" />
          </div>
        ))}
      </div>
      <span className="sr-only">Lädt …</span>
    </Panel>
  )
}

/** A thin progress line (reviewed of all): ember like the PublishPanel's. */
export function Progress({ value, total, label }: { value: number; total: number; label: string }) {
  const pct = total ? Math.round((value / total) * 100) : 0
  return (
    <span role="progressbar" aria-label={label} aria-valuemin={0} aria-valuemax={total} aria-valuenow={value} className="block h-1.5 w-full overflow-hidden rounded-full bg-v-soft">
      <span className="block h-full rounded-full bg-[var(--p-ember)]" style={{ width: `${pct}%` }} />
    </span>
  )
}
