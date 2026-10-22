import { SkillPage, skillMetadata } from "@/components/kurztest/skill-page"

export const metadata = skillMetadata("dtz", "sprechen", "ru")

export default function DtzSprechenPageRu() {
  return <SkillPage exam="dtz" skill="sprechen" locale="ru" />
}
