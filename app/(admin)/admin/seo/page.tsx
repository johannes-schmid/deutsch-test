import { Suspense, type ReactNode } from "react"
import { notFound } from "next/navigation"
import { Check, ChevronDown, CircleSlash, ExternalLink, GitPullRequest, Radio, TriangleAlert, X } from "lucide-react"
import { AdminPage, Empty, Panel, PanelSkeleton, Section } from "@/components/admin/admin-ui"
import { SeoStructure } from "@/components/admin/seo-structure"
import { SeoTrendChart } from "@/components/admin/seo-trend-chart"
import { requireAdmin } from "@/lib/admin/guard"
import { fetchSeoPulls, loadSeoCockpit, REPO_URL, type SeoCockpit, type SeoPull, type SourceRow } from "@/lib/admin/seo"
import { byPriority, isLive, ledgerStatus, planOwnerWeek, type LedgerEntry, type Owner, type Recommendation } from "@/lib/admin/seo-model"

export const metadata = { title: "SEO" }

/**
 * SEO: where Hannes follows the SEO loop instead of in PRs nobody opens.
 *
 * **This page is English**, like the inburgering one (owner decision 2026-10-26): it is his own
 * workplace, not a screen for a learner. One page, three questions: how healthy is the site (score out
 * of 100, kept per week in `seo-agent/data/history/health.json`), what do the sources say (Google,
 * Bing, AI search), and which page asks for what (the site structure, every page out of 10). The
 * to-do list, experiments and numbers sit folded under "More". Google comes live from Search Console
 * (`lib/admin/seo-live.ts`) when the key is on the server, the rest from `seo-agent/`.
 */

const nf = new Intl.NumberFormat("en-GB")
const nf1 = new Intl.NumberFormat("en-GB", { maximumFractionDigits: 1 })
const pct = (x: number) => `${Math.round(x * 100)}%`
const dayLabel = (d: string) => new Date(`${d.slice(0, 10)}T00:00:00Z`).toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short", timeZone: "UTC" })
const dateLabel = (d: string) => new Date(`${d.slice(0, 10)}T00:00:00Z`).toLocaleDateString("en-GB", { day: "numeric", month: "short", timeZone: "UTC" })
const timeLabel = (iso: string) => new Date(iso).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: "Europe/Berlin" })
const shortPath = (url: string) => decodeURI(url.replace(/^https?:\/\/[^/]+/, "") || "/")
const sourceHref = (file: string) => `${REPO_URL}/blob/main/${file}`

const OWNER: Record<Owner, string> = { hannes: "You", agent: "Agent" }

function ExtLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 rounded-sm font-medium underline-offset-4 outline-none hover:underline focus-visible:ring-2 focus-visible:ring-v-ink">
      {children}
      <ExternalLink className="size-3 shrink-0" aria-hidden="true" />
    </a>
  )
}

function Chip({ children }: { children: ReactNode }) {
  return <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-v-soft px-2 py-0.5 text-[11.5px] font-medium text-v-muted">{children}</span>
}

/** Change against the period before, in plain ink: the admin keeps colour for state, not for direction. */
function Delta({ now, before, inverse }: { now: number; before: number; inverse?: boolean }) {
  if (!before) return <span className="text-v-muted">new</span>
  const change = Math.round((now / before - 1) * 100)
  const sign = inverse ? -change : change
  return <span className="font-medium text-v-ink">{sign > 0 ? "▲" : sign < 0 ? "▼" : "±"} {Math.abs(change)} %</span>
}

function Tile({ label, value, sub }: { label: ReactNode; value: ReactNode; sub: ReactNode }) {
  return (
    <div className="flex min-w-0 flex-col gap-1 p-4 sm:p-5">
      <span className="text-[13px] text-v-muted">{label}</span>
      <b className="text-[24px] leading-tight font-semibold tracking-[-0.02em] tabular-nums sm:text-[28px]">{value}</b>
      <span className="text-[12.5px] leading-snug text-v-muted tabular-nums sm:text-[13px]">{sub}</span>
    </div>
  )
}

