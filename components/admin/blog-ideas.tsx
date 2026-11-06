"use client"

import { useMemo, useState, useTransition } from "react"
import { ChevronDown, CircleCheck, ExternalLink, LoaderCircle, RadioTower } from "lucide-react"
import { Empty, Panel } from "@/components/admin/admin-ui"
import { CopyButton } from "@/components/admin/copy-button"
import { scanNow, setSuggestionStatus, type ActionResult } from "@/app/(admin)/admin/blog/actions"
import type { AdminSuggestion, ScanSummary, SuggestionStatus } from "@/lib/admin/blog"
import { suggestionPrompt } from "@/lib/admin/blog-prompts"
import type { SuggestionKind } from "@/lib/content-ideas/model"
import { cn } from "@/lib/utils"

/**
 * The ideas of `/admin/blog`: what the weekly community scan proposed, in three kinds, each with the quotes that
 * prove it and a prompt for Claude Code. Hannes plans, finishes or dismisses; nothing here edits the site.
 */

const KIND: Record<SuggestionKind, { label: string; plural: string; hint: string }> = {
  article: { label: "New article", plural: "New articles", hint: "A post we don't have. The prompt drafts it as `status: 'draft'`." },
  adjust: { label: "Adjustment", plural: "Adjustments", hint: "A question an existing post or page should answer and doesn't." },
  tool: { label: "Tool", plural: "Tools people look for", hint: "Something interactive people ask for. The prompt writes a proposal, not code." },
}

const STATUS: Record<SuggestionStatus, string> = { open: "Open", planned: "Planned", done: "Done", dismissed: "Dismissed" }
const SOURCE: Record<string, string> = { reddit: "Reddit", google_paa: "People also ask", google_related: "Related searches", gutefrage: "gutefrage.net" }

const stamp = (iso: string) => new Date(iso).toLocaleString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit", timeZone: "Europe/Berlin" })

const PILL = "inline-flex h-8 items-center rounded-full px-3 text-[13px] font-medium transition-[background-color,color,transform] duration-150 ease-out outline-none focus-visible:ring-2 focus-visible:ring-v-ink active:scale-[0.97]"

/** Plan / Done / Dismiss. The current state is the pressed one; a change refreshes the page data. */
function StatusButtons({ s }: { s: AdminSuggestion }) {
  const [pending, start] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const set = (status: SuggestionStatus) =>
    start(async () => {
      const r = await setSuggestionStatus(s.id, status)
      setError(r.ok ? null : r.error)
    })
  const choices: SuggestionStatus[] = s.status === "dismissed" ? ["open"] : ["planned", "done", "dismissed"]
  return (
    <div className="flex flex-wrap items-center gap-1.5" role="group" aria-label="Status">
      {choices.map((st) => (
        <button key={st} type="button" disabled={pending} aria-pressed={s.status === st} onClick={() => set(st)} className={cn(PILL, s.status === st ? "bg-v-ink text-v-bg" : "bg-v-surface text-v-muted ring-1 ring-v-line ring-inset hover:text-v-ink", pending && "opacity-60")}>
          {st === "open" ? "Reopen" : STATUS[st]}
        </button>
      ))}
      {pending ? <LoaderCircle className="size-4 animate-spin text-v-muted motion-reduce:animate-none" aria-hidden="true" /> : null}
      {error ? <span role="alert" className="text-[12.5px] font-medium text-[#B42318]">{error}</span> : null}
    </div>
  )
}

