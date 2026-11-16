import { SkillPage, skillMetadata } from "@/components/kurztest/skill-page"

export const metadata = skillMetadata("telc-b1", "sprechen", "en")

export default function TelcB1SprechenPageEn() {
  return <SkillPage exam="telc-b1" skill="sprechen" locale="en" />
}
