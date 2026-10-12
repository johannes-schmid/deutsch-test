import { ExamHub, examHubMetadata } from "@/components/kurztest/exam-hub"

export const metadata = examHubMetadata("dtz")

export default function DtzTestHubPage() {
  return <ExamHub exam="dtz" />
}
