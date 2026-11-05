"use client"

import { useEffect, useMemo, useRef, useState, useTransition } from "react"
import { CircleCheck, LoaderCircle, Search, X } from "lucide-react"
import { DataTable, Empty, TBODY, TD, TH, THEAD } from "@/components/admin/admin-ui"
import { ConfirmSheet, ExamButton } from "@/components/exam"
import { cancelSubscription } from "@/app/(admin)/admin/konten/actions"
import { EXAMS } from "@/lib/exams"
import { KURZTEST_COPY } from "@/lib/i18n/kurztest"
import { formatEuro } from "@/lib/pricing"
import type { AccessState, AdminUser } from "@/lib/admin/users"
import { cn } from "@/lib/utils"

// /admin/konten: one row per account, filter chips above, the details in a drawer on the right. The drawer carries
// the one write action of this page, "Vertrag kündigen", behind a confirm sheet.

type Filter = "all" | AccessState | "paid"

const FILTERS: { id: Filter; label: string }[] = [
  { id: "all", label: "Alle" },
  { id: "active", label: "Pass läuft" },
  { id: "canceled", label: "Gekündigt" },
  { id: "ended", label: "Abgelaufen" },
  { id: "free", label: "Gratis" },
  { id: "paid", label: "Je bezahlt" },
]

const ACCESS: Record<AccessState, string> = { free: "Gratis", active: "Pass läuft", canceled: "Gekündigt", ended: "Abgelaufen" }

const matches = (u: AdminUser, f: Filter) => f === "all" || (f === "paid" ? u.payments.count > 0 : u.access === f)

const day = (iso: string | null | undefined) => (iso ? new Date(iso).toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit", year: "numeric", timeZone: "Europe/Berlin" }) : "–")
const dayLong = (iso: string) => new Date(iso).toLocaleDateString("de-DE", { day: "numeric", month: "long", year: "numeric", timeZone: "Europe/Berlin" })
const stamp = (iso: string | null | undefined) => (iso ? new Date(iso).toLocaleString("de-DE", { dateStyle: "medium", timeStyle: "short", timeZone: "Europe/Berlin" }) : "–")

/** The access state as a pill: ink while the pass is live, soft otherwise. State is wording, never a colour alone. */
function AccessPill({ access, until }: { access: AccessState; until: string | null }) {
  const live = access === "active" || access === "canceled"
  return (
    <span className={cn("inline-flex h-6 items-center gap-1.5 rounded-full px-2.5 text-[12px] font-medium whitespace-nowrap", live ? "bg-v-ink text-v-bg" : "bg-v-soft text-v-muted")}>
      {ACCESS[access]}
      {live && until ? <span className="v-num opacity-70">bis {day(until)}</span> : null}
    </span>
  )
}

function Field({ label, children, wide }: { label: string; children: React.ReactNode; wide?: boolean }) {
  return (
    <div className={cn("flex min-w-0 flex-col gap-0.5", wide && "col-span-2")}>
      <dt className="text-[12px] text-v-muted">{label}</dt>
      <dd className="min-w-0 text-[14.5px] font-medium break-words">{children}</dd>
    </div>
  )
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-3">
      <h3 className="text-[14px] font-semibold tracking-[-0.01em]">{title}</h3>
      {children}
    </section>
  )
}

