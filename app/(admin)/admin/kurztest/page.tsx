import { Suspense } from "react"
import { notFound } from "next/navigation"
import { AdminPage, DataTable, Empty, PanelSkeleton, Section, TBODY, TD, TH, THEAD, TOTAL } from "@/components/admin/admin-ui"
import { requireAdmin } from "@/lib/admin/guard"
import { EXAMS, type ExamId } from "@/lib/exams"
import { KURZTEST_COPY } from "@/lib/i18n/kurztest"
import { OUTCOMES, funnel } from "@/lib/kurztest/stats"

export const metadata = { title: "Gratis-Test · Funnel" }

const examName = (id?: string) => {
  const e = EXAMS[(id ?? "dtz") as ExamId]
  return e ? (e.short ?? e.name) : id
}
const pct = (a: number, b: number) => (b ? `${Math.round((a / b) * 100)} %` : "–")

async function Funnel() {
  if (!(await requireAdmin())) notFound()
  const rows = await funnel()
  const total = rows.reduce((s, r) => ({ attempts: s.attempts + r.attempts, leads: s.leads + r.leads }), { attempts: 0, leads: 0 })
  if (!rows.length) return <Empty>Noch keine Gratis-Tests. Sobald jemand einen Test abgibt, steht er hier.</Empty>

  return (
    <DataTable className="whitespace-nowrap">
      <thead className={THEAD}>
        <tr>
          <th className={TH}>Prüfung</th>
          <th className={TH}>Teil</th>
          <th className={`${TH} text-end`}>Abgegeben</th>
          <th className={`${TH} text-end`}>E-Mails</th>
          <th className={`${TH} text-end`}>Quote</th>
          {OUTCOMES.map((l) => <th key={l} className={`${TH} text-end`}>{l}</th>)}
        </tr>
      </thead>
      <tbody className={TBODY}>
        {rows.map((r) => (
          <tr key={`${r.exam}-${r.skill}`}>
            <td className={TD}>{examName(r.exam)}</td>
            <td className={`${TD} font-medium`}>{KURZTEST_COPY.names[r.skill as keyof typeof KURZTEST_COPY.names]}</td>
            <td className={`${TD} text-end`}>{r.attempts}</td>
            <td className={`${TD} text-end`}>{r.leads}</td>
            <td className={`${TD} text-end`}>{pct(r.leads, r.attempts)}</td>
            {OUTCOMES.map((l) => <td key={l} className={`${TD} text-end ${r.outcomes[l] ? "" : "text-v-muted/60"}`}>{r.outcomes[l]}</td>)}
          </tr>
        ))}
      </tbody>
      <tfoot>
        <tr className={TOTAL}>
          <td className={TD} colSpan={2}>Gesamt</td>
          <td className={`${TD} text-end`}>{total.attempts}</td>
          <td className={`${TD} text-end`}>{total.leads}</td>
          <td className={`${TD} text-end`}>{pct(total.leads, total.attempts)}</td>
          <td className={TD} colSpan={OUTCOMES.length} />
        </tr>
      </tfoot>
    </DataTable>
  )
}

export default function KurztestFunnelPage() {
  return (
    <AdminPage title="Funnel" description="Gratis-Tests pro Prüfung und Teil: wie viele abgegeben wurden, wie viele ihr Ergebnis per E-Mail freigeschaltet haben und mit welchem Ergebnis.">
      <Section title="Pro Prüfung und Teil" note="Abgegeben: Test abgeschickt. E-Mails: Ergebnis freigeschaltet. Die Ergebnisspalten zählen E-Mails; „offen“ heißt, die Auswertung ist fehlgeschlagen.">
        <Suspense fallback={<PanelSkeleton />}>
          <Funnel />
        </Suspense>
      </Section>
    </AdminPage>
  )
}
