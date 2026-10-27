import { Suspense } from "react"
import Link from "next/link"
import { ArrowRight, Euro, LayoutGrid, ListChecks, MessageCircle, UserRound } from "lucide-react"
import { NzLogo } from "@/components/design/variants/nachtzug-logo"
import { ExamMark } from "@/components/design/variants/nachtzug-icons"
import { PortalLink, SideGroup, SignOutButton } from "@/components/portal/portal-client"
import type { SessionUser } from "@/lib/supabase/server"
import type { Brand } from "@/lib/exams"
import { PORTAL_ACCOUNT, PORTAL_CONTACT, PORTAL_HOME, PORTAL_PASS } from "@/lib/auth/redirect"
import { PORTAL_COPY } from "@/lib/i18n/portal"
import { cn } from "@/lib/utils"

const T = PORTAL_COPY

export type NavLevel = { id: string; level: string; label: string; href: string }
export type NavFamily = { id: string; label: string; brand: Brand; href: string; levels: NavLevel[] }

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

/** Name, email (both open the account page) and sign-out. Pass the user from a Suspense-wrapped server component. */
export function AccountRow({ user }: { user: SessionUser | null }) {
  return (
    <div className="flex items-center gap-1">
      <Link href={PORTAL_ACCOUNT} className="flex min-w-0 flex-1 items-center gap-3 rounded-[20px] p-2 transition-colors duration-150 ease-out hover:bg-v-ink/5">
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
      </Link>
      {user ? <SignOutButton /> : null}
    </div>
  )
}

export const SIDE_LINK = "flex min-h-11 items-center gap-3 rounded-full px-3 text-[14.5px] text-v-muted transition-[background-color,color] duration-150 ease-out hover:bg-v-ink/5 hover:text-v-ink"
export const SIDE_ACTIVE = "bg-v-ink font-semibold text-v-bg hover:bg-v-ink hover:text-v-bg"

/** One exam family in the sidebar, lit on its page (and, for the DTZ, its skill pages). */
function SideFamily({ family, grouped }: { family: NavFamily; grouped?: boolean }) {
  const body = (
    <>
      <ExamMark brand={family.brand} size="sm" />
      <span className="truncate">{family.label}</span>
    </>
  )
  const cls = cn(SIDE_LINK, "text-v-ink", grouped && "pe-11")
  return (
    <Suspense fallback={<Link href={family.href} className={cls}>{body}</Link>}>
      <PortalLink href={family.href} className={cls} activeClassName={SIDE_ACTIVE} nested>{body}</PortalLink>
    </Suspense>
  )
}

export const SIDE_SUB = "flex min-h-9 items-center gap-2.5 rounded-full px-3 text-[13.5px] text-v-muted transition-[background-color,color] duration-150 ease-out hover:bg-v-ink/5 hover:text-v-ink"
export const SIDE_SUB_ACTIVE = "bg-v-ink/7 font-semibold text-v-ink"

/** One level under its family: level pill and exam name, lit on the exam and its skill pages. */
function SideLevel({ level }: { level: NavLevel }) {
  const body = (
    <>
      <span className="v-num w-[42px] shrink-0 text-[11.5px] font-semibold text-v-ink">{level.level}</span>
      <span className="truncate">{level.label}</span>
    </>
  )
  return (
    <Suspense fallback={<Link href={level.href} className={SIDE_SUB}>{body}</Link>}>
      <PortalLink href={level.href} className={SIDE_SUB} activeClassName={SIDE_SUB_ACTIVE} nested>{body}</PortalLink>
    </Suspense>
  )
}

/** The floating glass sidebar from lg up: overview, the exam families with their levels, the plan card and the account row. */
/** The plan card at the foot of the sidebar: "Gratis" with the way to the pass, or the active pass with its end date. */
export function SidePlan({ until }: { until: string | null }) {
  return (
    <div className="flex flex-col gap-1 rounded-[20px] bg-v-soft/70 p-4">
      <span className="text-[12.5px] text-v-muted">{T.plan.label}</span>
      <b className="text-[17px] font-semibold">{until ? T.plan.active : T.plan.name}</b>
      {until ? <span className="text-[14px] text-v-muted">{T.plan.until(until)}</span> : null}
      <Link href={until ? PORTAL_ACCOUNT : PORTAL_PASS} className="group mt-1 flex w-fit items-center gap-1.5 text-[14px] font-semibold">
        {until ? T.plan.manage : T.plan.cta}
        <ArrowRight className="size-4 transition-transform duration-150 ease-out group-hover:translate-x-0.5 rtl:-scale-x-100" aria-hidden="true" />
      </Link>
    </div>
  )
}

