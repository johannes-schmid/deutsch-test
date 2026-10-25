import { Suspense } from "react"
import { notFound } from "next/navigation"
import { Download } from "lucide-react"
import { AdminPage, DataTable, Empty, PanelSkeleton, TBODY, TD, TH, THEAD } from "@/components/admin/admin-ui"
import { requireAdmin } from "@/lib/admin/guard"
import { EXAMS, type ExamId } from "@/lib/exams"
import { KURZTEST_COPY } from "@/lib/i18n/kurztest"
import { leads } from "@/lib/kurztest/stats"

export const metadata = { title: "Gratis-Test · E-Mails" }

const LIMIT = 50
const examName = (id?: string) => EXAMS[(id ?? "dtz") as ExamId]?.name ?? id
const date = (iso: string) => new Date(iso).toLocaleString("de-DE", { dateStyle: "short", timeStyle: "short", timeZone: "Europe/Berlin" })

async function Leads() {
  if (!(await requireAdmin())) notFound()
  const latest = await leads(LIMIT)
  if (!latest.length) return <Empty>Noch keine E-Mails. Sobald jemand einen Gratis-Test abschließt und sein Ergebnis freischaltet, steht er hier.</Empty>

  return (
    <DataTable>
      <thead className={THEAD}>
        <tr>
          <th className={TH}>Datum</th>
          <th className={TH}>E-Mail</th>
          <th className={TH}>Prüfung</th>
          <th className={TH}>Teil</th>
          <th className={TH}>Ergebnis</th>
          <th className={TH}>Tipps</th>
        </tr>
      </thead>
      <tbody className={TBODY}>
        {latest.map((l) => (
          <tr key={l.id}>
            <td className={`${TD} whitespace-nowrap text-v-muted`}>{date(l.at)}</td>
            <td className={`${TD} font-medium break-all`}>{l.email}</td>
            <td className={`${TD} whitespace-nowrap`}>{examName(l.exam)}</td>
            <td className={TD}>{KURZTEST_COPY.names[l.skill] ?? l.skill}</td>
            <td className={`${TD} whitespace-nowrap`}>{l.level ?? "–"}</td>
            <td className={TD}>{l.marketing ? "ja" : <span className="text-v-muted">nein</span>}</td>
          </tr>
        ))}
      </tbody>
    </DataTable>
  )
}

export default function KurztestEmailsPage() {
  return (
    <AdminPage
      title="E-Mails"
      description={`Die letzten ${LIMIT} Gratis-Test-Ergebnisse, die per E-Mail freigeschaltet wurden. „Tipps“: ja heißt, die Person hat Prüfungstipps per E-Mail angefordert.`}
      actions={
        <a href="/api/admin/kurztest" className="flex h-10 items-center gap-2 rounded-full bg-v-ink px-4 text-[14px] font-semibold text-v-bg transition-[opacity,transform] duration-150 ease-out hover:opacity-90 focus-visible:ring-2 focus-visible:ring-v-ink focus-visible:ring-offset-2 focus-visible:outline-none active:scale-[0.97]">
          <Download className="size-4" aria-hidden="true" />
          Alle als CSV
        </a>
      }
    >
      <Suspense fallback={<PanelSkeleton rows={10} />}>
        <Leads />
      </Suspense>
    </AdminPage>
  )
}
