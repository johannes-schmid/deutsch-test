import { Suspense } from "react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowRight } from "lucide-react"
import { AdminPage, DataTable, Empty, Panel, PanelSkeleton, Progress, Section, TBODY, TD, TH, THEAD, TOTAL } from "@/components/admin/admin-ui"
import { requireAdmin } from "@/lib/admin/guard"
import { ADMIN_EXAMS, modelltestPath } from "@/lib/admin/nav"
import { signupsPerWeek } from "@/lib/admin/stats"
import { funnel } from "@/lib/kurztest/stats"
import { MODELLTESTS } from "@/lib/portal"
import { SKILLS, setOverview } from "@/lib/modelltest/admin"

export const metadata = { title: "Übersicht" }

const DAY = 86_400_000

/** ISO week number of a Monday given as YYYY-MM-DD. */
function isoWeek(monday: string) {
  const d = new Date(`${monday}T00:00:00Z`)
  const thursday = new Date(d.getTime() + 3 * DAY)
  const jan1 = Date.UTC(thursday.getUTCFullYear(), 0, 1)
  return Math.floor((thursday.getTime() - jan1) / DAY / 7) + 1
}

const short = (d: Date) => d.toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit", timeZone: "UTC" })

function range(monday: string) {
  const start = new Date(`${monday}T00:00:00Z`)
  const end = new Date(start.getTime() + 6 * DAY)
  return `${short(start)}–${short(end)}${end.getUTCFullYear()}`
}

const pct = (a: number, b: number) => (b ? `${Math.round((a / b) * 100)} %` : "–")

function Stat({ href, label, value, sub, children }: { href: string; label: string; value: React.ReactNode; sub: React.ReactNode; children?: React.ReactNode }) {
  return (
    <Link href={href} className="group flex flex-col gap-1 p-4 sm:p-5 transition-colors duration-150 ease-out outline-none hover:bg-v-bg/70 focus-visible:bg-v-bg/70 focus-visible:ring-2 focus-visible:ring-v-ink focus-visible:ring-inset">
      <span className="flex items-center justify-between gap-2 text-[13px] text-v-muted">
        {label}
        <ArrowRight className="size-3.5 opacity-0 transition-[opacity,transform] duration-150 ease-out group-hover:translate-x-0.5 group-hover:opacity-100" aria-hidden="true" />
      </span>
      <b className="text-[28px] leading-tight font-semibold tracking-[-0.02em] tabular-nums">{value}</b>
      <span className="text-[12.5px] leading-snug text-v-muted tabular-nums sm:text-[13px]">{sub}</span>
      {children}
    </Link>
  )
}

async function Stats() {
  if (!(await requireAdmin())) notFound()
  const [weeks, rows, sets] = await Promise.all([signupsPerWeek(), funnel(), setOverview()])
  const accounts = weeks.reduce((s, w) => s + w.signups, 0)
  const attempts = rows.reduce((s, r) => s + r.attempts, 0)
  const leads = rows.reduce((s, r) => s + r.leads, 0)
  const live = sets.filter((s) => s.number > 0)
  const published = live.filter((s) => s.published).length
  const slots = ADMIN_EXAMS.length * SKILLS.length * MODELLTESTS
  const teile = live.reduce((s, x) => s + x.total, 0)
  const reviewed = live.reduce((s, x) => s + x.reviewed, 0)

  return (
    <Panel>
      <div className="grid grid-cols-2 gap-px bg-v-line lg:grid-cols-4 [&>*]:bg-v-surface">
        <Stat href="#konten" label="Konten" value={accounts} sub={`${weeks[0]?.signups ?? 0} diese Woche · ${weeks[1]?.signups ?? 0} letzte`} />
        <Stat href="/admin/kurztest" label="Gratis-Tests abgegeben" value={attempts} sub={`${leads} mit E-Mail · ${pct(leads, attempts)}`} />
        <Stat href={modelltestPath()} label="Modelltests veröffentlicht" value={published} sub={`${live.length} von ${slots} angelegt`} />
        <Stat href={modelltestPath()} label="Teile geprüft" value={pct(reviewed, teile)} sub={`${reviewed} von ${teile}`}>
          <span className="mt-2">
            <Progress value={reviewed} total={teile} label="Geprüfte Teile" />
          </span>
        </Stat>
      </div>
    </Panel>
  )
}

function StatsSkeleton() {
  return (
    <Panel>
      <div aria-hidden="true" className="grid grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }, (_, i) => (
          <div key={i} className="flex flex-col gap-2.5 p-5">
            <span className="h-3 w-28 animate-pulse rounded-full bg-v-soft motion-reduce:animate-none" />
            <span className="h-7 w-16 animate-pulse rounded-full bg-v-soft motion-reduce:animate-none" />
            <span className="h-3 w-36 animate-pulse rounded-full bg-v-soft/70 motion-reduce:animate-none" />
          </div>
        ))}
      </div>
    </Panel>
  )
}

async function Signups() {
  if (!(await requireAdmin())) notFound()
  const weeks = await signupsPerWeek()
  const total = weeks.reduce((s, w) => s + w.signups, 0)

  return weeks.length && total ? (
    <DataTable className="whitespace-nowrap">
      <thead className={THEAD}>
        <tr>
          <th className={TH}>Woche</th>
          <th className={TH}>Zeitraum</th>
          <th className={`${TH} text-end`}>Konten</th>
        </tr>
      </thead>
      <tbody className={TBODY}>
        {weeks.map((w, i) => (
          <tr key={w.week}>
            <td className={`${TD} font-medium`}>
              KW {isoWeek(w.week)}
              {i === 0 && <span className="ms-2 rounded-full bg-v-soft px-2 py-0.5 text-[11.5px] font-medium text-v-muted">läuft</span>}
            </td>
            <td className={`${TD} text-v-muted`}>{range(w.week)}</td>
            <td className={`${TD} text-end`}>{w.signups}</td>
          </tr>
        ))}
      </tbody>
      <tfoot>
        <tr className={TOTAL}>
          <td className={TD} colSpan={2}>Gesamt</td>
          <td className={`${TD} text-end`}>{total}</td>
        </tr>
      </tfoot>
    </DataTable>
  ) : (
    <Empty>Noch keine Konten. Sobald sich jemand mit Google registriert, steht die Woche hier.</Empty>
  )
}

export default function AdminHomePage() {
  return (
    <AdminPage title="Übersicht" description="Konten, Gratis-Test und der Stand der Modelltests auf einen Blick.">
      <Suspense fallback={<StatsSkeleton />}>
        <Stats />
      </Suspense>
      <div id="konten" className="scroll-mt-24">
        <Section title="Neue Konten pro Woche" note="Woche von Montag bis Sonntag, deutsche Zeit. Zählt jedes Konto, das sich mit Google registriert hat.">
          <Suspense fallback={<PanelSkeleton />}>
            <Signups />
          </Suspense>
        </Section>
      </div>
    </AdminPage>
  )
}
