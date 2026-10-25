import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { JsonLd } from "@/components/design/json-ld"
import { itemNumbers } from "@/lib/exam/kurztest"
import { EXAMS, examPath, type ExamId } from "@/lib/exams"
import { EXAM_PAGES_BY, KURZTEST } from "@/lib/i18n/kurztest"
import { alternates, lp, type SiteLocale } from "@/lib/i18n/locale"
import { UI } from "@/lib/i18n/ui"
import { publicSet, tasterMinutes, type Skill } from "@/lib/kurztest/data"
import { PROVIDER, absUrl, breadcrumbList, openGraph, type Crumb } from "@/lib/seo"
import { KurztestHeader } from "./page-header"
import { KurztestRunner } from "./runner"

const path = (exam: ExamId, skill: Skill) => `${examPath(exam)}/${skill}`

export function skillMetadata(exam: ExamId, skill: Skill, locale: SiteLocale = "de"): Metadata {
  const c = EXAM_PAGES_BY[locale][exam]?.skills[skill]
  if (!c) return {}
  return {
    title: c.title,
    description: c.description,
    alternates: alternates(locale, path(exam, skill)),
    robots: { index: true, follow: true },
    openGraph: openGraph(lp(locale, path(exam, skill)), c.title, c.description, locale),
  }
}

export function SkillPage({ exam, skill, locale = "de" }: { exam: ExamId; skill: Skill; locale?: SiteLocale }) {
  const p = EXAM_PAGES_BY[locale][exam]
  const blocks = publicSet(exam, skill)
  if (!p || !blocks.length) notFound()
  const T = KURZTEST[locale]
  const at = (x: string) => lp(locale, x)
  const c = p.skills[skill]
  const minutes = tasterMinutes(exam, skill)
  const crumbs: Crumb[] = [
    { name: T.crumbs.home, path: at("/") },
    { name: T.crumbs.overview, path: at("/gratis-test") },
    { name: p.crumb, path: at(examPath(exam)) },
    { name: T.names[skill], path: at(path(exam, skill)) },
  ]
  const closed = skill === "lesen" || skill === "hoeren"
  const url = absUrl(at(path(exam, skill)))
  const levels = EXAMS[exam].levels
  // A Quiz for the scored skills, counted off the set so copy and schema cannot disagree; a practice task for the others.
  const resource = {
    "@type": closed ? "Quiz" : "LearningResource",
    "@id": `${url}#test`,
    url,
    name: c.h1,
    description: c.description,
    ...(closed ? { numberOfQuestions: blocks.reduce((n, b) => n + itemNumbers(b.display.items).length, 0) } : {}),
    learningResourceType: closed ? "Quiz" : "Practice exam",
    educationalLevel: levels.length > 1 ? `${levels[0]}–${levels.at(-1)}` : levels[0],
    timeRequired: `PT${minutes}M`,
    isAccessibleForFree: true,
    // The tasks are German in every locale; the page around them is not.
    inLanguage: locale === "de" ? "de" : [locale, "de"],
    provider: PROVIDER,
  }
  return (
    <div className="v-container pb-16">
      <JsonLd data={{ "@context": "https://schema.org", "@graph": [resource, breadcrumbList(crumbs)] }} />
      <KurztestHeader crumbs={crumbs} crumbsAria={UI[locale].crumbsAria} eyebrow={c.eyebrow ?? p.hub.eyebrow} h1={c.h1} lead={c.lead} chips={[c.count, T.minutes(minutes), T.chips.free]} />
      <KurztestRunner locale={locale} exam={exam} page={p} skill={skill} minutes={minutes} blocks={blocks} />
    </div>
  )
}
