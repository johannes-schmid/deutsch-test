import { SkillPage, skillMetadata } from "@/components/kurztest/skill-page"

export const metadata = skillMetadata("oesd-a2", "hoeren")

export default function OesdA2HoerenPage() {
  return <SkillPage exam="oesd-a2" skill="hoeren" />
}
