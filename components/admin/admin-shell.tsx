import { Suspense } from "react"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { NzLogo } from "@/components/design/variants/nachtzug-logo"
import { AdminBar, AdminDrawer, AdminTag } from "@/components/admin/admin-drawer"
import { PortalLink, SideGroup, SignOutButton } from "@/components/portal/portal-client"
import { SIDE_ACTIVE, SIDE_LINK, SIDE_SUB, SIDE_SUB_ACTIVE } from "@/components/portal/portal-shell"
import { ADMIN_HOME, ADMIN_NAV, type AdminNavChild, type AdminNavItem } from "@/lib/admin/nav"
import { cn } from "@/lib/utils"

function NavLink({ item, grouped }: { item: AdminNavItem; grouped?: boolean }) {
  const Icon = item.icon
  const body = (
    <>
      <Icon className="size-[18px] shrink-0" strokeWidth={2} aria-hidden="true" />
      <span className="truncate">{item.label}</span>
    </>
  )
  const cls = cn(SIDE_LINK, grouped && "pe-11")
  return (
    <Suspense fallback={<Link href={item.href} className={cls}>{body}</Link>}>
      <PortalLink href={item.href} className={cls} activeClassName={SIDE_ACTIVE} nested={item.nested}>{body}</PortalLink>
    </Suspense>
  )
}

function NavChild({ child }: { child: AdminNavChild }) {
  const body = (
    <>
      <span className="v-num w-[42px] shrink-0 text-[11.5px] font-semibold text-v-ink">{child.level}</span>
      <span className="truncate">{child.label}</span>
    </>
  )
  return (
    <Suspense fallback={<Link href={child.href} className={SIDE_SUB}>{body}</Link>}>
      <PortalLink href={child.href} className={SIDE_SUB} activeClassName={SIDE_SUB_ACTIVE} nested>{body}</PortalLink>
    </Suspense>
  )
}

function NavItem({ item }: { item: AdminNavItem }) {
  if (!item.children?.length) return <NavLink item={item} />
  return (
    <Suspense fallback={<NavLink item={item} grouped />}>
      <SideGroup href={item.href} levelHrefs={item.children.map((c) => c.href)} label={`${item.label} auf- oder zuklappen`} head={<NavLink item={item} grouped />}>
        <ul className="ms-[30px] mt-0.5 flex flex-col border-s border-v-line ps-1.5">
          {item.children.map((c) => (
            <li key={c.href}>
              <NavChild child={c} />
            </li>
          ))}
        </ul>
      </SideGroup>
    </Suspense>
  )
}

/** The sections and their links; the sidebar and the drawer both render this. */
function AdminNavList() {
  return (
    <nav aria-label="Admin" className="-mx-1 flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto px-1 pb-1">
      {ADMIN_NAV.map((s) => (
        <div key={s.title ?? "top"} className="flex flex-col gap-1">
          {s.title ? <h2 className="px-3 pb-1 font-[family-name:var(--v-font-mono)] text-[11px] tracking-[0.08em] text-v-muted uppercase">{s.title}</h2> : null}
          <ul className="flex flex-col gap-1">
            {s.items.map((item) => (
              <li key={item.href} className="flex flex-col">
                <NavItem item={item} />
              </li>
            ))}
          </ul>
        </div>
      ))}
    </nav>
  )
}

/** Email, "Website ansehen" and sign-out. `email` comes from a Suspense-wrapped server component. */
export function AdminAccount({ email }: { email: string | null }) {
  return (
    <div className="flex flex-col gap-1 border-t border-v-line pt-2">
      <a href="/" target="_blank" rel="noreferrer" className={SIDE_LINK}>
        <ArrowUpRight className="size-[18px] shrink-0" strokeWidth={2} aria-hidden="true" />
        Website ansehen
      </a>
      <div className="flex items-center gap-1 ps-3">
        <span className="min-w-0 flex-1 truncate text-[13px] text-v-muted">{email ?? <span className="inline-block h-3 w-36 rounded-full bg-v-soft align-middle" />}</span>
        {email ? <SignOutButton /> : <span className="size-11" />}
      </div>
    </div>
  )
}

/** lg and up: the floating glass sidebar, the same chrome as the portal. */
export function AdminSidebar({ account }: { account: React.ReactNode }) {
  return (
    <aside className="nz-chrome sticky top-3 z-20 m-3 me-0 hidden h-[calc(100dvh-24px)] w-[264px] shrink-0 flex-col gap-5 rounded-[28px] p-3 lg:flex">
      <Link href={ADMIN_HOME} className="flex w-fit items-center gap-2 rounded-lg px-2 pt-2">
        <NzLogo className="text-[17px]" />
        <AdminTag />
      </Link>
      <AdminNavList />
      {account}
    </aside>
  )
}

/** Below lg: the top bar and its drawer. */
export function AdminMobileNav({ account }: { account: React.ReactNode }) {
  return (
    <Suspense fallback={<AdminBar />}>
      <AdminDrawer>
        <AdminNavList />
        {account}
      </AdminDrawer>
    </Suspense>
  )
}
