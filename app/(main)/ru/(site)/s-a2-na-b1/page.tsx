import { PAGES } from "@/components/pages/registry"
import { TextPageView, pageMetadata } from "@/components/pages/text-page"

export const metadata = pageMetadata(PAGES.ru.a2zuB1, "/a2-zu-b1", "ru")

export default function A2ZuB1PageRu() {
  return <TextPageView page={PAGES.ru.a2zuB1} path="/a2-zu-b1" locale="ru" />
}
