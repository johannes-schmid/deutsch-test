"use client"

import { useId, useState } from "react"
import Link from "next/link"
import { ArrowRight, Check, LoaderCircle } from "lucide-react"
import { VButton } from "@/components/design/kit"
import { sendContactMessage, type ContactResult } from "@/app/(app)/dashboard/kontakt/actions"
import { PORTAL_CANCEL, PORTAL_HOME } from "@/lib/auth/redirect"
import { PORTAL_COPY } from "@/lib/i18n/portal"
import { cn } from "@/lib/utils"

const T = PORTAL_COPY.contact
const FOCUS = "has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-v-ink"
const FIELD = "w-full rounded-[14px] bg-v-soft px-4 text-v-ink transition-[background-color,box-shadow] duration-150 ease-out hover:bg-v-ink/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-v-ink"
const LINK = "rounded-full font-semibold underline decoration-v-line underline-offset-4 transition-[text-decoration-color] duration-150 ease-out hover:decoration-v-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-v-ink"
const MAX = 4000

type Topic = keyof typeof T.topics
type Status = "idle" | "busy" | Exclude<ContactResult, { ok: true }>["error"]

const messageFor = (s: Status) =>
  s === "topic" ? T.topicMissing : s === "short" ? T.tooShort : s === "long" ? T.tooLong : s === "limit" ? T.limit : s === "failed" || s === "auth" ? T.failed : null

/** The support form on /dashboard/kontakt: topic pills, one message field, sent from the signed-in account. */
export function ContactForm({ email, support }: { email: string; support: string }) {
  const id = useId()
  const [topic, setTopic] = useState<Topic | null>(null)
  const [message, setMessage] = useState("")
  const [status, setStatus] = useState<Status>("idle")
  const [sent, setSent] = useState(false)

  const touch = () => status !== "busy" && setStatus("idle")

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!topic) return setStatus("topic")
    const text = message.trim()
    if (text.length < 10) return setStatus("short")
    if (text.length > MAX) return setStatus("long")
    setStatus("busy")
    const res = await sendContactMessage({ topic, message: text }).catch(() => null)
    if (!res?.ok) return setStatus(res?.error ?? "failed")
    setStatus("idle")
    setSent(true)
  }

  if (sent) {
    return (
      <section role="status" className="nz-paper flex flex-col items-start gap-4 rounded-[24px] p-5 transition-[opacity,translate] duration-200 ease-out starting:translate-y-1 starting:opacity-0 motion-reduce:starting:translate-y-0 sm:p-6">
        <span className="grid size-11 place-items-center rounded-full bg-v-ink text-v-bg" aria-hidden="true">
          <Check className="size-5" strokeWidth={2.75} />
        </span>
        <div className="flex flex-col gap-1.5">
          <h2 className="text-[19px] font-semibold text-balance">{T.sentH}</h2>
          <p className="max-w-[52ch] text-[15.5px] text-v-muted text-pretty">{T.sentLead(email)}</p>
        </div>
        <div className="flex flex-wrap items-center gap-x-5 gap-y-3 pt-1">
          <VButton kind="ink" size="sm" render={<Link href={PORTAL_HOME} />} nativeButton={false}>
            {T.back}
          </VButton>
          <button type="button" onClick={() => { setSent(false); setTopic(null); setMessage("") }} className={cn(LINK, "text-[14.5px]")}>
            {T.another}
          </button>
        </div>
      </section>
    )
  }

  const error = messageFor(status)
  const hint = topic ? T.hints[topic] : null
  const badText = status === "short" || status === "long"

  return (
    <section aria-labelledby={`${id}-h`} className="nz-paper flex flex-col rounded-[24px] p-5 sm:p-6">
      <h2 id={`${id}-h`} className="sr-only">{T.h1}</h2>
      <form onSubmit={submit} noValidate className="flex flex-col gap-6">
        <fieldset className="flex min-w-0 flex-col" aria-describedby={hint ? `${id}-hint` : status === "topic" ? `${id}-msg` : undefined}>
          <legend className="mb-3 p-0 text-[14px] font-semibold">{T.topicLabel}</legend>
          <div className="flex flex-wrap gap-2">
            {(Object.keys(T.topics) as Topic[]).map((t) => (
              <label
                key={t}
                className={cn(
                  "flex min-h-11 cursor-pointer items-center rounded-full px-4 text-[15px] font-medium transition-[background-color,color,transform] duration-150 ease-out active:scale-[0.97]",
                  "bg-v-soft text-v-ink hover:bg-v-ink/10 has-[:checked]:bg-v-ink has-[:checked]:text-v-bg",
                  status === "topic" && "shadow-[inset_0_0_0_1.5px_var(--v-ink)]",
                  FOCUS
                )}
              >
                <input type="radio" name={`${id}-topic`} value={t} checked={topic === t} onChange={() => { setTopic(t); touch() }} className="sr-only" />
                {T.topics[t]}
              </label>
            ))}
          </div>
          {hint ? (
            <p id={`${id}-hint`} className="mt-3 max-w-[60ch] text-[14px] leading-snug text-v-muted text-pretty">
              {hint}
              {topic === "pass" ? (
                <>
                  {" "}
                  <Link href={PORTAL_CANCEL} className={cn(LINK, "inline-flex items-center gap-1 text-v-ink")}>
                    {T.cancelLink}
                    <ArrowRight className="size-3.5 rtl:-scale-x-100" aria-hidden="true" />
                  </Link>
                </>
              ) : null}
            </p>
          ) : null}
        </fieldset>

        <div className="flex flex-col gap-2.5">
          <label htmlFor={`${id}-msg-field`} className="text-[14px] font-semibold">{T.messageLabel}</label>
          <textarea
            id={`${id}-msg-field`}
            value={message}
            onChange={(e) => { setMessage(e.target.value); touch() }}
            rows={7}
            maxLength={MAX + 200}
            placeholder={T.messagePlaceholder}
            aria-invalid={badText || undefined}
            aria-describedby={`${id}-reply${badText ? ` ${id}-msg` : ""}`}
            className={cn(FIELD, "min-h-40 resize-y py-3 text-[16px] leading-relaxed placeholder:text-v-muted", badText && "shadow-[inset_0_0_0_1.5px_var(--v-ink)]")}
          />
          <div className="flex items-baseline justify-between gap-3 text-[13px] text-v-muted">
            <span id={`${id}-reply`} className="min-w-0 truncate">{T.replyTo(email)}</span>
            {message.length > MAX - 400 ? <span className={cn("v-num shrink-0 tabular-nums", message.length > MAX && "font-semibold text-v-ink")}>{message.length}/{MAX}</span> : null}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <VButton kind="ink" type="submit" disabled={status === "busy"} aria-busy={status === "busy"} className="disabled:opacity-80">
            {status === "busy" ? <LoaderCircle className="size-4 animate-spin motion-reduce:animate-none" aria-hidden="true" /> : null}
            {status === "busy" ? T.sending : T.send}
          </VButton>
          <p id={`${id}-msg`} aria-live="polite" className="text-[14px] font-semibold text-v-ink text-pretty empty:hidden">
            {error}
            {status === "failed" || status === "auth" ? (
              <>
                {" "}
                <a href={`mailto:${support}`} className={LINK}>{support}</a>.
              </>
            ) : null}
          </p>
        </div>
      </form>
    </section>
  )
}
