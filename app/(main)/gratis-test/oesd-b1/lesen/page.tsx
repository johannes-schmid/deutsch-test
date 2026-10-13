import { SkillPage, skillMetadata } from "@/components/kurztest/skill-page"

export const metadata = skillMetadata("oesd-b1", "lesen")

export default function OesdB1LesenPage() {
  return <SkillPage exam="oesd-b1" skill="lesen" />
}
