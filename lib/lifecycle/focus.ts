import { EXAM_IDS, type ExamId } from "@/lib/exams"

const SCOPES = new Set(["gratis-test", "dashboard"])

/**
 * The exam a sign-up came from, read from the path it returns to: a free test (/gratis-test/<exam>/…, also under
 * /uk or /ru) or the portal page the free-test result links to (/dashboard/<exam>/…). Null when the path names none.
 */
export function examFromPath(path: string | null | undefined): ExamId | null {
  if (!path) return null
  const parts = path.split(/[?#]/)[0].split("/").filter(Boolean)
  const i = /^[a-z]{2}$/.test(parts[0] ?? "") ? 1 : 0
  if (!SCOPES.has(parts[i] ?? "")) return null
  const id = parts[i + 1]
  return (EXAM_IDS as readonly string[]).includes(id ?? "") ? (id as ExamId) : null
}
