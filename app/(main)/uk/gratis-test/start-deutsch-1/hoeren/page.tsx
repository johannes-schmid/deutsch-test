import { SkillPage, skillMetadata } from "@/components/kurztest/skill-page"

export const metadata = skillMetadata("start-deutsch-1", "hoeren", "uk")

export default function StartDeutsch1HoerenPageUk() {
  return <SkillPage exam="start-deutsch-1" skill="hoeren" locale="uk" />
}
