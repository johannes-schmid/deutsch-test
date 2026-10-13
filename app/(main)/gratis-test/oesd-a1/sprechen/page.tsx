import { SkillPage, skillMetadata } from "@/components/kurztest/skill-page"

export const metadata = skillMetadata("oesd-a1", "sprechen")

export default function OesdA1SprechenPage() {
  return <SkillPage exam="oesd-a1" skill="sprechen" />
}
