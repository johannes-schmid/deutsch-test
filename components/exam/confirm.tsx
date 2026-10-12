"use client"

import { useEffect, useRef, useState } from "react"
import { AlertDialog } from "@base-ui/react/alert-dialog"
import { ExamButton } from "./primitives"

/**
 * In-exam confirmation instead of window.confirm/alert: a bottom sheet on phones, a centred card from `sm`.
 * The safe choice (`cancel`) is the filled button and gets focus. Without `cancel` it is a notice with one button.
 * Portals into the nearest `.v-frame` so the Nachtzug tokens apply.
 */
export function ConfirmSheet({ open, onOpenChange, title, text, confirm, cancel, onConfirm }: { open: boolean; onOpenChange: (open: boolean) => void; title: string; text?: string; confirm: string; cancel?: string; onConfirm: () => void }) {
  const anchor = useRef<HTMLSpanElement>(null)
  const safe = useRef<HTMLButtonElement>(null)
  const [frame, setFrame] = useState<HTMLElement | null>(null)
  useEffect(() => setFrame(anchor.current?.closest<HTMLElement>(".v-frame") ?? null), [])

  return (
    <>
      <span ref={anchor} hidden />
      <AlertDialog.Root open={open} onOpenChange={(o) => onOpenChange(o)}>
        <AlertDialog.Portal container={frame}>
          <AlertDialog.Backdrop className="fixed inset-0 z-50 bg-[rgba(8,10,30,0.45)] backdrop-blur-[2px] transition-opacity duration-300 ease-(--ease-out-strong) data-ending-style:opacity-0 data-starting-style:opacity-0" />
          <AlertDialog.Popup
            initialFocus={cancel ? safe : true}
            className="fixed inset-x-0 bottom-0 z-50 flex flex-col gap-5 rounded-t-[28px] bg-v-surface px-6 pt-3 pb-[max(1.5rem,env(safe-area-inset-bottom))] text-v-ink shadow-[0_-30px_60px_-30px_rgba(8,10,30,0.45)] outline-none transition-[translate,scale,opacity] duration-300 ease-(--ease-out-strong) data-ending-style:translate-y-full data-starting-style:translate-y-full sm:inset-x-auto sm:bottom-auto sm:top-1/2 sm:left-1/2 sm:w-[420px] sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-[24px] sm:p-7 sm:data-ending-style:-translate-y-1/2 sm:data-ending-style:scale-[0.96] sm:data-ending-style:opacity-0 sm:data-starting-style:-translate-y-1/2 sm:data-starting-style:scale-[0.96] sm:data-starting-style:opacity-0"
          >
            <span aria-hidden="true" className="mx-auto h-1 w-10 rounded-full bg-v-ink/15 sm:hidden" />
            <div className="flex flex-col gap-2">
              <AlertDialog.Title className="text-[22px] leading-tight font-semibold tracking-[-0.02em]">{title}</AlertDialog.Title>
              {text ? <AlertDialog.Description className="text-[15.5px] leading-relaxed text-v-muted">{text}</AlertDialog.Description> : null}
            </div>
            <div className="flex flex-col-reverse gap-2 sm:flex-row">
              <ExamButton kind={cancel ? "soft" : "primary"} className="w-full sm:flex-1" onClick={() => { onOpenChange(false); onConfirm() }}>{confirm}</ExamButton>
              {cancel ? <AlertDialog.Close render={<ExamButton ref={safe} className="w-full sm:flex-1" />}>{cancel}</AlertDialog.Close> : null}
            </div>
          </AlertDialog.Popup>
        </AlertDialog.Portal>
      </AlertDialog.Root>
    </>
  )
}
