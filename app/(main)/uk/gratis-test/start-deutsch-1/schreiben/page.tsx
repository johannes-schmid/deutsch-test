import { SkillPage, skillMetadata } from "@/components/kurztest/skill-page"

export const metadata = skillMetadata("start-deutsch-1", "schreiben", "uk")

export default function StartDeutsch1SchreibenPageUk() {
  return <SkillPage exam="start-deutsch-1" skill="schreiben" locale="uk" />
}
