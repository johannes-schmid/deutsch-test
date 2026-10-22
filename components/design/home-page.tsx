import type { Metadata } from "next"
import { VariantPage } from "@/components/design/variant-page"
import { LANDING } from "@/lib/i18n/landing"
import { alternates, lp, type Locale } from "@/lib/i18n/locale"
import { openGraph } from "@/lib/seo"

export function homeMetadata(locale: Locale): Metadata {
  const t = LANDING[locale].meta
  const path = locale === "en" ? "/en" : lp(locale, "/")
  return { title: { absolute: t.title }, description: t.description, alternates: alternates(locale, "/"), openGraph: openGraph(path, t.title, t.description, locale) }
}

export function HomePage({ locale }: { locale: Locale }) {
  return <VariantPage locale={locale} />
}
