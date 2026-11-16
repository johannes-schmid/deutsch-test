import { SkillPage, skillMetadata } from "@/components/kurztest/skill-page"

export const metadata = skillMetadata("oesd-a1", "schreiben", "en")

export default function OesdA1SchreibenPageEn() {
  return <SkillPage exam="oesd-a1" skill="schreiben" locale="en" />
}
