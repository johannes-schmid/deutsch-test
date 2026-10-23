"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { ChevronDown, Loader2, LogOut } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { PORTAL_COPY } from "@/lib/i18n/portal"
import { cn } from "@/lib/utils"

const T = PORTAL_COPY.account

const under = (path: string, href: string) => path === href || path.startsWith(`${href}/`)

/** A sidebar family with its levels: unfolded while you are on the family or one of its levels, folded elsewhere. The chevron toggles it until the next navigation. */
export function SideGroup({ href, levelHrefs, label, head, children }: { href: string; levelHrefs: string[]; label: string; head: React.ReactNode; children: React.ReactNode }) {
  const path = usePathname()
  const auto = under(path, href) || levelHrefs.some((h) => under(path, h))
  const [toggled, setToggled] = useState<{ path: string; open: boolean } | null>(null)
  const open = toggled?.path === path ? toggled.open : auto
  const lit = under(path, href)
  return (
    <>
      <div className="relative">
        {head}
        <button
          type="button"
          onClick={() => setToggled({ path, open: !open })}
          aria-expanded={open}
          aria-label={label}
          className={cn(
            "absolute end-1 top-1/2 grid size-9 -translate-y-1/2 place-items-center rounded-full transition-[background-color,color] duration-150 ease-out",
            lit ? "text-v-bg/75 hover:bg-v-bg/15 hover:text-v-bg" : "text-v-muted hover:bg-v-ink/6 hover:text-v-ink",
          )}
        >
          <ChevronDown className={cn("size-4 transition-transform duration-200 ease-[var(--ease-out-strong)] motion-reduce:transition-none", !open && "-rotate-90 rtl:rotate-90")} aria-hidden="true" />
        </button>
      </div>
      <div
        data-open={open}
        inert={!open}
        className="grid grid-rows-[0fr] opacity-0 transition-[grid-template-rows,opacity] duration-200 ease-[var(--ease-out-strong)] data-[open=true]:grid-rows-[1fr] data-[open=true]:opacity-100 motion-reduce:transition-[opacity]"
      >
        <div className="min-h-0 overflow-hidden">{children}</div>
      </div>
    </>
  )
}

/** A sidebar or tab-bar link lit on its own route (`nested`: and on the routes below it, except those in `except`). Reads the pathname, so it renders inside <Suspense>. */
export function PortalLink({ href, className, activeClassName, nested, except, children }: { href: string; className: string; activeClassName: string; nested?: boolean; except?: string[]; children: React.ReactNode }) {
  const path = usePathname()
  const active = path === href || (!!nested && path.startsWith(`${href}/`) && !except?.some((e) => under(path, e)))
  return (
    <Link href={href} aria-current={path === href ? "page" : active ? "true" : undefined} className={cn(className, active && activeClassName)}>
      {children}
    </Link>
  )
}

export function SignOutButton({ variant = "icon" }: { variant?: "icon" | "full" }) {
  const router = useRouter()
  const [pending, setPending] = useState(false)
  async function signOut() {
    setPending(true)
    await createClient().auth.signOut()
    router.replace("/")
    router.refresh()
  }
  const Icon = pending ? Loader2 : LogOut
  if (variant === "full") {
    return (
      <button type="button" onClick={signOut} disabled={pending} className="flex h-11 items-center justify-center gap-2 rounded-full bg-v-soft px-5 text-[15px] font-semibold transition-[background-color,transform] duration-150 ease-out hover:bg-v-ink/10 active:scale-[0.97] disabled:opacity-70">
        <Icon className={cn("size-4 rtl:-scale-x-100", pending && "animate-spin")} aria-hidden="true" />
        {pending ? T.signingOut : T.signOut}
      </button>
    )
  }
  return (
    <button type="button" onClick={signOut} disabled={pending} aria-label={T.signOut} title={T.signOut} className="grid size-11 shrink-0 place-items-center rounded-full text-v-muted transition-[background-color,color,transform] duration-150 ease-out hover:bg-v-ink/6 hover:text-v-ink active:scale-[0.95] disabled:opacity-70">
      <Icon className={cn("size-[18px] rtl:-scale-x-100", pending && "animate-spin")} aria-hidden="true" />
    </button>
  )
}
