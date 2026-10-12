"use client"

import { createContext, useContext, type ReactNode } from "react"
import { cn } from "@/lib/utils"
import { getVariant, type VariantId } from "@/lib/design/variants"

type Mode = "light" | "dark"
const ModeContext = createContext<{ mode: Mode; palette: string }>({ mode: "light", palette: "" })
export const useMode = () => useContext(ModeContext).mode
export const usePalette = () => useContext(ModeContext).palette

export function DesignShell({ id, children }: { id: VariantId; children: ReactNode }) {
  const variant = getVariant(id)
  const mode: Mode = variant.defaultMode === "dark" ? "dark" : "light"
  const palette = variant.palettes[0].id

  return (
    <ModeContext.Provider value={{ mode, palette }}>
      <div data-variant={id} data-palette={palette} className={cn("v-frame min-h-dvh", mode === "dark" && "dark")} style={{ colorScheme: mode }}>
        {children}
      </div>
    </ModeContext.Provider>
  )
}
