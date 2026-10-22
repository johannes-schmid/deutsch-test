import { SkillPage, skillMetadata } from "@/components/kurztest/skill-page"

export const metadata = skillMetadata("dtz", "schreiben", "ru")

export default function DtzSchreibenPageRu() {
  return <SkillPage exam="dtz" skill="schreiben" locale="ru" />
}
