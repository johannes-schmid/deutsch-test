import { ExamHub, examHubMetadata } from "@/components/kurztest/exam-hub"

export const metadata = examHubMetadata("goethe-b1", "en")

export default function GoetheB1HubPageEn() {
  return <ExamHub exam="goethe-b1" locale="en" />
}
