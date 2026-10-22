import type { Metadata } from "next"
import { JsonLd } from "@/components/design/json-ld"
import { ExamPicker, type PickerExam } from "@/components/kurztest/exam-picker"
import { KurztestHeader } from "@/components/kurztest/page-header"
import { EXAMS, EXAM_IDS, examPath } from "@/lib/exams"
import { KURZTEST } from "@/lib/i18n/kurztest"
import { alternates, lp, type SiteLocale } from "@/lib/i18n/locale"
import { UI } from "@/lib/i18n/ui"
import { examLive } from "@/lib/kurztest/data"
import { PROVIDER, absUrl, breadcrumbList, openGraph, type Crumb } from "@/lib/seo"

const PATH = "/gratis-test"

export function overviewMetadata(locale: SiteLocale = "de"): Metadata {
  const T = KURZTEST[locale]
  return {
    title: T.overview.title,
    description: T.overview.description,
    alternates: alternates(locale, PATH),
    robots: { index: true, follow: true },
    openGraph: openGraph(lp(locale, PATH), T.overview.title, T.overview.description, locale),
  }
}

/** /gratis-test: level, then exam. Only exams with reviewed content (and page copy in this locale) link out. */
export function OverviewPage({ locale = "de" }: { locale?: SiteLocale }) {
  const T = KURZTEST[locale]
  const at = (p: string) => lp(locale, p)
  const crumbs: Crumb[] = [
    { name: T.crumbs.home, path: at("/") },
    { name: T.crumbs.overview, path: at(PATH) },
  ]
  const exams: PickerExam[] = EXAM_IDS.map((id) => ({ ...EXAMS[id], summary: T.examSummary[id], id, href: examLive(id, locale) ? at(examPath(id)) : null }))
  const linked = exams.filter((e) => e.href)
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${absUrl(at(PATH))}#page`,
        url: absUrl(at(PATH)),
        name: T.overview.title,
        description: T.overview.description,
        inLanguage: locale,
        provider: PROVIDER,
        mainEntity: {
          "@type": "ItemList",
          numberOfItems: linked.length,
          itemListElement: linked.map((e, i) => ({ "@type": "ListItem", position: i + 1, name: e.name, url: absUrl(e.href!) })),
        },
      },
      breadcrumbList(crumbs),
    ],
  }
  return (
    <div className="v-container pb-16">
      <JsonLd data={jsonLd} />
      <KurztestHeader crumbs={crumbs} crumbsAria={UI[locale].crumbsAria} eyebrow={T.overview.eyebrow} h1={T.overview.h1} lead={T.overview.lead} chips={[T.chips.free, T.chips.noAccount, T.chips.solutions]} />
      <ExamPicker exams={exams} t={T.overview} free={T.chips.free} />
      <p className="mt-8 text-[14px] text-v-muted">{T.overview.disclaimer}</p>
    </div>
  )
}
