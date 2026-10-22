import { SkillPage, skillMetadata } from "@/components/kurztest/skill-page"

export const metadata = skillMetadata("oesd-a2", "sprechen", "uk")

export default function OesdA2SprechenPageUk() {
  return <SkillPage exam="oesd-a2" skill="sprechen" locale="uk" />
}
