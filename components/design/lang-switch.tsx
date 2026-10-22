"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu } from "@base-ui/react/menu"
import { Check, ChevronDown, Globe, Languages } from "lucide-react"
import { LOCALE_NAMES, LOCALE_SHORT, basePath, lp, type Locale } from "@/lib/i18n/locale"
import { cn } from "@/lib/utils"

/** Every locale the current page exists in, with its URL. English exists for the home page only. */
function useTargets(): { locale: Locale; href: string }[] {
  const base = basePath(usePathname())
  const locales: Locale[] = base === "/" || base === "/en" ? ["de", "en", "uk", "ru"] : ["de", "uk", "ru"]
  return locales.map((l) => ({ locale: l, href: l === "en" ? "/en" : lp(l, base === "/en" ? "/" : base) }))
}

// Hidden below sm: the pill has no room next to login and the CTA (phones switch in the footer and the landing's language strip).
const TRIGGER =
  "flex h-9 items-center gap-1.5 rounded-full px-2.5 text-[13.5px] font-semibold text-v-muted transition-[background-color,color,transform] duration-150 ease-out hover:bg-v-ink/5 hover:text-v-ink active:scale-[0.97] data-[popup-open]:bg-v-ink/5 data-[popup-open]:text-v-ink max-sm:hidden"

function TriggerFace({ locale }: { locale: Locale }) {
  return (
    <>
      <Globe className="size-4" aria-hidden="true" />
      <span>{LOCALE_SHORT[locale]}</span>
      <ChevronDown className="size-3.5 opacity-60" aria-hidden="true" />
    </>
  )
}

/** The nav's language menu. Reads the pathname, so it renders inside <Suspense> with `LangSwitchFallback`. */
export function LangSwitch({ locale, label }: { locale: Locale; label: string }) {
  const targets = useTargets()
  const anchor = useRef<HTMLSpanElement>(null)
  const [frame, setFrame] = useState<HTMLElement | null>(null)
  useEffect(() => setFrame(anchor.current?.closest<HTMLElement>(".v-frame") ?? null), [])
  return (
    <Menu.Root>
      <span ref={anchor} className="contents" />
      <Menu.Trigger aria-label={`${label}: ${LOCALE_NAMES[locale]}`} className={TRIGGER}>
        <TriggerFace locale={locale} />
      </Menu.Trigger>
      <Menu.Portal container={frame}>
        <Menu.Positioner side="bottom" align="end" sideOffset={8} className="z-50">
          <Menu.Popup className="nz-chrome min-w-[200px] origin-(--transform-origin) rounded-[20px] p-1.5 text-[14.5px] transition-[transform,opacity] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] outline-none data-[ending-style]:scale-[0.97] data-[ending-style]:opacity-0 data-[starting-style]:scale-[0.97] data-[starting-style]:opacity-0 motion-reduce:data-[ending-style]:scale-100 motion-reduce:data-[starting-style]:scale-100">
            {targets.map((t) => (
              <Menu.LinkItem
                key={t.locale}
                render={<Link href={t.href} hrefLang={t.locale} lang={t.locale} />}
                aria-current={t.locale === locale ? "page" : undefined}
                className="flex h-10 items-center justify-between gap-6 rounded-[14px] px-3 font-medium outline-none data-[highlighted]:bg-v-ink/6"
              >
                {LOCALE_NAMES[t.locale]}
                {t.locale === locale ? <Check className="size-4 text-v-accent" strokeWidth={2.5} aria-hidden="true" /> : null}
              </Menu.LinkItem>
            ))}
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  )
}

export function LangSwitchFallback({ locale }: { locale: Locale }) {
  return (
    <span className={cn(TRIGGER, "pointer-events-none")} aria-hidden="true">
      <TriggerFace locale={locale} />
    </span>
  )
}

/** The footer's language links, to the same page in every other locale. */
export function LangLinks({ locale }: { locale: Locale }) {
  const targets = useTargets().filter((t) => t.locale !== locale)
  return targets.map((t) => (
    <Link key={t.locale} href={t.href} hrefLang={t.locale} lang={t.locale} className="flex w-fit items-center gap-1.5 rounded transition-colors hover:text-v-ink">
      <Globe className="size-3.5" aria-hidden="true" />
      {LOCALE_NAMES[t.locale]}
    </Link>
  ))
}

/** AI Act art. 50: a machine-translated page says so at the top, with a link to the German original. */
export function MachineNote({ text, original }: { text: string; original: string }) {
  const base = basePath(usePathname())
  return <MachineNoteBody text={text} original={original} href={base} />
}

export function MachineNoteBody({ text, original, href }: { text: string; original: string; href?: string }) {
  return (
    <p className="flex items-start gap-2 px-4 pt-2.5 text-[13px] leading-snug text-v-muted sm:items-center sm:px-5">
      <Languages className="mt-px size-3.5 shrink-0 sm:mt-0" aria-hidden="true" />
      <span>
        {text}{" "}
        {href ? (
          <Link href={href} hrefLang="de" lang="de" className="font-medium text-v-ink underline decoration-v-ink/25 underline-offset-[3px] transition-colors hover:decoration-v-ink">
            {original}
          </Link>
        ) : null}
      </span>
    </p>
  )
}
