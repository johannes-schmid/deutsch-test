import { ExamHub, examHubMetadata } from "@/components/kurztest/exam-hub"

export const metadata = examHubMetadata("dtz", "uk")

export default function DtzHubPageUk() {
  return <ExamHub exam="dtz" locale="uk" />
}
