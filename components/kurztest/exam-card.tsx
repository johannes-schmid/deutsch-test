import { PhotoCard } from "@/components/design/kit"
import { ExamMark } from "@/components/design/variants/nachtzug-icons"
import { KURZTEST_COPY, type KurztestCopy } from "@/lib/i18n/kurztest"
import type { Brand, Exam } from "@/lib/exams"

const PHOTO: Record<Brand, string> = { dtz: "--g-photo-5", goethe: "--g-photo-2", telc: "--g-photo-6", oesd: "--g-photo-4", sd1: "--g-photo-3" }

/** One exam as a PhotoCard: brand badge, provider, summary, result format. No `href` = "Bald verfügbar"; `chip` replaces the "Gratis" chip (null hides it). Used by /gratis-test and the portal. */
export function ExamCard({ exam, href, t: T = KURZTEST_COPY.overview, free = KURZTEST_COPY.chips.free, cta = T.start, chip }: { exam: Exam; href: string | null; t?: KurztestCopy["overview"]; free?: string; cta?: string; chip?: string | null }) {
  return (
    <PhotoCard
      token={PHOTO[exam.brand]}
      art={<ExamMark brand={exam.brand} />}
      chip={chip === undefined ? (href ? free : T.soon) : (chip ?? undefined)}
      tags={<span>{exam.provider}</span>}
      title={exam.name}
      text={exam.summary}
      meta={<span className="text-[13.5px] text-v-muted">{T.result}: {exam.result}</span>}
      cta={cta}
      href={href}
    />
  )
}
