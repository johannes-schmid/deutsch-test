import Link from "next/link"
import { LevelScale } from "@/components/design/kit"
import { PartIcon } from "@/components/design/variants/nachtzug-icons"
import type { BlogPost } from "@/lib/blog/types"
import type { SkillId } from "@/lib/design/content"
import { dtzPruefung as de } from "@/data/blog/dtz-pruefung"

const SKILLS: { id: SkillId; name: string; time: string; text: string }[] = [
  { id: "hoeren", name: "Аудіювання (Hören)", time: "бл. 25 хв", text: "Оголошення, повідомлення та розмови з повсякдення." },
  { id: "lesen", name: "Читання (Lesen)", time: "45 хв", text: "Листи від установ, оголошення на дошці та в газеті." },
  { id: "schreiben", name: "Письмо (Schreiben)", time: "30 хв", text: "Один лист або e-mail." },
  { id: "sprechen", name: "Говоріння (Sprechen)", time: "бл. 16 хв", text: "Удвох, як на справжньому іспиті." },
]

export const dtzPruefung: BlogPost = {
  ...de,
  locale: "uk",
  title: "Іспит DTZ: структура, перебіг і оцінювання",
  crumb: "Іспит DTZ",
  description: "Як побудований Deutsch-Test für Zuwanderer: чотири частини, час, завдання і результат B1, A2 або нижче A2. Просто пояснюємо.",
  h1: "Іспит DTZ: структура, перебіг і оцінювання",
  lead: "Deutsch-Test für Zuwanderer (DTZ) — це мовний іспит наприкінці інтеграційного курсу (Integrationskurs). Тут ви побачите, як він побудований.",
  cover: {
    ...de.cover,
    label: "Чотири частини DTZ: Hören, Lesen, Schreiben, Sprechen",
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
      { k: "Результат", v: "B1, A2 або нижче A2" },
    ],
  },
  sections: [
    {
      id: "was-ist-der-dtz",
      title: "Що таке DTZ?",
      body: (
        <>
          <p>
            DTZ перевіряє вашу німецьку на рівнях A2 і B1. Це один іспит для обох рівнів. Тож вам не треба обирати
            рівень.
          </p>
          <p>
            Більшість людей складає DTZ наприкінці інтеграційного курсу. Його можна скласти ще раз, наприклад якщо
            першого разу ви отримали A2.
          </p>
        </>
      ),
    },
    {
      id: "die-vier-teile",
      title: "Чотири частини",
      body: (
        <>
          <p>DTZ має чотири частини. Аудіювання, читання і письмо ви складаєте письмово. Говоріння — удвох.</p>
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
      title: "Результат: B1, A2 або нижче A2",
      body: (
        <>
          <p>
            У DTZ немає «склав» чи «не склав» (bestanden / nicht bestanden). Ви отримуєте рівень: <strong>B1</strong>,{" "}
            <strong>A2</strong> або <strong>нижче A2</strong>.
          </p>
          <div>
            <LevelScale level="B1" belowLabel="нижче A2" ariaLabel="Можливі результати DTZ" />
          </div>
          <p>
            Для <strong>Zertifikat Integrationskurs</strong> вам потрібні дві речі: B1 у DTZ і тест
            «Leben in Deutschland». Так написано в § 17 Integrationskursverordnung.
          </p>
          <p>
            Як саме рахуються бали для B1 і A2, читайте в статті <Link href="/uk/blog/dtz-bestehen">Як скласти DTZ</Link>.
            Вам потрібен B1 для натуралізації? Тоді прочитайте нашу сторінку{" "}
            <Link href="/uk/b1-einbuergerung">B1 для натуралізації</Link>. У вас лише A2? Тоді вам допоможе сторінка{" "}
            <Link href="/uk/a2-zu-b1">Від A2 до B1</Link>.
          </p>
        </>
      ),
    },
    {
      id: "vorbereitung",
      title: "Як підготуватися",
      body: (
        <>
          <ol>
            <li>Пройдіть пробний іспит (Modelltest) в умовах іспиту. З часом і без паузи.</li>
            <li>Подивіться, якій частині ще бракує до B1.</li>
            <li>Тренуйте саме цю частину. Потім знову пройдіть повний тест.</li>
          </ol>
          <p>
            Наші пробні іспити мають ті самі частини, час і типи завдань, що й DTZ. Ми не пов’язані з BAMF, telc або
            g.a.s.t. Усі завдання ми пишемо самі.
          </p>
        </>
      ),
    },
  ],
  faq: [],
  cta: { title: "Наскільки ви далекі від B1?", text: "Пройдіть одну частину DTZ як безкоштовний тест. Без реєстрації, з результатом як на іспиті.", href: "/uk/gratis-test/dtz", button: "Почати безкоштовний тест" },
}
