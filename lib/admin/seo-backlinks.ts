import { readFile, readdir } from "node:fs/promises"
import path from "node:path"
import { groupByDomain, prospectStatus, type Backlink, type Prospect, type ProspectStatus, type ReferringDomain } from "./seo-backlinks-model"

/**
 * The Backlinks tab of `/admin/seo`. The links come from the weekly snapshot (`seo-agent/data/<week>/backlinks.json`,
 * Bing Webmaster), not live: it takes dozens of API calls, and backlinks change per week, not per hour. The
 * candidates are hand-checked in `seo-agent/backlink-prospects.json`; Hannes sets `status` to asked / declined there.
 */

const ROOT = path.join(process.cwd(), "seo-agent")

export type BacklinkView = {
  checkedAt: string | null
  week: string | null
  /** null = never collected (unknown, not zero). */
  domains: ReferringDomain[] | null
  error: string | null
  prospects: (Prospect & { state: ProspectStatus })[]
}

async function json<T>(file: string): Promise<T | null> {
  try {
    return JSON.parse(await readFile(path.join(ROOT, file), "utf8")) as T
  } catch {
    return null
  }
}

type Snapshot = { skipped?: string; error?: string; generated_at?: string; links?: Backlink[] }

export async function loadBacklinks(): Promise<BacklinkView> {
  let weeks: string[] = []
  try {
    weeks = (await readdir(path.join(ROOT, "data"))).filter((d) => /^\d{4}-W\d{2}$/.test(d)).sort().reverse()
  } catch {}

  let snap: Snapshot | null = null
  let week: string | null = null
  let error: string | null = null
  for (const w of weeks) {
    const s = await json<Snapshot>(`data/${w}/backlinks.json`)
    if (!s) continue
    if (s.skipped || s.error) {
      error ??= s.skipped ?? s.error ?? null
      continue
    }
    snap = s
    week = w
    break
  }

  const domains = snap ? groupByDomain(snap.links ?? []) : null
  const prospects = (await json<{ prospects: Prospect[] }>("backlink-prospects.json"))?.prospects ?? []
  return {
    checkedAt: snap?.generated_at ?? null,
    week,
    domains,
    error: snap ? null : error,
    prospects: prospects.map((p) => ({ ...p, state: prospectStatus(p, domains) })),
  }
}
