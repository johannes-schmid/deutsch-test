import { SkillPage, skillMetadata } from "@/components/kurztest/skill-page"

export const metadata = skillMetadata("telc-a2", "sprechen", "en")

export default function TelcA2SprechenPageEn() {
  return <SkillPage exam="telc-a2" skill="sprechen" locale="en" />
}