/* ── How healthy is the site ─────────────────────────────────────────────── */

function HealthBand({ data }: { data: SeoCockpit }) {
  const st = data.structure
  const t = data.trend
  const history = st?.history ?? []
  const last = history.at(-1)
  const score = st?.site ?? null
  const delta = score !== null && last?.site != null ? score - last.site : null
  const peakMonth = t.googlePeakDate ? new Date(`${t.googlePeakDate}T00:00:00Z`).toLocaleDateString("en-GB", { month: "long", timeZone: "UTC" }) : ""

  return (
    <Panel>
      <div className="grid grid-cols-1 gap-x-8 gap-y-4 p-5 sm:p-6 md:grid-cols-[auto_minmax(0,1fr)]" aria-label="Site health">
        <div className="flex items-end gap-4 md:flex-col md:items-start md:gap-1">
          <p className="text-[13px] text-v-muted">Site health</p>
          <p className="flex items-baseline gap-1 font-semibold tracking-[-0.03em] tabular-nums">
            <span className={`text-[56px] leading-none ${score === null ? "text-v-muted" : ""}`}>{score ?? "n/a"}</span>
            <span className="text-[18px] text-v-muted">/100</span>
          </p>
          {delta !== null && (
            <p className="text-[12.5px] text-v-muted tabular-nums">
              <span className="font-medium text-v-ink">{delta > 0 ? "▲" : delta < 0 ? "▼" : "±"} {Math.abs(delta)}</span> since {last!.week.replace(/^\d{4}-/, "")}
            </p>
          )}
        </div>

        <div className="min-w-0 md:self-center">
          {t.tone !== "unknown" && t.googleRatio !== null ? (
            <p className="max-w-[40ch] text-[18px] leading-snug font-semibold tracking-[-0.01em] text-balance">
              Google shows the site at {pct(t.googleRatio)} of its best weeks{peakMonth && ` (${peakMonth})`}.{t.bingRatio !== null && <> Bing is at {pct(t.bingRatio)}.</>}
            </p>
          ) : (
            <p className="max-w-[48ch] text-[15px] leading-relaxed text-balance">{st ? "Not enough daily Google numbers yet to judge a trend. The score below is technical health for now." : "No page triage yet."}</p>
          )}
          <p className="mt-1.5 max-w-[68ch] text-[13.5px] leading-relaxed text-v-muted">
            {t.cause === "google" && <>Bing didn&apos;t drop, so the problem is how Google judges the site, not the site itself. </>}
            {t.cause === "both" && <>Bing dropped too, so look at the site first: a deploy, the sitemap or indexing. </>}
            The score weighs every page by its search demand: a long title on the homepage costs more than one on a legal page.
          </p>
          {history.length > 0 && (
            <ol className="mt-3 flex flex-wrap items-center gap-1.5 text-[12px] tabular-nums" aria-label="Score per week">
              {history.map((h) => (
                <li key={h.week} className="rounded-md bg-v-soft px-2 py-1 text-v-muted">
                  {h.week.replace(/^\d{4}-/, "")} <b className="font-semibold text-v-ink">{h.site ?? "n/a"}</b>
                </li>
              ))}
              {score !== null && st?.live && (
                <li className="rounded-md bg-v-ink px-2 py-1 text-white" title="Live: the last 28 days up to today, including the preliminary days">
                  Now, live <b className="font-semibold">{score}</b>
                </li>
              )}
            </ol>
          )}
        </div>
      </div>
    </Panel>
  )
}

/* ── What the sources say ────────────────────────────────────────────────── */

