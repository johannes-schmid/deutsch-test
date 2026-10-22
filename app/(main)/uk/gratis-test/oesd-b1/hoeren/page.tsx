import { SkillPage, skillMetadata } from "@/components/kurztest/skill-page"

export const metadata = skillMetadata("oesd-b1", "hoeren", "uk")

export default function OesdB1HoerenPageUk() {
  return <SkillPage exam="oesd-b1" skill="hoeren" locale="uk" />
}
