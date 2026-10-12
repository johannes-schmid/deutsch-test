import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowRight } from "lucide-react"
import { JsonLd } from "@/components/design/json-ld"
import { PartIcon } from "@/components/design/variants/nachtzug-icons"
import { examPath, type ExamId } from "@/lib/exams"
import { EXAM_PAGES, KURZTEST_COPY } from "@/lib/i18n/kurztest"
import { liveSkills } from "@/lib/kurztest/data"
import { PROVIDER, absUrl, breadcrumbList, openGraph, type Crumb } from "@/lib/seo"
import { KurztestHeader } from "./page-header"

const T = KURZTEST_COPY

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
    { name: T.crumbs.home, path: "/de" },
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
      <ul className="grid grid-cols-[minmax(0,1fr)] gap-3 md:grid-cols-2">
        {skills.map((s) => {
          const c = p.skills[s]
          return (
            <li key={s}>
              <Link
                href={`${path}/${s}`}
                className="nz-app group flex h-full items-center gap-4 rounded-[22px] p-4 transition-transform duration-150 ease-out hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99] sm:p-5"
              >
                <PartIcon part={s} size="lg" />
                <span className="flex min-w-0 flex-1 flex-col gap-1">
                  <b className="text-[20px] font-semibold tracking-[-0.02em]">{T.names[s]}</b>
                  <span className="text-[15px] leading-snug">{c.summary}</span>
                  <span className="text-[13.5px] text-v-muted">{c.detail}</span>
                </span>
                <ArrowRight className="size-5 shrink-0 text-v-muted transition-transform duration-150 ease-out group-hover:translate-x-0.5 rtl:-scale-x-100" aria-hidden="true" />
              </Link>
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
