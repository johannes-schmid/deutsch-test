"use client"

import { useRef, useState, type ReactNode } from "react"
import { Eye, EyeOff, Image as ImageIcon, Play, Square } from "lucide-react"
import { cn } from "@/lib/utils"
import { ChoiceItem, ExamAudio, ExamButton, ExamReading, ExamStage, FeedbackSheet, GapTask, MarkBoxes, MatchTask, PictureItem, PlanningSheet, ReadingLayout, SceneChoice, SpeakingTask, TickGrid, TopicCard, TrueFalseItem, WritingTask, fmt } from "@/components/exam"
import { itemNumbers, type ItemKey, type KurztestBlock, type KurztestItem } from "@/lib/exam/kurztest"
import type { PartId, TrueFalse } from "@/lib/exam/types"
import { EXAMS, EXAM_IDS, type ExamId } from "@/lib/exams"
import { partSpec } from "@/lib/exam/blueprint"

const SKILL = { hoeren: "Hören", lesen: "Lesen", schreiben: "Schreiben", sprechen: "Sprechen" } as const

type Values = Record<number, string>

function Feedback({ k, value }: { k: ItemKey; value: string | undefined }) {
  return <FeedbackSheet right={value === k.correct} solution={k.correct} explanation={k.explanation} evidence={k.evidence} />
}

function Item({ it, skill, label, keys, values, onChange, reveal }: { it: KurztestItem; skill: PartId; label?: string; keys: ItemKey[]; values: Values; onChange: (n: number, v: string) => void; reveal: boolean }) {
  const keyOf = (n: number) => keys.find((a) => a.n === n)!
  const reviewMap = (ns: number[]) => Object.fromEntries(ns.map((n) => [n, keyOf(n).correct]))
  if (it.type === "rf" || it.type === "choice" || it.type === "picture") {
    const k = keyOf(it.item.n)
    const value = values[it.item.n] ?? null
    return (
      <div className="flex flex-col gap-3">
        {it.type === "rf" ? (
          <TrueFalseItem item={it.item} label={label} value={value as TrueFalse | null} onChange={(v) => onChange(it.item.n, v)} review={reveal ? { correct: k.correct as TrueFalse } : undefined} />
        ) : it.type === "picture" ? (
          <PictureItem item={it.item} label={label} value={value} onChange={(v) => onChange(it.item.n, v)} review={reveal ? { correct: k.correct } : undefined} />
        ) : (
          <ChoiceItem item={it.item} label={label} value={value} onChange={(v) => onChange(it.item.n, v)} review={reveal ? { correct: k.correct } : undefined} />
        )}
        {reveal ? <Feedback k={k} value={values[it.item.n]} /> : null}
      </div>
    )
  }
  const ns = itemNumbers([it])
  if (it.type === "grid" || it.type === "marks") {
    return (
      <div className="flex flex-col gap-3">
        {label ? <span className="text-[13px] text-v-muted">{label}</span> : null}
        {it.type === "grid" ? <TickGrid data={it.data} value={values} onChange={onChange} review={reveal ? reviewMap(ns) : undefined} /> : <MarkBoxes data={it.data} value={values} onChange={onChange} review={reveal ? reviewMap(ns) : undefined} />}
        {reveal ? ns.map((n) => <Feedback key={n} k={keyOf(n)} value={values[n]} />) : null}
      </div>
    )
  }
  return (
    <div className="flex flex-col gap-3">
      {label ? <span className="text-[13px] text-v-muted">{label}</span> : null}
      {it.type === "match" ? (
        <MatchTask skill={skill} data={it.data} noMatch={it.noMatch} value={values} onChange={onChange} review={reveal ? reviewMap(ns) : undefined} />
      ) : (
        <GapTask data={it.data} value={values} onChange={onChange} review={reveal ? reviewMap(ns) : undefined} />
      )}
      {reveal ? ns.map((n) => <Feedback key={n} k={keyOf(n)} value={values[n]} />) : null}
    </div>
  )
}

