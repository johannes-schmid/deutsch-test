import { Host_Grotesk, Reddit_Mono } from "next/font/google"
import "../../../(main)/landing.css"

// The set preview renders the real exam components, which need the Nachtzug tokens and fonts.
const hostGrotesk = Host_Grotesk({ subsets: ["latin"], style: ["normal", "italic"], variable: "--font-host" })
const redditMono = Reddit_Mono({ subsets: ["latin"], variable: "--font-redditmono" })

export default function ModelltestsLayout({ children }: { children: React.ReactNode }) {
  return <div className={`${hostGrotesk.variable} ${redditMono.variable}`}>{children}</div>
}
