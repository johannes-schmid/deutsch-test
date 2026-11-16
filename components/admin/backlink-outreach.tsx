"use client"

import { useEffect, useRef, useState, useTransition, type ReactNode } from "react"
import { Check, ClipboardCopy, ExternalLink, LoaderCircle, Mail, Send, Sparkles, X } from "lucide-react"
import { Empty, Panel } from "@/components/admin/admin-ui"
import { draftRequest, logStep, sendRequest, type ActionResult } from "@/app/(admin)/admin/seo/actions"
import { followUpDueAt, prospectOutreachState, type OutreachKind, type OutreachState } from "@/lib/admin/backlink-outreach-model"
import type { OutreachRow } from "@/lib/admin/backlink-outreach"
import type { Prospect, ProspectStatus } from "@/lib/admin/seo-backlinks-model"
import { cn } from "@/lib/utils"

/**
 * The suggestions of the Backlinks tab with outreach (Hannes, 2026-11-16): each candidate opens a drawer with a
 * German draft from Claude (editable), Send for email contacts or Copy + Mark as sent for forms, the outcome
 * buttons and every logged step. The rules (one first email, one follow-up after 10 days) run on the server too.
 */

export type OutreachProspect = Prospect & { state: ProspectStatus }

const STATE: Record<OutreachState, { label: string; cls: string }> = {
  follow_up_due: { label: "Follow-up due", cls: "bg-[var(--p-ember)] text-white" },
  todo: { label: "To do", cls: "bg-v-soft text-v-muted" },
  asked: { label: "Asked", cls: "bg-[color-mix(in_srgb,var(--p-ember)_16%,transparent)] text-v-ink" },
  followed_up: { label: "Followed up", cls: "bg-[color-mix(in_srgb,var(--p-ember)_16%,transparent)] text-v-ink" },
  replied: { label: "Replied", cls: "bg-v-ink/10 text-v-ink" },
  no_reply: { label: "No reply", cls: "bg-v-soft text-v-muted" },
  listed: { label: "Links to us", cls: "bg-v-ink text-white" },
  declined: { label: "Declined", cls: "bg-v-soft text-v-muted line-through" },
}
const ORDER: OutreachState[] = ["follow_up_due", "todo", "asked", "followed_up", "replied", "no_reply", "listed", "declined"]

const STEP: Record<OutreachKind, string> = { sent: "Request", follow_up: "Follow-up", replied: "Reply received", listed: "Links to us", declined: "Declined", note: "Note" }
const CHANNEL: Record<string, string> = { email: "sent by email", form: "via their form", manual: "sent outside the admin" }
const EFFORT: Record<string, string> = { low: "low", medium: "medium", high: "high" }

const day = (iso: string) => new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", timeZone: "Europe/Berlin" })
const LINK = "inline-flex max-w-full items-center gap-1 rounded-sm font-medium underline-offset-4 outline-none hover:underline focus-visible:ring-2 focus-visible:ring-v-ink"
const BTN = "inline-flex h-9 items-center gap-1.5 rounded-full px-3.5 text-[13.5px] font-medium transition-[background-color,color,opacity,transform] duration-150 ease-out outline-none focus-visible:ring-2 focus-visible:ring-v-ink focus-visible:ring-offset-2 active:scale-[0.97] disabled:pointer-events-none disabled:opacity-50"
const PRIMARY = `${BTN} v-cta hover:opacity-90`
const QUIET = `${BTN} bg-v-surface text-v-ink ring-1 ring-v-line ring-inset hover:bg-v-bg`
const FIELD = "w-full rounded-[14px] bg-v-bg px-3.5 text-[14px] text-v-ink outline-none ring-1 ring-transparent ring-inset transition-[box-shadow] duration-150 ease-out placeholder:text-v-muted focus-visible:ring-2 focus-visible:ring-v-ink"

