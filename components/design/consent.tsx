"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { GoogleAnalytics } from "@next/third-parties/google"
import { Cookie } from "lucide-react"
import { VButton } from "@/components/design/kit"
import { Switch } from "@/components/ui/switch"
import type { Locale } from "@/lib/i18n/locale"
import { CONSENT_KEY as KEY, GA_ID } from "@/lib/analytics"

const OPEN_EVENT = "dtu:consent-open"

type Prefs = { analytics: boolean }

const COPY: Record<Locale, {
  title: string; body: string; privacy: string; acceptAll: string; necessaryOnly: string; customize: string; save: string; settings: string
  necessary: { name: string; desc: string; badge: string }; analytics: { name: string; desc: string }
}> = {
  de: {
    title: "Wir nutzen Cookies",
    body: "Einige brauchen wir, damit die Seite funktioniert. Andere helfen uns, die Seite besser zu machen. Die setzen wir nur, wenn du zustimmst.",
    privacy: "Datenschutz",
    acceptAll: "Alle akzeptieren",
    necessaryOnly: "Nur notwendige",
    customize: "Einstellungen",
    save: "Auswahl speichern",
    settings: "Cookie-Einstellungen",
    necessary: { name: "Notwendig", desc: "Für den Betrieb der Seite, z. B. um deine Auswahl zu speichern.", badge: "Immer aktiv" },
    analytics: { name: "Statistik", desc: "Zeigt uns, welche Seiten genutzt werden (Google Analytics)." },
  },
  en: {
    title: "We use cookies",
    body: "Some are needed for the site to work. Others help us improve it. We only set those if you agree.",
    privacy: "Privacy policy",
    acceptAll: "Accept all",
    necessaryOnly: "Necessary only",
    customize: "Customize",
    save: "Save choices",
    settings: "Cookie settings",
    necessary: { name: "Necessary", desc: "Keep the site running, e.g. remember your choice.", badge: "Always on" },
    analytics: { name: "Analytics", desc: "Show us which pages are used (Google Analytics)." },
  },
  uk: {
    title: "Ми використовуємо cookies",
    body: "Деякі потрібні, щоб сайт працював. Інші допомагають нам його покращувати. Їх ми ставимо, тільки якщо ви погоджуєтеся.",
    privacy: "Захист даних",
    acceptAll: "Прийняти всі",
    necessaryOnly: "Лише необхідні",
    customize: "Налаштування",
    save: "Зберегти вибір",
    settings: "Налаштування cookies",
    necessary: { name: "Необхідні", desc: "Для роботи сайту, наприклад щоб запам'ятати ваш вибір.", badge: "Завжди активні" },
    analytics: { name: "Статистика", desc: "Показує нам, які сторінки відвідують (Google Analytics)." },
  },
  ru: {
    title: "Мы используем cookies",
    body: "Некоторые нужны, чтобы сайт работал. Другие помогают нам его улучшать. Их мы ставим, только если вы согласны.",
    privacy: "Защита данных",
    acceptAll: "Принять все",
    necessaryOnly: "Только нужные",
    customize: "Настройки",
    save: "Сохранить выбор",
    settings: "Настройки cookies",
    necessary: { name: "Необходимые", desc: "Для работы сайта, например чтобы запомнить ваш выбор.", badge: "Всегда активны" },
    analytics: { name: "Статистика", desc: "Показывает нам, какие страницы посещают (Google Analytics)." },
  },
}

function read(): Prefs | null {
  try {
    const v = JSON.parse(localStorage.getItem(KEY) ?? "null")
    return v && typeof v.analytics === "boolean" ? { analytics: v.analytics } : null
  } catch {
    return null
  }
}

function clearGaCookies() {
  const host = location.hostname
  const domains = ["", host, `.${host}`, `.${host.split(".").slice(-2).join(".")}`]
  for (const c of document.cookie.split(";")) {
    const name = c.split("=")[0].trim()
    if (!name.startsWith("_ga")) continue
    for (const d of domains) document.cookie = `${name}=; Max-Age=0; path=/${d ? `; domain=${d}` : ""}`
  }
}

