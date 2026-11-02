"use client"

import { useEffect, useRef, useState } from "react"
import { Dialog } from "@base-ui/react/dialog"
import { ChevronLeft } from "lucide-react"
import { Checkout } from "@/components/design/pass-builder"
import { VButton } from "@/components/design/kit"
import { PORTAL_PASS } from "@/lib/auth/redirect"
import type { PartId } from "@/lib/exam/types"
import { PASS_COPY } from "@/lib/i18n/pass"
import { PORTAL_COPY } from "@/lib/i18n/portal"
import { PLANS, formatEuro, type Offer } from "@/lib/pricing"

const H = PORTAL_COPY.run.half
const SKILL_NAMES: Record<PartId, string> = { hoeren: "Hören", lesen: "Lesen", schreiben: "Schreiben", sprechen: "Sprechen" }

/** The Teil-Pass offers the halfway stop sells: this skill alone, and all four. Null when the active catalogue has none. */
export function unlockOffers(skill: PartId): { one: Offer; all: Offer } | null {
  const one = PLANS.find((p) => p.grants.skills.length === 1 && p.grants.skills[0] === skill && p.grants.exams === "*")
  const all = PLANS.find((p) => p.grants.skills.length === 4)
  return one && all ? { one, all } : null
}

/**
 * Buying from the halfway stop, in two steps on one sheet: first the one question whether all four Teile are wanted
 * (both answers are equal buttons; closing it keeps the single Teil), then the order summary with the consent and the
 * "Zahlungspflichtig bestellen" button (§ 312j BGB). Mollie returns to `next`, the same Modelltest.
 */
export function UnlockSheet({ open, onOpenChange, skill, next }: { open: boolean; onOpenChange: (open: boolean) => void; skill: PartId; next: string }) {
  const offers = unlockOffers(skill)
  const anchor = useRef<HTMLSpanElement>(null)
  const [frame, setFrame] = useState<HTMLElement | null>(null)
  const [plan, setPlan] = useState<Offer | null>(null)
  useEffect(() => setFrame(anchor.current?.closest<HTMLElement>(".v-frame") ?? null), [])
  if (!offers) return null
  const name = SKILL_NAMES[skill]
  const one = formatEuro(offers.one.cents)
  const allPrice = formatEuro(offers.all.cents)

  return (
    <>
      <span ref={anchor} hidden />
      <Dialog.Root
        open={open}
        onOpenChange={(o) => {
          // Tapping away from the question keeps the single Teil: straight to its order summary.
          if (!o && !plan) return setPlan(offers.one)
          if (!o) setPlan(null)
          onOpenChange(o)
        }}
      >
        <Dialog.Portal container={frame}>
          <Dialog.Backdrop className="fixed inset-0 z-50 bg-[rgba(8,10,30,0.5)] backdrop-blur-[2px] transition-opacity duration-300 ease-(--ease-out-strong) data-ending-style:opacity-0 data-starting-style:opacity-0" />
          {/* .nz-night sets position: relative (unlayered CSS beats Tailwind), so it sits inside the fixed popup. */}
          <Dialog.Popup className="fixed inset-x-0 bottom-0 z-50 max-h-[92dvh] overflow-y-auto rounded-t-[28px] text-white outline-none transition-[translate,scale,opacity] duration-300 ease-(--ease-out-strong) data-ending-style:translate-y-full data-starting-style:translate-y-full sm:inset-x-auto sm:bottom-auto sm:top-1/2 sm:left-1/2 sm:w-[460px] sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-[24px] sm:data-ending-style:-translate-y-1/2 sm:data-ending-style:scale-[0.96] sm:data-ending-style:opacity-0 sm:data-starting-style:-translate-y-1/2 sm:data-starting-style:scale-[0.96] sm:data-starting-style:opacity-0">
            <div className="nz-night flex min-h-full flex-col gap-5 px-5 pt-3 pb-[max(1.5rem,env(safe-area-inset-bottom))] sm:p-7">
            <span aria-hidden="true" className="mx-auto h-1 w-10 shrink-0 rounded-full bg-white/20 sm:hidden" />
            {plan ? (
              <>
                <button type="button" onClick={() => setPlan(null)} className="-ms-1 flex w-fit items-center gap-1 rounded-full py-1 pe-2 text-[14px] font-semibold text-white/75 transition-colors duration-150 hover:text-white">
                  <ChevronLeft className="size-4 rtl:-scale-x-100" aria-hidden="true" />
                  {H.order.back}
                </button>
                <Dialog.Title className="text-[22px] leading-tight font-semibold tracking-[-0.02em]">{H.order.h}</Dialog.Title>
                <div className="flex flex-col gap-2 rounded-[18px] bg-white/8 p-4">
                  <p className="flex items-baseline justify-between gap-4">
                    <b className="text-[17px] font-semibold">{plan === offers.all ? H.ask.all : H.order.name(name)}</b>
                    <b className="v-num text-[20px] font-semibold tabular-nums">{formatEuro(plan.cents)}</b>
                  </p>
                  <Dialog.Description className="text-[14px] leading-relaxed text-white/75">
                    {plan === offers.all ? H.order.scopeAll : H.order.scope(name)} {H.order.renews(formatEuro(plan.renews?.cents ?? plan.cents))}
                  </Dialog.Description>
                </div>
                <Checkout planId={plan.id} T={PASS_COPY.de} next={next} />
                <a href={PORTAL_PASS} className="text-center text-[14px] font-semibold text-white/75 underline decoration-white/30 underline-offset-4 hover:text-white">{H.order.offers}</a>
              </>
            ) : (
              <>
                <div className="flex flex-col gap-2">
                  <Dialog.Title className="text-[24px] leading-tight font-semibold tracking-[-0.02em] text-balance">{H.ask.h}</Dialog.Title>
                  <Dialog.Description className="text-[15.5px] leading-relaxed text-white/75 text-pretty">{H.ask.text}</Dialog.Description>
                </div>
                <div className="flex items-center justify-between gap-4 rounded-[18px] bg-white/8 p-4">
                  <span className="flex flex-col gap-1">
                    <span className="flex flex-wrap items-center gap-2 text-[16px] font-semibold">
                      {H.ask.all}
                      <span className="rounded-full bg-(--p-glow) px-2.5 py-0.5 text-[12px] font-semibold text-[#0A0D18]">{PORTAL_COPY.banner.oneFree}</span>
                    </span>
                    <span className="text-[13.5px] text-white/65">{H.ask.compare(one)}</span>
                  </span>
                  <b className="v-num shrink-0 text-[20px] font-semibold tabular-nums">{allPrice}</b>
                </div>
                <div className="flex flex-col gap-2.5">
                  <VButton kind="light" size="lg" onClick={() => setPlan(offers.all)} data-cta="halfway_all" className="w-full">{H.ask.yes(allPrice)}</VButton>
                  <VButton kind="ghost" size="lg" onClick={() => setPlan(offers.one)} data-cta="halfway_one" className="w-full text-white">{H.ask.no(name, one)}</VButton>
                </div>
                <p className="text-center text-[13px] text-white/60">{H.ask.note}</p>
              </>
            )}
            </div>
          </Dialog.Popup>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  )
}
