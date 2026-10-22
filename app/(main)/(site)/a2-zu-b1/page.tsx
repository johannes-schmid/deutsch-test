import { PAGES } from "@/components/pages/registry"
import { TextPageView, pageMetadata } from "@/components/pages/text-page"

export const metadata = pageMetadata(PAGES.de.a2zuB1, "/a2-zu-b1", "de")

export default function A2ZuB1Page() {
  return <TextPageView page={PAGES.de.a2zuB1} path="/a2-zu-b1" locale="de" />
}
