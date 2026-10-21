import { Suspense } from "react"
import Link from "next/link"
import { Globe } from "lucide-react"
import { VButton } from "@/components/design/kit"
import { Consent, ConsentSettingsButton } from "@/components/design/consent"
import { NzLogo } from "@/components/design/variants/nachtzug-logo"
import { ExamMark } from "@/components/design/variants/nachtzug-icons"
import { ActiveNavLinks, NavLinksFallback } from "@/components/design/nav-links"
import type { Brand } from "@/lib/exams"
import { OPERATOR } from "@/lib/seo"
import { LANDING, type Locale } from "@/lib/i18n/landing"
import { livePosts } from "@/lib/blog/posts"

const HOME: Record<Locale, string> = { de: "/", en: "/en" }

/** The site's top bar: a floating glass pill inside the container, shared by the landing pages and every inner page. `switchLang` hides the language link on pages that exist in one language only. */
export function SiteNav({ locale, switchLang = true }: { locale: Locale; switchLang?: boolean }) {
  const t = LANDING[locale]
  return (
    <div className="v-container relative z-20 pt-3 sm:pt-4">
      <nav className="nz-chrome flex h-14 items-center gap-2 rounded-full ps-3 pe-2 text-[14px] sm:ps-4 lg:gap-4">
        <Link href={HOME[locale]} className="rounded-lg">
          <NzLogo className="text-[18px]" />
        </Link>
        <div className="hidden items-center gap-0.5 md:flex">
          <Suspense fallback={<NavLinksFallback links={t.nav.links} />}>
            <ActiveNavLinks links={t.nav.links} />
          </Suspense>
        </div>
        <div className="ml-auto flex items-center gap-1 sm:gap-2">
          {switchLang ? (
            <Link
              href={t.nav.switchHref}
              hrefLang={locale === "en" ? "de" : "en"}
              aria-label={t.nav.switchLabel}
              className="flex h-9 items-center gap-1.5 rounded-full px-2.5 text-[13.5px] font-semibold text-v-muted transition-colors hover:bg-v-ink/5 hover:text-v-ink"
            >
              <Globe className="size-4" aria-hidden="true" />
              <span className="max-sm:sr-only">{t.nav.switchShort}</span>
            </Link>
          ) : null}
          <VButton size="sm" render={<Link href="/gratis-test" />} nativeButton={false} className="h-10 px-4">{t.nav.start}</VButton>
        </div>
      </nav>
    </div>
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

const MARKS: Brand[] = ["dtz", "goethe", "telc", "oesd"]

/** A glass card with the brand and the link groups, and the legal line under it. */
export function SiteFooter({ locale }: { locale: Locale }) {
  const t = LANDING[locale]
  const f = t.footer
  const groups = [
    { title: f.groups.exam, links: [{ label: "DTZ", href: "/blog/dtz-pruefung" }, { label: t.nav.links[1].label, href: "/gratis-test" }, { label: "A2 → B1", href: "/a2-zu-b1" }, { label: "B1 für die Einbürgerung", href: "/b1-einbuergerung" }, { label: t.nav.links[2].label, href: "/preise" }] },
    { title: f.groups.info, links: [...(livePosts().length ? [{ label: f.blog, href: "/blog" }] : []), { label: f.about, href: "/ueber-uns" }, { label: f.contact, href: "/kontakt" }, { label: f.imprint, href: "/impressum" }, { label: f.privacy, href: "/datenschutz" }] },
  ]
  return (
    <footer className="v-container pt-10 pb-6">
      <div className="nz-chrome grid grid-cols-2 gap-x-6 gap-y-10 rounded-[28px] p-7 text-[14px] text-v-muted sm:grid-cols-[1.4fr_1fr_1fr] sm:p-10">
        <div className="col-span-2 flex flex-col items-start gap-4 sm:col-span-1">
          <Link href={HOME[locale]} className="rounded-lg">
            <NzLogo className="text-[17px]" />
          </Link>
          <p className="max-w-[36ch] leading-relaxed text-pretty">{f.blurb}</p>
          <div className="flex gap-2.5">
            {MARKS.map((b) => <ExamMark key={b} brand={b} size="sm" />)}
          </div>
        </div>
        {groups.map((g) => (
          <nav key={g.title} aria-label={g.title} className="flex flex-col gap-2.5">
            <span className="mb-1 text-[13.5px] font-semibold text-v-ink">{g.title}</span>
            {g.links.map((l) => (
              <Link key={l.href} href={l.href} className="w-fit rounded transition-colors hover:text-v-ink">{l.label}</Link>
            ))}
            {g.title === f.groups.info ? <ConsentSettingsButton locale={locale} /> : null}
          </nav>
        ))}
      </div>
      <div className="flex flex-col gap-1.5 px-2 pt-5 text-[12.5px] text-v-muted sm:flex-row sm:justify-between sm:gap-6">
        <span>{OPERATOR.company} · KvK {OPERATOR.kvk} · {locale === "de" ? "USt-IdNr." : "VAT"} {OPERATOR.vatId}</span>
        <span>{f.disclaimer}</span>
      </div>
      <Consent locale={locale} />
    </footer>
  )
}
