import { SkillPage, skillMetadata } from "@/components/kurztest/skill-page"

export const metadata = skillMetadata("start-deutsch-1", "lesen")

export default function StartDeutsch1LesenPage() {
  return <SkillPage exam="start-deutsch-1" skill="lesen" />
}
