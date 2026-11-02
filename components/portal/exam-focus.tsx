"use client"

import { useId, useState, useTransition } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeftRight, Loader2 } from "lucide-react"
import { ExamMark } from "@/components/design/variants/nachtzug-icons"
import { switchExam } from "@/app/(app)/dashboard/focus-actions"
import { PORTAL_ACCOUNT } from "@/lib/auth/redirect"
import type { Brand, ExamId } from "@/lib/exams"
import { PORTAL_COPY } from "@/lib/i18n/portal"
import { cn } from "@/lib/utils"

const T = PORTAL_COPY.focus

export type SwitchExam = { id: ExamId; level: string }
export type SwitchFamily = { id: string; name: string; brand: Brand; exams: SwitchExam[] }
/** The exam the dashboard is on. `siblings`: the other levels of its family as keys; null for a one-exam family (the DTZ). */
export type FocusInfo = { id: ExamId; name: string; brand: Brand; summary: string; range: string; siblings: SwitchExam[] | null }

const KEY = "v-num grid h-9 min-w-12 place-items-center rounded-full px-3 text-[13px] font-semibold transition-[background-color,color,box-shadow,transform] duration-150 ease-out active:scale-[0.96] disabled:active:scale-100"

/** Stores the new exam, then re-renders the server parts. `target` lights the picked key while it saves. */
function useSwitch(onDone?: () => void) {
  const router = useRouter()
  const [pending, start] = useTransition()
  const [target, setTarget] = useState<ExamId | null>(null)
  const [failed, setFailed] = useState(false)
  const go = (id: ExamId) => {
    setTarget(id)
    setFailed(false)
    start(async () => {
      const res = await switchExam(id).catch(() => null)
      if (!res?.ok) {
        setFailed(true)
        return
      }
      onDone?.()
      router.refresh()
    })
  }
  return { go, pending, target: pending ? target : null, failed }
}

function LevelKeys({ current, exams, target, busy, onPick }: { current: ExamId; exams: SwitchExam[]; target: ExamId | null; busy: boolean; onPick: (id: ExamId) => void }) {
  return (
    <div role="group" aria-label={T.levels} className="inline-flex gap-1 rounded-full bg-v-soft p-1">
      {exams.map((e) => {
        const on = (target ?? current) === e.id
        return (
          <button key={e.id} type="button" aria-pressed={on} disabled={busy} onClick={() => e.id !== current && onPick(e.id)} className={cn(KEY, on ? "bg-v-sel text-v-on-sel" : "text-v-muted hover:text-v-ink [@media(hover:hover)]:hover:bg-v-surface")}>
            {e.level}
          </button>
        )
      })}
    </div>
  )
}

/** Every exam by family, its levels as keys; the current one is ink. Shared by the header's switch panel and the first-run chooser. */
function ExamList({ families, current, target, busy, onPick }: { families: SwitchFamily[]; current: ExamId | null; target: ExamId | null; busy: boolean; onPick: (id: ExamId) => void }) {
  return (
    <ul className="grid grid-cols-[minmax(0,1fr)] gap-2 sm:grid-cols-2">
      {families.map((f) => (
        <li key={f.id} className="flex min-h-[60px] items-center gap-3 rounded-[18px] bg-v-soft/60 py-2.5 ps-2.5 pe-2">
          <ExamMark brand={f.brand} size="sm" />
          <span className="min-w-0 flex-1 text-[15px] leading-snug font-semibold text-balance">{f.name}</span>
          <span className="flex shrink-0 gap-1">
            {f.exams.map((e) => {
              const on = current === e.id
              return (
                <button
                  key={e.id}
                  type="button"
                  aria-pressed={on}
                  aria-label={`${f.name} ${e.level}${on ? `, ${T.current}` : ""}`}
                  disabled={busy}
                  onClick={() => !on && onPick(e.id)}
                  className={cn(KEY, "min-w-11", on ? "bg-v-sel text-v-on-sel" : "bg-v-surface text-v-ink shadow-[inset_0_0_0_1px_var(--v-line)] [@media(hover:hover)]:hover:shadow-[inset_0_0_0_1px_var(--v-ink)]")}
                >
                  {target === e.id ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : e.level}
                </button>
              )
            })}
          </span>
        </li>
      ))}
    </ul>
  )
}

