import { SkillPage, skillMetadata } from "@/components/kurztest/skill-page"

export const metadata = skillMetadata("oesd-a1", "schreiben")

export default function OesdA1SchreibenPage() {
  return <SkillPage exam="oesd-a1" skill="schreiben" />
}
