import { SkillPage, skillMetadata } from "@/components/kurztest/skill-page"

export const metadata = skillMetadata("start-deutsch-1", "schreiben", "ru")

export default function StartDeutsch1SchreibenPageRu() {
  return <SkillPage exam="start-deutsch-1" skill="schreiben" locale="ru" />
}
