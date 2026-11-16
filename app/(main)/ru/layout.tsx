import type { Metadata } from "next"

// Russian stays live but out of Google for now (Hannes, 2026-11-16). Pages that set `robots` use robotsFor().
export const metadata: Metadata = { robots: { index: false, follow: true } }

export default function RuLayout({ children }: { children: React.ReactNode }) {
  return children
}
