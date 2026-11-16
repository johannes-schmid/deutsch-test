import { SkillPage, skillMetadata } from "@/components/kurztest/skill-page"

export const metadata = skillMetadata("goethe-a2", "sprechen", "ru")

export default function GoetheA2SprechenPageRu() {
  return <SkillPage exam="goethe-a2" skill="sprechen" locale="ru" />
}
