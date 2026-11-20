import type { Goal } from "@/lib/lifecycle/onboarding"
import type { SiteLocale } from "./locale"

/** The onboarding after a free test (components/paywall/onboarding.tsx). en/uk/ru are machine-translated from German. */
const de = {
  label: "Konto einrichten",
  progress: (step: number, total: number) => `Schritt ${step} von ${total}`,
  back: "Zurück",
  close: "Zum Ergebnis",
  skip: "Überspringen",
  next: "Weiter",
  exam: {
    h1: "Für welche Prüfung übst du?",
    lead: "Wir richten dein Konto auf diese Prüfung ein.",
    yourTest: "Dein Test",
    more: "Andere Prüfung wählen",
  },
  date: {
    h1: "Wann ist deine Prüfung?",
    lead: "Dann wissen wir, wie viel Zeit du noch hast.",
    options: { date: "Ich habe einen Termin", soon: "In den nächsten 3 Monaten", later: "Später", open: "Weiß ich noch nicht" },
    pick: "Dein Prüfungstag",
    invalid: "Wähl einen Tag ab heute.",
  },
  goal: {
    h1: "Wofür brauchst du die Prüfung?",
    lead: "Eine Antwort reicht.",
    options: {
      einbuergerung: "Einbürgerung",
      aufenthalt: "Aufenthaltserlaubnis oder Niederlassung",
      integrationskurs: "Integrationskurs abschließen",
      arbeit: "Arbeit oder Ausbildung",
      andere: "Etwas anderes",
    } satisfies Record<Goal, string>,
  },
  done: {
    h1: "Fast fertig.",
    h1Muted: "Melde dich an und üb direkt weiter.",
    next: (skill: string) => `Als Nächstes: Modelltest 1 ${skill}. Die erste Hälfte ist gratis.`,
    nextPlain: "Als Nächstes: Modelltest 1. Die erste Hälfte ist gratis.",
    date: (d: string) => `Prüfung am ${d}`,
    google: { label: "Mit Google weiter", pending: "Google wird geöffnet …" },
    login: "Schon ein Konto? Der gleiche Knopf meldet dich an.",
  },
}

export type OnboardingCopy = typeof de

const en: OnboardingCopy = {
  label: "Set up your account",
  progress: (step, total) => `Step ${step} of ${total}`,
  back: "Back",
  close: "Back to result",
  skip: "Skip",
  next: "Next",
  exam: { h1: "Which exam are you practicing for?", lead: "We set up your account for this exam.", yourTest: "Your test", more: "Choose another exam" },
  date: {
    h1: "When is your exam?",
    lead: "Then we know how much time you have left.",
    options: { date: "I have a date", soon: "In the next 3 months", later: "Later", open: "I don't know yet" },
    pick: "Your exam day",
    invalid: "Pick a day from today on.",
  },
  goal: {
    h1: "What do you need the exam for?",
    lead: "One answer is enough.",
    options: { einbuergerung: "Citizenship", aufenthalt: "Residence or settlement permit", integrationskurs: "Finishing the integration course", arbeit: "Work or training", andere: "Something else" },
  },
  done: {
    h1: "Almost done.",
    h1Muted: "Sign in and keep practicing right away.",
    next: (skill) => `Next: Modelltest 1 ${skill}. The first half is free.`,
    nextPlain: "Next: Modelltest 1. The first half is free.",
    date: (d) => `Exam on ${d}`,
    google: { label: "Continue with Google", pending: "Opening Google …" },
    login: "Already have an account? The same button signs you in.",
  },
}

const uk: OnboardingCopy = {
  label: "Налаштувати акаунт",
  progress: (step, total) => `Крок ${step} з ${total}`,
  back: "Назад",
  close: "До результату",
  skip: "Пропустити",
  next: "Далі",
  exam: { h1: "До якого іспиту ви готуєтеся?", lead: "Ми налаштуємо ваш акаунт під цей іспит.", yourTest: "Ваш тест", more: "Вибрати інший іспит" },
  date: {
    h1: "Коли ваш іспит?",
    lead: "Тоді ми знаємо, скільки часу у вас залишилося.",
    options: { date: "У мене є дата", soon: "У найближчі 3 місяці", later: "Пізніше", open: "Ще не знаю" },
    pick: "День вашого іспиту",
    invalid: "Виберіть день, починаючи з сьогодні.",
  },
  goal: {
    h1: "Для чого вам потрібен іспит?",
    lead: "Достатньо однієї відповіді.",
    options: { einbuergerung: "Громадянство", aufenthalt: "Дозвіл на проживання або ПМП", integrationskurs: "Завершити інтеграційний курс", arbeit: "Робота або навчання", andere: "Щось інше" },
  },
  done: {
    h1: "Майже готово.",
    h1Muted: "Увійдіть і одразу тренуйтеся далі.",
    next: (skill) => `Далі: Modelltest 1 ${skill}. Перша половина безкоштовна.`,
    nextPlain: "Далі: Modelltest 1. Перша половина безкоштовна.",
    date: (d) => `Іспит ${d}`,
    google: { label: "Продовжити з Google", pending: "Відкриваємо Google …" },
    login: "Вже маєте акаунт? Ця ж кнопка виконає вхід.",
  },
}

const ru: OnboardingCopy = {
  label: "Настроить аккаунт",
  progress: (step, total) => `Шаг ${step} из ${total}`,
  back: "Назад",
  close: "К результату",
  skip: "Пропустить",
  next: "Далее",
  exam: { h1: "К какому экзамену вы готовитесь?", lead: "Мы настроим ваш аккаунт под этот экзамен.", yourTest: "Ваш тест", more: "Выбрать другой экзамен" },
  date: {
    h1: "Когда ваш экзамен?",
    lead: "Тогда мы знаем, сколько у вас осталось времени.",
    options: { date: "У меня есть дата", soon: "В ближайшие 3 месяца", later: "Позже", open: "Ещё не знаю" },
    pick: "День вашего экзамена",
    invalid: "Выберите день, начиная с сегодняшнего.",
  },
  goal: {
    h1: "Для чего вам нужен экзамен?",
    lead: "Достаточно одного ответа.",
    options: { einbuergerung: "Гражданство", aufenthalt: "Вид на жительство или ПМЖ", integrationskurs: "Завершить интеграционный курс", arbeit: "Работа или учёба", andere: "Другое" },
  },
  done: {
    h1: "Почти готово.",
    h1Muted: "Войдите и сразу продолжайте тренироваться.",
    next: (skill) => `Дальше: Modelltest 1 ${skill}. Первая половина бесплатна.`,
    nextPlain: "Дальше: Modelltest 1. Первая половина бесплатна.",
    date: (d) => `Экзамен ${d}`,
    google: { label: "Продолжить с Google", pending: "Открываем Google …" },
    login: "Уже есть аккаунт? Эта же кнопка выполнит вход.",
  },
}

export const ONBOARDING_COPY: Record<SiteLocale, OnboardingCopy> = { de, en, uk, ru }
