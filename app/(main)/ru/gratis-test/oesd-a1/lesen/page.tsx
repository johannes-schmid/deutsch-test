import { SkillPage, skillMetadata } from "@/components/kurztest/skill-page"

export const metadata = skillMetadata("oesd-a1", "lesen", "ru")

export default function OesdA1LesenPageRu() {
  return <SkillPage exam="oesd-a1" skill="lesen" locale="ru" />
}
