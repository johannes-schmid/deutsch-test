import { PRICE_PATH, PricePageView } from "@/components/pages/price-page"
import { PAGES } from "@/components/pages/registry"
import { pageMetadata } from "@/components/pages/text-page"

export const metadata = pageMetadata(PAGES.ru.preise, PRICE_PATH, "ru")

export default function PreisePageRu() {
  return <PricePageView page={PAGES.ru.preise} locale="ru" />
}
