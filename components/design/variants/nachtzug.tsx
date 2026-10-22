import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import Link from "next/link"
import { FORMAT_STAND } from "@/lib/design/content"
import { PLANS, formatEuro } from "@/lib/pricing"
import { LANDING, type LandingCopy } from "@/lib/i18n/landing"
import { LOCALE_NAMES, NUMBER_LOCALE, lp, siteLocale, type Locale } from "@/lib/i18n/locale"
import { Check, Clock as ClockIcon, Headphones, Lock } from "lucide-react"
import { LevelScale, Photo, PhotoCard, VButton } from "../kit"
import { PlatformDemo } from "./nachtzug-demo"
import { ExamMark, ExamTicket, LevelPath, LevelSeal, MetaChip, PromiseArt, TestCard } from "./nachtzug-icons"
import { SiteFooter, SiteGlow, SiteNav } from "../site-chrome"
import { examPath, type Brand, type ExamId } from "@/lib/exams"
import { EXAM_PAGES } from "@/lib/i18n/kurztest"
import { liveSkills } from "@/lib/kurztest/data"

/** One card per exam family; the level tags link to each exam's free tests once they have reviewed content. */
const HOME_EXAMS: { brand: Exclude<Brand, "sd1">; photo: string; main: ExamId; levels: [string, ExamId][] }[] = [
  { brand: "dtz", photo: "--g-photo-5", main: "dtz", levels: [["A2–B1", "dtz"]] },
  { brand: "goethe", photo: "--g-photo-2", main: "goethe-b1", levels: [["A2", "goethe-a2"], ["B1", "goethe-b1"]] },
  { brand: "telc", photo: "--g-photo-6", main: "telc-b1", levels: [["A2", "telc-a2"], ["B1", "telc-b1"]] },
  { brand: "oesd", photo: "--g-photo-4", main: "oesd-b1", levels: [["A1", "oesd-a1"], ["A2", "oesd-a2"], ["B1", "oesd-b1"]] },
]
const LANG_STRIP: Locale[] = ["de", "en", "uk", "ru"]
const isLive = (id: ExamId) => !!EXAM_PAGES[id] && liveSkills(id).length > 0

