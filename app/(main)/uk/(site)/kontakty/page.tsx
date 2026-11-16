import { PAGES } from "@/components/pages/registry"
import { ContactPageView, pageMetadata } from "@/components/pages/text-page"

export const metadata = pageMetadata(PAGES.uk.kontakt, "/kontakt", "uk")

export default function KontaktPageUk() {
  return <ContactPageView page={PAGES.uk.kontakt} locale="uk" />
}
