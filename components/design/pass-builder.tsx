"use client"

import { useId, useRef, useState, useSyncExternalStore } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowRight, CalendarCheck, CalendarClock, Check, LoaderCircle, Repeat } from "lucide-react"
import { VButton } from "@/components/design/kit"
import { PASS_COPY } from "@/lib/i18n/pass"
import { NUMBER_LOCALE, type SiteLocale } from "@/lib/i18n/locale"
import { PLANS, RENEWAL, formatEuro, passEnds, perMonthCents, savingCents, savingsPercent, singleMonthsCents } from "@/lib/pricing"
import { cn } from "@/lib/utils"

const H = "text-[19px] leading-tight font-semibold tracking-[-0.01em]"
const FOCUS = "has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-v-ink"

// The day only matters for the end date, so the snapshot is a day key (stable within the day) and null on the server.
const noop = () => () => {}
const todayKey = () => new Date().toDateString()

/**
 * The Prüfungspass configurator, after inburgeringoefenen.nl's ModulePicker: the choices on the left, the running
 * summary on a Nacht card on the right (sticky from lg, below the choices on phones). The exam date only recommends a
 * plan; the learner can still pick freely. Prices come from `lib/pricing.ts`; /api/mollie/checkout recomputes them.
 * `checkout` (portal): consent + "Zahlungspflichtig bestellen" → Mollie. Otherwise (public /preise) the button leads to
 * `buyHref`, the portal page behind the Google sign-in. `renewing`: the learner already has a renewing pass.
 */
