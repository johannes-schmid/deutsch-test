import { SkillPage, skillMetadata } from "@/components/kurztest/skill-page"

export const metadata = skillMetadata("goethe-b1", "sprechen", "en")

export default function GoetheB1SprechenPageEn() {
  return <SkillPage exam="goethe-b1" skill="sprechen" locale="en" />
}
