"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Loader2, LogOut } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { PORTAL_COPY } from "@/lib/i18n/portal"
import { cn } from "@/lib/utils"

const T = PORTAL_COPY.account

/** A sidebar or tab-bar link lit on its own route (`nested`: and on the routes below it). Reads the pathname, so it renders inside <Suspense>. */
export function PortalLink({ href, className, activeClassName, nested, children }: { href: string; className: string; activeClassName: string; nested?: boolean; children: React.ReactNode }) {
  const path = usePathname()
  const active = path === href || (!!nested && path.startsWith(`${href}/`))
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