/** Cookie banner (§ 25 TDDDG): Google Analytics only loads after consent to "Statistik". */
export function Consent({ locale }: { locale: Locale }) {
  const [prefs, setPrefs] = useState<Prefs | null>(null)
  const [open, setOpen] = useState(false)
  const [custom, setCustom] = useState(false)
  const [analytics, setAnalytics] = useState(false)
  const t = COPY[locale]

  useEffect(() => {
    const stored = read()
    setPrefs(stored)
    setOpen(stored === null)
    const reopen = () => {
      const current = read()
      setAnalytics(current?.analytics ?? false)
      setCustom(true)
      setOpen(true)
    }
    window.addEventListener(OPEN_EVENT, reopen)
    return () => window.removeEventListener(OPEN_EVENT, reopen)
  }, [])

  function save(next: Prefs) {
    try {
      localStorage.setItem(KEY, JSON.stringify(next))
    } catch {}
    setOpen(false)
    setCustom(false)
    if (!next.analytics && prefs?.analytics) {
      if (GA_ID) (window as unknown as Record<string, boolean>)[`ga-disable-${GA_ID}`] = true
      clearGaCookies()
      location.reload()
      return
    }
    setPrefs(next)
  }

  return (
    <>
      {prefs?.analytics && GA_ID ? <GoogleAnalytics gaId={GA_ID} /> : null}
      {open ? (
        <section
          role="region"
          aria-label={t.settings}
          className="consent-in nz-app fixed inset-x-3 bottom-3 z-50 max-h-[calc(100dvh-24px)] overflow-y-auto rounded-(--v-radius) p-5 sm:bottom-5 sm:left-auto sm:right-5 sm:w-[440px] sm:p-6"
        >
          <div className="flex items-center gap-3">
            <span className="grid size-9 shrink-0 place-items-center rounded-full bg-[color-mix(in_srgb,var(--p-glow)_28%,transparent)] text-(--p-ember)">
              <Cookie className="size-[18px]" strokeWidth={1.8} aria-hidden="true" />
            </span>
            <h2 className="text-[17px] leading-snug font-semibold tracking-[-0.01em]">{t.title}</h2>
          </div>
          <p className="mt-3 text-[14.5px] leading-relaxed text-v-muted">
            {t.body}{" "}
            <Link href="/datenschutz" className="text-v-ink underline decoration-v-ink/30 underline-offset-[3px] hover:decoration-v-ink">
              {t.privacy}
            </Link>
          </p>

          <div className="consent-panel grid" data-open={custom}>
            <div className="min-h-0 overflow-hidden" inert={!custom}>
              <ul className="mt-4 divide-y divide-v-line rounded-2xl border border-v-line">
                <li className="flex items-start justify-between gap-4 p-4">
                  <div>
                    <p className="text-[14.5px] font-semibold">{t.necessary.name}</p>
                    <p className="mt-0.5 text-[13.5px] leading-snug text-v-muted">{t.necessary.desc}</p>
                  </div>
                  <span className="shrink-0 rounded-full bg-v-soft px-2.5 py-1 text-[12px] font-semibold whitespace-nowrap text-v-muted">{t.necessary.badge}</span>
                </li>
                <li>
                  <label className="flex cursor-pointer items-start justify-between gap-4 p-4">
                    <span>
                      <span className="block text-[14.5px] font-semibold">{t.analytics.name}</span>
                      <span className="mt-0.5 block text-[13.5px] leading-snug text-v-muted">{t.analytics.desc}</span>
                    </span>
                    <Switch checked={analytics} onCheckedChange={setAnalytics} className="mt-0.5 data-checked:bg-v-ink data-unchecked:bg-v-ink/20" />
                  </label>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-2">
            {custom ? (
              <VButton kind="ghost" onClick={() => save({ analytics })}>{t.save}</VButton>
            ) : (
              <VButton kind="ghost" onClick={() => save({ analytics: false })}>{t.necessaryOnly}</VButton>
            )}
            <VButton kind="ink" onClick={() => save({ analytics: true })}>{t.acceptAll}</VButton>
          </div>
          {custom ? null : (
            <button
              type="button"
              onClick={() => setCustom(true)}
              className="mx-auto mt-3 block cursor-pointer rounded px-2 py-1 text-[13.5px] font-semibold text-v-muted transition-colors hover:text-v-ink"
            >
              {t.customize}
            </button>
          )}
        </section>
      ) : null}
    </>
  )
}

export function ConsentSettingsButton({ locale }: { locale: Locale }) {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event(OPEN_EVENT))}
      className="w-fit cursor-pointer rounded text-left transition-colors hover:text-v-ink"
    >
      {COPY[locale].settings}
    </button>
  )
}