export function BacklinkSuggestions({ prospects, outreach, outreachError }: { prospects: OutreachProspect[]; outreach: Record<string, OutreachRow[]> | null; outreachError: string | null }) {
  const [now] = useState(() => new Date())
  const [selected, setSelected] = useState<string | null>(null)
  const [drafts, setDrafts] = useState<Record<string, { subject: string; body: string }>>({})
  const lastRow = useRef<HTMLButtonElement | null>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const wasOpen = useRef(false)

  const rows = prospects
    .map((p) => ({ p, events: outreach?.[p.domain] ?? [], state: prospectOutreachState(p, outreach?.[p.domain] ?? [], now) }))
    .sort((a, b) => ORDER.indexOf(a.state) - ORDER.indexOf(b.state))
  const open = rows.find((r) => r.p.domain === selected) ?? null

  useEffect(() => {
    if (open) {
      closeRef.current?.focus()
      const onKey = (e: KeyboardEvent) => e.key === "Escape" && setSelected(null)
      window.addEventListener("keydown", onKey)
      wasOpen.current = true
      return () => window.removeEventListener("keydown", onKey)
    }
    if (wasOpen.current) {
      wasOpen.current = false
      lastRow.current?.focus({ preventScroll: true })
    }
  }, [open])

  if (!prospects.length) return <Empty>No suggestions yet. Add them to seo-agent/backlink-prospects.json.</Empty>

  return (
    <>
      <Panel>
        <ul className="divide-y divide-v-line">
          {rows.map(({ p, events, state }) => {
            const last = [...events].reverse().find((e) => e.kind !== "note")
            const isOpen = selected === p.domain
            return (
              <li key={p.url} className={cn("grid grid-cols-1 gap-x-6 gap-y-2 px-4 py-4 text-[13.5px] leading-relaxed transition-colors duration-150 ease-out sm:px-5 lg:grid-cols-[200px_minmax(0,1fr)_minmax(0,1fr)_150px]", isOpen && "bg-v-bg/70")}>
                <div className="flex min-w-0 items-start justify-between gap-3 lg:block">
                  <div className="min-w-0">
                    <a href={p.url} target="_blank" rel="noreferrer" className={`${LINK} font-semibold`}>
                      <span className="truncate">{p.domain}</span>
                      <ExternalLink className="size-3 shrink-0" aria-hidden="true" />
                    </a>
                    <span className="block text-[12px] text-v-muted">{p.kind.replace(/-/g, " ")} · effort {EFFORT[p.effort] ?? p.effort}</span>
                  </div>
                  <Pill state={state} className="lg:hidden" />
                </div>
                <Labelled label="Why it fits">{p.why}</Labelled>
                <Labelled label="What to do">{p.how}</Labelled>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-2 lg:flex-col lg:items-start">
                  <Pill state={state} className="hidden lg:inline-flex" />
                  {last && <span className="text-[12px] text-v-muted tabular-nums">{STEP[last.kind]} {day(last.at)}</span>}
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls="outreach-details"
                    onClick={(e) => {
                      lastRow.current = e.currentTarget
                      setSelected(isOpen ? null : p.domain)
                    }}
                    className={state === "todo" || state === "follow_up_due" ? PRIMARY : QUIET}
                  >
                    {state === "todo" ? <><Mail className="size-4" aria-hidden="true" />Ask for a link</> : state === "follow_up_due" ? <><Send className="size-4" aria-hidden="true" />Follow up</> : "Open"}
                  </button>
                </div>
              </li>
            )
          })}
        </ul>
      </Panel>

      <div aria-hidden="true" onClick={() => setSelected(null)} className={cn("fixed inset-0 z-40 bg-v-ink/30 transition-opacity duration-200 ease-out", open ? "opacity-100" : "pointer-events-none opacity-0")} />
      <aside
        id="outreach-details"
        aria-label="Backlink request"
        inert={!open}
        className={cn(
          "fixed inset-y-2 end-2 z-50 flex w-[520px] max-w-[calc(100vw-16px)] flex-col overflow-hidden rounded-[28px] bg-v-surface shadow-[0_40px_80px_-30px_rgba(14,19,34,0.5)] transition-[transform,visibility] duration-[260ms] ease-[cubic-bezier(0.32,0.72,0,1)] motion-reduce:transition-[visibility]",
          open ? "visible translate-x-0" : "invisible translate-x-[calc(100%+16px)]",
        )}
      >
        {open && (
          <Details
            key={open.p.domain}
            p={open.p}
            events={open.events}
            state={open.state}
            outreachError={outreachError}
            draft={drafts[open.p.domain] ?? null}
            setDraft={(d) => setDrafts((all) => ({ ...all, [open.p.domain]: d }))}
            onClose={() => setSelected(null)}
            closeRef={closeRef}
          />
        )}
      </aside>
    </>
  )
}

