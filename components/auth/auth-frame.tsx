import Link from "next/link"
import { NzLogo } from "@/components/design/variants/nachtzug-logo"
import { AUTH_COPY } from "@/lib/i18n/portal"

/** Logo and the "other page" link: register ⇄ login. Same glass pill as SiteNav, without the menu. */
export function AuthHeader({ switchTo }: { switchTo: { text: string; label: string; href: string } }) {
  return (
    <div className="v-container relative z-20 pt-3 sm:pt-4">
      <header className="nz-chrome flex h-14 items-center gap-3 rounded-full ps-3 pe-2 sm:ps-4">
        <Link href="/" aria-label={AUTH_COPY.back} className="rounded-lg">
          <NzLogo className="text-[18px]" />
        </Link>
        <p className="ml-auto flex items-center gap-1 text-[14px]">
          <span className="text-v-muted max-sm:sr-only">{switchTo.text}</span>
          <Link href={switchTo.href} className="flex h-10 items-center rounded-full px-4 font-semibold transition-[background-color,transform] duration-150 ease-out hover:bg-v-ink/6 active:scale-[0.97]">
            {switchTo.label}
          </Link>
        </p>
      </header>
    </div>
  )
}

export function AuthFooter() {
  return (
    <footer className="v-container relative z-10 mt-auto flex flex-wrap gap-x-5 gap-y-1 pt-12 pb-6 text-[13px] text-v-muted">
      <span>© deutschtest üben</span>
      <Link href="/datenschutz" className="hover:text-v-ink">Datenschutz</Link>
      <Link href="/impressum" className="hover:text-v-ink">Impressum</Link>
    </footer>
  )
}
