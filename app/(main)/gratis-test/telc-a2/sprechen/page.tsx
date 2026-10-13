import { SkillPage, skillMetadata } from "@/components/kurztest/skill-page"

export const metadata = skillMetadata("telc-a2", "sprechen")

export default function TelcA2SprechenPage() {
  return <SkillPage exam="telc-a2" skill="sprechen" />
}
