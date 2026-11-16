import { PAGES } from "@/components/pages/registry"
import { TextPageView, pageMetadata } from "@/components/pages/text-page"

export const metadata = pageMetadata(PAGES.uk.b1Einbuergerung, "/b1-einbuergerung", "uk")

export default function B1EinbuergerungPageUk() {
  return <TextPageView page={PAGES.uk.b1Einbuergerung} path="/b1-einbuergerung" locale="uk" />
}
