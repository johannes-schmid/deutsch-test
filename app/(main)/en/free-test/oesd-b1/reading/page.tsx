import { SkillPage, skillMetadata } from "@/components/kurztest/skill-page"

export const metadata = skillMetadata("oesd-b1", "lesen", "en")

export default function OesdB1LesenPageEn() {
  return <SkillPage exam="oesd-b1" skill="lesen" locale="en" />
}
