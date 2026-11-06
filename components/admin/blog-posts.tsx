"use client"

import { useEffect, useRef, useState } from "react"
import { ExternalLink, X } from "lucide-react"
import { DataTable, TBODY, TD, TH, THEAD } from "@/components/admin/admin-ui"
import { CopyButton } from "@/components/admin/copy-button"
import type { AdminPost, AdminSuggestion } from "@/lib/admin/blog"
import { improvePostPrompt, snippetPrompt, translatePrompt } from "@/lib/admin/blog-prompts"
import { cn } from "@/lib/utils"

/**
 * The posts of `/admin/blog`: one row per German post, the Google numbers and the translations at a glance,
 * a drawer per row with the file, the sections, the ideas pointing at it and three prompts for Claude Code.
 * Posts stay TSX in the repo; the admin hands out prompts, it never edits a post (CLAUDE.md §4).
 */

const ORIGIN = "https://deutschtest-ueben.de"
const nf = new Intl.NumberFormat("en-GB")
const day = (iso: string) => new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" })

const CATEGORY: Record<string, string> = { pruefungen: "Exams & results", schreiben: "Writing & speaking", tipps: "Tips" }

function StatusPill({ status }: { status: AdminPost["status"] }) {
  const live = status === "reviewed"
  return <span className={cn("inline-flex h-6 items-center rounded-full px-2.5 text-[12px] font-medium whitespace-nowrap", live ? "bg-v-ink text-v-bg" : "bg-v-soft text-v-muted")}>{live ? "Live" : "Draft"}</span>
}

/** uk · ru as two small keys: ink when the translation exists, soft when it is missing. */
function Locales({ locales }: { locales: AdminPost["locales"] }) {
  return (
    <span className="inline-flex gap-1" aria-label={`Ukrainian ${locales.uk ? "yes" : "missing"}, Russian ${locales.ru ? "yes" : "missing"}`}>
      {(["uk", "ru"] as const).map((l) => (
        <span key={l} className={cn("v-num inline-flex h-6 min-w-7 items-center justify-center rounded-full px-1.5 text-[11px] tracking-[0.06em] uppercase", locales[l] ? "bg-v-soft text-v-ink" : "text-v-muted ring-1 ring-v-line ring-inset")}>
          {l}
        </span>
      ))}
    </span>
  )
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-2">
      <h3 className="text-[14px] font-semibold tracking-[-0.01em]">{title}</h3>
      {children}
    </section>
  )
}

