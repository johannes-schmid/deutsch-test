import type { Metadata } from "next"
import { Suspense } from "react"
import { Host_Grotesk, Reddit_Mono } from "next/font/google"
import { Clarity } from "@/components/analytics/clarity"
import { FunnelTracking } from "@/components/analytics/funnel"
import { DesignShell } from "@/components/design/shell"
import { SiteGlow } from "@/components/design/site-chrome"
import { AccountRow, Avatar, PortalMobileHeader, PortalSidebar, PortalTabBar, SideParts, SidePartsSkeleton, SidePlan } from "@/components/portal/portal-shell"
import { passView } from "@/lib/billing/view"
import { getSessionUser } from "@/lib/supabase/server"
import { portalSkills } from "@/lib/portal"
import { focusExam, skillProgress } from "@/lib/modelltest/portal"
import { EXAMS } from "@/lib/exams"
import { KURZTEST_COPY } from "@/lib/i18n/kurztest"
import "../(main)/landing.css"

const hostGrotesk = Host_Grotesk({ subsets: ["latin"], style: ["normal", "italic"], variable: "--font-host" })
const redditMono = Reddit_Mono({ subsets: ["latin"], variable: "--font-redditmono" })

export const metadata: Metadata = { robots: { index: false, follow: false } }

async function Account() {
  return <AccountRow user={await getSessionUser()} />
}

async function Plan() {
  const user = await getSessionUser()
  const pass = user ? await passView(user.id) : null
  return <SidePlan until={pass && (pass.state === "renewing" || pass.state === "canceled") ? pass.until : null} />
}

/** The four parts of the exam the dashboard is on. */
async function Parts({ sheet }: { sheet?: boolean }) {
  const user = await getSessionUser()
  const exam = user ? await focusExam(user.id, user.email) : null
  if (!user || !exam) return <SideParts exam={null} parts={[]} sheet={sheet} />
  const [skills, progress] = await Promise.all([portalSkills(exam), skillProgress(exam, user.id)])
  const parts = skills.map((s) => ({ part: s.skill, label: KURZTEST_COPY.names[s.skill], href: s.href, done: progress[s.skill]?.done ?? 0 }))
  return <SideParts exam={EXAMS[exam].short ?? EXAMS[exam].name} parts={parts} sheet={sheet} />
}

async function HeaderAvatar() {
  return <Avatar user={await getSessionUser()} size={40} />
}

/** The portal: proxy.ts already sent anyone without a session to /anmelden. Only the user-specific bits wait for cookies. */
export default function PortalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${hostGrotesk.variable} ${redditMono.variable}`}>
      <DesignShell id="nachtzug" lang="de">
        <div className="relative flex min-h-dvh items-start overflow-clip">
          <SiteGlow />
          <PortalSidebar
            parts={
              <Suspense fallback={<SidePartsSkeleton />}>
                <Parts />
              </Suspense>
            }
            plan={
              <Suspense fallback={<SidePlan until={null} />}>
                <Plan />
              </Suspense>
            }
            account={
              <Suspense fallback={<AccountRow user={null} />}>
                <Account />
              </Suspense>
            }
          />
          <div className="relative z-10 min-w-0 flex-1">
            <PortalMobileHeader
              avatar={
                <Suspense fallback={<Avatar user={null} size={40} />}>
                  <HeaderAvatar />
                </Suspense>
              }
            />
            {children}
          </div>
          <PortalTabBar
            parts={
              <Suspense fallback={<SidePartsSkeleton />}>
                <Parts sheet />
              </Suspense>
            }
          />
        </div>
      </DesignShell>
      <Clarity />
      <FunnelTracking loadGa />
    </div>
  )
}
