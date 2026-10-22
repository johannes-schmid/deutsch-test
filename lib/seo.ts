// Site origin and the JSON-LD shapes more than one page needs. Mirrors inburgering-website's lib/schema.ts.

import { OG_LOCALE, type Locale } from "@/lib/i18n/locale"

export const SITE_URL = "https://deutschtest-ueben.de"
export const SITE_NAME = "deutschtest üben"
export const ORG_ID = `${SITE_URL}/#organization`

/** `absUrl("/gratis-test")` → `https://deutschtest-ueben.de/gratis-test`. */
export const absUrl = (path = "/") => `${SITE_URL}${path === "/" ? "" : path}`

export const PROVIDER = { "@type": "Organization", "@id": ORG_ID, name: SITE_NAME, url: SITE_URL }

/** Visible breadcrumb trail and its BreadcrumbList come from the same list, so they cannot disagree. */
export type Crumb = { name: string; path: string }

export function breadcrumbList(crumbs: Crumb[]) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({ "@type": "ListItem", position: i + 1, name: c.name, item: absUrl(c.path) })),
  }
}

/** The site-wide share card (app/opengraph-image.png). A page that sets its own openGraph drops the inherited image, so the helper adds it back. */
export const OG_IMAGE = { url: "/opengraph-image.png", width: 1200, height: 630, alt: "deutschtest üben: Deutschprüfung online üben" }

/** `path` is the page's own (localized) path. */
export function openGraph(path: string, title: string, description: string, locale: Locale = "de") {
  return { type: "website" as const, locale: OG_LOCALE[locale], siteName: SITE_NAME, url: absUrl(path), title, description, images: [OG_IMAGE] }
}

// The operator, as on inburgeringoefenen.nl: Samen Sterk in Taal, represented by Amber van der Zalm.
// TODO(hannes): § 5 DDG needs a postal address that accepts service; the Dutch repo has none. Confirm the mailbox exists.
export const OPERATOR = {
  company: "Samen Sterk in Taal",
  person: "Amber van der Zalm",
  kvk: "77533216",
  vatId: "NL003205081B10",
  address: null as string | null,
  email: "kontakt@deutschtest-ueben.de",
}
export const CONTACT_EMAIL = OPERATOR.email
/** Legal pages stay noindex until the Impressum is complete. */
export const LEGAL_COMPLETE = OPERATOR.address !== null
