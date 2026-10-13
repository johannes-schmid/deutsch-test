import { SkillPage, skillMetadata } from "@/components/kurztest/skill-page"

export const metadata = skillMetadata("oesd-b1", "hoeren")

export default function OesdB1HoerenPage() {
  return <SkillPage exam="oesd-b1" skill="hoeren" />
}
