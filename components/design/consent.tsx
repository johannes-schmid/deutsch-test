"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { GoogleAnalytics } from "@next/third-parties/google"
import { VButton } from "@/components/design/kit"
import type { Locale } from "@/lib/i18n/landing"

const GA_ID = process.env.NEXT_PUBLIC_GA_ID
const KEY = "dtu-consent-v1"
const OPEN_EVENT = "dtu:consent-open"

type Choice = "granted" | "denied"

const COPY: Record<Locale, { title: string; body: string; privacy: string; accept: string; decline: string; settings: string }> = {
  de: {
    title: "Darf Google Analytics mitzählen?",
    body: "Dann sehen wir, welche Seiten dir helfen. Google setzt dafür Cookies. Du kannst das jederzeit im Footer ändern.",
    privacy: "Mehr im Datenschutz",
    accept: "Akzeptieren",
    decline: "Ablehnen",
    settings: "Cookie-Einstellungen",
  },
  en: {
    title: "May Google Analytics count your visit?",
    body: "It shows us which pages help you. Google sets cookies for this. You can change it any time in the footer.",
    privacy: "Privacy policy",
    accept: "Accept",
    decline: "Decline",
    settings: "Cookie settings",
  },
}

function read(): Choice | null {
  try {
    const v = localStorage.getItem(KEY)
    return v === "granted" || v === "denied" ? v : null
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

/** Opt-in banner for Google Analytics (§ 25 TDDDG). GA only loads after "Akzeptieren". */
export function Consent({ locale }: { locale: Locale }) {
  const [choice, setChoice] = useState<Choice | null>(null)
  const [open, setOpen] = useState(false)
  const t = COPY[locale]

  useEffect(() => {
    const stored = read()
    setChoice(stored)
    setOpen(stored === null)
    const reopen = () => setOpen(true)
    window.addEventListener(OPEN_EVENT, reopen)
    return () => window.removeEventListener(OPEN_EVENT, reopen)
  }, [])

  function decide(next: Choice) {
    try {
      localStorage.setItem(KEY, next)
    } catch {}
    setOpen(false)
    if (next === "denied" && choice === "granted") {
      if (GA_ID) (window as unknown as Record<string, boolean>)[`ga-disable-${GA_ID}`] = true
      clearGaCookies()
      location.reload()
      return
    }
    setChoice(next)
  }

  return (
    <>
      {choice === "granted" && GA_ID ? <GoogleAnalytics gaId={GA_ID} /> : null}
      {open ? (
        <section
          role="region"
          aria-label={t.settings}
          className="consent-in nz-app fixed inset-x-3 bottom-3 z-50 rounded-(--v-radius) p-5 sm:right-auto sm:bottom-5 sm:left-5 sm:max-w-[420px] sm:p-6"
        >
          <h2 className="text-[17px] leading-snug font-semibold tracking-[-0.01em] text-balance">{t.title}</h2>
          <p className="mt-2 text-[14.5px] leading-relaxed text-v-muted">
            {t.body}{" "}
            <Link href="/datenschutz" className="text-v-ink underline underline-offset-[3px] decoration-v-ink/30 hover:decoration-v-ink">
              {t.privacy}
            </Link>
          </p>
          <div className="mt-5 grid grid-cols-2 gap-2">
            <VButton kind="ink" onClick={() => decide("denied")}>{t.decline}</VButton>
            <VButton kind="ink" onClick={() => decide("granted")}>{t.accept}</VButton>
          </div>
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
