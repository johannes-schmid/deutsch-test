import { SkillPage, skillMetadata } from "@/components/kurztest/skill-page"

export const metadata = skillMetadata("telc-b1", "sprechen", "ru")

export default function TelcB1SprechenPageRu() {
  return <SkillPage exam="telc-b1" skill="sprechen" locale="ru" />
}