function SourceTiles({ data }: { data: SeoCockpit }) {
  const t = data.google.totals
  const live = data.live.state === "live"
  const geo = data.sources.find((s) => s.key === "geo")
  return (
    <Panel>
      <div className="grid grid-cols-1 gap-px bg-v-line md:grid-cols-3 [&>*]:bg-v-surface">
        <Tile
          label={<span className="flex items-center justify-between gap-2">Google {live ? <span className="inline-flex items-center gap-1 text-[11.5px] font-medium text-v-ink"><Radio className="size-3" aria-hidden="true" /> live</span> : <Chip>{data.google.error ? "unknown" : "Friday’s pull"}</Chip>}</span>}
          value={t ? nf.format(t.current.clicks) : "n/a"}
          sub={t ? <>clicks · {nf.format(t.current.impressions)} impressions · <Delta now={t.current.clicks} before={t.previous.clicks} /> vs 28 days before</> : data.google.error === "no snapshot" ? "No data yet. Needs Search Console access (see To-do)." : `Unknown: ${data.google.error}`}
        />
        <Tile
          label={<span className="flex items-center justify-between gap-2">Bing {data.live.bingLive ? <span className="inline-flex items-center gap-1 text-[11.5px] font-medium text-v-ink"><Radio className="size-3" aria-hidden="true" /> live</span> : <Chip>{data.bing ? "Friday’s pull" : "not connected"}</Chip>}</span>}
          value={data.bing ? nf.format(data.bing.clicks) : "n/a"}
          sub={data.bing ? <>clicks · {nf.format(data.bing.impressions)} impressions · <Delta now={data.bing.clicks} before={data.bing.prevClicks} /> vs 28 days before</> : "Unknown, not zero. Needs BING_API_KEY (see To-do)."}
        />
        <Tile
          label={<span className="flex items-center justify-between gap-2">AI search <Chip>{data.geo ? `measured ${data.latestWeek}` : "not measured"}</Chip></span>}
          value={data.geo && data.geo.share !== null ? pct(data.geo.share) : "n/a"}
          sub={data.geo ? `of ${data.geo.prompts} questions cite us (${data.geo.engines.join(", ")})` : geo?.state === "error" ? `Last run failed: ${geo.detail}` : `Whether ChatGPT, Perplexity and Claude name us for our questions. Runs in even weeks, next on ${dayLabel(data.nextCollect)}.`}
        />
      </div>
    </Panel>
  )
}

/* ── Site-wide actions ───────────────────────────────────────────────────── */

function RecItem({ r, waiting }: { r: Recommendation; waiting?: boolean }) {
  return (
    <details className="group">
      <summary className="grid cursor-pointer list-none grid-cols-[1fr_auto] items-center gap-x-3 px-4 py-3.5 transition-colors duration-150 ease-out outline-none hover:bg-v-bg/70 focus-visible:bg-v-bg/70 focus-visible:ring-2 focus-visible:ring-v-ink focus-visible:ring-inset sm:px-5 [&::-webkit-details-marker]:hidden">
        <span className="min-w-0 text-[14.5px] font-medium">{r.task}</span>
        <span className="flex items-center gap-1.5">
          <Chip>{OWNER[r.owner]}</Chip>
          {r.minutes !== undefined && <Chip>{r.minutes} min</Chip>}
          {r.status === "planned" && <Chip>planned</Chip>}
          {waiting && <Chip>next week</Chip>}
          <ChevronDown className="size-4 text-v-muted transition-transform duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] group-open:rotate-180 motion-reduce:transition-none" aria-hidden="true" />
        </span>
      </summary>
      <dl className="grid grid-cols-1 gap-x-4 gap-y-2 px-4 pb-4 text-[13.5px] leading-relaxed sm:grid-cols-[88px_1fr] sm:px-5">
        <dt className="font-semibold text-v-muted">Why</dt>
        <dd>{r.why}</dd>
        <dt className="font-semibold text-v-muted">Steps</dt>
        <dd>{r.steps.length === 1 ? r.steps[0] : <ol className="list-decimal space-y-1 pl-4 marker:text-v-muted">{r.steps.map((s) => <li key={s}>{s}</li>)}</ol>}</dd>
        <dt className="font-semibold text-v-muted">We expect</dt>
        <dd>{r.expect}</dd>
        {(r.pages?.length ?? 0) > 0 && (
          <>
            <dt className="font-semibold text-v-muted">Pages</dt>
            <dd className="font-[family-name:var(--v-font-mono)] text-[12px]">{r.pages!.slice(0, 12).join(" · ")}{r.pages!.length > 12 && ` · +${r.pages!.length - 12}`}</dd>
          </>
        )}
      </dl>
    </details>
  )
}

