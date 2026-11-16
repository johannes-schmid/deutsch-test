import { ExamHub, examHubMetadata } from "@/components/kurztest/exam-hub"

export const metadata = examHubMetadata("oesd-a2", "en")

export default function OesdA2HubPageEn() {
  return <ExamHub exam="oesd-a2" locale="en" />
}
