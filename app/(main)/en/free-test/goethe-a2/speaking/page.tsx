import { SkillPage, skillMetadata } from "@/components/kurztest/skill-page"

export const metadata = skillMetadata("goethe-a2", "sprechen", "en")

export default function GoetheA2SprechenPageEn() {
  return <SkillPage exam="goethe-a2" skill="sprechen" locale="en" />
}
