import { SkillPage, skillMetadata } from "@/components/kurztest/skill-page"

export const metadata = skillMetadata("oesd-b1", "sprechen")

export default function OesdB1SprechenPage() {
  return <SkillPage exam="oesd-b1" skill="sprechen" />
}
