import type { Metadata } from "next"
import { Suspense } from "react"
import { Host_Grotesk, Reddit_Mono } from "next/font/google"
import { AdminAccount, AdminMobileNav, AdminSidebar } from "@/components/admin/admin-shell"
import { DesignShell } from "@/components/design/shell"
import { requireAdmin } from "@/lib/admin/guard"
import "../(main)/landing.css"

// The set review renders the real exam components, so the whole admin sits on the Nachtzug tokens and fonts.
const hostGrotesk = Host_Grotesk({ subsets: ["latin"], style: ["normal", "italic"], variable: "--font-host" })
const redditMono = Reddit_Mono({ subsets: ["latin"], variable: "--font-redditmono" })

export const metadata: Metadata = { title: { template: "%s · Admin", default: "Admin" }, robots: { index: false, follow: false } }

async function Account() {
  return <AdminAccount email={await requireAdmin()} />
}

/** proxy.ts already 404s non-admins on /admin; every page checks requireAdmin() again on its own. */
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const account = (
    <Suspense fallback={<AdminAccount email={null} />}>
      <Account />
    </Suspense>
  )
  return (
    <div className={`${hostGrotesk.variable} ${redditMono.variable}`}>
      <DesignShell id="nachtzug" lang="de">
        <div className="flex min-h-dvh items-start">
          <AdminSidebar account={account} />
          <div className="min-w-0 flex-1">
            <AdminMobileNav account={account} />
            {children}
          </div>
        </div>
      </DesignShell>
    </div>
  )
}
