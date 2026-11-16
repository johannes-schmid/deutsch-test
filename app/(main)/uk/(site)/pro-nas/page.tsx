import { PAGES } from "@/components/pages/registry"
import { TextPageView, pageMetadata } from "@/components/pages/text-page"

export const metadata = pageMetadata(PAGES.uk.ueberUns, "/ueber-uns", "uk")

export default function UeberUnsPageUk() {
  return <TextPageView page={PAGES.uk.ueberUns} path="/ueber-uns" locale="uk" type="AboutPage" />
}
