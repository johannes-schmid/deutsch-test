import Link from "next/link"
import { LevelScale } from "@/components/design/kit"
import { PartIcon } from "@/components/design/variants/nachtzug-icons"
import type { SkillId } from "@/lib/design/content"
import type { BlogPost } from "@/lib/blog/types"
import { dtzPruefung as de } from "@/data/blog/dtz-pruefung"

const SKILLS: { id: SkillId; name: string; time: string; text: string }[] = [
  { id: "hoeren", name: "Аудирование (Hören)", time: "ок. 25 мин", text: "Объявления, сообщения по громкой связи и разговоры из повседневной жизни." },
  { id: "lesen", name: "Чтение (Lesen)", time: "45 мин", text: "Письма от ведомств, объявления на доске и объявления в газете." },
  { id: "schreiben", name: "Письмо (Schreiben)", time: "30 мин", text: "Одно письмо или e-mail." },
  { id: "sprechen", name: "Говорение (Sprechen)", time: "ок. 16 мин", text: "Вдвоём, как на настоящем экзамене." },
]

export const dtzPruefung: BlogPost = {
  ...de,
  locale: "ru",
  title: "Экзамен DTZ: структура, ход и оценка",
  crumb: "Экзамен DTZ",
  description: "Как устроен Deutsch-Test für Zuwanderer: четыре части, время, задания и результат B1, A2 или ниже A2. Простыми словами.",
  h1: "Экзамен DTZ: структура, ход и оценка",
  lead: "Deutsch-Test für Zuwanderer (DTZ) — это языковой экзамен в конце интеграционного курса (Integrationskurs). Здесь вы увидите, как он устроен.",
  cover: {
    ...de.cover,
    label: "Четыре части DTZ: Hören, Lesen, Schreiben, Sprechen",
    mini: (
      <span className="nz-app grid grid-cols-2 gap-1.5 rounded-[14px] p-2.5">
        {SKILLS.map((s) => <PartIcon key={s.id} part={s.id} size="sm" />)}
      </span>
    ),
    art: (
      <ul className="nz-app grid grid-cols-2 gap-3 rounded-[24px] p-5">
        {SKILLS.map((s) => (
          <li key={s.id} className="flex items-center gap-3">
            <PartIcon part={s.id} size="md" />
            <span className="flex flex-col">
              <span className="text-[15px] font-semibold">{s.name}</span>
              <span className="v-num text-[12.5px] text-v-muted">{s.time}</span>
            </span>
          </li>
        ))}
      </ul>
    ),
  },
  summary: {
    title: "DTZ коротко",
    rows: [
      ...SKILLS.map((s) => ({ k: s.name, v: s.time })),
      { k: "Результат", v: "B1, A2 или ниже A2" },
    ],
  },
  sections: [
    {
      id: "was-ist-der-dtz",
      title: "Что такое DTZ?",
      body: (
        <>
          <p>
            DTZ проверяет ваш немецкий на уровнях A2 и B1. Это один экзамен для обоих уровней. Значит, выбирать
            уровень вам не нужно.
          </p>
          <p>
            Большинство людей сдают DTZ в конце интеграционного курса. Его можно сдать и ещё раз, например если в
            первый раз у вас был A2.
          </p>
        </>
      ),
    },
    {
      id: "die-vier-teile",
      title: "Четыре части",
      body: (
        <>
          <p>В DTZ четыре части. Аудирование, чтение и письмо вы сдаёте письменно. Говорение вы сдаёте вдвоём.</p>
          <div>
            <ul className="grid gap-3 sm:grid-cols-2">
              {SKILLS.map((s) => (
                <li key={s.id} className="nz-app flex items-start gap-4 rounded-[18px] p-5">
                  <PartIcon part={s.id} size="md" />
                  <div>
                    <p className="flex items-baseline gap-2">
                      <span className="text-[17px] font-semibold">{s.name}</span>
                      <span className="v-num text-[13px] text-v-muted">{s.time}</span>
                    </p>
                    <p className="mt-1 text-[15px] leading-relaxed text-v-muted">{s.text}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </>
      ),
    },
    {
      id: "ergebnis",
      title: "Результат: B1, A2 или ниже A2",
      body: (
        <>
          <p>
            В DTZ нет оценки «сдал» или «не сдал» (bestanden / nicht bestanden). Вы получаете уровень: <strong>B1</strong>,{" "}
            <strong>A2</strong> или <strong>ниже A2</strong>.
          </p>
          <div>
            <LevelScale level="B1" belowLabel="ниже A2" ariaLabel="Возможные результаты в DTZ" />
          </div>
          <p>
            Для <strong>Zertifikat Integrationskurs</strong> вам нужны две вещи: B1 в DTZ и тест
            «Leben in Deutschland». Так написано в § 17 Integrationskursverordnung.
          </p>
          <p>
            Как именно считаются баллы для B1 и A2, читайте в статье <Link href="/ru/blog/dtz-bestehen">Как сдать DTZ</Link>.
            Вам нужен B1 для натурализации (гражданства)? Тогда прочитайте нашу страницу{" "}
            <Link href="/ru/b1-einbuergerung">B1 для натурализации</Link>. У вас был только A2? Тогда вам поможет{" "}
            <Link href="/ru/a2-zu-b1">От A2 к B1</Link>.
          </p>
        </>
      ),
    },
    {
      id: "vorbereitung",
      title: "Как подготовиться",
      body: (
        <>
          <ol>
            <li>Пройдите пробный экзамен (Modelltest) в условиях экзамена. С таймером и без пауз.</li>
            <li>Посмотрите, какой части вам ещё не хватает до B1.</li>
            <li>Тренируйте именно эту часть. Потом снова пройдите весь тест.</li>
          </ol>
          <p>
            В наших пробных экзаменах те же части, то же время и те же типы заданий, что и в DTZ. Мы не связаны с
            BAMF, telc или g.a.s.t. Все задания мы пишем сами.
          </p>
        </>
      ),
    },
  ],
  faq: [],
  cta: { title: "Насколько вы далеки от B1?", text: "Пройдите одну часть DTZ как бесплатный тест. Без регистрации, с результатом как на экзамене.", href: "/ru/gratis-test/dtz", button: "Начать бесплатный тест" },
}
