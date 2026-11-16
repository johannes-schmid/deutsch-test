import { SkillPage, skillMetadata } from "@/components/kurztest/skill-page"

export const metadata = skillMetadata("start-deutsch-1", "schreiben", "en")

export default function StartDeutsch1SchreibenPageEn() {
  return <SkillPage exam="start-deutsch-1" skill="schreiben" locale="en" />
}
