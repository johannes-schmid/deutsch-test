import type { Metadata } from "next"
import { Suspense } from "react"
import { LoadingVeil } from "@/components/design/leuchte-loader"
import { ScoreCard, WeekCard } from "@/components/portal/portal-overview"
import { SkillTabs } from "@/components/portal/skill-tabs"
import { ExamChooser, ExamFocusHeader } from "@/components/portal/exam-focus"
import { PassBanner } from "@/components/portal/pass-banner"
import { getSessionUser, type SessionUser } from "@/lib/supabase/server"
import { focusInfo, portalSkills, switchFamilies } from "@/lib/portal"
import { focusExam, modelltestSlots, mostPracticedSkill, portalStats, type PortalStats } from "@/lib/modelltest/portal"
import { EXAMS, type ExamId } from "@/lib/exams"
import { KURZTEST_COPY } from "@/lib/i18n/kurztest"
import { PORTAL_COPY } from "@/lib/i18n/portal"
import { ExamDateWidget } from "@/components/portal/exam-goal"
import { NextStepCard } from "@/components/portal/next-step"
import { PushAutoSync } from "@/components/portal/push-sync"
import { doneSkills } from "@/lib/lifecycle/state"
import { passStatus } from "@/lib/entitlements"
import { hasAccess } from "@/lib/billing/period"
import { examGoal } from "@/lib/lifecycle/prefs"
import { daysUntil } from "@/lib/lifecycle/rules"

const T = PORTAL_COPY

export const metadata: Metadata = { title: T.title }

const today = () => new Intl.DateTimeFormat("de-DE", { weekday: "long", day: "numeric", month: "long", timeZone: "Europe/Berlin" }).format(new Date())

function Greeting({ user, date, sub }: { user: SessionUser | null; date: string | null; sub: string | null }) {
  return (
    <header className="flex flex-col gap-3">
      <p className="v-num min-h-5 text-[13px] text-v-muted">{date}</p>
      <h1 className="v-display pb-1 text-[clamp(34px,4.6vw,52px)] leading-[1.05]">{T.hello(user?.firstName ?? null)}</h1>
      {sub ? <p className="text-[17px] text-v-muted sm:text-lg">{sub}</p> : <span className="h-6 w-56 rounded-full bg-v-soft" aria-hidden="true" />}
    </header>
  )
}

/** The page's shape while the learner's exam loads: header card, four parts, side column. */
function OverviewSkeleton() {
  const block = "nz-paper rounded-[24px]"
  return (
    <LoadingVeil label={T.loading.page} className="mt-8">
      <div className="flex flex-col gap-6" aria-hidden="true">
        <div className={`${block} h-[104px]`} />
        <div className="grid grid-cols-[minmax(0,1fr)] gap-10 xl:grid-cols-[minmax(0,1fr)_300px] xl:gap-4">
          <div className="flex flex-col gap-5">
            <div className="h-[88px] rounded-[20px] bg-v-soft sm:h-[96px]" />
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
              {[0, 1, 2, 3, 4, 5].map((i) => <div key={i} className={`${block} h-[218px]`} />)}
            </div>
          </div>
          <div className={`${block} h-[180px]`} />
        </div>
      </div>
    </LoadingVeil>
  )
}

function Stats({ stats }: { stats: PortalStats }) {
  return (
    <>
      <ScoreCard average={stats.average} delta={stats.delta} trend={stats.trend} />
      {stats.week.length ? <WeekCard week={stats.week} /> : null}
    </>
  )
}

/** The four skills as tabs, each with its ten Modelltests as cards. Opens on the most practised skill, else the first with an open test. */
async function Parts({ exam, userId }: { exam: ExamId; userId: string }) {
  const [skills, practiced] = await Promise.all([portalSkills(exam), mostPracticedSkill(userId)])
  const slots = await Promise.all(skills.map((s) => modelltestSlots(exam, s.skill, userId)))
  const tabs = skills.map((s, i) => ({ skill: s.skill, name: KURZTEST_COPY.names[s.skill], free: s.free, slots: slots[i] }))
  const initial = tabs.find((t) => t.skill === practiced)?.skill ?? tabs.find((t) => t.slots.some((x) => x.state === "open"))?.skill ?? tabs[0].skill
  return <SkillTabs tabs={tabs} initial={initial} />
}

async function UserOverview() {
  const user = await getSessionUser()
  if (!user) return <Greeting user={null} date={today()} sub={T.focus.chooseSub} />
  const [exam, stats, goal, pass, families] = await Promise.all([focusExam(user.id, user.email), portalStats(user.id), examGoal(user.id), passStatus(user.id), switchFamilies()])
  const paying = hasAccess(pass, new Date())

  if (!exam) {
    return (
      <>
        <Greeting user={user} date={today()} sub={T.focus.chooseSub} />
        <div className="mt-8 grid grid-cols-[minmax(0,1fr)] gap-10 xl:grid-cols-[minmax(0,1fr)_300px] xl:gap-4">
          <ExamChooser families={families} />
          <aside className="flex flex-col gap-4 xl:sticky xl:top-8 xl:self-start">
            <Stats stats={stats} />
          </aside>
        </div>
        <PushAutoSync ask={!paying} />
      </>
    )
  }

  const info = focusInfo(exam)
  const done = paying ? null : await doneSkills(user.id, exam)
  return (
    <>
      <Greeting user={user} date={today()} sub={T.focus.sub(EXAMS[exam].short ?? EXAMS[exam].name)} />
      <div className="mt-8 flex flex-col gap-4">
        <ExamFocusHeader key={exam} exam={info} families={families} />
        {paying ? null : <PassBanner />}
      </div>
      <section id="teile" aria-labelledby="parts-h" className="mt-10 flex scroll-mt-24 flex-col gap-6">
        <h2 id="parts-h" className="text-[clamp(24px,2.6vw,30px)] leading-tight font-semibold tracking-[-0.02em]">
          {T.focus.partsH}
          <span className="text-v-muted"> {T.focus.partsMuted}</span>
        </h2>
        <div className="grid grid-cols-[minmax(0,1fr)] gap-10 xl:grid-cols-[minmax(0,1fr)_300px] xl:gap-4">
          <Parts exam={exam} userId={user.id} />
          <aside className="flex flex-col gap-4 xl:sticky xl:top-8 xl:self-start">
            {done ? <NextStepCard exam={exam} done={done} /> : null}
            <Stats stats={stats} />
            <ExamDateWidget goal={goal?.exam ? { exam: goal.exam, examDate: goal.examDate } : null} suggested={exam} left={goal?.examDate ? daysUntil(goal.examDate, new Date()) : null} />
          </aside>
        </div>
      </section>
      <PushAutoSync ask={!paying} />
    </>
  )
}

export default function DashboardPage() {
  return (
    <main className="mx-auto w-full max-w-[1180px] px-4 pt-8 pb-32 sm:px-6 lg:px-10 lg:pt-14 lg:pb-16">
      <Suspense
        fallback={
          <>
            <Greeting user={null} date={null} sub={null} />
            <OverviewSkeleton />
          </>
        }
      >
        <UserOverview />
      </Suspense>
    </main>
  )
}
