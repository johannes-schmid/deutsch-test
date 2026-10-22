import { SkillPage, skillMetadata } from "@/components/kurztest/skill-page"

export const metadata = skillMetadata("telc-b1", "hoeren", "ru")

export default function TelcB1HoerenPageRu() {
  return <SkillPage exam="telc-b1" skill="hoeren" locale="ru" />
}
