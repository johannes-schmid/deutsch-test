import { PAGES } from "@/components/pages/registry"
import { TextPageView, pageMetadata } from "@/components/pages/text-page"

export const metadata = pageMetadata(PAGES.de.b1Einbuergerung, "/b1-einbuergerung", "de")

export default function B1EinbuergerungPage() {
  return <TextPageView page={PAGES.de.b1Einbuergerung} path="/b1-einbuergerung" locale="de" />
}
