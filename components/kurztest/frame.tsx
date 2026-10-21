import type { ReactNode } from "react"
import { ExamStage, FocusLayer } from "@/components/exam"
import type { Scene } from "@/lib/exam/types"

export const FRAME_ID = "test"

/**
 * The exam stage. The intro sits as a framed panel inside the page; once the test runs (`focus`), it takes the
 * whole screen, as on inburgeringoefenen.nl, so nothing but the task is in view.
 */
export function KurztestFrame({ scene, focus, label = "Test", children }: { scene: Scene; focus?: boolean; label?: string; children: ReactNode }) {
  const inner = <div id={FRAME_ID} className="mx-auto flex w-full max-w-[1040px] scroll-mt-8 flex-col gap-4 sm:scroll-mt-12">{children}</div>
  if (focus) return <FocusLayer scene={scene} label={label}>{inner}</FocusLayer>
  return (
    <ExamStage scene={scene} framed className="py-6 sm:py-10">
      {inner}
    </ExamStage>
  )
}
