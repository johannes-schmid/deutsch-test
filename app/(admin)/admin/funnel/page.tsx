import { Suspense } from "react"
import { notFound } from "next/navigation"
import { AdminPage, DataTable, Empty, Panel, PanelSkeleton, Section, TBODY, TD, TH, THEAD, TOTAL } from "@/components/admin/admin-ui"
import { requireAdmin } from "@/lib/admin/guard"
import type { FunnelWeek } from "@/lib/admin/funnel"
import { weekLabel } from "@/lib/admin/sales"
import { funnelOverview } from "@/lib/admin/stats"
import { EXAMS, type ExamId } from "@/lib/exams"
import { KURZTEST_COPY } from "@/lib/i18n/kurztest"

export const metadata = { title: "Funnel" }

const pct = (a: number, b: number) => (b ? `${Math.round((a / b) * 100)} %` : "–")
const examName = (id: string) => EXAMS[id as ExamId]?.short ?? EXAMS[id as ExamId]?.name ?? id
const skillName = (s: string) => KURZTEST_COPY.names[s as keyof typeof KURZTEST_COPY.names] ?? s

type Stage = { key: keyof Omit<FunnelWeek, "week" | "paywallAttempts">; label: string; hint: string }
const STAGES: Stage[] = [
  { key: "signups", label: "Neues Konto", hint: "mit Google registriert" },
  { key: "started", label: "Modelltest gestartet", hint: "irgendeinen Modelltest geöffnet" },
  { key: "paywall", label: "Paywall gesehen", hint: "die Hälfte von Modelltest 1 geschafft" },
  { key: "checkout", label: "Kasse geöffnet", hint: "Mollie-Checkout für einen Erstkauf" },
  { key: "paid", label: "Bezahlt", hint: "Erstkauf bezahlt" },
]

/** One stage of the week: label, people, share of the stage before, share of all sign-ups; the bar is the share of sign-ups. */
function StageRow({ stage, week, prev, top, previous }: { stage: Stage; week: FunnelWeek; prev: number | null; top: number; previous: FunnelWeek }) {
  const n = week[stage.key]
  const share = top ? Math.max(2, Math.round((n / top) * 100)) : 0
  return (
    <li className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-4 gap-y-1.5 px-4 py-3.5 sm:grid-cols-[13rem_minmax(0,1fr)_4rem_9rem_6rem] sm:px-5">
      <span className="flex flex-col">
        <span className="text-[14px] font-medium">{stage.label}</span>
        <span className="text-[12.5px] text-v-muted">{stage.hint}</span>
      </span>
      <b className="text-[22px] leading-none font-semibold tracking-[-0.02em] tabular-nums sm:order-3 sm:text-end sm:text-[15px]">{n}</b>
      <span className="col-span-2 h-1.5 overflow-hidden rounded-full bg-v-soft sm:order-2 sm:col-span-1" aria-hidden="true">
        <span className="block h-full rounded-full bg-[var(--p-ember)]" style={{ width: n ? `${share}%` : 0 }} />
      </span>
      <span className="col-span-2 flex justify-between text-[12.5px] text-v-muted tabular-nums sm:order-4 sm:col-span-2 sm:grid sm:grid-cols-subgrid sm:text-end">
        <span>{prev === null ? "" : `${pct(n, prev)} vom Schritt davor`}</span>
        <span>Vorwoche {previous[stage.key]}</span>
      </span>
    </li>
  )
}

