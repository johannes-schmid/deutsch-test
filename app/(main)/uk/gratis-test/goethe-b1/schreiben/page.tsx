import { SkillPage, skillMetadata } from "@/components/kurztest/skill-page"

export const metadata = skillMetadata("goethe-b1", "schreiben", "uk")

export default function GoetheB1SchreibenPageUk() {
  return <SkillPage exam="goethe-b1" skill="schreiben" locale="uk" />
}
