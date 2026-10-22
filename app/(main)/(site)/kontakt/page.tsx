import { PAGES } from "@/components/pages/registry"
import { ContactPageView, pageMetadata } from "@/components/pages/text-page"

export const metadata = pageMetadata(PAGES.de.kontakt, "/kontakt", "de")

export default function KontaktPage() {
  return <ContactPageView page={PAGES.de.kontakt} locale="de" />
}