/** "Vertrag kündigen" for one account: confirm sheet → server action → result. The row's state refreshes afterwards. */
function CancelContract({ user }: { user: AdminUser }) {
  const [confirm, setConfirm] = useState(false)
  const [pending, start] = useTransition()
  const [result, setResult] = useState<{ ok: true; until: string | null; already: boolean } | { ok: false; error: string } | null>(null)

  if (result?.ok)
    return (
      <p aria-live="polite" className="flex items-start gap-2 rounded-[16px] bg-v-soft/70 p-3.5 text-[14px]">
        <CircleCheck className="mt-0.5 size-4 shrink-0 text-v-accent" aria-hidden="true" />
        <span>
          {result.already ? "War schon gekündigt." : "Gekündigt, Bestätigung per E-Mail ist raus."}
          {result.until ? ` Zugang bis ${dayLong(result.until)}.` : ""}
        </span>
      </p>
    )
  return (
    <div className="flex flex-col gap-2">
      <ExamButton kind="soft" className="flex h-11 w-fit items-center gap-2 px-5 text-[14.5px] text-v-ink" disabled={pending} aria-busy={pending} onClick={() => setConfirm(true)}>
        {pending ? <LoaderCircle className="size-4 animate-spin motion-reduce:animate-none" aria-hidden="true" /> : null}
        {pending ? "Kündigt …" : "Vertrag kündigen"}
      </ExamButton>
      {result && !result.ok ? <p role="alert" className="text-[13.5px] font-medium text-[#B42318]">{result.error}</p> : null}
      <ConfirmSheet
        open={confirm}
        onOpenChange={setConfirm}
        title={`Vertrag von ${user.name ?? user.email} kündigen?`}
        text={`${user.email}: Das Abo endet zum ${user.until ? dayLong(user.until) : "Ende der bezahlten Zeit"}. Bis dahin bleibt der Zugang. Die Person bekommt dieselbe Bestätigung per E-Mail wie beim Kündigungsbutton.`}
        confirm="Jetzt kündigen"
        cancel="Abbrechen"
        onConfirm={() => start(async () => setResult(await cancelSubscription(user.id)))}
      />
    </div>
  )
}

