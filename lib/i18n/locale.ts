// Locales. German is the site; English, Ukrainian and Russian mirror every public page under /en, /uk and /ru
// with translated slugs (./slugs.ts). Exam content stays German in every locale.

import { fromSlug, toSlug } from "./slugs"

export type Locale = "de" | "en" | "uk" | "ru"
/** Locales with the whole public site (all of them since 2026-11-16). */
export type SiteLocale = Locale
/** Machine-translated from German; their pages say so at the top (AI Act art. 50). */
export type TranslatedLocale = "en" | "uk" | "ru"

export const TRANSLATED: TranslatedLocale[] = ["en", "uk", "ru"]
export const isTranslated = (l: string): l is TranslatedLocale => l === "en" || l === "uk" || l === "ru"

/** Locales Google may index. Russian is noindex for now (Hannes, 2026-11-16): out of the sitemap and hreflang. */
export const INDEXED: Locale[] = ["de", "en", "uk"]
export const isIndexed = (l: Locale) => INDEXED.includes(l)
/** `robots` for a page in locale `l` (also set by app/(main)/ru/layout.tsx and an X-Robots-Tag in next.config.ts). */
export const robotsFor = (l: Locale) => (isIndexed(l) ? { index: true, follow: true } : { index: false, follow: true })

/** Kept for callers from before English had inner pages; every locale now has the whole site. */
export const siteLocale = (l: Locale): SiteLocale => l

const split = (path: string) => {
  const i = path.search(/[?#]/)
  return i < 0 ? [path, ""] : [path.slice(0, i), path.slice(i)]
}

/** `lp("uk", "/gratis-test/dtz/lesen")` → `/uk/bezkoshtovnyi-test/dtz/chytannia`; German paths stay as they are. */
export function lp(l: Locale, path: string): string {
  if (!isTranslated(l)) return path
  const [p, rest] = split(path)
  const segs = p.split("/").filter(Boolean).map((s) => toSlug(l, s))
  return `/${[l, ...segs].join("/")}${rest}`
}

/** The German path behind a localized one: `/uk/tsiny` → `/preise`. */
export function basePath(path: string): string {
  const [p, rest] = split(path)
  const segs = p.split("/").filter(Boolean)
  const l = segs[0]
  if (!l || !isTranslated(l)) return path || "/"
  return `/${segs.slice(1).map((s) => fromSlug(l, s)).join("/")}${rest}`
}

/** The locale a path belongs to. */
export const localeOf = (path: string): Locale => {
  const first = path.split("/")[1]
  return first && isTranslated(first) ? first : "de"
}

export const LOCALE_NAMES: Record<Locale, string> = { de: "Deutsch", en: "English", uk: "Українська", ru: "Русский" }
export const LOCALE_SHORT: Record<Locale, string> = { de: "DE", en: "EN", uk: "UK", ru: "RU" }
export const OG_LOCALE: Record<Locale, string> = { de: "de_DE", en: "en_IE", uk: "uk_UA", ru: "ru_RU" }
export const NUMBER_LOCALE: Record<Locale, string> = { de: "de-DE", en: "en-IE", uk: "uk-UA", ru: "ru-RU" }

/** hreflang map for a page that exists in every indexed locale. Noindexed locales stay out (Google ignores them anyway). */
export function languages(path: string) {
  return { ...Object.fromEntries(INDEXED.map((l) => [l, lp(l, path)])), "x-default": path } as Record<string, string>
}

/** `alternates` for a page's metadata: canonical in its own locale, hreflang to the indexed ones. /ru gets noindex from app/(main)/ru/layout.tsx + an X-Robots-Tag. */
export const alternates = (l: Locale, path: string) => ({ canonical: lp(l, path), languages: languages(path) })