function IdeaCard({ s }: { s: AdminSuggestion }) {
  const [open, setOpen] = useState(false)
  return (
    <article className={cn("flex flex-col gap-3 px-5 py-4 sm:px-6", s.status === "dismissed" && "opacity-60")}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-x-4">
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <h3 className="text-[16px] leading-snug font-semibold tracking-[-0.01em] text-balance">{s.title}</h3>
          <p className="text-[13px] text-v-muted">
            {KIND[s.kind].label}
            {s.target_path ? <> · <span className="font-[family-name:var(--v-font-mono)] text-[12px]">{s.target_path}</span></> : null}
            {s.slug ? <> · <span className="font-[family-name:var(--v-font-mono)] text-[12px]">/blog/{s.slug}</span></> : null}
            {" · "}{s.week}
            {s.status !== "open" ? <> · {STATUS[s.status]}{s.decidedAt ? ` ${stamp(s.decidedAt)}` : ""}</> : null}
          </p>
        </div>
        <StatusButtons s={s} />
      </div>
      <p className="max-w-[72ch] text-[14.5px] leading-relaxed">{s.why}</p>
      <ul className="flex flex-col gap-1.5">
        {s.evidence.map((e, i) => (
          <li key={`${e.question_id}-${i}`} className="flex gap-2 text-[13.5px] leading-relaxed text-v-muted">
            <span aria-hidden="true" className="select-none">“</span>
            <span className="min-w-0">
              {e.quote}
              {e.url ? (
                <a href={e.url} target="_blank" rel="noreferrer" className="ms-1.5 inline-flex items-center gap-0.5 rounded-sm align-baseline text-v-ink underline-offset-4 outline-none hover:underline focus-visible:ring-2 focus-visible:ring-v-ink">
                  source <ExternalLink className="size-3" aria-hidden="true" />
                </a>
              ) : null}
            </span>
          </li>
        ))}
      </ul>
      <div className="flex flex-wrap items-center gap-2">
        <CopyButton text={() => suggestionPrompt(s)} label={s.kind === "tool" ? "Write the proposal: copy prompt" : s.kind === "article" ? "Draft it: copy prompt" : "Improve it: copy prompt"} />
        <button type="button" aria-expanded={open} onClick={() => setOpen((o) => !o)} className={cn(PILL, "h-9 gap-1.5 bg-v-soft px-3.5 text-[13.5px] text-v-ink hover:bg-v-line")}>
          Brief <ChevronDown className={cn("size-4 transition-transform duration-200 ease-out", open && "rotate-180")} aria-hidden="true" />
        </button>
      </div>
      {open ? <p className="max-w-[72ch] rounded-[16px] bg-v-bg px-4 py-3 text-[13.5px] leading-relaxed whitespace-pre-line">{s.brief}</p> : null}
    </article>
  )
}

/** The scan line: what the last run found per source, and the button that runs the next step by hand. */
export function ScanStatus({ scan, canScan, config }: { scan: ScanSummary | null; canScan: { apify: boolean; ranking: boolean }; config: { reddit: string[]; google: number; maxPerWeek: number } }) {
  const [pending, start] = useTransition()
  const [result, setResult] = useState<ActionResult | null>(null)
  const sources = Object.entries(scan?.questions ?? {})
  const state = !scan ? "No scan yet." : scan.status === "done" ? `Scan ${scan.week}, finished ${scan.finishedAt ? stamp(scan.finishedAt) : ""}.` : scan.status === "error" ? `Scan ${scan.week} failed: ${scan.error ?? "unknown error"}.` : `Scan ${scan.week} is ${scan.status === "running" ? "collecting" : "ranking"} since ${stamp(scan.startedAt)}.`
  return (
    <Panel>
      <div className="flex flex-col gap-3 p-5 sm:flex-row sm:items-start sm:justify-between sm:p-6">
        <div className="flex min-w-0 flex-col gap-1.5">
          <p className="flex items-center gap-2 text-[14.5px] font-medium">
            <RadioTower className="size-4 shrink-0 text-v-muted" aria-hidden="true" />
            {state}
          </p>
          <p className="text-[13px] leading-relaxed text-v-muted">
            {sources.length ? sources.map(([k, v]) => `${SOURCE[k] ?? k} ${v}`).join(" · ") : "Questions per source: unknown."}
            {scan?.newQuestions != null ? ` · ${scan.newQuestions} new` : ""}
            {scan?.suggestions != null ? ` · ${scan.suggestions} ideas` : ""}
          </p>
          <p className="text-[13px] leading-relaxed text-v-muted">
            Every Friday: Reddit searches for {config.reddit.join(", ")}, and {config.google} Google queries incl. gutefrage.net, at most {config.maxPerWeek} ideas. Facebook groups are not scanned (login-gated).
            {!canScan.apify ? " APIFY_API_KEY is missing on this server." : !canScan.ranking ? " ANTHROPIC_API_KEY is missing on this server: questions are collected, ideas are not." : ""}
          </p>
          {result ? (
            <p aria-live="polite" role={result.ok ? undefined : "alert"} className={cn("flex items-start gap-2 text-[13.5px]", result.ok ? "text-v-ink" : "font-medium text-[#B42318]")}>
              {result.ok ? <CircleCheck className="mt-0.5 size-4 shrink-0 text-v-accent" aria-hidden="true" /> : null}
              <span>{result.ok ? result.message : result.error}</span>
            </p>
          ) : null}
        </div>
        <button
          type="button"
          disabled={pending || !canScan.apify}
          aria-busy={pending}
          onClick={() => start(async () => setResult(await scanNow()))}
          className="v-cta inline-flex h-10 shrink-0 items-center gap-2 rounded-full px-4 text-[14px] font-medium transition-[opacity,transform] duration-150 ease-out outline-none hover:opacity-90 focus-visible:ring-2 focus-visible:ring-v-ink focus-visible:ring-offset-2 active:scale-[0.97] disabled:opacity-50"
        >
          {pending ? <LoaderCircle className="size-4 animate-spin motion-reduce:animate-none" aria-hidden="true" /> : null}
          {pending ? "Running …" : scan?.status === "running" || scan?.status === "ranking" ? "Collect now" : "Scan now"}
        </button>
      </div>
    </Panel>
  )
}

