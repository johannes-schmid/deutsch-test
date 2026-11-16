import { SkillPage, skillMetadata } from "@/components/kurztest/skill-page"

export const metadata = skillMetadata("oesd-a1", "hoeren", "ru")

export default function OesdA1HoerenPageRu() {
  return <SkillPage exam="oesd-a1" skill="hoeren" locale="ru" />
}
