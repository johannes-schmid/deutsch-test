import { ExamHub, examHubMetadata } from "@/components/kurztest/exam-hub"

export const metadata = examHubMetadata("dtz", "ru")

export default function DtzHubPageRu() {
  return <ExamHub exam="dtz" locale="ru" />
}
