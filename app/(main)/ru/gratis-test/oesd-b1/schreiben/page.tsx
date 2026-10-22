import { SkillPage, skillMetadata } from "@/components/kurztest/skill-page"

export const metadata = skillMetadata("oesd-b1", "schreiben", "ru")

export default function OesdB1SchreibenPageRu() {
  return <SkillPage exam="oesd-b1" skill="schreiben" locale="ru" />
}
