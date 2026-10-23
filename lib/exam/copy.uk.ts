// Ukrainian, machine-translated from `de` in ./copy.ts. Keep keys in sync.

import type { ExamCopy } from "./copy"

const plural = (n: number, one: string, few: string, many: string) => {
  const m10 = n % 10
  const m100 = n % 100
  if (!Number.isInteger(n)) return few
  if (m10 === 1 && m100 !== 11) return one
  if (m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14)) return few
  return many
}

const num = (n: number) => String(n).replace(".", ",")

export const uk: ExamCopy = {
  exit: "Завершити тест",
  overview: "Огляд",
  close: "Закрити",
  next: "Далі",
  check: "Перевірити",
  again: "Ще раз",
  start: "Почати",
  timeLeft: "Залишилося",
  task: "Завдання",
  part: "Частина",
  minutes: "хв",
  items: (n: number) => `${n} ${plural(n, "завдання", "завдання", "завдань")}`,
  play: "Відтворити",
  pause: "Пауза",
  instructions: "Інструкція",
  howItWorks: "Як це працює",
  heard: "Прослухано",
  hearOnce: "слухаєте один раз",
  hearTwice: "слухаєте двічі",
  playsLeft: (n: number) => `ще ${n}×`,
  noReplay: "Готово. Повтору немає.",
  switchLanguage: "Показати пояснення іншою мовою",
  transcriptLocked: "Транскрипт ви побачите після своєї відповіді.",
  track: { start: "Почати аудіювання", startNote: "Запис іде без пауз, кожен текст один раз.", phase: { instruction: "Оголошення", reading: "Час на читання", clip: "Аудіотекст", answer: "Час на відповідь" }, item: (ns: number[]) => (ns.length === 1 ? (ns[0] === 0 ? "Приклад" : `Номер ${ns[0]}`) : ns.length === 2 ? `Номери ${ns[0]} і ${ns[1]}` : ""), left: "ще", ended: "Аудіювання завершено." },
  richtig: "Richtig",
  falsch: "Falsch",
  right: "Правильно!",
  wrong: (key: string) => `Майже. Правильна відповідь: ${key}.`,
  yourAnswer: "Ваша відповідь",
  solution: "Відповідь",
  noMatch: "Жодне оголошення не підходить",
  noMatchText: "Для цієї ситуації немає оголошення.",
  situations: "Ситуації",
  gap: (n: number) => `Пропуск ${n}`,
  text: "Текст",
  tasks: (done: number, total: number) => `Завдання (${done}/${total})`,
  chooseTask: "Оберіть завдання",
  words: (n: number) => `${n} ${plural(n, "слово", "слова", "слів")}`,
  writeAbout: "Напишіть про всі пункти:",
  letter: "Ваш текст",
  yourTurn: (name: string) => `Ваша черга. Дайте відповідь: ${name}.`,
  recording: "Іде запис",
  record: "Відповісти",
  stopRecording: "Завершити запис",
  resultTitle: "Ваш результат",
  resultNote: "Тренувальний результат у форматі DTZ. Не офіційний результат telc.",
  nextStep: "Наступний крок",
  belowA2: "нижче A2",
  levelAria: "Рівень",
  correctOf: (n: number, total: number) => `${n} з ${total} правильно`,
  resultNotePoints: "Тренувальний результат у форматі іспиту. Не офіційний результат.",
  passed: "склав",
  failed: "не склав",
  points: (p: number, max: number) => `${num(p)} з ${num(max)} ${plural(max, "бала", "балів", "балів")}`,
  pointsShort: (p: number, max: number) => `${num(p)}/${num(max)}`,
  passMark: (pct: number) => `Склав від ${pct} %`,
  scoreAria: "Результат",
  cards: "Ваші картки",
  yourTask: "Ваше завдання",
  criteria: "Критерії",
  yourText: "З вашого тексту",
  better: "Краще",
  review: "Повторити",
  reviewNote: "Ці завдання були неправильні. Перегляньте їх ще раз.",
  open: "Переглянути",
  yours: "Ваша",
  newTest: "Новий пробний іспит",
  showAll: "Усі критерії",
  showLess: "Менше",
  partsTitle: "Ваші частини",
}
