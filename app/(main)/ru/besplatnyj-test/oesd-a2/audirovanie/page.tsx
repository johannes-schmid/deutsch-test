import { SkillPage, skillMetadata } from "@/components/kurztest/skill-page"

export const metadata = skillMetadata("oesd-a2", "hoeren", "ru")

export default function OesdA2HoerenPageRu() {
  return <SkillPage exam="oesd-a2" skill="hoeren" locale="ru" />
}
