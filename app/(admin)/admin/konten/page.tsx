import { Suspense } from "react"
import { notFound } from "next/navigation"
import { AdminPage, PanelSkeleton } from "@/components/admin/admin-ui"
import { UsersTable } from "@/components/admin/users-table"
import { requireAdmin } from "@/lib/admin/guard"
import { usersOverview } from "@/lib/admin/users"

export const metadata = { title: "Konten" }

async function Users() {
  if (!(await requireAdmin())) notFound()
  return <UsersTable users={await usersOverview()} />
}

export default function AdminUsersPage() {
  return (
    <AdminPage title="Konten" description="Jedes Google-Konto mit Pass, Zahlungen, Prüfungsziel und Modelltests. Ein Klick öffnet die Details; dort kannst du den Vertrag für die Person kündigen.">
      <Suspense fallback={<PanelSkeleton rows={12} />}>
        <Users />
      </Suspense>
    </AdminPage>
  )
}
