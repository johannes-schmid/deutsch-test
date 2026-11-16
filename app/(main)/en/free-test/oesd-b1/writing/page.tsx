import { SkillPage, skillMetadata } from "@/components/kurztest/skill-page"

export const metadata = skillMetadata("oesd-b1", "schreiben", "en")

export default function OesdB1SchreibenPageEn() {
  return <SkillPage exam="oesd-b1" skill="schreiben" locale="en" />
}
