import { PAGES } from "@/components/pages/registry"
import { TextPageView, pageMetadata } from "@/components/pages/text-page"

export const metadata = pageMetadata(PAGES.ru.ueberUns, "/ueber-uns", "ru")

export default function UeberUnsPageRu() {
  return <TextPageView page={PAGES.ru.ueberUns} path="/ueber-uns" locale="ru" type="AboutPage" />
}
