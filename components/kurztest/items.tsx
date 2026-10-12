"use client"

import { ChoiceItem, FeedbackSheet, GapItem, MatchItem, PictureItem, TrueFalseItem } from "@/components/exam"
import type { ItemKey, KurztestBlock, KurztestItem } from "@/lib/exam/kurztest"
import type { TrueFalse } from "@/lib/exam/types"

export type Values = Record<number, string>

function Item({ it, label, keys, values, onChange }: { it: KurztestItem; label?: string; keys?: ItemKey[]; values: Values; onChange?: (n: number, v: string) => void }) {
  const keyOf = (n: number) => keys?.find((a) => a.n === n)
  const feedback = (n: number) => {
    const k = keyOf(n)
    return k ? <FeedbackSheet key={n} right={values[n] === k.correct} solution={k.correct} explanation={k.explanation} evidence={k.evidence} /> : null
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
  const ns = it.type === "match" ? it.data.situations.map((s) => s.n) : it.data.parts.flatMap((p) => (typeof p === "string" ? [] : [p.n]))
  const change = onChange && !keys ? onChange : undefined
  return (
    <div className="flex flex-col gap-3">
      {label ? <span className="text-[13px] text-v-muted">{label}</span> : null}
      {it.type === "match" ? (
        <MatchItem data={it.data} noMatch={it.noMatch} value={values} onChange={change} review={reviewMap(ns)} />
      ) : (
        <GapItem data={it.data} value={values} onChange={change} review={reviewMap(ns)} />
      )}
      {ns.map(feedback)}
    </div>
  )
}

const SKILL = { hoeren: "Hören", lesen: "Lesen", schreiben: "Schreiben", sprechen: "Sprechen" } as const

/** A block's tasks. Without `keys` it is exam mode; with `keys` it shows solutions and explanations. */
export function BlockItems({ block, values, onChange, keys }: { block: Pick<KurztestBlock, "skill" | "teil" | "display">; values: Values; onChange?: (n: number, v: string) => void; keys?: ItemKey[] }) {
  const label = `${SKILL[block.skill]} · Teil ${block.teil}`
  return (
    <div className="flex flex-col gap-8">
      {block.display.items.map((it, i) => (
        <Item key={i} it={it} label={i === 0 ? label : undefined} keys={keys} values={values} onChange={onChange} />
      ))}
    </div>
  )
}
