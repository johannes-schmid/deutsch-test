import { ExamHub, examHubMetadata } from "@/components/kurztest/exam-hub"

export const metadata = examHubMetadata("goethe-a2", "ru")

export default function GoetheA2HubPageRu() {
  return <ExamHub exam="goethe-a2" locale="ru" />
}