export function PassBuilder({ locale, freeHref, buyHref, checkout = false, renewing = false, accountHref }: { locale: SiteLocale; freeHref: string; buyHref?: string; checkout?: boolean; renewing?: boolean; accountHref?: string }) {
  const T = PASS_COPY[locale]
  const numberLocale = NUMBER_LOCALE[locale]
  const [when, setWhen] = useState<string | null>(null)
  const [planId, setPlanId] = useState(PLANS.find((p) => p.featured)!.id)
  const plan = PLANS.find((p) => p.id === planId)!
  const euro = (cents: number) => formatEuro(cents, numberLocale)
  const today = useSyncExternalStore(noop, todayKey, () => null)
  const ends = today ? new Intl.DateTimeFormat(numberLocale, { day: "numeric", month: "long", year: "numeric" }).format(passEnds(plan, new Date(today))) : null
  const picked = T.when.find((w) => w.id === when)
  const saving = savingCents(plan)

  return (
    <div className="grid grid-cols-[minmax(0,1fr)] items-start gap-4 lg:grid-cols-[minmax(0,1fr)_360px]">
      <div className="nz-paper flex flex-col rounded-[28px] p-5 sm:p-7">
        <fieldset className="flex flex-col">
          <legend className={cn(H, "mb-4 p-0")}>{T.whenH}</legend>
          <div className="flex flex-wrap gap-2">
            {T.when.map((w) => (
              <label
                key={w.id}
                className={cn(
                  "flex min-h-11 cursor-pointer items-center rounded-full px-4 text-[15px] font-medium transition-[background-color,color,transform] duration-150 ease-out active:scale-[0.97]",
                  "bg-v-soft text-v-ink hover:bg-v-ink/10 has-[:checked]:bg-v-ink has-[:checked]:text-v-bg",
                  FOCUS
                )}
              >
                <input type="radio" name="pass-when" value={w.id} checked={when === w.id} onChange={() => { setWhen(w.id); setPlanId(w.plan) }} className="sr-only" />
                {w.label}
              </label>
            ))}
          </div>
          <p aria-live="polite" className="flex items-start gap-2 text-[14.5px] text-v-muted empty:hidden has-[svg]:mt-4">
            {picked ? (
              <>
                <CalendarCheck className="mt-0.5 size-4 shrink-0 text-v-accent" aria-hidden="true" />
                {T.whenHint(T.planName(PLANS.find((p) => p.id === picked.plan)!.months))}
              </>
            ) : null}
          </p>
        </fieldset>

        <fieldset className="mt-6 flex flex-col border-t border-v-line pt-7">
          <legend className="sr-only">{T.planH}</legend>
          <p className={cn(H, "mb-4")} aria-hidden="true">{T.planH}</p>
          <div className="grid grid-cols-[minmax(0,1fr)] gap-3 sm:grid-cols-2">
            {PLANS.map((p) => {
              const pct = savingsPercent(p)
              return (
                <label
                  key={p.id}
                  className={cn(
                    "relative flex cursor-pointer flex-col gap-3 rounded-[20px] bg-v-surface p-5 shadow-[inset_0_0_0_1px_var(--v-line)] transition-[box-shadow,transform] duration-150 ease-out active:scale-[0.985]",
                    "hover:shadow-[inset_0_0_0_1px_color-mix(in_srgb,var(--v-ink)_35%,transparent)] has-[:checked]:shadow-[inset_0_0_0_2px_var(--v-ink)]",
                    FOCUS
                  )}
                >
                  <input type="radio" name="pass-plan" value={p.id} checked={planId === p.id} onChange={() => setPlanId(p.id)} className="peer sr-only" />
                  <span className="flex min-h-7 items-center justify-between gap-3 pe-8">
                    <b className="text-[17px] font-semibold">{T.planName(p.months)}</b>
                    {p.featured ? <span className="rounded-full bg-(--p-glow) px-2.5 py-1 text-[12px] font-semibold whitespace-nowrap text-[#0A0D18]">{T.recommended}</span> : null}
                  </span>
                  <span
                    className="absolute end-5 top-5 grid size-6 place-items-center rounded-full shadow-[inset_0_0_0_1.5px_var(--v-line)] transition-[background-color,box-shadow] duration-150 ease-out peer-checked:bg-v-ink peer-checked:shadow-none [&>svg]:opacity-0 peer-checked:[&>svg]:opacity-100"
                    aria-hidden="true"
                  >
                    <Check className="size-3.5 text-v-bg" strokeWidth={3} />
                  </span>
                  <span className="flex items-baseline gap-2">
                    <span className="v-display text-[38px] leading-none tabular-nums">{euro(p.cents)}</span>
                    <span className="text-[14px] text-v-muted">{T.forTerm(T.planName(p.months))}</span>
                  </span>
                  {pct > 0 ? (
                    <span className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[14px] text-v-muted">
                      <span className="v-num text-[13px]">{T.perMonth(euro(perMonthCents(p)))}</span>
                      <span className="v-num rounded-full bg-v-soft px-2 py-0.5 text-[12px] font-medium text-v-ink">{T.save(pct)}</span>
                      <span>{T.compare(p.months, euro(singleMonthsCents(p) / p.months))}</span>
                    </span>
                  ) : null}
                </label>
              )
            })}
          </div>
          <p className="mt-4 flex items-start gap-2 text-[14.5px] text-v-muted">
            <Repeat className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
            {T.renews(euro(RENEWAL.cents))}
          </p>
        </fieldset>

        <section aria-labelledby="pass-inc" className="mt-7 border-t border-v-line pt-7">
          <h2 id="pass-inc" className={H}>{T.includesH}</h2>
          <ul className="mt-4 grid grid-cols-[minmax(0,1fr)] gap-x-6 gap-y-2.5 text-[15.5px] md:grid-cols-2">
            {T.includes.map((f) => (
              <li key={f} className="flex items-start gap-2.5">
                <Check className="mt-1 size-4 shrink-0 text-v-accent" strokeWidth={2.5} aria-hidden="true" />
                {f}
              </li>
            ))}
          </ul>
          <p className="mt-4 text-[14.5px] text-v-muted">{T.newTests}</p>
        </section>

        <section aria-labelledby="pass-free" className="mt-7 flex flex-col gap-3 rounded-[20px] bg-v-soft/60 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-1">
            <h2 id="pass-free" className="text-[16px] font-semibold">{T.freeH}</h2>
            <p className="text-[14.5px] text-v-muted">{T.free.join(" · ")}</p>
          </div>
          <Link href={freeHref} className="group flex min-h-11 w-fit shrink-0 items-center gap-1.5 text-[15px] font-semibold">
            {T.freeCta}
            <ArrowRight className="size-4 transition-transform duration-150 ease-out group-hover:translate-x-0.5 rtl:-scale-x-100" aria-hidden="true" />
          </Link>
        </section>
      </div>

      {/* Sticky on the wrapper: .nz-night sets position: relative, which would override it. */}
      <aside aria-label={T.summaryH} className="lg:sticky lg:top-8">
        <div className="nz-night flex flex-col gap-5 rounded-[28px] p-6 shadow-[0_40px_80px_-44px_rgba(8,10,30,0.7)] sm:p-7">
          <div className="flex flex-col gap-1">
            <p className="text-[14px] text-white/70">{T.summaryH}</p>
            <p className="text-[18px] font-semibold">{T.planName(plan.months)} · <span className="font-normal text-white/80">{T.summaryScope}</span></p>
          </div>
          <div aria-live="polite" className="flex flex-col gap-1.5">
            <p className="flex items-baseline gap-2">
              <span className="v-display text-[52px] leading-none tabular-nums">{euro(plan.cents)}</span>
              <span className="text-[15px] text-white/70">{T.forTerm(T.planName(plan.months))}</span>
            </p>
            {plan.months > 1 ? <p className="v-num text-[13.5px] text-white/70">{T.perMonth(euro(perMonthCents(plan)))}</p> : null}
            {saving > 0 ? <p className="text-[15px] font-semibold text-(--p-glow)">{T.saving(euro(saving))}</p> : null}
            <p className="text-[14.5px] text-white/85">{T.renews(euro(RENEWAL.cents))}</p>
          </div>
          <p className="flex items-center gap-2 text-[14.5px] text-white/85">
            <CalendarClock className="size-4 shrink-0" aria-hidden="true" />
            {ends ? T.ends(ends) : T.endsAfter(T.planName(plan.months))}
          </p>
          <ul className="flex flex-col gap-2 border-t border-white/15 pt-5 text-[14.5px]">
            {T.trust.map((t) => (
              <li key={t} className="flex items-start gap-2.5">
                <Check className="mt-0.5 size-4 shrink-0 text-(--p-glow)" strokeWidth={2.5} aria-hidden="true" />
                {t}
              </li>
            ))}
          </ul>
          {renewing ? (
            <div className="flex flex-col gap-3">
              <p className="text-[14.5px] text-white/85">{T.renewing}</p>
              <VButton kind="light" size="lg" render={<Link href={accountHref ?? "/dashboard/konto"} />} nativeButton={false} className="w-full">
                {T.renewingCta}
                <ArrowRight className="size-4 rtl:-scale-x-100" aria-hidden="true" />
              </VButton>
            </div>
          ) : checkout ? (
            <Checkout planId={plan.id} T={T} />
          ) : (
            <div className="flex flex-col gap-3">
              <VButton kind="light" size="lg" render={<Link href={buyHref ?? "/dashboard/preise"} />} nativeButton={false} className="w-full">
                {T.buy}
                <ArrowRight className="size-4 rtl:-scale-x-100" aria-hidden="true" />
              </VButton>
              <p className="text-[13.5px] text-white/70">{T.buyNote}</p>
            </div>
          )}
        </div>
      </aside>
    </div>
  )
}

