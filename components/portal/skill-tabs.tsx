"use client"

import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PART_ICONS } from "@/components/design/variants/nachtzug-icons"
import { ModelltestGrid, type CardSlot } from "@/components/portal/portal-exam"
import type { PartId } from "@/lib/exam/types"
import { PORTAL_COPY } from "@/lib/i18n/portal"
import { cn } from "@/lib/utils"

const T = PORTAL_COPY

export type SkillTab = { skill: PartId; name: string; free: string | null; slots: CardSlot[] }

const DOT: Record<PartId, string> = { hoeren: "bg-(--v-sk-hoeren)", lesen: "bg-(--v-sk-lesen)", schreiben: "bg-(--v-sk-schreiben)", sprechen: "bg-(--v-sk-sprechen)" }

/** The dashboard's four skills as tabs, each with its ten Modelltests as cards. Arrow keys move between tabs (Base UI). */
export function SkillTabs({ tabs, initial }: { tabs: SkillTab[]; initial: PartId }) {
  return (
    <Tabs defaultValue={initial} className="gap-5">
      <TabsList aria-label={T.skill.tabs} className="grid h-auto w-full grid-cols-4 group-data-horizontal/tabs:h-auto gap-1.5 rounded-[20px] bg-v-soft p-1.5 sm:gap-2">
        {tabs.map((t) => {
          const Icon = PART_ICONS[t.skill]
          const done = t.slots.filter((s) => s.state === "done").length
          return (
            <TabsTrigger
              key={t.skill}
              value={t.skill}
              aria-label={`${t.name}, ${T.skill.tabCount(done, t.slots.length)}`}
              className="group h-auto min-h-[76px] flex-col gap-1.5 rounded-[15px] border-0 px-1 py-2.5 text-v-muted transition-[background-color,color,box-shadow,transform] duration-150 ease-out hover:text-v-ink focus-visible:ring-2 focus-visible:ring-v-ink focus-visible:outline-none active:scale-[0.97] data-active:bg-v-surface data-active:text-v-ink data-active:shadow-[0_1px_2px_rgba(14,19,34,0.06),0_8px_20px_-12px_rgba(14,19,34,0.35)] sm:min-h-[84px] sm:flex-row sm:gap-3 sm:px-3 dark:data-active:bg-v-surface"
            >
              <span className="relative grid size-8 shrink-0 place-items-center sm:size-10">
                <Icon className="size-[22px] sm:size-6" strokeWidth={1.85} aria-hidden="true" />
                <span className={cn("absolute -end-0.5 -top-0.5 size-2.5 rounded-full ring-2 ring-v-soft group-data-active:ring-v-surface", DOT[t.skill])} aria-hidden="true" />
              </span>
              <span className="flex min-w-0 flex-col items-center leading-tight sm:items-start">
                <span className="text-[13px] font-semibold sm:text-[16px]">{t.name}</span>
                <span className="v-num text-[11.5px] font-normal text-v-muted sm:text-[13px]" aria-hidden="true">
                  {done}/{t.slots.length}
                </span>
              </span>
            </TabsTrigger>
          )
        })}
      </TabsList>
      {tabs.map((t) => (
        <TabsContent key={t.skill} value={t.skill} className="flex flex-col gap-4 text-base">
          <ModelltestGrid slots={t.slots} skill={t.skill} label={`${t.name}: ${T.exam.count(t.slots.length)}`} />
          {t.free ? (
            <Link href={t.free} className="w-fit rounded-full px-1 py-1 text-[14px] font-semibold underline decoration-v-ink/25 underline-offset-4 transition-[text-decoration-color] duration-150 ease-out hover:decoration-v-ink">
              {T.exam.free}
            </Link>
          ) : null}
        </TabsContent>
      ))}
    </Tabs>
  )
}
