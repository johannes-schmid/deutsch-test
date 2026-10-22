import { PRICE_PATH, PricePageView } from "@/components/pages/price-page"
import { PAGES } from "@/components/pages/registry"
import { pageMetadata } from "@/components/pages/text-page"

export const metadata = pageMetadata(PAGES.uk.preise, PRICE_PATH, "uk")

export default function PreisePageUk() {
  return <PricePageView page={PAGES.uk.preise} locale="uk" />
}