function ExamsSection({ t, locale }: { t: LandingCopy; locale: Locale }) {
  const at = (id: ExamId) => lp(siteLocale(locale), examPath(id))
  const x = t.examsSection
  return (
    <section className="py-24 sm:py-32">
      <div className="v-container flex flex-col gap-12">
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-4 text-center">
          <h2 className="v-h2 text-[clamp(32px,4.4vw,56px)]">
            {x.h2} <span className="text-v-muted">{x.h2muted}</span>
          </h2>
          <p className="max-w-[52ch] text-lg text-v-muted">{x.lead}</p>
        </div>
        <ul className="grid grid-cols-[minmax(0,1fr)] gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {HOME_EXAMS.map((e) => {
            const c = x.cards[e.brand]
            const live = isLive(e.main)
            return (
              <li key={e.brand}>
                <PhotoCard
                  token={e.photo}
                  art={<ExamMark brand={e.brand} size="lg" />}
                  chip={live ? x.live : undefined}
                  tags={e.levels.map(([label, id]) =>
                    isLive(id) ? (
                      <Link key={id} href={at(id)} className="rounded underline decoration-v-ink/30 decoration-[1.5px] underline-offset-4 transition-colors hover:decoration-v-ink">{label}</Link>
                    ) : (
                      <span key={id} className="text-v-muted">{label}</span>
                    )
                  )}
                  title={c.title}
                  text={c.text}
                  cta={x.cta}
                  href={live ? at(e.main) : null}
                  headClassName="sm:min-h-40"
                />
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}

const WEEK = [{ done: true }, { done: true }, { done: false }, { done: true }, { today: true }]

function Pill({ initial, color, title, text, className }: { initial: string; color: string; title: string; text: string; className?: string }) {
  return (
    <div className={`nz-app flex items-center gap-3 rounded-full p-2 pr-5 ${className ?? ""}`}>
      <span className="grid size-10 shrink-0 place-items-center rounded-full text-[15px] font-semibold text-[#070A12]" style={{ background: color }}>
        {initial}
      </span>
      <span className="flex min-w-0 flex-col text-[13.5px] leading-snug">
        <b className="font-semibold">{title}</b>
        <span className="text-v-muted">{text}</span>
      </span>
    </div>
  )
}

function HeroScene({ t }: { t: LandingCopy }) {
  const ph = t.hero.phone
  return (
    <div className="relative mx-auto aspect-[4/5] w-full max-w-[460px]">
      <span className="nz-halo" aria-hidden="true" />
      <div className="absolute inset-0 flex items-center justify-center p-6">
        <div className="nz-app relative flex w-[min(280px,78%)] flex-col rounded-[40px] p-3">
          <span className="mx-auto mt-1 mb-4 h-6 w-24 rounded-full bg-v-ink/85" aria-hidden="true" />
          <div className="flex flex-col items-center gap-0.5 pb-6">
            <span className="text-[13px] text-v-muted">{ph.label}</span>
            <span className="v-display text-[56px] leading-none font-medium tracking-[-0.05em] whitespace-nowrap">{ph.big}</span>
          </div>
          <div className="flex flex-col gap-2 pb-2">
            <div className="flex items-center gap-3 rounded-[22px] border border-v-line bg-v-surface p-3">
              <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-(--p-glow) text-[#070A12]">
                <Headphones className="size-4" aria-hidden="true" />
              </span>
              <span className="min-w-0 text-[12.5px] leading-snug">
                <b className="font-semibold">{ph.card1Title}</b>
                <span className="block text-v-muted">{ph.card1Text}</span>
              </span>
            </div>
            <div className="flex items-center gap-3 rounded-[22px] border border-v-line bg-v-surface p-3">
              <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-v-soft">
                <Check className="size-4" strokeWidth={2.5} aria-hidden="true" />
              </span>
              <span className="min-w-0 text-[12.5px] leading-snug">
                <b className="font-semibold">{ph.card2Title}</b>
                <span className="block text-v-muted">{ph.card2Text}</span>
              </span>
            </div>
          </div>
        </div>
      </div>
      <Pill
        initial="2"
        color="var(--p-glow)"
        title={ph.pillTitle}
        text={ph.pillText}
        className="absolute bottom-[12%] left-1/2 w-max max-w-[92%] -translate-x-1/2 lg:left-0 lg:translate-x-0"
      />
    </div>
  )
}

function PanelMock({ kind, t }: { kind: "dashboard" | "player" | "result"; t: LandingCopy }) {
  if (kind === "dashboard")
    return (
      <div className="nz-app flex w-full max-w-sm flex-col gap-4 rounded-2xl p-5">
        <div className="flex items-baseline justify-between">
          <b className="text-[16px] font-semibold">{t.dashboard.hello}</b>
          <span className="font-[family-name:var(--v-font-mono)] text-[11px] text-v-muted">{t.dashboard.examIn}</span>
        </div>
        <div className="flex justify-between">
          {WEEK.map((w, i) => (
            <span key={i} className="flex flex-col items-center gap-1.5 text-[11px] text-v-muted">
              <span
                className={`grid size-8 place-items-center rounded-full ${w.done ? "bg-(--p-glow) text-[#070A12]" : w.today ? "border border-dashed border-v-ink/40" : "bg-v-soft"}`}
              >
                {w.done ? <Check className="size-3.5" strokeWidth={3} aria-hidden="true" /> : null}
              </span>
              {t.dashboard.days[i]}
            </span>
          ))}
        </div>
        <div className="flex items-center gap-3 rounded-full border border-v-line bg-v-surface p-2 pr-4">
          <span className="grid size-10 shrink-0 place-items-center rounded-full bg-[#E58FB5] text-[15px] font-semibold text-[#070A12]">D</span>
          <span className="flex min-w-0 flex-col text-[13.5px] leading-snug">
            <b className="font-semibold">{t.dashboard.pillTitle}</b>
            <span className="text-v-muted">{t.dashboard.pillText}</span>
          </span>
        </div>
      </div>
    )
  if (kind === "player")
    return (
      <div className="nz-app flex w-full max-w-sm flex-col gap-4 rounded-2xl p-5">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-2 text-[14px] font-semibold">
            <Headphones className="size-4" aria-hidden="true" />
            {t.player.title}
          </span>
          <span className="v-num rounded-full bg-v-soft px-2.5 py-1 text-[12px]">18:24</span>
        </div>
        <div className="flex h-10 items-center gap-[3px]" aria-hidden="true">
          {[8, 16, 24, 14, 30, 20, 10, 26, 34, 18, 12, 22, 30, 16, 9, 20, 28, 14, 8, 18, 24, 12, 16, 9].map((h, i) => (
            <span key={i} className={`flex-1 rounded-full ${i < 10 ? "bg-(--p-glow)" : "bg-v-ink/20"}`} style={{ height: h }} />
          ))}
        </div>
        <span className="flex items-center gap-2 text-[12.5px] text-v-muted">
          <Lock className="size-3.5" aria-hidden="true" />
          {t.player.note}
        </span>
      </div>
    )
  return (
    <div className="nz-app flex w-full max-w-sm flex-col gap-2 rounded-2xl p-5">
      <span className="mb-1 font-[family-name:var(--v-font-mono)] text-[11px] text-v-muted">{t.result.label}</span>
      {(["B1", "A2", "B1", "A2"] as const).map((lvl, i) => [t.result.rows[i], lvl]).map(([part, lvl]) => (
        <div key={part} className="flex items-center justify-between border-t border-v-line pt-2 text-[14px]">
          {part}
          <span className={`v-num rounded-md px-2 py-0.5 text-[12.5px] ${lvl === "B1" ? "bg-(--p-glow) text-[#070A12]" : "bg-v-soft"}`}>{lvl}</span>
        </div>
      ))}
    </div>
  )
}

const PANEL_ART = [
  { photo: "--g-photo-5", mock: "dashboard" as const },
  { photo: "--g-photo-1", mock: "player" as const },
  { photo: "--g-photo-6", mock: "result" as const },
]

function audienceArt(t: LandingCopy) {
  return [
    <LevelPath key="path" ariaLabel={t.levelAria} />,
    <div key="citizen" className="flex flex-col items-center gap-3">
      <TestCard test="einbuergerung" t={t} />
      <div className="flex items-center gap-2">
        <LevelSeal level="b1" size={56} ariaLabel={t.levelAria} />
        <MetaChip icon={ClockIcon}>{t.audienceChip}</MetaChip>
      </div>
    </div>,
    <ExamTicket key="ticket" t={t} />,
  ]
}

export function Nachtzug({ locale }: { locale: Locale }) {
  const t = LANDING[locale]
  const price = formatEuro(PLANS.find((p) => p.featured)!.cents, NUMBER_LOCALE[locale])
  const art = audienceArt(t)
  return (
    <div>
      <header className="relative overflow-hidden">
        <SiteGlow />
        <SiteNav locale={locale} />

        <div className="v-container relative z-10 grid items-center gap-14 pt-10 pb-24 sm:pt-16 lg:grid-cols-[1.15fr_0.85fr] lg:pt-20 lg:pb-32">
          <div className="flex flex-col items-start gap-7">
            <span className="nz-chrome rounded-full px-3.5 py-1.5 font-[family-name:var(--v-font-mono)] text-[11.5px] tracking-[0.08em] text-v-ink uppercase">{t.hero.eyebrow}</span>
            <h1 className="v-display max-w-[17ch] text-[clamp(38px,4.8vw,68px)] leading-[1.06]">
              {t.hero.h1} <em className="pr-1 text-v-muted italic">{t.hero.h1em}</em>
            </h1>
            <p className="max-w-[48ch] text-lg text-v-muted">{t.hero.lead}</p>
            <div className="flex flex-wrap gap-3">
              <VButton size="lg" render={<Link href={lp(siteLocale(locale), "/gratis-test")} />} nativeButton={false}>{t.hero.cta}</VButton>
              <VButton size="lg" kind="ghost" render={<Link href={lp(siteLocale(locale), "/preise")} />} nativeButton={false}>{t.hero.cta2}</VButton>
            </div>
            <ul className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[14px] text-v-muted">
              {t.hero.proof.map((p) => (
                <li key={p} className="flex items-center gap-2">
                  <Check className="size-4 text-v-accent" strokeWidth={2.5} aria-hidden="true" />
                  {p}
                </li>
              ))}
            </ul>
          </div>
          <HeroScene t={t} />
        </div>
      </header>

      <section className="border-y border-v-line py-6">
        <div className="v-container flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-[14px] text-v-muted">
          <span className="text-v-ink">{t.langStrip}</span>
          {LANG_STRIP.filter((l) => l !== locale).map((l) => (
            <Link key={l} href={l === "en" ? "/en" : lp(l, "/")} hrefLang={l} lang={l} className="rounded underline decoration-v-ink/20 decoration-[1.5px] underline-offset-4 transition-colors hover:text-v-ink hover:decoration-v-ink">
              {LOCALE_NAMES[l]}
            </Link>
          ))}
        </div>
      </section>

      <ExamsSection t={t} locale={locale} />

      <section className="pb-24 sm:pb-32">
        <div className="v-container flex flex-col items-center gap-14">
          <div className="flex max-w-3xl flex-col items-center gap-4 text-center">
            <h2 className="v-h2 text-[clamp(30px,4vw,52px)]">{t.demoSection.h2}</h2>
            <p className="max-w-[52ch] text-lg text-v-muted">{t.demoSection.lead}</p>
          </div>
          <Photo token="--g-photo-5" className="w-full rounded-[28px] p-3 sm:p-10 lg:p-14">
            <PlatformDemo locale={locale} />
          </Photo>
        </div>
      </section>

      <section className="pb-24 sm:pb-32">
        <figure className="v-container flex flex-col items-center gap-5 text-center">
          <blockquote className="v-h2 max-w-3xl text-[clamp(28px,3.4vw,42px)] italic">{t.quote.text}</blockquote>
          <figcaption className="text-[14px] text-v-muted">{t.quote.caption}</figcaption>
        </figure>
      </section>

      <section className="relative overflow-hidden bg-v-soft py-24 sm:py-32">
        <span className="nacht-orb top-[20%] left-[-200px] size-[420px] bg-[#3046A8] opacity-25" />
        <div className="v-container relative flex flex-col gap-16">
          <h2 className="v-h2 text-[clamp(34px,4.6vw,60px)]">{t.panelsH2}</h2>
          {t.panels.map((p, i) => (
            <div key={p.title} className="flex flex-col gap-16">
              <div className="grid items-center gap-8 rounded-[24px] border border-v-line bg-v-surface p-6 sm:p-10 lg:grid-cols-2">
                <div className="flex flex-col gap-5">
                  <h3 className="v-h3 text-3xl">{p.title}</h3>
                  <p className="max-w-[46ch] text-v-muted">{p.text}</p>
                  <ul className="flex flex-col gap-2.5 text-[15px]">
                    {p.points.map((pt) => (
                      <li key={pt} className="flex items-center gap-3">
                        <span className="size-1.5 rounded-full bg-(--p-glow)" />
                        {pt}
                      </li>
                    ))}
                  </ul>
                </div>
                <Photo token={PANEL_ART[i].photo} className="grid aspect-[4/3] max-w-full place-items-center rounded-[18px] p-6">
                  <PanelMock kind={PANEL_ART[i].mock} t={t} />
                </Photo>
              </div>
              {i < t.panels.length - 1 && (
                <div className="flex justify-center gap-2" aria-hidden="true">
                  {[0, 1, 2, 3, 4].map((d) => <span key={d} className="size-1 rounded-full bg-v-ink/25" />)}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="py-24 sm:py-32">
        <div className="v-container flex flex-col gap-10">
          <h2 className="v-h2 text-[clamp(32px,4.4vw,52px)]">{t.audiencesH2} <span className="text-v-muted">{t.audiencesH2em}</span></h2>
          <div className="grid gap-4 md:grid-cols-3">
            {t.audiences.map((a, i) => (
              <Photo key={a.tag} token={["--g-photo-2", "--g-photo-3", "--g-photo-4"][i]} className="flex min-h-[420px] flex-col justify-between rounded-(--v-radius) p-6">
                <span className="self-start rounded-full bg-v-surface/50 px-3 py-1 text-[13px] backdrop-blur-md">{a.tag}</span>
                <div className="nz-float flex flex-1 items-center justify-center py-8" style={{ animationDelay: `${i * -2.3}s` }}>
                  {art[i]}
                </div>
                <div className="flex flex-col gap-2">
                  <h3 className="font-[family-name:var(--v-font-display)] text-2xl leading-tight">{a.title}</h3>
                  <p className="text-[14.5px] text-v-muted">{a.text}</p>
                </div>
              </Photo>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-v-line py-24 sm:py-32">
        <div className="v-container grid items-center gap-12 lg:grid-cols-2">
          <Photo token="--g-photo-5" className="grid aspect-[4/5] max-h-[560px] max-w-full place-items-center rounded-(--v-radius) px-6">
            <PromiseArt t={t} />
          </Photo>
          <div className="flex flex-col gap-6">
            <h2 className="v-h2 text-[clamp(36px,5vw,64px)]">{t.promise.h2}</h2>
            <p className="text-lg leading-relaxed text-v-muted">{t.promise.p1}</p>
            <p className="text-lg leading-relaxed text-v-muted">
              {t.promise.p2} {FORMAT_STAND}.
            </p>
            <div className="glass flex max-w-sm flex-col gap-3 rounded-(--v-radius) p-5">
              <span className="text-[13px] text-v-muted">{t.promise.example}</span>
              <span className="v-display text-5xl italic">B1</span>
              <LevelScale belowLabel={t.levelBelow} ariaLabel={t.resultAria} />
            </div>
          </div>
        </div>
      </section>

      <section id="fragen" className="scroll-mt-6 border-t border-v-line py-24 sm:py-32">
        <div className="v-container grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="flex flex-col gap-4">
            <h2 className="v-h2 text-[clamp(32px,4.4vw,52px)]">{t.faq.h2}</h2>
            <p className="text-v-muted">{t.faq.price(price)}</p>
          </div>
          <Accordion className="border-t border-v-line">
            {t.faq.items.map((f) => (
              <AccordionItem key={f.q} value={f.q} className="border-b border-v-line">
                <AccordionTrigger className="py-5 text-[17px] font-medium hover:no-underline">{f.q}</AccordionTrigger>
                <AccordionContent className="pb-5 text-[15.5px] leading-relaxed text-v-muted">{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      <section className="v-container pb-16">
        <Photo token="--g-photo-6" className="flex min-h-[420px] flex-col items-center justify-center gap-6 rounded-[28px] px-6 text-center">
          <h2 className="font-[family-name:var(--v-font-display)] text-[clamp(40px,6vw,80px)] leading-none tracking-[-0.02em] text-balance">{t.cta.h2}</h2>
          <p className="max-w-[40ch] text-lg text-v-muted">{t.cta.text}</p>
          <VButton size="lg" render={<Link href={lp(siteLocale(locale), "/gratis-test")} />} nativeButton={false}>{t.cta.button}</VButton>
        </Photo>
      </section>

      <SiteFooter locale={locale} />
    </div>
  )
}
