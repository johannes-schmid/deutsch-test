import { SkillPage, skillMetadata } from "@/components/kurztest/skill-page"

export const metadata = skillMetadata("goethe-a2", "sprechen", "uk")

export default function GoetheA2SprechenPageUk() {
  return <SkillPage exam="goethe-a2" skill="sprechen" locale="uk" />
}
