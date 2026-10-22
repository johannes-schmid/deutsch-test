import { DesignShell } from "./shell"
import { Nachtzug } from "./variants/nachtzug"
import type { Locale } from "@/lib/i18n/locale"

export function VariantPage({ locale }: { locale: Locale }) {
  return (
    <DesignShell id="nachtzug" lang={locale}>
      <Nachtzug locale={locale} />
    </DesignShell>
  )
}
