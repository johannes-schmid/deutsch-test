import { SkillPage, skillMetadata } from "@/components/kurztest/skill-page"

export const metadata = skillMetadata("oesd-b1", "lesen", "ru")

export default function OesdB1LesenPageRu() {
  return <SkillPage exam="oesd-b1" skill="lesen" locale="ru" />
}
