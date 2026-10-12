import type { Metadata } from "next"
import { Host_Grotesk, Reddit_Mono } from "next/font/google"
import "./design.css"

const hostGrotesk = Host_Grotesk({ subsets: ["latin"], style: ["normal", "italic"], variable: "--font-host" })
const redditMono = Reddit_Mono({ subsets: ["latin"], variable: "--font-redditmono" })

export const metadata: Metadata = {
  title: "Designsystem · deutschtest-ueben.de",
  robots: { index: false, follow: false },
}

export default function DesignLayout({ children }: LayoutProps<"/design">) {
  return (
    <div
      className={[hostGrotesk, redditMono].map((f) => f.variable).join(" ")}
    >
      {children}
    </div>
  )
}
