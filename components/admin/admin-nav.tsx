"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

const LINKS = [
  { href: "/admin", label: "Übersicht" },
  { href: "/admin/kurztest", label: "Kurztest" },
]

/** Reads the pathname, so it renders inside <Suspense> (fallback: AdminNavLinks with no path). */
export function AdminNav() {
  return <AdminNavLinks path={usePathname()} />
}

export function AdminNavLinks({ path }: { path?: string }) {
  return (
    <nav aria-label="Admin" className="flex gap-1">
      {LINKS.map((l) => {
        const active = path === l.href
        return (
          <Link
            key={l.href}
            href={l.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "rounded-md px-3 py-1.5 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
              active ? "bg-foreground text-background" : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            {l.label}
          </Link>
        )
      })}
    </nav>
  )
}
