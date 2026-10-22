import type { SiteLocale } from "@/lib/i18n/locale"
import type { ContactPage, PricePage, TextPage } from "@/lib/pages/types"
import * as de from "@/data/pages/de"
import * as uk from "@/data/pages/uk"
import * as ru from "@/data/pages/ru"

/** Every text page in every site locale, by German slug. */
export const PAGES: Record<SiteLocale, { a2zuB1: TextPage; b1Einbuergerung: TextPage; ueberUns: TextPage; kontakt: ContactPage; preise: PricePage }> = { de, uk, ru }
