import { SkillPage, skillMetadata } from "@/components/kurztest/skill-page"

export const metadata = skillMetadata("telc-a2", "lesen", "ru")

export default function TelcA2LesenPageRu() {
  return <SkillPage exam="telc-a2" skill="lesen" locale="ru" />
}
