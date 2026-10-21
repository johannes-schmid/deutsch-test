import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { NzLogo } from "@/components/design/variants/nachtzug-logo"
import { AUTH_COPY } from "@/lib/i18n/portal"

/** Logo and the "other page" link: register ⇄ login. Plain on the field, as on inburgeringoefenen.nl, so the card is the only surface. */
export function AuthHeader({ switchTo }: { switchTo: { text?: string; label: string; href: string } }) {
  return (
    <header className="v-container relative z-20 flex items-center justify-between gap-4 py-5">
      <Link href="/" aria-label={AUTH_COPY.back} className="rounded-lg">
        <NzLogo className="text-[18px]" />
      </Link>
      <Link
        href={switchTo.href}
        className="group flex h-10 items-center gap-1.5 rounded-full px-3 text-[14px] font-semibold whitespace-nowrap transition-[background-color,transform] duration-150 ease-out hover:bg-v-ink/6 active:scale-[0.97]"
      >
        {switchTo.text ? <span className="font-normal text-v-muted max-sm:sr-only">{switchTo.text}</span> : null}
        {switchTo.label}
        <ArrowRight className="size-4 transition-transform duration-150 ease-out group-hover:translate-x-0.5" aria-hidden="true" />
      </Link>
    </header>
  )
}

export function AuthFooter() {
  return (
    <footer className="v-container relative z-10 flex flex-wrap justify-center gap-x-5 gap-y-1 pt-10 pb-7 text-[13px] text-v-muted">
      <span>© deutschtest üben</span>
      <Link href="/datenschutz" className="hover:text-v-ink">Datenschutz</Link>
      <Link href="/impressum" className="hover:text-v-ink">Impressum</Link>
    </footer>
  )
}
