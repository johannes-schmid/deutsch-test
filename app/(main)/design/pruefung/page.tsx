import type { Metadata } from "next"
import { DesignShell } from "@/components/design/shell"
import { ExamGallery } from "@/components/design/exam-gallery"

export const metadata: Metadata = {
  title: "Prüfungs-Elemente · Design",
  robots: { index: false, follow: false },
}

export default function ExamDesignPage() {
  return (
    <DesignShell id="nachtzug" lang="de">
      <ExamGallery />
    </DesignShell>
  )
}