const partLabel = (b: KurztestBlock) => (b.skill === "lesen" || b.skill === "hoeren" ? partSpec(b.skill, b.teil, b.exam).label : undefined) ?? `${SKILL[b.skill]} · Teil ${b.teil}`

function Items({ block, values, onChange, reveal }: { block: KurztestBlock; values: Values; onChange: (n: number, v: string) => void; reveal: boolean }) {
  const label = partLabel(block)
  return (
    <div className="flex flex-col gap-8">
      {block.display.items.map((it, i) => (
        <Item key={i} it={it} skill={block.skill} label={i === 0 ? label : undefined} keys={block.key.answers} values={values} onChange={onChange} reveal={reveal} />
      ))}
    </div>
  )
}

function Transcript({ block }: { block: KurztestBlock }) {
  const clip = block.display.clip!
  return (
    <div className="flex flex-col gap-2 rounded-2xl bg-v-soft p-4 text-[15px] leading-relaxed">
      {block.key.script?.map((t, i) => (
        <p key={i}>
          <b className="font-semibold">{clip.speakers[t.speaker]?.name}:</b> {t.text}
        </p>
      ))}
    </div>
  )
}

function Note({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2 rounded-2xl bg-v-soft p-4 text-[15px] leading-relaxed">
      <b className="text-[13px] font-semibold text-v-muted">{title}</b>
      {children}
    </div>
  )
}

function Writing({ block, reveal }: { block: KurztestBlock; reveal: boolean }) {
  const [chosen, setChosen] = useState<string | null>(null)
  const [text, setText] = useState("")
  const model = block.key.writing?.find((m) => m.key === chosen)
  return (
    <>
      <WritingTask options={block.display.writing!} chosen={chosen} onChoose={setChosen} value={text} onChange={setText} />
      {reveal && model ? (
        <Note title={`Musterlösung ${model.key} · ${model.register} · ${model.modelAnswer.split(/\s+/).length} Wörter`}>
          <p className="whitespace-pre-line">{model.modelAnswer}</p>
        </Note>
      ) : null}
    </>
  )
}

/** ÖSD Sprechen material shown before the talk: the topic card, the three photos with their roles, the planning sheet. */
function OesdMaterial({ block }: { block: KurztestBlock }) {
  const data = block.display.speaking!.data
  const [topics, setTopics] = useState<string[]>([])
  const [scene, setScene] = useState<string>()
  const [role, setRole] = useState<string>()
  const photos = (block as { photos?: Record<number, Record<string, { src?: string }>> }).photos?.[0]
  const scenes = data.scenes?.map((s) => ({ ...s, image: s.image ?? photos?.[s.key]?.src }))
  return (
    <>
      {data.choose ? <TopicCard data={data} picked={topics} onPick={setTopics} /> : null}
      {scenes ? <SceneChoice scenes={scenes} value={scene} onChange={setScene} role={role} onRole={block.teil === 3 ? setRole : undefined} /> : null}
      {data.sheet ? <PlanningSheet sheet={data.sheet} /> : null}
    </>
  )
}

