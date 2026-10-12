import type { Metadata } from "next"
import { JsonLd } from "@/components/design/json-ld"
import { ExamPicker, type PickerExam } from "@/components/kurztest/exam-picker"
import { KurztestHeader } from "@/components/kurztest/page-header"
import { EXAMS, EXAM_IDS, examPath, type ExamId } from "@/lib/exams"
import { EXAM_PAGES, KURZTEST_COPY } from "@/lib/i18n/kurztest"
import { liveSkills } from "@/lib/kurztest/data"
import { PROVIDER, absUrl, breadcrumbList, openGraph, type Crumb } from "@/lib/seo"

const T = KURZTEST_COPY
const PATH = "/gratis-test"

export const metadata: Metadata = {
  title: T.overview.title,
  description: T.overview.description,
  alternates: { canonical: PATH },
  robots: { index: true, follow: true },
  openGraph: openGraph(PATH, T.overview.title, T.overview.description),
}

/** An exam links out only once it has reviewed content; the others show as "Bald verfügbar" with no URL. */
const live = (id: ExamId) => !!EXAM_PAGES[id] && liveSkills(id).length > 0

const crumbs: Crumb[] = [
  { name: T.crumbs.home, path: "/de" },
  { name: T.crumbs.overview, path: PATH },
]

export default function GratisTestPage() {
  const exams: PickerExam[] = EXAM_IDS.map((id) => ({ ...EXAMS[id], id, href: live(id) ? examPath(id) : null }))
  const linked = exams.filter((e) => e.href)
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${absUrl(PATH)}#page`,
        url: absUrl(PATH),
        name: T.overview.title,
        description: T.overview.description,
        inLanguage: "de",
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
      <KurztestHeader crumbs={crumbs} eyebrow={T.overview.eyebrow} h1={T.overview.h1} lead={T.overview.lead} chips={[T.chips.free, T.chips.noAccount, T.chips.solutions]} />
      <ExamPicker exams={exams} />
      <p className="mt-8 text-[14px] text-v-muted">{T.overview.disclaimer}</p>
    </div>
  )
}
