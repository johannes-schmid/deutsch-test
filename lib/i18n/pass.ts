import type { SiteLocale } from "@/lib/i18n/locale"
import type { PartId } from "@/lib/exam/types"

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
  /** The Teil-Pass layout (catalogue layout "skills"): any skills, all four for the price of three. */
  skills: {
    pickH: string
    pickHint: string
    skillName: Record<PartId, string>
    /** Several skills in one phrase ("Schreiben und Sprechen"). */
    names: (skills: PartId[]) => string
    all: string
    allNote: string
    oneFree: string
    freeExtra: string
    instead: (price: string) => string
    perMonth: string
    mostPracticed: string
    yours: string
    /** Under the picker, by the number of skills picked (0–4); null = no line. */
    nudge: (picked: number, perSkill: string, all: string) => string | null
    emptyPick: string
    includesH: string
    includesAll: string[]
    includesSkills: (skills: PartId[]) => string[]
    noSimulation: string
    scopeAll: string
    scopeSkills: string
    saving: (amount: string) => string
    monthly: string
    addLater: string
    upgradeH: string
    upgradeNow: (now: string, then: string) => string
    upgradeOrder: string
    renewingSkill: string
  }
}

const planName = (months: number) => (months === 1 ? "1 Monat" : `${months} Monate`)