function SiteWideActions({ data }: { data: SeoCockpit }) {
  const items = data.recommendations.filter((r) => isLive(r) && r.priority !== "later" && (r.pages?.length ?? 0) !== 1).sort(byPriority)
  if (items.length === 0) return null
  const minutes = items.filter((r) => r.owner === "hannes").reduce((s, r) => s + (r.minutes ?? 0), 0)
  return (
    <Section title="Site-wide actions" aside={<span className="text-[13px] text-v-muted tabular-nums">your part ≈ {minutes} min</span>} note="Not about one page. These come first; each page below shows the ones that touch it.">
      <Panel>
        <ul className="divide-y divide-v-line">{items.map((r) => <li key={r.id}><RecItem r={r} /></li>)}</ul>
      </Panel>
    </Section>
  )
}

/* ── More ────────────────────────────────────────────────────────────────── */

function Fold({ title, note, children }: { title: string; note: string; children: ReactNode }) {
  return (
    <details className="group nz-paper overflow-hidden rounded-[22px]">
      <summary className="grid cursor-pointer list-none grid-cols-[1fr_auto] items-center gap-x-4 px-5 py-4 transition-colors duration-150 ease-out outline-none hover:bg-v-bg/70 focus-visible:bg-v-bg/70 focus-visible:ring-2 focus-visible:ring-v-ink focus-visible:ring-inset sm:px-6 [&::-webkit-details-marker]:hidden">
        <span className="min-w-0">
          <span className="block text-[15px] font-semibold tracking-[-0.01em]">{title}</span>
          <span className="mt-0.5 block text-[12.5px] text-v-muted">{note}</span>
        </span>
        <ChevronDown className="size-4 text-v-muted transition-transform duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] group-open:rotate-180 motion-reduce:transition-none" aria-hidden="true" />
      </summary>
      <div className="border-t border-v-line bg-v-bg/50 p-3 sm:p-4">{children}</div>
    </details>
  )
}

const PRIORITY: { key: Recommendation["priority"]; title: string; note: string }[] = [
  { key: "now", title: "Now", note: "This week. Most take a few minutes." },
  { key: "next", title: "Next", note: "Once the above is done." },
  { key: "later", title: "Later", note: "Useful, not urgent." },
]

function Todo({ data }: { data: SeoCockpit }) {
  const live = data.recommendations.filter(isLive).sort(byPriority)
  const done = data.recommendations.filter((r) => !isLive(r))
  const plan = planOwnerWeek(data.recommendations, data.ownerBudget)
  return (
    <div className="flex flex-col gap-5">
      <p className="text-[13px] text-v-muted tabular-nums">
        {live.length} open · your part this week takes about {plan.minutes} of {plan.budget} minutes · <ExtLink href={sourceHref("seo-agent/recommendations.json")}>recommendations.json</ExtLink>
      </p>
      {PRIORITY.map((p) => {
        const items = live.filter((r) => r.priority === p.key)
        if (!items.length) return null
        return (
          <div key={p.key} className="flex flex-col gap-2">
            <div className="flex items-baseline gap-2"><h3 className="text-[14px] font-semibold">{p.title}</h3><span className="text-[12.5px] text-v-muted">{p.note}</span></div>
            <Panel><ul className="divide-y divide-v-line">{items.map((r) => <li key={r.id}><RecItem r={r} waiting={plan.later.some((x) => x.id === r.id)} /></li>)}</ul></Panel>
          </div>
        )
      })}
      {done.length > 0 && (
        <details className="text-[13.5px]">
          <summary className="cursor-pointer text-v-muted underline-offset-4 hover:underline">{done.length} done or dismissed</summary>
          <ul className="mt-2 flex flex-col gap-1">{done.map((r) => <li key={r.id} className="flex items-center gap-2 text-v-muted"><Check className="size-4" aria-hidden="true" /><span className="line-through">{r.task}</span></li>)}</ul>
        </details>
      )}
      <p className="text-[12.5px] text-v-muted">Ticking items off happens in the file for now: set the status to done, the Saturday run keeps it.</p>
    </div>
  )
}

