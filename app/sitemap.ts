import type { MetadataRoute } from "next"
import { EXAM_IDS, examPath } from "@/lib/exams"
import { EXAM_PAGES_BY } from "@/lib/i18n/kurztest"
import { TRANSLATED, languages, lp, type SiteLocale } from "@/lib/i18n/locale"
import { liveSkills } from "@/lib/kurztest/data"
import { LEGAL_COMPLETE, absUrl } from "@/lib/seo"
import { livePosts } from "@/lib/blog/posts"

type Entry = MetadataRoute.Sitemap[number]
type Freq = Entry["changeFrequency"]

const LOCALES: SiteLocale[] = ["de", ...TRANSLATED]

/** One URL per locale, each listing all of them as hreflang alternates (and English on the home page). */
function everyLocale(path: string, changeFrequency: Freq, priority: number, has: (l: SiteLocale) => boolean = () => true, lastModified?: string): Entry[] {
  const present = LOCALES.filter(has)
  const alt = Object.fromEntries(Object.entries(languages(path)).filter(([k]) => k === "en" || k === "x-default" || present.includes(k as SiteLocale)).map(([k, v]) => [k, absUrl(v)]))
  return present.map((l) => ({ url: absUrl(lp(l, path)), changeFrequency, priority: l === "de" ? priority : Math.round(priority * 8) / 10, alternates: { languages: alt }, ...(lastModified ? { lastModified } : {}) }))
}

/**
 * Only indexable URLs. /design/* and /admin/* are noindex or behind a password, so they stay out:
 * a sitemap entry for a noindex page is a contradiction. No lastModified: a build date on every URL
 * teaches Google to ignore it.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const home = everyLocale("/", "monthly", 1)
  const homeAlt = home[0].alternates
  return [
    ...home,
    { url: absUrl("/en"), changeFrequency: "monthly", priority: 0.8, alternates: homeAlt },
    ...everyLocale("/gratis-test", "weekly", 0.9),
    // An exam or skill without reviewed content is a 404, so it is never advertised.
    ...EXAM_IDS.flatMap((e) => {
      const skills = liveSkills(e)
      if (!skills.length) return []
      const has = (l: SiteLocale) => !!EXAM_PAGES_BY[l][e]
      return [...everyLocale(examPath(e), "weekly", 0.9, has), ...skills.flatMap((s) => everyLocale(`${examPath(e)}/${s}`, "monthly", 0.8, has))]
    }),
    ...["/a2-zu-b1", "/b1-einbuergerung", "/preise"].flatMap((p) => everyLocale(p, "monthly", 0.7)),
    // Reviewed posts only; drafts are noindex and 404 outside dev.
    ...(livePosts().length ? everyLocale("/blog", "weekly", 0.6) : []),
    ...livePosts().flatMap((p) => everyLocale(`/blog/${p.slug}`, "monthly", 0.7, (l) => livePosts(l).some((x) => x.slug === p.slug), p.reviewed)),
    ...["/ueber-uns", "/kontakt"].flatMap((p) => everyLocale(p, "yearly", 0.3)),
    // Impressum and Datenschutz are German only (the binding texts) and noindex until the operator's address is filled in.
    ...(LEGAL_COMPLETE ? ["/impressum", "/datenschutz", "/agb", "/widerruf"].map((p) => ({ url: absUrl(p), changeFrequency: "yearly" as const, priority: 0.2 })) : []),
  ]
}
