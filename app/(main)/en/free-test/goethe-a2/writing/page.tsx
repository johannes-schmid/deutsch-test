import { SkillPage, skillMetadata } from "@/components/kurztest/skill-page"

export const metadata = skillMetadata("goethe-a2", "schreiben", "en")

export default function GoetheA2SchreibenPageEn() {
  return <SkillPage exam="goethe-a2" skill="schreiben" locale="en" />
}
