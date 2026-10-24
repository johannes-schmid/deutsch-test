import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { VButton } from "@/components/design/kit"
import { Tile } from "@/components/design/variants/nachtzug-icons"
import { cn } from "@/lib/utils"

type Icon = React.ComponentProps<typeof Tile>["icon"]

/** One outcome on a paper card: icon tile, heading, one line, the next step. The heading is the page's h1. */
export function BillingPanel({ icon, tone, title, lead, children }: { icon: Icon; tone?: "glow" | "alert"; title: string; lead: React.ReactNode; children?: React.ReactNode }) {
  return (
    <section aria-live="polite" className="nz-paper mt-6 flex max-w-[640px] flex-col gap-5 rounded-[28px] p-6 sm:p-8">
      <span className={cn("w-fit rounded-2xl", tone === "glow" && "shadow-[0_0_0_6px_color-mix(in_srgb,var(--p-glow)_28%,transparent)]", tone === "alert" && "shadow-[0_0_0_6px_color-mix(in_srgb,var(--v-ink)_8%,transparent)]")}>
        <Tile icon={icon} />
      </span>
      <div className="flex flex-col gap-2">
        <h1 className="v-display text-[clamp(28px,3.6vw,40px)] leading-[1.08] text-balance">{title}</h1>
        <p className="max-w-[52ch] text-[16px] text-v-muted text-pretty sm:text-[17px]">{lead}</p>
      </div>
      {children}
    </section>
  )
}

export function NextButton({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <VButton kind="ink" size="lg" render={<Link href={href} />} nativeButton={false} className="w-full sm:w-fit">
      {children}
      <ArrowRight className="size-4 rtl:-scale-x-100" aria-hidden="true" />
    </VButton>
  )
}
