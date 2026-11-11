"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Dialog } from "@base-ui/react/dialog"
import { ArrowLeft, ArrowRight, AudioLines, ChartNoAxesColumn, Clock, Languages, PenLine, Users, type LucideIcon } from "lucide-react"
import { Photo, VButton } from "@/components/design/kit"
import { PlatformDemo, type DemoPart } from "@/components/design/variants/nachtzug-demo"
import { Tile } from "@/components/design/variants/nachtzug-icons"
import { PassBuilder, PassBuilderSkeleton } from "@/components/design/pass-builder"
import { LogoMark, NzLogo } from "@/components/design/variants/nachtzug-logo"
import { track } from "@/lib/analytics"
import { SKILLS } from "@/lib/billing/grants"
import type { PartId } from "@/lib/exam/types"
import { EXAMS, EXAM_IDS, portalPath, type ExamId } from "@/lib/exams"
import { KURZTEST } from "@/lib/i18n/kurztest"
import { isTranslated, lp, type SiteLocale } from "@/lib/i18n/locale"
import { PASS_COPY } from "@/lib/i18n/pass"
import { PAYWALL_PATH, PORTAL_HOME } from "@/lib/auth/redirect"
import { offerById } from "@/lib/pricing"
import { createClient } from "@/lib/supabase/client"

type PaywallProps = {
  locale: SiteLocale
  /** The free test the visitor came from; without it the page still sells, just without the personal line. */
  exam?: ExamId
  skill?: PartId
  /** An offer id carried through the Google sign-in, so the pick survives the round trip. */
  plan?: string | null
  /** Shown over the result: back closes the takeover. On its own route, back leads to the free tests. */
  onBack?: () => void
}

/** The paywall's own URL, which Google returns to with the chosen offer. */
const paywallUrl = ({ locale, exam, skill }: Pick<PaywallProps, "locale" | "exam" | "skill">, plan?: string) => {
  const q = new URLSearchParams()
  if (exam) q.set("exam", exam)
  if (skill) q.set("skill", skill)
  if (locale !== "de") q.set("l", locale)
  if (plan) q.set("plan", plan)
  const qs = q.toString()
  return qs ? `${PAYWALL_PATH}?${qs}` : PAYWALL_PATH
}

type Step = 1 | 2 | 3
const STEPS = 3

/** A benefit step: the promise and three points beside a live product screen (the landing's PlatformDemo), then one button on. */
function Benefits({ h1, h1Muted, lead, points, icons, cta, onNext, locale, screen, photo }: { h1: string; h1Muted: string; lead: string; points: { title: string; text: string }[]; icons: LucideIcon[]; cta: string; onNext: () => void; locale: SiteLocale; screen: DemoPart; photo: string }) {
  return (
    <div className="mt-4 grid grid-cols-[minmax(0,1fr)] gap-x-12 gap-y-7 lg:mt-8 lg:grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)] lg:items-center">
      <div className="flex flex-col gap-4 lg:col-start-1 lg:row-start-1">
        <h1 className="v-display pb-1 text-[clamp(30px,3.5vw,46px)] leading-[1.08] text-balance lg:text-pretty">
          {h1} <span className="text-v-muted">{h1Muted}</span>
        </h1>
        <p className="max-w-[52ch] text-[16.5px] leading-relaxed text-v-muted text-pretty sm:text-[17.5px]">{lead}</p>
      </div>

      <Photo token={photo} className="w-full rounded-[28px] p-2.5 sm:p-6 lg:col-start-2 lg:row-span-2 lg:row-start-1">
        <PlatformDemo locale={locale} start={screen} />
      </Photo>

      <div className="flex flex-col gap-7 lg:col-start-1 lg:row-start-2 lg:self-start">
        <ul className="flex flex-col gap-5">
          {points.map((pt, i) => (
            <li key={pt.title} className="flex items-start gap-3.5">
              <Tile icon={icons[i]} size="sm" />
              <span className="flex min-w-0 flex-col gap-0.5">
                <b className="text-[16px] font-semibold">{pt.title}</b>
                <span className="text-[14.5px] leading-relaxed text-v-muted text-pretty">{pt.text}</span>
              </span>
            </li>
          ))}
        </ul>
        {/* Phones: the one button on stays in reach under the screen and the points. */}
        <div className="max-lg:fixed max-lg:inset-x-0 max-lg:bottom-0 max-lg:z-30 max-lg:border-t max-lg:border-v-line max-lg:bg-v-surface/95 max-lg:px-4 max-lg:pt-3 max-lg:pb-[max(0.75rem,env(safe-area-inset-bottom))] max-lg:backdrop-blur">
          <VButton kind="ink" size="lg" onClick={onNext} data-cta="paywall_next" className="w-full gap-2 lg:w-fit">
            {cta}
            <ArrowRight className="size-4 rtl:-scale-x-100" aria-hidden="true" />
          </VButton>
        </div>
      </div>
    </div>
  )
}

