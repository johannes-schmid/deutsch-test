import { notFound } from "next/navigation"
import { Panel, Section } from "@/components/admin/admin-ui"
import { ConversionChart, RevenueChart } from "@/components/admin/sales-charts"
import { requireAdmin } from "@/lib/admin/guard"
import { weekLabel, type Tally } from "@/lib/admin/sales"
import { salesOverview } from "@/lib/admin/stats"
import { formatEuro } from "@/lib/pricing"

// The sales part of /admin: revenue, subscriptions, conversion. Numbers come from lib/admin/sales.ts (tested).

const pct = (n: number | null) => (n === null ? "–" : `${n.toLocaleString("de-DE", { maximumFractionDigits: 1 })} %`)

const date = (iso: string) => new Date(iso).toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit", year: "numeric", timeZone: "Europe/Berlin" })

/** Change against the previous period, in plain ink: status colours stay reserved for state. */
function Delta({ now, before, vs }: { now: number; before: number; vs: string }) {
  if (!now && !before) return <>{vs}: –</>
  if (!before) return <>neu ggü. {vs}</>
  const change = Math.round(((now - before) / before) * 100)
  return (
    <>
      <span className="font-medium text-v-ink">
        {change > 0 ? "▲" : change < 0 ? "▼" : "±"} {Math.abs(change)} %
      </span>{" "}
      ggü. {vs}
    </>
  )
}

function Tile({ label, value, sub }: { label: string; value: React.ReactNode; sub: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1 p-4 sm:p-5">
      <span className="text-[13px] text-v-muted">{label}</span>
      <b className="text-[28px] leading-tight font-semibold tracking-[-0.02em] tabular-nums">{value}</b>
      <span className="text-[12.5px] leading-snug text-v-muted tabular-nums sm:text-[13px]">{sub}</span>
    </div>
  )
}

function Tiles({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-2 gap-px bg-v-line sm:grid-cols-3 [&>*]:bg-v-surface [&>*:last-child]:col-span-2 sm:[&>*:last-child]:col-span-1">{children}</div>
}

function ChartBlock({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-3 border-t border-v-line p-4 sm:p-5">
      <h3 className="text-[14px] font-semibold">{title}</h3>
      {children}
    </div>
  )
}

const payments = (t: Tally) => `${t.count} ${t.count === 1 ? "Zahlung" : "Zahlungen"}`

export async function Sales() {
  if (!(await requireAdmin())) notFound()
  const s = await salesOverview()
  const thisWeek = s.conversionWeeks.at(-1)!
  const lastWeek = s.conversionWeeks.at(-2)!
  const arpu = s.active ? Math.round(s.mrrCents / s.active) : 0

  return (
    <>
      <Section title="Umsatz" note="Brutto inkl. USt.: bezahlte Mollie-Zahlungen (Erstkauf und Verlängerung), ohne Erstattungen und Rückbuchungen. Tage und Wochen nach deutscher Zeit.">
        <Panel>
          <Tiles>
            <Tile label="Heute" value={formatEuro(s.today.cents)} sub={<>{payments(s.today)} · <Delta now={s.today.cents} before={s.yesterday.cents} vs="gestern" /></>} />
            <Tile label="Diese Woche" value={formatEuro(s.thisWeek.cents)} sub={<>{payments(s.thisWeek)} · <Delta now={s.thisWeek.cents} before={s.lastWeek.cents} vs="Vorwoche" /></>} />
            <Tile label="Gesamt" value={formatEuro(s.total.cents)} sub={`${payments(s.total)} seit Start`} />
          </Tiles>
          <ChartBlock title="Umsatz pro Woche">
            <RevenueChart weeks={s.revenueWeeks.map((w) => ({ ...w, ...weekLabel(w.week) }))} />
          </ChartBlock>
        </Panel>
      </Section>

      <Section title="Abos" note="MRR = Monatswert der laufenden, nicht gekündigten Prüfungspässe (3 Monate zählen ein Drittel pro Monat). Churn = Kündigungen der letzten 30 Tage ÷ (aktive Abos + diese Kündigungen).">
        <Panel>
          <Tiles>
            <Tile label="MRR" value={formatEuro(s.mrrCents)} sub={`${s.active} ${s.active === 1 ? "aktives Abo" : "aktive Abos"} · Ø ${formatEuro(arpu)}`} />
            <Tile label="Gekündigt, läuft noch" value={s.ending ? `−${formatEuro(s.endingCents)}` : formatEuro(0)} sub={`${s.ending} ${s.ending === 1 ? "Pass endet" : "Pässe enden"} zum Laufzeitende`} />
            <Tile label="Churn, 30 Tage" value={pct(s.churnPct)} sub={`${s.canceled30} ${s.canceled30 === 1 ? "Kündigung" : "Kündigungen"}`} />
          </Tiles>
          <ChartBlock title="Letzte Kündigungen">
            {s.cancellations.length ? (
              <ul className="divide-y divide-v-line text-[14px]">
                {s.cancellations.map((c) => (
                  <li key={c.userId} className="flex flex-col gap-0.5 py-2.5 first:pt-0 last:pb-0 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
                    <span className="truncate">{c.email ?? "Konto gelöscht"}</span>
                    <span className="shrink-0 text-[13px] text-v-muted tabular-nums">
                      gekündigt {date(c.canceledAt)}
                      {c.until ? ` · Zugang bis ${date(c.until)}` : ""}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-[14px] text-v-muted">Noch keine Kündigungen.</p>
            )}
          </ChartBlock>
        </Panel>
      </Section>

      <Section title="Conversion" note="Neue Konten und Erstkäufe derselben Woche. Ein Erstkauf kann von einem Konto aus einer früheren Woche kommen, die Quote ist also ein Richtwert, keine Kohorte.">
        <Panel>
          <Tiles>
            <Tile label="Neue Konten diese Woche" value={thisWeek.signups} sub={<Delta now={thisWeek.signups} before={lastWeek.signups} vs="Vorwoche" />} />
            <Tile label="Erstkäufe diese Woche" value={thisWeek.buyers} sub={<Delta now={thisWeek.buyers} before={lastWeek.buyers} vs="Vorwoche" />} />
            <Tile label="Conversion diese Woche" value={pct(thisWeek.pct)} sub={`Vorwoche: ${pct(lastWeek.pct)}`} />
          </Tiles>
          <ChartBlock title="Konten und Erstkäufe pro Woche">
            <ConversionChart weeks={s.conversionWeeks.map((w) => ({ ...w, ...weekLabel(w.week) }))} />
          </ChartBlock>
        </Panel>
      </Section>
    </>
  )
}

export function SalesSkeleton() {
  return (
    <Panel>
      <div aria-hidden="true" className="grid grid-cols-2 sm:grid-cols-3">
        {Array.from({ length: 3 }, (_, i) => (
          <div key={i} className="flex flex-col gap-2.5 p-5">
            <span className="h-3 w-24 animate-pulse rounded-full bg-v-soft motion-reduce:animate-none" />
            <span className="h-7 w-28 animate-pulse rounded-full bg-v-soft motion-reduce:animate-none" />
            <span className="h-3 w-36 animate-pulse rounded-full bg-v-soft/70 motion-reduce:animate-none" />
          </div>
        ))}
      </div>
      <div aria-hidden="true" className="h-[252px] border-t border-v-line p-5">
        <span className="block h-full animate-pulse rounded-xl bg-v-soft/60 motion-reduce:animate-none" />
      </div>
      <span className="sr-only">Lädt …</span>
    </Panel>
  )
}
