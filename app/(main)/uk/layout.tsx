import type { Metadata } from "next"

// Ukrainian stays live but out of Google for now (Hannes, 2026-11-16). Pages that set `robots` use robotsFor().
export const metadata: Metadata = { robots: { index: false, follow: true } }

export default function UkLayout({ children }: { children: React.ReactNode }) {
  return children
}
