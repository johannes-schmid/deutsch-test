import { SkillPage, skillMetadata } from "@/components/kurztest/skill-page"

export const metadata = skillMetadata("goethe-a2", "hoeren", "uk")

export default function GoetheA2HoerenPageUk() {
  return <SkillPage exam="goethe-a2" skill="hoeren" locale="uk" />
}
