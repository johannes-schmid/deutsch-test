import { Suspense } from "react"
import { headers } from "next/headers"
import { notFound } from "next/navigation"
import { connection } from "next/server"
import { isAdmin } from "@/lib/admin-auth"
import { EXAMS, type ExamId } from "@/lib/exams"
import { KURZTEST_COPY } from "@/lib/i18n/kurztest"
import { OUTCOMES, funnel, leads } from "@/lib/kurztest/stats"

export const metadata = { title: "Kurztest · Admin" }

const examName = (id?: string) => EXAMS[(id ?? "dtz") as ExamId]?.name ?? id
const pct = (a: number, b: number) => (b ? `${Math.round((a / b) * 100)}%` : "–")
const date = (iso: string) => new Date(iso).toLocaleString("de-DE", { dateStyle: "short", timeStyle: "short", timeZone: "Europe/Berlin" })

async function Stats() {
  await connection()
  if (!isAdmin((await headers()).get("authorization"))) notFound()
  const [rows, latest] = await Promise.all([funnel(), leads(50)])
  const total = rows.reduce((s, r) => ({ attempts: s.attempts + r.attempts, leads: s.leads + r.leads }), { attempts: 0, leads: 0 })

  return (
    <>
      <section className="flex flex-col gap-3">
        <h2 className="text-lg font-semibold">Funnel</h2>
        <div className="overflow-x-auto rounded-xl border">
          <table className="w-full text-sm tabular-nums">
            <thead className="bg-muted/50 text-left text-muted-foreground">
              <tr>
                <th className="px-4 py-2.5 font-medium">Prüfung</th>
                <th className="px-4 py-2.5 font-medium">Teil</th>
                <th className="px-4 py-2.5 font-medium">Abgeschlossen</th>
                <th className="px-4 py-2.5 font-medium">E-Mails</th>
                <th className="px-4 py-2.5 font-medium">Quote</th>
                {OUTCOMES.map((l) => <th key={l} className="px-4 py-2.5 font-medium">{l}</th>)}
              </tr>
            </thead>
            <tbody className="divide-y">
              {rows.map((r) => (
                <tr key={`${r.exam}-${r.skill}`}>
                  <td className="px-4 py-2.5">{examName(r.exam)}</td>
                  <td className="px-4 py-2.5 font-medium">{KURZTEST_COPY.names[r.skill as keyof typeof KURZTEST_COPY.names]}</td>
                  <td className="px-4 py-2.5">{r.attempts}</td>
                  <td className="px-4 py-2.5">{r.leads}</td>
                  <td className="px-4 py-2.5">{pct(r.leads, r.attempts)}</td>
                  {OUTCOMES.map((l) => <td key={l} className="px-4 py-2.5">{r.outcomes[l]}</td>)}
                </tr>
              ))}
              <tr className="bg-muted/30 font-semibold">
                <td className="px-4 py-2.5" colSpan={2}>Gesamt</td>
                <td className="px-4 py-2.5">{total.attempts}</td>
                <td className="px-4 py-2.5">{total.leads}</td>
                <td className="px-4 py-2.5">{pct(total.leads, total.attempts)}</td>
                <td colSpan={OUTCOMES.length} />
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-muted-foreground">Abgeschlossen: Test abgegeben. E-Mails: Ergebnis freigeschaltet. Ergebnisse zählen E-Mails; „offen“ heißt Auswertung fehlgeschlagen.</p>
      </section>

      <section className="flex flex-col gap-3">
        <div className="flex items-baseline justify-between gap-4">
          <h2 className="text-lg font-semibold">Letzte 50 E-Mails</h2>
          <a href="/api/admin/kurztest" className="text-sm font-medium underline underline-offset-4">Alle als CSV</a>
        </div>
        {latest.length ? (
          <div className="overflow-x-auto rounded-xl border">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-left text-muted-foreground">
                <tr>
                  <th className="px-4 py-2.5 font-medium">Datum</th>
                  <th className="px-4 py-2.5 font-medium">E-Mail</th>
                  <th className="px-4 py-2.5 font-medium">Prüfung</th>
                  <th className="px-4 py-2.5 font-medium">Teil</th>
                  <th className="px-4 py-2.5 font-medium">Ergebnis</th>
                  <th className="px-4 py-2.5 font-medium">Tipps</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {latest.map((l) => (
                  <tr key={l.id}>
                    <td className="px-4 py-2.5 whitespace-nowrap tabular-nums">{date(l.at)}</td>
                    <td className="px-4 py-2.5">{l.email}</td>
                    <td className="px-4 py-2.5">{examName(l.exam)}</td>
                    <td className="px-4 py-2.5">{KURZTEST_COPY.names[l.skill] ?? l.skill}</td>
                    <td className="px-4 py-2.5">{l.level ?? "–"}</td>
                    <td className="px-4 py-2.5">{l.marketing ? "ja" : "nein"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="rounded-xl border border-dashed p-6 text-sm text-muted-foreground">Noch keine E-Mails. Sobald jemand einen Kurztest abschließt und sein Ergebnis freischaltet, steht er hier.</p>
        )}
      </section>
    </>
  )
}

export default function KurztestAdminPage() {
  return (
    <main className="mx-auto flex max-w-5xl flex-col gap-8 px-4 py-10">
      <h1 className="text-2xl font-semibold tracking-tight">Kurztest</h1>
      <Suspense fallback={<p className="text-sm text-muted-foreground">Lädt …</p>}>
        <Stats />
      </Suspense>
    </main>
  )
}
