import { Suspense } from "react"
import Link from "next/link"
import { ArrowRight, Euro, LayoutGrid, ListChecks, UserRound } from "lucide-react"
import { NzLogo } from "@/components/design/variants/nachtzug-logo"
import { ExamMark } from "@/components/design/variants/nachtzug-icons"
import { PortalLink, SignOutButton } from "@/components/portal/portal-client"
import type { SessionUser } from "@/lib/supabase/server"
import type { Brand } from "@/lib/exams"
import { PORTAL_HOME } from "@/lib/auth/redirect"
import { PORTAL_COPY } from "@/lib/i18n/portal"
import { cn } from "@/lib/utils"

const T = PORTAL_COPY

export type NavExam = { id: string; label: string; brand: Brand; href: string | null }

const initials = (u: SessionUser) => (u.name ?? u.email).split(/[\s@.]+/).filter(Boolean).slice(0, 2).map((p) => p[0]!.toUpperCase()).join("")

/** Google profile picture, or initials on a soft circle. */
export function Avatar({ user, size = 40 }: { user: SessionUser | null; size?: number }) {
  const box = "grid shrink-0 place-items-center overflow-hidden rounded-full bg-v-soft text-v-ink"
  if (!user) return <span className={box} style={{ width: size, height: size }}><UserRound className="size-[45%] text-v-muted" aria-hidden="true" /></span>
  return (
    <span className={box} style={{ width: size, height: size }}>
      {user.avatar ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={user.avatar} alt="" width={size} height={size} referrerPolicy="no-referrer" className="size-full object-cover" />
      ) : (
        <b className="text-[13px] font-semibold">{initials(user)}</b>
      )}
    </span>
  )
}

/** Name, email and sign-out. Pass the user from a Suspense-wrapped server component. */
export function AccountRow({ user }: { user: SessionUser | null }) {
  return (
    <div className="flex items-center gap-3 rounded-[20px] p-2">
      <Avatar user={user} />
      <span className="flex min-w-0 flex-1 flex-col leading-tight">
        {user ? (
          <>
            <b className="truncate text-[14px] font-semibold">{user.name ?? user.email}</b>
            {user.name ? <span className="truncate text-[12.5px] text-v-muted">{user.email}</span> : null}
          </>
        ) : (
          <>
            <span className="h-3.5 w-24 rounded-full bg-v-soft" />
            <span className="mt-1.5 h-3 w-32 rounded-full bg-v-soft" />
          </>
        )}
      </span>
      {user ? <SignOutButton /> : null}
    </div>
  )
}

const SIDE_LINK = "flex min-h-11 items-center gap-3 rounded-full px-3 text-[14.5px] text-v-muted transition-[background-color,color] duration-150 ease-out hover:bg-v-ink/5 hover:text-v-ink"
const SIDE_ACTIVE = "bg-v-ink font-semibold text-v-bg hover:bg-v-ink hover:text-v-bg"

