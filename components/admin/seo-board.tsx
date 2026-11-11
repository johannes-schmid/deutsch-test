"use client"

import { useMemo, useRef, useState, type ReactNode } from "react"
import { ChevronDown, Radio, Search, X } from "lucide-react"
import { Panel } from "@/components/admin/admin-ui"
import type { SiteStructure, StructurePage, Window28 } from "@/lib/admin/seo"
import type { LiveFunnel } from "@/lib/admin/seo-funnel"
import {
  indexState, kindOfSection, missingFromGoogle, MIN_VISITS, rate, rollupByKind, STEPS, weakestStep,
  type FunnelCounts, type FunnelStep, type IndexRecord, type IndexState, type PageKind,
} from "@/lib/admin/seo-funnel-model"
import { nextAction, OWNER, PageDetail, scoreTone, whyLine } from "@/components/admin/seo-page-detail"

/**
 * The board of `/admin/seo` (ported from inburgering, 2026-11-11): widgets on top, below them one list of every
 * page. The filter cards *are* filters on that list (needs action, not in Google, search visitors who never
 * start practising), and the funnel tile opens a breakdown per kind of page. Search visits, practice starts and
 * payments per page come live from GA4; the Index column from the weekly URL Inspection run.
 */

const nf = new Intl.NumberFormat("en-GB")
const eur = new Intl.NumberFormat("en-GB", { style: "currency", currency: "EUR" })
const pct = (x: number | null) => (x === null ? "–" : `${(x * 100).toFixed(x < 0.1 ? 1 : 0)} %`)
const dayLabel = (iso: string) => new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", timeZone: "Europe/Berlin" })

type Filter = "action" | "noindex" | "leak"
type KindTab = "all" | PageKind

type Row = {
  page: StructurePage
  kind: PageKind
  index: IndexState | "noindex"
  indexNote: string | null
  funnel: FunnelCounts | null
  leak: boolean
  action: boolean
}

export type BoardProps = {
  structure: SiteStructure
  funnel: LiveFunnel | { error: string }
  indexing: { checkedAt: string; pages: Record<string, IndexRecord> } | null
  google: { clicks: number; prev: number; live: boolean } | null
  googleNote: string
  bing: Window28 | null
  geo: { share: number | null; week: string | null } | null
  geoNote: string
  trend?: ReactNode
  /** Rendered between the trend and the filter cards: the site-wide actions. */
  actions?: ReactNode
}

