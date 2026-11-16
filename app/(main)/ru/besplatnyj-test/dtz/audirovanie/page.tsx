import { SkillPage, skillMetadata } from "@/components/kurztest/skill-page"

export const metadata = skillMetadata("dtz", "hoeren", "ru")

export default function DtzHoerenPageRu() {
  return <SkillPage exam="dtz" skill="hoeren" locale="ru" />
}
