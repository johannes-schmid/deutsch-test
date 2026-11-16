import { SkillPage, skillMetadata } from "@/components/kurztest/skill-page"

export const metadata = skillMetadata("oesd-a1", "sprechen", "uk")

export default function OesdA1SprechenPageUk() {
  return <SkillPage exam="oesd-a1" skill="sprechen" locale="uk" />
}
