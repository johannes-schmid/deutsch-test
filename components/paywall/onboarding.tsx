"use client"

import { Suspense, useEffect, useRef, useState, useSyncExternalStore } from "react"
import Link from "next/link"
import { ArrowLeft, ArrowRight, CalendarDays, Target } from "lucide-react"
import { GoogleButton, GoogleButtonFallback } from "@/components/auth/google-button"
import { VButton } from "@/components/design/kit"
import { CheckMark, OPTION } from "@/components/design/pass-builder"
import { LogoMark, NzLogo } from "@/components/design/variants/nachtzug-logo"
import { track } from "@/lib/analytics"
import type { PartId } from "@/lib/exam/types"
import { EXAMS, EXAM_IDS, LEVELS, type ExamId } from "@/lib/exams"
import { KURZTEST } from "@/lib/i18n/kurztest"
import { NUMBER_LOCALE, lp, type SiteLocale } from "@/lib/i18n/locale"
import { ONBOARDING_COPY } from "@/lib/i18n/onboarding"
import { GOALS, welcomePath, type Goal } from "@/lib/lifecycle/onboarding"
import { cn } from "@/lib/utils"
import { Takeover } from "./paywall"

type Step = 1 | 2 | 3 | 4
const STEPS = 4
type When = "date" | "soon" | "later" | "open"
const WHEN: When[] = ["date", "soon", "later", "open"]

const noop = () => () => {}
const todayKey = () => new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Berlin", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date())
const maxKey = () => new Date(Date.now() + 3 * 365 * 864e5).toISOString().slice(0, 10)
const FIELD = "v-num h-12 w-full max-w-[280px] cursor-text rounded-[14px] bg-v-soft px-4 text-[16px] text-v-ink transition-[background-color,box-shadow] duration-150 ease-out hover:bg-v-ink/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-v-ink"
const ROW = cn(OPTION, "gap-1 py-4 pe-14")

function Choice({ name, checked, onPick, children }: { name: string; checked: boolean; onPick: () => void; children: React.ReactNode }) {
  return (
    <label className={ROW}>
      <input type="radio" name={name} checked={checked} onChange={onPick} className="peer sr-only" />
      <span className="flex min-h-6 flex-wrap items-center gap-x-2.5 gap-y-1 text-[16.5px] font-semibold">{children}</span>
      <CheckMark />
    </label>
  )
}

/**
 * After a free test (Hannes, 2026-11-20; replaces the paywall there): four short steps, then Google. Exam (the free test's
 * exam is preselected), exam date (only an exact date is stored), why the learner needs the exam, then the sign-up.
 * The answers ride through Google in `next` (/auth/willkommen saves them) and the learner lands on the free test's skill.
 */
