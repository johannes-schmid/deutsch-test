import Link from "next/link"
import { Globe } from "lucide-react"
import { VButton } from "@/components/design/kit"
import { NzLogo } from "@/components/design/variants/nachtzug-logo"
import { LANDING, type Locale } from "@/lib/i18n/landing"

const HOME: Record<Locale, string> = { de: "/", en: "/en" }

/** The site's top bar, shared by the landing pages and every inner page. `switchLang` hides the language link on pages that exist in one language only. */
export function SiteNav({ locale, switchLang = true }: { locale: Locale; switchLang?: boolean }) {
  const t = LANDING[locale]
  return (
    <nav className="v-container relative z-10 flex items-center gap-4 py-5 text-[14px] sm:gap-6">
      <Link href={HOME[locale]} className="rounded-lg">
        <NzLogo className="text-[19px]" />
      </Link>
      <div className="hidden items-center gap-6 text-v-muted md:flex">
        {t.nav.links.map((l) => (
          <Link key={l.href} href={l.href} className="rounded transition-colors hover:text-v-ink">{l.label}</Link>
        ))}
      </div>
      <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
        {switchLang ? (
          <Link
            href={t.nav.switchHref}
            hrefLang={locale === "en" ? "de" : "en"}
            aria-label={t.nav.switchLabel}
            className="flex h-9 items-center gap-1.5 rounded-full px-2.5 text-[13.5px] font-semibold text-v-muted transition-colors hover:bg-v-ink/6 hover:text-v-ink"
          >
            <Globe className="size-4" aria-hidden="true" />
            <span className="max-sm:sr-only">{t.nav.switchShort}</span>
          </Link>
        ) : null}
        <VButton size="sm" render={<Link href="/gratis-test" />} nativeButton={false}>{t.nav.start}</VButton>
      </div>
    </nav>
  )
}

/** Drifting light behind the top of a page, as on the landing hero. Place inside a `relative overflow-hidden` parent. */
export function SiteGlow() {
  return (
    <>
      <span className="nacht-orb top-[-160px] right-[8%] size-[520px] bg-(--p-glow)" />
      <span className="nacht-orb top-[80px] right-[-140px] size-[460px] bg-[#5E86FF] [animation-delay:-7s]" />
      <span className="nacht-orb top-[240px] right-[30%] size-[300px] bg-[#E58FB5] [animation-delay:-13s]" />
      <div className="v-noise absolute inset-0" aria-hidden="true" />
    </>
  )
}

export function SiteFooter({ locale }: { locale: Locale }) {
  const t = LANDING[locale]
  const f = t.footer
  const groups = [
    { title: f.groups.exam, links: [{ label: "DTZ", href: "/dtz" }, { label: t.nav.links[1].label, href: "/gratis-test" }, { label: "A2 → B1", href: "/a2-zu-b1" }, { label: "B1 für die Einbürgerung", href: "/b1-einbuergerung" }, { label: t.nav.links[2].label, href: "/preise" }] },
    { title: f.groups.info, links: [{ label: f.about, href: "/ueber-uns" }, { label: f.contact, href: "/kontakt" }, { label: f.imprint, href: "/impressum" }, { label: f.privacy, href: "/datenschutz" }] },
  ]
  return (
    <footer className="border-t border-v-line">
      <div className="v-container grid gap-10 py-12 text-[14px] text-v-muted sm:grid-cols-[1.4fr_1fr_1fr]">
        <div className="flex flex-col items-start gap-3">
          <Link href={HOME[locale]} className="rounded-lg">
            <NzLogo className="text-[15px]" />
          </Link>
          <p className="max-w-[34ch] text-[13px] leading-relaxed">{f.disclaimer}</p>
        </div>
        {groups.map((g) => (
          <nav key={g.title} aria-label={g.title} className="flex flex-col gap-2.5">
            <span className="text-[13px] font-semibold text-v-ink">{g.title}</span>
            {g.links.map((l) => (
              <Link key={l.href} href={l.href} className="w-fit rounded transition-colors hover:text-v-ink">{l.label}</Link>
            ))}
          </nav>
        ))}
      </div>
    </footer>
  )
}
