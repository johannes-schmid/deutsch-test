import { SkillPage, skillMetadata } from "@/components/kurztest/skill-page"

export const metadata = skillMetadata("telc-a2", "hoeren", "ru")

export default function TelcA2HoerenPageRu() {
  return <SkillPage exam="telc-a2" skill="hoeren" locale="ru" />
}
