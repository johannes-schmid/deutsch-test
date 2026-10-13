import { ExamHub, examHubMetadata } from "@/components/kurztest/exam-hub"

export const metadata = examHubMetadata("oesd-a2")

export default function OesdA2HubPage() {
  return <ExamHub exam="oesd-a2" />
}