// Skill names stay German in every locale: they are the exam's own terms.
const DE_SKILLS: Record<PartId, string> = { hoeren: "Hören", lesen: "Lesen", schreiben: "Schreiben", sprechen: "Sprechen" }
const joinDe = (names: string[]) => (names.length < 2 ? names.join("") : `${names.slice(0, -1).join(", ")} und ${names[names.length - 1]}`)

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
  skills: {
    pickH: "Was willst du üben?",
    pickHint: "Wähle einen oder mehrere Teile. Alle vier bekommst du zum Preis von drei.",
    skillName: DE_SKILLS,
    names: (skills) => joinDe(skills.map((s) => DE_SKILLS[s])),
    all: "Alle vier Teile",
    allNote: "Hören, Lesen, Schreiben und Sprechen, plus die Prüfungssimulation",
    oneFree: "1 Teil gratis",
    freeExtra: "Gratis dazu",
    instead: (price) => `statt 4 × ${price}`,
    perMonth: "im Monat",
    mostPracticed: "Am meisten geübt",
    yours: "Dein Pass",
    nudge: (picked, perSkill, all) =>
      picked === 1
        ? `Jeder weitere Teil kostet ${perSkill}. Ab drei Teilen bekommst du alle vier für ${all}.`
        : picked === 2
          ? `Nimm noch einen Teil dazu, dann bekommst du alle vier für ${all}.`
          : picked === 3
            ? "Der vierte Teil ist gratis dabei."
            : null,
    emptyPick: "Wähle mindestens einen Teil.",
    includesH: "Das ist dabei",
    includesAll: [
      "Alle Modelltests für Hören, Lesen, Schreiben und Sprechen",
      "Die Prüfungssimulation: alle Teile an einem Stück",
      "Feedback für Schreiben und Sprechen nach den Kriterien der Prüfung",
      "Sprechen zu zweit, mit Prüferin und Partner",
      "Erklärungen auf Ukrainisch und Russisch",
    ],
    includesSkills: (skills) => [
      `Alle Modelltests für ${joinDe(skills.map((s) => DE_SKILLS[s]))}, in jeder Prüfung`,
      "Echte Prüfungsbedingungen: Zeit, Ablauf und Ergebnis wie in der Prüfung",
      ...(skills.includes("hoeren") ? ["Audios mit mehreren Stimmen, so oft gespielt wie in der Prüfung"] : []),
      ...(skills.includes("lesen") ? ["Echte Textsorten: Briefe vom Amt, Anzeigen, Aushänge"] : []),
      ...(skills.includes("sprechen") ? ["Sprechen zu zweit, mit Prüferin und Partner"] : []),
      ...(skills.includes("schreiben") || skills.includes("sprechen") ? ["Feedback nach den Kriterien der Prüfung"] : []),
    ],
    noSimulation: "Prüfungssimulation: nur mit allen vier Teilen",
    scopeAll: "Alle Teile, alle Modelltests",
    scopeSkills: "alle Modelltests, jede Prüfung",
    saving: (amount) => `Du sparst ${amount} im Monat`,
    monthly: "Verlängert sich jeden Monat. Jederzeit kündbar.",
    addLater: "Später Teile dazunehmen: Du zahlst nur den Unterschied.",
    upgradeH: "Teile dazunehmen",
    upgradeNow: (now, then) => `Du zahlst jetzt ${now} für den Rest deines Monats. Danach ${then} im Monat.`,
    upgradeOrder: "Zahlungspflichtig dazunehmen",
    renewingSkill: "Das ist dein Pass. Wähle Teile dazu, um ihn zu erweitern.",
  },
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
  skills: {
    pickH: "Що ви хочете тренувати?",
    pickHint: "Виберіть одну або кілька частин. Усі чотири ви отримаєте за ціною трьох.",
    skillName: DE_SKILLS,
    names: (skills) => skills.map((s) => DE_SKILLS[s]).join(" і "),
    all: "Усі чотири частини",
    allNote: "Hören, Lesen, Schreiben і Sprechen, а також симуляція іспиту",
    oneFree: "1 частина безкоштовно",
    freeExtra: "Безкоштовно",
    instead: (price) => `замість 4 × ${price}`,
    perMonth: "на місяць",
    mostPracticed: "Найбільше тренувалися",
    yours: "Ваш пропуск",
    nudge: (picked, perSkill, all) =>
      picked === 1
        ? `Кожна наступна частина коштує ${perSkill}. Від трьох частин ви отримаєте всі чотири за ${all}.`
        : picked === 2
          ? `Додайте ще одну частину, і ви отримаєте всі чотири за ${all}.`
          : picked === 3
            ? "Четверта частина безкоштовно."
            : null,
    emptyPick: "Виберіть принаймні одну частину.",
    includesH: "Що входить",
    includesAll: [
      "Усі пробні іспити для Hören, Lesen, Schreiben і Sprechen",
      "Симуляція іспиту: усі частини поспіль",
      "Відгук на письмо та говоріння за критеріями іспиту",
      "Говоріння в парі, з екзаменаторкою та партнером",
      "Пояснення українською та російською",
    ],
    includesSkills: (skills) => [
      `Усі пробні іспити для ${skills.map((s) => DE_SKILLS[s]).join(" і ")}, у кожному іспиті`,
      "Справжні умови іспиту: час, порядок і результат, як на іспиті",
      ...(skills.includes("hoeren") ? ["Аудіо з кількома голосами, стільки разів, як на іспиті"] : []),
      ...(skills.includes("lesen") ? ["Справжні типи текстів: листи з установ, оголошення"] : []),
      ...(skills.includes("sprechen") ? ["Говоріння в парі, з екзаменаторкою та партнером"] : []),
      ...(skills.includes("schreiben") || skills.includes("sprechen") ? ["Відгук за критеріями іспиту"] : []),
    ],
    noSimulation: "Симуляція іспиту: лише з усіма чотирма частинами",
    scopeAll: "Усі частини, усі пробні іспити",
    scopeSkills: "усі пробні іспити, кожен іспит",
    saving: (amount) => `Ви заощаджуєте ${amount} на місяць`,
    monthly: "Продовжується щомісяця. Скасувати можна будь-коли.",
    addLater: "Пізніше додати частини: ви платите лише різницю.",
    upgradeH: "Додати частини",
    upgradeNow: (now, then) => `Зараз ви платите ${now} за решту місяця. Далі ${then} на місяць.`,
    upgradeOrder: "Додати з оплатою",
    renewingSkill: "Це ваш пропуск. Виберіть частини, щоб розширити його.",
  },
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
  skills: {
    pickH: "Что вы хотите тренировать?",
    pickHint: "Выберите одну или несколько частей. Все четыре вы получите по цене трёх.",
    skillName: DE_SKILLS,
    names: (skills) => skills.map((s) => DE_SKILLS[s]).join(" и "),
    all: "Все четыре части",
    allNote: "Hören, Lesen, Schreiben и Sprechen, а также симуляция экзамена",
    oneFree: "1 часть бесплатно",
    freeExtra: "Бесплатно",
    instead: (price) => `вместо 4 × ${price}`,
    perMonth: "в месяц",
    mostPracticed: "Больше всего тренировались",
    yours: "Ваш пропуск",
    nudge: (picked, perSkill, all) =>
      picked === 1
        ? `Каждая следующая часть стоит ${perSkill}. С трёх частей вы получите все четыре за ${all}.`
        : picked === 2
          ? `Добавьте ещё одну часть, и вы получите все четыре за ${all}.`
          : picked === 3
            ? "Четвёртая часть бесплатно."
            : null,
    emptyPick: "Выберите хотя бы одну часть.",
    includesH: "Что входит",
    includesAll: [
      "Все пробные экзамены по Hören, Lesen, Schreiben и Sprechen",
      "Симуляция экзамена: все части подряд",
      "Обратная связь по письму и говорению по критериям экзамена",
      "Говорение в паре, с экзаменатором и партнёром",
      "Объяснения на украинском и русском",
    ],
    includesSkills: (skills) => [
      `Все пробные экзамены по ${skills.map((s) => DE_SKILLS[s]).join(" и ")}, в каждом экзамене`,
      "Настоящие условия экзамена: время, порядок и результат, как на экзамене",
      ...(skills.includes("hoeren") ? ["Аудио с несколькими голосами, столько раз, как на экзамене"] : []),
      ...(skills.includes("lesen") ? ["Настоящие типы текстов: письма из учреждений, объявления"] : []),
      ...(skills.includes("sprechen") ? ["Говорение в паре, с экзаменатором и партнёром"] : []),
      ...(skills.includes("schreiben") || skills.includes("sprechen") ? ["Обратная связь по критериям экзамена"] : []),
    ],
    noSimulation: "Симуляция экзамена: только со всеми четырьмя частями",
    scopeAll: "Все части, все пробные экзамены",
    scopeSkills: "все пробные экзамены, каждый экзамен",
    saving: (amount) => `Вы экономите ${amount} в месяц`,
    monthly: "Продлевается каждый месяц. Отменить можно в любой момент.",
    addLater: "Позже добавить части: вы платите только разницу.",
    upgradeH: "Добавить части",
    upgradeNow: (now, then) => `Сейчас вы платите ${now} за остаток месяца. Затем ${then} в месяц.`,
    upgradeOrder: "Добавить с оплатой",
    renewingSkill: "Это ваш пропуск. Выберите части, чтобы расширить его.",
  },
}

export const PASS_COPY: Record<SiteLocale, PassCopy> = { de, uk, ru }
