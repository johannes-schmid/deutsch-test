import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowRight } from "lucide-react"
import { PartIcon } from "@/components/design/variants/nachtzug-icons"
import { ModelltestRow, PortalCrumbs } from "@/components/portal/portal-exam"
import { EXAMS, EXAM_IDS } from "@/lib/exams"
import { SKILLS, isExam, isSkill } from "@/lib/kurztest/data"
import { MODELLTESTS, modelltests, portalPath, portalSkills } from "@/lib/portal"
import { KURZTEST_COPY } from "@/lib/i18n/kurztest"
import { PORTAL_COPY } from "@/lib/i18n/portal"
import { PORTAL_HOME } from "@/lib/auth/redirect"

const T = PORTAL_COPY

export const generateStaticParams = () => EXAM_IDS.flatMap((exam) => SKILLS.map((skill) => ({ exam, skill })))

export async function generateMetadata({ params }: PageProps<"/dashboard/[exam]/[skill]">): Promise<Metadata> {
  const { exam, skill } = await params
  return isExam(exam) && isSkill(skill) ? { title: T.skill.title(KURZTEST_COPY.names[skill], EXAMS[exam].short ?? EXAMS[exam].name) } : {}
}

/** One skill of one exam: its ten Modelltests, nothing else. */
export default async function PortalSkillPage({ params }: PageProps<"/dashboard/[exam]/[skill]">) {
  const { exam: id, skill } = await params
  if (!isExam(id) || !isSkill(skill)) notFound()
  const exam = EXAMS[id]
  const name = KURZTEST_COPY.names[skill]
  const slots = modelltests()
  const free = (await portalSkills(id)).find((s) => s.skill === skill)?.free ?? null
  const noneOpen = slots.every((s) => !s.href)
  return (
    <main className="mx-auto w-full max-w-[820px] px-4 pt-6 pb-32 sm:px-6 lg:px-10 lg:pt-12 lg:pb-16">
      <PortalCrumbs items={[{ label: T.exam.back, href: PORTAL_HOME }, { label: exam.short ?? exam.name, href: portalPath(id) }, { label: name }]} />

      <header className="mt-8 flex flex-col gap-5">
        <PartIcon part={skill} size="lg" />
        <div className="flex flex-col gap-3">
          <h1 className="v-display text-[clamp(32px,4.4vw,50px)] leading-[1.05]">{name}</h1>
          <p className="max-w-[60ch] text-[17px] text-v-muted text-pretty sm:text-lg">{T.skill.lead(MODELLTESTS, exam.name)}</p>
        </div>
      </header>

      {noneOpen ? (
        <div className="mt-8 flex flex-col gap-3 rounded-[20px] border border-dashed border-v-ink/20 bg-v-surface/50 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
          <p className="text-[15px] text-v-muted text-pretty">{free ? T.skill.soonNote : T.skill.soonNoteNoFree}</p>
          {free ? (
            <Link href={free} className="group flex h-10 w-fit shrink-0 items-center gap-2 rounded-full bg-v-ink px-4 text-[14px] font-semibold text-v-bg transition-transform duration-150 ease-out active:scale-[0.97]">
              {T.skill.freeCta}
              <ArrowRight className="size-4 transition-transform duration-150 ease-out group-hover:translate-x-0.5 rtl:-scale-x-100" aria-hidden="true" />
            </Link>
          ) : null}
        </div>
      ) : null}

      <ol aria-label={T.exam.count(MODELLTESTS)} className="nz-paper mt-6 flex flex-col divide-y divide-v-line overflow-hidden rounded-[24px]">
        {slots.map((s) => (
          <li key={s.n}>
            <ModelltestRow n={s.n} href={s.href} />
          </li>
        ))}
      </ol>
    </main>
  )
}
