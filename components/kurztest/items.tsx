"use client"

import { useState } from "react"
import { ChoiceItem, FeedbackSheet, GapTask, MarkBoxes, MatchTask, PictureItem, TickGrid, TrueFalseItem } from "@/components/exam"
import { itemNumbers, type ItemKey, type KurztestBlock, type KurztestItem } from "@/lib/exam/kurztest"
import { typedRight } from "@/lib/exam/scoring/start"
import type { PartId, TrueFalse } from "@/lib/exam/types"
import { LOCALE_SHORT } from "@/lib/i18n/locale"
import { useKurztest } from "./locale"

export type Values = Record<number, string>

/** Typed answers (no options) are right with small spelling slips, as the scorer counts them. */
const rightOf = (k: ItemKey, value: string | undefined, typed: boolean) => (typed ? typedRight(value ?? "", String(k.correct), k.accept) : value === k.correct)

/** A solved item's explanation; a translated one can flip to the German original and back. */
function Feedback({ k, value, typed = false }: { k: ItemKey; value?: string; typed?: boolean }) {
  const { locale } = useKurztest()
  const [german, setGerman] = useState(false)
  const toggle = k.explanationDe ? () => setGerman((g) => !g) : undefined
  return (
    <FeedbackSheet
      right={rightOf(k, value, typed)}
      solution={k.correct}
      explanation={german && k.explanationDe ? k.explanationDe : k.explanation}
      evidence={k.evidence}
      language={LOCALE_SHORT[german ? locale : "de"]}
      onLanguage={toggle}
    />
  )
}

function Item({ it, skill, label, keys, values, onChange }: { it: KurztestItem; skill: PartId; label?: string; keys?: ItemKey[]; values: Values; onChange?: (n: number, v: string) => void }) {
  const keyOf = (n: number) => keys?.find((a) => a.n === n)
  const typed = new Set(it.type === "gap" ? it.data.parts.flatMap((p) => (typeof p !== "string" && !p.options.length ? [p.n] : [])) : [])
  const feedback = (n: number) => {
    const k = keyOf(n)
    return k ? <Feedback key={n} k={k} value={values[n]} typed={typed.has(n)} /> : null
  }
  const reviewMap = (ns: number[]) => (keys ? Object.fromEntries(ns.map((n) => [n, keyOf(n)?.correct ?? ""])) : undefined)

  if (it.type === "rf" || it.type === "choice" || it.type === "picture") {
    const n = it.item.n
    const k = keyOf(n)
    const change = onChange && !keys ? (v: string) => onChange(n, v) : undefined
    return (
      <div className="flex flex-col gap-3">
        {it.type === "rf" ? (
          <TrueFalseItem item={it.item} label={label} value={(values[n] ?? null) as TrueFalse | null} onChange={change} review={k ? { correct: k.correct as TrueFalse } : undefined} />
        ) : it.type === "picture" ? (
          <PictureItem item={it.item} label={label} value={values[n] ?? null} onChange={change} review={k ? { correct: k.correct } : undefined} />
        ) : (
          <ChoiceItem item={it.item} label={label} value={values[n] ?? null} onChange={change} review={k ? { correct: k.correct } : undefined} />
        )}
        {feedback(n)}
      </div>
    )
  }
  const ns = itemNumbers([it])
  const change = onChange && !keys ? onChange : undefined
  if (it.type === "grid" || it.type === "marks") {
    return (
      <div className="flex flex-col gap-3">
        {label ? <span className="text-[13px] text-v-muted">{label}</span> : null}
        {it.type === "grid" ? <TickGrid data={it.data} value={values} onChange={change} review={reviewMap(ns)} /> : <MarkBoxes data={it.data} value={values} onChange={change} review={reviewMap(ns)} />}
        {ns.map(feedback)}
      </div>
    )
  }
  return (
    <div className="flex flex-col gap-3">
      {label ? <span className="text-[13px] text-v-muted">{label}</span> : null}
      {it.type === "match" ? (
        <MatchTask skill={skill} data={it.data} noMatch={it.noMatch} value={values} onChange={change} review={reviewMap(ns)} />
      ) : (
        <GapTask data={it.data} value={values} onChange={change} review={reviewMap(ns)} marks={keys ? Object.fromEntries([...typed].map((n) => [n, !!keyOf(n) && rightOf(keyOf(n)!, values[n], true)])) : undefined} />
      )}
      {ns.map(feedback)}
    </div>
  )
}

/**
 * A block's tasks. Without `keys` it is exam mode; with `keys` it shows solutions and explanations.
 * `examples`: the solved answers of the block's Beispiel items (n = 0, Modelltests), shown filled in and read-only.
 */
/** `name`: the Teil's official name when it has one (telc "Sprachbausteine Teil 1"). */
export function BlockItems({ block, values, onChange, keys, examples, name }: { block: Pick<KurztestBlock, "skill" | "teil" | "display">; values: Values; onChange?: (n: number, v: string) => void; keys?: ItemKey[]; examples?: string[]; name?: string }) {
  const T = useKurztest().T
  const label = name ?? `${T.names[block.skill]} · ${T.teil(block.teil)}`
  let k = 0
  return (
    <div className="flex flex-col gap-8">
      {block.display.items.map((it, i) => {
        const ns = itemNumbers([it])
        const ex = examples && ns.includes(0) ? examples[k++] : undefined
        if (ex === undefined) return <Item key={i} it={it} skill={block.skill} label={i === 0 ? label : undefined} keys={keys} values={values} onChange={onChange} />
        const onlyExample = ns.every((n) => n === 0)
        return <Item key={i} it={it} skill={block.skill} label={onlyExample ? T.example : i === 0 ? label : undefined} keys={keys} values={{ ...values, 0: ex }} onChange={onlyExample || !onChange ? undefined : (n, v) => n !== 0 && onChange(n, v)} />
      })}
    </div>
  )
}
