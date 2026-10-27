import Link from "next/link"
import { ArrowRight, Check, Mail, MessageCircle, ShieldCheck, Ticket } from "lucide-react"
import { VButton } from "@/components/design/kit"
import { ExamMark, PartIcon } from "@/components/design/variants/nachtzug-icons"
import { Avatar } from "@/components/portal/portal-shell"
import { ProgressBar } from "@/components/portal/portal-overview"
import type { Brand } from "@/lib/exams"
import type { PartId } from "@/lib/exam/types"
import type { SessionUser } from "@/lib/supabase/server"
import { PORTAL_CANCEL, PORTAL_CONTACT, PORTAL_PASS } from "@/lib/auth/redirect"
import { PORTAL_COPY } from "@/lib/i18n/portal"

const T = PORTAL_COPY.konto
const PANEL = "nz-paper flex flex-col rounded-[24px] p-5 sm:p-6"

/** Avatar, name and email as the page head. */
export function AccountHead({ user }: { user: SessionUser | null }) {
  return (
    <header className="mt-6 flex items-center gap-4 sm:gap-5">
      <Avatar user={user} size={72} />
      <div className="flex min-w-0 flex-col gap-1">
        <h1 className="v-display text-[clamp(28px,3.6vw,42px)] leading-[1.08]">{T.h1}</h1>
        <p className="min-h-6 truncate text-[16px] text-v-muted">{user ? (user.name ?? user.email) : null}</p>
      </div>
    </header>
  )
}

/** One setting: icon tile, label, value or control on the end. Rows are divided inside one card. */
export function SettingsRow({ icon: Icon, label, children }: { icon: React.ComponentType<{ className?: string; strokeWidth?: number }>; label: string; children: React.ReactNode }) {
  return (
    <li className="flex min-h-16 items-center gap-3 border-t border-v-line py-3 first:border-t-0 first:pt-0 last:pb-0">
      <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-v-soft" aria-hidden="true">
        <Icon className="size-[18px]" strokeWidth={1.85} />
      </span>
      <span className="shrink-0 text-[15px] font-medium whitespace-nowrap">{label}</span>
      <span className="flex min-w-0 flex-1 items-center justify-end text-end text-[15px] text-v-muted">{children}</span>
    </li>
  )
}

/** The account facts: email and how you sign in. Sign-out sits on the end of its own row. */
export function AccountCard({ user, signOut }: { user: SessionUser | null; signOut: React.ReactNode }) {
  return (
    <section aria-labelledby="acc-h" className={PANEL}>
      <h2 id="acc-h" className="mb-4 text-[17px] font-semibold">{T.accountH}</h2>
      <ul className="flex flex-col">
        <SettingsRow icon={Mail} label={T.email}><span className="truncate">{user?.email ?? " "}</span></SettingsRow>
        <SettingsRow icon={ShieldCheck} label={T.login}>{T.google}</SettingsRow>
        <SettingsRow icon={MessageCircle} label={PORTAL_COPY.contact.rowH}>
          <Link href={PORTAL_CONTACT} className="group flex items-center gap-1.5 rounded-full font-semibold text-v-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-v-ink">
            {PORTAL_COPY.contact.rowLink}
            <ArrowRight className="size-4 transition-transform duration-150 ease-out group-hover:translate-x-0.5 rtl:-scale-x-100" aria-hidden="true" />
          </Link>
        </SettingsRow>
      </ul>
      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-[18px] bg-v-soft/60 p-4">
        <span className="text-[14.5px] text-v-muted">{T.signOutLead}</span>
        {signOut}
      </div>
    </section>
  )
}

export type PassView = { state: "free" | "renewing" | "canceled" | "ended"; until: string | null; renewal: string }

