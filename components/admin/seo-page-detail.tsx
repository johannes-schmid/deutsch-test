"use client"

import { useState, type ReactNode } from "react"
import { ExternalLink, ListChecks } from "lucide-react"
import { CopyButton } from "@/components/admin/copy-button"
import type { StructurePage } from "@/lib/admin/seo"
import { aiPrompt, manualSteps, type PromptPage } from "@/lib/admin/seo-prompts"

/**
 * One page of `/admin/seo` opened in the board's table: why the score, the search numbers, the recommended
 * action, the health check, and two buttons: a prompt for Claude Code or the steps to do it by hand. The
 * texts are built on that click (seo-prompts.ts). The one-line helpers are shared with `seo-board.tsx`.
 */

const nf = new Intl.NumberFormat("en-GB")
const ORIGIN = "https://deutschtest-ueben.de"

export const OWNER: Record<string, string> = { hannes: "You", agent: "Agent" }

/** Scores stay in ink; only a page under 5 gets the ember, the one status colour the admin uses. */
export function scoreTone(score: number) {
  if (score >= 8) return "bg-v-soft text-v-ink"
  if (score >= 5) return "bg-[color-mix(in_srgb,var(--p-ember)_14%,transparent)] text-v-ink"
  return "bg-[var(--p-ember)] text-white"
}

/** The next step in one line: the to-do list first, then the triage plan, then the score itself. */
export function nextAction(p: StructurePage): { text: string; owner: string | null } {
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

export function whyLine(p: StructurePage): string {
  if (!p.factors.length) return p.demand > 0 || (p.now?.impressions ?? 0) > 0 ? "No issues found" : "No issues found, no search demand yet"
  return [...p.factors].sort((a, b) => a.delta - b.delta)[0].label
}

function Block({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="min-w-0">
      <h4 className="text-[12.5px] font-semibold text-v-muted">{title}</h4>
      <div className="mt-1.5">{children}</div>
    </div>
  )
}

export function PageDetail({ id, p, sectionLabel }: { id: string; p: StructurePage; sectionLabel: string }) {
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
