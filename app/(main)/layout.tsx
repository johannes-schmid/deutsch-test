import { Host_Grotesk, JetBrains_Mono, Onest, Reddit_Mono } from "next/font/google"
import "./landing.css"

const hostGrotesk = Host_Grotesk({ subsets: ["latin"], style: ["normal", "italic"], variable: "--font-host" })
const redditMono = Reddit_Mono({ subsets: ["latin"], variable: "--font-redditmono" })
// Cyrillic only (unicode-range), placed before the Latin faces: Latin text never touches them, and German
// pages download them only when Cyrillic shows up. No generated fallback, or Arial would catch the Latin.
const onest = Onest({ subsets: ["cyrillic"], variable: "--font-cyr", preload: false, adjustFontFallback: false, fallback: [] })
const jetbrainsMono = JetBrains_Mono({ subsets: ["cyrillic"], variable: "--font-cyrmono", preload: false, adjustFontFallback: false, fallback: [] })

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return <div className={`${hostGrotesk.variable} ${redditMono.variable} ${onest.variable} ${jetbrainsMono.variable}`}>{children}</div>
}
