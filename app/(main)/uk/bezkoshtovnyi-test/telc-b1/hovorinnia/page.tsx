import { SkillPage, skillMetadata } from "@/components/kurztest/skill-page"

export const metadata = skillMetadata("telc-b1", "sprechen", "uk")

export default function TelcB1SprechenPageUk() {
  return <SkillPage exam="telc-b1" skill="sprechen" locale="uk" />
}
