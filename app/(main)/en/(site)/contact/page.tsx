import { PAGES } from "@/components/pages/registry"
import { ContactPageView, pageMetadata } from "@/components/pages/text-page"

export const metadata = pageMetadata(PAGES.en.kontakt, "/kontakt", "en")

export default function KontaktPageEn() {
  return <ContactPageView page={PAGES.en.kontakt} locale="en" />
}
