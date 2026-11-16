import { SkillPage, skillMetadata } from "@/components/kurztest/skill-page"

export const metadata = skillMetadata("goethe-b1", "hoeren", "ru")

export default function GoetheB1HoerenPageRu() {
  return <SkillPage exam="goethe-b1" skill="hoeren" locale="ru" />
}