async function Overview() {
  if (!(await requireAdmin())) notFound()
  const f = await funnelOverview()
  const { label, range } = weekLabel(f.thisWeek.week)
  const top = Math.max(f.thisWeek.signups, f.thisWeek.started, 1)

  return (
    <>
      <Section title={`Diese Woche · ${label}`} aside={<span className="text-[13px] text-v-muted tabular-nums">{range}</span>} note="Jede Zeile zählt Personen, die den Schritt in dieser Woche erreicht haben, nicht Kohorten: jemand kann sich letzte Woche registriert haben und diese Woche die Paywall sehen. Paywall gesehen = der Halbzeit-Stopp in Modelltest 1 wurde erreicht; sobald jemand bezahlt, wird der Stopp gelöscht, deshalb zählen Käufer mit einem Modelltest 1 davor ebenfalls hier.">
        <Panel>
          <ol className="divide-y divide-v-line">
            {STAGES.map((s, i) => (
              <StageRow key={s.key} stage={s} week={f.thisWeek} prev={i ? f.thisWeek[STAGES[i - 1].key] : null} top={top} previous={f.lastWeek} />
            ))}
          </ol>
          <div className="grid grid-cols-3 gap-px border-t border-v-line bg-v-line [&>*]:bg-v-surface">
            <Tile label="Konto → Paywall" value={pct(f.thisWeek.paywall, f.thisWeek.signups)} sub={`Vorwoche ${pct(f.lastWeek.paywall, f.lastWeek.signups)}`} />
            <Tile label="Paywall → bezahlt" value={pct(f.thisWeek.paid, f.thisWeek.paywall)} sub={`Vorwoche ${pct(f.lastWeek.paid, f.lastWeek.paywall)}`} />
            <Tile label="Wartet an der Paywall" value={f.thisWeek.paywallAttempts} sub={`${f.total.paywallAttempts} insgesamt`} />
          </div>
        </Panel>
      </Section>

      <Section title="Paywall nach Prüfung und Teil" note="Offene Halbzeit-Stopps nach dem Modelltest, in dem sie erreicht wurden. Bezahlte verschwinden hier, weil der Stopp beim Weitermachen gelöscht wird.">
        {f.paywallBySkill.length ? (
          <DataTable className="whitespace-nowrap">
            <thead className={THEAD}>
              <tr>
                <th className={TH}>Prüfung</th>
                <th className={TH}>Teil</th>
                <th className={`${TH} text-end`}>Diese Woche</th>
                <th className={`${TH} text-end`}>Vorwoche</th>
                <th className={`${TH} text-end`}>Gesamt</th>
              </tr>
            </thead>
            <tbody className={TBODY}>
              {f.paywallBySkill.map((r) => (
                <tr key={`${r.exam}/${r.skill}`}>
                  <td className={TD}>{examName(r.exam)}</td>
                  <td className={`${TD} font-medium`}>{skillName(r.skill)}</td>
                  <td className={`${TD} text-end ${r.thisWeek ? "" : "text-v-muted/60"}`}>{r.thisWeek}</td>
                  <td className={`${TD} text-end ${r.lastWeek ? "" : "text-v-muted/60"}`}>{r.lastWeek}</td>
                  <td className={`${TD} text-end`}>{r.total}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className={TOTAL}>
                <td className={TD} colSpan={2}>Gesamt</td>
                <td className={`${TD} text-end`}>{f.thisWeek.paywallAttempts}</td>
                <td className={`${TD} text-end`}>{f.lastWeek.paywallAttempts}</td>
                <td className={`${TD} text-end`}>{f.total.paywallAttempts}</td>
              </tr>
            </tfoot>
          </DataTable>
        ) : (
          <Empty>Noch niemand hat die Paywall erreicht. Sobald jemand die freie Hälfte von Modelltest 1 schafft, steht es hier.</Empty>
        )}
      </Section>

      <Section title="Seit Start" note="Alle Wochen zusammen, ebenfalls Personen pro Schritt.">
        <Panel>
          <div className="grid grid-cols-2 gap-px bg-v-line sm:grid-cols-4 [&>*]:bg-v-surface">
            <Tile label="Modelltest gestartet" value={f.total.started} sub="Personen" />
            <Tile label="Paywall gesehen" value={f.total.paywall} sub={pct(f.total.paywall, f.total.started) + " der Startenden"} />
            <Tile label="Kasse geöffnet" value={f.total.checkout} sub={pct(f.total.checkout, f.total.paywall) + " der Paywall"} />
            <Tile label="Bezahlt" value={f.total.paid} sub={pct(f.total.paid, f.total.paywall) + " der Paywall"} />
          </div>
        </Panel>
      </Section>
    </>
  )
}

function Tile({ label, value, sub }: { label: string; value: React.ReactNode; sub: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1 p-4 sm:p-5">
      <span className="text-[13px] text-v-muted">{label}</span>
      <b className="text-[24px] leading-tight font-semibold tracking-[-0.02em] tabular-nums sm:text-[28px]">{value}</b>
      <span className="text-[12.5px] leading-snug text-v-muted tabular-nums sm:text-[13px]">{sub}</span>
    </div>
  )
}

export default function FunnelPage() {
  return (
    <AdminPage title="Funnel" description="Vom neuen Konto bis zum Kauf: wie viele Personen jeden Schritt diese Woche erreicht haben, und wo die Paywall gesehen wurde.">
      <Suspense fallback={<PanelSkeleton rows={5} />}>
        <Overview />
      </Suspense>
    </AdminPage>
  )
}
