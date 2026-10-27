import type { Metadata } from "next"
import { Suspense } from "react"
import { FamilyCard, ScoreCard, WeekCard } from "@/components/portal/portal-overview"
import { getSessionUser, type SessionUser } from "@/lib/supabase/server"
import { portalFamilies, type PortalFamily } from "@/lib/portal"
import { portalStats, type PortalStats } from "@/lib/modelltest/portal"
import { EXAMS, type ExamId } from "@/lib/exams"
import { isExam, isSkill } from "@/lib/kurztest/data"
import { KURZTEST_COPY } from "@/lib/i18n/kurztest"
import { PORTAL_COPY } from "@/lib/i18n/portal"
import { ExamDateWidget } from "@/components/portal/exam-goal"
import { NextStepCard } from "@/components/portal/next-step"
import { PushAutoSync } from "@/components/portal/push-sync"
import { doneSkills } from "@/lib/lifecycle/state"
import { passStatus } from "@/lib/entitlements"
import { hasAccess } from "@/lib/billing/period"
import type { Skill } from "@/lib/lifecycle/push-copy"
import { examGoal } from "@/lib/lifecycle/prefs"
import { daysUntil } from "@/lib/lifecycle/rules"

const T = PORTAL_COPY

export const metadata: Metadata = { title: T.title }

const today = () => new Intl.DateTimeFormat("de-DE", { weekday: "long", day: "numeric", month: "long", timeZone: "Europe/Berlin" }).format(new Date())

function Greeting({ user, date, sub }: { user: SessionUser | null; date: string | null; sub: string }) {
  return (
    <header className="flex flex-col gap-3">
      <p className="v-num min-h-5 text-[13px] text-v-muted">{date}</p>
      <h1 className="v-display pb-1 text-[clamp(34px,4.6vw,52px)] leading-[1.05]">{T.hello(user?.firstName ?? null)}</h1>
      <p className="text-[17px] text-v-muted sm:text-lg">{sub}</p>
    </header>
  )
}

const EMPTY: PortalStats = { done: {}, recent: [], average: null, delta: null, trend: [], week: [] }

function Families({ families, stats }: { families: PortalFamily[]; stats: PortalStats }) {
  return (
    <ul className="grid grid-cols-[minmax(0,1fr)] gap-4 sm:grid-cols-2">
      {families.map((f) => {
        const done = f.exams.reduce((a, e) => a + (stats.done[e.id] ?? 0), 0)
        const last = stats.recent.find((r) => f.exams.some((e) => e.id === r.exam))
        const level = last && f.exams.length > 1 ? (EXAMS[last.exam as ExamId]?.levels.join("–") ?? null) : null
        const line = last && isSkill(last.skill) ? T.family.last(KURZTEST_COPY.names[last.skill], last.number, level) : f.summary
        return (
          <li key={f.id}>
            <FamilyCard name={f.name} brand={f.brand} levels={f.levels.length > 1 ? `${f.levels[0]}–${f.levels.at(-1)}` : f.levels[0]} href={f.href} line={line} done={done} total={f.total} />
          </li>
        )
      })}
    </ul>
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

type Side = { goal: { exam: ExamId; examDate: string | null } | null; suggested: ExamId; next: { exam: ExamId; done: Skill[] } | null }

async function UserOverview({ families }: { families: PortalFamily[] }) {
  const user = await getSessionUser()
  const [stats, goal, pass] = user ? await Promise.all([portalStats(user.id), examGoal(user.id), passStatus(user.id)]) : [EMPTY, null, null]
  const started = families.filter((f) => f.exams.some((e) => stats.done[e.id])).length
  const recent = stats.recent[0]?.exam
  const exam: ExamId = goal?.exam ?? (isExam(recent) ? recent : "dtz")
  const paying = pass ? hasAccess(pass, new Date()) : false
  const side: Side | null = user
    ? {
        goal: goal?.exam ? { exam: goal.exam, examDate: goal.examDate } : null,
        suggested: exam,
        next: paying ? null : { exam, done: await doneSkills(user.id, exam) },
      }
    : null
  return (
    <>
      <Greeting user={user} date={today()} sub={started ? T.started(started) : T.sub} />
      <Body families={families} stats={stats} side={side} />
      {user ? <PushAutoSync ask={!paying} /> : null}
    </>
  )
}

function Body({ families, stats, side = null }: { families: PortalFamily[]; stats: PortalStats; side?: Side | null }) {
  return (
    <section id="pruefungen" aria-labelledby="exams-h" className="mt-10 flex scroll-mt-24 flex-col gap-6">
      <h2 id="exams-h" className="text-[clamp(24px,2.6vw,30px)] leading-tight font-semibold tracking-[-0.02em]">
        {T.examsH}
        <span className="text-v-muted"> {T.examsMuted}</span>
      </h2>
      <div className="grid grid-cols-[minmax(0,1fr)] gap-10 xl:grid-cols-[minmax(0,1fr)_300px] xl:gap-4">
        <Families families={families} stats={stats} />
        <aside className="flex flex-col gap-4 xl:sticky xl:top-8 xl:self-start">
          {side?.next ? <NextStepCard exam={side.next.exam} done={side.next.done} /> : null}
          <Stats stats={stats} />
          {side ? <ExamDateWidget goal={side.goal} suggested={side.suggested} left={side.goal?.examDate ? daysUntil(side.goal.examDate, new Date()) : null} /> : null}
        </aside>
      </div>
    </section>
  )
}

export default async function DashboardPage() {
  const families = await portalFamilies()
  return (
    <main className="mx-auto w-full max-w-[1180px] px-4 pt-8 pb-32 sm:px-6 lg:px-10 lg:pt-14 lg:pb-16">
      <Suspense
        fallback={
          <>
            <Greeting user={null} date={null} sub={T.sub} />
            <Body families={families} stats={EMPTY} />
          </>
        }
      >
        <UserOverview families={families} />
      </Suspense>
    </main>
  )
}
