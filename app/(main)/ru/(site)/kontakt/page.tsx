import { PAGES } from "@/components/pages/registry"
import { ContactPageView, pageMetadata } from "@/components/pages/text-page"

export const metadata = pageMetadata(PAGES.ru.kontakt, "/kontakt", "ru")

export default function KontaktPageRu() {
  return <ContactPageView page={PAGES.ru.kontakt} locale="ru" />
}
