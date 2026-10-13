import { SkillPage, skillMetadata } from "@/components/kurztest/skill-page"

export const metadata = skillMetadata("telc-b1", "sprechen")

export default function TelcB1SprechenPage() {
  return <SkillPage exam="telc-b1" skill="sprechen" />
}
