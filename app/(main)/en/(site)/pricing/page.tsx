import { PRICE_PATH, PricePageView } from "@/components/pages/price-page"
import { PAGES } from "@/components/pages/registry"
import { pageMetadata } from "@/components/pages/text-page"

export const metadata = pageMetadata(PAGES.en.preise, PRICE_PATH, "en")

export default function PreisePageEn() {
  return <PricePageView page={PAGES.en.preise} locale="en" />
}
