import type { Metadata } from "next"
import { VariantPage } from "@/components/design/variant-page"
import { LANDING } from "@/lib/i18n/landing"

export const metadata: Metadata = {
  title: LANDING.de.meta.title,
  description: LANDING.de.meta.description,
  alternates: { canonical: "/", languages: { de: "/", en: "/en", "x-default": "/" } },
}

export default function Home() {
  return <VariantPage locale="de" />
}
