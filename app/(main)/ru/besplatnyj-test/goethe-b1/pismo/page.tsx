import { SkillPage, skillMetadata } from "@/components/kurztest/skill-page"

export const metadata = skillMetadata("goethe-b1", "schreiben", "ru")

export default function GoetheB1SchreibenPageRu() {
  return <SkillPage exam="goethe-b1" skill="schreiben" locale="ru" />
}