export function SeoBoard({ structure, funnel, indexing, google, googleNote, bing, geo, geoNote, trend, actions }: BoardProps) {
  const [filter, setFilter] = useState<Filter | null>(null)
  const [kind, setKind] = useState<KindTab>("all")
  const [q, setQ] = useState("")
  const [funnelOpen, setFunnelOpen] = useState(false)
  const listRef = useRef<HTMLElement>(null)
  const live = "error" in funnel ? null : funnel

  const rows = useMemo<Row[]>(() => {
    const f = "error" in funnel ? null : funnel
    return structure.pages
      .map((p) => {
        const counts = f ? (f.byPage[p.path] ?? { visits: 0, practice: 0, account: 0, checkout: 0, paid: 0, revenue: 0 }) : null
        const rec = indexing?.pages[p.path]
        const index: Row["index"] = p.verdict === "remove" ? "noindex" : indexing ? indexState(rec) : "unknown"
        const leak = !!counts && counts.visits >= MIN_VISITS && counts.practice === 0
        return {
          page: p, kind: kindOfSection(p.section), index,
          indexNote: rec && index !== "indexed" && index !== "canonical" ? rec.coverage : null,
          funnel: counts, leak,
          action: (p.score <= 7 && p.verdict !== "remove") || leak || missingFromGoogle(index),
        }
      })
      .sort((a, b) => b.page.weight - a.page.weight || a.page.score - b.page.score)
  }, [structure.pages, funnel, indexing])

  const counts = {
    action: rows.filter((r) => r.action).length,
    noindex: rows.filter((r) => missingFromGoogle(r.index)).length,
    leak: rows.filter((r) => r.leak).length,
  }

  const needle = q.trim().toLowerCase()
  const visible = rows.filter((r) => {
    if (filter === "action" && !r.action) return false
    if (filter === "noindex" && !missingFromGoogle(r.index)) return false
    if (filter === "leak" && !r.leak) return false
    if (kind !== "all" && r.kind !== kind) return false
    if (needle && !decodeURI(r.page.path).toLowerCase().includes(needle)) return false
    return true
  })

  const choose = (f: Filter) => {
    const next = filter === f ? null : f
    setFilter(next)
    if (next) listRef.current?.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" })
  }

  const sectionOf = useMemo(() => new Map(structure.pages.map((p) => [p.path, p.section])), [structure.pages])
  const sectionLabel = useMemo(() => new Map(structure.sections.map((s) => [s.key, s.label])), [structure.sections])
  const byKind = live ? rollupByKind(live.byPage, (p) => { const s = sectionOf.get(p); return s ? kindOfSection(s) : null }) : null
  const aiVisits = live?.ai.reduce((s, a) => s + a.sessions, 0) ?? 0

  return (
    <div className="flex flex-col gap-3">
      <Panel>
        <div className="grid grid-cols-1 gap-px bg-v-line md:grid-cols-3 [&>*]:bg-v-surface">
          <Tile label="Search clicks · 28 days" chip={google?.live ? <LiveMark /> : undefined}>
            <div className="flex gap-8">
              <Pair value={google ? nf.format(google.clicks) : "n/a"} label="Google" now={google?.clicks} before={google?.prev} />
              <Pair value={bing ? nf.format(bing.clicks) : "n/a"} label="Bing" now={bing?.clicks} before={bing?.prevClicks} />
            </div>
            <p className="text-[12.5px] text-v-muted">{googleNote}</p>
          </Tile>

          <Tile label="AI assistants">
            <div className="flex gap-8">
              <Pair value={geo?.share != null ? pct(geo.share) : "n/a"} label="answers cite us" />
              <Pair value={live ? nf.format(aiVisits) : "n/a"} label="visits, 28 days" />
            </div>
            {live && live.ai.length > 0 ? (
              <ul className="flex flex-col gap-1">
                {live.ai.slice(0, 3).map((a) => (
                  <li key={a.engine} className="grid grid-cols-[76px_minmax(0,1fr)_36px] items-center gap-2 text-[12px] text-v-muted tabular-nums">
                    <span>{a.engine}</span>
                    <span className="h-1.5 overflow-hidden rounded-full bg-v-soft"><span className="block h-full rounded-full bg-v-ink" style={{ width: `${Math.max(4, (a.sessions / live.ai[0].sessions) * 100)}%` }} /></span>
                    <span className="text-end text-v-ink">{nf.format(a.sessions)}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-[12.5px] text-v-muted">{live ? "No visits from AI assistants yet. " : ""}{geoNote}</p>
            )}
          </Tile>

          <button
            type="button"
            onClick={() => setFunnelOpen((o) => !o)}
            aria-expanded={funnelOpen}
            aria-controls="funnel-detail"
            className="group flex min-w-0 flex-col gap-2 p-4 text-start transition-colors duration-150 ease-out outline-none hover:bg-v-bg/70 focus-visible:bg-v-bg/70 focus-visible:ring-2 focus-visible:ring-v-ink focus-visible:ring-inset sm:p-5"
          >
            <span className="flex items-center justify-between gap-2 text-[13px] text-v-muted">
              Search to paid · 28 days
              <span className="inline-flex items-center gap-0.5 text-[12px] font-medium text-v-ink">
                By kind <ChevronDown className={`size-3.5 transition-transform duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] motion-reduce:transition-none ${funnelOpen ? "rotate-180" : ""}`} aria-hidden="true" />
              </span>
            </span>
            {live ? (
              <>
                <span className="flex items-baseline gap-2">
                  <b className="text-[24px] leading-tight font-semibold tracking-[-0.02em] tabular-nums sm:text-[28px]">{eur.format(live.total.revenue)}</b>
                  <span className="text-[12.5px] text-v-muted tabular-nums">{live.total.paid} paid of {nf.format(live.total.visits)} visits</span>
                </span>
                <MiniFunnel c={live.total} />
              </>
            ) : (
              <Unknown detail={(funnel as { error: string }).error} />
            )}
          </button>
        </div>
      </Panel>

      <div id="funnel-detail" className={`grid transition-[grid-template-rows] duration-250 ease-[cubic-bezier(0.23,1,0.32,1)] motion-reduce:transition-none ${funnelOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`} inert={!funnelOpen}>
        <div className="overflow-hidden">
          {live && byKind ? <FunnelDetail total={live.total} byKind={byKind} /> : (
            <Panel><p className="p-5 text-[13.5px] text-v-muted">The funnel needs GA4: set GA4_PROPERTY_ID on the server and give the Search Console service account Viewer on that property. Until then it is unknown, not zero.</p></Panel>
          )}
        </div>
      </div>

      {trend && <div className="mt-6">{trend}</div>}
      {actions && <div className="mt-6">{actions}</div>}

      <section aria-label="Filters" className="mt-6">
        <Panel>
          <div className="grid grid-cols-1 gap-px bg-v-line md:grid-cols-3 [&>*]:bg-v-surface">
            <FilterCard on={filter === "action"} onClick={() => choose("action")} n={counts.action} title="Need an action" note="Score 7 or lower, not in Google, or visitors who never start a test" />
            <FilterCard on={filter === "noindex"} onClick={() => choose("noindex")} n={indexing ? counts.noindex : null} title="Not in Google" note={indexing ? `Should be indexed but isn't · checked ${dayLabel(indexing.checkedAt)}` : "Not checked yet. Runs with the Friday data pull."} urgent />
            <FilterCard on={filter === "leak"} onClick={() => choose("leak")} n={live ? counts.leak : null} title="Visitors don't practise" note={live ? `${MIN_VISITS}+ search visits, no test started` : "Needs GA4 (see the funnel)."} />
          </div>
        </Panel>
      </section>

      <section ref={listRef} aria-labelledby="pages" className="mt-6 flex scroll-mt-4 flex-col gap-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3">
            <h2 id="pages" className="text-[18px] font-semibold tracking-[-0.01em]">Pages</h2>
            {filter ? (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-v-ink py-1 ps-3 pe-1 text-[12.5px] font-medium text-white tabular-nums">
                {FILTER_LABEL[filter]} · {visible.length}
                <button type="button" onClick={() => setFilter(null)} aria-label="Clear filter" className="grid size-5 place-items-center rounded-full bg-white/20 transition-[background-color,transform] duration-150 ease-out outline-none hover:bg-white/30 focus-visible:ring-2 focus-visible:ring-white active:scale-[0.9]">
                  <X className="size-3" aria-hidden="true" />
                </button>
              </span>
            ) : (
              <span className="text-[13px] text-v-muted tabular-nums">{rows.length} in the sitemap, most search demand first{!structure.live && " · search numbers from Friday’s pull"}</span>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div role="radiogroup" aria-label="Kind of page" className="inline-flex rounded-full bg-v-soft p-0.5 text-[13px]">
              {KIND_TABS.map(([k, label]) => (
                <button key={k} type="button" role="radio" aria-checked={kind === k} onClick={() => setKind(k)}
                  className={`rounded-full px-3 py-1 font-medium transition-[background-color,color,transform] duration-150 ease-out outline-none focus-visible:ring-2 focus-visible:ring-v-ink active:scale-[0.97] ${kind === k ? "bg-v-surface text-v-ink shadow-[0_1px_2px_rgba(14,19,34,0.08)]" : "text-v-muted hover:text-v-ink"}`}>
                  {label}
                </button>
              ))}
            </div>
            <label className="relative">
              <span className="sr-only">Search pages</span>
              <Search className="pointer-events-none absolute top-1/2 start-3 size-3.5 -translate-y-1/2 text-v-muted" aria-hidden="true" />
              <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="/blog/dtz"
                className="h-8 w-44 rounded-full bg-v-soft ps-8 pe-3 font-[family-name:var(--v-font-mono)] text-[12.5px] text-v-ink outline-none placeholder:text-v-muted focus-visible:ring-2 focus-visible:ring-v-ink" />
            </label>
          </div>
        </div>
        <PageList rows={visible} sectionLabel={sectionLabel} funnelKnown={!!live} indexKnown={!!indexing} />
      </section>
    </div>
  )
}

const FILTER_LABEL: Record<Filter, string> = { action: "Need an action", noindex: "Not in Google", leak: "Visitors don't practise" }
const KIND_TABS: [KindTab, string][] = [["all", "All"], ["practice", "Practice"], ["landing", "Landing"], ["blog", "Blog"], ["other", "Other"]]
const KIND_LABEL: Record<PageKind, string> = { practice: "Practice pages", landing: "Landing pages", blog: "Blog", other: "Other pages" }
const STEP_LABEL: Record<FunnelStep, string> = { visits: "Search visits", practice: "Started a test", account: "Signed up", checkout: "Checkout", paid: "Paid" }

function LiveMark() {
  return <span className="inline-flex items-center gap-1 text-[11.5px] font-medium text-v-ink"><Radio className="size-3" aria-hidden="true" /> live</span>
}

function Tile({ label, chip, children }: { label: string; chip?: ReactNode; children: ReactNode }) {
  return (
    <div className="flex min-w-0 flex-col gap-2 p-4 sm:p-5">
      <span className="flex items-center justify-between gap-2 text-[13px] text-v-muted">{label}{chip}</span>
      {children}
    </div>
  )
}

/** Change in plain ink, like the rest of the admin: colour is for state, not direction. */
function Pair({ value, label, now, before }: { value: string; label: string; now?: number; before?: number }) {
  const d = now !== undefined && before ? Math.round((now / before - 1) * 100) : null
  return (
    <div className="min-w-0">
      <b className="block text-[24px] leading-tight font-semibold tracking-[-0.02em] tabular-nums sm:text-[28px]">{value}</b>
      <span className="text-[12.5px] text-v-muted tabular-nums">
        {label}
        {d !== null && <span className="ms-1.5 font-medium text-v-ink">{d > 0 ? "▲" : d < 0 ? "▼" : "±"} {Math.abs(d)} %</span>}
      </span>
    </div>
  )
}

function Unknown({ detail }: { detail: string }) {
  return <span className="text-[13px] leading-snug text-v-muted">Unknown, not zero: GA4 didn&apos;t answer ({detail}).</span>
}

function MiniFunnel({ c }: { c: FunnelCounts }) {
  const max = Math.max(c.visits, 1)
  return (
    <span className="block" aria-hidden="true">
      <span className="flex h-10 items-end gap-1">
        {STEPS.map((s) => (
          <span key={s} className={`flex-1 rounded-t-[5px] rounded-b-[2px] ${s === "paid" ? "bg-[var(--p-ember)]" : "bg-v-soft"}`} style={{ height: `${Math.max(6, Math.sqrt(c[s] / max) * 100)}%` }} />
        ))}
      </span>
      <span className="mt-1 flex justify-between font-[family-name:var(--v-font-mono)] text-[10px] tracking-[0.06em] text-v-muted uppercase">
        <span>Visit</span><span>Test</span><span>Sign-up</span><span>Checkout</span><span>Paid</span>
      </span>
    </span>
  )
}

function FunnelDetail({ total, byKind }: { total: FunnelCounts; byKind: Record<PageKind, FunnelCounts> }) {
  const weakest = weakestStep(total)
  const kinds = (["practice", "landing", "blog", "other"] as PageKind[]).filter((k) => byKind[k].visits > 0)
  const ranked = kinds.filter((k) => byKind[k].visits >= MIN_VISITS).sort((a, b) => (rate(byKind[b].practice, byKind[b].visits) ?? 0) - (rate(byKind[a].practice, byKind[a].visits) ?? 0))
  return (
    <Panel>
      <div className="flex flex-col gap-4 p-4 sm:p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="text-[14.5px] font-semibold">Search to paid, by kind of page</h3>
            <p className="mt-0.5 max-w-[72ch] text-[12.5px] leading-relaxed text-v-muted">GA4, last 28 days: visitors from Google, Bing and AI assistants, by the page they landed on. Only visitors who accepted statistics cookies are counted, so every number is a floor. Shaded: the weakest step in each row.</p>
          </div>
          {weakest && <span className="rounded-full bg-[color-mix(in_srgb,var(--p-ember)_14%,transparent)] px-2.5 py-1 text-[12px] font-medium text-v-ink">Weakest step overall: {STEP_LABEL[weakest].toLowerCase()}</span>}
        </div>
        {kinds.length === 0 ? (
          <p className="text-[13.5px] text-v-muted">No search visits recorded in the last 28 days.</p>
        ) : (
          <div className="-mx-1 overflow-x-auto px-1">
            <table className="w-full min-w-[620px] border-separate border-spacing-0.5 text-[13px] tabular-nums">
              <thead>
                <tr className="text-start font-[family-name:var(--v-font-mono)] text-[10.5px] tracking-[0.08em] text-v-muted uppercase">
                  <th className="px-3 pb-1 font-normal" />
                  {STEPS.map((s) => <th key={s} className="px-3 pb-1 text-start font-normal">{STEP_LABEL[s]}</th>)}
                </tr>
              </thead>
              <tbody>
                {kinds.map((k) => <FunnelRow key={k} label={KIND_LABEL[k]} c={byKind[k]} />)}
                <FunnelRow label="Total" c={total} total />
              </tbody>
            </table>
          </div>
        )}
        {ranked.length > 1 && (
          <p className="rounded-xl bg-v-bg px-4 py-3 text-[13px] leading-relaxed">
            <span className="font-semibold">{KIND_LABEL[ranked[0]]}</span> turn the most search visitors into a test ({pct(rate(byKind[ranked[0]].practice, byKind[ranked[0]].visits))}); <span className="font-semibold">{KIND_LABEL[ranked.at(-1)!].toLowerCase()}</span> the fewest ({pct(rate(byKind[ranked.at(-1)!].practice, byKind[ranked.at(-1)!].visits))}).
          </p>
        )}
      </div>
    </Panel>
  )
}

function FunnelRow({ label, c, total = false }: { label: string; c: FunnelCounts; total?: boolean }) {
  const weak = weakestStep(c)
  return (
    <tr>
      <th scope="row" className="px-3 py-2 text-start font-semibold">{label}</th>
      {STEPS.map((s, i) => {
        const r = i ? rate(c[s], c[STEPS[i - 1]]) : null
        const leak = !total && weak === s
        return (
          <td key={s} className={`rounded-md px-3 py-2 ${total ? "bg-v-soft font-semibold" : leak ? "bg-[color-mix(in_srgb,var(--p-ember)_16%,transparent)] font-semibold" : "bg-v-bg"}`}>
            {nf.format(c[s])}{s === "paid" && c.revenue > 0 && <> · {eur.format(c.revenue)}</>}
            {r !== null && <span className="block text-[11px] font-medium text-v-muted">{pct(r)}</span>}
          </td>
        )
      })}
    </tr>
  )
}

function FilterCard({ on, onClick, n, title, note, urgent }: { on: boolean; onClick: () => void; n: number | null; title: string; note: string; urgent?: boolean }) {
  return (
    <button
      type="button"
      aria-pressed={on}
      onClick={onClick}
      className={`flex min-w-0 items-center gap-4 p-4 text-start transition-[background-color] duration-150 ease-out outline-none focus-visible:ring-2 focus-visible:ring-v-ink focus-visible:ring-inset sm:p-5 ${on ? "bg-v-bg! shadow-[inset_0_-2px_0_var(--v-ink)]" : "hover:bg-v-bg/70"}`}
    >
      <span className={`min-w-10 text-[28px] leading-none font-semibold tracking-[-0.02em] tabular-nums ${n === null ? "text-v-muted" : urgent && n > 0 ? "text-[var(--p-ember)]" : ""}`}>{n ?? "–"}</span>
      <span className="min-w-0">
        <span className="block text-[14.5px] font-semibold">{title}</span>
        <span className="mt-0.5 block text-[12.5px] leading-snug text-v-muted">{note}</span>
      </span>
    </button>
  )
}

function IndexChip({ r }: { r: Row }) {
  const chip = (cls: string, text: string) => <span className={`inline-flex shrink-0 rounded-full px-2 py-0.5 text-[11.5px] font-medium whitespace-nowrap ${cls}`}>{text}</span>
  switch (r.index) {
    case "indexed": return chip("bg-v-soft text-v-ink", "Indexed")
    case "not-indexed": return chip("bg-[var(--p-ember)] text-white", "Not in Google")
    case "discovered": return chip("bg-[color-mix(in_srgb,var(--p-ember)_16%,transparent)] text-v-ink", "Discovered")
    case "canonical": return chip("bg-v-soft text-v-muted", "Canonical elsewhere")
    case "noindex": return chip("bg-v-soft text-v-muted", "Leaves the index")
    default: return <span className="text-[12px] text-v-muted">Not checked</span>
  }
}

const GRID = "xl:grid-cols-[48px_minmax(0,1.5fr)_128px_64px_60px_68px_76px_64px_minmax(0,1.3fr)_20px]"

function PageList({ rows, sectionLabel, funnelKnown, indexKnown }: { rows: Row[]; sectionLabel: Map<string, string>; funnelKnown: boolean; indexKnown: boolean }) {
  const [open, setOpen] = useState<string | null>(null)
  if (!rows.length) return <Panel><p className="px-5 py-10 text-center text-[14px] text-v-muted">No page matches this filter.</p></Panel>
  return (
    <Panel>
      <div className={`hidden gap-x-3 border-b border-v-line bg-v-bg/60 px-4 py-2.5 font-[family-name:var(--v-font-mono)] text-[10.5px] tracking-[0.08em] text-v-muted uppercase xl:grid ${GRID}`}>
        <span>Score</span><span>Page</span><span>Index</span><span className="text-end">Clicks</span><span className="text-end">Pos.</span>
        <span className="text-end" title="Visits from Google, Bing and AI assistants that landed here (GA4)">Visits</span><span className="text-end">Tests</span><span className="text-end">Paid</span><span>Next step</span><span />
      </div>
      <ul className="divide-y divide-v-line">
        {rows.map((r) => (
          <PageRow key={r.page.path} r={r} open={open === r.page.path} onToggle={() => setOpen(open === r.page.path ? null : r.page.path)} sectionLabel={sectionLabel.get(r.page.section) ?? r.page.section} funnelKnown={funnelKnown} indexKnown={indexKnown} />
        ))}
      </ul>
    </Panel>
  )
}

function PageRow({ r, open, onToggle, sectionLabel, funnelKnown, indexKnown }: { r: Row; open: boolean; onToggle: () => void; sectionLabel: string; funnelKnown: boolean; indexKnown: boolean }) {
  const p = r.page
  const f = r.funnel
  const action = missingFromGoogle(r.index)
    ? { text: "Request indexing and link to it from an indexed page", owner: "hannes" }
    : r.leak && p.score > 7
      ? { text: "Search visitors never start a test: add a taster link", owner: "agent" }
      : nextAction(p)
  const panel = `row-${p.path}`
  const num = (v: ReactNode, known: boolean) => (known ? v : <span className="text-v-muted">–</span>)
  return (
    <li className={`transition-colors duration-150 ${open ? "bg-v-bg/50" : ""}`}>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panel}
        onClick={onToggle}
        className={`grid w-full grid-cols-[44px_minmax(0,1fr)_20px] items-start gap-x-3 gap-y-1 px-4 py-3 text-start text-[13px] tabular-nums transition-colors duration-150 ease-out outline-none hover:bg-v-bg/70 focus-visible:ring-2 focus-visible:ring-v-ink focus-visible:ring-inset xl:items-center ${GRID}`}
      >
        <span className={`row-span-4 flex h-8 w-11 items-center justify-center rounded-lg text-[14px] font-semibold xl:row-span-1 ${scoreTone(p.score)}`}>{p.score}</span>
        <span className="min-w-0">
          <span className="block truncate font-[family-name:var(--v-font-mono)] text-[13px]" dir="auto">{decodeURI(p.path)}</span>
          <span className="block truncate text-[12.5px] text-v-muted">{whyLine(p)}</span>
        </span>
        <span className="row-span-4 flex justify-end pt-1.5 xl:order-last xl:row-span-1 xl:pt-0" aria-hidden="true">
          <ChevronDown className={`size-4 shrink-0 text-v-muted transition-transform duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] motion-reduce:transition-none ${open ? "rotate-180" : ""}`} />
        </span>

        <span className="col-start-2 flex min-w-0 flex-col gap-0.5 xl:col-start-auto">
          <span className="flex"><IndexChip r={r} /></span>
          {r.indexNote && <span className="hidden truncate text-[11px] text-v-muted xl:block" title={r.indexNote}>{r.indexNote}</span>}
        </span>

        <span className="col-start-2 flex flex-wrap gap-x-3 text-[12.5px] text-v-muted xl:hidden">
          <span><b className="font-semibold text-v-ink">{p.now ? nf.format(p.now.clicks) : "–"}</b> clicks</span>
          {p.now?.position != null && <span>#{p.now.position.toFixed(1)}</span>}
          {funnelKnown && f && <span><b className={`font-semibold ${r.leak ? "text-[var(--p-ember)]" : "text-v-ink"}`}>{nf.format(f.visits)}</b> visits → {nf.format(f.practice)} tests{f.paid > 0 && ` → ${f.paid} paid`}</span>}
        </span>
        <span className="hidden text-end xl:block">{num(p.now ? nf.format(p.now.clicks) : "–", !!p.now)}</span>
        <span className="hidden text-end xl:block">{num(p.now?.position != null ? p.now.position.toFixed(1) : "–", p.now?.position != null)}</span>
        <span className="hidden text-end xl:block">{num(f ? nf.format(f.visits) : "", funnelKnown && !!f)}</span>
        <span className={`hidden text-end xl:block ${r.leak ? "font-semibold text-[var(--p-ember)]" : ""}`}>
          {num(f ? <>{nf.format(f.practice)}{f.visits >= MIN_VISITS && <span className="block text-[11px] font-medium text-v-muted">{pct(rate(f.practice, f.visits))}</span>}</> : "", funnelKnown && !!f)}
        </span>
        <span className="hidden text-end xl:block">{num(f ? (f.paid ? <>{f.paid}<span className="block text-[11px] text-v-muted">{eur.format(f.revenue)}</span></> : "0") : "", funnelKnown && !!f)}</span>

        <span className="col-start-2 flex min-w-0 items-center gap-2 xl:col-start-auto">
          <span className={`min-w-0 truncate ${action.text === "Nothing to do" ? "text-v-muted" : "font-medium"}`} title={action.text}>{action.text}</span>
          {action.owner && <span className="shrink-0 rounded-full bg-v-soft px-2 py-0.5 text-[11px] font-medium text-v-muted">{OWNER[action.owner] ?? action.owner}</span>}
        </span>
      </button>
      {open && (
        <div className="pb-1">
          {r.indexNote && indexKnown && (
            <p className="mx-4 mt-1 rounded-xl bg-v-surface px-4 py-2.5 text-[13px] leading-relaxed sm:mx-5 xl:ms-[76px]">
              <span className="font-semibold">Google: </span>{r.indexNote}. Open the URL in Search Console, request indexing, and add a link to it from an indexed page with real traffic.
            </p>
          )}
          <PageDetail id={panel} p={p} sectionLabel={sectionLabel} />
        </div>
      )}
    </li>
  )
}
