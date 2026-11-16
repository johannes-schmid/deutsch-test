import { SkillPage, skillMetadata } from "@/components/kurztest/skill-page"

export const metadata = skillMetadata("oesd-b1", "hoeren", "en")

export default function OesdB1HoerenPageEn() {
  return <SkillPage exam="oesd-b1" skill="hoeren" locale="en" />
}
