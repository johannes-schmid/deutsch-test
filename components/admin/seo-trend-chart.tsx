"use client"

import { useState } from "react"
import { CartesianGrid, Line, LineChart, ReferenceLine, Tooltip, XAxis, YAxis } from "recharts"
import { ChartContainer, type ChartConfig } from "@/components/ui/chart"
import type { DayPoint } from "@/lib/admin/seo-model"

// Impressions (or clicks) per day for /admin/seo: Google in ink, Bing in the Lesen blue, the preliminary
// Google days dotted. One chart, one axis, like the sales charts.

const GOOGLE = "var(--v-ink)"
const BING = "var(--v-sk-lesen)"

const config = { google: { label: "Google", color: GOOGLE }, googlePrelim: { label: "Google (preliminary)", color: GOOGLE }, bing: { label: "Bing", color: BING } } satisfies ChartConfig

type Metric = "impressions" | "clicks"
export type ChangeMark = { date: string; change: string }

const nf = new Intl.NumberFormat("en-GB")
const short = (d: string) => new Date(`${d}T00:00:00Z`).toLocaleDateString("en-GB", { day: "numeric", month: "short", timeZone: "UTC" })
const long = (d: string) => new Date(`${d}T00:00:00Z`).toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "long", timeZone: "UTC" })

const AXIS = { tickLine: false, axisLine: false, tick: { fill: "var(--v-muted)", fontSize: 11 } } as const

export function SeoTrendChart({ points, changes }: { points: DayPoint[]; changes: ChangeMark[] }) {
  const [metric, setMetric] = useState<Metric>("impressions")
  const firstPrelim = points.findIndex((p) => p.preliminary)
  const data = points.map((p, i) => {
    const g = metric === "impressions" ? p.google : p.googleClicks
    const joins = firstPrelim > 0 && i === firstPrelim - 1
    return { date: p.date, preliminary: !!p.preliminary, google: p.preliminary ? null : g, googlePrelim: p.preliminary || joins ? g : null, bing: metric === "impressions" ? p.bing : p.bingClicks }
  })
  const first = points[0]?.date
  const last = points.at(-1)?.date
  const inRange = (d: string) => !!first && !!last && d >= first && d <= last
  const marks = changes.filter((c) => inRange(c.date))
  const byDate = new Map<string, string[]>()
  for (const c of marks) byDate.set(c.date, [...(byDate.get(c.date) ?? []), c.change])
  const hasBing = points.some((p) => p.bing !== null)

  return (
    <div className="flex flex-col gap-4 p-4 sm:p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <ul className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[12.5px] text-v-muted" aria-label="Legend">
          <li className="flex items-center gap-1.5"><span className="h-0.5 w-4 rounded-full" style={{ background: GOOGLE }} aria-hidden="true" />Google</li>
          {hasBing && <li className="flex items-center gap-1.5"><span className="h-0.5 w-4 rounded-full" style={{ background: BING }} aria-hidden="true" />Bing</li>}
          {firstPrelim >= 0 && <li className="flex items-center gap-1.5"><span className="w-4 border-t-2 border-dotted border-v-ink" aria-hidden="true" />Preliminary</li>}
          {marks.length > 0 && <li className="flex items-center gap-1.5"><span className="h-3 border-l border-dashed border-v-muted" aria-hidden="true" />Our change</li>}
        </ul>
        <div role="radiogroup" aria-label="Metric" className="inline-flex rounded-full bg-v-soft p-0.5 text-[13px]">
          {(["impressions", "clicks"] as const).map((m) => (
            <button
              key={m}
              type="button"
              role="radio"
              aria-checked={metric === m}
              onClick={() => setMetric(m)}
              className={`rounded-full px-3 py-1 font-medium capitalize transition-[background-color,color,transform] duration-150 ease-out outline-none focus-visible:ring-2 focus-visible:ring-v-ink active:scale-[0.97] ${metric === m ? "bg-v-surface text-v-ink shadow-[0_1px_2px_rgba(14,19,34,0.08)]" : "text-v-muted hover:text-v-ink"}`}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      <ChartContainer config={config} className="aspect-auto h-[220px] w-full">
        <LineChart data={data} margin={{ left: 0, right: 8, top: 8, bottom: 0 }}>
          <CartesianGrid vertical={false} stroke="var(--v-line)" strokeDasharray="0" />
          {marks.map((m) => <ReferenceLine key={`${m.date}-${m.change}`} x={m.date} stroke="var(--v-muted)" strokeOpacity={0.6} strokeDasharray="3 3" />)}
          <XAxis dataKey="date" {...AXIS} tickMargin={8} minTickGap={40} tickFormatter={short} />
          <YAxis {...AXIS} width={40} tickFormatter={(v: number) => nf.format(v)} allowDecimals={false} />
          <Tooltip
            cursor={{ stroke: "var(--v-muted)", strokeOpacity: 0.4 }}
            content={({ active, payload, label }) => {
              if (!active || !payload?.length) return null
              const d = String(label)
              const prelim = data.find((x) => x.date === d)?.preliminary
              const rows = payload.filter((p) => p.value !== null && p.value !== undefined && !(p.dataKey === "googlePrelim" && !prelim))
              return (
                <div className="min-w-40 rounded-xl border border-v-line bg-v-surface px-3 py-2 text-[12.5px] shadow-[0_12px_32px_-16px_rgba(14,19,34,0.35)]">
                  <p className="mb-1 text-v-muted">{long(d)}</p>
                  {rows.map((p) => (
                    <p key={String(p.dataKey)} className="flex items-center justify-between gap-4">
                      <span className="flex items-center gap-1.5"><span className="size-2 rounded-[2px]" style={{ background: p.color }} />{p.dataKey === "bing" ? "Bing" : "Google"}</span>
                      <b className="font-semibold tabular-nums">{nf.format(Number(p.value))}</b>
                    </p>
                  ))}
                  {prelim && <p className="mt-1 text-v-muted">Preliminary: Google still revises this day</p>}
                  {byDate.get(d)?.map((n) => <p key={n} className="mt-1 text-v-muted">{n}</p>)}
                </div>
              )
            }}
          />
          <Line dataKey="google" type="monotone" stroke={GOOGLE} strokeWidth={2} dot={false} connectNulls={false} isAnimationActive={false} />
          <Line dataKey="googlePrelim" type="monotone" stroke={GOOGLE} strokeWidth={2} strokeDasharray="2 4" dot={false} connectNulls={false} isAnimationActive={false} />
          {hasBing && <Line dataKey="bing" type="monotone" stroke={BING} strokeWidth={2} dot={false} connectNulls={false} isAnimationActive={false} />}
        </LineChart>
      </ChartContainer>
    </div>
  )
}
