import { SkillPage, skillMetadata } from "@/components/kurztest/skill-page"

export const metadata = skillMetadata("oesd-a1", "lesen")

export default function OesdA1LesenPage() {
  return <SkillPage exam="oesd-a1" skill="lesen" />
}
