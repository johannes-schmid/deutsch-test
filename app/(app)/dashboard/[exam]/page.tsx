import type { Metadata } from "next"
import { Suspense } from "react"
import { notFound } from "next/navigation"
import { ExamMark } from "@/components/design/variants/nachtzug-icons"
import { PortalCrumbs, SkillCard } from "@/components/portal/portal-exam"
import { EXAMS, EXAM_IDS } from "@/lib/exams"
import { isExam } from "@/lib/kurztest/data"
import { MODELLTESTS, portalSkills, type PortalSkill } from "@/lib/portal"
import { skillProgress } from "@/lib/modelltest/portal"
import { getSessionUser } from "@/lib/supabase/server"
import type { ExamId } from "@/lib/exams"
import { KURZTEST_COPY } from "@/lib/i18n/kurztest"
import { PORTAL_COPY } from "@/lib/i18n/portal"
import { PORTAL_HOME } from "@/lib/auth/redirect"

const T = PORTAL_COPY

export const generateStaticParams = () => EXAM_IDS.map((exam) => ({ exam }))

export async function generateMetadata({ params }: PageProps<"/dashboard/[exam]">): Promise<Metadata> {
  const { exam } = await params
  return isExam(exam) ? { title: T.exam.title(EXAMS[exam].name) } : {}
}

/** One exam in the portal: its four skills, each opening a list of Modelltests. */
export default async function PortalExamPage({ params }: PageProps<"/dashboard/[exam]">) {
  const { exam: id } = await params
  if (!isExam(id)) notFound()
  const exam = EXAMS[id]
  const skills = await portalSkills(id)
  return (
    <main className="mx-auto w-full max-w-[1000px] px-4 pt-6 pb-32 sm:px-6 lg:px-10 lg:pt-12 lg:pb-16">
      <PortalCrumbs items={[{ label: T.exam.back, href: PORTAL_HOME }, { label: exam.short ?? exam.name }]} />

      <header className="mt-8 flex flex-col gap-5">
        <ExamMark brand={exam.brand} size="lg" />
        <div className="flex flex-col gap-3">
          <h1 className="v-display text-[clamp(32px,4.4vw,50px)] leading-[1.05] text-balance">{exam.name}</h1>
          <p className="max-w-[60ch] text-[17px] text-v-muted text-pretty sm:text-lg">{exam.summary}</p>
        </div>
        <dl className="flex flex-wrap gap-x-6 gap-y-2 text-[14px]">
          {[
            [T.exam.facts.level, exam.levels.join("–")],
            [T.exam.facts.provider, exam.provider],
            [T.exam.facts.result, exam.result],
          ].map(([k, v]) => (
            <div key={k} className="flex items-baseline gap-2">
              <dt className="text-v-muted">{k}</dt>
              <dd className="font-semibold">{v}</dd>
            </div>
          ))}
        </dl>
      </header>

      <section aria-labelledby="skills-h" className="mt-12 flex flex-col gap-5">
        <h2 id="skills-h" className="text-[clamp(22px,2.4vw,28px)] leading-tight font-semibold tracking-[-0.02em]">
          {T.exam.skillsH}
          <span className="text-v-muted"> {T.exam.skillsMuted}</span>
        </h2>
        <Suspense fallback={<Cards skills={skills} />}>
          <ProgressCards exam={id} skills={skills} />
        </Suspense>
      </section>
    </main>
  )
}

function Cards({ skills, status }: { skills: PortalSkill[]; status?: Record<string, string> }) {
  return (
    <ul className="grid grid-cols-[minmax(0,1fr)] gap-4 sm:grid-cols-2">
      {skills.map((s) => (
        <li key={s.skill}>
          <SkillCard skill={s.skill} name={KURZTEST_COPY.names[s.skill]} href={s.href} free={s.free} count={T.exam.count(MODELLTESTS)} status={status?.[s.skill] ?? T.exam.soonLine} />
        </li>
      ))}
    </ul>
  )
}

/** Per skill: how many Modelltests this user has done of those already out. */
async function ProgressCards({ exam, skills }: { exam: ExamId; skills: PortalSkill[] }) {
  const user = await getSessionUser()
  const progress = user ? await skillProgress(exam, user.id) : {}
  const status = Object.fromEntries(Object.entries(progress).map(([k, p]) => [k, T.exam.progress(p.done, p.available)]))
  return <Cards skills={skills} status={status} />
}
