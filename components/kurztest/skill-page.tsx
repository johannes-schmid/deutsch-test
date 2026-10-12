import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { JsonLd } from "@/components/design/json-ld"
import { itemNumbers } from "@/lib/exam/kurztest"
import { EXAMS, examPath, type ExamId } from "@/lib/exams"
import { EXAM_PAGES, KURZTEST_COPY } from "@/lib/i18n/kurztest"
import { publicSet, tasterMinutes, type Skill } from "@/lib/kurztest/data"
import { PROVIDER, absUrl, breadcrumbList, openGraph, type Crumb } from "@/lib/seo"
import { KurztestHeader } from "./page-header"
import { KurztestRunner } from "./runner"

const T = KURZTEST_COPY
const path = (exam: ExamId, skill: Skill) => `${examPath(exam)}/${skill}`

export function skillMetadata(exam: ExamId, skill: Skill): Metadata {
  const c = EXAM_PAGES[exam]!.skills[skill]
  return {
    title: c.title,
    description: c.description,
    alternates: { canonical: path(exam, skill) },
    robots: { index: true, follow: true },
    openGraph: openGraph(path(exam, skill), c.title, c.description),
  }
}

export function SkillPage({ exam, skill }: { exam: ExamId; skill: Skill }) {
  const p = EXAM_PAGES[exam]
  const blocks = publicSet(exam, skill)
  if (!p || !blocks.length) notFound()
  const c = p.skills[skill]
  const minutes = tasterMinutes(exam, skill)
  const crumbs: Crumb[] = [
    { name: T.crumbs.home, path: "/" },
    { name: T.crumbs.overview, path: "/gratis-test" },
    { name: p.crumb, path: examPath(exam) },
    { name: T.names[skill], path: path(exam, skill) },
  ]
  const closed = skill === "lesen" || skill === "hoeren"
  const url = absUrl(path(exam, skill))
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
    inLanguage: "de",
    provider: PROVIDER,
  }
  return (
    <div className="v-container pb-16">
      <JsonLd data={{ "@context": "https://schema.org", "@graph": [resource, breadcrumbList(crumbs)] }} />
      <KurztestHeader crumbs={crumbs} eyebrow={c.eyebrow ?? p.hub.eyebrow} h1={c.h1} lead={c.lead} chips={[c.count, `${minutes} Minuten`, T.chips.free, T.chips.noAccount]} />
      <KurztestRunner exam={exam} skill={skill} minutes={minutes} blocks={blocks} />
    </div>
  )
}
