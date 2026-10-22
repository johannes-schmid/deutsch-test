import { Suspense } from "react"
import Link from "next/link"
import { UserRound } from "lucide-react"
import { VButton } from "@/components/design/kit"
import { Consent, ConsentSettingsButton } from "@/components/design/consent"
import { NzLogo } from "@/components/design/variants/nachtzug-logo"
import { ExamMark } from "@/components/design/variants/nachtzug-icons"
import { ActiveNavLinks, NavLinksFallback } from "@/components/design/nav-links"
import { LangLinks, LangSwitch, LangSwitchFallback, MachineNote, MachineNoteBody } from "@/components/design/lang-switch"
import type { Brand } from "@/lib/exams"
import { OPERATOR } from "@/lib/seo"
import { LANDING } from "@/lib/i18n/landing"
import { isTranslated, lp, siteLocale, type Locale } from "@/lib/i18n/locale"
import { UI } from "@/lib/i18n/ui"
import { livePosts } from "@/lib/blog/posts"

const home = (l: Locale) => (l === "en" ? "/en" : lp(l, "/"))

/** The site's top bar: a floating glass pill inside the container, shared by the landing pages and every inner page. Translated pages get the machine-translation notice under it. */
export function SiteNav({ locale }: { locale: Locale }) {
  const t = LANDING[locale]
  const u = UI[siteLocale(locale)]
  const sl = siteLocale(locale)
  const links = t.nav.links.map((l) => ({ ...l, href: lp(sl, l.href) }))
  return (
    <div className="v-container relative z-20 pt-3 sm:pt-4">
      <nav className="nz-chrome flex h-14 items-center gap-2 rounded-full ps-3 pe-2 text-[14px] sm:ps-4 lg:gap-4">
        <Link href={home(locale)} className="rounded-lg">
          <NzLogo className="text-[18px]" />
        </Link>
        <div className="hidden items-center gap-0.5 md:flex">
          <Suspense fallback={<NavLinksFallback links={links} />}>
            <ActiveNavLinks links={links} />
          </Suspense>
        </div>
        <div className="ml-auto flex items-center gap-1 sm:gap-2">
          <Suspense fallback={<LangSwitchFallback locale={locale} />}>
            <LangSwitch locale={locale} label={u.langMenu} />
          </Suspense>
          <Link href="/anmelden" aria-label={t.nav.login} className="flex h-10 min-w-9 items-center justify-center rounded-full text-[14px] font-semibold transition-[background-color,transform] duration-150 ease-out hover:bg-v-ink/5 active:scale-[0.97] sm:px-3">
            <UserRound className="size-[18px] sm:hidden" aria-hidden="true" />
            <span className="max-sm:sr-only">{t.nav.login}</span>
          </Link>
          <VButton size="sm" render={<Link href={lp(sl, "/gratis-test")} />} nativeButton={false} className="h-10 px-3.5 sm:px-4">{t.nav.start}</VButton>
        </div>
      </nav>
      {isTranslated(locale) ? (
        <Suspense fallback={<MachineNoteBody text={u.machine.text} original={u.machine.original} />}>
          <MachineNote text={u.machine.text} original={u.machine.original} />
        </Suspense>
      ) : null}
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
  const sl = siteLocale(locale)
  const u = UI[sl]
  const at = (path: string) => lp(sl, path)
  // Impressum and Datenschutz exist in German only: they are the legally binding texts.
  const groups = [
    { title: f.groups.exam, links: [{ label: "DTZ", href: at("/blog/dtz-pruefung") }, { label: t.nav.links[1].label, href: at("/gratis-test") }, { label: "A2 → B1", href: at("/a2-zu-b1") }, { label: u.footerCitizenship, href: at("/b1-einbuergerung") }, { label: t.nav.links[2].label, href: at("/preise") }] },
    { title: f.groups.info, links: [...(livePosts().length ? [{ label: f.blog, href: at("/blog") }] : []), { label: f.about, href: at("/ueber-uns") }, { label: f.contact, href: at("/kontakt") }, { label: f.imprint, href: "/impressum" }, { label: f.privacy, href: "/datenschutz" }] },
  ]
  return (
    <footer className="v-container pt-10 pb-6">
      <div className="nz-chrome grid grid-cols-2 gap-x-6 gap-y-10 rounded-[28px] p-7 text-[14px] text-v-muted sm:grid-cols-[1.4fr_1fr_1fr] sm:p-10">
        <div className="col-span-2 flex flex-col items-start gap-4 sm:col-span-1">
          <Link href={home(locale)} className="rounded-lg">
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
            {g.title === f.groups.info ? (
              <>
                <ConsentSettingsButton locale={locale} />
                <Suspense>
                  <LangLinks locale={locale} />
                </Suspense>
              </>
            ) : null}
          </nav>
        ))}
      </div>
      <div className="flex flex-col gap-1.5 px-2 pt-5 text-[12.5px] text-v-muted sm:flex-row sm:justify-between sm:gap-6">
        <span>{OPERATOR.company} · KvK {OPERATOR.kvk} · {locale === "en" ? "VAT" : u.vat} {OPERATOR.vatId}</span>
        <span>{f.disclaimer}</span>
      </div>
      <Consent locale={locale} />
    </footer>
  )
}
