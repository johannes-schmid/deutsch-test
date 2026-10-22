"use client"

import { createContext, useContext } from "react"
import { KURZTEST, type KurztestCopy } from "@/lib/i18n/kurztest"
import { lp, type SiteLocale } from "@/lib/i18n/locale"

const Ctx = createContext<{ locale: SiteLocale; T: KurztestCopy; at: (path: string) => string }>({ locale: "de", T: KURZTEST.de, at: (p) => p })

/** The free test's language: UI copy and the locale prefix for links. Exam content stays German. */
export function KurztestLocale({ locale, children }: { locale: SiteLocale; children: React.ReactNode }) {
  return <Ctx.Provider value={{ locale, T: KURZTEST[locale], at: (p) => lp(locale, p) }}>{children}</Ctx.Provider>
}

export const useKurztest = () => useContext(Ctx)
