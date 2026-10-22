import { SiteFrame } from "@/components/design/site-frame"

export default function SiteLayoutUk({ children }: { children: React.ReactNode }) {
  return <SiteFrame locale="uk" contained>{children}</SiteFrame>
}
