import { ExternalLink } from "lucide-react"
import { Empty, Panel, Section, TBODY, TD, TH, THEAD } from "@/components/admin/admin-ui"
import type { BacklinkView } from "@/lib/admin/seo-backlinks"
import { pathOf } from "@/lib/admin/seo-backlinks-model"
import type { OutreachRow } from "@/lib/admin/backlink-outreach"
import { BacklinkSuggestions } from "@/components/admin/backlink-outreach"
import { prospectOutreachState } from "@/lib/admin/backlink-outreach-model"

/**
 * The Backlinks tab of `/admin/seo` (ported from inburgering, 2026-11-11): who links to us now (Bing Webmaster,
 * weekly snapshot) and where a link could sit (`seo-agent/backlink-prospects.json`, checked by hand), with the
 * outreach to each candidate (components/admin/backlink-outreach.tsx, 2026-11-16).
 */

const nf = new Intl.NumberFormat("en-GB")
const dayLabel = (iso: string) => new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", timeZone: "Europe/Berlin" })

const LINK = "inline-flex max-w-full items-center gap-1 rounded-sm font-medium underline-offset-4 outline-none hover:underline focus-visible:ring-2 focus-visible:ring-v-ink"

export function SeoBacklinks({ data, outreach, outreachError }: { data: BacklinkView; outreach: Record<string, OutreachRow[]> | null; outreachError: string | null }) {
  const domains = data.domains
  const linkCount = domains?.reduce((n, d) => n + d.links.length, 0) ?? null
  const pages = domains ? new Set(domains.flatMap((d) => d.targets)).size : null
  const now = new Date()
  const states = data.prospects.map((p) => prospectOutreachState(p, outreach?.[p.domain] ?? [], now))
  const todo = states.filter((s) => s === "todo").length
  const due = states.filter((s) => s === "follow_up_due").length

  return (
    <>
      <Panel>
        <div className="grid grid-cols-2 gap-px bg-v-line lg:grid-cols-4 [&>*]:bg-v-surface">
          <Tile label="Linking domains" value={domains ? nf.format(domains.length) : null} />
          <Tile label="Backlinks" value={linkCount !== null ? nf.format(linkCount) : null} />
          <Tile label="Our pages linked to" value={pages !== null ? nf.format(pages) : null} />
          <Tile label="Still to ask" value={nf.format(todo)} note={due ? `· ${due} follow-up${due === 1 ? "" : "s"} due` : `of ${data.prospects.length}`} />
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
        aside={<span className="text-[13px] text-v-muted tabular-nums">{todo} to ask{due ? ` · ${due} to follow up` : ""}</span>}
        note="Sites where a link to us fits, each page checked by hand (seo-agent/backlink-prospects.json). Ask from here: Claude drafts the request, you edit and send it, and every step is logged. One follow-up after 10 days without an answer."
      >
        <BacklinkSuggestions prospects={data.prospects} outreach={outreach} outreachError={outreachError} />
      </Section>
    </>
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
