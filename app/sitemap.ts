import type { MetadataRoute } from "next"
import { EXAM_IDS, examPath } from "@/lib/exams"
import { EXAM_PAGES_BY } from "@/lib/i18n/kurztest"
import { INDEXED, languages, lp, type SiteLocale } from "@/lib/i18n/locale"
import { liveSkills } from "@/lib/kurztest/data"
import { LEGAL_COMPLETE, absUrl } from "@/lib/seo"
import { livePosts } from "@/lib/blog/posts"

type Entry = MetadataRoute.Sitemap[number]
type Freq = Entry["changeFrequency"]

/** Russian is noindex for now, so it is not advertised here. */
const LOCALES: SiteLocale[] = INDEXED

/**
 * The day each page's content last really changed, set by hand. Bump the date in the same commit as
 * the copy: Google trusts lastmod only while it stays honest, and the IndexNow workflow resubmits
 * exactly the URLs whose date moved. Never a build date.
 */
const FREE_TESTS = "2026-11-16"
const CHANGED: Record<string, string> = {
  "/": "2026-11-11",
  "/gratis-test": FREE_TESTS,
  "/dtz/modelltest": "2026-11-06",
  "/a2-zu-b1": "2026-10-22",
  "/b1-einbuergerung": "2026-10-22",
  "/preise": "2026-10-29",
  "/ueber-uns": "2026-11-11",
  "/kontakt": "2026-10-22",
  "/impressum": "2026-10-24",
  "/datenschutz": "2026-11-02",
  "/agb": "2026-10-29",
  "/widerruf": "2026-10-24",
}

/** One URL per indexed locale, each listing all of them as hreflang alternates. */
function everyLocale(path: string, changeFrequency: Freq, priority: number, has: (l: SiteLocale) => boolean = () => true, lastModified: string | undefined = CHANGED[path]): Entry[] {
  const present = LOCALES.filter(has)
  const alt = Object.fromEntries(Object.entries(languages(path)).filter(([k]) => k === "x-default" || present.includes(k as SiteLocale)).map(([k, v]) => [k, absUrl(v)]))
  return present.map((l) => ({ url: absUrl(lp(l, path)), changeFrequency, priority: l === "de" ? priority : Math.round(priority * 8) / 10, alternates: { languages: alt }, ...(lastModified ? { lastModified } : {}) }))
}

/**
 * Only indexable URLs. /design/* and /admin/* are noindex or behind a password, so they stay out:
 * a sitemap entry for a noindex page is a contradiction. lastModified comes from CHANGED or the
 * post's review date, never from the build.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...everyLocale("/", "monthly", 1),
    ...everyLocale("/gratis-test", "weekly", 0.9),
    // An exam or skill without reviewed content is a 404, so it is never advertised.
    ...EXAM_IDS.flatMap((e) => {
      const skills = liveSkills(e)
      if (!skills.length) return []
      const has = (l: SiteLocale) => !!EXAM_PAGES_BY[l][e]
      return [...everyLocale(examPath(e), "weekly", 0.9, has, FREE_TESTS), ...skills.flatMap((s) => everyLocale(`${examPath(e)}/${s}`, "monthly", 0.8, has, FREE_TESTS))]
    }),
    // The DTZ Modelltest product page is German only (no translated mirror yet).
    { url: absUrl("/dtz/modelltest"), changeFrequency: "monthly", priority: 0.9, lastModified: CHANGED["/dtz/modelltest"] },
    ...["/a2-zu-b1", "/b1-einbuergerung", "/preise"].flatMap((p) => everyLocale(p, "monthly", 0.7)),
    // Reviewed posts only; drafts are noindex and 404 outside dev.
    ...(livePosts().length ? everyLocale("/blog", "weekly", 0.6, undefined, livePosts().map((p) => p.reviewed).sort().at(-1)) : []),
    ...livePosts().flatMap((p) => everyLocale(`/blog/${p.slug}`, "monthly", 0.7, (l) => livePosts(l).some((x) => x.slug === p.slug), p.reviewed)),
    ...["/ueber-uns", "/kontakt"].flatMap((p) => everyLocale(p, "yearly", 0.3)),
    // Impressum and Datenschutz are German only (the binding texts) and noindex until the operator's address is filled in.
    ...(LEGAL_COMPLETE ? ["/impressum", "/datenschutz", "/agb", "/widerruf"].map((p) => ({ url: absUrl(p), changeFrequency: "yearly" as const, priority: 0.2, lastModified: CHANGED[p] })) : []),
  ]
}
