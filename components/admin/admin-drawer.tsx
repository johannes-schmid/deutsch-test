"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X } from "lucide-react"
import { NzLogo } from "@/components/design/variants/nachtzug-logo"
import { ADMIN_HOME } from "@/lib/admin/nav"
import { cn } from "@/lib/utils"

const ICON_BTN = "grid size-11 shrink-0 place-items-center rounded-full text-v-ink transition-[background-color,transform] duration-150 ease-out hover:bg-v-ink/6 active:scale-[0.95] disabled:opacity-60"

export function AdminTag() {
  return <span className="v-num rounded-full bg-v-ink px-2 py-0.5 text-[10.5px] tracking-[0.08em] text-v-bg uppercase">Admin</span>
}

/** Phones and tablets: the glass bar on top. Without `onMenu` (the Suspense fallback) the menu button waits. */
export function AdminBar({ onMenu, buttonRef, open }: { onMenu?: () => void; buttonRef?: React.Ref<HTMLButtonElement>; open?: boolean }) {
  return (
    <div className="sticky top-2 z-30 px-4 pt-2 sm:px-6 lg:hidden">
      <header className="nz-chrome flex h-14 items-center gap-1 rounded-full ps-1.5 pe-4">
        <button ref={buttonRef} type="button" onClick={onMenu} disabled={!onMenu} aria-label="Menü öffnen" aria-expanded={open ?? false} aria-controls="admin-drawer" className={ICON_BTN}>
          <Menu className="size-5" aria-hidden="true" />
        </button>
        <Link href={ADMIN_HOME} className="flex items-center gap-2 rounded-lg">
          <NzLogo className="text-[16px]" />
        </Link>
        <span className="ms-auto">
          <AdminTag />
        </span>
      </header>
    </div>
  )
}

/** The mobile drawer: the same nav as the sidebar. It closes on navigation, Escape and a tap on the scrim. */
export function AdminDrawer({ children }: { children: React.ReactNode }) {
  const path = usePathname()
  const [openOn, setOpenOn] = useState<string | null>(null)
  const open = openOn === path
  const menuRef = useRef<HTMLButtonElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const wasOpen = useRef(false)

  useEffect(() => {
    if (open) {
      closeRef.current?.focus()
      const html = document.documentElement
      const prev = html.style.overflow
      html.style.overflow = "hidden"
      const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpenOn(null)
      window.addEventListener("keydown", onKey)
      wasOpen.current = true
      return () => {
        html.style.overflow = prev
        window.removeEventListener("keydown", onKey)
      }
    }
    if (wasOpen.current) {
      wasOpen.current = false
      menuRef.current?.focus({ preventScroll: true })
    }
  }, [open])

  return (
    <>
      <AdminBar onMenu={() => setOpenOn(path)} buttonRef={menuRef} open={open} />
      <div
        aria-hidden="true"
        onClick={() => setOpenOn(null)}
        className={cn("fixed inset-0 z-40 bg-v-ink/30 transition-opacity duration-200 ease-out lg:hidden", open ? "opacity-100" : "pointer-events-none opacity-0")}
      />
      <aside
        id="admin-drawer"
        aria-label="Admin-Menü"
        inert={!open}
        className={cn(
          "fixed inset-y-2 start-2 z-50 flex w-[300px] max-w-[calc(100vw-48px)] flex-col gap-4 rounded-[28px] bg-v-surface p-3 shadow-[0_40px_80px_-30px_rgba(14,19,34,0.5)] transition-[transform,visibility] duration-[260ms] ease-[cubic-bezier(0.32,0.72,0,1)] motion-reduce:transition-[visibility] lg:hidden",
          open ? "visible translate-x-0" : "invisible -translate-x-[calc(100%+16px)]",
        )}
      >
        <div className="flex items-center justify-between gap-2 ps-2 pt-1">
          <span className="flex items-center gap-2">
            <NzLogo className="text-[16px]" />
            <AdminTag />
          </span>
          <button ref={closeRef} type="button" onClick={() => setOpenOn(null)} aria-label="Menü schließen" className={ICON_BTN}>
            <X className="size-5" aria-hidden="true" />
          </button>
        </div>
        {children}
      </aside>
    </>
  )
}
