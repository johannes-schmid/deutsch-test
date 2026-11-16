import { SkillPage, skillMetadata } from "@/components/kurztest/skill-page"

export const metadata = skillMetadata("goethe-a2", "schreiben", "uk")

export default function GoetheA2SchreibenPageUk() {
  return <SkillPage exam="goethe-a2" skill="schreiben" locale="uk" />
}
