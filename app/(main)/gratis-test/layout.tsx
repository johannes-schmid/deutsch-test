import { DesignShell } from "@/components/design/shell"
import { SiteFooter, SiteGlow, SiteNav } from "@/components/design/site-chrome"

/** Free-test pages are German only, so the language link is hidden. */
export default function GratisTestLayout({ children }: { children: React.ReactNode }) {
  return (
    <DesignShell id="nachtzug" lang="de">
      <div className="relative overflow-clip">
        <SiteGlow />
        <SiteNav locale="de" switchLang={false} />
        <main className="relative z-10">{children}</main>
      </div>
      <SiteFooter locale="de" />
    </DesignShell>
  )
}
