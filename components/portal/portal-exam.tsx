import Link from "next/link"
import { ArrowRight, Check, ChevronRight, Clock, Lock, RotateCcw } from "lucide-react"
import { PartIcon } from "@/components/design/variants/nachtzug-icons"
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

/** One skill of an exam: icon, name, Modelltest count, and the free test where one exists. The whole card opens the skill page. */
export function SkillCard({ skill, name, href, free, count, status }: { skill: PartId; name: string; href: string; free: string | null; count: string; status: string }) {
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

/** One Modelltest in a skill's list. Open, done and preview rows start the test; locked and coming rows wait. */
export function ModelltestRow({ slot }: { slot: { n: number; state: "open" | "done" | "locked" | "soon" | "preview"; href: string | null; free: boolean; result: string | null } }) {
  const { n, state, href, free, result } = slot
  const live = !!href
  const sub = state === "done" ? T.skill.slot.done(result) : state === "preview" ? T.skill.slot.preview : state === "locked" ? T.skill.slot.locked : state === "soon" ? T.soon : free ? `${T.skill.slot.free} · ${T.skill.slot.open}` : T.skill.slot.open
  const body = (
    <>
      <span
        className={cn(
          "v-num relative grid size-12 shrink-0 place-items-center rounded-[14px] text-[17px] font-semibold",
          live ? "bg-v-ink text-v-bg" : state === "locked" ? "bg-v-soft text-v-muted" : "border border-dashed border-v-ink/25 text-v-muted"
        )}
        aria-hidden="true"
      >
        {String(n).padStart(2, "0")}
        {state === "done" ? (
          <span className="absolute -end-1 -bottom-1 grid size-5 place-items-center rounded-full bg-(--p-ember) text-[#0A0D18] ring-2 ring-v-surface">
            <Check className="size-3" strokeWidth={3} />
          </span>
        ) : null}
      </span>
      <span className="flex min-w-0 flex-1 flex-col leading-tight">
        <b className={cn("text-[16.5px] font-semibold", !live && "text-v-ink/70")}>{T.skill.test(n)}</b>
        <span className="mt-1 truncate text-[14px] text-v-muted">{sub}</span>
      </span>
      {live ? (
        <span className={cn(ARROW, "group-hover:translate-x-0.5")} aria-hidden="true">
          {state === "done" ? <RotateCcw className="size-4" strokeWidth={2.25} /> : <ArrowRight className="size-4 rtl:-scale-x-100" strokeWidth={2.25} />}
        </span>
      ) : state === "locked" ? (
        <Lock className="me-2 size-[18px] shrink-0 text-v-muted/70" strokeWidth={2} aria-hidden="true" />
      ) : (
        <Clock className="me-2 size-[18px] shrink-0 text-v-muted/70" strokeWidth={2} aria-hidden="true" />
      )}
    </>
  )
  const row = "flex min-h-[76px] items-center gap-4 px-4 py-3 sm:px-5"
  return href ? (
    <Link href={href} className={cn(row, "group transition-colors duration-150 ease-out hover:bg-v-ink/[0.03] active:bg-v-ink/[0.05]")}>{body}</Link>
  ) : (
    <div className={row}>{body}</div>
  )
}