function Details({ user, onClose, closeRef }: { user: AdminUser | null; onClose: () => void; closeRef: React.RefObject<HTMLButtonElement | null> }) {
  const u = user
  return (
    <aside
      id="konto-details"
      aria-label="Konto-Details"
      inert={!u}
      className={cn(
        "fixed inset-y-2 end-2 z-50 flex w-[460px] max-w-[calc(100vw-16px)] flex-col overflow-hidden rounded-[28px] bg-v-surface shadow-[0_40px_80px_-30px_rgba(14,19,34,0.5)] transition-[transform,visibility] duration-[260ms] ease-[cubic-bezier(0.32,0.72,0,1)] motion-reduce:transition-[visibility]",
        u ? "visible translate-x-0" : "invisible translate-x-[calc(100%+16px)]",
      )}
    >
      {u ? (
        <>
          <header className="flex items-start justify-between gap-3 border-b border-v-line px-6 pt-5 pb-4">
            <div className="flex min-w-0 flex-col gap-1.5">
              <h2 className="truncate text-[17px] font-semibold tracking-[-0.01em]">{u.name ?? u.email}</h2>
              {u.name ? <p className="truncate text-[13.5px] text-v-muted">{u.email}</p> : null}
              <div className="mt-1">
                <AccessPill access={u.access} until={u.until} />
              </div>
            </div>
            <button ref={closeRef} type="button" onClick={onClose} aria-label="Details schließen" className="grid size-11 shrink-0 place-items-center rounded-full text-v-ink transition-[background-color,transform] duration-150 ease-out hover:bg-v-ink/6 active:scale-[0.95]">
              <X className="size-5" aria-hidden="true" />
            </button>
          </header>

          <div className="flex min-h-0 flex-1 flex-col gap-7 overflow-y-auto px-6 py-5">
            <dl className="grid grid-cols-2 gap-x-4 gap-y-3">
              <Field label="Angemeldet">{day(u.createdAt)}</Field>
              <Field label="Letzte Anmeldung">{day(u.lastSignInAt)}</Field>
              <Field label="Zuletzt aktiv">{day(u.lastActiveAt)}</Field>
              <Field label="Werbe-E-Mails">{u.emails === "off" ? "abgemeldet" : u.emails === "on" ? "an" : "–"}</Field>
              <Field label="User-ID" wide>
                <span className="font-[family-name:var(--v-font-mono)] text-[12px] font-normal text-v-muted">{u.id}</span>
              </Field>
            </dl>

            <Block title="Pass">
              {u.access === "free" ? (
                <p className="text-[14px] text-v-muted">Noch nichts gekauft.</p>
              ) : (
                <dl className="grid grid-cols-2 gap-x-4 gap-y-3 rounded-[16px] bg-v-soft/60 p-4">
                  <Field label="Angebot" wide>{u.offer ?? "–"}</Field>
                  <Field label={u.access === "ended" ? "Lief bis" : "Zugang bis"}>{day(u.until)}</Field>
                  <Field label="Verlängerung">{u.renewing ? "monatlich" : u.canceledAt ? `gekündigt am ${day(u.canceledAt)}` : "keine"}</Field>
                </dl>
              )}
              {u.renewing && u.hasCustomer ? <CancelContract key={u.id} user={u} /> : null}
            </Block>

            <Block title="Zahlungen">
              {u.payments.last ? (
                <p className="text-[14px]">
                  <b className="v-num font-semibold">{formatEuro(u.payments.totalCents)}</b>
                  <span className="text-v-muted"> in {u.payments.count} {u.payments.count === 1 ? "Zahlung" : "Zahlungen"}, zuletzt {formatEuro(u.payments.last.cents)} am {stamp(u.payments.last.at)}</span>
                </p>
              ) : (
                <p className="text-[14px] text-v-muted">Keine Zahlung.</p>
              )}
            </Block>

            <Block title="Prüfungsziel">
              {u.goal?.exam ? (
                <p className="text-[14px]">
                  <b className="font-semibold">{EXAMS[u.goal.exam]?.name ?? u.goal.exam}</b>
                  <span className="text-v-muted">{u.goal.date ? `, Termin ${day(u.goal.date)}` : ", kein Termin"}</span>
                </p>
              ) : (
                <p className="text-[14px] text-v-muted">Noch keine Prüfung gewählt.</p>
              )}
            </Block>

            <Block title="Modelltests">
              {u.skills.length ? (
                <ul className="flex flex-col divide-y divide-v-line rounded-[16px] border border-v-line">
                  {u.skills.map((s) => (
                    <li key={`${s.exam}/${s.skill}`} className="flex items-center justify-between gap-3 px-4 py-2.5 text-[14px]">
                      <span className="min-w-0">
                        <span className="font-medium">{s.examName} {KURZTEST_COPY.names[s.skill] ?? s.skill}</span>
                        <span className="block text-[12.5px] text-v-muted">zuletzt {day(s.last)}</span>
                      </span>
                      <span className="v-num shrink-0 text-end text-[13px] text-v-muted">
                        {s.completed} von {s.attempts} abgegeben
                        {s.practice ? <span className="block">{s.practice} im Übungsmodus</span> : null}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-[14px] text-v-muted">Noch kein Modelltest gestartet.</p>
              )}
            </Block>
          </div>
        </>
      ) : null}
    </aside>
  )
}

export function UsersTable({ users }: { users: AdminUser[] }) {
  const [q, setQ] = useState("")
  const [filter, setFilter] = useState<Filter>("all")
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const lastRow = useRef<HTMLButtonElement | null>(null)
  const wasOpen = useRef(false)

  const counts = useMemo(() => Object.fromEntries(FILTERS.map((f) => [f.id, users.filter((u) => matches(u, f.id)).length])) as Record<Filter, number>, [users])
  const rows = useMemo(() => {
    const needle = q.trim().toLowerCase()
    return users.filter((u) => matches(u, filter) && (!needle || u.email.toLowerCase().includes(needle) || u.name?.toLowerCase().includes(needle)))
  }, [users, q, filter])
  const selected = users.find((u) => u.id === selectedId) ?? null

  useEffect(() => {
    if (selected) {
      closeRef.current?.focus()
      const onKey = (e: KeyboardEvent) => e.key === "Escape" && setSelectedId(null)
      window.addEventListener("keydown", onKey)
      wasOpen.current = true
      return () => window.removeEventListener("keydown", onKey)
    }
    if (wasOpen.current) {
      wasOpen.current = false
      lastRow.current?.focus({ preventScroll: true })
    }
  }, [selected])

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div role="group" aria-label="Filter" className="-mx-4 flex gap-1.5 overflow-x-auto px-4 sm:mx-0 sm:flex-wrap sm:px-0">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              type="button"
              aria-pressed={filter === f.id}
              onClick={() => setFilter(f.id)}
              className={cn(
                "flex h-9 shrink-0 items-center gap-1.5 rounded-full px-3.5 text-[13.5px] font-medium transition-[background-color,color,transform] duration-150 ease-out active:scale-[0.97]",
                filter === f.id ? "bg-v-ink text-v-bg" : "bg-v-surface text-v-muted ring-1 ring-v-line ring-inset hover:text-v-ink",
              )}
            >
              {f.label}
              <span className={cn("v-num text-[12px]", filter === f.id ? "opacity-70" : "text-v-muted")}>{counts[f.id]}</span>
            </button>
          ))}
        </div>
        <label className="relative flex h-10 items-center sm:w-64">
          <Search className="pointer-events-none absolute start-3.5 size-4 text-v-muted" aria-hidden="true" />
          <span className="sr-only">Nach E-Mail oder Name suchen</span>
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="E-Mail oder Name"
            className="h-full w-full rounded-full bg-v-surface ps-10 pe-4 text-[14px] text-v-ink ring-1 ring-v-line ring-inset placeholder:text-v-muted focus-visible:ring-2 focus-visible:ring-v-ink focus-visible:outline-none"
          />
        </label>
      </div>

      {rows.length ? (
        <DataTable className="whitespace-nowrap">
          <thead className={THEAD}>
            <tr>
              <th className={TH}>Konto</th>
              <th className={TH}>Pass</th>
              <th className={`${TH} text-end`}>Bezahlt</th>
              <th className={TH}>Ziel</th>
              <th className={`${TH} text-end`}>Modelltests</th>
              <th className={TH}>Zuletzt aktiv</th>
              <th className={TH}>Angemeldet</th>
            </tr>
          </thead>
          <tbody className={TBODY}>
            {rows.map((u) => {
              const open = u.id === selectedId
              const tests = u.skills.reduce((s, x) => s + x.attempts, 0)
              return (
                <tr key={u.id} className={cn("transition-colors duration-150 ease-out hover:bg-v-bg/70", open && "bg-v-bg/70")}>
                  <td className={`${TD} max-w-[260px]`}>
                    <button
                      type="button"
                      aria-expanded={open}
                      aria-controls="konto-details"
                      onClick={(e) => {
                        lastRow.current = e.currentTarget
                        setSelectedId(open ? null : u.id)
                      }}
                      className="block max-w-full truncate rounded-sm text-start font-medium underline-offset-4 hover:underline focus-visible:ring-2 focus-visible:ring-v-ink focus-visible:ring-offset-2 focus-visible:outline-none"
                    >
                      {u.email}
                    </button>
                    {u.name ? <span className="block truncate text-[12.5px] text-v-muted">{u.name}</span> : null}
                  </td>
                  <td className={TD}><AccessPill access={u.access} until={u.until} /></td>
                  <td className={`${TD} text-end`}>{u.payments.count ? formatEuro(u.payments.totalCents) : <span className="text-v-muted">–</span>}</td>
                  <td className={`${TD} max-w-[220px] truncate text-v-muted`}>{u.goal?.exam ? `${EXAMS[u.goal.exam]?.name ?? u.goal.exam}${u.goal.date ? ` · ${day(u.goal.date)}` : ""}` : "–"}</td>
                  <td className={`${TD} text-end`}>{tests || <span className="text-v-muted">–</span>}</td>
                  <td className={`${TD} text-v-muted`}>{day(u.lastActiveAt)}</td>
                  <td className={`${TD} text-v-muted`}>{day(u.createdAt)}</td>
                </tr>
              )
            })}
          </tbody>
        </DataTable>
      ) : (
        <Empty>{users.length ? "Kein Konto passt zu Filter und Suche." : "Noch keine Konten. Sobald sich jemand mit Google registriert, steht das Konto hier."}</Empty>
      )}
      <p className="text-[13px] text-v-muted">
        {rows.length === users.length ? `${users.length} Konten` : `${rows.length} von ${users.length} Konten`}
      </p>

      <div aria-hidden="true" onClick={() => setSelectedId(null)} className={cn("fixed inset-0 z-40 bg-v-ink/30 transition-opacity duration-200 ease-out", selected ? "opacity-100" : "pointer-events-none opacity-0")} />
      <Details user={selected} onClose={() => setSelectedId(null)} closeRef={closeRef} />
    </div>
  )
}
