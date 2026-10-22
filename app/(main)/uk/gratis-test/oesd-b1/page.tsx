import { ExamHub, examHubMetadata } from "@/components/kurztest/exam-hub"

export const metadata = examHubMetadata("oesd-b1", "uk")

export default function OesdB1HubPageUk() {
  return <ExamHub exam="oesd-b1" locale="uk" />
}