function Kpi({ label, value, before, inverse, unknown, format = nf.format }: { label: string; value: number | null; before: number | null; inverse?: boolean; unknown?: string; format?: (n: number) => string }) {
  return (
    <div className="flex min-w-0 flex-col gap-1 p-4">
      <span className="truncate text-[12.5px] text-v-muted">{label}</span>
      {value === null ? <span className="text-[13px] text-v-muted">{unknown ?? "unknown"}</span> : (
        <>
          <b className="text-[22px] leading-tight font-semibold tracking-[-0.02em] tabular-nums">{format(value)}</b>
          <span className="text-[12.5px] text-v-muted tabular-nums">{before !== null && <><Delta now={value} before={before} inverse={inverse} /> · was {format(before)}</>}</span>
        </>
      )}
    </div>
  )
}

function Kpis({ data }: { data: SeoCockpit }) {
  const t = data.google.totals
  const nb = data.google.nonBrand
  const w = data.google.windows
  const unknown = data.google.error ? `unknown: ${data.google.error}` : undefined
  return (
    <div className="flex flex-col gap-2">
      <p className="text-[12.5px] text-v-muted">{w ? `Last 28 days (${dateLabel(w.current.start)} to ${dateLabel(w.current.end)}) vs the 28 before${data.live.state === "live" ? ", live" : ", Friday’s data pull"}` : "Last 28 days"}</p>
      <Panel>
        <div className="grid grid-cols-2 gap-px bg-v-line lg:grid-cols-5 [&>*]:bg-v-surface">
          <Kpi label="Clicks from Google" value={t?.current.clicks ?? null} before={t?.previous.clicks ?? null} unknown={unknown} />
          <Kpi label="Impressions in Google" value={t?.current.impressions ?? null} before={t?.previous.impressions ?? null} unknown={unknown} />
          <Kpi label="Clicks without our brand name" value={nb?.current.clicks ?? null} before={nb?.previous.clicks ?? null} unknown={unknown} />
          <Kpi label="Average position" value={t?.current.position ?? null} before={t?.previous.position ?? null} inverse unknown={unknown} format={(n) => nf1.format(n)} />
          <Kpi label="Clicks from Bing" value={data.bing?.clicks ?? null} before={data.bing?.prevClicks ?? null} unknown="not connected" />
        </div>
      </Panel>
    </div>
  )
}

function SourceIcon({ s }: { s: SourceRow }) {
  if (s.state === "ok") return <Check className="size-4" aria-label="worked" />
  if (s.state === "skipped" || s.state === "missing") return <CircleSlash className="size-4 text-v-muted" aria-label="skipped" />
  return <TriangleAlert className="size-4 text-[var(--p-ember)]" aria-label="failed" />
}

