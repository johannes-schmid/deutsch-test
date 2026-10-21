import type { Metadata } from "next"
import { Suspense } from "react"
import { AdminNav, AdminNavLinks } from "@/components/admin/admin-nav"

export const metadata: Metadata = { robots: { index: false, follow: false } }

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh bg-background text-foreground">
      <header className="border-b">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3">
          <span className="text-sm font-semibold tracking-tight">deutschtest üben · Admin</span>
          <Suspense fallback={<AdminNavLinks />}>
            <AdminNav />
          </Suspense>
        </div>
      </header>
      {children}
    </div>
  )
}