function Details({ post, ideas, onClose, closeRef }: { post: AdminPost | null; ideas: AdminSuggestion[]; onClose: () => void; closeRef: React.RefObject<HTMLButtonElement | null> }) {
  const p = post
  const missing = p ? (["uk", "ru"] as const).filter((l) => !p.locales[l]) : []
  return (
    <aside
      id="post-details"
      aria-label="Post details"
      inert={!p}
      className={cn(
        "fixed inset-y-2 end-2 z-50 flex w-[480px] max-w-[calc(100vw-16px)] flex-col overflow-hidden rounded-[28px] bg-v-surface shadow-[0_40px_80px_-30px_rgba(14,19,34,0.5)] transition-[transform,visibility] duration-[260ms] ease-[cubic-bezier(0.32,0.72,0,1)] motion-reduce:transition-[visibility]",
        p ? "visible translate-x-0" : "invisible translate-x-[calc(100%+16px)]",
      )}
    >
      {p ? (
        <>
          <header className="flex items-start justify-between gap-3 border-b border-v-line px-6 pt-5 pb-4">
            <div className="flex min-w-0 flex-col gap-1.5">
              <h2 className="text-[17px] leading-snug font-semibold tracking-[-0.01em] text-balance">{p.title}</h2>
              <p className="truncate font-[family-name:var(--v-font-mono)] text-[12px] text-v-muted">{p.file}</p>
              <div className="mt-1 flex items-center gap-2">
                <StatusPill status={p.status} />
                <Locales locales={p.locales} />
              </div>
            </div>
            <button ref={closeRef} type="button" onClick={onClose} aria-label="Close details" className="grid size-11 shrink-0 place-items-center rounded-full text-v-ink transition-[background-color,transform] duration-150 ease-out hover:bg-v-ink/6 active:scale-[0.95]">
              <X className="size-5" aria-hidden="true" />
            </button>
          </header>

          <div className="flex min-h-0 flex-1 flex-col gap-6 overflow-y-auto px-6 py-5">
            <div className="flex flex-wrap gap-2">
              <CopyButton text={() => improvePostPrompt(p, ideas)} label="Improve: copy prompt" />
              <CopyButton text={() => snippetPrompt(p)} label="Fix snippet" className="bg-v-soft text-v-ink [--v-cta-bg:transparent]" />
              {missing.map((l) => (
                <CopyButton key={l} text={() => translatePrompt(p, l)} label={`Translate to ${l === "uk" ? "Ukrainian" : "Russian"}`} className="bg-v-soft text-v-ink" />
              ))}
              <a href={`${ORIGIN}/blog/${p.slug}`} target="_blank" rel="noreferrer" className="inline-flex h-9 items-center gap-1.5 rounded-full px-3 text-[13.5px] font-medium underline-offset-4 outline-none hover:underline focus-visible:ring-2 focus-visible:ring-v-ink">
                Open page <ExternalLink className="size-3.5" aria-hidden="true" />
              </a>
            </div>

            <Block title="Google, last 28 days">
              {p.gsc ? (
                <p className="text-[13.5px] tabular-nums">
                  <b className="font-semibold">{nf.format(p.gsc.impressions)}</b> impressions · <b className="font-semibold">{nf.format(p.gsc.clicks)}</b> clicks
                  {p.gsc.position !== null && <> · position <b className="font-semibold">{p.gsc.position.toFixed(1)}</b></>}
                </p>
              ) : (
                <p className="text-[13.5px] text-v-muted">Unknown: no Search Console data right now.</p>
              )}
              {p.queries.length > 0 && (
                <ul className="flex flex-col gap-0.5 text-[12.5px] text-v-muted tabular-nums">
                  {p.queries.map((q) => (
                    <li key={q.query} className="flex justify-between gap-3"><span className="min-w-0 truncate text-v-ink">{q.query}</span><span className="shrink-0">#{Math.round(q.position)} · {nf.format(q.impressions)}</span></li>
                  ))}
                </ul>
              )}
            </Block>

            <Block title={ideas.length ? `Open ideas for this post (${ideas.length})` : "Open ideas for this post"}>
              {ideas.length ? (
                <ul className="flex flex-col divide-y divide-v-line rounded-[16px] border border-v-line">
                  {ideas.map((s) => (
                    <li key={s.id} className="flex flex-col gap-1 px-4 py-3 text-[13.5px]">
                      <span className="font-medium">{s.title}</span>
                      <span className="text-v-muted">{s.why}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-[13.5px] text-v-muted">None this week. The improve prompt then asks for the one thing a reader still misses.</p>
              )}
            </Block>

            <Block title="Sections">
              <ol className="list-decimal ps-5 text-[13.5px] leading-relaxed marker:text-v-muted">
                {p.sections.map((s) => <li key={s}>{s}</li>)}
              </ol>
            </Block>

            <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-[13.5px]">
              <div><dt className="text-[12px] text-v-muted">Published</dt><dd className="font-medium">{day(p.published)}</dd></div>
              <div><dt className="text-[12px] text-v-muted">Last review</dt><dd className="font-medium">{day(p.reviewed)}</dd></div>
              <div><dt className="text-[12px] text-v-muted">Reading time</dt><dd className="font-medium">{p.readingMinutes} min</dd></div>
              <div><dt className="text-[12px] text-v-muted">Category</dt><dd className="font-medium">{CATEGORY[p.category] ?? p.category}</dd></div>
              <div className="col-span-2"><dt className="text-[12px] text-v-muted">Related</dt><dd className="font-medium">{p.related.length ? p.related.join(", ") : "–"}</dd></div>
              <div className="col-span-2">
                <dt className="text-[12px] text-v-muted">Sources</dt>
                <dd className="flex flex-col gap-0.5">
                  {p.sources.map((s) => (
                    <a key={s.url} href={s.url} target="_blank" rel="noreferrer" className="truncate font-medium underline-offset-4 hover:underline">{s.name}</a>
                  ))}
                </dd>
              </div>
            </dl>
          </div>
        </>
      ) : null}
    </aside>
  )
}

export function BlogPosts({ posts, suggestions }: { posts: AdminPost[]; suggestions: AdminSuggestion[] }) {
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const lastRow = useRef<HTMLButtonElement | null>(null)
  const wasOpen = useRef(false)
  const selected = posts.find((p) => p.slug === selectedSlug) ?? null
  const ideasFor = (slug: string) => suggestions.filter((s) => s.status === "open" && s.kind === "adjust" && s.target_path === `/blog/${slug}`)

  useEffect(() => {
    if (selected) {
      closeRef.current?.focus()
      const onKey = (e: KeyboardEvent) => e.key === "Escape" && setSelectedSlug(null)
      window.addEventListener("keydown", onKey)
      wasOpen.current = true
      return () => window.removeEventListener("keydown", onKey)
    }
    if (wasOpen.current) {
      wasOpen.current = false
      lastRow.current?.focus({ preventScroll: true })
    }
  }, [selected])

  return (
    <>
      <DataTable className="whitespace-nowrap">
        <thead className={THEAD}>
          <tr>
            <th className={TH}>Post</th>
            <th className={TH}>Status</th>
            <th className={TH}>Languages</th>
            <th className={`${TH} text-end`}>Impressions</th>
            <th className={`${TH} text-end`}>Clicks</th>
            <th className={`${TH} text-end`}>Position</th>
            <th className={`${TH} text-end`}>Ideas</th>
            <th className={TH}>Reviewed</th>
          </tr>
        </thead>
        <tbody className={TBODY}>
          {posts.map((p) => {
            const open = p.slug === selectedSlug
            return (
              <tr key={p.slug} className={cn("transition-colors duration-150 ease-out hover:bg-v-bg/70", open && "bg-v-bg/70")}>
                <td className={`${TD} max-w-[320px]`}>
                  <button
                    type="button"
                    aria-expanded={open}
                    aria-controls="post-details"
                    onClick={(e) => {
                      lastRow.current = e.currentTarget
                      setSelectedSlug(open ? null : p.slug)
                    }}
                    className="block max-w-full truncate rounded-sm text-start font-medium underline-offset-4 hover:underline focus-visible:ring-2 focus-visible:ring-v-ink focus-visible:ring-offset-2 focus-visible:outline-none"
                  >
                    {p.title}
                  </button>
                  <span className="block truncate text-[12.5px] text-v-muted">/blog/{p.slug} · {CATEGORY[p.category] ?? p.category}</span>
                </td>
                <td className={TD}><StatusPill status={p.status} /></td>
                <td className={TD}><Locales locales={p.locales} /></td>
                <td className={`${TD} text-end`}>{p.gsc ? nf.format(p.gsc.impressions) : <span className="text-v-muted">?</span>}</td>
                <td className={`${TD} text-end`}>{p.gsc ? nf.format(p.gsc.clicks) : <span className="text-v-muted">?</span>}</td>
                <td className={`${TD} text-end`}>{p.gsc?.position != null ? p.gsc.position.toFixed(1) : <span className="text-v-muted">?</span>}</td>
                <td className={`${TD} text-end`}>{p.openIdeas || <span className="text-v-muted">–</span>}</td>
                <td className={`${TD} text-v-muted`}>{day(p.reviewed)}</td>
              </tr>
            )
          })}
        </tbody>
      </DataTable>

      <div aria-hidden="true" onClick={() => setSelectedSlug(null)} className={cn("fixed inset-0 z-40 bg-v-ink/30 transition-opacity duration-200 ease-out", selected ? "opacity-100" : "pointer-events-none opacity-0")} />
      <Details post={selected} ideas={selected ? ideasFor(selected.slug) : []} onClose={() => setSelectedSlug(null)} closeRef={closeRef} />
    </>
  )
}
