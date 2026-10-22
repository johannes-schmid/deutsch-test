import { SkillPage, skillMetadata } from "@/components/kurztest/skill-page"

export const metadata = skillMetadata("start-deutsch-1", "sprechen", "ru")

export default function StartDeutsch1SprechenPageRu() {
  return <SkillPage exam="start-deutsch-1" skill="sprechen" locale="ru" />
}
