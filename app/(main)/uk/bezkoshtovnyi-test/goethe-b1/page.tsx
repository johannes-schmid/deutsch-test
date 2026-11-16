import { ExamHub, examHubMetadata } from "@/components/kurztest/exam-hub"

export const metadata = examHubMetadata("goethe-b1", "uk")

export default function GoetheB1HubPageUk() {
  return <ExamHub exam="goethe-b1" locale="uk" />
}
