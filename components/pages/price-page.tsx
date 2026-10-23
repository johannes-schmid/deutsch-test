import { PageHeader, Prose, TestCta } from "@/components/design/content-page"
import { JsonLd } from "@/components/design/json-ld"
import { PassBuilder } from "@/components/design/pass-builder"
import { lp, type SiteLocale } from "@/lib/i18n/locale"
import type { PricePage } from "@/lib/pages/types"
import { PROVIDER, absUrl, breadcrumbList } from "@/lib/seo"
import { pageCrumbs } from "./text-page"

export const PRICE_PATH = "/preise"

export function PricePageView({ page, locale }: { page: PricePage; locale: SiteLocale }) {
  const crumbs = pageCrumbs(page.crumb, PRICE_PATH, locale)
  const url = absUrl(lp(locale, PRICE_PATH))
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

      <PassBuilder locale={locale} freeHref={lp(locale, "/gratis-test/dtz")} />

      <p className="mt-5 text-[14px] text-v-muted">{page.vatNote}</p>

      <Prose className="mt-16">{page.faq}</Prose>

      <TestCta h2={page.cta.h2} text={page.cta.text} locale={locale} />
    </>
  )
}
