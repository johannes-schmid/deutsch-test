import { ExamHub, examHubMetadata } from "@/components/kurztest/exam-hub"

export const metadata = examHubMetadata("goethe-b1")

export default function GoetheB1HubPage() {
  return <ExamHub exam="goethe-b1" />
}
