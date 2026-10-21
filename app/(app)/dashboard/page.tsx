import type { Metadata } from "next"
import { Suspense } from "react"
import { ExamCard } from "@/components/kurztest/exam-card"
import { Avatar } from "@/components/portal/portal-shell"
import { SignOutButton } from "@/components/portal/portal-client"
import { getSessionUser, type SessionUser } from "@/lib/supabase/server"
import { portalExamGroups } from "@/lib/portal"
import { KURZTEST_COPY } from "@/lib/i18n/kurztest"
import { PORTAL_COPY } from "@/lib/i18n/portal"

const T = PORTAL_COPY

export const metadata: Metadata = { title: T.title }

const today = () => new Intl.DateTimeFormat("de-DE", { weekday: "long", day: "numeric", month: "long", timeZone: "Europe/Berlin" }).format(new Date())

function Greeting({ user, date }: { user: SessionUser | null; date: string | null }) {
  return (
    <header className="flex flex-col gap-3">
      <p className="v-num min-h-5 text-[13px] text-v-muted">{date}</p>
      <h1 className="v-display pb-1 text-[clamp(34px,4.6vw,52px)] leading-[1.05]">{T.hello(user?.firstName ?? null)}</h1>
      <p className="text-[17px] text-v-muted sm:text-lg">{T.sub}</p>
    </header>
  )
}

async function UserGreeting() {
  const user = await getSessionUser()
  return <Greeting user={user} date={today()} />
}

function AccountCard({ user }: { user: SessionUser | null }) {
  return (
    <section id="konto" aria-label={T.nav.account} className="nz-paper flex scroll-mt-24 flex-col gap-4 rounded-[24px] p-5 lg:hidden">
      <div className="flex items-center gap-3">
        <Avatar user={user} size={48} />
        <span className="flex min-w-0 flex-col leading-tight">
          <b className="truncate text-[16px] font-semibold">{user?.name ?? user?.email ?? " "}</b>
          {user?.name ? <span className="truncate text-[14px] text-v-muted">{user.email}</span> : null}
        </span>
      </div>
      {user ? <SignOutButton variant="full" /> : null}
    </section>
  )
}

async function UserAccountCard() {
  return <AccountCard user={await getSessionUser()} />
}

export default async function DashboardPage() {
  const groups = await portalExamGroups()
  return (
    <main className="mx-auto w-full max-w-[1180px] px-4 pt-8 pb-32 sm:px-6 lg:px-10 lg:pt-14 lg:pb-16">
      <Suspense fallback={<Greeting user={null} date={null} />}>
        <UserGreeting />
      </Suspense>

      <div className="mt-10 grid grid-cols-[minmax(0,1fr)] gap-10 xl:grid-cols-[minmax(0,1fr)_300px] xl:gap-8">
        <section id="pruefungen" aria-labelledby="exams-h" className="flex scroll-mt-24 flex-col gap-8">
          <h2 id="exams-h" className="text-[clamp(24px,2.6vw,30px)] leading-tight font-semibold tracking-[-0.02em]">
            {T.examsH}
            <span className="text-v-muted"> {T.examsMuted}</span>
          </h2>
          {groups.map((g) => (
            <div key={g.level} className="flex flex-col gap-4">
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <span className="rounded-full bg-v-ink px-3.5 py-1 text-[15px] font-semibold text-v-bg">{T.levels[g.level]}</span>
                <span className="text-[14.5px] text-v-muted">{KURZTEST_COPY.overview.levels[g.level].hint}</span>
              </div>
              <ul className="grid grid-cols-[minmax(0,1fr)] gap-4 sm:grid-cols-2 2xl:grid-cols-3">
                {g.exams.map((e) => (
                  <li key={e.id}>
                    <ExamCard exam={e} href={e.href} cta={T.open} chip={e.levels.length > 1 ? e.levels.join("–") : null} />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </section>

        <aside className="flex flex-col gap-4 xl:sticky xl:top-8 xl:self-start">
          <section aria-labelledby="soon-h" className="flex flex-col gap-4 rounded-[24px] border border-dashed border-v-ink/20 bg-v-surface/50 p-5">
            <h2 id="soon-h" className="text-[17px] font-semibold tracking-[-0.01em]">{T.next.h}</h2>
            <ul className="flex flex-col gap-3 text-[15px] leading-snug text-v-muted">
              {T.next.items.map((item) => (
                <li key={item} className="flex gap-3">
                  <span className="mt-[7px] size-2 shrink-0 rounded-full border border-dashed border-v-ink/40" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          </section>
          <Suspense fallback={<AccountCard user={null} />}>
            <UserAccountCard />
          </Suspense>
        </aside>
      </div>
    </main>
  )
}