function Failed({ show }: { show: boolean }) {
  return show ? (
    <p role="alert" className="rounded-[14px] bg-(--v-sk-schreiben)/20 px-4 py-3 text-[14px] text-v-ink">
      {T.failed}
    </p>
  ) : null
}

/** The dashboard's head card: the learner's exam, its level keys (or the DTZ's range), and an inline panel to switch to another exam. */
export function ExamFocusHeader({ exam, families }: { exam: FocusInfo; families: SwitchFamily[] }) {
  const id = useId()
  const [open, setOpen] = useState(false)
  const s = useSwitch(() => setOpen(false))
  return (
    <section aria-labelledby={`${id}-h`} className="nz-paper rounded-[24px]">
      <div className="flex flex-wrap items-center gap-x-5 gap-y-4 p-5 sm:p-6">
        <ExamMark brand={exam.brand} size="lg" />
        <div className="flex min-w-[min(100%,15rem)] flex-1 flex-col gap-1">
          <h2 id={`${id}-h`} className="text-[clamp(20px,2.2vw,24px)] leading-tight font-semibold tracking-[-0.02em] text-balance">{exam.name}</h2>
          <p className="text-[15px] text-v-muted text-pretty">{exam.summary}</p>
        </div>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-3">
          {exam.siblings ? (
            <LevelKeys current={exam.id} exams={exam.siblings} target={s.target} busy={s.pending} onPick={s.go} />
          ) : (
            <span className="rounded-full bg-v-soft px-3 py-2 font-[family-name:var(--v-font-mono)] text-[11.5px] tracking-[0.08em] uppercase">{T.oneTest(exam.range)}</span>
          )}
          <button
            type="button"
            aria-expanded={open}
            aria-controls={`${id}-panel`}
            onClick={() => setOpen((o) => !o)}
            className="flex h-11 items-center gap-2 rounded-full px-2 text-[14.5px] font-semibold underline decoration-v-ink/25 underline-offset-4 transition-[text-decoration-color,transform] duration-150 ease-out hover:decoration-v-ink active:scale-[0.97]"
          >
            <ArrowLeftRight className="size-4 shrink-0" strokeWidth={2.25} aria-hidden="true" />
            {T.switch}
          </button>
        </div>
      </div>
      {!open ? <div className="px-5 sm:px-6 [&:has(p)]:pb-5"><Failed show={s.failed} /></div> : null}
      <div
        id={`${id}-panel`}
        data-open={open}
        inert={!open}
        className="grid grid-rows-[0fr] opacity-0 transition-[grid-template-rows,opacity] duration-200 ease-[var(--ease-out-strong)] data-[open=true]:grid-rows-[1fr] data-[open=true]:opacity-100 motion-reduce:transition-[opacity]"
      >
        <div className="min-h-0 overflow-hidden">
          <div className="flex flex-col gap-4 border-t border-v-line p-5 sm:p-6">
            <h3 className="text-[16px] font-semibold">{T.switchH}</h3>
            <ExamList families={families} current={exam.id} target={s.target} busy={s.pending} onPick={s.go} />
            <Failed show={s.failed} />
            <p className="text-[13.5px] text-v-muted text-pretty">
              {T.switchNote} {T.konto[0]}
              <Link href={PORTAL_ACCOUNT} className="font-semibold text-v-ink underline decoration-v-ink/25 underline-offset-4 hover:decoration-v-ink">{T.konto[1]}</Link>
              {T.konto[2]}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

/** First run without a stored exam (signed up without a free test): pick one, then the dashboard opens on it. */
export function ExamChooser({ families }: { families: SwitchFamily[] }) {
  const s = useSwitch()
  return (
    <section aria-labelledby="choose-h" className="nz-paper flex flex-col gap-5 self-start rounded-[24px] p-5 sm:p-6">
      <div className="flex flex-col gap-1.5">
        <h2 id="choose-h" className="text-[clamp(22px,2.4vw,28px)] leading-tight font-semibold tracking-[-0.02em]">{T.chooseH}</h2>
        <p className="text-[15px] text-v-muted text-pretty">{T.chooseLead}</p>
      </div>
      <ExamList families={families} current={null} target={s.target} busy={s.pending} onPick={s.go} />
      <Failed show={s.failed} />
    </section>
  )
}
