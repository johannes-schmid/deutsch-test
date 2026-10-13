import { SkillPage, skillMetadata } from "@/components/kurztest/skill-page"

export const metadata = skillMetadata("oesd-a2", "lesen")

export default function OesdA2LesenPage() {
  return <SkillPage exam="oesd-a2" skill="lesen" />
}
