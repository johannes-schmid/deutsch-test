import { SiteFrame } from "@/components/design/site-frame"

/** German text pages (DTZ, Preise, landings, legal); /uk and /ru mirror them in app/(main)/[lang]/(site). */
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return <SiteFrame locale="de" contained>{children}</SiteFrame>
}
