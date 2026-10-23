"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowRight, Clock, Headphones, RotateCcw, Users } from "lucide-react"
import { cn } from "@/lib/utils"
import { ExamMark } from "@/components/design/variants/nachtzug-icons"
import { EXAMS, EXAM_IDS } from "@/lib/exams"
import {
  ChoiceItem, ConfirmSheet, ExamAudio, ExamButton, ExamInstructions, ExamShell, ExamTrack, useExamTrack, ExamStage, FeedbackSheet, GapItem, MatchItem, PartIntro, PictureItem,
  ReadingLayout, ReadingText, SpeakingTask, TrueFalseItem, WritingTask, type ShellSection,
} from "@/components/exam"
import type { TrueFalse } from "@/lib/exam/types"
import { DTZ_ANLEITUNG } from "@/lib/modelltest/anleitung"
import {
  DURCHSAGE, APOTHEKE, GAP, GAP_SOLUTION, HOEREN_CHOICE, HOEREN_FEEDBACK, HOEREN_TEILE, HOEREN_TF, HOEREN_TF_SOLUTION, MATCH, MATCH_SOLUTION,
  CARD_TURNS, PEOPLE, PICTO_PICTURE, PICTURE, TRACK, READING, READING_CHOICE, READING_TF, SPEAKING, SPEAKING_CARDS, TURNS, WRITING, WRITING_SINGLE,
} from "@/lib/exam/samples"

const teile = (doneUntil: number): ShellSection[] => {
  let start = 1
  return HOEREN_TEILE.map((t) => {
    const s = { ...t, done: Math.max(0, Math.min(t.count, doneUntil - start + 1)) }
    start += t.count
    return s
  })
}

const overview = (current: number) => ({
  title: "Übersicht Hören",
  items: Array.from({ length: 20 }, (_, i) => ({ n: i + 1, state: i + 1 === current ? ("current" as const) : i + 1 < current ? ("done" as const) : ("open" as const) })),
})

function IntroScreen() {
  return (
    <ExamShell sections={teile(0)} progressLabel="Fortschritt Hören" seconds={25 * 60}>
      <PartIntro
        part="hoeren"
        name="Hören"
        minutes={25}
        count={20}
        teile={[
          { label: "Teil 1", detail: "Durchsagen · 4 Aufgaben" },
          { label: "Teil 2", detail: "Radio · 5 Aufgaben" },
          { label: "Teil 3", detail: "Gespräche · 8 Aufgaben" },
          { label: "Teil 4", detail: "Meinungen · 3 Aufgaben" },
        ]}
        rules={[
          { icon: Headphones, text: "Du hörst jeden Text einmal." },
          { icon: RotateCcw, text: "Kein Pausieren, kein Zurückspulen." },
          { icon: Clock, text: "Die Zeit läuft für den ganzen Teil." },
        ]}
        onStart={() => {}}
      />
    </ExamShell>
  )
}

function HoerenScreen() {
  const [pick, setPick] = useState<string | null>(null)
  const [checked, setChecked] = useState(false)
  return (
    <ExamShell
      sections={teile(pick ? 2 : 1)}
      progressLabel="Fortschritt Hören"
      seconds={21 * 60 + 48}
      overview={overview(2)}
      action={
        checked ? (
          <ExamButton onClick={() => { setChecked(false); setPick(null) }}>Weiter</ExamButton>
        ) : (
          <ExamButton disabled={!pick} onClick={() => setChecked(true)}>Prüfen</ExamButton>
        )
      }
    >
      <ExamAudio clip={DURCHSAGE} showLock={!checked} />
      <ChoiceItem item={HOEREN_CHOICE} label="Hören · Teil 1" value={pick} onChange={setPick} review={checked ? { correct: HOEREN_FEEDBACK.correct } : undefined} />
      {checked ? <FeedbackSheet right={pick === HOEREN_FEEDBACK.correct} solution={HOEREN_FEEDBACK.correct} explanation={HOEREN_FEEDBACK.explanation} evidence={HOEREN_FEEDBACK.evidence} /> : null}
    </ExamShell>
  )
}

