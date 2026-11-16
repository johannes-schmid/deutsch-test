import { SkillPage, skillMetadata } from "@/components/kurztest/skill-page"

export const metadata = skillMetadata("oesd-a2", "sprechen", "en")

export default function OesdA2SprechenPageEn() {
  return <SkillPage exam="oesd-a2" skill="sprechen" locale="en" />
}
