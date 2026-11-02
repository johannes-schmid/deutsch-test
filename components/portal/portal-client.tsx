"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Dialog } from "@base-ui/react/dialog"
import { ChevronDown, ListChecks, Loader2, LogOut, MessageCircle, X } from "lucide-react"
import { PORTAL_ACCOUNT, PORTAL_CONTACT, PORTAL_HOME, PORTAL_PASS } from "@/lib/auth/redirect"
import { createClient } from "@/lib/supabase/client"
import { PORTAL_COPY } from "@/lib/i18n/portal"
import { cn } from "@/lib/utils"

const T = PORTAL_COPY.account
const N = PORTAL_COPY.nav

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

/**
 * The tab bar's "Teile" tab: opens a bottom sheet with the four parts of the learner's exam (`children`, rendered on the
 * server like the sidebar's list) and Kontakt. Lit on every Modelltest page below /dashboard and while the sheet is open.
 */
export function PartsTab({ className, activeClassName, children }: { className: string; activeClassName: string; children: React.ReactNode }) {
  const path = usePathname()
  const [open, setOpen] = useState(false)
  const anchor = useRef<HTMLSpanElement>(null)
  const [frame, setFrame] = useState<HTMLElement | null>(null)
  useEffect(() => setFrame(anchor.current?.closest<HTMLElement>(".v-frame") ?? null), [])
  const onPart = path.startsWith(`${PORTAL_HOME}/`) && ![PORTAL_PASS, PORTAL_ACCOUNT, PORTAL_CONTACT].some((e) => under(path, e))
  const closeOnLink = (e: React.MouseEvent) => {
    if ((e.target as Element).closest("a")) setOpen(false)
  }
  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <span ref={anchor} hidden />
      <Dialog.Trigger aria-current={onPart ? "true" : undefined} className={cn(className, (onPart || open) && activeClassName)}>
        <ListChecks className="size-5" strokeWidth={2} aria-hidden="true" />
        {N.parts}
      </Dialog.Trigger>
      <Dialog.Portal container={frame}>
        <Dialog.Backdrop className="fixed inset-0 z-50 bg-[rgba(8,10,30,0.4)] backdrop-blur-[2px] transition-opacity duration-300 ease-(--ease-out-strong) data-ending-style:opacity-0 data-starting-style:opacity-0 lg:hidden" />
        <Dialog.Popup
          aria-labelledby="parts-sheet-h"
          className="fixed inset-x-0 bottom-0 z-50 mx-auto max-h-[85dvh] w-full max-w-[520px] overflow-y-auto rounded-t-[28px] bg-v-bg text-v-ink shadow-[0_-12px_40px_rgba(8,10,30,0.18)] outline-none transition-[translate,opacity] duration-300 ease-(--ease-out-strong) data-ending-style:translate-y-full data-starting-style:translate-y-full motion-reduce:transition-opacity motion-reduce:data-ending-style:translate-y-0 motion-reduce:data-ending-style:opacity-0 motion-reduce:data-starting-style:translate-y-0 motion-reduce:data-starting-style:opacity-0 lg:hidden"
        >
          <div className="flex flex-col gap-3 px-3 pt-2.5 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
            <span aria-hidden="true" className="mx-auto h-1 w-10 shrink-0 rounded-full bg-v-ink/15" />
            <div onClick={closeOnLink} className="relative flex flex-col gap-1">
              {children}
              <Dialog.Close aria-label={N.close} className="absolute end-0 top-0 grid size-11 place-items-center rounded-full text-v-muted transition-[background-color,color,transform] duration-150 ease-out hover:bg-v-ink/6 hover:text-v-ink active:scale-[0.95]">
                <X className="size-5" aria-hidden="true" />
              </Dialog.Close>
            </div>
            <div onClick={closeOnLink} className="border-t border-v-line pt-2">
              <Link href={PORTAL_CONTACT} className="flex min-h-12 items-center gap-3 rounded-full px-3 text-[15px] text-v-muted transition-[background-color,color] duration-150 ease-out hover:bg-v-ink/5 hover:text-v-ink">
                <MessageCircle className="size-[18px]" strokeWidth={2} aria-hidden="true" />
                {N.contact}
              </Link>
            </div>
          </div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
