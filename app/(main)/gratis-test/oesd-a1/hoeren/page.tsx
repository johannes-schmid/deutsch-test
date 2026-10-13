import { SkillPage, skillMetadata } from "@/components/kurztest/skill-page"

export const metadata = skillMetadata("oesd-a1", "hoeren")

export default function OesdA1HoerenPage() {
  return <SkillPage exam="oesd-a1" skill="hoeren" />
}
