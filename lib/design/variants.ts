export const VARIANT_IDS = ["nachtzug"] as const
export type VariantId = (typeof VARIANT_IDS)[number]

export type Palette = { id: string; name: string; colors: [string, string] }

export type Variant = {
  id: VariantId
  name: string
  tagline: string
  reference: string
  dot: string
  defaultMode: "light" | "dark" | "system"
  palettes: Palette[]
  fonts: { display: string; body: string; mono: string }
  swatches: { label: string; token: string }[]
  gradients: { label: string; token: string }[]
}

const core = [
  { label: "Hintergrund", token: "--v-bg" },
  { label: "Fläche", token: "--v-surface" },
  { label: "Text", token: "--v-ink" },
  { label: "Gedämpft", token: "--v-muted" },
  { label: "Linie", token: "--v-line" },
  { label: "Aktion", token: "--v-cta" },
]

export const VARIANTS: Variant[] = [
  {
    id: "nachtzug",
    name: "Nachtzug",
    tagline: "Gut vorbereitet in die Prüfung. Weiches Licht hinter Glas.",
    reference: "Orchid",
    dot: "#7FA7FF",
    defaultMode: "light",
    palettes: [
      { id: "glut", name: "Glut", colors: ["#0E1322", "#FFB45E"] },
      { id: "mond", name: "Mond", colors: ["#0E1322", "#A7BCFF"] },
      { id: "rose", name: "Rosé", colors: ["#0E1322", "#FF9CC4"] },
    ],
    fonts: { display: "Host Grotesk 500 + kursiv", body: "Host Grotesk 400–600", mono: "Reddit Mono 400–500" },
    swatches: [...core, { label: "Glut", token: "--v-accent" }],
    gradients: [
      { label: "Bahnhof", token: "--g-photo-1" },
      { label: "Briefkasten", token: "--g-photo-2" },
      { label: "Schreibtisch", token: "--g-photo-3" },
      { label: "Gespräch", token: "--g-photo-4" },
    ],
  },
]

export const isVariantId = (v: string): v is VariantId => (VARIANT_IDS as readonly string[]).includes(v)

export const getVariant = (id: VariantId) => VARIANTS.find((v) => v.id === id)!
