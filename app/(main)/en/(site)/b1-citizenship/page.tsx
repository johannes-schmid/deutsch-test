import { PAGES } from "@/components/pages/registry"
import { TextPageView, pageMetadata } from "@/components/pages/text-page"

export const metadata = pageMetadata(PAGES.en.b1Einbuergerung, "/b1-einbuergerung", "en")

export default function B1EinbuergerungPageEn() {
  return <TextPageView page={PAGES.en.b1Einbuergerung} path="/b1-einbuergerung" locale="en" />
}