function LesenScreen() {
  const [tf, setTf] = useState<TrueFalse | null>(null)
  const [abc, setAbc] = useState<string | null>(null)
  return (
    <ExamShell wide sections={[{ id: "l", label: "Lesen", count: 25, done: 13 + (tf ? 1 : 0) + (abc ? 1 : 0) }]} progressLabel="Fortschritt Lesen" seconds={31 * 60 + 8} overview={{ title: "Übersicht Lesen", items: Array.from({ length: 25 }, (_, i) => ({ n: i + 1, state: i < 13 ? "done" : i === 13 ? "current" : "open" })) }} action={<ExamButton>Weiter</ExamButton>}>
      <ReadingLayout
        answered={(tf ? 1 : 0) + (abc ? 1 : 0)}
        total={2}
        text={<ReadingText data={READING} />}
        tasks={
          <>
            <TrueFalseItem item={READING_TF} label="Lesen · Teil 3" value={tf} onChange={setTf} />
            <ChoiceItem item={READING_CHOICE} value={abc} onChange={setAbc} />
          </>
        }
      />
    </ExamShell>
  )
}

function SchreibenScreen() {
  const [chosen, setChosen] = useState<string | null>("A")
  const [text, setText] = useState("Sehr geehrte Damen und Herren,\n\nseit drei Tagen funktioniert die Heizung in meiner Wohnung nicht. ")
  return (
    <ExamShell wide sections={[{ id: "s", label: "Schreiben", count: 1, done: 0 }]} progressLabel="Fortschritt Schreiben" seconds={22 * 60 + 40} action={<ExamButton disabled={!text.trim()}>Abgeben</ExamButton>}>
      <WritingTask options={WRITING} chosen={chosen} onChoose={setChosen} value={text} onChange={setText} />
    </ExamShell>
  )
}

function SprechenScreen() {
  return (
    <ExamShell sections={[{ id: "1", label: "Teil 1", count: 1, done: 1 }, { id: "2", label: "Teil 2", count: 1, done: 1 }, { id: "3", label: "Teil 3", count: 1, done: 0 }]} progressLabel="Fortschritt Sprechen" seconds={2 * 60 + 8}>
      <SpeakingTask data={SPEAKING} people={PEOPLE} turns={TURNS} covered={["Was schenken?"]} />
    </ExamShell>
  )
}

const FLOW = [
  { id: "intro", label: "Start", scene: "intro", C: IntroScreen },
  { id: "hoeren", label: "Hören", scene: "hoeren", C: HoerenScreen },
  { id: "lesen", label: "Lesen", scene: "lesen", C: LesenScreen },
  { id: "schreiben", label: "Schreiben", scene: "schreiben", C: SchreibenScreen },
  { id: "sprechen", label: "Sprechen", scene: "sprechen", C: SprechenScreen },
] as const

function Block({ title, note, children }: { title: string; note: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-5 border-t border-v-line pt-8">
      <div className="flex max-w-[70ch] flex-col gap-1.5">
        <h2 className="text-[24px] font-semibold tracking-[-0.02em]">{title}</h2>
        <p className="text-[15px] leading-relaxed text-v-muted">{note}</p>
      </div>
      {children}
    </section>
  )
}

function TrackDemo() {
  const player = useExamTrack(TRACK)
  return <ExamTrack track={TRACK} player={player} />
}

function Panel({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("nz-app flex flex-col gap-4 rounded-[24px] p-5", className)}>{children}</div>
}

