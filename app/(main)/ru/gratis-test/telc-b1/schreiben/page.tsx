import { SkillPage, skillMetadata } from "@/components/kurztest/skill-page"

export const metadata = skillMetadata("telc-b1", "schreiben", "ru")

export default function TelcB1SchreibenPageRu() {
  return <SkillPage exam="telc-b1" skill="schreiben" locale="ru" />
}