function Sources({ data }: { data: SeoCockpit }) {
  const h = data.health
  return (
    <Panel>
      <div className="flex flex-col gap-4 p-4 sm:p-5">
        <div className="flex items-baseline justify-between gap-3">
          <h3 className="text-[14.5px] font-semibold">Friday&apos;s data pull</h3>
          <span className="text-[12.5px] text-v-muted">{data.latestWeek ? `Snapshot ${data.latestWeek}` : "No snapshot yet"}</span>
        </div>
        <ul className="flex flex-col gap-2">
          {data.sources.map((s) => (
            <li key={s.key} className="grid grid-cols-[16px_1fr] items-start gap-x-2.5 text-[13.5px]">
              <span className="mt-0.5"><SourceIcon s={s} /></span>
              <span className="min-w-0">
                <span className="font-medium">{s.label}</span>
                {s.state !== "ok" && <span className="block text-[12.5px] text-v-muted">{s.state === "missing" ? "not measured: unknown, not zero" : s.key === "geo" && s.state === "skipped" ? "runs in even weeks only" : s.detail}</span>}
              </span>
            </li>
          ))}
        </ul>
        {h && (
          <div className="rounded-xl bg-v-bg px-4 py-3 text-[13.5px]">
            <p className="font-semibold">Technical</p>
            <ul className="mt-1.5 flex flex-col gap-1 text-v-muted">
              <li className="flex items-start gap-2">
                {h.errors.length === 0 ? <Check className="mt-0.5 size-4 shrink-0 text-v-ink" aria-hidden="true" /> : <X className="mt-0.5 size-4 shrink-0 text-[var(--p-ember)]" aria-hidden="true" />}
                <span>{h.urlCount !== null && <>{nf.format(h.urlCount)} URLs in the sitemap, </>}{h.errors.length === 0 ? "no errors" : `${h.errors.length} with an error`}{h.orphans > 0 && `, ${h.orphans} orphans`}</span>
              </li>
              {h.lengthIssues > 0 && <li className="flex items-start gap-2"><TriangleAlert className="mt-0.5 size-4 shrink-0 text-[var(--p-ember)]" aria-hidden="true" /><span>{h.lengthIssues} titles or descriptions out of spec</span></li>}
            </ul>
            {h.errors.length > 0 && <ul className="mt-2 flex flex-col gap-1 text-[12.5px]">{h.errors.slice(0, 5).map((e) => <li key={e.url} className="truncate"><span className="font-[family-name:var(--v-font-mono)]">{shortPath(e.url)}</span> {e.issues.join(", ")}</li>)}</ul>}
          </div>
        )}
      </div>
    </Panel>
  )
}

const STATUS: Record<ReturnType<typeof ledgerStatus>["kind"], string> = { running: "Running", "verdict-due": "Verdict on Saturday", worked: "Worked", didnt: "Didn’t work", inconclusive: "Inconclusive" }

function Experiments({ entries, today }: { entries: LedgerEntry[]; today: string }) {
  const rows = [...entries].sort((a, b) => b.date.localeCompare(a.date))
  return (
    <Panel>
      <div className="flex flex-col gap-3 p-4 sm:p-5">
        <div className="flex items-baseline justify-between gap-3">
          <h3 className="text-[14.5px] font-semibold">Experiments</h3>
          <span className="text-[12.5px] text-v-muted">Every change gets 35 days, then the Saturday run judges it</span>
        </div>
        {rows.length === 0 ? <Empty>No changes logged yet. The first title PR from the loop adds a row to seo-agent/ledger.json.</Empty> : (
          <ol className="flex flex-col gap-2">
            {rows.map((e) => {
              const s = ledgerStatus(e, today)
              return (
                <li key={e.id ?? `${e.date}-${e.page}`} className="rounded-xl bg-v-bg px-4 py-3">
                  <div className="flex items-start justify-between gap-3">
                    <p className="min-w-0 text-[13.5px] leading-snug font-medium">{e.change}</p>
                    <Chip>{STATUS[s.kind]}</Chip>
                  </div>
                  <p className="mt-1 truncate text-[12.5px] text-v-muted">{dateLabel(e.date)} · <span className="font-[family-name:var(--v-font-mono)]">{e.page}</span></p>
                  {s.kind === "running" && (
                    <div className="mt-2 flex items-center gap-3">
                      <span className="block h-1.5 flex-1 overflow-hidden rounded-full bg-v-soft"><span className="block h-full rounded-full bg-[var(--p-ember)]" style={{ width: `${Math.round(s.progress * 100)}%` }} /></span>
                      <span className="shrink-0 text-[11.5px] text-v-muted tabular-nums">{s.daysLeft} {s.daysLeft === 1 ? "day" : "days"} left</span>
                    </div>
                  )}
                  {e.verdict_note && <p className="mt-1.5 text-[12.5px] text-v-muted">{e.verdict_note}</p>}
                </li>
              )
            })}
          </ol>
        )}
      </div>
    </Panel>
  )
}