export function PortalSidebar({ groups, account, plan, className }: { groups: NavFamily[]; account: React.ReactNode; plan?: React.ReactNode; className?: string }) {
  const overview = (
    <>
      <LayoutGrid className="size-[18px]" strokeWidth={2} aria-hidden="true" />
      {T.nav.overview}
    </>
  )
  const contact = (
    <>
      <MessageCircle className="size-[18px]" strokeWidth={2} aria-hidden="true" />
      {T.nav.contact}
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
        <div className="-mx-1 mt-2 flex min-h-0 flex-col gap-1 overflow-y-auto px-1 pb-1">
          <h2 className="px-3 pt-2 pb-1 font-[family-name:var(--v-font-mono)] text-[11px] tracking-[0.08em] text-v-muted uppercase">{T.nav.exams}</h2>
          <ul className="flex flex-col gap-1">
            {groups.map((f) => (
              <li key={f.id} className="flex flex-col">
                {f.levels.length > 1 ? (
                  <Suspense fallback={<SideFamily family={f} grouped />}>
                    <SideGroup href={f.href} levelHrefs={f.levels.map((l) => l.href)} label={T.nav.levels(f.label)} head={<SideFamily family={f} grouped />}>
                      <ul className="ms-[30px] mt-0.5 flex flex-col border-s border-v-line ps-1.5">
                        {f.levels.map((l) => (
                          <li key={l.id}>
                            <SideLevel level={l} />
                          </li>
                        ))}
                      </ul>
                    </SideGroup>
                  </Suspense>
                ) : (
                  <SideFamily family={f} />
                )}
              </li>
            ))}
          </ul>
        </div>
      </nav>
      <div className="-mb-3 flex flex-col">
        <Suspense fallback={<Link href={PORTAL_CONTACT} className={SIDE_LINK}>{contact}</Link>}>
          <PortalLink href={PORTAL_CONTACT} className={SIDE_LINK} activeClassName={SIDE_ACTIVE}>{contact}</PortalLink>
        </Suspense>
      </div>
      {plan ?? <SidePlan until={null} />}
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
        <Link href={PORTAL_ACCOUNT} aria-label={T.nav.account} className="grid size-11 place-items-center rounded-full transition-transform duration-150 ease-out active:scale-[0.95]">
          {avatar}
        </Link>
      </header>
    </div>
  )
}

const TAB = "flex min-w-0 flex-1 flex-col items-center justify-center gap-1 rounded-full py-1.5 text-[11.5px] font-medium text-v-muted transition-[background-color,color,transform] duration-150 ease-out active:scale-[0.95]"
const TAB_ACTIVE = "bg-v-ink/7 font-semibold text-v-ink"

/** Phones and tablets: the floating tab bar at the bottom. */
export function PortalTabBar({ className }: { className?: string }) {
  const tabs = [
    { href: `${PORTAL_HOME}#pruefungen`, label: T.nav.exams, icon: ListChecks },
    { href: PORTAL_PASS, label: T.nav.pricing, icon: Euro },
    { href: PORTAL_ACCOUNT, label: T.nav.account, icon: UserRound },
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
          <PortalLink href={PORTAL_HOME} className={TAB} activeClassName={TAB_ACTIVE} nested except={[PORTAL_PASS, PORTAL_ACCOUNT, PORTAL_CONTACT]}>{overview}</PortalLink>
        </Suspense>
        {tabs.map(({ href, label, icon: Icon }) => {
          const body = (
            <>
              <Icon className="size-5" strokeWidth={2} aria-hidden="true" />
              {label}
            </>
          )
          return (
            <Suspense key={href} fallback={<Link href={href} className={TAB}>{body}</Link>}>
              <PortalLink href={href} className={TAB} activeClassName={TAB_ACTIVE}>{body}</PortalLink>
            </Suspense>
          )
        })}
      </div>
    </nav>
  )
}
