import { SkillPage, skillMetadata } from "@/components/kurztest/skill-page"

export const metadata = skillMetadata("start-deutsch-1", "lesen", "ru")

export default function StartDeutsch1LesenPageRu() {
  return <SkillPage exam="start-deutsch-1" skill="lesen" locale="ru" />
}
