import type { ReactNode } from "react"
import { ExternalLink } from "lucide-react"
import { Empty, Panel, Section, TBODY, TD, TH, THEAD } from "@/components/admin/admin-ui"
import type { BacklinkView } from "@/lib/admin/seo-backlinks"
import { pathOf, type ProspectStatus } from "@/lib/admin/seo-backlinks-model"

/**
 * The Backlinks tab of `/admin/seo` (ported from inburgering, 2026-11-11): who links to us now (Bing Webmaster,
 * weekly snapshot) and where a link could sit (`seo-agent/backlink-prospects.json`, checked by hand).
 */

const nf = new Intl.NumberFormat("en-GB")
const dayLabel = (iso: string) => new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", timeZone: "Europe/Berlin" })

const STATE: Record<ProspectStatus, { label: string; cls: string }> = {
  listed: { label: "Links to us", cls: "bg-v-ink text-white" },
  asked: { label: "Asked", cls: "bg-[color-mix(in_srgb,var(--p-ember)_16%,transparent)] text-v-ink" },
  todo: { label: "To do", cls: "bg-v-soft text-v-muted" },
  declined: { label: "Declined", cls: "bg-v-soft text-v-muted line-through" },
}
const STATE_ORDER: ProspectStatus[] = ["todo", "asked", "listed", "declined"]
const EFFORT: Record<string, string> = { low: "Low", medium: "Medium", high: "High" }

const LINK = "inline-flex max-w-full items-center gap-1 rounded-sm font-medium underline-offset-4 outline-none hover:underline focus-visible:ring-2 focus-visible:ring-v-ink"