function Details({ p, events, state, outreachError, draft, setDraft, onClose, closeRef }: {
  p: OutreachProspect
  events: OutreachRow[]
  state: OutreachState
  outreachError: string | null
  draft: { subject: string; body: string } | null
  setDraft: (d: { subject: string; body: string }) => void
  onClose: () => void
  closeRef: React.RefObject<HTMLButtonElement | null>
}) {
  const contact = p.contact
  const sendKind: "sent" | "follow_up" | null = state === "todo" ? "sent" : state === "follow_up_due" ? "follow_up" : null
  const due = followUpDueAt(events)
  const [pending, start] = useTransition()
  const [busy, setBusy] = useState<string | null>(null)
  const [result, setResult] = useState<{ ok: boolean; text: string } | null>(null)
  const [confirming, setConfirming] = useState(false)
  const [copied, setCopied] = useState(false)
  const [note, setNote] = useState("")

  const run = (label: string, fn: () => Promise<ActionResult<unknown>>, after?: (r: ActionResult<unknown>) => void) =>
    start(async () => {
      setBusy(label)
      setResult(null)
      const r = await fn()
      setBusy(null)
      setConfirming(false)
      setResult(r.ok ? (r.message ? { ok: true, text: r.message } : null) : { ok: false, text: r.error })
      after?.(r)
    })

  const draftNow = () =>
    sendKind &&
    run("draft", () => draftRequest(p.domain, sendKind), (r) => {
      if (r.ok && r.data) setDraft(r.data as { subject: string; body: string })
    })

  const copy = async () => {
    if (!draft) return
    try {
      await navigator.clipboard.writeText(`${draft.subject}\n\n${draft.body}`)
      setCopied(true)
      setTimeout(() => setCopied(false), 1600)
    } catch {
      setResult({ ok: false, text: "Copy failed: select the text by hand." })
    }
  }

  const editable = draft ?? { subject: "", body: "" }
  const edit = (d: { subject: string; body: string }) => {
    setDraft(d)
    if (result && !result.ok) setResult(null)
  }
  const ready = Boolean(draft?.subject.trim() && draft?.body.trim())
  const blocked = Boolean(outreachError)

  return (
    <>
      <header className="flex items-start justify-between gap-3 border-b border-v-line px-6 pt-5 pb-4">
        <div className="flex min-w-0 flex-col gap-1.5">
          <h2 className="truncate text-[17px] leading-snug font-semibold tracking-[-0.01em]">{p.domain}</h2>
          <p className="text-[13px] text-v-muted">
            {contact?.channel === "email" ? <>To {contact.name ? `${contact.name}, ` : ""}<span className="text-v-ink">{contact.email}</span></> : contact?.channel === "form" ? "Through their contact form" : contact?.channel === "self-serve" ? "You list it yourself" : "No contact on file"}
          </p>
          <Pill state={state} className="mt-1 self-start" />
        </div>
        <button ref={closeRef} type="button" onClick={onClose} aria-label="Close" className="grid size-11 shrink-0 place-items-center rounded-full text-v-ink transition-[background-color,transform] duration-150 ease-out hover:bg-v-ink/6 active:scale-[0.95]">
          <X className="size-5" aria-hidden="true" />
        </button>
      </header>

      <div className="flex min-h-0 flex-1 flex-col gap-6 overflow-y-auto px-6 py-5">
        {blocked && <p role="alert" className="rounded-[14px] bg-[color-mix(in_srgb,var(--p-ember)_14%,transparent)] px-4 py-3 text-[13.5px]">The outreach log can’t be read ({outreachError}), so nothing can be sent or logged. Is the migration on this database?</p>}

        {sendKind ? (
          <Block title={sendKind === "sent" ? (contact?.channel === "self-serve" ? "Listing text" : "Request") : "Follow-up"} aside={<button type="button" onClick={draftNow} disabled={pending || blocked} className={QUIET}>{busy === "draft" ? <LoaderCircle className="size-4 animate-spin motion-reduce:animate-none" aria-hidden="true" /> : <Sparkles className="size-4" aria-hidden="true" />}{draft ? "Draft again" : "Draft with Claude"}</button>}>
            {sendKind === "follow_up" && due && <p className="text-[13px] text-v-muted">No answer since {day(events.find((e) => e.kind === "sent")!.at)}. This is the one follow-up; after it the site moves to “No reply” in 14 days.</p>}
            <label className="flex flex-col gap-1.5">
              <span className="text-[12.5px] font-semibold text-v-muted">Subject</span>
              <input value={editable.subject} onChange={(e) => edit({ ...editable, subject: e.target.value })} disabled={busy === "draft"} className={`${FIELD} h-11`} placeholder={busy === "draft" ? "Drafting…" : "Draft with Claude, or write it yourself"} />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-[12.5px] font-semibold text-v-muted">Text</span>
              <textarea value={editable.body} onChange={(e) => edit({ ...editable, body: e.target.value })} disabled={busy === "draft"} rows={14} className={`${FIELD} resize-y py-3 leading-relaxed`} placeholder={busy === "draft" ? "Drafting…" : "Plain text, Sie-form. Offer only the free pages."} />
            </label>
            <p className="text-[12.5px] text-v-muted">Check every claim before it goes out. Offer only free pages that are live, and never say “offiziell”.</p>

            <div className="flex flex-wrap items-center gap-2">
              {contact?.channel === "email" && contact.email ? (
                confirming ? (
                  <>
                    <button type="button" onClick={() => run("send", () => sendRequest(p.domain, sendKind, editable))} disabled={pending || !ready || blocked} className={PRIMARY}>
                      {busy === "send" ? <LoaderCircle className="size-4 animate-spin motion-reduce:animate-none" aria-hidden="true" /> : <Send className="size-4" aria-hidden="true" />}Send now to {contact.email}
                    </button>
                    <button type="button" onClick={() => setConfirming(false)} disabled={pending} className={QUIET}>Cancel</button>
                  </>
                ) : (
                  <button type="button" onClick={() => setConfirming(true)} disabled={pending || !ready || blocked} className={PRIMARY}><Send className="size-4" aria-hidden="true" />Send email…</button>
                )
              ) : (
                <>
                  <button type="button" onClick={copy} disabled={!ready} className={PRIMARY}>{copied ? <Check className="size-4" aria-hidden="true" /> : <ClipboardCopy className="size-4" aria-hidden="true" />}<span aria-live="polite">{copied ? "Copied" : "Copy text"}</span></button>
                  {contact?.form && <a href={contact.form} target="_blank" rel="noreferrer" className={QUIET}>Open {contact.channel === "self-serve" ? "site" : "form"}<ExternalLink className="size-3.5" aria-hidden="true" /></a>}
                </>
              )}
              <button type="button" onClick={() => run("mark", () => logStep(p.domain, sendKind, editable))} disabled={pending || blocked} className={`${BTN} text-v-muted hover:text-v-ink`}>
                {busy === "mark" && <LoaderCircle className="size-4 animate-spin motion-reduce:animate-none" aria-hidden="true" />}Mark as sent
              </button>
            </div>
          </Block>
        ) : state === "asked" && due ? (
          <p className="text-[13.5px]">Asked on {day(events.find((e) => e.kind === "sent")!.at)}. A follow-up is possible from <b className="font-semibold">{day(due)}</b> if they don’t answer.</p>
        ) : null}

        {result && <p role={result.ok ? "status" : "alert"} className={cn("text-[13.5px] font-medium", result.ok ? "text-v-ink" : "text-[#B42318]")}>{result.text}</p>}

        {state !== "todo" && state !== "listed" && state !== "declined" && (
          <Block title="Outcome">
            <div className="flex flex-wrap gap-2">
              {state !== "replied" && <button type="button" onClick={() => run("replied", () => logStep(p.domain, "replied"))} disabled={pending || blocked} className={QUIET}>Got a reply</button>}
              <button type="button" onClick={() => run("listed", () => logStep(p.domain, "listed"))} disabled={pending || blocked} className={QUIET}>Links to us</button>
              <button type="button" onClick={() => run("declined", () => logStep(p.domain, "declined"))} disabled={pending || blocked} className={QUIET}>Declined</button>
            </div>
            <p className="text-[12.5px] text-v-muted">Replies land in support@. Bing switches a site to “Links to us” by itself once it sees the link.</p>
          </Block>
        )}

        <Block title="Log">
          {events.length ? (
            <ol className="flex flex-col gap-3">
              {[...events].reverse().map((e) => (
                <li key={e.id} className="flex flex-col gap-0.5 text-[13.5px]">
                  <span><b className="font-semibold">{STEP[e.kind]}</b> <span className="text-v-muted tabular-nums">· {day(e.at)}{e.channel ? ` · ${CHANNEL[e.channel] ?? e.channel}` : ""}</span></span>
                  {e.subject && <span className="text-v-muted">{e.subject}</span>}
                  {e.body && (e.kind === "note" ? <span className="whitespace-pre-wrap">{e.body}</span> : (
                    <details className="group">
                      <summary className="cursor-pointer rounded-sm text-[12.5px] text-v-muted underline-offset-4 outline-none hover:underline focus-visible:ring-2 focus-visible:ring-v-ink">Show text</summary>
                      <p className="mt-1.5 rounded-[14px] bg-v-bg px-3.5 py-3 whitespace-pre-wrap">{e.body}</p>
                    </details>
                  ))}
                </li>
              ))}
            </ol>
          ) : (
            <p className="text-[13.5px] text-v-muted">Nothing logged yet{p.status && p.status !== "todo" ? ` (the JSON says “${p.status}”)` : ""}.</p>
          )}
          <div className="flex items-start gap-2">
            <label className="sr-only" htmlFor="outreach-note">Note</label>
            <textarea id="outreach-note" value={note} onChange={(e) => setNote(e.target.value)} rows={2} placeholder="Add a note, e.g. what they answered" className={`${FIELD} resize-y py-2.5`} />
            <button type="button" onClick={() => run("note", () => logStep(p.domain, "note", { body: note }), (r) => r.ok && setNote(""))} disabled={pending || blocked || !note.trim()} className={QUIET}>Add</button>
          </div>
        </Block>

        <Block title="Our notes">
          <p className="text-[13.5px] leading-relaxed">{p.how}</p>
          <a href={p.url} target="_blank" rel="noreferrer" className={`${LINK} text-[13.5px]`}>Their page<ExternalLink className="size-3" aria-hidden="true" /></a>
        </Block>
      </div>
    </>
  )
}

function Block({ title, aside, children }: { title: string; aside?: ReactNode; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-[14px] font-semibold tracking-[-0.01em]">{title}</h3>
        {aside}
      </div>
      {children}
    </section>
  )
}

function Pill({ state, className }: { state: OutreachState; className?: string }) {
  return <span className={cn("inline-flex shrink-0 rounded-full px-2.5 py-0.5 text-[12px] font-medium", STATE[state].cls, className)}>{STATE[state].label}</span>
}

function Labelled({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="min-w-0">
      <span className="block text-[12px] font-semibold text-v-muted">{label}</span>
      <span className="block">{children}</span>
    </div>
  )
}