/** This week's open ideas, grouped by kind. */
export function WeekIdeas({ suggestions, week }: { suggestions: AdminSuggestion[]; week: string | null }) {
  const open = suggestions.filter((s) => s.status === "open")
  if (!open.length) return <Empty>{week ? `Nothing open from scan ${week}. Dismissed and finished ideas sit under "All ideas".` : "The first scan runs on Friday evening, or press Scan now."}</Empty>
  return (
    <div className="flex flex-col gap-6">
      {(["article", "adjust", "tool"] as const).map((kind) => {
        const items = open.filter((s) => s.kind === kind)
        if (!items.length) return null
        return (
          <section key={kind} className="flex flex-col gap-2">
            <div className="flex items-baseline gap-3">
              <h3 className="text-[15px] font-semibold tracking-[-0.01em]">{KIND[kind].plural} <span className="v-num text-[13px] font-normal text-v-muted">{items.length}</span></h3>
              <p className="text-[13px] text-v-muted">{KIND[kind].hint}</p>
            </div>
            <Panel>
              <div className="divide-y divide-v-line">{items.map((s) => <IdeaCard key={s.id} s={s} />)}</div>
            </Panel>
          </section>
        )
      })}
    </div>
  )
}

/** Everything ever proposed, filterable by status and kind. */
export function AllIdeas({ suggestions }: { suggestions: AdminSuggestion[] }) {
  const [status, setStatus] = useState<SuggestionStatus | "all">("all")
  const [kind, setKind] = useState<SuggestionKind | "all">("all")
  const rows = useMemo(() => suggestions.filter((s) => (status === "all" || s.status === status) && (kind === "all" || s.kind === kind)), [suggestions, status, kind])
  const chip = (on: boolean) => cn(PILL, on ? "bg-v-ink text-v-bg" : "bg-v-surface text-v-muted ring-1 ring-v-line ring-inset hover:text-v-ink")
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap gap-x-4 gap-y-2">
        <div role="group" aria-label="Status" className="flex flex-wrap gap-1.5">
          {(["all", "open", "planned", "done", "dismissed"] as const).map((st) => (
            <button key={st} type="button" aria-pressed={status === st} onClick={() => setStatus(st)} className={chip(status === st)}>{st === "all" ? "Any status" : STATUS[st]}</button>
          ))}
        </div>
        <div role="group" aria-label="Kind" className="flex flex-wrap gap-1.5">
          {(["all", "article", "adjust", "tool"] as const).map((k) => (
            <button key={k} type="button" aria-pressed={kind === k} onClick={() => setKind(k)} className={chip(kind === k)}>{k === "all" ? "Any kind" : KIND[k].label}</button>
          ))}
        </div>
      </div>
      {rows.length ? (
        <Panel>
          <div className="divide-y divide-v-line">{rows.map((s) => <IdeaCard key={s.id} s={s} />)}</div>
        </Panel>
      ) : (
        <Empty>{suggestions.length ? "No idea matches these filters." : "No ideas yet."}</Empty>
      )}
    </div>
  )
}
