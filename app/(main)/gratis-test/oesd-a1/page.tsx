import { ExamHub, examHubMetadata } from "@/components/kurztest/exam-hub"

export const metadata = examHubMetadata("oesd-a1")

export default function OesdA1HubPage() {
  return <ExamHub exam="oesd-a1" />
}
