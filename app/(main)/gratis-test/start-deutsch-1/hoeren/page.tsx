import { SkillPage, skillMetadata } from "@/components/kurztest/skill-page"

export const metadata = skillMetadata("start-deutsch-1", "hoeren")

export default function StartDeutsch1HoerenPage() {
  return <SkillPage exam="start-deutsch-1" skill="hoeren" />
}
