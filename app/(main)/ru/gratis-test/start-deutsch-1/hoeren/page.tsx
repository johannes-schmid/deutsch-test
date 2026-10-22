import { SkillPage, skillMetadata } from "@/components/kurztest/skill-page"

export const metadata = skillMetadata("start-deutsch-1", "hoeren", "ru")

export default function StartDeutsch1HoerenPageRu() {
  return <SkillPage exam="start-deutsch-1" skill="hoeren" locale="ru" />
}
