import type { Metadata } from "next"
import { DesignShell } from "@/components/design/shell"
import { GoogleButtonFallback } from "@/components/auth/google-button"
import { ExamCard } from "@/components/kurztest/exam-card"
import { AccountRow, Avatar, PortalSidebar, PortalTabBar } from "@/components/portal/portal-shell"
import { ModelltestRow, PortalCrumbs, SkillCard } from "@/components/portal/portal-exam"
import { FamilyCard, LevelCard, ScoreCard, WeekCard } from "@/components/portal/portal-overview"
import { AccountCard, PassCard, ProgressCard } from "@/components/portal/portal-account"
import { PassBuilder } from "@/components/design/pass-builder"
import { EXAMS, FAMILIES, FAMILY_IDS } from "@/lib/exams"
import type { SessionUser } from "@/lib/supabase/server"

export const metadata: Metadata = {
  title: "Portal · Design",
  robots: { index: false, follow: false },
}

const USER: SessionUser = { id: "design-preview", email: "amina@example.com", name: "Amina Rahimi", firstName: "Amina", avatar: null }
const NAV = FAMILY_IDS.map((f) => ({ id: f, label: f === "dtz" ? "DTZ" : FAMILIES[f].name, brand: FAMILIES[f].brand, href: `#${f}`, levels: FAMILIES[f].exams.map((id) => ({ id, level: EXAMS[id].levels.join("–"), label: EXAMS[id].short ?? EXAMS[id].name, href: `#${id}` })) }))

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

        <Spec name="PortalSidebar" note="Ab lg: schwebende Glas-Leiste, 280px. Übersicht (aktiv = Tinte), dann die Prüfungsfamilien (DTZ, Goethe, telc, ÖSD) mit ExamMark und darunter ihre Niveaus an einer Haarlinie. Ein Niveau leuchtet auch auf seinen Teil-Seiten. Paket-Karte, Konto-Zeile.">
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

        <Spec name="FamilyCard" note="/dashboard: eine Prüfungsfamilie. ExamMark, Niveau-Spanne, zuletzt gemachter Modelltest (sonst Kurzbeschreibung), Fortschritt über alle Niveaus. Gestartet: Tinten-Knopf „Weiter“, sonst „Beginnen“ als Umriss. Die ganze Karte öffnet die Familie; der DTZ öffnet direkt seine Prüfung.">
          <ul className="grid max-w-[760px] grid-cols-[minmax(0,1fr)] gap-4 sm:grid-cols-2">
            <li><FamilyCard name="Deutsch-Test für Zuwanderer" brand="dtz" levels="A2–B1" href="#" line="Zuletzt: Modelltest 3 · Hören" done={7} total={40} /></li>
            <li><FamilyCard name="ÖSD Zertifikat" brand="oesd" levels="A1–B1" href="#" line={FAMILIES.oesd.summary} done={0} total={120} /></li>
          </ul>
        </Spec>

        <Spec name="LevelCard" note="/dashboard/goethe (telc, oesd): ein Niveau der Familie. Niveau als Tinten-Kachel, Name, Kurzbeschreibung, Fortschritt. Öffnet /dashboard/[exam].">
          <ul className="grid max-w-[760px] grid-cols-[minmax(0,1fr)] gap-4 sm:grid-cols-2">
            <li><LevelCard level="A2" name={EXAMS["goethe-a2"].name} summary={EXAMS["goethe-a2"].summary} href="#" done={3} total={40} /></li>
            <li><LevelCard level="B1" name={EXAMS["goethe-b1"].name} summary={EXAMS["goethe-b1"].summary} href="#" done={0} total={40} /></li>
          </ul>
        </Spec>

        <Spec name="ScoreCard · WeekCard" note="Rechte Spalte der Übersicht. Schnitt = Anteil der Punkte aller Modelltests (Übungswert), Änderung seit letzter Woche, Linie der letzten 12 Ergebnisse. Woche: Modelltests der letzten 7 Tage, heute zuletzt. Ohne Versuche: Hinweis statt Zahl.">
          <div className="grid max-w-[640px] grid-cols-[minmax(0,1fr)] gap-4 sm:grid-cols-2">
            <ScoreCard average={64} delta={6} trend={[48, 52, 51, 58, 55, 61, 64]} />
            <WeekCard week={["Sa", "So", "Mo", "Di", "Mi", "Do", "Fr"].map((day, i) => ({ day, count: [0, 0, 1, 0, 1, 0, 0][i] }))} />
            <ScoreCard average={null} delta={null} trend={[]} />
          </div>
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

        <Spec name="ModelltestRow" note="/dashboard/[exam]/[skill]: zehn Zeilen in einer Papierkarte, ein Zustand pro Zeile. Gemacht: Ember-Haken an der Nummer, bestes Ergebnis, Pfeil wird „noch einmal“. Gesperrt: weiche Nummer und Schloss. Bald: gestrichelte Nummer und Uhr. Vorschau: nur für Admins, unveröffentlicht.">
          <ol className="nz-paper flex max-w-[760px] flex-col divide-y divide-v-line overflow-hidden rounded-[24px]">
            <li><ModelltestRow slot={{ n: 1, state: "done", href: "#", free: true, result: "B1" }} /></li>
            <li><ModelltestRow slot={{ n: 2, state: "open", href: "#", free: false, result: null }} /></li>
            <li><ModelltestRow slot={{ n: 3, state: "preview", href: "#", free: false, result: null }} /></li>
            <li><ModelltestRow slot={{ n: 4, state: "locked", href: null, free: false, result: null }} /></li>
            <li><ModelltestRow slot={{ n: 5, state: "soon", href: null, free: false, result: null }} /></li>
          </ol>
        </Spec>

        <Spec name="PassBuilder" note="/preise und /dashboard/preise: der Prüfungspass, nach dem ModulePicker von inburgeringoefenen.nl. Links die Wahl (Prüfungstermin → empfohlene Laufzeit, Laufzeit als Radio-Kacheln, was drin ist, was gratis bleibt), rechts die Zusammenfassung auf Nacht (ab lg sticky, auf dem Handy darunter): Preis einmalig, pro Monat, Ersparnis gegenüber Einzelmonaten, Enddatum, Vertrauenszeilen, Kauf-Knopf (bis Stripe: „Bald verfügbar“).">
          <PassBuilder locale="de" freeHref="#" />
        </Spec>

        <Spec name="PassCard · ProgressCard · AccountCard" note="/dashboard/konto, nach /dashboard/profiel von inburgeringoefenen.nl. PassCard: gratis (Papier, Tinten-Knopf zum Pass) oder aktiv (Nacht, Glut-Pille, Enddatum, Verlängern). ProgressCard: je DTZ-Teil und jede andere gestartete Prüfung eine Zeile mit Balken; ohne Versuch ein Hinweis darüber. AccountCard: E-Mail und Anmeldung als Einstellungszeilen, Abmelden darunter.">
          <div className="grid max-w-[1000px] grid-cols-[minmax(0,1fr)] items-start gap-4 lg:grid-cols-[minmax(0,1fr)_340px]">
            <ProgressCard
              empty={null}
              items={[
                { id: "h", part: "hoeren", label: "DTZ · Hören", href: "#", done: 3, total: 10 },
                { id: "l", part: "lesen", label: "DTZ · Lesen", href: "#", done: 1, total: 10 },
                { id: "s", part: "schreiben", label: "DTZ · Schreiben", href: "#", done: 0, total: 10 },
                { id: "g", brand: "goethe", label: "Goethe B1", href: "#", done: 2, total: 40 },
              ]}
            />
            <div className="flex flex-col gap-4">
              <PassCard until={null} />
              <PassCard until="23. Januar 2027" />
              <AccountCard user={USER} signOut={null} />
            </div>
          </div>
        </Spec>
      </div>
    </DesignShell>
  )
}