/** The floating glass sidebar from lg up: overview, the exams, the plan card and the account row. */
export function PortalSidebar({ exams, account, className }: { exams: NavExam[]; account: React.ReactNode; className?: string }) {
  const overview = (
    <>
      <LayoutGrid className="size-[18px]" strokeWidth={2} aria-hidden="true" />
      {T.nav.overview}
    </>
  )
  return (
    <aside className={cn("nz-chrome sticky top-3 z-20 m-3 me-0 hidden h-[calc(100dvh-24px)] w-[280px] shrink-0 flex-col gap-5 rounded-[28px] p-3 lg:flex", className)}>
      <Link href="/" className="w-fit rounded-lg px-2 pt-2">
        <NzLogo className="text-[18px]" />
      </Link>
      <nav aria-label={T.nav.overview} className="flex min-h-0 flex-1 flex-col gap-1">
        <Suspense fallback={<Link href={PORTAL_HOME} className={SIDE_LINK}>{overview}</Link>}>
          <PortalLink href={PORTAL_HOME} className={SIDE_LINK} activeClassName={SIDE_ACTIVE}>{overview}</PortalLink>
        </Suspense>
        <span className="px-3 pt-4 pb-1 text-[12.5px] font-semibold text-v-muted">{T.nav.exams}</span>
        <ul className="-mx-1 flex min-h-0 flex-col gap-0.5 overflow-y-auto px-1">
          {exams.map((e) => (
            <li key={e.id}>
              {e.href ? (
                <Link href={e.href} className={cn(SIDE_LINK, "text-v-ink")}>
                  <ExamMark brand={e.brand} size="sm" />
                  <span className="truncate">{e.label}</span>
                </Link>
              ) : (
                <span className={cn(SIDE_LINK, "pointer-events-none opacity-55")}>
                  <ExamMark brand={e.brand} size="sm" />
                  <span className="truncate">{e.label}</span>
                  <span className="ml-auto shrink-0 text-[11.5px]">{T.soon}</span>
                </span>
              )}
            </li>
          ))}
        </ul>
      </nav>
      <div className="flex flex-col gap-1 rounded-[20px] bg-v-soft/70 p-4">
        <span className="text-[12.5px] text-v-muted">{T.plan.label}</span>
        <b className="text-[17px] font-semibold">{T.plan.name}</b>
        <Link href="/preise" className="group mt-1 flex w-fit items-center gap-1.5 text-[14px] font-semibold">
          {T.plan.cta}
          <ArrowRight className="size-4 transition-transform duration-150 ease-out group-hover:translate-x-0.5 rtl:-scale-x-100" aria-hidden="true" />
        </Link>
      </div>
      <div className="border-t border-v-line pt-2">{account}</div>
    </aside>
  )
}

/** Phones and tablets: a glass header pill (logo + account) on top. */
export function PortalMobileHeader({ avatar }: { avatar: React.ReactNode }) {
  return (
    <div className="sticky top-2 z-30 px-4 pt-2 sm:px-6 lg:hidden">
      <header className="nz-chrome flex h-14 items-center justify-between rounded-full ps-3 pe-1.5">
        <Link href="/" className="rounded-lg">
          <NzLogo className="text-[17px]" />
        </Link>
        <a href="#konto" aria-label={T.nav.account} className="grid size-11 place-items-center rounded-full transition-transform duration-150 ease-out active:scale-[0.95]">
          {avatar}
        </a>
      </header>
    </div>
  )
}

const TAB = "flex min-w-0 flex-1 flex-col items-center justify-center gap-1 rounded-full py-1.5 text-[11.5px] font-medium text-v-muted transition-[background-color,color,transform] duration-150 ease-out active:scale-[0.95]"
const TAB_ACTIVE = "bg-v-ink/7 font-semibold text-v-ink"

/** Phones and tablets: the floating tab bar at the bottom. */
export function PortalTabBar({ className }: { className?: string }) {
  const tabs = [
    { href: "#pruefungen", label: T.nav.exams, icon: ListChecks },
    { href: "/preise", label: T.nav.pricing, icon: Euro },
    { href: "#konto", label: T.nav.account, icon: UserRound },
  ]
  const overview = (
    <>
      <LayoutGrid className="size-5" strokeWidth={2} aria-hidden="true" />
      {T.nav.overview}
    </>
  )
  return (
    <nav aria-label={T.nav.overview} className={cn("fixed inset-x-0 bottom-[max(10px,env(safe-area-inset-bottom))] z-30 mx-auto w-[calc(100%-24px)] max-w-[440px] lg:hidden", className)}>
      <div className="nz-chrome flex h-16 items-stretch gap-1 rounded-full p-1.5">
        <Suspense fallback={<Link href={PORTAL_HOME} className={TAB}>{overview}</Link>}>
          <PortalLink href={PORTAL_HOME} className={TAB} activeClassName={TAB_ACTIVE}>{overview}</PortalLink>
        </Suspense>
        {tabs.map(({ href, label, icon: Icon }) =>
          href.startsWith("#") ? (
            <a key={href} href={href} className={TAB}>
              <Icon className="size-5" strokeWidth={2} aria-hidden="true" />
              {label}
            </a>
          ) : (
            <Link key={href} href={href} className={TAB}>
              <Icon className="size-5" strokeWidth={2} aria-hidden="true" />
              {label}
            </Link>
          )
        )}
      </div>
    </nav>
  )
}
