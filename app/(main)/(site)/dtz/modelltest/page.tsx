import type { Metadata } from "next"
import { MODELLTEST_PATH, ModelltestPageView } from "@/components/pages/modelltest-page"
import { page } from "@/data/pages/de/dtz-modelltest"
import { openGraph } from "@/lib/seo"

// German only so far (no uk/ru mirror yet), so the canonical stands alone without hreflang alternates.
export const metadata: Metadata = {
  title: `${page.title} | deutschtest üben`,
  description: page.description,
  alternates: { canonical: MODELLTEST_PATH },
  openGraph: openGraph(MODELLTEST_PATH, page.title, page.description, "de"),
}

export default function DtzModelltestPage() {
  return <ModelltestPageView page={page} locale="de" />
}
