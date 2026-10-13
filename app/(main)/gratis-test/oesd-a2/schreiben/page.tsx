import { SkillPage, skillMetadata } from "@/components/kurztest/skill-page"

export const metadata = skillMetadata("oesd-a2", "schreiben")

export default function OesdA2SchreibenPage() {
  return <SkillPage exam="oesd-a2" skill="schreiben" />
}
