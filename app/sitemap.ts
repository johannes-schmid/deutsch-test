import type { MetadataRoute } from "next"
import { EXAM_IDS, examPath } from "@/lib/exams"
import { EXAM_PAGES } from "@/lib/i18n/kurztest"
import { liveSkills } from "@/lib/kurztest/data"
import { LEGAL_COMPLETE, absUrl } from "@/lib/seo"

/**
 * Only indexable URLs. /design/* and /admin/* are noindex or behind a password, so they stay out:
 * a sitemap entry for a noindex page is a contradiction. No lastModified: a build date on every URL
 * teaches Google to ignore it.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: absUrl("/"), changeFrequency: "monthly", priority: 1, alternates: { languages: { de: absUrl("/"), en: absUrl("/en") } } },
    { url: absUrl("/en"), changeFrequency: "monthly", priority: 0.8, alternates: { languages: { de: absUrl("/"), en: absUrl("/en") } } },
    { url: absUrl("/dtz"), changeFrequency: "monthly", priority: 0.9 },
    { url: absUrl("/gratis-test"), changeFrequency: "weekly", priority: 0.9 },
    // An exam or skill without reviewed content is a 404, so it is never advertised.
    ...EXAM_IDS.filter((e) => EXAM_PAGES[e]).flatMap((e) => {
      const skills = liveSkills(e)
      if (!skills.length) return []
      return [
        { url: absUrl(examPath(e)), changeFrequency: "weekly" as const, priority: 0.9 },
        ...skills.map((s) => ({ url: absUrl(`${examPath(e)}/${s}`), changeFrequency: "monthly" as const, priority: 0.8 })),
      ]
    }),
    ...["/a2-zu-b1", "/b1-einbuergerung", "/preise"].map((p) => ({ url: absUrl(p), changeFrequency: "monthly" as const, priority: 0.7 })),
    ...["/ueber-uns", "/kontakt"].map((p) => ({ url: absUrl(p), changeFrequency: "yearly" as const, priority: 0.3 })),
    // Impressum and Datenschutz are noindex until the operator's address is filled in.
    ...(LEGAL_COMPLETE ? ["/impressum", "/datenschutz"].map((p) => ({ url: absUrl(p), changeFrequency: "yearly" as const, priority: 0.2 })) : []),
  ]
}
