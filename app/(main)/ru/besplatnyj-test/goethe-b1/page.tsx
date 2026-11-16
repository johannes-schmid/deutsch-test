import { ExamHub, examHubMetadata } from "@/components/kurztest/exam-hub"

export const metadata = examHubMetadata("goethe-b1", "ru")

export default function GoetheB1HubPageRu() {
  return <ExamHub exam="goethe-b1" locale="ru" />
}
