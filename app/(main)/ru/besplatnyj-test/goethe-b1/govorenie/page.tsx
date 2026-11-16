import { SkillPage, skillMetadata } from "@/components/kurztest/skill-page"

export const metadata = skillMetadata("goethe-b1", "sprechen", "ru")

export default function GoetheB1SprechenPageRu() {
  return <SkillPage exam="goethe-b1" skill="sprechen" locale="ru" />
}
