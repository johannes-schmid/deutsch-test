import { SkillPage, skillMetadata } from "@/components/kurztest/skill-page"

export const metadata = skillMetadata("oesd-b1", "schreiben", "uk")

export default function OesdB1SchreibenPageUk() {
  return <SkillPage exam="oesd-b1" skill="schreiben" locale="uk" />
}
