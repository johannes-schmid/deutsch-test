import { DesignShell } from "@/components/design/shell"
import { SiteFooter, SiteGlow, SiteNav } from "@/components/design/site-chrome"
import type { SiteLocale } from "@/lib/i18n/locale"

/** The chrome around every inner page: glow, nav, footer. `contained` wraps text pages in the container. */
export function SiteFrame({ locale, contained, children }: { locale: SiteLocale; contained?: boolean; children: React.ReactNode }) {
  return (
    <DesignShell id="nachtzug" lang={locale}>
      <div className="relative overflow-clip">
        <SiteGlow />
        <SiteNav locale={locale} />
        <main className="relative z-10">{contained ? <div className="v-container pb-20">{children}</div> : children}</main>
      </div>
      <SiteFooter locale={locale} />
    </DesignShell>
  )
}