/** Consent (required before paying), the order button, and the hand-off to Mollie's hosted checkout. */
function Checkout({ planId, T }: { planId: string; T: (typeof PASS_COPY)[SiteLocale] }) {
  const [consent, setConsent] = useState(false)
  const [state, setState] = useState<"idle" | "busy" | "consent" | "error">("idle")
  const box = useRef<HTMLInputElement>(null)
  const id = useId()
  const router = useRouter()

  async function order() {
    if (!consent) {
      setState("consent")
      box.current?.focus()
      return
    }
    setState("busy")
    try {
      const res = await fetch("/api/mollie/checkout", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ planId, consent: true }) })
      const data = await res.json().catch(() => ({}))
      if (res.status === 409) return router.push("/dashboard/konto")
      if (!res.ok || !data.checkoutUrl) throw new Error(data.error ?? "failed")
      window.location.assign(data.checkoutUrl)
    } catch {
      setState("error")
    }
  }

  const message = state === "consent" ? T.consentNeeded : state === "error" ? T.error : null
  return (
    <div className="flex flex-col gap-3">
      <label htmlFor={id} className="group flex cursor-pointer items-start gap-3 rounded-[16px] bg-white/8 p-3.5 text-[14px] leading-snug text-white/90 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-white">
        <input
          ref={box}
          id={id}
          type="checkbox"
          checked={consent}
          onChange={(e) => { setConsent(e.target.checked); if (e.target.checked && state === "consent") setState("idle") }}
          aria-invalid={state === "consent"}
          aria-describedby={message ? `${id}-msg` : undefined}
          className="peer sr-only"
        />
        <span
          aria-hidden="true"
          className={cn(
            "mt-px grid size-5 shrink-0 place-items-center rounded-[6px] shadow-[inset_0_0_0_1.5px_rgba(255,255,255,0.45)] transition-[background-color,box-shadow,transform] duration-150 ease-out group-active:scale-[0.92] peer-checked:bg-(--p-glow) peer-checked:shadow-none [&>svg]:scale-75 [&>svg]:opacity-0 peer-checked:[&>svg]:scale-100 peer-checked:[&>svg]:opacity-100",
            state === "consent" && "shadow-[inset_0_0_0_2px_var(--p-glow)]"
          )}
        >
          <Check className="size-3.5 text-[#0A0D18] transition-[opacity,transform] duration-150 ease-out" strokeWidth={3.25} />
        </span>
        {T.consent}
      </label>
      <VButton kind="light" size="lg" onClick={order} disabled={state === "busy"} aria-busy={state === "busy"} className="w-full disabled:opacity-80">
        {state === "busy" ? <LoaderCircle className="size-4 animate-spin motion-reduce:animate-none" aria-hidden="true" /> : null}
        {state === "busy" ? T.ordering : T.order}
      </VButton>
      <p id={`${id}-msg`} aria-live="polite" className={cn("text-[13.5px]", message ? "font-semibold text-(--p-glow)" : "text-white/70")}>
        {message ?? T.payNote}
      </p>
      <p className="text-[13.5px] text-white/70">
        {T.legal.pre}{" "}
        <a href="/agb" target="_blank" className="font-semibold text-white underline decoration-white/40 underline-offset-4 hover:decoration-white">{T.legal.terms}</a>
        {T.legal.mid}{" "}
        <a href="/widerruf" target="_blank" className="font-semibold text-white underline decoration-white/40 underline-offset-4 hover:decoration-white">{T.legal.withdrawal}</a>.
      </p>
    </div>
  )
}
