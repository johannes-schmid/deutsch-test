import { SkillPage, skillMetadata } from "@/components/kurztest/skill-page"

export const metadata = skillMetadata("goethe-b1", "lesen", "ru")

export default function GoetheB1LesenPageRu() {
  return <SkillPage exam="goethe-b1" skill="lesen" locale="ru" />
}
