import { SkillPage, skillMetadata } from "@/components/kurztest/skill-page"

export const metadata = skillMetadata("start-deutsch-1", "sprechen", "en")

export default function StartDeutsch1SprechenPageEn() {
  return <SkillPage exam="start-deutsch-1" skill="sprechen" locale="en" />
}
