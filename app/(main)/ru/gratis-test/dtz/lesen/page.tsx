import { SkillPage, skillMetadata } from "@/components/kurztest/skill-page"

export const metadata = skillMetadata("dtz", "lesen", "ru")

export default function DtzLesenPageRu() {
  return <SkillPage exam="dtz" skill="lesen" locale="ru" />
}
