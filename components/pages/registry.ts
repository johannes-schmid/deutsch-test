import type { SiteLocale } from "@/lib/i18n/locale"
import type { ContactPage, PricePage, TextPage } from "@/lib/pages/types"
import { ACTIVE_LAYOUT } from "@/lib/pricing"
import * as de from "@/data/pages/de"
import * as uk from "@/data/pages/uk"
import * as ru from "@/data/pages/ru"

type Pages = { a2zuB1: TextPage; b1Einbuergerung: TextPage; ueberUns: TextPage; kontakt: ContactPage; preise: PricePage }

/** The price page speaks about whatever the active catalogue sells. */
const withPricing = (p: Pages): Pages => (ACTIVE_LAYOUT === "skills" ? { ...p, preise: { ...p.preise, ...p.preise.skills } } : p)

/** Every text page in every site locale, by German slug. */
export const PAGES: Record<SiteLocale, Pages> = { de: withPricing(de), uk: withPricing(uk), ru: withPricing(ru) }
