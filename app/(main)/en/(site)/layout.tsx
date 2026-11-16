import { SiteFrame } from "@/components/design/site-frame"

export default function SiteLayoutEn({ children }: { children: React.ReactNode }) {
  return <SiteFrame locale="en" contained>{children}</SiteFrame>
}
