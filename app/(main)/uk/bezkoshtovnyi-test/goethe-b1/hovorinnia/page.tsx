import { SkillPage, skillMetadata } from "@/components/kurztest/skill-page"

export const metadata = skillMetadata("goethe-b1", "sprechen", "uk")

export default function GoetheB1SprechenPageUk() {
  return <SkillPage exam="goethe-b1" skill="sprechen" locale="uk" />
}
