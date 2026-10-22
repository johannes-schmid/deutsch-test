import { SiteFrame } from "@/components/design/site-frame"

export default function SiteLayoutRu({ children }: { children: React.ReactNode }) {
  return <SiteFrame locale="ru" contained>{children}</SiteFrame>
}
