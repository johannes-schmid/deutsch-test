import type { Metadata } from "next"
import { VariantPage } from "@/components/design/variant-page"
import { LANDING } from "@/lib/i18n/landing"

export const metadata: Metadata = {
  title: LANDING.en.meta.title,
  description: LANDING.en.meta.description,
  alternates: { canonical: "/", languages: { en: "/", de: "/de", "x-default": "/" } },
}

export default function Home() {
  return <VariantPage locale="en" />
}
