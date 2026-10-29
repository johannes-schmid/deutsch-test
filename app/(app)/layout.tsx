import type { Metadata } from "next"
import { Suspense } from "react"
import { Host_Grotesk, Reddit_Mono } from "next/font/google"
import { Clarity } from "@/components/analytics/clarity"
import { FunnelTracking } from "@/components/analytics/funnel"
import { DesignShell } from "@/components/design/shell"
import { SiteGlow } from "@/components/design/site-chrome"
import { AccountRow, Avatar, PortalMobileHeader, PortalSidebar, PortalTabBar, SidePlan } from "@/components/portal/portal-shell"
import { passView } from "@/lib/billing/view"
import { getSessionUser } from "@/lib/supabase/server"
import { portalFamilies } from "@/lib/portal"
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

async function HeaderAvatar() {
  return <Avatar user={await getSessionUser()} size={40} />
}

/** The portal: proxy.ts already sent anyone without a session to /anmelden. Only the user-specific bits wait for cookies. */
export default async function PortalLayout({ children }: { children: React.ReactNode }) {
  const groups = (await portalFamilies()).map((f) => ({ id: f.id, label: f.id === "dtz" ? "DTZ" : f.name, brand: f.brand, href: f.href, levels: f.exams.map((e) => ({ id: e.id, level: e.levels.join("–"), label: e.short ?? e.name, href: e.href })) }))
  return (
    <div className={`${hostGrotesk.variable} ${redditMono.variable}`}>
      <DesignShell id="nachtzug" lang="de">
        <div className="relative flex min-h-dvh items-start overflow-clip">
          <SiteGlow />
          <PortalSidebar
            groups={groups}
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
          <PortalTabBar />
        </div>
      </DesignShell>
      <Clarity />
      <FunnelTracking loadGa />
    </div>
  )
}
