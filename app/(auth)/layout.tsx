import type { Metadata } from "next"
import { Host_Grotesk, Reddit_Mono } from "next/font/google"
import { Clarity } from "@/components/analytics/clarity"
import { FunnelTracking } from "@/components/analytics/funnel"
import { DesignShell } from "@/components/design/shell"
import "../(main)/landing.css"

const hostGrotesk = Host_Grotesk({ subsets: ["latin"], style: ["normal", "italic"], variable: "--font-host" })
const redditMono = Reddit_Mono({ subsets: ["latin"], variable: "--font-redditmono" })

export const metadata: Metadata = { robots: { index: false, follow: false } }

/** Sign-up and sign-in: one full-screen living gradient, no site nav, so nothing pulls away from the one button. */
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${hostGrotesk.variable} ${redditMono.variable}`}>
      <DesignShell id="nachtzug" lang="de">
        <div className="nz-auth-field">
          <span className="nz-auth-orbs" aria-hidden="true"><i /><i /><i /></span>
          <div className="v-noise pointer-events-none absolute inset-0 -z-1" aria-hidden="true" />
          {children}
        </div>
      </DesignShell>
      <Clarity />
      <FunnelTracking loadGa />
    </div>
  )
}
