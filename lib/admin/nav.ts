import { FileSearch, Filter, LayoutGrid, ListChecks, Mail, type LucideIcon } from "lucide-react"
import { EXAM_IDS, EXAMS, type ExamId } from "@/lib/exams"

// The admin navigation in one place: the desktop sidebar and the mobile drawer both render it, so they can't drift.

export type AdminNavChild = { href: string; level: string; label: string }
export type AdminNavItem = {
  href: string
  label: string
  icon: LucideIcon
  /** Lit on the routes below it too (detail pages). The overview is lit only on itself. */
  nested?: boolean
  children?: AdminNavChild[]
}
export type AdminNavSection = { title: string | null; items: AdminNavItem[] }

export const ADMIN_HOME = "/admin"

/** DTZ first (the core product), then the other exams from A1 up. */
export const ADMIN_EXAMS: ExamId[] = ["dtz", ...EXAM_IDS.filter((e) => e !== "dtz")]

export const modelltestPath = (exam?: ExamId, skill?: string, n?: number) =>
  ["/admin/modelltests", exam, skill, n].filter((p) => p !== undefined).join("/")

export const ADMIN_NAV: AdminNavSection[] = [
  { title: null, items: [{ href: ADMIN_HOME, label: "Übersicht", icon: LayoutGrid }] },
  {
    title: "Inhalte",
    items: [
      {
        href: modelltestPath(),
        label: "Modelltests",
        icon: ListChecks,
        nested: true,
        children: ADMIN_EXAMS.map((e) => ({ href: modelltestPath(e), level: EXAMS[e].levels.join("–"), label: EXAMS[e].short ?? EXAMS[e].name })),
      },
      { href: "/design/kurztest", label: "Gratis-Test-Inhalte", icon: FileSearch },
    ],
  },
  {
    title: "Gratis-Test",
    items: [
      { href: "/admin/kurztest", label: "Funnel", icon: Filter },
      { href: "/admin/kurztest/emails", label: "E-Mails", icon: Mail },
    ],
  },
]
