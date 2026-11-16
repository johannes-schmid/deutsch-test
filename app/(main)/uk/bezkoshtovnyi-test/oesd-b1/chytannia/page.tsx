import { SkillPage, skillMetadata } from "@/components/kurztest/skill-page"

export const metadata = skillMetadata("oesd-b1", "lesen", "uk")

export default function OesdB1LesenPageUk() {
  return <SkillPage exam="oesd-b1" skill="lesen" locale="uk" />
}
