import { PAGES } from "@/components/pages/registry"
import { TextPageView, pageMetadata } from "@/components/pages/text-page"

export const metadata = pageMetadata(PAGES.uk.a2zuB1, "/a2-zu-b1", "uk")

export default function A2ZuB1PageUk() {
  return <TextPageView page={PAGES.uk.a2zuB1} path="/a2-zu-b1" locale="uk" />
}
