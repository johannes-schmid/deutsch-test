import { SkillPage, skillMetadata } from "@/components/kurztest/skill-page"

export const metadata = skillMetadata("oesd-a2", "schreiben", "ru")

export default function OesdA2SchreibenPageRu() {
  return <SkillPage exam="oesd-a2" skill="schreiben" locale="ru" />
}
