import { SkillPage, skillMetadata } from "@/components/kurztest/skill-page"

export const metadata = skillMetadata("telc-a2", "schreiben", "ru")

export default function TelcA2SchreibenPageRu() {
  return <SkillPage exam="telc-a2" skill="schreiben" locale="ru" />
}