function Onboarding({ locale, exam: tested, skill, onClose }: { locale: SiteLocale; exam: ExamId; skill?: PartId; onClose: () => void }) {
  const T = ONBOARDING_COPY[locale]
  const K = KURZTEST[locale]
  const [step, setStep] = useState<Step>(1)
  const [exam, setExam] = useState<ExamId>(tested)
  const [more, setMore] = useState(false)
  const [when, setWhen] = useState<When | null>(null)
  const [date, setDate] = useState("")
  const [goal, setGoal] = useState<Goal | null>(null)
  const top = useRef<HTMLDivElement>(null)
  const today = useSyncExternalStore(noop, todayKey, () => "")
  useEffect(() => {
    track("onboarding_step", { step })
  }, [step])

  const go = (to: Step) => {
    setStep(to)
    top.current?.scrollIntoView({ block: "start" })
  }
  const dateOk = !!date && date >= today && date <= maxKey()
  const examDate = when === "date" && dateOk ? date : null
  const canNext = step !== 2 || when !== "date" || dateOk
  const onNext = () => {
    if (step === 2 && when) track("onboarding_when", { when })
    if (step === 3 && goal) track("onboarding_goal", { goal })
    go((step + 1) as Step)
  }
  const skip = () => {
    if (step === 2) setWhen(null)
    if (step === 3) setGoal(null)
    go((step + 1) as Step)
  }
  const next = welcomePath({ exam, skill: exam === tested ? (skill ?? null) : null, examDate, goal })
  const examName = (x: ExamId) => EXAMS[x].name
  const others = EXAM_IDS.filter((x) => x !== tested)
  const dayLabel = examDate ? new Intl.DateTimeFormat(NUMBER_LOCALE[locale], { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(`${examDate}T00:00:00Z`)) : null
  const back = "group flex h-10 items-center gap-1.5 rounded-full px-3 text-[14px] font-semibold whitespace-nowrap transition-[background-color,transform] duration-150 ease-out hover:bg-v-ink/6 active:scale-[0.97]"

  const head = (h1: string, lead: string) => (
    <div className="flex flex-col gap-2">
      <h1 className="v-display pb-1 text-[clamp(28px,3.4vw,40px)] leading-[1.08] text-balance">{h1}</h1>
      <p className="text-[16.5px] leading-relaxed text-v-muted text-pretty">{lead}</p>
    </div>
  )

  return (
    <div ref={top} className="mx-auto flex w-full max-w-[600px] flex-col px-4 pb-32 sm:px-6 lg:pb-16">
      <header className="flex items-center justify-between gap-3 py-4 sm:py-5">
        <Link href={lp(locale, "/")} aria-label="deutschtest üben" className="rounded-lg">
          <NzLogo className="text-[18px] max-sm:hidden" />
          <span className="sm:hidden"><LogoMark size={32} tile /></span>
        </Link>
        <span className="flex items-center gap-2" role="img" aria-label={T.progress(step, STEPS)}>
          {Array.from({ length: STEPS }, (_, i) => (
            <span key={i} className={cn("h-1.5 rounded-full transition-[width,background-color] duration-300 ease-(--ease-out-strong) motion-reduce:transition-none", i + 1 === step ? "w-7 bg-v-ink" : i + 1 < step ? "w-3 bg-v-ink/55" : "w-3 bg-v-ink/15")} />
          ))}
        </span>
        <button type="button" onClick={step > 1 ? () => go((step - 1) as Step) : onClose} className={back}>
          <ArrowLeft className="size-4 transition-transform duration-150 ease-out group-hover:-translate-x-0.5 rtl:-scale-x-100" aria-hidden="true" />
          {step > 1 ? T.back : T.close}
        </button>
      </header>

      <div key={step} className="pw-step mt-4 flex flex-col gap-6 lg:mt-10">
        {step === 1 ? (
          <>
            {head(T.exam.h1, T.exam.lead)}
            <fieldset className="flex flex-col gap-2.5">
              <legend className="sr-only">{T.exam.h1}</legend>
              <Choice name="ob-exam" checked={exam === tested} onPick={() => setExam(tested)}>
                {examName(tested)}
                <span className="v-num rounded-full bg-(--p-glow) px-2.5 py-0.5 text-[12px] font-semibold text-[#0A0D18]">{T.exam.yourTest}</span>
              </Choice>
              {more || exam !== tested ? (
                LEVELS.map((level) => {
                  const list = others.filter((x) => EXAMS[x].levels[0] === level)
                  return list.length ? (
                    <div key={level} className="flex flex-col gap-2.5">
                      <span className="v-num mt-2 text-[12px] tracking-[0.08em] text-v-muted uppercase">{level}</span>
                      {list.map((x) => (
                        <Choice key={x} name="ob-exam" checked={exam === x} onPick={() => setExam(x)}>{examName(x)}</Choice>
                      ))}
                    </div>
                  ) : null
                })
              ) : (
                <button type="button" onClick={() => setMore(true)} className="self-start rounded-full px-1 py-2 text-[15px] font-semibold underline decoration-v-ink/30 underline-offset-4 hover:decoration-v-ink">
                  {T.exam.more}
                </button>
              )}
            </fieldset>
          </>
        ) : step === 2 ? (
          <>
            {head(T.date.h1, T.date.lead)}
            <fieldset className="flex flex-col gap-2.5">
              <legend className="sr-only">{T.date.h1}</legend>
              {WHEN.map((w) => (
                <Choice key={w} name="ob-when" checked={when === w} onPick={() => setWhen(w)}>
                  {w === "date" ? <CalendarDays className="size-4.5 text-v-muted" aria-hidden="true" /> : null}
                  {T.date.options[w]}
                </Choice>
              ))}
            </fieldset>
            {when === "date" ? (
              <div className="pw-step flex flex-col gap-2">
                <label htmlFor="ob-date" className="text-[14.5px] font-semibold">{T.date.pick}</label>
                <input id="ob-date" type="date" value={date} min={today} max={maxKey()} onChange={(e) => setDate(e.target.value)} aria-invalid={!!date && !dateOk} className={FIELD} />
                {date && !dateOk ? <p className="text-[14px] text-v-muted">{T.date.invalid}</p> : null}
              </div>
            ) : null}
          </>
        ) : step === 3 ? (
          <>
            {head(T.goal.h1, T.goal.lead)}
            <fieldset className="flex flex-col gap-2.5">
              <legend className="sr-only">{T.goal.h1}</legend>
              {GOALS.map((g) => (
                <Choice key={g} name="ob-goal" checked={goal === g} onPick={() => setGoal(g)}>{T.goal.options[g]}</Choice>
              ))}
            </fieldset>
          </>
        ) : (
          <>
            <h1 className="v-display pb-1 text-[clamp(28px,3.4vw,40px)] leading-[1.08] text-balance">
              {T.done.h1} <span className="text-v-muted">{T.done.h1Muted}</span>
            </h1>
            <div className="nz-paper flex flex-col gap-5 rounded-[24px] p-5 sm:p-6">
              <ul className="flex flex-wrap gap-2 text-[13.5px] font-medium">
                <li className="rounded-full bg-v-soft px-3 py-1.5">{examName(exam)}</li>
                {dayLabel ? <li className="flex items-center gap-1.5 rounded-full bg-v-soft px-3 py-1.5"><CalendarDays className="size-3.5" aria-hidden="true" />{T.done.date(dayLabel)}</li> : null}
                {goal ? <li className="flex items-center gap-1.5 rounded-full bg-v-soft px-3 py-1.5"><Target className="size-3.5" aria-hidden="true" />{T.goal.options[goal]}</li> : null}
              </ul>
              <p className="text-[16px] leading-relaxed text-pretty">{skill && exam === tested ? T.done.next(K.names[skill]) : T.done.nextPlain}</p>
              <Suspense fallback={<GoogleButtonFallback mode="register" label={T.done.google.label} />}>
                <GoogleButton mode="register" next={next} labels={{ ...T.done.google, notice: K.wall.google.notice }} />
              </Suspense>
              <p className="text-[13px] leading-snug text-v-muted text-pretty">{T.done.login}</p>
            </div>
          </>
        )}
      </div>

      {step < 4 ? (
        <div className="mt-8 flex items-center gap-3 max-lg:fixed max-lg:inset-x-0 max-lg:bottom-0 max-lg:z-30 max-lg:mt-0 max-lg:border-t max-lg:border-v-line max-lg:bg-v-surface/95 max-lg:px-4 max-lg:pt-3 max-lg:pb-[max(0.75rem,env(safe-area-inset-bottom))] max-lg:backdrop-blur">
          {step > 1 ? (
            <button type="button" onClick={skip} className="h-12 shrink-0 rounded-full px-4 text-[15px] font-semibold text-v-muted transition-[background-color,transform] duration-150 ease-out hover:bg-v-ink/6 active:scale-[0.97]">
              {T.skip}
            </button>
          ) : null}
          <VButton kind="ink" size="lg" onClick={onNext} disabled={!canNext} data-cta={`onboarding_${step}`} className="flex-1 gap-2 disabled:opacity-50 lg:flex-none">
            {T.next}
            <ArrowRight className="size-4 rtl:-scale-x-100" aria-hidden="true" />
          </VButton>
        </div>
      ) : null}
    </div>
  )
}

export function OnboardingTakeover({ open, onOpenChange, locale, exam, skill }: { open: boolean; onOpenChange: (open: boolean) => void; locale: SiteLocale; exam: ExamId; skill?: PartId }) {
  return (
    <Takeover open={open} onOpenChange={onOpenChange} label={ONBOARDING_COPY[locale].label}>
      <Onboarding locale={locale} exam={exam} skill={skill} onClose={() => onOpenChange(false)} />
    </Takeover>
  )
}
