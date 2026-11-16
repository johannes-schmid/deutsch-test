import { PAGES } from "@/components/pages/registry"
import { TextPageView, pageMetadata } from "@/components/pages/text-page"

export const metadata = pageMetadata(PAGES.en.ueberUns, "/ueber-uns", "en")

export default function UeberUnsPageEn() {
  return <TextPageView page={PAGES.en.ueberUns} path="/ueber-uns" locale="en" type="AboutPage" />
}
