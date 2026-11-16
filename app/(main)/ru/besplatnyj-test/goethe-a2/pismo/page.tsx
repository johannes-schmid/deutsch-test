import { SkillPage, skillMetadata } from "@/components/kurztest/skill-page"

export const metadata = skillMetadata("goethe-a2", "schreiben", "ru")

export default function GoetheA2SchreibenPageRu() {
  return <SkillPage exam="goethe-a2" skill="schreiben" locale="ru" />
}
