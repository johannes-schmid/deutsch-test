import { SkillPage, skillMetadata } from "@/components/kurztest/skill-page"

export const metadata = skillMetadata("oesd-a1", "sprechen", "ru")

export default function OesdA1SprechenPageRu() {
  return <SkillPage exam="oesd-a1" skill="sprechen" locale="ru" />
}
