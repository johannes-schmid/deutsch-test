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
  /** Under a price: what the first payment covers. */
  forTerm: (plan: string) => string
  /** What follows the first term (monthly renewal at the 1-month price, cancellable). */
  renews: (price: string) => string
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
  /** Public /preise: the button leads into the portal (Google sign-in first). */
  buy: string
  buyNote: string
  /** Portal checkout. TODO(hannes): have the consent wording (§ 356 Abs. 5 / § 357a BGB) checked before going live. */
  consent: string
  consentNeeded: string
  order: string
  ordering: string
  payNote: string
  /** Under the order button: the AGB and the Widerrufsbelehrung (German-only pages). */
  legal: { pre: string; terms: string; mid: string; withdrawal: string }
  error: string
  renewing: string
  renewingCta: string
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
  forTerm: (plan) => `für ${plan}`,
  renews: (price) => `Danach ${price} im Monat. Jederzeit kündbar.`,
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
  ends: (date) => `Erste Laufzeit bis ${date}`,
  endsAfter: (plan) => `Erste Laufzeit: ${plan}`,
  trust: ["Kündigen mit einem Klick im Konto", "Preis inkl. MwSt."],
  buy: "Pass kaufen",
  buyNote: "Du meldest dich mit Google an. Dann geht es zur Zahlung.",
  consent: "Mein Pass soll sofort starten. Mir ist bekannt, dass mein Widerrufsrecht damit erlischt.",
  consentNeeded: "Bitte bestätige zuerst, dass dein Pass sofort starten soll.",
  order: "Zahlungspflichtig bestellen",
  ordering: "Weiter zur Zahlung …",
  payNote: "Du zahlst sicher über Mollie. Danach bist du sofort wieder hier.",
  legal: { pre: "Es gelten unsere", terms: "AGB", mid: ". Mehr zum Widerruf in der", withdrawal: "Widerrufsbelehrung" },
  error: "Die Zahlung konnte nicht starten. Versuch es noch einmal.",
  renewing: "Dein Pass läuft schon und verlängert sich jeden Monat.",
  renewingCta: "Zu deinem Konto",
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
  forTerm: (plan) => `за ${plan}`,
  renews: (price) => `Далі ${price} на місяць. Скасувати можна будь-коли.`,
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
  ends: (date) => `Перший період до ${date}`,
  endsAfter: (plan) => `Перший період: ${plan}`,
  trust: ["Скасування одним кліком в акаунті", "Ціна з ПДВ"],
  buy: "Купити пропуск",
  buyNote: "Ви входите через Google. Потім переходите до оплати.",
  consent: "Мій пропуск має почати діяти одразу. Я знаю, що через це втрачаю право на відмову.",
  consentNeeded: "Спочатку підтвердьте, що пропуск має почати діяти одразу.",
  order: "Замовити з оплатою",
  ordering: "Перехід до оплати …",
  payNote: "Ви безпечно платите через Mollie. Потім одразу повертаєтеся сюди.",
  legal: { pre: "Діють наші", terms: "умови (AGB)", mid: ". Про відмову від договору:", withdrawal: "Widerrufsbelehrung" },
  error: "Не вдалося почати оплату. Спробуйте ще раз.",
  renewing: "Ваш пропуск уже діє і продовжується щомісяця.",
  renewingCta: "До акаунта",
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
  forTerm: (plan) => `на ${plan}`,
  renews: (price) => `Затем ${price} в месяц. Отменить можно в любой момент.`,
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
  ends: (date) => `Первый период до ${date}`,
  endsAfter: (plan) => `Первый период: ${plan}`,
  trust: ["Отмена одним кликом в аккаунте", "Цена с НДС"],
  buy: "Купить пропуск",
  buyNote: "Вы входите через Google. Затем переходите к оплате.",
  consent: "Мой пропуск должен начать действовать сразу. Я знаю, что из-за этого теряю право на отказ.",
  consentNeeded: "Сначала подтвердите, что пропуск должен начать действовать сразу.",
  order: "Заказать с оплатой",
  ordering: "Переход к оплате …",
  payNote: "Вы безопасно платите через Mollie. Затем сразу возвращаетесь сюда.",
  legal: { pre: "Действуют наши", terms: "условия (AGB)", mid: ". Об отказе от договора:", withdrawal: "Widerrufsbelehrung" },
  error: "Не удалось начать оплату. Попробуйте ещё раз.",
  renewing: "Ваш пропуск уже действует и продлевается каждый месяц.",
  renewingCta: "В аккаунт",
}

export const PASS_COPY: Record<SiteLocale, PassCopy> = { de, uk, ru }
