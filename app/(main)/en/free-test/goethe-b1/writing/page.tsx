import { SkillPage, skillMetadata } from "@/components/kurztest/skill-page"

export const metadata = skillMetadata("goethe-b1", "schreiben", "en")

export default function GoetheB1SchreibenPageEn() {
  return <SkillPage exam="goethe-b1" skill="schreiben" locale="en" />
}
