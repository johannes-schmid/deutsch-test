"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip, type ChartConfig } from "@/components/ui/chart"
import type { ConversionWeek, RevenueWeek } from "@/lib/admin/sales"
import { formatEuro } from "@/lib/pricing"

// The two /admin sales charts: one axis each, ink for money and buyers, a quiet tint for sign-ups.

const INK = "var(--v-ink)"
const QUIET = "color-mix(in srgb, var(--v-muted) 32%, transparent)"

const AXIS = { tickLine: false, axisLine: false, tick: { fill: "var(--v-muted)", fontSize: 11 } } as const

function Tip({ title, rows }: { title: string; rows: [string, string, string?][] }) {
  return (
    <div className="min-w-40 rounded-xl border border-v-line bg-v-surface px-3 py-2 text-[12.5px] shadow-[0_12px_32px_-16px_rgba(14,19,34,0.35)]">
      <p className="mb-1 text-v-muted">{title}</p>
      {rows.map(([label, value, color]) => (
        <p key={label} className="flex items-center justify-between gap-4">
          <span className="flex items-center gap-1.5">
            {color ? <span className="size-2 rounded-[2px]" style={{ background: color }} /> : null}
            {label}
          </span>
          <b className="font-semibold tabular-nums">{value}</b>
        </p>
      ))}
    </div>
  )
}

const revenueConfig = { cents: { label: "Umsatz", color: INK } } satisfies ChartConfig

export function RevenueChart({ weeks }: { weeks: (RevenueWeek & { label: string; range: string })[] }) {
  return (
    <ChartContainer config={revenueConfig} className="aspect-auto h-[200px] w-full">
      <BarChart data={weeks} margin={{ top: 8, right: 0, left: 0, bottom: 0 }} maxBarSize={40}>
        <CartesianGrid vertical={false} stroke="var(--v-line)" strokeDasharray="0" />
        <XAxis dataKey="label" {...AXIS} tickMargin={8} interval="preserveStartEnd" />
        <YAxis {...AXIS} width={48} tickFormatter={(v: number) => formatEuro(v).replace(/,00\s/, " ")} allowDecimals={false} />
        <ChartTooltip
          cursor={{ fill: "var(--v-soft)", opacity: 0.6 }}
          content={({ active, payload }) => {
            const w = active ? (payload?.[0]?.payload as (typeof weeks)[number] | undefined) : undefined
            return w ? <Tip title={`${w.label} · ${w.range}`} rows={[["Umsatz", formatEuro(w.cents)], ["Zahlungen", String(w.count)]]} /> : null
          }}
        />
        <Bar dataKey="cents" fill="var(--color-cents)" radius={[4, 4, 0, 0]} isAnimationActive={false} />
      </BarChart>
    </ChartContainer>
  )
}

const conversionConfig = {
  signups: { label: "Neue Konten", color: QUIET },
  buyers: { label: "Erstkäufe", color: INK },
} satisfies ChartConfig

const pctLabel = (pct: number | null) => (pct === null ? "–" : `${pct.toLocaleString("de-DE", { maximumFractionDigits: 1 })} %`)

export function ConversionChart({ weeks }: { weeks: (ConversionWeek & { label: string; range: string })[] }) {
  return (
    <div className="flex flex-col gap-3">
      <ChartContainer config={conversionConfig} className="aspect-auto h-[200px] w-full">
        <BarChart data={weeks} margin={{ top: 8, right: 0, left: 0, bottom: 0 }} maxBarSize={18} barGap={2}>
          <CartesianGrid vertical={false} stroke="var(--v-line)" />
          <XAxis dataKey="label" {...AXIS} tickMargin={8} interval="preserveStartEnd" />
          <YAxis {...AXIS} width={28} allowDecimals={false} />
          <ChartTooltip
            cursor={{ fill: "var(--v-soft)", opacity: 0.6 }}
            content={({ active, payload }) => {
              const w = active ? (payload?.[0]?.payload as (typeof weeks)[number] | undefined) : undefined
              return w ? (
                <Tip
                  title={`${w.label} · ${w.range}`}
                  rows={[
                    ["Neue Konten", String(w.signups), QUIET],
                    ["Erstkäufe", String(w.buyers), INK],
                    ["Conversion", pctLabel(w.pct)],
                  ]}
                />
              ) : null
            }}
          />
          <Bar dataKey="signups" fill="var(--color-signups)" radius={[4, 4, 0, 0]} isAnimationActive={false} />
          <Bar dataKey="buyers" fill="var(--color-buyers)" radius={[4, 4, 0, 0]} isAnimationActive={false} />
        </BarChart>
      </ChartContainer>
      <ul className="flex items-center gap-4 text-[12.5px] text-v-muted">
        {Object.entries(conversionConfig).map(([key, c]) => (
          <li key={key} className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-[3px]" style={{ background: c.color }} />
            {c.label}
          </li>
        ))}
      </ul>
    </div>
  )
}
