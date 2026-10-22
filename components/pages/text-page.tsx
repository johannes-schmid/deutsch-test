import type { Metadata } from "next"
import { Mail, MessageCircle } from "lucide-react"
import { Byline, PageHeader, Prose, TestCta } from "@/components/design/content-page"
import { JsonLd } from "@/components/design/json-ld"
import { alternates, lp, type SiteLocale } from "@/lib/i18n/locale"
import { UI } from "@/lib/i18n/ui"
import type { ContactPage, TextPage } from "@/lib/pages/types"
import { CONTACT_EMAIL, OPERATOR, ORG_ID, PROVIDER, SITE_NAME, SITE_URL, absUrl, breadcrumbList, openGraph, type Crumb } from "@/lib/seo"

export function pageMetadata(page: Pick<TextPage, "title" | "description">, path: string, locale: SiteLocale): Metadata {
  return {
    title: `${page.title} | deutschtest üben`,
    description: page.description,
    alternates: alternates(locale, path),
    openGraph: openGraph(lp(locale, path), page.title, page.description, locale),
  }
}

export function pageCrumbs(crumb: string, path: string, locale: SiteLocale): Crumb[] {
  return [
    { name: UI[locale].home, path: lp(locale, "/") },
    { name: crumb, path: lp(locale, path) },
  ]
}

type SchemaType = "WebPage" | "AboutPage" | "ContactPage"

function schema(type: SchemaType, page: TextPage, path: string, locale: SiteLocale, crumbs: Crumb[]) {
  const url = absUrl(lp(locale, path))
  const extra =
    type === "AboutPage"
      ? { about: { "@type": "Organization", "@id": ORG_ID, name: SITE_NAME, url: SITE_URL, legalName: OPERATOR.company, founder: { "@type": "Person", name: OPERATOR.person }, email: OPERATOR.email } }
      : { description: page.description, publisher: PROVIDER }
  return { "@context": "https://schema.org", "@graph": [{ "@type": type, "@id": `${url}#page`, url, name: page.title, inLanguage: locale, ...extra }, breadcrumbList(crumbs)] }
}

/** A text page: header, one reading card, optional byline and test CTA. Landings and the about page. */
export function TextPageView({ page, path, locale, type = "WebPage" }: { page: TextPage; path: string; locale: SiteLocale; type?: SchemaType }) {
  const crumbs = pageCrumbs(page.crumb, path, locale)
  return (
    <>
      <JsonLd data={schema(type, page, path, locale, crumbs)} />
      <PageHeader crumbs={crumbs} h1={page.h1} h1Muted={page.h1Muted} lead={page.lead} meta={page.meta} locale={locale} />
      <Prose>{page.body}</Prose>
      {page.byline ? <Byline author={`${OPERATOR.person}, ${OPERATOR.company}`} reviewed={page.byline.reviewed} sources={page.byline.sources} locale={locale} /> : null}
      {page.cta ? <TestCta h2={page.cta.h2} text={page.cta.text} locale={locale} /> : null}
    </>
  )
}

export function ContactPageView({ page, locale }: { page: ContactPage; locale: SiteLocale }) {
  const path = "/kontakt"
  const crumbs = pageCrumbs(page.crumb, path, locale)
  return (
    <>
      <JsonLd data={schema("ContactPage", page, path, locale, crumbs)} />
      <PageHeader crumbs={crumbs} icon={MessageCircle} h1={page.h1} lead={page.lead} locale={locale} />
      <a
        href={`mailto:${CONTACT_EMAIL}`}
        className="nz-app group flex max-w-[34rem] items-center gap-4 rounded-[24px] p-5 transition-transform duration-150 ease-out active:scale-[0.98] sm:p-6"
      >
        <span className="grid size-12 shrink-0 place-items-center rounded-[14px] bg-v-ink text-v-bg">
          <Mail className="size-5" strokeWidth={2} aria-hidden="true" />
        </span>
        <span className="min-w-0">
          <span className="block text-[14px] text-v-muted">{page.emailLabel}</span>
          <span className="block truncate text-[18px] font-semibold underline decoration-v-line decoration-[1.5px] underline-offset-4 transition-colors group-hover:decoration-v-ink">{CONTACT_EMAIL}</span>
        </span>
      </a>
      <Prose className="mt-12">{page.body}</Prose>
    </>
  )
}
