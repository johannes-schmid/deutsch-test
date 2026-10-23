import type { SiteLocale } from "@/lib/i18n/locale"

/** The Prüfungspass configurator (`PassBuilder`), on /preise in every site locale and in German in the portal. uk/ru are machine-translated. */
export type PassCopy = {
  whenH: string
  /** Exam date → recommended plan id (`lib/pricing.ts`). Rule-based, no model involved. */
  when: { id: string; label: string; plan: string }[]
  whenHint: (plan: string) => string
  planH: string
  planName: (months: number) => string
  recommended: string
  oneTime: string
  perMonth: (price: string) => string
  save: (pct: number) => string
  compare: (months: number, price: string) => string
  includesH: string
  includes: string[]
  newTests: string
  freeH: string
  free: string[]
  freeCta: string
  summaryH: string
  summaryScope: string
  saving: (amount: string) => string
  ends: (date: string) => string
  endsAfter: (plan: string) => string
  trust: string[]
  soon: string
  soonNote: string
}

const planName = (months: number) => (months === 1 ? "1 Monat" : `${months} Monate`)

const de: PassCopy = {
  whenH: "Wann ist deine Prüfung?",
  when: [
    { id: "soon", label: "In 4 Wochen oder früher", plan: "1m" },
    { id: "mid", label: "In 1 bis 3 Monaten", plan: "3m" },
    { id: "none", label: "Noch kein Termin", plan: "3m" },
  ],
  whenHint: (plan) => `Dafür passt „${plan}“. Du kannst trotzdem frei wählen.`,
  planH: "Wie lange willst du üben?",
  planName,
  recommended: "Empfohlen",
  oneTime: "einmalig",
  perMonth: (price) => `${price} im Monat`,
  save: (pct) => `−${pct} %`,
  compare: (months, price) => `statt ${months} × ${price}`,
  includesH: "Das ist im Pass",
  includes: [
    "Alle Modelltests für Hören, Lesen, Schreiben und Sprechen",
    "Echte Prüfungsbedingungen: Zeit, Ablauf, Ergebnis B1, A2 oder unter A2",
    "Feedback für Schreiben und Sprechen nach den Kriterien der Prüfung",
    "Sprechen zu zweit, mit Prüferin und Partner",
    "Erklärungen auf Ukrainisch und Russisch",
  ],
  newTests: "Neue Modelltests, die während deiner Laufzeit kommen, sind inklusive.",
  freeH: "Gratis bleibt gratis",
  free: ["Modelltest 1 in jedem Teil", "Alle Gratis-Tests, ohne Anmeldung"],
  freeCta: "Gratis üben",
  summaryH: "Dein Prüfungspass",
  summaryScope: "Alle Teile, alle Modelltests",
  saving: (amount) => `Du sparst ${amount}`,
  ends: (date) => `Endet am ${date}`,
  endsAfter: (plan) => `Endet nach ${plan}`,
  trust: ["Einmal zahlen, kein Abo", "Endet von selbst, keine Kündigung", "Preis inkl. 19 % MwSt."],
  soon: "Bald verfügbar",
  soonNote: "Den Pass kannst du bald hier kaufen. Bis dahin ist Modelltest 1 in jedem Teil gratis.",
}

function monthLabel(n: number) {
  const m10 = n % 10
  const m100 = n % 100
  if (m10 === 1 && m100 !== 11) return `${n} місяць`
  if (m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14)) return `${n} місяці`
  return `${n} місяців`
}

