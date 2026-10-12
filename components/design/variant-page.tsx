import { DesignShell } from "./shell"
import { DesignSystem } from "./design-system"
import { Nachtzug } from "./variants/nachtzug"
import { NachtzugElements } from "./variants/nachtzug-icons"
import { NachtzugLogos } from "./variants/nachtzug-logo"
import { getVariant, type VariantId } from "@/lib/design/variants"

export function VariantPage({ id }: { id: VariantId }) {
  return (
    <DesignShell id={id}>
      <Nachtzug />
      <DesignSystem variant={getVariant(id)} extra={<div className="flex flex-col gap-10"><NachtzugLogos /><NachtzugElements /></div>} />
    </DesignShell>
  )
}