/** The learner's Prüfungspass: free, renewing (paid until, monthly price, cancel link), cancelled (runs until) or ended. */
export function PassCard({ pass }: { pass: PassView }) {
  const active = pass.state === "renewing" || pass.state === "canceled"
  const lead =
    pass.state === "renewing" ? T.passRenews(pass.until!, pass.renewal) : pass.state === "canceled" ? T.passCanceled(pass.until!) : pass.state === "ended" ? T.passEnded : T.passFreeLead
  return (
    <section aria-labelledby="pass-h" className={active ? "nz-night flex flex-col gap-4 rounded-[24px] p-5 shadow-[0_40px_80px_-44px_rgba(8,10,30,0.7)] sm:p-6" : `${PANEL} gap-4`}>
      <div className="flex items-center justify-between gap-3">
        <h2 id="pass-h" className="flex items-center gap-2.5 text-[17px] font-semibold">
          <Ticket className="size-[18px]" strokeWidth={1.85} aria-hidden="true" />
          {T.passH}
        </h2>
        {pass.state === "renewing" ? (
          <span className="flex items-center gap-1 rounded-full bg-(--p-glow) px-2.5 py-1 text-[12.5px] font-semibold text-[#0A0D18]">
            <Check className="size-3.5" strokeWidth={3} aria-hidden="true" />
            {T.passActive}
          </span>
        ) : pass.state === "canceled" ? (
          <span className="rounded-full bg-white/15 px-2.5 py-1 text-[12.5px] font-semibold">{T.passCanceledChip}</span>
        ) : (
          <span className="v-num rounded-full bg-v-soft px-2.5 py-1 text-[12.5px] font-medium">{T.passFree}</span>
        )}
      </div>
      <p className={active ? "text-[15px] text-white/80 text-pretty" : "text-[15px] text-v-muted text-pretty"}>{lead}</p>
      {pass.state === "renewing" ? (
        <Link
          id="kuendigen"
          href={PORTAL_CANCEL}
          className="w-fit rounded-full text-[14.5px] font-semibold text-white underline decoration-white/40 underline-offset-4 transition-[text-decoration-color] duration-150 ease-out hover:decoration-white"
        >
          {T.passCancel}
        </Link>
      ) : (
        <VButton kind={active ? "light" : "ink"} render={<Link href={PORTAL_PASS} />} nativeButton={false} className="w-full">
          {pass.state === "free" ? T.passCta : T.passBuyAgain}
          <ArrowRight className="size-4 rtl:-scale-x-100" aria-hidden="true" />
        </VButton>
      )}
    </section>
  )
}

export type ProgressItem = { id: string; label: string; href: string; done: number; total: number } & ({ part: PartId } | { brand: Brand })

/** Done of total per DTZ part and per other exam you started; each row opens it. */
export function ProgressCard({ items, empty }: { items: ProgressItem[]; empty: { href: string } | null }) {
  return (
    <section aria-labelledby="prog-h" className={PANEL}>
      <h2 id="prog-h" className="mb-2 text-[17px] font-semibold">{T.progressH}</h2>
      {empty ? (
        <p className="mb-3 text-[15px] text-v-muted text-pretty">
          {T.progressEmpty}{" "}
          <Link href={empty.href} className="font-semibold text-v-ink underline-offset-4 hover:underline">{T.progressStart}</Link>
        </p>
      ) : null}
      <ul className="-mx-2 flex flex-col">
        {items.map((it) => (
          <li key={it.id}>
            <Link href={it.href} className="group flex items-center gap-3.5 rounded-[18px] p-2 transition-[background-color,transform] duration-150 ease-out hover:bg-v-ink/4 active:scale-[0.99]">
              {"part" in it ? <PartIcon part={it.part} size="sm" /> : <ExamMark brand={it.brand} size="sm" />}
              <span className="flex min-w-0 flex-1 flex-col gap-2">
                <span className="flex items-baseline justify-between gap-3">
                  <b className="truncate text-[15px] font-semibold">{it.label}</b>
                  <span className="v-num shrink-0 text-[13px] text-v-muted">
                    {T.done(it.done, it.total)}
                    <span className="sr-only"> {T.tests}</span>
                  </span>
                </span>
                <ProgressBar done={it.done} total={it.total} />
              </span>
              <ArrowRight className="size-4 shrink-0 text-v-muted transition-transform duration-150 ease-out group-hover:translate-x-0.5 rtl:-scale-x-100" aria-hidden="true" />
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
