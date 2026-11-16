import { SkillPage, skillMetadata } from "@/components/kurztest/skill-page"

export const metadata = skillMetadata("telc-a2", "sprechen", "ru")

export default function TelcA2SprechenPageRu() {
  return <SkillPage exam="telc-a2" skill="sprechen" locale="ru" />
}
