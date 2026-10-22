import { SkillPage, skillMetadata } from "@/components/kurztest/skill-page"

export const metadata = skillMetadata("telc-b1", "lesen", "ru")

export default function TelcB1LesenPageRu() {
  return <SkillPage exam="telc-b1" skill="lesen" locale="ru" />
}
