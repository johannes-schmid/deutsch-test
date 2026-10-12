"use client"

import { useState, type FormEvent } from "react"
import Link from "next/link"
import { ArrowRight, Check, LoaderCircle, Lock } from "lucide-react"
import { cn } from "@/lib/utils"
import { ExamButton } from "@/components/exam"
import { KURZTEST_COPY } from "@/lib/i18n/kurztest"

const T = KURZTEST_COPY.gate

/**
 * Email in, full result out. Marketing consent is separate and optional.
 * `before`: Schreiben/Sprechen ask for it before the test starts, so the API limits apply before any paid work.
 */
export function EmailGate({ before, speaking, onUnlock }: { before?: boolean; speaking?: boolean; onUnlock: (email: string, marketing: boolean) => Promise<string | null> }) {
  const [email, setEmail] = useState("")
  const [marketing, setMarketing] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    if (busy) return
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())) return setError(T.badEmail)
    setBusy(true)
    setError(null)
    const err = await onUnlock(email.trim(), marketing)
    if (err) {
      setError(err)
      setBusy(false)
    }
  }

  return (
    <form onSubmit={submit} noValidate className="nz-app mx-auto flex w-full max-w-[560px] flex-col gap-5 rounded-[24px] p-6 sm:p-8">
      {before ? null : (
        <span className="grid size-12 place-items-center rounded-full bg-(--p-glow) text-[#0A0D18]">
          <Check className="size-6" strokeWidth={2.5} aria-hidden="true" />
        </span>
      )}
      <div className="flex flex-col gap-2">
        <h2 className="text-[30px] leading-tight font-semibold tracking-[-0.03em]">{before ? T.hBefore : T.h}</h2>
        <p className="text-[16.5px] leading-relaxed text-v-muted">{before ? T.leadBefore : T.lead}</p>
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="kurztest-email" className="text-[14px] font-semibold">{T.email}</label>
        <input
          id="kurztest-email"
          type="email"
          inputMode="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          aria-invalid={!!error}
          aria-describedby={error ? "kurztest-email-error" : undefined}
          className="h-13 w-full rounded-2xl border border-v-line bg-v-surface px-4 text-[17px] text-v-ink caret-(--p-ember) outline-none transition-[border-color,box-shadow] duration-150 focus:border-v-ink focus:shadow-[0_0_0_1px_var(--v-ink)] aria-invalid:border-[color-mix(in_srgb,var(--v-sk-schreiben)_80%,var(--v-ink))]"
        />
        {error ? <p id="kurztest-email-error" role="alert" className="text-[14px] text-v-ink">{error}</p> : null}
      </div>
      <label className="flex cursor-pointer items-start gap-3 text-[14.5px] leading-snug">
        <input type="checkbox" checked={marketing} onChange={(e) => setMarketing(e.target.checked)} className="peer sr-only" />
        <span className={cn("mt-0.5 grid size-5.5 shrink-0 place-items-center rounded-md border-2 transition-colors duration-150 peer-focus-visible:ring-2 peer-focus-visible:ring-v-ink/40", marketing ? "border-v-ink bg-v-ink text-v-bg" : "border-v-ink/30")}>
          {marketing ? <Check className="size-3.5" strokeWidth={3} aria-hidden="true" /> : null}
        </span>
        <span className="text-v-muted">{T.marketing}</span>
      </label>
      <ExamButton type="submit" disabled={busy} className="flex w-full items-center justify-center gap-2">
        {busy ? <LoaderCircle className="size-4.5 animate-spin" aria-hidden="true" /> : before ? null : <Lock className="size-4" aria-hidden="true" />}
        {busy ? (before ? T.checking : T.sending) : before ? T.submitBefore : T.submit}
        {before && !busy ? <ArrowRight className="size-4 rtl:-scale-x-100" aria-hidden="true" /> : null}
      </ExamButton>
      <p className="text-[13px] leading-relaxed text-v-muted">
        {speaking ? `${T.speakingPrivacy} ` : ""}
        {T.privacy}{" "}
        <Link href="/datenschutz" className="underline underline-offset-4 hover:text-v-ink">{T.privacyLink}</Link>.
      </p>
    </form>
  )
}