function Speaking({ block, reveal }: { block: KurztestBlock; reveal: boolean }) {
  const sp = block.display.speaking!
  const audio = useRef<HTMLAudioElement | null>(null)
  const [playing, setPlaying] = useState<number | null>(null)
  const play = (i: number, src: string) => {
    audio.current?.pause()
    if (playing === i) return setPlaying(null)
    const el = new Audio(src)
    el.onended = () => setPlaying(null)
    void el.play()
    audio.current = el
    setPlaying(i)
  }
  const answers = block.key.speaking?.sampleAnswers ?? []
  let mine = 0
  return (
    <>
      <OesdMaterial block={block} />
      <SpeakingTask data={sp.data} people={sp.people} turns={sp.turns} />
      <Note title="Stimmen in der Vorschau">
        <ul className="flex flex-col gap-1.5">
          {sp.turns.map((t, i) =>
            t.who === "du" ? null : (
              <li key={i} className="flex items-center gap-3">
                <ExamButton kind="iconSm" disabled={!t.src} onClick={() => t.src && play(i, t.src)} aria-label={`${sp.people[t.who].name} abspielen`}>
                  {playing === i ? <Square className="size-3.5 fill-current" aria-hidden="true" /> : <Play className="ml-0.5 size-4 fill-current" aria-hidden="true" />}
                </ExamButton>
                <span className="min-w-0 flex-1 truncate text-[14px]">
                  <b className="font-semibold">{sp.people[t.who].name}</b> · {t.text}
                </span>
                {t.duration ? <span className="v-num text-[13px] text-v-muted">{fmt(t.duration)}</span> : null}
              </li>
            )
          )}
        </ul>
      </Note>
      {block.key.speaking?.pictureBrief ? (
        <Note title="Bild (noch zu erstellen)">
          <p className="flex gap-2">
            <ImageIcon className="mt-1 size-4 shrink-0 text-v-muted" aria-hidden="true" />
            {block.key.speaking.pictureBrief}
          </p>
        </Note>
      ) : null}
      {reveal ? (
        <Note title="Beispielantworten (B1)">
          {sp.turns.map((t, i) => (t.who === "du" ? <p key={i}><b className="font-semibold">{t.text}</b> {answers[mine++]}</p> : null))}
        </Note>
      ) : null}
    </>
  )
}

/** One block in review mode (solutions on demand). `actions` sits next to the solution toggle, `extra` below the task. */
export function BlockReview({ block, actions, extra }: { block: KurztestBlock; actions?: ReactNode; extra?: ReactNode }) {
  const [values, setValues] = useState<Values>({})
  const [reveal, setReveal] = useState(false)
  const [run, setRun] = useState(0)
  const onChange = (n: number, v: string) => setValues((m) => ({ ...m, [n]: v }))
  const items = <Items block={block} values={values} onChange={onChange} reveal={reveal} />
  const { reading, clip, writing, speaking } = block.display
  const wide = !!reading || !!writing || block.skill === "lesen"
  const facts = [
    block.generated.textType,
    clip?.src ? `${clip.duration.toFixed(1)} s` : null,
    block.key.tts ? `${block.key.tts.characters} Zeichen · ${block.key.tts.model}` : null,
    reading ? `${reading.paragraphs.join(" ").split(/\s+/).length} Wörter` : null,
  ].filter(Boolean)

  return (
    <section className="flex flex-col gap-5 border-t border-v-line pt-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex max-w-[70ch] flex-col gap-1.5">
          <h2 className="text-[24px] font-semibold tracking-[-0.02em]">{partLabel(block)}{block.id.endsWith("-bsp") ? " · Beispiel" : ""}</h2>
          <p className="text-[15px] leading-relaxed text-v-muted">
            <code className="v-num text-[13.5px]">{block.id}</code> · {block.status === "draft" ? "Entwurf, nicht geprüft" : "geprüft"} · {facts.join(" · ")}
          </p>
        </div>
        <div className="flex shrink-0 flex-wrap items-center gap-2 self-start sm:self-auto">
          <ExamButton kind="soft" className="flex items-center gap-2" onClick={() => setReveal((r) => !r)} aria-pressed={reveal}>
            {reveal ? <EyeOff className="size-4" aria-hidden="true" /> : <Eye className="size-4" aria-hidden="true" />}
            {reveal ? "Lösung ausblenden" : "Lösung zeigen"}
          </ExamButton>
          {actions}
        </div>
      </div>

      <ExamStage scene={block.skill} framed>
        <div className={cn("nz-app mx-auto flex w-full flex-col gap-6 rounded-[24px] px-5 pt-6 pb-6", wide ? "max-w-[1100px]" : "max-w-[560px]")}>
          {speaking ? null : <p className="text-[15px] leading-relaxed text-v-muted">{block.display.instruction}</p>}
          {writing ? (
            <Writing block={block} reveal={reveal} />
          ) : speaking ? (
            <Speaking block={block} reveal={reveal} />
          ) : reading ? (
            <ReadingLayout
              answered={Object.keys(values).length}
              total={block.key.answers.length}
              text={<ExamReading exam={block.exam} skill={block.skill} teil={block.teil} data={reading} highlight={reveal ? block.key.answers.map((a) => a.evidence?.hit).find((h) => h && reading.paragraphs.some((p) => p.includes(h))) : undefined} />}
              tasks={items}
            />
          ) : clip ? (
            <>
              <ExamAudio key={run} clip={clip} showLock={!reveal} />
              <button type="button" onClick={() => setRun((r) => r + 1)} className="cursor-pointer self-center text-[13px] text-v-muted underline underline-offset-4 hover:text-v-ink">
                Audio zurücksetzen (nur in der Vorschau)
              </button>
              {items}
              {reveal ? <Transcript block={block} /> : null}
            </>
          ) : (
            items
          )}
          {extra}
        </div>
      </ExamStage>
    </section>
  )
}