const uk: PassCopy = {
  whenH: "Коли ваш іспит?",
  when: [
    { id: "soon", label: "Через 4 тижні або раніше", plan: "1m" },
    { id: "mid", label: "Через 1–3 місяці", plan: "3m" },
    { id: "none", label: "Дати ще немає", plan: "3m" },
  ],
  whenHint: (plan) => `Для цього підходить варіант «${plan}». Але ви можете вибрати вільно.`,
  planH: "Скільки часу ви хочете тренуватися?",
  planName: monthLabel,
  recommended: "Рекомендовано",
  oneTime: "одноразово",
  perMonth: (price) => `${price} на місяць`,
  save: (pct) => `−${pct} %`,
  compare: (months, price) => `замість ${months} × ${price}`,
  includesH: "Що входить у пропуск",
  includes: [
    "Усі пробні іспити для Hören, Lesen, Schreiben і Sprechen",
    "Справжні умови іспиту: час, порядок, результат B1, A2 або нижче A2",
    "Відгук на письмо та говоріння за критеріями іспиту",
    "Говоріння в парі, з екзаменаторкою та партнером",
    "Пояснення українською та російською",
  ],
  newTests: "Нові пробні іспити, що з’являться протягом дії пропуска, включено.",
  freeH: "Безкоштовне залишається безкоштовним",
  free: ["Пробний іспит 1 у кожній частині", "Усі безкоштовні тести, без реєстрації"],
  freeCta: "Тренуватися безкоштовно",
  summaryH: "Ваш екзаменаційний пропуск",
  summaryScope: "Усі частини, усі пробні іспити",
  saving: (amount) => `Ви заощаджуєте ${amount}`,
  ends: (date) => `Діє до ${date}`,
  endsAfter: (plan) => `Закінчується через ${plan}`,
  trust: ["Одноразова оплата, без підписки", "Закінчується сам, скасовувати не треба", "Ціна з 19 % ПДВ"],
  soon: "Незабаром",
  soonNote: "Незабаром пропуск можна буде купити тут. До того часу пробний іспит 1 у кожній частині безкоштовний.",
}

function monthsRu(n: number) {
  const m10 = n % 10
  const m100 = n % 100
  if (m10 === 1 && m100 !== 11) return "месяц"
  if (m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14)) return "месяца"
  return "месяцев"
}

const ru: PassCopy = {
  whenH: "Когда ваш экзамен?",
  when: [
    { id: "soon", label: "Через 4 недели или раньше", plan: "1m" },
    { id: "mid", label: "Через 1–3 месяца", plan: "3m" },
    { id: "none", label: "Даты ещё нет", plan: "3m" },
  ],
  whenHint: (plan) => `Для этого подходит вариант «${plan}». Но вы можете выбрать свободно.`,
  planH: "Сколько времени вы хотите тренироваться?",
  planName: (months) => `${months} ${monthsRu(months)}`,
  recommended: "Рекомендуем",
  oneTime: "разово",
  perMonth: (price) => `${price} в месяц`,
  save: (pct) => `−${pct} %`,
  compare: (months, price) => `вместо ${months} × ${price}`,
  includesH: "Что входит в пропуск",
  includes: [
    "Все пробные экзамены по Hören, Lesen, Schreiben и Sprechen",
    "Настоящие условия экзамена: время, порядок, результат B1, A2 или ниже A2",
    "Обратная связь по письму и говорению по критериям экзамена",
    "Говорение в паре, с экзаменатором и партнёром",
    "Объяснения на украинском и русском",
  ],
  newTests: "Новые пробные экзамены, которые появятся за время действия пропуска, включены.",
  freeH: "Бесплатное остаётся бесплатным",
  free: ["Пробный экзамен 1 в каждой части", "Все бесплатные тесты, без регистрации"],
  freeCta: "Тренироваться бесплатно",
  summaryH: "Ваш экзаменационный пропуск",
  summaryScope: "Все части, все пробные экзамены",
  saving: (amount) => `Вы экономите ${amount}`,
  ends: (date) => `Действует до ${date}`,
  endsAfter: (plan) => `Заканчивается через ${plan}`,
  trust: ["Разовая оплата, без подписки", "Заканчивается сам, отменять не нужно", "Цена с 19 % НДС"],
  soon: "Скоро в продаже",
  soonNote: "Скоро пропуск можно будет купить здесь. До тех пор пробный экзамен 1 в каждой части бесплатный.",
}

export const PASS_COPY: Record<SiteLocale, PassCopy> = { de, uk, ru }
