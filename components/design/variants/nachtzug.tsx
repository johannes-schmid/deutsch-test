import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { AUDIENCES, FAQ, FORMAT_STAND, LANGUAGES, PLACEHOLDER_PLANS, formatEuro } from "@/lib/design/content"
import { Check, Clock as ClockIcon, Headphones, Lock } from "lucide-react"
import { LevelScale, VButton } from "../kit"
import { PlatformDemo } from "./nachtzug-demo"
import { ExamTicket, LevelPath, LevelSeal, MetaChip, PromiseArt, TestCard } from "./nachtzug-icons"
import { NzLogo } from "./nachtzug-logo"

const WEEK = [
  { d: "Mo", done: true },
  { d: "Di", done: true },
  { d: "Mi", done: false },
  { d: "Do", done: true },
  { d: "Fr", today: true },
]

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

function HeroScene() {
  return (
    <div className="relative mx-auto aspect-[4/5] w-full max-w-[460px]">
      <span className="nz-halo" aria-hidden="true" />
      <div className="absolute inset-0 flex items-center justify-center p-6">
        <div className="nz-app relative flex w-[min(280px,78%)] flex-col rounded-[40px] p-3">
          <span className="mx-auto mt-1 mb-4 h-6 w-24 rounded-full bg-v-ink/85" aria-hidden="true" />
          <div className="flex flex-col items-center gap-0.5 pb-6">
            <span className="text-[13px] text-v-muted">Bis zu deiner DTZ-Prüfung</span>
            <span className="v-display text-[60px] leading-none font-medium tracking-[-0.05em] whitespace-nowrap">12 Tage</span>
          </div>
          <div className="flex flex-col gap-2 pb-2">
            <div className="flex items-center gap-3 rounded-[22px] border border-v-line bg-v-surface p-3">
              <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-(--p-glow) text-[#070A12]">
                <Headphones className="size-4" aria-hidden="true" />
              </span>
              <span className="min-w-0 text-[12.5px] leading-snug">
                <b className="font-semibold">Hören · Teil 2</b>
                <span className="block text-v-muted">Mach weiter, wo du warst.</span>
              </span>
            </div>
            <div className="flex items-center gap-3 rounded-[22px] border border-v-line bg-v-surface p-3">
              <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-v-soft">
                <Check className="size-4" strokeWidth={2.5} aria-hidden="true" />
              </span>
              <span className="min-w-0 text-[12.5px] leading-snug">
                <b className="font-semibold">Schreiben fertig</b>
                <span className="block text-v-muted">Dein Feedback ist da.</span>
              </span>
            </div>
          </div>
        </div>
      </div>
      <Pill
        initial="B1"
        color="var(--p-glow)"
        title="Lesen · Modelltest 2"
        text="Diesen Teil hast du auf B1."
        className="absolute bottom-[12%] left-1/2 w-max max-w-[92%] -translate-x-1/2 lg:left-0 lg:translate-x-0"
      />
    </div>
  )
}

function PanelMock({ kind }: { kind: "dashboard" | "player" | "result" }) {
  if (kind === "dashboard")
    return (
      <div className="nz-app flex w-full max-w-sm flex-col gap-4 rounded-2xl p-5">
        <div className="flex items-baseline justify-between">
          <b className="text-[16px] font-semibold">Hallo Amina</b>
          <span className="font-[family-name:var(--v-font-mono)] text-[11px] text-v-muted">Prüfung in 23 Tagen</span>
        </div>
        <div className="flex justify-between">
          {WEEK.map((w) => (
            <span key={w.d} className="flex flex-col items-center gap-1.5 text-[11px] text-v-muted">
              <span
                className={`grid size-8 place-items-center rounded-full ${w.done ? "bg-(--p-glow) text-[#070A12]" : w.today ? "border border-dashed border-v-ink/40" : "bg-v-soft"}`}
              >
                {w.done ? <Check className="size-3.5" strokeWidth={3} aria-hidden="true" /> : null}
              </span>
              {w.d}
            </span>
          ))}
        </div>
        <div className="flex items-center gap-3 rounded-full border border-v-line bg-v-surface p-2 pr-4">
          <span className="grid size-10 shrink-0 place-items-center rounded-full bg-[#E58FB5] text-[15px] font-semibold text-[#070A12]">D</span>
          <span className="flex min-w-0 flex-col text-[13.5px] leading-snug">
            <b className="font-semibold">Lesen · 45 Min</b>
            <span className="text-v-muted">Du kannst morgen weitermachen.</span>
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
            Hören · Teil 2
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
          Du hörst den Text einmal. Kein Zurückspulen.
        </span>
      </div>
    )
  return (
    <div className="nz-app flex w-full max-w-sm flex-col gap-2 rounded-2xl p-5">
      <span className="mb-1 font-[family-name:var(--v-font-mono)] text-[11px] text-v-muted">Dein Ergebnis · Modelltest 2</span>
      {[
        ["Hören", "B1"],
        ["Lesen", "A2"],
        ["Schreiben", "B1"],
        ["Sprechen", "A2"],
      ].map(([part, lvl]) => (
        <div key={part} className="flex items-center justify-between border-t border-v-line pt-2 text-[14px]">
          {part}
          <span className={`v-num rounded-md px-2 py-0.5 text-[12.5px] ${lvl === "B1" ? "bg-(--p-glow) text-[#070A12]" : "bg-v-soft"}`}>{lvl}</span>
        </div>
      ))}
    </div>
  )
}

const PANELS = [
  {
    title: "Üben, wann es dir passt.",
    text: "Ein Modelltest dauert so lange wie der echte DTZ. Du kannst ihn auch Teil für Teil machen, wann es dir passt.",
    points: ["Pausen zwischen den Teilen", "Dein Fortschritt bleibt gespeichert", "Funktioniert gut auf dem Handy"],
    photo: "--g-photo-5",
    mock: "dashboard" as const,
  },
  {
    title: "Wie am Prüfungstag.",
    text: "Gleiche Teile, gleiche Zeit, gleiche Aufgabentypen. Beim Hören gibt es kein Zurückspulen, wo die Prüfung keins hat.",
    points: ["Mehrere Stimmen beim Hören", "Sprechen als Paarprüfung", "Timer wie am Prüfungstag"],
    photo: "--g-photo-1",
    mock: "player" as const,
  },
  {
    title: "Dein Ergebnis, ehrlich.",
    text: "Du bekommst B1, A2 oder unter A2, wie beim DTZ. Du siehst genau, welcher Teil dir noch zu B1 fehlt.",
    points: ["Ergebnis pro Teil", "Feedback nach Kriterien", "Erklärungen in 6 Sprachen"],
    photo: "--g-photo-6",
    mock: "result" as const,
  },
]

const AUDIENCE_ART = [
  <LevelPath key="path" />,
  <div key="citizen" className="flex flex-col items-center gap-3">
    <TestCard test="einbuergerung" />
    <div className="flex items-center gap-2">
      <LevelSeal level="b1" size={56} />
      <MetaChip icon={ClockIcon}>15 Min am Tag</MetaChip>
    </div>
  </div>,
  <ExamTicket key="ticket" />,
]

const NZ_FAQ = [
  {
    q: "Kann ich den DTZ online üben?",
    a: "Ja. Bei uns machst du komplette DTZ-Modelltests im Browser oder auf dem Handy. Ein Test pro Teil ist gratis.",
  },
  {
    q: "Was mache ich, wenn ich beim DTZ nur A2 hatte?",
    a: "Mach einen Modelltest. Dann siehst du, welcher Teil dir noch zu B1 fehlt, und übst genau diesen Teil.",
  },
]

function Photo({ token, className, children }: { token: string; className?: string; children?: React.ReactNode }) {
  return (
    <div className={`photo ${className ?? ""}`} style={{ ["--photo" as string]: `var(${token})` }}>
      {children}
    </div>
  )
}

export function Nachtzug() {
  return (
    <div>
      <header className="relative overflow-hidden">
        <span className="nacht-orb top-[-160px] right-[8%] size-[520px] bg-(--p-glow)" />
        <span className="nacht-orb top-[80px] right-[-140px] size-[460px] bg-[#5E86FF] [animation-delay:-7s]" />
        <span className="nacht-orb top-[240px] right-[30%] size-[300px] bg-[#E58FB5] [animation-delay:-13s]" />
        <div className="v-noise absolute inset-0" aria-hidden="true" />

        <nav className="v-container relative z-10 flex items-center gap-6 py-5 text-[14px]">
          <NzLogo className="text-[19px]" />
          <div className="hidden items-center gap-6 text-v-muted md:flex">
            <span>Modelltests</span>
            <span>Preise</span>
            <span>Fragen</span>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <VButton size="sm" kind="ghost" className="hidden sm:inline-flex">Anmelden</VButton>
            <VButton size="sm">Gratis starten</VButton>
          </div>
        </nav>

        <div className="v-container relative z-10 grid items-center gap-14 pt-10 pb-24 sm:pt-16 lg:grid-cols-[1.1fr_0.9fr] lg:pt-20 lg:pb-32">
          <div className="flex flex-col items-start gap-7">
            <span className="font-[family-name:var(--v-font-mono)] text-[12px] tracking-[0.08em] text-v-muted uppercase">DTZ · Einbürgerungstest · A2–B1</span>
            <h1 className="v-display max-w-[13ch] text-[clamp(46px,6.2vw,88px)] leading-[1.04]">
              DTZ online üben und <em className="pr-1 italic">B1 schaffen.</em>
            </h1>
            <p className="max-w-[46ch] text-lg text-v-muted">
              Realistische Modelltests für den Deutsch-Test für Zuwanderer. Hören, Lesen, Schreiben und Sprechen, wie in der Prüfung. Mit Erklärungen in deiner Sprache.
            </p>
            <div className="flex flex-wrap gap-3">
              <VButton size="lg">Gratis Test starten</VButton>
              <VButton size="lg" kind="ghost">Preise ansehen</VButton>
            </div>
            <ul className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[14px] text-v-muted">
              {["Ohne Anmeldung", "Einbürgerungstest gratis", "Unter A2 → A2 → B1"].map((t) => (
                <li key={t} className="flex items-center gap-2">
                  <Check className="size-4 text-v-accent" strokeWidth={2.5} aria-hidden="true" />
                  {t}
                </li>
              ))}
            </ul>
          </div>
          <HeroScene />
        </div>
      </header>

      <section className="border-y border-v-line py-6">
        <div className="v-container flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-[14px] text-v-muted">
          <span className="text-v-ink">Erklärungen auf</span>
          {LANGUAGES.map((l) => <span key={l}>{l}</span>)}
        </div>
      </section>

      <section className="py-24 sm:py-32">
        <div className="v-container flex flex-col items-center gap-14">
          <div className="flex max-w-3xl flex-col items-center gap-4 text-center">
            <h2 className="v-h2 text-[clamp(30px,4vw,52px)]">Dein DTZ-Modelltest, online.</h2>
            <p className="max-w-[52ch] text-lg text-v-muted">Eine Prüfungssimulation mit allen vier Teilen. Gleiche Aufgabentypen, gleiche Zeit. Am Ende bekommst du B1, A2 oder unter A2.</p>
          </div>
          <Photo token="--g-photo-5" className="w-full rounded-[28px] p-3 sm:p-10 lg:p-14">
            <PlatformDemo />
          </Photo>
        </div>
      </section>

      <section className="pb-24 sm:pb-32">
        <figure className="v-container flex flex-col items-center gap-5 text-center">
          <blockquote className="v-h2 max-w-3xl text-[clamp(28px,3.4vw,42px)] italic">
            „Am Prüfungstag soll dich nichts überraschen.“
          </blockquote>
          <figcaption className="text-[14px] text-v-muted">Unser Grundsatz für jede Aufgabe</figcaption>
        </figure>
      </section>

      <section className="relative overflow-hidden bg-v-soft py-24 sm:py-32">
        <span className="nacht-orb top-[20%] left-[-200px] size-[420px] bg-[#3046A8] opacity-25" />
        <div className="v-container relative flex flex-col gap-16">
          <h2 className="v-h2 text-[clamp(34px,4.6vw,60px)]">So bereitest du dich vor.</h2>
          {PANELS.map((p, i) => (
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
                <Photo token={p.photo} className="grid aspect-[4/3] max-w-full place-items-center rounded-[18px] p-6">
                  <PanelMock kind={p.mock} />
                </Photo>
              </div>
              {i < PANELS.length - 1 && (
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
          <h2 className="v-h2 text-[clamp(32px,4.4vw,52px)]">Gemacht für dich, <em className="italic">egal woher du kommst.</em></h2>
          <div className="grid gap-4 md:grid-cols-3">
            {AUDIENCES.map((a, i) => (
              <Photo key={a.tag} token={["--g-photo-2", "--g-photo-3", "--g-photo-4"][i]} className="flex min-h-[420px] flex-col justify-between rounded-(--v-radius) p-6">
                <span className="self-start rounded-full bg-v-surface/50 px-3 py-1 text-[13px] backdrop-blur-md">{a.tag}</span>
                <div className="nz-float flex flex-1 items-center justify-center py-8" style={{ animationDelay: `${i * -2.3}s` }}>
                  {AUDIENCE_ART[i]}
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
            <PromiseArt />
          </Photo>
          <div className="flex flex-col gap-6">
            <h2 className="v-h2 text-[clamp(36px,5vw,64px)]">Unser Versprechen</h2>
            <p className="text-lg leading-relaxed text-v-muted">
              Wir bauen jede Aufgabe nach dem echten Aufbau des DTZ. Bevor eine Aufgabe online geht, prüft ein Mensch sie gegen unseren Bauplan und auf natürliches Deutsch.
            </p>
            <p className="text-lg leading-relaxed text-v-muted">
              Wir versprechen kein Zertifikat und keine Note. Wir versprechen, dass du weißt, was dich erwartet. Format-Stand {FORMAT_STAND}.
            </p>
            <div className="glass flex max-w-sm flex-col gap-3 rounded-(--v-radius) p-5">
              <span className="text-[13px] text-v-muted">Beispiel-Ergebnis</span>
              <span className="v-display text-5xl italic">B1</span>
              <LevelScale />
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-v-line py-24 sm:py-32">
        <div className="v-container grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="flex flex-col gap-4">
            <h2 className="v-h2 text-[clamp(32px,4.4vw,52px)]">Fragen</h2>
            <p className="text-v-muted">Ab {formatEuro(PLACEHOLDER_PLANS[0].cents)} im Monat (Platzhalter). Der Gratis-Test kostet nichts.</p>
          </div>
          <Accordion className="border-t border-v-line">
            {[...NZ_FAQ, ...FAQ].map((f) => (
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
          <h2 className="font-[family-name:var(--v-font-display)] text-[clamp(40px,6vw,80px)] leading-none tracking-[-0.02em]">Bereit für B1?</h2>
          <p className="max-w-[40ch] text-lg text-v-muted">Mach jetzt deinen ersten DTZ-Modelltest. Gratis und ohne Anmeldung.</p>
          <VButton size="lg">Gratis Test starten</VButton>
        </Photo>
      </section>

      <footer className="v-container flex flex-col gap-3 py-10 text-[13px] text-v-muted sm:flex-row sm:items-center sm:justify-between">
        <NzLogo className="text-[15px]" />
        <span>Nicht verbunden mit BAMF, telc oder g.a.s.t. · Impressum · Datenschutz</span>
      </footer>
    </div>
  )
}