export function ExamGallery() {
  const [step, setStep] = useState<(typeof FLOW)[number]["id"]>("hoeren")
  const cur = FLOW.find((f) => f.id === step)!
  const [abc, setAbc] = useState<string | null>("a")
  const [tf, setTf] = useState<TrueFalse | null>(null)
  const [pic, setPic] = useState<string | null>("b")
  const [match, setMatch] = useState<Record<number, string>>({ 6: "a" })
  const [gap, setGap] = useState<Record<number, string>>({ 21: "zum" })
  const [time, setTime] = useState<string | null>(null)
  const [sheet, setSheet] = useState<"exit" | "time" | null>(null)
  const [note, setNote] = useState("Liebe Frau Brandt,\n\nich kann am Samstag leider nicht kommen. ")
  return (
    <div className="v-container flex flex-col gap-12 py-10 sm:py-14">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex max-w-[60ch] flex-col gap-3">
          <h1 className="v-h2 text-[clamp(32px,4.4vw,52px)]">Prüfungs-Elemente</h1>
          <p className="text-[16.5px] leading-relaxed text-v-muted">Das Fokus-System: alle Bausteine aus <code className="v-num text-[14px]">components/exam</code>. Die Inhalte sind Beispiele.</p>
        </div>
        <Link href="/design/pruefung/ergebnis" className="flex h-12 shrink-0 items-center gap-2 self-start rounded-full bg-v-ink px-6 text-[15px] font-semibold text-v-bg transition-transform active:scale-[0.97] sm:self-auto">
          Ergebnis-Seite <ArrowRight className="size-4 rtl:-scale-x-100" aria-hidden="true" />
        </Link>
      </header>

      <Block title="Der Ablauf" note="Jeder Teil im selben Rahmen: Fortschritt pro Teil, Restzeit, fester Knopf unten. Lesen und Schreiben werden ab Desktop zweispaltig.">
        <div className="flex gap-1 overflow-x-auto rounded-full bg-v-soft p-1" role="tablist" aria-label="Teil">
          {FLOW.map((f) => (
            <button key={f.id} type="button" role="tab" aria-selected={f.id === step} onClick={() => setStep(f.id)} className={cn("h-10 flex-1 shrink-0 cursor-pointer rounded-full px-4 text-[14px] font-semibold transition-colors duration-150", f.id === step ? "bg-v-ink text-v-bg" : "text-v-muted hover:text-v-ink")}>
              {f.label}
            </button>
          ))}
        </div>
        <ExamStage scene={cur.scene} framed key={cur.id}>
          <div className="nz-screen"><cur.C /></div>
        </ExamStage>
      </Block>

      <Block title="Fragetypen" note="Im Prüfungsmodus: gewählt ist Tinte, nie Glut. Richtig und falsch zeigen sich erst in der Auswertung.">
        <ExamStage scene="intro" framed className="grid grid-cols-[minmax(0,1fr)] gap-3 lg:grid-cols-2">
          <Panel><ChoiceItem item={HOEREN_CHOICE} label="Auswahl a, b, c" value={abc} onChange={setAbc} /></Panel>
          <div className="flex flex-col gap-3">
            <Panel><TrueFalseItem item={HOEREN_TF} label="Richtig oder falsch" value={tf} onChange={setTf} /></Panel>
            <Panel><PictureItem item={PICTURE} label="Bilder" value={pic} onChange={setPic} /></Panel>
          </div>
          <Panel className="lg:col-span-2"><MatchItem data={MATCH} value={match} onChange={(n, k) => setMatch((m) => ({ ...m, [n]: k }))} /></Panel>
          <Panel className="lg:col-span-2"><GapItem data={GAP} value={gap} onChange={(n, v) => setGap((m) => ({ ...m, [n]: v }))} /></Panel>
        </ExamStage>
      </Block>

      <Block title="Richtig und falsch" note="Richtig in Glut mit Haken. Falsch in Rosé mit X und „Deine Antwort“. Die Lösung bekommt einen Glut-Rahmen.">
        <ExamStage scene="schreiben" framed className="grid grid-cols-[minmax(0,1fr)] gap-3 lg:grid-cols-2">
          <Panel>
            <ChoiceItem item={HOEREN_CHOICE} value="a" review={{ correct: "b" }} />
            <FeedbackSheet right={false} solution="b" explanation={HOEREN_FEEDBACK.explanation} evidence={HOEREN_FEEDBACK.evidence} language="UK" onLanguage={() => {}} />
          </Panel>
          <div className="flex flex-col gap-3">
            <Panel><TrueFalseItem item={HOEREN_TF} value="richtig" review={{ correct: HOEREN_TF_SOLUTION }} /></Panel>
            <Panel><PictureItem item={PICTURE} value="b" review={{ correct: "b" }} /></Panel>
          </div>
          <Panel className="lg:col-span-2"><MatchItem data={MATCH} value={{ 6: "a", 7: "c", 8: "x" }} review={MATCH_SOLUTION} /></Panel>
          <Panel className="lg:col-span-2"><GapItem data={GAP} value={{ 21: "am", 22: "Bestätigung" }} review={GAP_SOLUTION} /></Panel>
        </ExamStage>
      </Block>

      <Block title="Prüfungs-Marken" note="Unsere eigenen Marken, nie die Logos der Anbieter: Name des Anbieters in unserer Schrift, ein Ton pro Anbieter und die Flagge des Herkunftslands. So unterscheiden sich Goethe B1 und ÖSD B1 auf einen Blick.">
        <div className="flex flex-wrap gap-5">
          {EXAM_IDS.map((id) => (
            <span key={id} className="flex w-[88px] flex-col items-center gap-2 text-center">
              <ExamMark brand={EXAMS[id].brand} />
              <span className="text-[12px] leading-tight text-v-muted">{EXAMS[id].name}</span>
            </span>
          ))}
        </div>
      </Block>

      <Block title="Rückfragen" note="Statt der Browser-Fenster: unten ein Sheet auf dem Handy, ab Tablet eine Karte in der Mitte. Die sichere Wahl ist gefüllt und hat den Fokus. Ohne zweite Wahl ist es ein Hinweis.">
        <div className="flex flex-wrap gap-2">
          <ExamButton kind="soft" onClick={() => setSheet("exit")}>Test beenden</ExamButton>
          <ExamButton kind="soft" onClick={() => setSheet("time")}>Zeit ist um</ExamButton>
        </div>
        <ConfirmSheet open={sheet === "exit"} onOpenChange={(o) => !o && setSheet(null)} title="Test beenden?" text="Deine Antworten gehen verloren." confirm="Beenden" cancel="Weitermachen" onConfirm={() => setSheet(null)} />
        <ConfirmSheet open={sheet === "time"} onOpenChange={(o) => !o && setSheet(null)} title="Die Zeit ist um." text="Dein Test wird jetzt abgegeben." confirm="Zum Ergebnis" onConfirm={() => setSheet(null)} />
      </Block>

      <Block title="Audio" note="Kein Pausieren, kein Spulen. Die Anzahl der Durchgänge steht dabei. Mehrere Stimmen leuchten, wenn sie sprechen.">
        <ExamStage scene="ergebnis" framed className="grid grid-cols-[minmax(0,1fr)] gap-3 sm:grid-cols-2">
          <Panel><ExamAudio clip={DURCHSAGE} /></Panel>
          <Panel><ExamAudio clip={APOTHEKE} /></Panel>
        </ExamStage>
      </Block>

      <Block title="Anleitung (Modelltest)" note="Vor jedem Prüfungsteil, wie das Deckblatt der echten Prüfung: in der Sie-Form, die Regeln als nummerierte Schritte. Die gesprochene Fassung (Erzähler Mark) lässt sich pausieren und wiederholen; sie ist keine Prüfungsaudio.">
        <ExamStage scene="hoeren" framed>
          <div className="nz-app mx-auto flex max-w-[600px] flex-col rounded-[24px] p-6 sm:p-8">
            <ExamInstructions {...DTZ_ANLEITUNG.hoeren} action={<ExamButton className="w-full">Starten</ExamButton>} />
          </div>
        </ExamStage>
      </Block>

      <Block title="Hörtrack (Modelltest)" note="Im Modelltest ist Hören ein einziger Track wie in der Prüfung: einmal starten, dann laufen Ansage, Lesezeit, Hörtext und Antwortzeit ohne Pause. Die Segmente sind die Teile, die Zeile sagt, wo der Track gerade ist. Pausiert nur das Gerät, kann man weiterhören.">
        <ExamStage scene="hoeren" framed>
          <div className="nz-app mx-auto flex max-w-[560px] flex-col rounded-[24px] px-5 pt-6 pb-5">
            <TrackDemo />
          </div>
        </ExamStage>
      </Block>

      <Block title="Sprechen zu zweit" note="Prüfer und Partnerin sind Personen mit eigenen Zügen. Die Stichpunkte stehen oben. DTZ Teil 2: jede Person hat ein anderes Foto (aus unserem Storage, mit Pexels-Nachweis); gezeigt wird das Foto der Person, die gerade spricht.">
        <ExamStage scene="sprechen" framed>
          <div className="nz-app mx-auto flex max-w-[560px] flex-col rounded-[24px] px-5 pt-6 pb-5">
            <SpeakingTask data={SPEAKING} people={PEOPLE} turns={TURNS} />
          </div>
        </ExamStage>
        <ExamStage scene="sprechen" framed>
          <div className="nz-app mx-auto flex max-w-[560px] flex-col rounded-[24px] px-5 pt-6 pb-5">
            <SpeakingTask
              data={{ part: "Sprechen · Teil 2", title: "Über Erfahrungen sprechen", task: "Was sehen Sie auf dem Foto? Was für eine Situation zeigt dieses Bild?", points: [] }}
              people={PEOPLE}
              turns={[{ who: "pruefer", text: "Bitte sehen Sie sich das Bild an und sagen Sie etwas dazu." }]}
              photo={{ src: "/design/sprechen-foto.webp", alt: "Fünf junge Leute sitzen auf großen Felsen am Wasser und essen Pizza.", caption: "Dein Foto", credit: { name: "PNW Production", url: "https://www.pexels.com/photo/friends-on-a-social-gathering-9353438/" } }}
            />
          </div>
        </ExamStage>
        <p className="flex items-center gap-2 text-[13.5px] text-v-muted"><Users className="size-4" aria-hidden="true" /> Ela ist eine echte Stimme aus der Besetzung in <code className="v-num">data/tts-voices.json</code>.</p>
      </Block>

      <Block title="Start Deutsch 1" note="Bilder als Piktogramm mit Beschriftung (lib/exam/pictos.ts, bis es Zeichnungen gibt). Gezogene Karten stehen über dem Gespräch. Gibt es nur eine Schreibaufgabe, entfällt die Wahl.">
        <ExamStage scene="intro" framed className="grid grid-cols-[minmax(0,1fr)] gap-3 lg:grid-cols-2">
          <div className="flex flex-col gap-3">
            <Panel><PictureItem item={PICTO_PICTURE} label="Hören · Teil 1" value={time} onChange={setTime} /></Panel>
            <Panel><PictureItem item={PICTO_PICTURE} value="a" review={{ correct: "c" }} /></Panel>
          </div>
          <div className="nz-app flex flex-col rounded-[24px] px-5 pt-6 pb-5">
            <SpeakingTask data={SPEAKING_CARDS} people={PEOPLE} turns={CARD_TURNS} />
          </div>
          <Panel className="lg:col-span-2"><WritingTask options={WRITING_SINGLE} chosen="A" onChoose={() => {}} value={note} onChange={setNote} /></Panel>
        </ExamStage>
      </Block>
    </div>
  )
}
