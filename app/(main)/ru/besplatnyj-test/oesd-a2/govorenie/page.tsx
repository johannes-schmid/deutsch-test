import { SkillPage, skillMetadata } from "@/components/kurztest/skill-page"

export const metadata = skillMetadata("oesd-a2", "sprechen", "ru")

export default function OesdA2SprechenPageRu() {
  return <SkillPage exam="oesd-a2" skill="sprechen" locale="ru" />
}
