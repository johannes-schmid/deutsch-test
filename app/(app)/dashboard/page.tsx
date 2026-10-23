import type { Metadata } from "next"
import { Suspense } from "react"
import { FamilyCard, ScoreCard, WeekCard } from "@/components/portal/portal-overview"
import { getSessionUser, type SessionUser } from "@/lib/supabase/server"
import { portalFamilies, type PortalFamily } from "@/lib/portal"
import { portalStats, type PortalStats } from "@/lib/modelltest/portal"
import { EXAMS, type ExamId } from "@/lib/exams"
import { isSkill } from "@/lib/kurztest/data"
import { KURZTEST_COPY } from "@/lib/i18n/kurztest"
import { PORTAL_COPY } from "@/lib/i18n/portal"

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

async function UserOverview({ families }: { families: PortalFamily[] }) {
  const user = await getSessionUser()
  const stats = user ? await portalStats(user.id) : EMPTY
  const started = families.filter((f) => f.exams.some((e) => stats.done[e.id])).length
  return (
    <>
      <Greeting user={user} date={today()} sub={started ? T.started(started) : T.sub} />
      <Body families={families} stats={stats} />
    </>
  )
}

function Body({ families, stats }: { families: PortalFamily[]; stats: PortalStats }) {
  return (
    <section id="pruefungen" aria-labelledby="exams-h" className="mt-10 flex scroll-mt-24 flex-col gap-6">
      <h2 id="exams-h" className="text-[clamp(24px,2.6vw,30px)] leading-tight font-semibold tracking-[-0.02em]">
        {T.examsH}
        <span className="text-v-muted"> {T.examsMuted}</span>
      </h2>
      <div className="grid grid-cols-[minmax(0,1fr)] gap-10 xl:grid-cols-[minmax(0,1fr)_300px] xl:gap-4">
        <Families families={families} stats={stats} />
        <aside className="flex flex-col gap-4 xl:sticky xl:top-8 xl:self-start">
          <Stats stats={stats} />
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
