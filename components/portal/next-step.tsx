import Link from "next/link"
import { ArrowRight, Ticket } from "lucide-react"
import { VButton } from "@/components/design/kit"
import { PartIcon } from "@/components/design/variants/nachtzug-icons"
import { PORTAL_PASS } from "@/lib/auth/redirect"
import { portalPath, type ExamId } from "@/lib/exams"
import { PORTAL_COPY } from "@/lib/i18n/portal"
import { KURZTEST_COPY } from "@/lib/i18n/kurztest"
import { nextSkill, type Skill } from "@/lib/lifecycle/push-copy"

const T = PORTAL_COPY.next

/** The one next step for a learner without a pass, in-app: the next free Modelltest 1, or the pass once all four are done. */
export function NextStepCard({ exam, done }: { exam: ExamId; done: Skill[] }) {
  const next = nextSkill(done)
  const copy = !next ? T.all : done.length ? T.cont(KURZTEST_COPY.names[next], done.length) : T.start(KURZTEST_COPY.names[next])
  const href = next ? `${portalPath(exam, next)}/1` : PORTAL_PASS
  return (
    <section aria-labelledby="next-h" className="nz-paper flex flex-col gap-4 rounded-[24px] p-5">
      <h2 id="next-h" className="text-[15px] font-semibold">{T.h}</h2>
      <div className="flex items-start gap-3.5">
        {next ? (
          <PartIcon part={next} size="sm" />
        ) : (
          <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-(--p-glow) text-[#0A0D18]" aria-hidden="true">
            <Ticket className="size-[18px]" strokeWidth={1.85} />
          </span>
        )}
        <div className="flex min-w-0 flex-col gap-1">
          <p className="text-[16px] leading-snug font-semibold text-balance">{copy.title}</p>
          <p className="text-[14px] text-v-muted text-pretty">{copy.body}</p>
        </div>
      </div>
      <VButton kind="ink" size="sm" render={<Link href={href} />} nativeButton={false} className="w-fit">
        {copy.cta}
        <ArrowRight className="size-4 rtl:-scale-x-100" aria-hidden="true" />
      </VButton>
    </section>
  )
}
