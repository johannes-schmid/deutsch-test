import { ExamHub, examHubMetadata } from "@/components/kurztest/exam-hub"

export const metadata = examHubMetadata("oesd-b1")

export default function OesdB1HubPage() {
  return <ExamHub exam="oesd-b1" />
}
