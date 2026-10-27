"use client"

import { useEffect, useId, useState, useSyncExternalStore } from "react"
import { useRouter } from "next/navigation"
import { Check, ChevronDown, LoaderCircle } from "lucide-react"
import { VButton } from "@/components/design/kit"
import { saveExamGoal } from "@/app/(app)/dashboard/goal-actions"
import { removePushSubscription } from "@/app/(app)/dashboard/push-actions"
import { isIosTab, pushSupported, subscribeThisBrowser } from "@/lib/push-client"
import { Switch } from "@/components/ui/switch"
import { EXAMS, EXAM_IDS, LEVELS, type ExamId } from "@/lib/exams"
import { PORTAL_COPY } from "@/lib/i18n/portal"
import { cn } from "@/lib/utils"

const T = PORTAL_COPY.goal
const PANEL = "nz-paper flex flex-col gap-4 rounded-[24px] p-5"
const FOCUS = "has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-v-ink"
const FIELD = "w-full rounded-[14px] bg-v-soft px-4 text-v-ink transition-[background-color,box-shadow] duration-150 ease-out hover:bg-v-ink/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-v-ink"

const noop = () => () => {}
const todayKey = () => new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Berlin", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date())
const formatDay = (ymd: string) => new Intl.DateTimeFormat("de-DE", { weekday: "short", day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(`${ymd}T00:00:00Z`))

type Status = "idle" | "busy" | "saved" | "error" | "dateMissing" | "dateInvalid"

const messageFor = (s: Status) => (s === "error" ? T.error : s === "dateMissing" ? T.dateMissing : s === "dateInvalid" ? T.dateInvalid : s === "saved" ? T.saved : null)

function ExamSelect({ id, value, onChange, compact }: { id: string; value: ExamId; onChange: (v: ExamId) => void; compact?: boolean }) {
  return (
    <div className="relative">
      <select id={id} value={value} onChange={(e) => onChange(e.target.value as ExamId)} className={cn(FIELD, "cursor-pointer appearance-none pe-11", compact ? "h-11 text-[15px]" : "h-12 text-[16px]")}>
        {LEVELS.map((level) => (
          <optgroup key={level} label={level}>
            {EXAM_IDS.filter((x) => EXAMS[x].levels[0] === level).map((x) => (
              <option key={x} value={x}>{compact ? (EXAMS[x].short ?? EXAMS[x].name) : EXAMS[x].name}</option>
            ))}
          </optgroup>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute end-4 top-1/2 size-4 -translate-y-1/2 text-v-muted" aria-hidden="true" />
    </div>
  )
}

type PushState = "unknown" | "unsupported" | "ios" | "off" | "on" | "blocked" | "busy" | "failed"

/** This browser's notification state. iPhone Safari tabs get the home-screen hint (web push needs the installed app there). */
function usePush() {
  const [state, setState] = useState<PushState>("unknown")
  useEffect(() => {
    let alive = true
    const set = (s: PushState) => alive && setState(s)
    ;(async () => {
      if (isIosTab()) return set("ios")
      if (!pushSupported()) return set("unsupported")
      if (Notification.permission === "denied") return set("blocked")
      const reg = await navigator.serviceWorker.getRegistration("/")
      set((await reg?.pushManager.getSubscription()) ? "on" : "off")
    })().catch(() => set("unsupported"))
    return () => {
      alive = false
    }
  }, [])

  async function enable() {
    setState("busy")
    try {
      const permission = await Notification.requestPermission()
      if (permission !== "granted") return setState(permission === "denied" ? "blocked" : "off")
      setState((await subscribeThisBrowser()) ? "on" : "failed")
    } catch {
      setState("failed")
    }
  }

  async function disable() {
    setState("busy")
    try {
      const sub = await (await navigator.serviceWorker.getRegistration("/"))?.pushManager.getSubscription()
      if (sub) {
        await removePushSubscription(sub.endpoint)
        await sub.unsubscribe()
      }
      setState("off")
    } catch {
      setState("failed")
    }
  }

  return { state, enable, disable }
}

function ReminderRow({ id, label, note, checked, disabled, onChange }: { id: string; label: string; note: string; checked?: boolean; disabled?: boolean; onChange?: (v: boolean) => void }) {
  return (
    <li className="flex items-start justify-between gap-3">
      <div className="flex min-w-0 flex-col gap-0.5">
        <span id={id} className="text-[14px] font-semibold">{label}</span>
        <span className="text-[12.5px] leading-snug text-v-muted text-pretty">{note}</span>
      </div>
      {onChange ? (
        <Switch aria-labelledby={id} checked={!!checked} disabled={disabled} onCheckedChange={onChange} className="mt-0.5 data-checked:bg-v-ink data-unchecked:bg-v-line" />
      ) : null}
    </li>
  )
}

/** This browser's notifications, on /dashboard/konto; the toggle is the opt-in (the browser asks for permission). */
function PushSetting() {
  const id = useId()
  const push = usePush()
  if (push.state === "unsupported" || push.state === "unknown") return null
  const note = push.state === "ios" ? T.pushIos : push.state === "blocked" ? T.pushBlocked : push.state === "failed" ? T.pushFailed : T.pushNote
  return (
    <ul className="rounded-[16px] bg-v-soft/60 p-4">
      <ReminderRow
        id={`${id}-push`}
        label={T.pushLabel}
        note={note}
        checked={push.state === "on"}
        disabled={push.state === "busy" || push.state === "blocked"}
        onChange={push.state === "ios" ? undefined : (on) => (on ? push.enable() : push.disable())}
      />
    </ul>
  )
}

/** Optional widget beside the stats on /dashboard: the countdown to the exam, or a quiet prompt to add the date. */
export function ExamDateWidget({ goal, suggested, left }: { goal: { exam: ExamId; examDate: string | null } | null; suggested: ExamId; left: number | null }) {
  const id = useId()
  const router = useRouter()
  const today = useSyncExternalStore(noop, todayKey, () => undefined)
  const [editing, setEditing] = useState(false)
  const [exam, setExam] = useState<ExamId>(goal?.exam ?? suggested)
  const [date, setDate] = useState(goal?.examDate && left !== null && left >= 0 ? goal.examDate : "")
  const [status, setStatus] = useState<Status>("idle")

  async function save(examDate: string | null) {
    if (examDate === "") return setStatus("dateMissing")
    setStatus("busy")
    const res = await saveExamGoal({ exam, examDate }).catch(() => null)
    if (!res?.ok) return setStatus(res?.error === "date" ? "dateInvalid" : "error")
    setStatus("idle")
    setEditing(false)
    router.refresh()
  }

  const counting = !!goal?.examDate && left !== null && left >= 0
  const message = messageFor(status)

  return (
    <section aria-labelledby={`${id}-h`} className={PANEL}>
      <div className="flex items-baseline justify-between gap-3">
        <h2 id={`${id}-h`} className="text-[15px] font-semibold">{T.widgetH}</h2>
        {goal && !editing ? (
          <button type="button" onClick={() => setEditing(true)} className="rounded-full text-[13.5px] font-semibold text-v-muted underline-offset-4 transition-colors duration-150 ease-out hover:text-v-ink hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-v-ink">
            {T.edit}
          </button>
        ) : null}
      </div>

      {editing ? (
        <form onSubmit={(e) => { e.preventDefault(); save(date) }} noValidate className="flex flex-col gap-3">
          <label htmlFor={`${id}-exam`} className="sr-only">{T.exam}</label>
          <ExamSelect id={`${id}-exam`} value={exam} onChange={(v) => { setExam(v); setStatus("idle") }} compact />
          <label htmlFor={`${id}-date`} className="sr-only">{T.dateLabel}</label>
          <input
            id={`${id}-date`}
            type="date"
            value={date}
            min={today}
            onChange={(e) => { setDate(e.target.value); setStatus("idle") }}
            aria-invalid={status === "dateMissing" || status === "dateInvalid"}
            aria-describedby={message ? `${id}-msg` : undefined}
            className={cn(FIELD, "v-num h-11 cursor-text text-[15px]")}
          />
          <div className="flex items-center gap-3">
            <VButton kind="ink" size="sm" type="submit" disabled={status === "busy"} aria-busy={status === "busy"} className="disabled:opacity-80">
              {status === "busy" ? <LoaderCircle className="size-4 animate-spin motion-reduce:animate-none" aria-hidden="true" /> : null}
              {status === "busy" ? T.saving : T.save}
            </VButton>
            <button type="button" onClick={() => { setEditing(false); setStatus("idle") }} className="rounded-full text-[14px] font-semibold text-v-muted transition-colors duration-150 ease-out hover:text-v-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-v-ink">
              {T.cancel}
            </button>
          </div>
          <button type="button" onClick={() => save(null)} disabled={status === "busy"} className="w-fit rounded-full text-[13.5px] text-v-muted underline decoration-v-line underline-offset-4 transition-[color,text-decoration-color] duration-150 ease-out hover:text-v-ink hover:decoration-v-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-v-ink">
            {T.noDateYet}
          </button>
          <p id={`${id}-msg`} aria-live="polite" className="text-[13.5px] font-semibold empty:hidden">{message}</p>
        </form>
      ) : counting ? (
        <>
          {left === 0 ? (
            <p className="text-[15px] font-semibold text-pretty">{T.today}</p>
          ) : (
            <p className="flex items-baseline gap-2.5">
              <b className="v-display text-[44px] leading-none font-semibold tabular-nums">{left}</b>
              <span className="text-[15px] text-v-muted">{T.days(left!)}</span>
            </p>
          )}
          <p className="text-[13px] text-v-muted">
            {EXAMS[goal!.exam].short ?? EXAMS[goal!.exam].name} · <span className="v-num">{formatDay(goal!.examDate!)}</span>
          </p>
        </>
      ) : (
        <>
          <p className="text-[14.5px] text-v-muted text-pretty">{!goal ? T.widgetEmpty : goal.examDate ? T.widgetPast : T.widgetNoDate}</p>
          <VButton kind="ghost" size="sm" onClick={() => setEditing(true)} className="w-fit">
            {T.add}
          </VButton>
        </>
      )}
    </section>
  )
}

/** Exam, date, the email consent and this browser's notifications on /dashboard/konto. */
export function ExamGoalForm({ initial }: { initial: { exam: ExamId; examDate: string | null; consent: boolean; answered: boolean } }) {
  const id = useId()
  const router = useRouter()
  const today = useSyncExternalStore(noop, todayKey, () => undefined)
  const [exam, setExam] = useState<ExamId>(initial.exam)
  const [when, setWhen] = useState<"date" | "none" | null>(initial.answered ? (initial.examDate ? "date" : "none") : null)
  const [date, setDate] = useState(initial.examDate ?? "")
  const [consent, setConsent] = useState(initial.consent)
  const [status, setStatus] = useState<Status>("idle")

  const touch = () => status !== "busy" && setStatus("idle")

  async function save(e: React.FormEvent) {
    e.preventDefault()
    if (!when || (when === "date" && !date)) return setStatus("dateMissing")
    setStatus("busy")
    const res = await saveExamGoal({ exam, examDate: when === "date" ? date : null, consent }).catch(() => null)
    if (!res?.ok) return setStatus(res?.error === "date" ? "dateInvalid" : "error")
    setStatus("saved")
    router.refresh()
  }

  const message = messageFor(status)
  const bad = status === "dateMissing" || status === "dateInvalid"

  return (
    <section aria-labelledby={`${id}-h`} className="nz-paper flex flex-col rounded-[24px] p-5 sm:p-6">
      <h2 id={`${id}-h`} className="text-[17px] font-semibold">{T.settingsH}</h2>

      <form onSubmit={save} noValidate className="mt-6 flex flex-col gap-6">
        <div className="flex flex-col gap-2.5">
          <label htmlFor={`${id}-exam`} className="text-[14px] font-semibold">{T.exam}</label>
          <ExamSelect id={`${id}-exam`} value={exam} onChange={(v) => { setExam(v); touch() }} />
        </div>

        <fieldset className="flex min-w-0 flex-col gap-2.5" aria-describedby={bad ? `${id}-msg` : undefined}>
          <legend className="mb-2.5 p-0 text-[14px] font-semibold">{T.dateH}</legend>
          <div className="flex flex-wrap gap-2">
            {(["date", "none"] as const).map((w) => (
              <label
                key={w}
                className={cn(
                  "flex min-h-11 cursor-pointer items-center rounded-full px-4 text-[15px] font-medium transition-[background-color,color,transform] duration-150 ease-out active:scale-[0.97]",
                  "bg-v-soft text-v-ink hover:bg-v-ink/10 has-[:checked]:bg-v-ink has-[:checked]:text-v-bg",
                  status === "dateMissing" && !when && "shadow-[inset_0_0_0_1.5px_var(--v-ink)]",
                  FOCUS
                )}
              >
                <input type="radio" name={`${id}-when`} value={w} checked={when === w} onChange={() => { setWhen(w); touch() }} className="sr-only" />
                {w === "date" ? T.hasDate : T.noDate}
              </label>
            ))}
          </div>
          {when === "date" ? (
            <>
              <label htmlFor={`${id}-date`} className="sr-only">{T.dateLabel}</label>
              <input
                id={`${id}-date`}
                type="date"
                value={date}
                min={today}
                onChange={(e) => { setDate(e.target.value); touch() }}
                aria-invalid={bad}
                className={cn(FIELD, "v-num h-12 max-w-[260px] cursor-text text-[16px]", bad && "shadow-[inset_0_0_0_1.5px_var(--v-ink)]")}
              />
            </>
          ) : null}
        </fieldset>

        <label htmlFor={`${id}-consent`} className="group flex cursor-pointer items-start gap-3 rounded-[16px] bg-v-soft/60 p-4 text-[14.5px] leading-snug text-v-ink has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-v-ink">
          <input id={`${id}-consent`} type="checkbox" checked={consent} onChange={(e) => { setConsent(e.target.checked); touch() }} className="peer sr-only" />
          <span
            aria-hidden="true"
            className="mt-px grid size-5 shrink-0 place-items-center rounded-[6px] bg-v-surface shadow-[inset_0_0_0_1.5px_var(--v-line)] transition-[background-color,box-shadow,transform] duration-150 ease-out group-active:scale-[0.92] peer-checked:bg-v-ink peer-checked:shadow-none [&>svg]:scale-75 [&>svg]:opacity-0 peer-checked:[&>svg]:scale-100 peer-checked:[&>svg]:opacity-100"
          >
            <Check className="size-3.5 text-v-bg transition-[opacity,transform] duration-150 ease-out" strokeWidth={3.25} />
          </span>
          <span className="text-pretty">{T.consent}</span>
        </label>

        <PushSetting />

        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <VButton kind="ink" type="submit" disabled={status === "busy"} aria-busy={status === "busy"} className="disabled:opacity-80">
            {status === "busy" ? <LoaderCircle className="size-4 animate-spin motion-reduce:animate-none" aria-hidden="true" /> : null}
            {status === "busy" ? T.saving : T.save}
          </VButton>
          <p id={`${id}-msg`} aria-live="polite" className={cn("text-[14px]", status === "saved" ? "text-v-muted" : "font-semibold text-v-ink")}>
            {message}
          </p>
        </div>
      </form>
    </section>
  )
}
