import type { Metadata } from "next"
import { DesignShell } from "@/components/design/shell"
import { GoogleButtonFallback } from "@/components/auth/google-button"
import { ExamCard } from "@/components/kurztest/exam-card"
import { AccountRow, Avatar, PortalSidebar, PortalTabBar } from "@/components/portal/portal-shell"
import { ModelltestRow, PortalCrumbs, SkillCard } from "@/components/portal/portal-exam"
import { EXAMS, EXAM_IDS, LEVELS } from "@/lib/exams"
import type { SessionUser } from "@/lib/supabase/server"

export const metadata: Metadata = {
  title: "Portal · Design",
  robots: { index: false, follow: false },
}

const USER: SessionUser = { email: "amina@example.com", name: "Amina Rahimi", firstName: "Amina", avatar: null }
const NAV = LEVELS.map((level) => ({ level, exams: EXAM_IDS.filter((id) => EXAMS[id].levels.includes(level)).map((id) => ({ id, label: EXAMS[id].short ?? EXAMS[id].name, brand: EXAMS[id].brand, href: `#${id}` })) }))

function Spec({ name, note, children }: { name: string; note: string; children: React.ReactNode }) {
  return (
    <section className="border-t border-v-line py-12">
      <p className="font-semibold">{name}</p>
      <p className="mt-1 max-w-[70ch] text-[13.5px] text-v-muted">{note}</p>
      <div className="mt-6">{children}</div>
    </section>
  )
}

/** The portal and auth pieces with specimen data. Live: /registrieren, /anmelden, /dashboard (after sign-in). */
export default function PortalDesignPage() {
  return (
    <DesignShell id="nachtzug" lang="de">
      <div className="v-container py-16">
        <h1 className="v-display text-[clamp(34px,4.6vw,56px)]">Portal</h1>
        <p className="mt-3 max-w-[62ch] text-v-muted">
          Aufbau wie das Portal von inburgeringoefenen.nl, gebaut aus Nachtzug. Komponenten in components/portal/ und components/auth/. Daten hier sind Muster.
        </p>

        <Spec name="PortalSidebar" note="Ab lg: schwebende Glas-Leiste, 280px. Übersicht (aktiv = Tinte), dann die Prüfungen nach Niveau (A1, A2, B1) mit ExamMark; der DTZ steht unter A2 und B1. Eine Prüfung leuchtet auch auf ihren Teil-Seiten. Paket-Karte, Konto-Zeile.">
          <div className="photo rounded-[32px] p-6" style={{ ["--photo" as string]: "var(--g-photo-1)" }}>
            <PortalSidebar groups={NAV} account={<AccountRow user={USER} />} className="static m-0 flex h-[720px]" />
          </div>
        </Spec>

        <Spec name="PortalTabBar" note="Unter lg: schwebende Tab-Leiste unten, 64px, max. 440px. Prüfungen und Konto springen zu Abschnitten der Übersicht.">
          <PortalTabBar className="static mx-0 w-full lg:block" />
        </Spec>

        <Spec name="Avatar · AccountRow" note="Google-Profilbild, sonst Initialen. Ohne Nutzer (Suspense-Fallback): Platzhalter-Balken.">
          <div className="flex flex-wrap items-center gap-6">
            <Avatar user={USER} size={48} />
            <Avatar user={null} size={48} />
            <div className="nz-paper w-[280px] rounded-[24px] p-2"><AccountRow user={USER} /></div>
            <div className="nz-paper w-[280px] rounded-[24px] p-2"><AccountRow user={null} /></div>
          </div>
        </Spec>

        <Spec name="GoogleButton" note="Der einzige Supabase-Auth-Aufruf. Tinte, 52px, Google-„G“. Fehler erscheinen darunter in Rosé (role=alert).">
          <div className="max-w-[400px]"><GoogleButtonFallback mode="register" /></div>
        </Spec>

        <Spec name="ExamCard" note="Geteilt von /gratis-test und der Portal-Übersicht. Ohne href: gestrichelt, „Bald verfügbar“.">
          <ul className="grid grid-cols-[minmax(0,1fr)] gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <li><ExamCard exam={EXAMS.dtz} href="#" /></li>
            <li><ExamCard exam={EXAMS["telc-b1"]} href={null} /></li>
            <li><ExamCard exam={EXAMS.dtz} href="#" cta="Zur Prüfung" chip="A2–B1" /></li>
          </ul>
        </Spec>

        <Spec name="PortalCrumbs" note="Übersicht › Prüfung › Teil. Das letzte Glied ist die aktuelle Seite; der Pfeil spiegelt sich in RTL.">
          <PortalCrumbs items={[{ label: "Übersicht", href: "#" }, { label: "Goethe B1", href: "#" }, { label: "Hören" }]} />
        </Spec>

        <Spec name="SkillCard" note="/dashboard/[exam]: ein Teil der Prüfung. PartIcon, Anzahl Modelltests, Status. Die ganze Karte öffnet den Teil; der Gratis-Test-Link liegt darüber und erscheint nur, wenn es geprüften Inhalt gibt.">
          <ul className="grid max-w-[760px] grid-cols-[minmax(0,1fr)] gap-4 sm:grid-cols-2">
            <li><SkillCard skill="hoeren" name="Hören" href="#" free="#" count="10 Modelltests" status="Modelltests kommen bald" /></li>
            <li><SkillCard skill="sprechen" name="Sprechen" href="#" free={null} count="10 Modelltests" status="Modelltests kommen bald" /></li>
          </ul>
        </Spec>

        <Spec name="ModelltestRow" note="/dashboard/[exam]/[skill]: zehn Zeilen in einer Papierkarte. Mit href: Tinten-Nummer, „Starten“, runder Pfeil. Ohne: gestrichelte Nummer, „Bald verfügbar“, Uhr.">
          <ol className="nz-paper flex max-w-[760px] flex-col divide-y divide-v-line overflow-hidden rounded-[24px]">
            <li><ModelltestRow n={1} href="#" /></li>
            <li><ModelltestRow n={2} href={null} /></li>
          </ol>
        </Spec>
      </div>
    </DesignShell>
  )
}
