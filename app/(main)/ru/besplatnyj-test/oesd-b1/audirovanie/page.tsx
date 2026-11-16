import { SkillPage, skillMetadata } from "@/components/kurztest/skill-page"

export const metadata = skillMetadata("oesd-b1", "hoeren", "ru")

export default function OesdB1HoerenPageRu() {
  return <SkillPage exam="oesd-b1" skill="hoeren" locale="ru" />
}
