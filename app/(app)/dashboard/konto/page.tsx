import type { Metadata } from "next"
import { Suspense } from "react"
import { AccountCard, AccountHead, PassCard, ProgressCard, type PassView, type ProgressItem } from "@/components/portal/portal-account"
import { PortalCrumbs } from "@/components/portal/portal-exam"
import { SignOutButton } from "@/components/portal/portal-client"
import { getSessionUser, type SessionUser } from "@/lib/supabase/server"
import { portalStats, skillProgress } from "@/lib/modelltest/portal"
import { EXAMS } from "@/lib/exams"
import { MODELLTESTS, portalPath } from "@/lib/portal"
import { SKILLS, isExam } from "@/lib/kurztest/data"
import { KURZTEST_COPY } from "@/lib/i18n/kurztest"
import { PORTAL_COPY } from "@/lib/i18n/portal"
import { PORTAL_HOME } from "@/lib/auth/redirect"
import { passView } from "@/lib/billing/view"
import { RENEWAL, formatEuro } from "@/lib/pricing"

const T = PORTAL_COPY

export const metadata: Metadata = { title: T.konto.title }

const dtzRows = (done: Record<string, { done: number }>): ProgressItem[] =>
  SKILLS.map((s) => ({ id: `dtz-${s}`, part: s, label: `DTZ · ${KURZTEST_COPY.names[s]}`, href: portalPath("dtz", s), done: done[s]?.done ?? 0, total: MODELLTESTS }))

const free = (): PassView => ({ state: "free", until: null, renewal: formatEuro(RENEWAL.cents) })

function Layout({ user, items, started, pass }: { user: SessionUser | null; items: ProgressItem[]; started: boolean; pass: PassView }) {
  return (
    <>
      <AccountHead user={user} />
      <div className="mt-8 grid grid-cols-[minmax(0,1fr)] items-start gap-4 lg:grid-cols-[minmax(0,1fr)_340px]">
        <ProgressCard items={items} empty={started ? null : { href: portalPath("dtz") }} />
        <div className="flex flex-col gap-4 lg:sticky lg:top-8">
          <PassCard pass={pass} />
          <AccountCard user={user} signOut={user ? <SignOutButton variant="full" /> : null} />
        </div>
      </div>
    </>
  )
}

async function Account() {
  const user = await getSessionUser()
  if (!user) return <Layout user={null} items={dtzRows({})} started={false} pass={free()} />
  const [stats, dtz, pass] = await Promise.all([portalStats(user.id), skillProgress("dtz", user.id), passView(user.id)])
  const others: ProgressItem[] = Object.entries(stats.done)
    .flatMap(([id, n]) => (id !== "dtz" && isExam(id) ? [{ id, brand: EXAMS[id].brand, label: EXAMS[id].short ?? EXAMS[id].name, href: portalPath(id), done: n, total: SKILLS.length * MODELLTESTS }] : []))
  return <Layout user={user} items={[...dtzRows(dtz), ...others]} started={Object.keys(stats.done).length > 0} pass={pass} />
}

/** The account page, after inburgeringoefenen.nl's /dashboard/profiel: who you are, your pass, your progress. */
export default function KontoPage() {
  return (
    <main className="mx-auto w-full max-w-[1080px] px-4 pt-6 pb-32 sm:px-6 lg:px-10 lg:pt-12 lg:pb-16">
      <PortalCrumbs items={[{ label: T.exam.back, href: PORTAL_HOME }, { label: T.nav.account }]} />
      <Suspense fallback={<Layout user={null} items={dtzRows({})} started pass={free()} />}>
        <Account />
      </Suspense>
    </main>
  )
}
