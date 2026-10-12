import type { ReactNode } from "react"
import { getVariant, type VariantId } from "@/lib/design/variants"

export function DesignShell({ id, lang, children }: { id: VariantId; lang: string; children: ReactNode }) {
  const palette = getVariant(id).palettes[0].id
  return (
    <div lang={lang} data-variant={id} data-palette={palette} className="v-frame min-h-dvh" style={{ colorScheme: "light" }}>
      {children}
    </div>
  )
}
