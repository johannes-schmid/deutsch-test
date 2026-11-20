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

// The address in parts, so the Impressum line and the Organization markup cannot disagree.
const POSTAL = { street: "van Naeltwijckstraat 13", postalCode: "2274 NV", city: "Voorburg", country: "NL" }

// The operator, as on inburgeringoefenen.nl: Samen Sterk in Taal, represented by Amber van der Zalm.
// TODO(hannes): § 5 DDG needs a postal address that accepts service; the Dutch repo has none. Confirm the mailbox exists.
export const OPERATOR = {
  company: "Samen Sterk in Taal",
  person: "Amber van der Zalm",
  kvk: "77533216",
  vatId: "NL003205081B10",
  // Same company and address as inburgeringoefenen.nl (its /terugbetalingsbeleid), checked 2026-10-24.
  address: `${POSTAL.street}, ${POSTAL.postalCode} ${POSTAL.city}, Niederlande` as string | null,
  phone: "+31 6 57587278",
  email: "support@deutschtest-ueben.de",
}
export const CONTACT_EMAIL = OPERATOR.email
/** Legal pages stay noindex until the Impressum is complete. */
export const LEGAL_COMPLETE = OPERATOR.address !== null

// TODO(hannes): the YouTube channel URL, and the Trustpilot profile once it has reviews. Empty = no sameAs.
export const PROFILES: string[] = []

/** Organization and WebSite for the root home page, the one place that describes the entity; other pages refer to ORG_ID. */
export function siteSchema() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        ...PROVIDER,
        legalName: OPERATOR.company,
        logo: { "@type": "ImageObject", url: absUrl("/icon-512.png"), width: 512, height: 512 },
        email: OPERATOR.email,
        vatID: OPERATOR.vatId,
        address: { "@type": "PostalAddress", streetAddress: POSTAL.street, postalCode: POSTAL.postalCode, addressLocality: POSTAL.city, addressCountry: POSTAL.country },
        ...(PROFILES.length ? { sameAs: PROFILES } : {}),
      },
      { "@type": "WebSite", "@id": `${SITE_URL}/#website`, url: SITE_URL, name: SITE_NAME, alternateName: "deutschtest-ueben.de", inLanguage: "de", publisher: { "@id": ORG_ID } },
    ],
  }
}