function NearQueries({ data }: { data: SeoCockpit }) {
  const rows = data.google.near
  return (
    <Panel>
      <div className="flex flex-col gap-3 p-4 sm:p-5">
        <div className="flex items-baseline justify-between gap-3">
          <h3 className="text-[14.5px] font-semibold">Close to the top</h3>
          <span className="text-[12.5px] text-v-muted">Position 4 to 20, most impressions first</span>
        </div>
        {rows.length === 0 ? <Empty>No queries between position 4 and 20 with enough impressions yet.</Empty> : (
          <ol className="flex flex-col gap-2">
            {rows.map((q) => (
              <li key={`${q.query}-${q.page}`} className="grid grid-cols-[1fr_auto] items-baseline gap-x-3 rounded-xl bg-v-bg px-4 py-2.5">
                <span className="min-w-0"><span className="block truncate text-[13.5px] font-medium">{q.query}</span><span className="block truncate font-[family-name:var(--v-font-mono)] text-[11.5px] text-v-muted">{shortPath(q.page)}</span></span>
                <span className="text-end text-[12.5px] text-v-muted tabular-nums"><b className="block text-[13.5px] font-semibold text-v-ink">#{nf1.format(q.position)}</b>{nf.format(q.impressions)} impr. · {q.clicks} clicks</span>
              </li>
            ))}
          </ol>
        )}
      </div>
    </Panel>
  )
}

function Pulls({ pulls, reports }: { pulls: SeoPull[] | null; reports: SeoCockpit["reports"] }) {
  return (
    <Panel>
      <div className="flex flex-col gap-3 p-4 sm:p-5">
        <div className="flex items-baseline justify-between gap-3">
          <h3 className="text-[14.5px] font-semibold">Pull requests and reports</h3>
          <ExtLink href={`${REPO_URL}/pulls`}>All PRs</ExtLink>
        </div>
        {pulls === null ? <p className="text-[13px] text-v-muted">GitHub didn&apos;t answer (a private repo needs GITHUB_TOKEN). Unknown, not zero.</p> : pulls.length === 0 ? <p className="text-[13px] text-v-muted">No open PRs from the loop.</p> : (
          <ul className="flex flex-col gap-1.5">
            {pulls.map((p) => (
              <li key={p.number}>
                <a href={p.url} target="_blank" rel="noreferrer" className="grid grid-cols-[16px_1fr] items-start gap-x-2.5 rounded-xl bg-v-bg px-4 py-2.5 transition-[background-color,transform] duration-150 ease-out outline-none hover:bg-v-soft focus-visible:ring-2 focus-visible:ring-v-ink active:scale-[0.99]">
                  <GitPullRequest className="mt-0.5 size-4" aria-hidden="true" />
                  <span className="min-w-0"><span className="block truncate text-[13.5px] font-medium">{p.title}</span><span className="block truncate text-[11.5px] text-v-muted">#{p.number} · opened {dateLabel(p.createdAt)}</span></span>
                </a>
              </li>
            ))}
          </ul>
        )}
        <div>
          <p className="text-[12.5px] font-semibold text-v-muted">Reports</p>
          {reports.length === 0 ? <p className="mt-1 text-[13px] text-v-muted">No Saturday report on main yet.</p> : <ul className="mt-1 flex flex-col gap-1">{reports.slice(0, 8).map((r) => <li key={r.name}><ExtLink href={r.href}>{r.name}</ExtLink></li>)}</ul>}
        </div>
      </div>
    </Panel>
  )
}

