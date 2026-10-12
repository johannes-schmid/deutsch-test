import { Host_Grotesk, Reddit_Mono } from "next/font/google"
import "./landing.css"

const hostGrotesk = Host_Grotesk({ subsets: ["latin"], style: ["normal", "italic"], variable: "--font-host" })
const redditMono = Reddit_Mono({ subsets: ["latin"], variable: "--font-redditmono" })

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return <div className={`${hostGrotesk.variable} ${redditMono.variable}`}>{children}</div>
}
