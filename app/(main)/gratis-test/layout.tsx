import { SiteFrame } from "@/components/design/site-frame"

/** German free-test pages; /uk and /ru mirror them in app/(main)/[lang]/gratis-test. */
export default function GratisTestLayout({ children }: { children: React.ReactNode }) {
  return <SiteFrame locale="de">{children}</SiteFrame>
}
