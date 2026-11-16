import { SkillPage, skillMetadata } from "@/components/kurztest/skill-page"

export const metadata = skillMetadata("oesd-a2", "lesen", "ru")

export default function OesdA2LesenPageRu() {
  return <SkillPage exam="oesd-a2" skill="lesen" locale="ru" />
}
