import { ExamHub, examHubMetadata } from "@/components/kurztest/exam-hub"

export const metadata = examHubMetadata("goethe-a2", "uk")

export default function GoetheA2HubPageUk() {
  return <ExamHub exam="goethe-a2" locale="uk" />
}
