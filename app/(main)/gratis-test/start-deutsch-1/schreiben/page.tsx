import { SkillPage, skillMetadata } from "@/components/kurztest/skill-page"

export const metadata = skillMetadata("start-deutsch-1", "schreiben")

export default function StartDeutsch1SchreibenPage() {
  return <SkillPage exam="start-deutsch-1" skill="schreiben" />
}
