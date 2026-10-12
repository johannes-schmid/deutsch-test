import { DesignShell } from "@/components/design/shell"
import { SiteFooter, SiteGlow, SiteNav } from "@/components/design/site-chrome"

/** German-only text pages (DTZ, Preise, landings, legal): the same chrome as /gratis-test. */
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <DesignShell id="nachtzug" lang="de">
      <div className="relative overflow-clip">
        <SiteGlow />
        <SiteNav locale="de" switchLang={false} />
        <main className="relative z-10">
          <div className="v-container pb-20">{children}</div>
        </main>
      </div>
      <SiteFooter locale="de" />
    </DesignShell>
  )
}
