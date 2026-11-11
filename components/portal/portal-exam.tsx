import Link from "next/link"
import { ArrowRight, Check, ChevronRight, Clock, Eye, Lock, RotateCcw } from "lucide-react"
import { PART_ICONS, PartIcon } from "@/components/design/variants/nachtzug-icons"
import { PORTAL_PASS } from "@/lib/auth/redirect"
import { ProgressBar } from "@/components/portal/portal-overview"
import type { PartId } from "@/lib/exam/types"
import { PORTAL_COPY } from "@/lib/i18n/portal"
import { cn } from "@/lib/utils"

const T = PORTAL_COPY

const CHIP = "rounded-full bg-v-soft px-2.5 py-1 font-[family-name:var(--v-font-mono)] text-[11px] tracking-[0.08em] text-v-ink uppercase"
const ARROW = "grid size-9 shrink-0 place-items-center rounded-full bg-v-ink text-v-bg transition-transform duration-200 ease-out"

/** Übersicht › exam › skill. The last item is the current page. */
export function PortalCrumbs({ items }: { items: { label: string; href?: string }[] }) {
  return (
    <nav aria-label="Brotkrumen">
      <ol className="flex flex-wrap items-center gap-1 text-[14px] text-v-muted">
        {items.map((it, i) => (
          <li key={it.label} className="flex items-center gap-1">
            {i > 0 ? <ChevronRight className="size-3.5 shrink-0 opacity-60 rtl:-scale-x-100" aria-hidden="true" /> : null}
            {it.href ? (
              <Link href={it.href} className="rounded-full px-1.5 py-1 transition-colors duration-150 ease-out hover:text-v-ink">{it.label}</Link>
            ) : (
              <span aria-current="page" className="px-1.5 py-1 font-semibold text-v-ink">{it.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}

/** Page header: mark and title on one line, then the lead and optional facts. */
export function PortalHeader({ mark, title, lead, children }: { mark: React.ReactNode; title: string; lead: string; children?: React.ReactNode }) {
  return (
    <header className="mt-6 flex flex-col gap-4">
      <div className="flex items-center gap-4">
        {mark}
        <h1 className="v-display text-[clamp(28px,3.6vw,42px)] leading-[1.08] text-balance">{title}</h1>
      </div>
      <p className="max-w-[60ch] text-[16px] text-v-muted text-pretty sm:text-[17px]">{lead}</p>
      {children}
    </header>
  )
}

/** One skill of an exam: icon, name, Modelltest count, and the free test where one exists. The whole card opens the skill page. */
export function SkillCard({ skill, name, href, free, count, status, progress }: { skill: PartId; name: string; href: string; free: string | null; count: string; status: string; progress?: { done: number; total: number } }) {
  return (
    <article className="nz-paper group relative flex h-full flex-col gap-7 rounded-[24px] p-5 transition-transform duration-200 ease-out hover:-translate-y-0.5 has-[a:active]:scale-[0.99] sm:p-6">
      <div className="flex items-start justify-between gap-3">
        <PartIcon part={skill} size="lg" />
        <span className={CHIP}>{count}</span>
      </div>
      <div className="flex flex-col gap-1.5">
        <h3 className="text-[26px] leading-tight font-semibold tracking-[-0.02em]">
          <Link href={href} className="rounded outline-none after:absolute after:inset-0 after:rounded-[24px] focus-visible:after:ring-2 focus-visible:after:ring-v-ink">
            {name}
          </Link>
        </h3>
        <p className="flex items-center gap-2 text-[15px] text-v-muted">
          <Clock className="size-4 shrink-0" strokeWidth={2} aria-hidden="true" />
          {status}
        </p>
      </div>
      {progress ? <ProgressBar done={progress.done} total={progress.total} /> : null}
      <div className="mt-auto flex min-h-9 items-center justify-between gap-3">
        {free ? (
          <Link href={free} className="relative z-10 -ms-1 rounded-full px-1 py-1 text-[14px] font-semibold underline decoration-v-ink/25 underline-offset-4 transition-[text-decoration-color] duration-150 ease-out hover:decoration-v-ink">
            {T.exam.free}
          </Link>
        ) : (
          <span />
        )}
        <span className={cn(ARROW, "group-hover:translate-x-0.5")} aria-hidden="true">
          <ArrowRight className="size-4 rtl:-scale-x-100" strokeWidth={2.25} />
        </span>
      </div>
    </article>
  )
}

export type CardSlot = { n: number; state: "open" | "done" | "locked" | "soon" | "preview"; href: string | null; free: boolean; result: string | null }

const BAND = "radial-gradient(120% 90% at 100% 100%, color-mix(in oklab, var(--sk) 42%, transparent), transparent 70%), color-mix(in oklab, var(--sk) 16%, var(--v-surface))"

/**
 * One Modelltest as a card (after knmoefenen.nl's Proefexamen grid): a band in the skill's tone with the number or the
 * best result, a flag for the state, and one button at the foot. Open, done and preview start the test; locked opens the
 * pass page; soon waits. The whole card is the link.
 */
export function ModelltestCard({ slot, skill }: { slot: CardSlot; skill: PartId }) {
  const { n, state, free, result } = slot
  const C = T.skill.card
  const href = state === "locked" ? PORTAL_PASS : slot.href
  const soon = state === "soon"
  const Icon = PART_ICONS[skill]
  const badge = state === "open" && free ? C.badge.free : C.badge[state]
  const sub = state === "open" && free ? C.sub.free : state === "done" && !result ? T.skill.slot.done(null) : C.sub[state]
  const Cta = state === "done" ? RotateCcw : state === "locked" ? Lock : state === "preview" ? Eye : soon ? Clock : ArrowRight
  return (
    <article
      style={{ "--sk": `var(--v-sk-${skill})` } as React.CSSProperties}
      className={cn(
        "group relative flex h-full flex-col overflow-hidden rounded-[20px]",
        soon ? "border border-dashed border-v-ink/20 bg-v-surface/40" : "nz-paper transition-[transform,box-shadow] duration-200 ease-out has-[a:active]:scale-[0.98] [@media(hover:hover)]:hover:-translate-y-0.5"
      )}
    >
      <div
        className={cn(
          "relative h-[104px] overflow-hidden sm:h-[116px]",
          state === "locked" && "bg-v-soft"
        )}
        style={state === "locked" || soon ? undefined : { background: BAND }}
      >
        <Icon
          className={cn("absolute -end-3 -bottom-4 size-[92px] rotate-[-8deg] sm:size-[104px]", state === "locked" || soon ? "text-v-ink/[0.07]" : "text-(--sk) opacity-40 mix-blend-multiply dark:mix-blend-screen")}
          strokeWidth={1.25}
          aria-hidden="true"
        />
        <span
          className={cn(
            "absolute start-3 top-3 rounded-full px-2.5 py-1 font-[family-name:var(--v-font-mono)] text-[10.5px] leading-none tracking-[0.08em] uppercase",
            state === "done" ? "bg-v-ink text-v-bg" : state === "open" && free ? "bg-(--p-ember) text-[#0A0D18]" : "bg-v-surface/85 text-v-ink shadow-[inset_0_0_0_1px_var(--v-line)]"
          )}
        >
          {badge}
        </span>
        <span className={cn("absolute start-3.5 bottom-2.5 flex items-end gap-1.5 leading-none font-semibold tracking-[-0.04em] tabular-nums", soon || state === "locked" ? "text-v-ink/35" : "text-v-ink")}>
          {state === "done" && result ? (
            <>
              <span className="text-[34px] sm:text-[40px]">{result}</span>
              <span className="mb-1 grid size-5 place-items-center rounded-full bg-(--p-ember) text-[#0A0D18]" aria-hidden="true">
                <Check className="size-3" strokeWidth={3} />
              </span>
            </>
          ) : (
            <span className="text-[40px] sm:text-[46px]">{String(n).padStart(2, "0")}</span>
          )}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-3 p-3.5 sm:p-4">
        <div className="flex flex-col gap-0.5">
          <h3 className="text-[16px] leading-tight font-semibold sm:text-[17px]">
            {href ? (
              <Link href={href} className="outline-none after:absolute after:inset-0 after:rounded-[20px] focus-visible:after:ring-2 focus-visible:after:ring-v-ink">
                {T.skill.test(n)}
              </Link>
            ) : (
              <span className="text-v-ink/60">{T.skill.test(n)}</span>
            )}
          </h3>
          <p className="text-[13.5px] leading-snug text-v-muted text-pretty">{state === "done" && result ? `${C.best}: ${result}` : sub}</p>
        </div>
        <span
          aria-hidden="true"
          className={cn(
            "mt-auto flex h-10 items-center justify-center gap-1.5 rounded-full text-[14px] font-semibold transition-[background-color,transform] duration-150 ease-out",
            soon ? "text-v-muted" : state === "locked" ? "bg-v-soft text-v-ink" : state === "done" ? "bg-v-soft text-v-ink [@media(hover:hover)]:group-hover:bg-v-ink [@media(hover:hover)]:group-hover:text-v-bg" : "bg-v-ink text-v-bg"
          )}
        >
          <Cta className={cn("size-4 shrink-0", Cta === ArrowRight && "rtl:-scale-x-100")} strokeWidth={2.25} />
          {C.cta[state]}
        </span>
      </div>
    </article>
  )
}

/** The ten Modelltests of one skill as a card grid: two columns on a phone, three from sm. */
export function ModelltestGrid({ slots, skill, label }: { slots: CardSlot[]; skill: PartId; label: string }) {
  return (
    <ol aria-label={label} className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
      {slots.map((s) => (
        <li key={s.n}>
          <ModelltestCard slot={s} skill={skill} />
        </li>
      ))}
    </ol>
  )
}
