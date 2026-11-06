"use client"

import { useState } from "react"
import { Check, ClipboardCopy, Sparkles, TriangleAlert } from "lucide-react"
import { cn } from "@/lib/utils"

/**
 * "Copy prompt" for Claude Code, shared by /admin/seo and /admin/blog. The text is built on click (a function),
 * so a page with many rows carries no prompts in its payload. When the clipboard is blocked the text appears
 * in a textarea to select by hand.
 */
export function CopyButton({ text, label = "Fix with Claude Code: copy prompt", className }: { text: () => string; label?: string; className?: string }) {
  const [state, setState] = useState<"idle" | "copied" | "failed">("idle")
  const [fallback, setFallback] = useState<string | null>(null)
  const copy = async () => {
    const value = text()
    try {
      await navigator.clipboard.writeText(value)
      setState("copied")
      setFallback(null)
      setTimeout(() => setState("idle"), 1800)
    } catch {
      setState("failed")
      setFallback(value)
    }
  }
  return (
    <>
      <button type="button" onClick={copy} className={cn("v-cta inline-flex h-9 items-center gap-1.5 rounded-full px-3.5 text-[13.5px] font-medium transition-[opacity,transform] duration-150 ease-out outline-none hover:opacity-90 focus-visible:ring-2 focus-visible:ring-v-ink focus-visible:ring-offset-2 active:scale-[0.97]", className)}>
        {state === "copied" ? <Check className="size-4" aria-hidden="true" /> : state === "failed" ? <TriangleAlert className="size-4" aria-hidden="true" /> : <Sparkles className="size-4" aria-hidden="true" />}
        <span aria-live="polite">{state === "copied" ? "Prompt copied" : state === "failed" ? "Copy failed, select below" : label}</span>
        {state === "idle" && <ClipboardCopy className="size-3.5 opacity-70" aria-hidden="true" />}
      </button>
      {fallback && <textarea readOnly value={fallback} onFocus={(e) => e.currentTarget.select()} className="mt-2 h-48 w-full rounded-xl bg-v-bg p-3 font-[family-name:var(--v-font-mono)] text-[12px] outline-none focus-visible:ring-2 focus-visible:ring-v-ink" />}
    </>
  )
}
