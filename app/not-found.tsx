import type { Metadata } from "next"
import Link from "next/link"
import { Host_Grotesk, Reddit_Mono } from "next/font/google"
import { ArrowRight, BookOpen, Euro, Home, PenLine } from "lucide-react"
import { VButton } from "@/components/design/kit"
import { DesignShell } from "@/components/design/shell"
import { SiteFooter, SiteGlow, SiteNav } from "@/components/design/site-chrome"
import "./(main)/landing.css"

const hostGrotesk = Host_Grotesk({ subsets: ["latin"], style: ["normal", "italic"], variable: "--font-host" })
const redditMono = Reddit_Mono({ subsets: ["latin"], variable: "--font-redditmono" })

export const metadata: Metadata = { title: "Seite nicht gefunden | deutschtest üben" }

const LINKS = [
  { label: "Gratis-Test starten", href: "/gratis-test", icon: PenLine },
  { label: "Blog", href: "/blog", icon: BookOpen },
  { label: "Preise", href: "/preise", icon: Euro },
]

export default function NotFound() {
  return (
    <div className={`${hostGrotesk.variable} ${redditMono.variable}`}>
      <DesignShell id="nachtzug" lang="de">
        <div className="relative overflow-clip">
          <SiteGlow />
          <SiteNav locale="de" switchLang={false} />
          <main className="v-container relative z-10 flex flex-col items-center gap-6 pt-20 pb-24 text-center sm:pt-28 sm:pb-32">
            <p className="v-display text-[clamp(96px,16vw,180px)] tabular-nums leading-none font-semibold tracking-[-0.06em]" aria-hidden="true">404</p>
            <h1 className="v-display text-[clamp(32px,4.4vw,56px)] leading-[1.06]">Seite nicht gefunden</h1>
            <p className="max-w-[44ch] text-lg text-v-muted">Diese Seite gibt es nicht oder nicht mehr. Hier geht es weiter.</p>
            <VButton size="lg" render={<Link href="/" />} nativeButton={false} className="mt-2 gap-2">
              <Home className="size-4" aria-hidden="true" />
              Zur Startseite
            </VButton>
            <ul className="mt-6 grid w-full max-w-3xl grid-cols-[minmax(0,1fr)] gap-3 sm:grid-cols-3">
              {LINKS.map(({ label, href, icon: Icon }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="nz-chrome group flex h-full items-center gap-3 rounded-[22px] p-3 pe-4 text-start text-[15px] font-semibold transition-transform duration-150 ease-out hover:-translate-y-0.5 active:scale-[0.98]"
                  >
                    <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-v-soft">
                      <Icon className="size-[18px]" strokeWidth={2} aria-hidden="true" />
                    </span>
                    <span className="flex-1">{label}</span>
                    <ArrowRight className="size-4 text-v-muted transition-transform duration-150 ease-out group-hover:translate-x-0.5 rtl:-scale-x-100" aria-hidden="true" />
                  </Link>
                </li>
              ))}
            </ul>
          </main>
        </div>
        <SiteFooter locale="de" />
      </DesignShell>
    </div>
  )
}
