import { SkillPage, skillMetadata } from "@/components/kurztest/skill-page"

export const metadata = skillMetadata("oesd-a1", "schreiben", "ru")

export default function OesdA1SchreibenPageRu() {
  return <SkillPage exam="oesd-a1" skill="schreiben" locale="ru" />
}
