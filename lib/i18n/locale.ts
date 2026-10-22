// Locales. German is the site; English exists for the landing only (/en); Ukrainian and Russian mirror
// every public page under /uk and /ru. Exam content stays German in every locale.

export type Locale = "de" | "en" | "uk" | "ru"
/** Locales with the whole public site. */
export type SiteLocale = "de" | "uk" | "ru"
/** Machine-translated from German; their pages say so at the top (AI Act art. 50). */
export type TranslatedLocale = "uk" | "ru"

export const TRANSLATED: TranslatedLocale[] = ["uk", "ru"]
export const isTranslated = (l: string): l is TranslatedLocale => l === "uk" || l === "ru"

/** The site locale a page falls back to: English has no inner pages, so its links go to German. */
export const siteLocale = (l: Locale): SiteLocale => (l === "en" ? "de" : l)

/** `lp("uk", "/gratis-test")` → `/uk/gratis-test`; German and English paths stay as they are. */
export const lp = (l: Locale, path: string) => (isTranslated(l) ? `/${l}${path === "/" ? "" : path.startsWith("/#") ? path.slice(1) : path}` : path)

/** The German path behind a localized one: `/uk/blog` → `/blog`. */
export const basePath = (path: string) => path.replace(/^\/(uk|ru)(?=\/|$)/, "") || "/"

export const LOCALE_NAMES: Record<Locale, string> = { de: "Deutsch", en: "English", uk: "Українська", ru: "Русский" }
export const LOCALE_SHORT: Record<Locale, string> = { de: "DE", en: "EN", uk: "UK", ru: "RU" }
export const OG_LOCALE: Record<Locale, string> = { de: "de_DE", en: "en_IE", uk: "uk_UA", ru: "ru_RU" }
export const NUMBER_LOCALE: Record<Locale, string> = { de: "de-DE", en: "en-IE", uk: "uk-UA", ru: "ru-RU" }

/** hreflang map for a page that exists in every site locale (plus English on the home page). */
export function languages(path: string) {
  return {
    de: path,
    ...(path === "/" ? { en: "/en" } : {}),
    uk: lp("uk", path),
    ru: lp("ru", path),
    "x-default": path,
  }
}

/** `alternates` for a page's metadata: canonical in its own locale, hreflang to the others. */
export const alternates = (l: Locale, path: string) => ({ canonical: path === "/" && l === "en" ? "/en" : lp(l, path), languages: languages(path) })
