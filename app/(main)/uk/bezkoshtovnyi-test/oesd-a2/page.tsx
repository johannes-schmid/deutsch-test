import { ExamHub, examHubMetadata } from "@/components/kurztest/exam-hub"

export const metadata = examHubMetadata("oesd-a2", "uk")

export default function OesdA2HubPageUk() {
  return <ExamHub exam="oesd-a2" locale="uk" />
}
