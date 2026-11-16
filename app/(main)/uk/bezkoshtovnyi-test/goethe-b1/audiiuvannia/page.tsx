import { SkillPage, skillMetadata } from "@/components/kurztest/skill-page"

export const metadata = skillMetadata("goethe-b1", "hoeren", "uk")

export default function GoetheB1HoerenPageUk() {
  return <SkillPage exam="goethe-b1" skill="hoeren" locale="uk" />
}
