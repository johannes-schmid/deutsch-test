import { PAGES } from "@/components/pages/registry"
import { TextPageView, pageMetadata } from "@/components/pages/text-page"

export const metadata = pageMetadata(PAGES.ru.b1Einbuergerung, "/b1-einbuergerung", "ru")

export default function B1EinbuergerungPageRu() {
  return <TextPageView page={PAGES.ru.b1Einbuergerung} path="/b1-einbuergerung" locale="ru" />
}