export function KurztestReview({ blocks: all }: { blocks: KurztestBlock[] }) {
  const exams = EXAM_IDS.filter((e) => all.some((b) => (b.exam ?? "dtz") === e))
  const [exam, setExam] = useState<ExamId>(exams[0] ?? "dtz")
  const blocks = all.filter((b) => (b.exam ?? "dtz") === exam)
  const skills = [...new Set(blocks.map((b) => b.skill))]
  const [picked, setSkill] = useState(skills[0])
  const skill = skills.includes(picked) ? picked : skills[0]
  const shown = blocks.filter((b) => b.skill === skill)
  const count = (s: string) => blocks.filter((b) => b.skill === s).reduce((n, b) => n + b.key.answers.length, 0)
  return (
    <div className="v-container flex flex-col gap-10 py-10 sm:py-14">
      <header className="flex max-w-[64ch] flex-col gap-3">
        <h1 className="v-h2 text-[clamp(32px,4.4vw,52px)]">Kurztest-Entwürfe</h1>
        <p className="text-[16.5px] leading-relaxed text-v-muted">
          Aus <code className="v-num text-[14px]">data/kurztest/drafts</code> (DTZ) und <code className="v-num text-[14px]">data/gratis-test/&lt;prüfung&gt;</code>, gerendert mit <code className="v-num text-[14px]">components/exam</code>. Hier sind die Lösungen sichtbar, weil die Seite nur zur Prüfung dient.
        </p>
      </header>
      {blocks.length ? (
        <>
          <label className="flex flex-col gap-1.5 text-[13px] font-semibold text-v-muted">
            Prüfung
            <select value={exam} onChange={(e) => setExam(e.target.value as ExamId)} className="h-11 max-w-[420px] rounded-full border border-v-line bg-v-surface px-4 text-[15px] font-semibold text-v-ink">
              {exams.map((e) => (
                <option key={e} value={e}>{EXAMS[e].name} · {all.filter((b) => (b.exam ?? "dtz") === e).length}</option>
              ))}
            </select>
          </label>
          <div className="grid gap-1 rounded-full bg-v-soft p-1" style={{ gridTemplateColumns: `repeat(${skills.length}, minmax(0, 1fr))` }} role="tablist" aria-label="Fertigkeit">
            {skills.map((s) => (
              <button key={s} type="button" role="tab" aria-selected={s === skill} onClick={() => setSkill(s)} className={cn("h-10 min-w-0 cursor-pointer truncate rounded-full px-2 text-[13px] font-semibold transition-colors duration-150 sm:text-[14px]", s === skill ? "bg-v-ink text-v-bg" : "text-v-muted hover:text-v-ink")}>
                {SKILL[s]}
                {count(s) ? <span className="v-num ml-1.5 hidden font-normal opacity-60 sm:inline">{count(s)}</span> : null}
              </button>
            ))}
          </div>
          {shown.map((b) => <BlockReview key={b.id} block={b} />)}
        </>
      ) : (
        <p className="text-v-muted">Noch keine Entwürfe. Starte <code className="v-num">scripts/generate-kurztest.ts</code>.</p>
      )}
    </div>
  )
}
