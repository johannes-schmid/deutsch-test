import { SkillPage, skillMetadata } from "@/components/kurztest/skill-page"

export const metadata = skillMetadata("oesd-b1", "sprechen", "en")

export default function OesdB1SprechenPageEn() {
  return <SkillPage exam="oesd-b1" skill="sprechen" locale="en" />
}
