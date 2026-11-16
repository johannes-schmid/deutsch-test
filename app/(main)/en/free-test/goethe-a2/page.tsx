import { ExamHub, examHubMetadata } from "@/components/kurztest/exam-hub"

export const metadata = examHubMetadata("goethe-a2", "en")

export default function GoetheA2HubPageEn() {
  return <ExamHub exam="goethe-a2" locale="en" />
}
