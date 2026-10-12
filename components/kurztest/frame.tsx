import type { ReactNode } from "react"
import { ExamStage } from "@/components/exam"
import type { Scene } from "@/lib/exam/types"

export const FRAME_ID = "test"

/** The exam stage as a framed panel inside the page, so the test sits between the site's nav and footer. */
export function KurztestFrame({ scene, children }: { scene: Scene; children: ReactNode }) {
  return (
    <ExamStage scene={scene} framed className="py-6 sm:py-10">
      <div id={FRAME_ID} className="mx-auto flex w-full max-w-[1040px] scroll-mt-8 flex-col sm:scroll-mt-12 gap-4">{children}</div>
    </ExamStage>
  )
}
