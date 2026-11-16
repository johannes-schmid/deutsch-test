import { ExamHub, examHubMetadata } from "@/components/kurztest/exam-hub"

export const metadata = examHubMetadata("oesd-a1", "en")

export default function OesdA1HubPageEn() {
  return <ExamHub exam="oesd-a1" locale="en" />
}
