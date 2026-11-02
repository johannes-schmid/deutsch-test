import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { VButton } from "@/components/design/kit"
import { PORTAL_PASS } from "@/lib/auth/redirect"
import { SKILLS } from "@/lib/kurztest/data"
import { KURZTEST_COPY } from "@/lib/i18n/kurztest"
import { PORTAL_COPY } from "@/lib/i18n/portal"
import { ACTIVE_LAYOUT, PLANS, formatEuro } from "@/lib/pricing"

const T = PORTAL_COPY.banner

/** The one offer on the dashboard, between the exam and its parts, for learners without a pass. Prices from the active catalogue. */
export function PassBanner() {
  const skills = ACTIVE_LAYOUT === "skills"
  const one = PLANS.find((p) => p.grants.skills.length === 1)
  const featured = PLANS.find((p) => p.featured) ?? PLANS[0]
  const price = formatEuro(skills && one ? one.cents : featured.cents)
  return (
    <section aria-labelledby="pass-banner-h" className="nz-night grid grid-cols-[minmax(0,1fr)] gap-6 rounded-[24px] p-5 sm:p-7 md:grid-cols-[minmax(0,1fr)_auto] md:items-end md:gap-10">
      <div className="flex flex-col gap-3">
        <h2 id="pass-banner-h" className="text-[clamp(22px,2.6vw,30px)] leading-[1.12] font-medium tracking-[-0.03em] text-balance">
          {skills ? T.h : T.passH} <span className="text-white/55">{T.hMuted}</span>
        </h2>
        <p className="max-w-[52ch] text-[15px] leading-relaxed text-white/72 text-pretty">{skills ? T.lead : T.passLead}</p>
        <ul className="flex flex-wrap gap-x-4 gap-y-2 pt-1">
          {SKILLS.map((s) => (
            <li key={s} className="flex items-center gap-2 text-[13.5px] text-white/80">
              <span className="size-2 rounded-full" style={{ background: `var(--v-sk-${s})` }} aria-hidden="true" />
              {KURZTEST_COPY.names[s]}
            </li>
          ))}
        </ul>
      </div>
      <div className="flex flex-col gap-3 md:min-w-[240px]">
        <p className="flex items-baseline gap-2">
          <b className="v-display text-[40px] leading-none font-semibold tabular-nums">{price}</b>
          <span className="text-[14px] text-white/65">{skills ? T.perSkill : T.passPrice(featured.months)}</span>
        </p>
        {skills ? (
          <p className="flex flex-wrap items-center gap-2 text-[14px] text-white/80">
            {T.all(formatEuro(featured.cents))}
            <span className="rounded-full bg-(--p-glow) px-2.5 py-0.5 text-[12px] font-semibold text-[#0A0D18]">{T.oneFree}</span>
          </p>
        ) : null}
        <VButton kind="light" size="md" render={<Link href={PORTAL_PASS} data-cta="dashboard_pass_banner" />} nativeButton={false} className="mt-1 w-full gap-2 md:w-auto">
          {skills ? T.cta : T.passCta}
          <ArrowRight className="size-4 rtl:-scale-x-100" aria-hidden="true" />
        </VButton>
        <p className="text-[12.5px] text-white/55">{T.monthly}</p>
      </div>
    </section>
  )
}
