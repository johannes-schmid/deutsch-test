import { SkillPage, skillMetadata } from "@/components/kurztest/skill-page"

export const metadata = skillMetadata("start-deutsch-1", "lesen", "uk")

export default function StartDeutsch1LesenPageUk() {
  return <SkillPage exam="start-deutsch-1" skill="lesen" locale="uk" />
}
