"use client"

import { useMemo, useState, type ReactNode } from "react"
import { Check, ChevronDown, ClipboardCopy, ExternalLink, ListChecks, Sparkles, TriangleAlert } from "lucide-react"
import type { SiteStructure, StructurePage } from "@/lib/admin/seo"
import { aiPrompt, manualSteps, type PromptPage } from "@/lib/admin/seo-prompts"

/**
 * The site structure of `/admin/seo`: every sitemap page in its section, with a score out of 10, the
 * reason and the next step. A click opens the page: why the score, the search numbers, and two buttons:
 * a prompt for Claude Code or the steps to do it by hand. The texts are built on that click (seo-prompts.ts).
 */

const nf = new Intl.NumberFormat("en-GB")
const ORIGIN = "https://deutschtest-ueben.de"

const OWNER: Record<string, string> = { hannes: "You", agent: "Agent" }

/** Scores stay in ink; only a page under 5 gets the ember, the one status colour the admin uses. */
function scoreTone(score: number) {
  if (score >= 8) return "bg-v-soft text-v-ink"
  if (score >= 5) return "bg-[color-mix(in_srgb,var(--p-ember)_14%,transparent)] text-v-ink"
  return "bg-[var(--p-ember)] text-white"
}

/** The next step in one line: the to-do list first, then the triage plan, then the score itself. */
function nextAction(p: StructurePage): { text: string; owner: string | null } {
  const rec = p.recs[0]
  if (rec) return { text: rec.task, owner: rec.owner }
  const owner = p.plan?.owner ?? null
  switch (p.verdict) {
    case "remove": return { text: "Noindex it and drop it from the sitemap", owner }
    case "consolidate": return { text: `Merge into ${p.plan?.into ?? "the stronger page"}`, owner }
    case "improve": return { text: "Rewrite with a worked example", owner }
    case "watch": return { text: p.factors.some((f) => f.key !== "verdict") ? "Fix it, then keep watching" : "Nothing now, keep watching", owner }
  }
  const snippet = p.factors.find((f) => f.key === "snippet")
  if (snippet) return { text: snippet.label.startsWith("Title") ? "Shorten the title" : "Fix the meta description length", owner: "agent" }
  if (p.factors.some((f) => f.key === "technical")) return { text: "Fix the technical error", owner: "agent" }
  if (p.factors.length) return { text: "Find out why Google shows it less", owner: "agent" }
  return { text: "Nothing to do", owner: null }
}

function whyLine(p: StructurePage): string {
  if (!p.factors.length) return p.demand > 0 || (p.now?.impressions ?? 0) > 0 ? "No issues found" : "No issues found, no search demand yet"
  return [...p.factors].sort((a, b) => a.delta - b.delta)[0].label
}

type Filter = "all" | "action"

/** A 9 with only a long title is not this week's work; from a 7 down it is. */
const needsAction = (p: StructurePage) => p.score <= 7