/**
 * The paywall after a free test (Hannes, 2026-11-11, after knmoefenen.nl's PaywallOnboarding): no site nav or footer,
 * three steps. Two show what the paid product is, each beside a live product screen; the third has the packages on
 * the left and the pay card on the right. Signed out, the pay card signs in with Google and comes back here with the
 * pick (straight to step 3); signed in, it is the order summary with the consent and the order button. A free account
 * stays possible through the builder's "Gratis" row. Prices and offers come from the pass builder (lib/pricing.ts).
 */
export function Paywall({ locale, exam, skill, plan, onBack }: PaywallProps) {
  const T = PASS_COPY[locale].paywall
  const [signedIn, setSignedIn] = useState<boolean | null>(null)
  const [step, setStep] = useState<Step>(plan ? 3 : 1)
  const top = useRef<HTMLDivElement>(null)
  useEffect(() => {
    void createClient().auth.getSession().then(({ data }) => setSignedIn(!!data.session))
  }, [])
  useEffect(() => {
    track("paywall_step", { step })
  }, [step])

  const go = (to: Step) => {
    setStep(to)
    top.current?.scrollIntoView({ block: "start" })
  }
  const portal = exam ? portalPath(exam, skill) : PORTAL_HOME
  const carried = plan ? offerById(plan)?.grants.skills : undefined
  const test = exam && skill ? `${EXAMS[exam].short ?? EXAMS[exam].name} ${KURZTEST[locale].names[skill]}` : null
  const back = "group flex h-10 items-center gap-1.5 rounded-full px-3 text-[14px] font-semibold whitespace-nowrap transition-[background-color,transform] duration-150 ease-out hover:bg-v-ink/6 active:scale-[0.97]"
  const arrow = <ArrowLeft className="size-4 transition-transform duration-150 ease-out group-hover:-translate-x-0.5 rtl:-scale-x-100" aria-hidden="true" />

  return (
    <div ref={top} className="mx-auto flex w-full max-w-[1180px] flex-col px-4 pb-32 sm:px-6 lg:px-10 lg:pb-16">
      <header className="flex items-center justify-between gap-3 py-4 sm:py-5">
        <Link href={lp(locale, "/")} aria-label="deutschtest üben" className="rounded-lg">
          <NzLogo className="text-[18px] max-sm:hidden" />
          <span className="sm:hidden"><LogoMark size={32} tile /></span>
        </Link>
        <span className="flex items-center gap-2" role="img" aria-label={T.progress(step, STEPS)}>
          {Array.from({ length: STEPS }, (_, i) => (
            <span key={i} className={`h-1.5 rounded-full transition-[width,background-color] duration-300 ease-(--ease-out-strong) motion-reduce:transition-none ${i + 1 === step ? "w-7 bg-v-ink" : i + 1 < step ? "w-3 bg-v-ink/55" : "w-3 bg-v-ink/15"}`} />
          ))}
        </span>
        {step > 1 ? (
          <button type="button" onClick={() => go((step - 1) as Step)} className={back}>
            {arrow}
            {T.prev}
          </button>
        ) : onBack ? (
          <button type="button" onClick={onBack} className={back}>
            {arrow}
            {T.back}
          </button>
        ) : (
          <Link href={lp(locale, exam ? `/gratis-test/${exam}` : "/gratis-test")} className={back}>
            {arrow}
            {T.hub}
          </Link>
        )}
      </header>

      <div key={step} className="pw-step">
        {step === 1 ? (
          <Benefits h1={T.h1} h1Muted={T.h1Muted} lead={test ? T.lead(test) : T.leadPlain} points={T.why.points} icons={[Clock, AudioLines, Users]} cta={T.why.cta} onNext={() => go(2)} locale={locale} screen="hoeren" photo="--g-photo-5" />
        ) : step === 2 ? (
          <Benefits h1={T.see.h1} h1Muted={T.see.h1Muted} lead={T.see.lead} points={T.see.points} icons={[ChartNoAxesColumn, PenLine, Languages]} cta={T.see.cta} onNext={() => go(3)} locale={locale} screen="ergebnis" photo="--g-photo-6" />
        ) : (
          <>
            <div className="mt-4 flex flex-col gap-4 lg:mt-8">
              <h1 className="v-display max-w-[20ch] pb-1 text-[clamp(32px,4.2vw,52px)] leading-[1.06] text-balance">
                {T.plans.h1} <span className="text-v-muted">{T.plans.h1Muted}</span>
              </h1>
              {signedIn && plan ? <p className="max-w-[60ch] text-[16.5px] leading-relaxed text-v-muted text-pretty sm:text-[17.5px]">{T.signedIn}</p> : null}
            </div>

            <section aria-labelledby="paywall-steps" className="mt-6">
              <h2 id="paywall-steps" className="sr-only">{T.stepsH}</h2>
              <ol className="grid grid-cols-[minmax(0,1fr)] gap-x-6 gap-y-3 md:grid-cols-3">
                {T.steps.map((s, i) => (
                  <li key={s} className="flex items-start gap-3 text-[15.5px] leading-snug">
                    <span className="v-num grid size-7 shrink-0 place-items-center rounded-full bg-v-ink text-[13px] font-semibold text-v-bg" aria-hidden="true">{i + 1}</span>
                    <span className="pt-0.5 text-pretty">{s}</span>
                  </li>
                ))}
              </ol>
            </section>

            <div className="mt-8">
              {signedIn === null ? (
                <PassBuilderSkeleton />
              ) : (
                <PassBuilder
                  locale={locale}
                  surface="paywall"
                  checkout={signedIn}
                  freeHref={signedIn ? portal : `/registrieren?next=${encodeURIComponent(portal)}`}
                  signIn={(planId) => paywallUrl({ locale, exam, skill }, planId)}
                  next={portal}
                  initial={carried ?? (skill ? [skill] : undefined)}
                  showSummary={signedIn && !!carried}
                />
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

const isExam = (e: string | null): e is ExamId => !!e && (EXAM_IDS as readonly string[]).includes(e)
const isSkill = (s: string | null): s is PartId => !!s && (SKILLS as string[]).includes(s)

/** The paywall on its own route: where Google returns to, and a link that can be shared from emails. Renders inside <Suspense>. */
export function PaywallPage() {
  const q = useSearchParams()
  const [exam, skill, l] = [q.get("exam"), q.get("skill"), q.get("l")]
  return <Paywall locale={l && isTranslated(l) ? l : "de"} exam={isExam(exam) ? exam : undefined} skill={isSkill(skill) ? skill : undefined} plan={q.get("plan")} />
}

/**
 * The paywall over the free-test result: a full-screen takeover inside the page frame, so the result and its solutions
 * are still there when the visitor goes back. It only fades (opacity, 200 ms): a transform on the popup would pin the
 * builder's fixed buy bar to it.
 */
export function PaywallTakeover({ open, onOpenChange, ...props }: { open: boolean; onOpenChange: (open: boolean) => void } & Omit<PaywallProps, "onBack" | "plan">) {
  const anchor = useRef<HTMLSpanElement>(null)
  const [frame, setFrame] = useState<HTMLElement | null>(null)
  useEffect(() => setFrame(anchor.current?.closest<HTMLElement>(".v-frame") ?? null), [])
  return (
    <>
      <span ref={anchor} hidden />
      <Dialog.Root open={open} onOpenChange={onOpenChange}>
        <Dialog.Portal container={frame}>
          <Dialog.Popup
            aria-label={PASS_COPY[props.locale].paywall.h1}
            className="fixed inset-0 z-50 overflow-y-auto overscroll-contain bg-[linear-gradient(160deg,#E4EAF8_0%,#EEF1F6_45%,#E2E8F6_100%)] text-v-ink outline-none transition-opacity duration-200 ease-(--ease-out-strong) data-ending-style:opacity-0 data-starting-style:opacity-0 motion-reduce:transition-none"
          >
            <Paywall {...props} onBack={() => onOpenChange(false)} />
          </Dialog.Popup>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  )
}
