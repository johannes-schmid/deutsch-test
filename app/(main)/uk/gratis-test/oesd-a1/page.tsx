import { ExamHub, examHubMetadata } from "@/components/kurztest/exam-hub"

export const metadata = examHubMetadata("oesd-a1", "uk")

export default function OesdA1HubPageUk() {
  return <ExamHub exam="oesd-a1" locale="uk" />
}
