import { PRICE_PATH, PricePageView } from "@/components/pages/price-page"
import { PAGES } from "@/components/pages/registry"
import { pageMetadata } from "@/components/pages/text-page"

export const metadata = pageMetadata(PAGES.de.preise, PRICE_PATH, "de")

export default function PreisePage() {
  return <PricePageView page={PAGES.de.preise} locale="de" />
}
