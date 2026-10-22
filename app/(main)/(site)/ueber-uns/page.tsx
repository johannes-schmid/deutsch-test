import { PAGES } from "@/components/pages/registry"
import { TextPageView, pageMetadata } from "@/components/pages/text-page"

export const metadata = pageMetadata(PAGES.de.ueberUns, "/ueber-uns", "de")

export default function UeberUnsPage() {
  return <TextPageView page={PAGES.de.ueberUns} path="/ueber-uns" locale="de" type="AboutPage" />
}
