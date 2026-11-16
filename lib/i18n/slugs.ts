// URL slugs per translated locale, keyed by the German path segment. Every route under app/(main)/{en,uk,ru}/
// is named after these; `lp()` and `basePath()` in ./locale.ts translate between them. Exam ids (dtz, telc-b1, …)
// are brand names and stay the same in every language. Ukrainian follows the official 2010 transliteration,
// Russian the common Latin transliteration (Yandex style), so URLs stay readable when shared.
// Renaming a slug that is live needs a 308 from the old one (see LEGACY in legacyRedirects()).

export type SlugLocale = "en" | "uk" | "ru"

type Group = Record<string, string>
type Slugs = { pages: Group; skills: Group; posts: Group }

export const SLUGS: Record<SlugLocale, Slugs> = {
  en: {
    pages: { "gratis-test": "free-test", preise: "pricing", "ueber-uns": "about-us", kontakt: "contact", "a2-zu-b1": "a2-to-b1", "b1-einbuergerung": "b1-citizenship", blog: "blog" },
    skills: { hoeren: "listening", lesen: "reading", schreiben: "writing", sprechen: "speaking" },
    posts: { "dtz-pruefung": "dtz-exam", "dtz-bestehen": "pass-the-dtz", "b1-pruefung": "b1-exam", "b1-brief-schreiben": "b1-letter-writing" },
  },
  uk: {
    pages: { "gratis-test": "bezkoshtovnyi-test", preise: "tsiny", "ueber-uns": "pro-nas", kontakt: "kontakty", "a2-zu-b1": "z-a2-na-b1", "b1-einbuergerung": "b1-dlia-hromadianstva", blog: "blog" },
    skills: { hoeren: "audiiuvannia", lesen: "chytannia", schreiben: "pysmo", sprechen: "hovorinnia" },
    posts: { "dtz-pruefung": "ispyt-dtz", "dtz-bestehen": "yak-sklasty-dtz", "b1-pruefung": "ispyt-b1", "b1-brief-schreiben": "yak-napysaty-lyst-b1" },
  },
  ru: {
    pages: { "gratis-test": "besplatnyj-test", preise: "tseny", "ueber-uns": "o-nas", kontakt: "kontakty", "a2-zu-b1": "s-a2-na-b1", "b1-einbuergerung": "b1-dlya-grazhdanstva", blog: "blog" },
    skills: { hoeren: "audirovanie", lesen: "chtenie", schreiben: "pismo", sprechen: "govorenie" },
    posts: { "dtz-pruefung": "ekzamen-dtz", "dtz-bestehen": "kak-sdat-dtz", "b1-pruefung": "ekzamen-b1", "b1-brief-schreiben": "kak-napisat-pismo-b1" },
  },
}

const flat = (s: Slugs): Group => ({ ...s.pages, ...s.skills, ...s.posts })
const TO = Object.fromEntries(Object.entries(SLUGS).map(([l, s]) => [l, flat(s)])) as Record<SlugLocale, Group>
const FROM = Object.fromEntries(Object.entries(TO).map(([l, g]) => [l, Object.fromEntries(Object.entries(g).map(([de, x]) => [x, de]))])) as Record<SlugLocale, Group>

/** German segment → localized segment (unknown segments, e.g. exam ids, pass through). */
export const toSlug = (l: SlugLocale, seg: string) => TO[l][seg] ?? seg
/** Localized segment → German segment. */
export const fromSlug = (l: SlugLocale, seg: string) => FROM[l][seg] ?? seg

/** Until 2026-11-16 /uk and /ru used the German slugs. Each old URL 308s to its translated one. */
export function legacyRedirects(): { source: string; destination: string; permanent: true }[] {
  return (["uk", "ru"] as const).flatMap((l) => {
    const s = SLUGS[l]
    const r = (from: string, to: string) => ({ source: `/${l}${from}`, destination: `/${l}${to}`, permanent: true as const })
    const gt = s.pages["gratis-test"]
    return [
      ...Object.entries(s.pages).filter(([de, x]) => de !== x).map(([de, x]) => r(`/${de}`, `/${x}`)),
      r("/gratis-test/:exam", `/${gt}/:exam`),
      ...Object.entries(s.skills).map(([de, x]) => r(`/gratis-test/:exam/${de}`, `/${gt}/:exam/${x}`)),
      ...Object.entries(s.posts).map(([de, x]) => r(`/blog/${de}`, `/blog/${x}`)),
    ]
  })
}
