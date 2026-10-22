import Link from "next/link"
import { Check } from "lucide-react"
import { PageHeader, Prose, TestCta } from "@/components/design/content-page"
import { JsonLd } from "@/components/design/json-ld"
import { VButton } from "@/components/design/kit"
import { NUMBER_LOCALE, lp, type SiteLocale } from "@/lib/i18n/locale"
import type { PricePage } from "@/lib/pages/types"
import { PLANS, formatEuro, perMonthCents, savingsPercent } from "@/lib/pricing"
import { PROVIDER, absUrl, breadcrumbList } from "@/lib/seo"
import { pageCrumbs } from "./text-page"

export const PRICE_PATH = "/preise"

export function PricePageView({ page, locale }: { page: PricePage; locale: SiteLocale }) {
  const crumbs = pageCrumbs(page.crumb, PRICE_PATH, locale)
  const url = absUrl(lp(locale, PRICE_PATH))
  const euro = (cents: number) => formatEuro(cents, NUMBER_LOCALE[locale])
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "WebPage", "@id": `${url}#page`, url, name: page.title, description: page.description, inLanguage: locale, publisher: PROVIDER },
      breadcrumbList(crumbs),
    ],
  }
  return (
    <>
      <JsonLd data={jsonLd} />
      <PageHeader crumbs={crumbs} h1={page.h1} h1Muted={page.h1Muted} lead={page.lead} locale={locale} />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {PLANS.map((p) => {
          const saving = savingsPercent(p)
          const dark = p.featured
          const name = page.planName(p.months)
          return (
            <section
              key={p.id}
              aria-label={name}
              className={`flex flex-col gap-5 rounded-[28px] p-6 sm:p-7 ${dark ? "nz-night shadow-[0_40px_80px_-44px_rgba(8,10,30,0.7)]" : "nz-paper"}`}
            >
              <div className="flex min-h-7 flex-wrap items-center justify-between gap-x-3 gap-y-2">
                <h2 className="text-[18px] font-semibold whitespace-nowrap">{name}</h2>
                {dark ? <span className="rounded-full bg-(--p-glow) px-3 py-1 text-[12.5px] font-semibold whitespace-nowrap text-[#0A0D18]">{page.recommended}</span> : null}
              </div>
              <p className="flex items-baseline gap-2">
                <span className="v-display text-[44px] leading-none tabular-nums">{euro(p.cents)}</span>
              </p>
              <p className={`-mt-3 text-[14px] ${dark ? "text-white/70" : "text-v-muted"}`}>
                {p.months > 1 ? page.perMonth(euro(perMonthCents(p)), saving) : page.trial}
              </p>
              <ul className={`flex flex-col gap-2.5 border-t pt-5 text-[15px] ${dark ? "border-white/15" : "border-v-line"}`}>
                {page.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5">
                    <Check className={`mt-1 size-4 shrink-0 ${dark ? "text-(--p-glow)" : "text-v-accent"}`} strokeWidth={2.5} aria-hidden="true" />
                    {f}
                  </li>
                ))}
              </ul>
              <VButton kind={dark ? "light" : "ghost"} disabled className="mt-auto w-full">{page.soon}</VButton>
            </section>
          )
        })}

        <section aria-label={page.freeTitle} className="flex flex-col gap-5 rounded-[28px] border border-dashed border-v-ink/20 bg-v-surface/40 p-6 sm:p-7">
          <h2 className="min-h-7 text-[18px] font-semibold">{page.freeTitle}</h2>
          <p className="v-display text-[44px] leading-none tabular-nums">{new Intl.NumberFormat(NUMBER_LOCALE[locale], { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(0)}</p>
          <ul className="flex flex-col gap-2.5 border-t border-v-line pt-5 text-[15px]">
            {page.free.map((f) => (
              <li key={f} className="flex items-start gap-2.5">
                <Check className="mt-1 size-4 shrink-0 text-v-accent" strokeWidth={2.5} aria-hidden="true" />
                {f}
              </li>
            ))}
          </ul>
          <VButton render={<Link href={lp(locale, "/gratis-test/dtz")} />} nativeButton={false} className="mt-auto w-full">{page.freeCta}</VButton>
        </section>
      </div>

      <p className="mt-5 text-[14px] text-v-muted">{page.vatNote}</p>

      <Prose className="mt-16">{page.faq}</Prose>

      <TestCta h2={page.cta.h2} text={page.cta.text} locale={locale} />
    </>
  )
}
