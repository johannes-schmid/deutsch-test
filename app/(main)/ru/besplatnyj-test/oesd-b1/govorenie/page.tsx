import { SkillPage, skillMetadata } from "@/components/kurztest/skill-page"

export const metadata = skillMetadata("oesd-b1", "sprechen", "ru")

export default function OesdB1SprechenPageRu() {
  return <SkillPage exam="oesd-b1" skill="sprechen" locale="ru" />
}