export function SeoBacklinks({ data }: { data: BacklinkView }) {
  const domains = data.domains
  const linkCount = domains?.reduce((n, d) => n + d.links.length, 0) ?? null
  const pages = domains ? new Set(domains.flatMap((d) => d.targets)).size : null
  const todo = data.prospects.filter((p) => p.state === "todo").length
  const prospects = [...data.prospects].sort((a, b) => STATE_ORDER.indexOf(a.state) - STATE_ORDER.indexOf(b.state))

  return (
    <>
      <Panel>
        <div className="grid grid-cols-2 gap-px bg-v-line lg:grid-cols-4 [&>*]:bg-v-surface">
          <Tile label="Linking domains" value={domains ? nf.format(domains.length) : null} />
          <Tile label="Backlinks" value={linkCount !== null ? nf.format(linkCount) : null} />
          <Tile label="Our pages linked to" value={pages !== null ? nf.format(pages) : null} />
          <Tile label="Suggestions to do" value={nf.format(todo)} note={`of ${data.prospects.length}`} />
        </div>
      </Panel>

      <Section
        title="Current backlinks"
        note={data.checkedAt
          ? `Every external page Bing sees linking to us, checked ${dayLabel(data.checkedAt)}. Bing doesn’t see every link, so a missing one isn’t proof it’s gone.`
          : "From Bing Webmaster, collected with the Friday data pull."}
      >
        {!domains ? (
          <Empty>Not collected yet{data.error ? ` (${data.error})` : ""}. The Friday data pull fills this list; you can also run the “SEO snapshot” workflow by hand on GitHub.</Empty>
        ) : domains.length === 0 ? (
          <Empty>Bing knows no external links to deutschtest-ueben.de yet. That is the gap the suggestions below are for.</Empty>
        ) : (
          <Panel>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] table-fixed text-[13.5px]">
                <thead className={THEAD}>
                  <tr>
                    <th className={`${TH} w-[200px]`}>Linking site</th>
                    <th className={TH}>Linking page</th>
                    <th className={`${TH} w-[200px]`}>Anchor text</th>
                    <th className={`${TH} w-[200px]`}>Links to</th>
                  </tr>
                </thead>
                <tbody className={TBODY}>
                  {domains.map((d) =>
                    d.links.map((l, i) => (
                      <tr key={`${l.source}→${l.target}`} className="align-top">
                        {i === 0 && (
                          <th scope="rowgroup" rowSpan={d.links.length} className={`${TD} border-e border-v-line text-start font-semibold`}>
                            {d.domain}
                            <span className="mt-0.5 block text-[12px] font-normal text-v-muted tabular-nums">{d.links.length} {d.links.length === 1 ? "link" : "links"}</span>
                          </th>
                        )}
                        <td className={TD}>
                          <a href={l.source} target="_blank" rel="noreferrer" className={LINK} title={l.source}>
                            <span className="truncate">{l.source.replace(/^https?:\/\/(www\.)?/, "")}</span>
                            <ExternalLink className="size-3 shrink-0" aria-hidden="true" />
                          </a>
                        </td>
                        <td className={`${TD} truncate text-v-muted`} title={l.anchor}>{l.anchor || <em>no anchor text</em>}</td>
                        <td className={`${TD} truncate font-[family-name:var(--v-font-mono)] text-[12.5px]`} title={l.target}>{pathOf(l.target)}</td>
                      </tr>
                    )),
                  )}
                </tbody>
              </table>
            </div>
          </Panel>
        )}
      </Section>

      <Section
        title="Suggestions"
        aside={<span className="text-[13px] text-v-muted tabular-nums">{todo} to do</span>}
        note="Sites where a link to us fits, each page checked by hand. Set a status in seo-agent/backlink-prospects.json; a site switches to “Links to us” by itself once Bing sees its link."
      >
        {prospects.length === 0 ? (
          <Empty>No suggestions yet. Add them to seo-agent/backlink-prospects.json.</Empty>
        ) : (
          <Panel>
            <ul className="divide-y divide-v-line">
              {prospects.map((p) => (
                <li key={p.url} className="grid grid-cols-1 gap-x-6 gap-y-2 px-4 py-4 text-[13.5px] leading-relaxed sm:px-5 lg:grid-cols-[200px_minmax(0,1fr)_minmax(0,1fr)_96px]">
                  <div className="flex min-w-0 items-start justify-between gap-3 lg:block">
                    <div className="min-w-0">
                      <a href={p.url} target="_blank" rel="noreferrer" className={`${LINK} font-semibold`}>
                        <span className="truncate">{p.domain}</span>
                        <ExternalLink className="size-3 shrink-0" aria-hidden="true" />
                      </a>
                      <span className="block text-[12px] text-v-muted">{p.kind.replace(/-/g, " ")} · effort {(EFFORT[p.effort] ?? p.effort).toLowerCase()}</span>
                    </div>
                    <span className={`inline-flex shrink-0 rounded-full px-2.5 py-0.5 text-[12px] font-medium lg:hidden ${STATE[p.state].cls}`}>{STATE[p.state].label}</span>
                  </div>
                  <Labelled label="Why it fits">{p.why}</Labelled>
                  <Labelled label="What to do">{p.how}</Labelled>
                  <span className="hidden lg:block"><span className={`inline-flex rounded-full px-2.5 py-0.5 text-[12px] font-medium ${STATE[p.state].cls}`}>{STATE[p.state].label}</span></span>
                </li>
              ))}
            </ul>
          </Panel>
        )}
      </Section>
    </>
  )
}

function Labelled({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="min-w-0">
      <span className="block text-[12px] font-semibold text-v-muted">{label}</span>
      <span className="block">{children}</span>
    </div>
  )
}

function Tile({ label, value, note }: { label: string; value: string | null; note?: string }) {
  return (
    <div className="flex min-w-0 flex-col gap-1 p-4 sm:p-5">
      <span className="text-[13px] text-v-muted">{label}</span>
      <b className="text-[24px] leading-tight font-semibold tracking-[-0.02em] tabular-nums sm:text-[28px]">
        {value ?? <span className="text-v-muted" title="Not collected yet: unknown, not zero">n/a</span>}
        {note && <span className="ms-1.5 text-[13px] font-medium text-v-muted">{note}</span>}
      </b>
    </div>
  )
}
