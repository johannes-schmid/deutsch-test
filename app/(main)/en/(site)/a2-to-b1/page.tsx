import { PAGES } from "@/components/pages/registry"
import { TextPageView, pageMetadata } from "@/components/pages/text-page"

export const metadata = pageMetadata(PAGES.en.a2zuB1, "/a2-zu-b1", "en")

export default function A2ZuB1PageEn() {
  return <TextPageView page={PAGES.en.a2zuB1} path="/a2-zu-b1" locale="en" />
}
