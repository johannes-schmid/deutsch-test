import { SkillPage, skillMetadata } from "@/components/kurztest/skill-page"

export const metadata = skillMetadata("start-deutsch-1", "sprechen")

export default function StartDeutsch1SprechenPage() {
  return <SkillPage exam="start-deutsch-1" skill="sprechen" />
}
