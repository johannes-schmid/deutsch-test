"use client"

import { useEffect, useState } from "react"
import { CircleAlert, CircleCheck, CreditCard, Hourglass, LoaderCircle, Search } from "lucide-react"
import { VButton } from "@/components/design/kit"
import { BillingPanel, NextButton as Next } from "@/components/portal/billing-panel"
import { PORTAL_ACCOUNT, PORTAL_HOME, PORTAL_PASS } from "@/lib/auth/redirect"
import { track } from "@/lib/analytics"
import { PORTAL_COPY } from "@/lib/i18n/portal"
import { CONTACT_EMAIL } from "@/lib/seo"

const P = PORTAL_COPY.payment
const C = PORTAL_COPY.cancel

type Status = { status: "checking" | "paid" | "failed" | "pending" | "none"; until?: string; planId?: string; paymentId?: string; amountCents?: number }

const day = (iso: string) => new Intl.DateTimeFormat("de-DE", { day: "numeric", month: "long", year: "numeric", timeZone: "Europe/Berlin" }).format(new Date(iso))

/** /dashboard/zahlung: polls /api/mollie/status after Mollie's redirect (every 1.5 s for ~30 s), then shows the outcome. */
export function PaymentStatus() {
  const [s, setS] = useState<Status>({ status: "checking" })

  useEffect(() => {
    let stop = false
    let tries = 0
    async function poll() {
      tries++
      try {
        const res = await fetch("/api/mollie/status", { cache: "no-store" })
        const data = (await res.json()) as Status
        if (stop) return
        if (data.status === "paid" && data.paymentId)
          track("purchase", { transaction_id: data.paymentId, value: (data.amountCents ?? 0) / 100, currency: "EUR", plan_id: data.planId })
        if (data.status !== "pending" || tries >= 20) return setS(data)
      } catch {
        if (tries >= 20) return setS({ status: "pending" })
      }
      if (!stop) setTimeout(poll, 1500)
    }
    poll()
    return () => {
      stop = true
    }
  }, [])

  if (s.status === "checking")
    return (
      <BillingPanel icon={CreditCard} title={P.checkingH} lead={P.checking}>
        <LoaderCircle className="size-5 animate-spin text-v-muted motion-reduce:animate-none" aria-hidden="true" />
      </BillingPanel>
    )
  if (s.status === "paid")
    return (
      <BillingPanel icon={CircleCheck} tone="glow" title={P.paidH} lead={P.paid(s.until ? day(s.until) : "")}>
        <Next href={PORTAL_HOME}>{P.paidCta}</Next>
      </BillingPanel>
    )
  if (s.status === "failed")
    return (
      <BillingPanel icon={CircleAlert} tone="alert" title={P.failedH} lead={P.failed}>
        <Next href={PORTAL_PASS}>{P.failedCta}</Next>
      </BillingPanel>
    )
  if (s.status === "none")
    return (
      <BillingPanel icon={Search} title={P.noneH} lead={P.none}>
        <Next href={PORTAL_PASS}>{P.noneCta}</Next>
      </BillingPanel>
    )
  return (
    <BillingPanel icon={Hourglass} title={P.pendingH} lead={P.pending}>
      <Next href={PORTAL_HOME}>{P.pendingCta}</Next>
    </BillingPanel>
  )
}

/** The second step of the Kündigungsbutton: the summary is rendered by the page, this is "Jetzt kündigen" and its result. */
export function CancelButton() {
  const [state, setState] = useState<{ k: "idle" | "busy" | "error" } | { k: "done"; until: string | null }>({ k: "idle" })

  async function cancel() {
    setState({ k: "busy" })
    try {
      const res = await fetch("/api/mollie/cancel", { method: "POST" })
      const data = await res.json().catch(() => ({}))
      if (!res.ok || !data.ok) throw new Error(data.error ?? "failed")
      setState({ k: "done", until: data.until ? day(data.until) : null })
    } catch {
      setState({ k: "error" })
    }
  }

  if (state.k === "done")
    return (
      <div aria-live="polite" className="flex flex-col gap-4 rounded-[20px] bg-v-soft/70 p-5">
        <p className="flex items-center gap-2.5 text-[17px] font-semibold">
          <CircleCheck className="size-5 shrink-0 text-v-accent" aria-hidden="true" />
          {C.doneH}
        </p>
        <p className="text-[15.5px] text-v-muted text-pretty">{C.done(state.until)}</p>
        <Next href={PORTAL_ACCOUNT}>{C.doneCta}</Next>
      </div>
    )
  return (
    <div className="flex flex-col gap-3">
      <VButton kind="ink" size="lg" onClick={cancel} disabled={state.k === "busy"} aria-busy={state.k === "busy"} className="w-full sm:w-fit disabled:opacity-80">
        {state.k === "busy" ? <LoaderCircle className="size-4 animate-spin motion-reduce:animate-none" aria-hidden="true" /> : null}
        {state.k === "busy" ? C.busy : C.button}
      </VButton>
      <p aria-live="polite" className="text-[14.5px] font-medium text-v-ink empty:hidden">
        {state.k === "error" ? (
          <>
            {C.error}{" "}
            <a href={`mailto:${CONTACT_EMAIL}`} className="underline underline-offset-4">{CONTACT_EMAIL}</a>.
          </>
        ) : null}
      </p>
    </div>
  )
}
