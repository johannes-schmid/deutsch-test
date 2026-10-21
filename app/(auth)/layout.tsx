import type { Metadata } from "next"
import { Host_Grotesk, Reddit_Mono } from "next/font/google"
import { DesignShell } from "@/components/design/shell"
import { SiteGlow } from "@/components/design/site-chrome"
import "../(main)/landing.css"

const hostGrotesk = Host_Grotesk({ subsets: ["latin"], style: ["normal", "italic"], variable: "--font-host" })
const redditMono = Reddit_Mono({ subsets: ["latin"], variable: "--font-redditmono" })

export const metadata: Metadata = { robots: { index: false, follow: false } }

/** Sign-up and sign-in: the Nachtzug tokens and glow, but no site nav, so nothing pulls away from the one button. */
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${hostGrotesk.variable} ${redditMono.variable}`}>
      <DesignShell id="nachtzug" lang="de">
        <div className="relative flex min-h-dvh flex-col overflow-clip">
          <SiteGlow />
          {children}
        </div>
      </DesignShell>
    </div>
  )
}
