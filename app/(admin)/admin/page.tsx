import { Suspense } from "react"
import { notFound } from "next/navigation"
import { requireAdmin } from "@/lib/admin/guard"
import { signupsPerWeek } from "@/lib/admin/stats"

export const metadata = { title: "Übersicht · Admin" }

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

async function Signups() {
  if (!(await requireAdmin())) notFound()
  const weeks = await signupsPerWeek()
  const total = weeks.reduce((s, w) => s + w.signups, 0)

  return weeks.length && total ? (
    <div className="overflow-x-auto rounded-xl border">
      <table className="w-full text-sm whitespace-nowrap tabular-nums">
        <thead className="bg-muted/50 text-left text-muted-foreground">
          <tr>
            <th className="px-3 py-2.5 sm:px-4 font-medium">Woche</th>
            <th className="px-3 py-2.5 sm:px-4 font-medium">Zeitraum</th>
            <th className="px-3 py-2.5 sm:px-4 text-right font-medium">Konten</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {weeks.map((w, i) => (
            <tr key={w.week}>
              <td className="px-3 py-2.5 sm:px-4 font-medium">
                KW {isoWeek(w.week)}
                {i === 0 && <span className="ml-2 text-xs font-normal text-muted-foreground">läuft</span>}
              </td>
              <td className="px-3 py-2.5 sm:px-4 text-muted-foreground">{range(w.week)}</td>
              <td className="px-3 py-2.5 sm:px-4 text-right">{w.signups}</td>
            </tr>
          ))}
          <tr className="bg-muted/30 font-semibold">
            <td className="px-3 py-2.5 sm:px-4" colSpan={2}>Gesamt</td>
            <td className="px-3 py-2.5 sm:px-4 text-right">{total}</td>
          </tr>
        </tbody>
      </table>
    </div>
  ) : (
    <p className="rounded-xl border border-dashed p-6 text-sm text-muted-foreground">Noch keine Konten. Sobald sich jemand mit Google registriert, steht die Woche hier.</p>
  )
}

export default function AdminHomePage() {
  return (
    <main className="mx-auto flex max-w-5xl flex-col gap-8 px-4 py-10">
      <h1 className="text-2xl font-semibold tracking-tight">Übersicht</h1>
      <section className="flex flex-col gap-3">
        <h2 className="text-lg font-semibold">Neue Konten pro Woche</h2>
        <Suspense fallback={<p className="text-sm text-muted-foreground">Lädt …</p>}>
          <Signups />
        </Suspense>
        <p className="text-xs text-muted-foreground">Woche von Montag bis Sonntag, deutsche Zeit. Zählt jedes Konto, das sich mit Google registriert hat.</p>
      </section>
    </main>
  )
}
