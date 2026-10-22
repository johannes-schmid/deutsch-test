import { SkillPage, skillMetadata } from "@/components/kurztest/skill-page"

export const metadata = skillMetadata("oesd-b1", "sprechen", "uk")

export default function OesdB1SprechenPageUk() {
  return <SkillPage exam="oesd-b1" skill="sprechen" locale="uk" />
}
