/**
 * The backlinks of `/admin/seo`, pure: which sites link to us (from Bing Webmaster, the only free source that
 * names the linking pages; Search Console has no API for links) and how they relate to the hand-checked
 * candidates in `seo-agent/backlink-prospects.json`.
 *
 * A candidate turns "listed" as soon as Bing sees a link from its domain. If Hannes sets it to "listed"
 * himself, that stays: Bing doesn't see every link.
 */

export type Backlink = { source: string; anchor: string; target: string }

export type ProspectStatus = "todo" | "asked" | "listed" | "declined"
export type Prospect = {
  domain: string
  url: string
  kind: string
  why: string
  how: string
  effort: "low" | "medium" | "high"
  verified: string
  status?: ProspectStatus
}

export type ReferringDomain = { domain: string; links: Backlink[]; targets: string[] }

export const OWN_HOSTS = ["deutschtest-ueben.de"]

/** `https://www.Example.de/x` → `example.de`; null when it isn't a URL. */
export function hostOf(url: string): string | null {
  try {
    return new URL(url).hostname.toLowerCase().replace(/^www\./, "")
  } catch {
    return null
  }
}

/** A subdomain counts as the domain: `de.wikipedia.org` belongs to a candidate `wikipedia.org`. */
export function sameSite(host: string, domain: string): boolean {
  const d = domain.toLowerCase().replace(/^www\./, "")
  return host === d || host.endsWith(`.${d}`)
}

export function pathOf(url: string): string {
  try {
    let p = new URL(url).pathname
    try {
      p = decodeURI(p)
    } catch {}
    return p.length > 1 ? p.replace(/\/+$/, "") : p
  } catch {
    return url
  }
}

/** Groups by linking domain, without internal links, deduplicated; the biggest domain first. */
export function groupByDomain(links: Backlink[], own: string[] = OWN_HOSTS): ReferringDomain[] {
  const seen = new Set<string>()
  const by = new Map<string, Backlink[]>()
  for (const l of links) {
    const host = hostOf(l.source)
    if (!host || own.some((o) => sameSite(host, o))) continue
    const key = `${host}${pathOf(l.source)}→${pathOf(l.target)}`
    if (seen.has(key)) continue
    seen.add(key)
    by.set(host, [...(by.get(host) ?? []), l])
  }
  return [...by]
    .map(([domain, ls]) => ({ domain, links: ls, targets: [...new Set(ls.map((l) => pathOf(l.target)))] }))
    .sort((a, b) => b.links.length - a.links.length || a.domain.localeCompare(b.domain))
}

export function prospectStatus(p: Prospect, domains: ReferringDomain[] | null): ProspectStatus {
  if (domains?.some((d) => sameSite(d.domain, p.domain))) return "listed"
  return p.status ?? "todo"
}
