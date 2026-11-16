import { SkillPage, skillMetadata } from "@/components/kurztest/skill-page"

export const metadata = skillMetadata("oesd-a1", "schreiben", "uk")

export default function OesdA1SchreibenPageUk() {
  return <SkillPage exam="oesd-a1" skill="schreiben" locale="uk" />
}
