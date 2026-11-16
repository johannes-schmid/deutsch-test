import { SkillPage, skillMetadata } from "@/components/kurztest/skill-page"

export const metadata = skillMetadata("start-deutsch-1", "sprechen", "uk")

export default function StartDeutsch1SprechenPageUk() {
  return <SkillPage exam="start-deutsch-1" skill="sprechen" locale="uk" />
}
