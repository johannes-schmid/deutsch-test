import { SkillPage, skillMetadata } from "@/components/kurztest/skill-page"

export const metadata = skillMetadata("oesd-b1", "schreiben")

export default function OesdB1SchreibenPage() {
  return <SkillPage exam="oesd-b1" skill="schreiben" />
}
