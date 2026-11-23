import { DtzResultCalculator } from "@/components/design/result-calculator"
import { ToolPageView, toolMetadata } from "@/components/pages/tool-page"
import { PATH, page } from "@/data/pages/de/dtz-ergebnis-rechner"

export const metadata = toolMetadata(page, PATH)

export default function DtzErgebnisRechnerPage() {
  return (
    <ToolPageView page={page} path={PATH}>
      <DtzResultCalculator />
    </ToolPageView>
  )
}
