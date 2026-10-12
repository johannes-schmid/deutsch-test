import type { Metadata } from "next"
import { VariantPage } from "@/components/design/variant-page"

export const metadata: Metadata = { title: "Nachtzug · Designrichtung" }

export default function Page() {
  return <VariantPage id="nachtzug" />
}
