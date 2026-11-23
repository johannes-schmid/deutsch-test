import { TelcB1ResultCalculator } from "@/components/design/result-calculator"
import { ToolPageView, toolMetadata } from "@/components/pages/tool-page"
import { PATH, page } from "@/data/pages/de/telc-b1-punkte-rechner"

export const metadata = toolMetadata(page, PATH)

export default function TelcB1PunkteRechnerPage() {
  return (
    <ToolPageView page={page} path={PATH}>
      <TelcB1ResultCalculator />
    </ToolPageView>
  )
}
