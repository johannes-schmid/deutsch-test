import { SkillPage, skillMetadata } from "@/components/kurztest/skill-page"

export const metadata = skillMetadata("oesd-a2", "sprechen")

export default function OesdA2SprechenPage() {
  return <SkillPage exam="oesd-a2" skill="sprechen" />
}
