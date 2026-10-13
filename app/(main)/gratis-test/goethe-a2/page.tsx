import { ExamHub, examHubMetadata } from "@/components/kurztest/exam-hub"

export const metadata = examHubMetadata("goethe-a2")

export default function GoetheA2HubPage() {
  return <ExamHub exam="goethe-a2" />
}