export function SeoStructure({ structure }: { structure: SiteStructure }) {
  const [filter, setFilter] = useState<Filter>("all")
  const bySection = useMemo(() => {
    const m = new Map<string, StructurePage[]>()
    for (const p of structure.pages) m.set(p.section, [...(m.get(p.section) ?? []), p])
    for (const list of m.values()) list.sort((a, b) => b.weight - a.weight || a.score - b.score)
    return m
  }, [structure.pages])
  const needAction = structure.pages.filter(needsAction).length

  return (
    <section className="flex flex-col gap-3" aria-labelledby="structure">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="min-w-0">
          <h2 id="structure" className="text-[18px] font-semibold tracking-[-0.01em]">Site structure</h2>
          <p className="mt-1 max-w-[68ch] text-[13.5px] leading-relaxed text-v-muted">
            Every page in the sitemap, grouped and scored out of 10. Open a group to see its pages, most demand first. {needAction === 0 ? "No page scores 7 or lower." : `${needAction} score 7 or lower and need an action.`}
            {!structure.live && " Search numbers from Friday’s data pull."}
          </p>
        </div>
        <div role="radiogroup" aria-label="Filter pages" className="inline-flex rounded-full bg-v-soft p-0.5 text-[13px]">
          {([["all", "All pages"], ["action", "Needs action"]] as const).map(([k, label]) => (
            <button
              key={k}
              type="button"
              role="radio"
              aria-checked={filter === k}
              onClick={() => setFilter(k)}
              className={`rounded-full px-3 py-1 font-medium transition-[background-color,color,transform] duration-150 ease-out outline-none focus-visible:ring-2 focus-visible:ring-v-ink active:scale-[0.97] ${filter === k ? "bg-v-surface text-v-ink shadow-[0_1px_2px_rgba(14,19,34,0.08)]" : "text-v-muted hover:text-v-ink"}`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {structure.sections.map((s) => {
          const all = bySection.get(s.key) ?? []
          if (!all.length) return null
          const rows = filter === "all" ? all : all.filter(needsAction)
          return <SectionBlock key={s.key} label={s.label} note={s.note} score={s.score} total={all.length} rows={rows} actions={all.filter(needsAction).length} forceOpen={filter === "action" && rows.length > 0} />
        })}
      </div>
    </section>
  )
}

function SectionBlock({ label, note, score, total, rows, actions, forceOpen }: { label: string; note: string; score: number | null; total: number; rows: StructurePage[]; actions: number; forceOpen: boolean }) {
  const [toggled, setToggled] = useState<boolean | null>(null)
  const open = toggled ?? forceOpen
  const id = `sec-${label.replace(/\W+/g, "-").toLowerCase()}`
  return (
    <div className="nz-paper overflow-hidden rounded-[22px]">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setToggled(!open)}
        className="grid w-full grid-cols-[1fr_auto] items-center gap-x-4 px-4 py-4 text-start transition-colors duration-150 ease-out outline-none hover:bg-v-bg/70 focus-visible:bg-v-bg/70 focus-visible:ring-2 focus-visible:ring-v-ink focus-visible:ring-inset sm:px-5"
      >
        <span className="min-w-0">
          <span className="flex flex-wrap items-baseline gap-x-2">
            <span className="text-[15px] font-semibold tracking-[-0.01em]">{label}</span>
            <span className="text-[12.5px] text-v-muted tabular-nums">{total} {total === 1 ? "page" : "pages"} · {actions === 0 ? "nothing urgent" : `${actions} need an action`}</span>
          </span>
          <span className="mt-0.5 block text-[12.5px] text-v-muted">{note}</span>
        </span>
        <span className="flex items-center gap-3">
          {score !== null && (
            <span className={`rounded-lg px-2.5 py-1 text-[14px] font-semibold tabular-nums ${scoreTone(score)}`}>
              {score.toFixed(1)}<span className="text-[11px] font-medium opacity-70">/10</span>
            </span>
          )}
          <ChevronDown className={`size-4 text-v-muted transition-transform duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] motion-reduce:transition-none ${open ? "rotate-180" : ""}`} aria-hidden="true" />
        </span>
      </button>

      {open && (
        <div id={id} className="border-t border-v-line bg-v-bg/50 px-2 pb-2 sm:px-3 sm:pb-3">
          {rows.length === 0 ? (
            <p className="px-3 py-4 text-[14px] text-v-muted">Every page here scores 8 or higher.</p>
          ) : (
            <>
              <div className="hidden grid-cols-[52px_minmax(0,1.3fr)_minmax(0,1.2fr)_minmax(0,1.4fr)_28px] gap-x-4 px-3 pt-3 pb-1.5 font-[family-name:var(--v-font-mono)] text-[11px] tracking-[0.08em] text-v-muted uppercase lg:grid">
                <span>Score</span><span>Page</span><span>Why</span><span>Next action</span><span />
              </div>
              <ul className="flex flex-col gap-1">
                {rows.map((p) => <PageRow key={p.path} p={p} sectionLabel={label} />)}
              </ul>
            </>
          )}
        </div>
      )}
    </div>
  )
}

function PageRow({ p, sectionLabel }: { p: StructurePage; sectionLabel: string }) {
  const [open, setOpen] = useState(false)
  const action = nextAction(p)
  const panel = `row-${p.path}`
  return (
    <li className={`rounded-xl transition-colors duration-150 ${open ? "bg-v-surface shadow-[0_1px_2px_rgba(14,19,34,0.06)]" : ""}`}>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panel}
        onClick={() => setOpen((o) => !o)}
        className="grid w-full grid-cols-[44px_minmax(0,1fr)_20px] items-start gap-x-3 gap-y-1 rounded-xl px-3 py-2.5 text-start transition-colors duration-150 ease-out outline-none hover:bg-v-surface focus-visible:ring-2 focus-visible:ring-v-ink lg:grid-cols-[52px_minmax(0,1.3fr)_minmax(0,1.2fr)_minmax(0,1.4fr)_28px] lg:items-center lg:gap-x-4"
      >
        <span className={`row-span-3 flex h-8 w-11 items-center justify-center rounded-lg text-[14px] font-semibold tabular-nums lg:row-span-1 ${scoreTone(p.score)}`}>{p.score}</span>
        <span className="min-w-0 truncate font-[family-name:var(--v-font-mono)] text-[13px]" dir="auto">{decodeURI(p.path)}</span>
        <span className="row-span-3 flex justify-end pt-1.5 lg:order-last lg:row-span-1 lg:pt-0" aria-hidden="true">
          <ChevronDown className={`size-4 shrink-0 text-v-muted transition-transform duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] motion-reduce:transition-none ${open ? "rotate-180" : ""}`} />
        </span>
        <span className="col-start-2 min-w-0 truncate text-[13px] text-v-muted lg:col-start-auto">{whyLine(p)}</span>
        <span className="col-start-2 flex min-w-0 items-center gap-2 lg:col-start-auto">
          <span className={`min-w-0 truncate text-[13px] ${action.text === "Nothing to do" ? "text-v-muted" : "font-medium"}`}>{action.text}</span>
          {action.owner && <span className="shrink-0 rounded-full bg-v-soft px-2 py-0.5 text-[11px] font-medium text-v-muted">{OWNER[action.owner] ?? action.owner}</span>}
        </span>
      </button>
      {open && <PageDetail id={panel} p={p} sectionLabel={sectionLabel} />}
    </li>
  )
}

function Block({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="min-w-0">
      <h4 className="text-[12.5px] font-semibold text-v-muted">{title}</h4>
      <div className="mt-1.5">{children}</div>
    </div>
  )
}

function PageDetail({ id, p, sectionLabel }: { id: string; p: StructurePage; sectionLabel: string }) {
  const [manual, setManual] = useState(false)
  const promptPage: PromptPage = { ...p, sectionLabel }

  return (
    <div id={id} className="px-3 pt-1 pb-4 transition-opacity duration-200 ease-out starting:opacity-0 motion-reduce:transition-none sm:px-4 lg:ps-[80px]">
      <div className="grid grid-cols-1 gap-x-8 gap-y-5 md:grid-cols-2">
        <Block title="Why this score">
          <ul className="flex flex-col gap-1 text-[13px] tabular-nums">
            <li className="flex justify-between gap-3 text-v-muted"><span>Starts at</span><span>10</span></li>
            {p.factors.map((f) => (
              <li key={f.key} className="flex justify-between gap-3"><span className="min-w-0">{f.label}</span><span className="shrink-0 font-semibold">{f.delta}</span></li>
            ))}
            <li className="flex justify-between gap-3 border-t border-v-line pt-1 font-semibold"><span>Score</span><span>{p.score}/10</span></li>
          </ul>
        </Block>

        <Block title="Google, last 28 days">
          {p.now ? (
            <p className="text-[13px] tabular-nums">
              <b className="font-semibold">{nf.format(p.now.impressions)}</b> impressions · <b className="font-semibold">{nf.format(p.now.clicks)}</b> clicks
              {p.now.position !== null && <> · position <b className="font-semibold">{p.now.position.toFixed(1)}</b></>}
              {p.demand > 0 && <span className="block text-[12.5px] text-v-muted">The 28 days before: {nf.format(p.demand)} impressions.</span>}
            </p>
          ) : (
            <p className="text-[13px] text-v-muted">Unknown: no Search Console data right now.</p>
          )}
          {p.queries.length > 0 && (
            <ul className="mt-2 flex flex-col gap-0.5 text-[12.5px] text-v-muted tabular-nums">
              {p.queries.map((q) => (
                <li key={q.query} className="flex justify-between gap-3"><span className="min-w-0 truncate text-v-ink">{q.query}</span><span className="shrink-0">#{Math.round(q.position)} · {nf.format(q.impressions)}</span></li>
              ))}
            </ul>
          )}
        </Block>

        <Block title="Recommended action">
          <div className="flex flex-col gap-2 text-[13px] leading-relaxed">
            {p.recs.map((r) => (
              <div key={r.id}>
                <p className="font-semibold">{r.task}</p>
                <p className="text-v-muted">{r.why}</p>
                <p className="mt-0.5"><span className="font-semibold">We expect:</span> {r.expect}</p>
              </div>
            ))}
            {p.plan && (!p.recs.length || p.plan.action !== p.recs[0]?.task) && <p>{p.plan.action}</p>}
            {!p.recs.length && !p.plan && <p>{nextAction(p).text}.</p>}
            <p className="text-[12.5px] text-v-muted">Triage: {p.reason}</p>
          </div>
        </Block>

        <Block title="Found by the health check">
          {p.issues.length ? (
            <ul className="list-disc pl-4 text-[13px] leading-relaxed marker:text-v-muted">{p.issues.map((i) => <li key={i}>{i}</li>)}</ul>
          ) : (
            <p className="text-[13px] text-v-muted">Status 200, one H1, canonical and JSON-LD in order.</p>
          )}
        </Block>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-2">
        <CopyButton text={() => aiPrompt(promptPage)} />
        <button
          type="button"
          aria-expanded={manual}
          onClick={() => setManual((m) => !m)}
          className="inline-flex h-9 items-center gap-1.5 rounded-full bg-v-soft px-3.5 text-[13.5px] font-medium transition-[background-color,transform] duration-150 ease-out outline-none hover:bg-v-line focus-visible:ring-2 focus-visible:ring-v-ink active:scale-[0.97]"
        >
          <ListChecks className="size-4" aria-hidden="true" /> Do it yourself
        </button>
        <a href={`${ORIGIN}${p.path}`} target="_blank" rel="noreferrer" className="inline-flex h-9 items-center gap-1.5 rounded-full px-3 text-[13.5px] font-medium underline-offset-4 outline-none hover:underline focus-visible:ring-2 focus-visible:ring-v-ink">
          Open page <ExternalLink className="size-3.5" aria-hidden="true" />
        </a>
      </div>

      {manual && (
        <ol className="mt-3 list-decimal rounded-xl bg-v-bg py-3 pe-4 ps-8 text-[13px] leading-relaxed marker:font-semibold marker:text-v-muted">
          {manualSteps(promptPage).map((s) => <li key={s}>{s}</li>)}
        </ol>
      )}
    </div>
  )
}

function CopyButton({ text }: { text: () => string }) {
  const [state, setState] = useState<"idle" | "copied" | "failed">("idle")
  const [fallback, setFallback] = useState<string | null>(null)
  const copy = async () => {
    const value = text()
    try {
      await navigator.clipboard.writeText(value)
      setState("copied")
      setFallback(null)
      setTimeout(() => setState("idle"), 1800)
    } catch {
      setState("failed")
      setFallback(value)
    }
  }
  return (
    <>
      <button type="button" onClick={copy} className="v-cta inline-flex h-9 items-center gap-1.5 rounded-full px-3.5 text-[13.5px] font-medium transition-[opacity,transform] duration-150 ease-out outline-none hover:opacity-90 focus-visible:ring-2 focus-visible:ring-v-ink focus-visible:ring-offset-2 active:scale-[0.97]">
        {state === "copied" ? <Check className="size-4" aria-hidden="true" /> : state === "failed" ? <TriangleAlert className="size-4" aria-hidden="true" /> : <Sparkles className="size-4" aria-hidden="true" />}
        <span aria-live="polite">{state === "copied" ? "Prompt copied" : state === "failed" ? "Copy failed, select below" : "Fix with Claude Code: copy prompt"}</span>
        {state === "idle" && <ClipboardCopy className="size-3.5 opacity-70" aria-hidden="true" />}
      </button>
      {fallback && <textarea readOnly value={fallback} onFocus={(e) => e.currentTarget.select()} className="mt-2 h-48 w-full rounded-xl bg-v-bg p-3 font-[family-name:var(--v-font-mono)] text-[12px] outline-none focus-visible:ring-2 focus-visible:ring-v-ink" />}
    </>
  )
}
