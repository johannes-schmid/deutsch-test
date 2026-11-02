import type { ReactNode } from "react"
import { ArrowRight, Check, Lock } from "lucide-react"
import { VButton } from "@/components/design/kit"
import { PartIcon } from "@/components/design/variants/nachtzug-icons"
import type { PartId } from "@/lib/exam/types"

export type HalfwayRow = { label: string; detail: string; locked?: boolean; note?: string }

export type HalfwayOffer = { lead: string; price?: string; per?: string; cta: string; onCta?: () => void; href?: string; all?: { text: string; badge: string } }

/**
 * The stop after the free half of a Modelltest: what is done (points per Teil, or the criteria shown so far), what is
 * locked, and the one offer for this part. Sits in the exam frame like a break between Teile; `later` leaves the exam.
 */
export function HalfwayStop({ part, title, muted, rows, offer, later }: { part: PartId; title: string; muted: string; rows: HalfwayRow[]; offer: HalfwayOffer; later?: ReactNode }) {
  const button = (
    <>
      {offer.cta}
      <ArrowRight className="size-4 rtl:-scale-x-100" aria-hidden="true" />
    </>
  )
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start gap-4">
        <PartIcon part={part} size="lg" />
        <h2 className="pt-1 text-[26px] leading-[1.12] font-semibold tracking-[-0.025em] text-balance sm:text-[30px]">
          {title} <span className="text-v-muted">{muted}</span>
        </h2>
      </div>
      <ol className="flex flex-col">
        {rows.map((r) => (
          <li key={r.label} className="flex flex-col gap-1.5 border-b border-v-line py-3 last:border-b-0">
            <div className={`flex items-center justify-between gap-4 text-[15.5px] ${r.locked ? "text-v-muted" : ""}`}>
              <span className="flex items-center gap-3">
                {r.locked ? (
                  <span className="grid size-6 shrink-0 place-items-center rounded-full bg-v-soft">
                    <Lock className="size-3.5" strokeWidth={2.25} aria-hidden="true" />
                  </span>
                ) : (
                  <span className="grid size-6 shrink-0 place-items-center rounded-full bg-(--p-glow) text-[#0A0D18]">
                    <Check className="size-3.5" strokeWidth={3} aria-hidden="true" />
                  </span>
                )}
                <b className="font-semibold">{r.label}</b>
              </span>
              <span className="v-num shrink-0 text-right text-[14px] text-v-muted">{r.detail}</span>
            </div>
            {r.note ? <p className="ps-9 text-[14.5px] leading-relaxed text-v-muted text-pretty">{r.note}</p> : null}
          </li>
        ))}
      </ol>
      <div className="nz-night flex flex-col gap-4 rounded-[22px] p-5 sm:p-6">
        <p className="text-[15px] leading-relaxed text-white/80 text-pretty">{offer.lead}</p>
        {offer.price ? (
          <p className="flex items-baseline gap-2">
            <b className="v-display text-[38px] leading-none font-semibold tabular-nums">{offer.price}</b>
            {offer.per ? <span className="text-[14px] text-white/65">{offer.per}</span> : null}
          </p>
        ) : null}
        {offer.href ? (
          <VButton kind="light" size="lg" render={<a href={offer.href} data-cta="halfway_unlock" />} nativeButton={false} className="w-full gap-2">
            {button}
          </VButton>
        ) : (
          <VButton kind="light" size="lg" onClick={offer.onCta} data-cta="halfway_unlock" className="w-full gap-2">
            {button}
          </VButton>
        )}
        {offer.all ? (
          <p className="flex flex-wrap items-center gap-2 text-[14px] text-white/80">
            {offer.all.text}
            <span className="rounded-full bg-(--p-glow) px-2.5 py-0.5 text-[12px] font-semibold text-[#0A0D18]">{offer.all.badge}</span>
          </p>
        ) : null}
      </div>
      {later}
    </div>
  )
}
