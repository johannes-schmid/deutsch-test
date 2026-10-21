import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { PhotoCard } from "@/components/design/kit"
import { JsonLd } from "@/components/design/json-ld"
import { PartIcon } from "@/components/design/variants/nachtzug-icons"
import { examPath, type ExamId } from "@/lib/exams"
import { EXAM_PAGES, KURZTEST_COPY } from "@/lib/i18n/kurztest"
import { liveSkills } from "@/lib/kurztest/data"
import { PROVIDER, absUrl, breadcrumbList, openGraph, type Crumb } from "@/lib/seo"
import { KurztestHeader } from "./page-header"

const T = KURZTEST_COPY
const SKILL_PHOTO = { hoeren: "--g-photo-5", lesen: "--g-photo-6", schreiben: "--g-photo-4", sprechen: "--g-photo-2" } as const

export function examHubMetadata(exam: ExamId): Metadata {
  const p = EXAM_PAGES[exam]!
  const path = examPath(exam)
  return { title: p.hub.title, description: p.hub.description, alternates: { canonical: path }, robots: { index: true, follow: true }, openGraph: openGraph(path, p.hub.title, p.hub.description) }
}

/** One exam's free tests: a card per skill with reviewed content. Without any, the page doesn't exist. */
export function ExamHub({ exam }: { exam: ExamId }) {
  const p = EXAM_PAGES[exam]
  const skills = liveSkills(exam)
  if (!p || !skills.length) notFound()
  const path = examPath(exam)
  const crumbs: Crumb[] = [
    { name: T.crumbs.home, path: "/" },
    { name: T.crumbs.overview, path: "/gratis-test" },
    { name: p.crumb, path },
  ]
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${absUrl(path)}#page`,
        url: absUrl(path),
        name: p.hub.title,
        description: p.hub.description,
        inLanguage: "de",
        provider: PROVIDER,
        mainEntity: {
          "@type": "ItemList",
          numberOfItems: skills.length,
          itemListElement: skills.map((s, i) => ({ "@type": "ListItem", position: i + 1, name: p.skills[s].h1, url: absUrl(`${path}/${s}`) })),
        },
      },
      breadcrumbList(crumbs),
    ],
  }
  return (
    <div className="v-container pb-16">
      <JsonLd data={jsonLd} />
      <KurztestHeader crumbs={crumbs} eyebrow={p.hub.eyebrow} h1={p.hub.h1} lead={p.hub.lead} chips={[T.chips.free, T.chips.noAccount, T.chips.solutions]} />
      <ul className="grid grid-cols-[minmax(0,1fr)] gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {skills.map((s) => {
          const c = p.skills[s]
          return (
            <li key={s}>
              <PhotoCard
                token={SKILL_PHOTO[s]}
                art={<PartIcon part={s} size="lg" />}
                chip={T.chips.free}
                title={T.names[s]}
                text={c.summary}
                meta={<span className="text-[13.5px] text-v-muted">{c.detail}</span>}
                cta={T.overview.start}
                href={`${path}/${s}`}
              />
            </li>
          )
        })}
      </ul>
      <div className="mt-8 flex flex-col gap-1.5 text-[14px] text-v-muted">
        <p>{p.hub.note}</p>
        <p>{p.hub.disclaimer}</p>
      </div>
    </div>
  )
}
