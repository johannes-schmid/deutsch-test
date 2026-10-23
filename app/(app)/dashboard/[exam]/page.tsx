import type { Metadata } from "next"
import { Suspense } from "react"
import { notFound } from "next/navigation"
import { ExamMark } from "@/components/design/variants/nachtzug-icons"
import { PortalCrumbs, PortalHeader, SkillCard } from "@/components/portal/portal-exam"
import { LevelCard } from "@/components/portal/portal-overview"
import { EXAMS, EXAM_IDS, FAMILIES, FAMILY_IDS, familyCrumb, isFamily, type FamilyId } from "@/lib/exams"
import { isExam } from "@/lib/kurztest/data"
import { MODELLTESTS, portalFamilies, portalSkills, type PortalFamily, type PortalSkill } from "@/lib/portal"
import { portalStats, skillProgress } from "@/lib/modelltest/portal"
import { getSessionUser } from "@/lib/supabase/server"
import type { ExamId } from "@/lib/exams"
import { KURZTEST_COPY } from "@/lib/i18n/kurztest"
import { PORTAL_COPY } from "@/lib/i18n/portal"
import { PORTAL_HOME } from "@/lib/auth/redirect"

const T = PORTAL_COPY

/** Exams, plus the families with more than one level (/dashboard/goethe), which pick the level. */
export const generateStaticParams = () => [...EXAM_IDS, ...FAMILY_IDS.filter((f) => FAMILIES[f].exams.length > 1 && !isExam(f))].map((exam) => ({ exam }))

export async function generateMetadata({ params }: PageProps<"/dashboard/[exam]">): Promise<Metadata> {
  const { exam } = await params
  return isExam(exam) ? { title: T.exam.title(EXAMS[exam].name) } : isFamily(exam) ? { title: T.family.title(FAMILIES[exam].name) } : {}
}

/** One exam in the portal: its four skills, each opening a list of Modelltests. */
export default async function PortalExamPage({ params }: PageProps<"/dashboard/[exam]">) {
  const { exam: id } = await params
  if (isFamily(id) && !isExam(id)) return <FamilyPage id={id} />
  if (!isExam(id)) notFound()
  const exam = EXAMS[id]
  const skills = await portalSkills(id)
  return (
    <main className="mx-auto w-full max-w-[1000px] px-4 pt-6 pb-32 sm:px-6 lg:px-10 lg:pt-12 lg:pb-16">
      <PortalCrumbs items={[{ label: T.exam.back, href: PORTAL_HOME }, ...familyCrumb(id), { label: exam.short ?? exam.name }]} />

      <PortalHeader mark={<ExamMark brand={exam.brand} />} title={exam.name} lead={exam.summary}>
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
      </PortalHeader>

      <section aria-labelledby="skills-h" className="mt-10 flex flex-col gap-5">
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

/** A family with several levels: pick the level, each opening its exam page. */
async function FamilyPage({ id }: { id: FamilyId }) {
  const family = (await portalFamilies()).find((f) => f.id === id)!
  return (
    <main className="mx-auto w-full max-w-[1000px] px-4 pt-6 pb-32 sm:px-6 lg:px-10 lg:pt-12 lg:pb-16">
      <PortalCrumbs items={[{ label: T.exam.back, href: PORTAL_HOME }, { label: family.name }]} />

      <PortalHeader mark={<ExamMark brand={family.brand} />} title={family.name} lead={family.summary} />

      <section aria-labelledby="levels-h" className="mt-10 flex flex-col gap-5">
        <h2 id="levels-h" className="text-[clamp(22px,2.4vw,28px)] leading-tight font-semibold tracking-[-0.02em]">
          {T.family.levelsH}
          <span className="text-v-muted"> {T.family.levelsMuted}</span>
        </h2>
        <Suspense fallback={<Levels family={family} done={{}} />}>
          <UserLevels family={family} />
        </Suspense>
      </section>
    </main>
  )
}

function Levels({ family, done }: { family: PortalFamily; done: Record<string, number> }) {
  const total = family.total / family.exams.length
  return (
    <ul className="grid grid-cols-[minmax(0,1fr)] gap-4 sm:grid-cols-2">
      {family.exams.map((e) => (
        <li key={e.id}>
          <LevelCard level={e.levels.join("–")} name={e.name} summary={e.summary} href={e.href} done={done[e.id] ?? 0} total={total} />
        </li>
      ))}
    </ul>
  )
}

async function UserLevels({ family }: { family: PortalFamily }) {
  const user = await getSessionUser()
  const stats = user ? await portalStats(user.id) : null
  return <Levels family={family} done={stats?.done ?? {}} />
}
