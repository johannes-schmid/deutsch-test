import { SkillPage, skillMetadata } from "@/components/kurztest/skill-page"

export const metadata = skillMetadata("goethe-a2", "hoeren", "ru")

export default function GoetheA2HoerenPageRu() {
  return <SkillPage exam="goethe-a2" skill="hoeren" locale="ru" />
}
