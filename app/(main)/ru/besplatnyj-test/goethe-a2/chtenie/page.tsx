import { SkillPage, skillMetadata } from "@/components/kurztest/skill-page"

export const metadata = skillMetadata("goethe-a2", "lesen", "ru")

export default function GoetheA2LesenPageRu() {
  return <SkillPage exam="goethe-a2" skill="lesen" locale="ru" />
}
