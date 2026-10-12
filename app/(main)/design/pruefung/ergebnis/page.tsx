import type { Metadata } from "next"
import Link from "next/link"
import { DesignShell } from "@/components/design/shell"
import { NzLogo } from "@/components/design/variants/nachtzug-logo"
import { ExamStage, NextStepCard, PartResultCard, ResultHero, ReviewList } from "@/components/exam"
import { RESULT, RESULT_POINTS } from "@/lib/exam/samples"

export const metadata: Metadata = {
  title: "Ergebnis · Design",
  robots: { index: false, follow: false },
}

export default function ResultDesignPage() {
  return (
    <DesignShell id="nachtzug" lang="de">
      <ExamStage scene="ergebnis">
        <div className="mx-auto flex w-full max-w-[1040px] flex-col gap-4">
          <nav className="flex items-center justify-between px-1 pb-2">
            <Link href="/" aria-label="Startseite"><NzLogo /></Link>
            <Link href="/design/pruefung" className="nz-app rounded-full px-4 py-2 text-[14px] font-medium">Alle Elemente</Link>
          </nav>
          <ResultHero
            level={RESULT.level}
            meta={RESULT.meta}
            headline={<>Du bist bei <em className="pr-1">A2</em>.<br />B1 ist nah.</>}
            summary={RESULT.summary}
          />
          <NextStepCard text={RESULT.next.text} cta={RESULT.next.cta} />
          <h2 className="px-1 pt-6 text-[24px] font-semibold tracking-[-0.02em] text-(--v-photo-ink)">Deine Teile</h2>
          <div className="grid grid-cols-[minmax(0,1fr)] items-start gap-4 md:grid-cols-2">
            {RESULT.parts.map((p) => <PartResultCard key={p.part} result={p} />)}
          </div>
          <ReviewList entries={RESULT.review} />
          <h2 className="px-1 pt-10 text-[24px] font-semibold tracking-[-0.02em] text-(--v-photo-ink)">Ergebnis in Punkten (Goethe, telc, ÖSD)</h2>
          <p className="px-1 text-[15px] text-v-muted">Prüfungen mit Punkten zeigen ihr eigenes Format: Punkte, Bestehensgrenze und bestanden oder nicht bestanden. Der DTZ bleibt bei B1, A2 oder unter A2.</p>
          <ResultHero
            as="h2"
            score={RESULT_POINTS.score}
            pass={0.6}
            meta="Start Deutsch 1 · Kurztest Schreiben"
            headline="Das reicht zum Bestehen."
            summary="Deine E-Mail ist klar. Achte auf den Gruß am Ende und auf die Wortstellung."
          />
          <div className="grid grid-cols-[minmax(0,1fr)] items-start gap-4 md:grid-cols-2">
            <PartResultCard result={RESULT_POINTS} defaultOpen />
            <PartResultCard result={{ part: "lesen", name: "Lesen", score: { points: 2, max: 5 }, passed: false, teile: [{ label: "Teil 1", items: [{ n: 1, right: true }, { n: 2, right: false }] }, { label: "Teil 2", items: [{ n: 6, right: true }, { n: 7, right: false }] }, { label: "Teil 3", items: [{ n: 11, right: false }] }] }} />
          </div>
        </div>
      </ExamStage>
    </DesignShell>
  )
}
