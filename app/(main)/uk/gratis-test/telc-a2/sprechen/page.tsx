import { SkillPage, skillMetadata } from "@/components/kurztest/skill-page"

export const metadata = skillMetadata("telc-a2", "sprechen", "uk")

export default function TelcA2SprechenPageUk() {
  return <SkillPage exam="telc-a2" skill="sprechen" locale="uk" />
}