/* ── The page ────────────────────────────────────────────────────────────── */

async function Cockpit() {
  if (!(await requireAdmin())) notFound()
  const [data, pulls] = await Promise.all([loadSeoCockpit(), fetchSeoPulls()])
  const today = new Date().toISOString().slice(0, 10)
  const stale = data.latestWeek !== null && data.latestWeek < data.expectedWeek
  const live = data.live

  return (
    <>
      <p className="-mt-4 flex flex-wrap items-center gap-x-2 gap-y-1 text-[13.5px] text-v-muted">
        {live.state === "live" ? (
          <><span className="inline-flex items-center gap-1.5 font-medium text-v-ink"><Radio className="size-3.5" aria-hidden="true" /> Live from Search Console</span><span>updated {timeLabel(live.fetchedAt!)} · the last 3 days are preliminary.</span></>
        ) : (
          <span>{live.state === "error" ? `Search Console live failed (${live.detail}). ` : ""}{data.generatedAt ? <>Showing Friday&apos;s data pull of {dayLabel(data.generatedAt)}.</> : "No data pull yet."}</span>
        )}
        <span>Next data pull {dayLabel(data.nextCollect)}.</span>
        {stale && <Chip><TriangleAlert className="size-3" aria-hidden="true" /> Data pull {data.expectedWeek} is missing</Chip>}
      </p>

      <HealthBand data={data} />
      <SourceTiles data={data} />

      {data.daily.length > 0 && (
        <Section title="Impressions per day" note="Google and Bing side by side. Grows by a day every day once Search Console is connected.">
          <Panel><SeoTrendChart points={data.daily} changes={data.ledger.map((e) => ({ date: e.date, change: e.change ?? e.id ?? "" }))} /></Panel>
        </Section>
      )}

      <SiteWideActions data={data} />

      {data.structure ? <SeoStructure structure={data.structure} /> : <Empty>No page triage yet. Run the Friday data pull, then node scripts/seo-agent/pages.mjs.</Empty>}

      <Section title="More" note="The background behind the scores. Closed until you need it.">
        <div className="flex flex-col gap-3">
          <Fold title="Full to-do list" note={`${data.recommendations.filter(isLive).length} open, by priority and owner`}><Todo data={data} /></Fold>
          <Fold title="Numbers and experiments" note="Key figures, the Friday data pull, experiments, queries close to the top, PRs and reports">
            <div className="flex flex-col gap-4">
              <Kpis data={data} />
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
                <Experiments entries={data.ledger} today={today} />
                <div className="flex flex-col gap-4"><Sources data={data} /><NearQueries data={data} /></div>
              </div>
              <Pulls pulls={pulls} reports={data.reports} />
            </div>
          </Fold>
        </div>
      </Section>
    </>
  )
}

export default function SeoPage() {
  return (
    <AdminPage
      title="SEO"
      description="How healthy the site is, what Google, Bing and the AI engines say, and which page asks for what. Fed by the Friday data pull in seo-agent/ and the Saturday routine."
      actions={
        <a href="https://search.google.com/search-console?resource_id=sc-domain%3Adeutschtest-ueben.de" target="_blank" rel="noreferrer" className="inline-flex h-9 items-center gap-1.5 rounded-full bg-v-soft px-3.5 text-[13.5px] font-medium transition-[background-color,transform] duration-150 ease-out outline-none hover:bg-v-line focus-visible:ring-2 focus-visible:ring-v-ink active:scale-[0.97]">
          Search Console <ExternalLink className="size-3.5" aria-hidden="true" />
        </a>
      }
    >
      <Suspense fallback={<PanelSkeleton rows={4} />}>
        <Cockpit />
      </Suspense>
    </AdminPage>
  )
}
