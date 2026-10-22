// Russian, machine-translated from `de` in ./ui.ts. Keep keys in sync.

import type { UiCopy } from "./ui"

const minWord = (n: number) => {
  const m10 = n % 10
  const m100 = n % 100
  if (m10 === 1 && m100 !== 11) return "минута"
  if (m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14)) return "минуты"
  return "минут"
}

export const ru: UiCopy = {
  crumbsAria: "Навигационная цепочка",
  home: "Главная",
  /** The notice on machine-translated pages (AI Act art. 50), with a link to the German original. */
  machine: { text: "Эта страница переведена с немецкого машинным переводом.", original: "Оригинал на немецком" },
  langMenu: "Язык",
  footerCitizenship: "B1 для натурализации",
  vat: "USt-IdNr.",
  byline: { responsible: "Ответственный", stand: "По состоянию на", sources: "Источники" },
  testCta: "Начать бесплатный тест",
  blog: {
    crumb: "Блог",
    faq: "Частые вопросы",
    reviewed: (name: string, date: string) => `Проверено: ${name}, ${date}. У каждой цифры есть источник; список вы найдёте здесь.`,
    draft: "Черновик: ещё не проверен человеком. Виден только локально.",
    sources: "Источники",
    more: "Читать дальше",
    source: "Источник",
    stand: "По состоянию на",
    notes: { tipp: "Совет", info: "Полезно знать", wichtig: "Важно" },
    stripLink: "Попробовать бесплатно",
    stripMinutes: (min: number, approx?: boolean) => `${approx ? "ок. " : ""}${min} мин`,
    noteMark: (n: number) => `Примечание ${n}`,
    dont: "Так не надо",
    do: "Так правильно",
    toc: "В этой статье",
    quiz: "Проверьте себя",
    quizRight: "Верно. ",
    quizAnswer: (key: string) => `Правильный ответ: ${key}. `,
    filterAria: "Фильтр по теме",
    all: "Все",
    readingTime: (min: number) => `${min} ${minWord(min)} чтения`,
    minutesShort: (min: number) => `${min} мин.`,
    authorFallback: (role: string) => `${role}. У каждой цифры в наших статьях есть источник и дата.`,
    categories: { pruefungen: "Экзамены и результат", schreiben: "Письмо и говорение", tipps: "Советы и подготовка" },
    index: {
      title: "Блог: экзамены по немецкому и подготовка к ним",
      description: "Понятные ответы о DTZ, telc, Goethe и ÖSD: структура, результат, письмо и говорение. Каждая цифра с источником и датой.",
      h1: "Блог об",
      h1Muted: "экзаменах по немецкому",
      ctaH2: "Тренируйтесь бесплатно в формате настоящего экзамена",
      ctaText: "Выберите свой экзамен и пройдите тест за 5 минут. Без регистрации.",
      ctaButton: "Начать бесплатный тест",
    },
  },
}
