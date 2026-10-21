"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

type NavLink = { label: string; href: string }

const LINK = "flex h-9 items-center rounded-full px-3.5 transition-[background-color,color] duration-150 ease-out hover:bg-v-ink/5 hover:text-v-ink"

/** The header links with the current section lit. Reads the pathname, so it renders inside <Suspense> (see SiteNav). */
export function ActiveNavLinks({ links }: { links: NavLink[] }) {
  const path = usePathname()
  return links.map((l) => {
    const active = !l.href.includes("#") && (path === l.href || path.startsWith(`${l.href}/`))
    return (
      <Link key={l.href} href={l.href} aria-current={active ? "page" : undefined} className={cn(LINK, active ? "bg-v-ink/6 text-v-ink" : "text-v-muted")}>
        {l.label}
      </Link>
    )
  })
}

export function NavLinksFallback({ links }: { links: NavLink[] }) {
  return links.map((l) => (
    <Link key={l.href} href={l.href} className={cn(LINK, "text-v-muted")}>
      {l.label}
    </Link>
  ))
}
