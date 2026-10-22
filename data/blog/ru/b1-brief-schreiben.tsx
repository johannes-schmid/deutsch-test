import Link from "next/link"
import { Check, PenLine } from "lucide-react"
import { Compare, DataTable, DoDont, FactBox, LetterSample, Note, Steps } from "@/components/design/article"
import { QuizCard } from "@/components/design/article-interactive"
import { ExamMark } from "@/components/design/variants/nachtzug-icons"
import type { BlogPost } from "@/lib/blog/types"
import { b1BriefSchreiben as de } from "@/data/blog/b1-brief-schreiben"

const G3 = { name: "g.a.s.t.: DTZ Übungssatz 2 (06/2024), S. 24 und 42", url: "https://www.gast.de/fileadmin/gast.de/GAST/5_DTZ/PDF/gast_DTZ_UEbungssatz_2.pdf" }

export const b1BriefSchreiben: BlogPost = {
  ...de,
  locale: "ru",
  title: "Экзамен B1, письмо: Brief и e-mail с примером",
  crumb: "Экзамен B1: письмо",
  description: "Как написать письмо на экзамене B1: структура, полезные фразы и пример. Для DTZ и telc Deutsch B1, по настоящим критериям оценки.",
  h1: "Экзамен B1, письмо: как написать хорошее письмо",
  lead: "В DTZ и telc B1 вы пишете письмо или e-mail. Здесь вы узнаете структуру и полезные фразы. И увидите целый пример.",
  cover: {
    ...de.cover,
    label: "Письмо с четырьмя отмеченными пунктами",
    art: (
      <div className="nz-app flex flex-col gap-4 rounded-[24px] p-6 text-[15px]">
        <div className="flex items-center gap-2 text-v-muted">
          <PenLine className="size-4" strokeWidth={1.75} aria-hidden="true" /> 30 мин.
        </div>
        <p className="font-semibold">Sehr geehrte Frau Kaya,</p>
        <div className="flex flex-col gap-2" aria-hidden="true">
          <span className="h-2 w-full rounded-full bg-v-soft" />
          <span className="h-2 w-[86%] rounded-full bg-v-soft" />
          <span className="h-2 w-[64%] rounded-full bg-v-soft" />
        </div>
        <ul className="grid grid-cols-2 gap-2 text-[13.5px]">
          {["Причина", "Новая дата", "Плата", "Ответ"].map((p) => (
            <li key={p} className="flex items-center gap-2">
              <span className="grid size-5 place-items-center rounded-full bg-(--p-glow) text-[#0A0D18]"><Check className="size-3" strokeWidth={2.75} aria-hidden="true" /></span>
              {p}
            </li>
          ))}
        </ul>
      </div>
    ),
  },
  summary: {
    title: "Задание в DTZ",
    rows: [
      { k: "Время", v: "30 минут" },
      { k: "Задание", v: "выбрать A или B, письмо или e-mail" },
      { k: "Содержание", v: "4 пункта, плюс обращение и прощание" },
      { k: "Объём", v: "без точного числа слов" },
    ],
  },
  sections: [
    {
      id: "aufgabe",
      title: "Что вы пишете на экзамене",
      body: (
        <>
          <p>
            В DTZ и telc Deutsch B1 вы пишете <strong>один текст за 30 минут</strong>. Вы получаете короткую ситуацию и четыре
            пункта. По каждому пункту нужно что-то написать. В Goethe- и ÖSD-Zertifikat по-другому: там вы пишете три более
            коротких текста.
          </p>
          <Compare
            l="ru"
            items={[
              {
                mark: <ExamMark brand="dtz" />,
                title: "DTZ",
                rows: [
                  { k: "Задание", v: "выбрать задание A или B" },
                  { k: "Текст", v: "письмо или e-mail, полуофициальный или официальный" },
                  { k: "Пункты", v: "4, плюс обращение и прощание" },
                  { k: "Объём", v: "без точного числа слов" },
                ],
              },
              {
                mark: <ExamMark brand="telc" />,
                title: "telc Deutsch B1",
                rows: [
                  { k: "Задание", v: "ответить на 1 e-mail" },
                  { k: "Текст", v: "неофициальный или полуофициальный" },
                  { k: "Пункты", v: "4 опорных пункта (Leitpunkte)" },
                  { k: "Объём", v: "без точного числа слов" },
                ],
              },
            ]}
          />
          <p>
            Эта статья показывает письмо для DTZ и telc B1. Но советы по структуре помогут вам и на Goethe и ÖSD.
          </p>
        </>
      ),
    },
    {
      id: "bewertung",
      title: "На что смотрят экзаменаторы",
      body: (
        <>
          <p>Экзаменаторы оценивают текст по точным критериям. В DTZ их четыре:</p>
          <ol>
            <li><strong>Выполнение задания (Aufgabenbewältigung):</strong> вы написали что-то по всем пунктам?</li>
            <li><strong>Коммуникативное оформление (Kommunikative Gestaltung):</strong> текст хорошо построен? Подходят ли обращение и тон?</li>
            <li><strong>Правильность (Korrektheit):</strong> насколько хороши грамматика и орфография?</li>
            <li><strong>Словарный запас (Wortschatz):</strong> вы используете подходящие слова?</li>
          </ol>
          <FactBox l="ru" source={G3} checked="10/2026">
            Если текст в DTZ не подходит к заданию, по всем четырём критериям ставят 0 баллов.
          </FactBox>
          <p>
            В telc Deutsch B1 критериев три: выполнение задания, коммуникативное оформление и формальная правильность (Formale
            Richtigkeit). Для выполнения задания там важно, сколько из четырёх опорных пунктов вы раскрыли как надо.
          </p>
          <p>
            Сколько баллов нужно в DTZ для B1, читайте в статье{" "}
            <Link href="/ru/blog/dtz-bestehen">Как сдать DTZ: как устроен результат</Link>.
          </p>
          <Note l="ru" kind="tipp" title="Главное — в первую очередь">
            <p>
              Забытый пункт стоит больше, чем грамматическая ошибка. Лучше простые предложения по всем четырём пунктам, чем
              красивые предложения только по трём.
            </p>
          </Note>
        </>
      ),
    },
    {
      id: "aufbau",
      title: "Структура в шесть шагов",
      body: (
        <>
          <p>У хорошего экзаменационного письма всегда одни и те же части. Если вы их знаете, на экзамене не придётся долго думать.</p>
          <Steps
            items={[
              { title: "Тема (Betreff)", text: "В e-mail: короткая тема, например «Abmeldung vom Kurs am Samstag»." },
              { title: "Обращение (Anrede)", text: "Официально: «Sehr geehrte Frau Kaya,». Если вы не знаете имени: «Sehr geehrte Damen und Herren,»." },
              { title: "Вступление (Einleitung)", text: "Одно предложение о том, почему вы пишете: «ich schreibe Ihnen, weil …»." },
              { title: "Четыре пункта", text: "По каждому пункту два-три предложения. Лучше всего в порядке задания." },
              { title: "Заключение (Schluss)", text: "Просьба или благодарность: «Ich freue mich auf Ihre Antwort.»" },
              { title: "Прощание (Gruß)", text: "Официально: «Mit freundlichen Grüßen» и ваше имя." },
            ]}
          />
          <Note l="ru" kind="info">
            <p>
              Отправителя, адрес и дату в e-mail писать не нужно. Так сказано в указаниях по оценке telc.
            </p>
          </Note>
        </>
      ),
    },
    {
      id: "beispiel",
      title: "Пример с объяснением",
      body: (
        <>
          <p>
            Это задание мы написали сами. Оно построено так же, как задание в DTZ. <strong>Ситуация:</strong>{" "}
            Вы записались на курс первой помощи в народном университете (Volkshochschule). В субботу вы не можете прийти.
            Напишите руководительнице курса, фрау Кайя (Frau Kaya).
          </p>
          <ul>
            <li>Grund, warum du nicht kommen kannst (причина, почему вы не можете прийти)</li>
            <li>nach einem neuen Termin fragen (спросить о новой дате)</li>
            <li>Kursgebühr (плата за курс)</li>
            <li>um eine Antwort bitten (попросить ответить)</li>
          </ul>
          <LetterSample
            l="ru"
            title="Пример: e-mail руководительнице курса"
            lines={[
              { text: "Betreff: Erste-Hilfe-Kurs am Samstag", mark: 1 },
              { text: "Sehr geehrte Frau Kaya,", mark: 2 },
              { text: "ich habe den Erste-Hilfe-Kurs am Samstag, den 14. November, gebucht. Leider kann ich an diesem Tag nicht kommen.", mark: 3 },
              { text: "Mein Sohn hat am Samstag ein Fußballturnier in Köln. Ich muss ihn fahren, weil mein Mann arbeitet.", mark: 4 },
              { text: "Gibt es den Kurs bald noch einmal? Ich habe am Wochenende Zeit, aber auch am Mittwochabend.", mark: 5 },
              { text: "Ich habe die Kursgebühr von 40 Euro schon bezahlt. Kann ich das Geld für den neuen Termin benutzen? Wenn das nicht geht, bitte ich Sie um eine Rückzahlung.", mark: 6 },
              { text: "Können Sie mir bitte bis Freitag antworten? Vielen Dank für Ihre Hilfe.", mark: 7 },
              { text: "Mit freundlichen Grüßen", mark: 8 },
              { text: "Amira Haddad", join: true },
            ]}
            notes={[
              { n: 1, text: "Короткая тема. Так фрау Кайя сразу понимает, о чём речь." },
              { n: 2, text: "Официальное обращение с именем, после него запятая. Следующее предложение начинается с маленькой буквы." },
              { n: 3, text: "Вступление: о чём речь? Хватит одного-двух предложений." },
              { n: 4, text: "Пункт 1, причина. С «weil» вы соединяете два предложения. Это показывает уровень B1." },
              { n: 5, text: "Пункт 2, новая дата. Вопрос и конкретное предложение." },
              { n: 6, text: "Пункт 3, плата. Здесь просьба с альтернативой: «Wenn das nicht geht …»." },
              { n: 7, text: "Пункт 4 и заключение: вежливая просьба и благодарность." },
              { n: 8, text: "Официальное прощание без запятой, затем ваше имя." },
            ]}
          />
          <p>
            В письме около 100 слов. Точного числа слов в DTZ нет. Важно другое: на каждый пункт есть ясный ответ, и предложения
            связаны между собой.
          </p>
        </>
      ),
    },
    {
      id: "saetze",
      title: "Фразы, которые подходят почти всегда",
      body: (
        <>
          <p>
            Выучите эти фразы наизусть. Тогда на экзамене у вас будет больше времени на содержание. Официально вы пишете в
            ведомства, арендодателям или учителям. Неофициально — друзьям.
          </p>
          <DataTable
            head={["Для чего", "Официально (Sie)", "Неофициально (du)"]}
            rows={[
              ["Обращение", "Sehr geehrte Frau …, / Sehr geehrter Herr …,", "Liebe Sara, / Lieber Jonas,"],
              ["Вступление", "ich schreibe Ihnen, weil …", "danke für deine Nachricht!"],
              ["Просьба", "Könnten Sie mir bitte … ?", "Kannst du mir bitte … ?"],
              ["Извинение", "Leider kann ich nicht …, weil …", "Tut mir leid, aber ich kann nicht …"],
              ["Предложение", "Wäre es möglich, dass …?", "Wie wäre es mit …?"],
              ["Заключение", "Ich freue mich auf Ihre Antwort.", "Schreib mir bald!"],
              ["Прощание", "Mit freundlichen Grüßen", "Viele Grüße / Liebe Grüße"],
            ]}
          />
          <QuizCard
            l="ru"
            prompt="Вы пишете своей арендодательнице, фрау Вебер (Frau Weber). Какое прощание подходит в конце?"
            options={[
              { key: "a", label: "Tschüss" },
              { key: "b", label: "Liebe Grüße" },
              { key: "c", label: "Mit freundlichen Grüßen" },
            ]}
            correct="c"
            explain="Арендодательнице вы пишете официально, то есть на «Sie». К этому подходит «Mit freundlichen Grüßen». «Liebe Grüße» пишут друзьям."
          />
        </>
      ),
    },
    {
      id: "fehler",
      title: "Типичные ошибки и как их избежать",
      body: (
        <>
          <DoDont
            l="ru"
            dont={[
              "Ответить только на три пункта из четырёх.",
              "«Hallo Frau Kaya» в официальном письме.",
              "Каждое предложение начинается с «Ich».",
              "Посреди письма перейти с «Sie» на «du».",
              "В конце не остаётся времени, чтобы перечитать.",
            ]}
            doThis={[
              "Отметить каждый пункт, прежде чем сдать работу.",
              "«Sehr geehrte Frau Kaya,» и «Mit freundlichen Grüßen».",
              "Соединять предложения: weil, deshalb, aber, wenn, dann.",
              "Один раз решить: официально или неофициально, и не менять.",
              "Пять минут в конце — только на проверку.",
            ]}
          />
          <p>
            В telc вы не получите полный балл по критерию «коммуникативное оформление», если почти все предложения начинаются с
            «Ich» или «Wir». Так сказано в указаниях по оценке telc. Хорошая причина менять начало предложений.
          </p>
        </>
      ),
    },
    {
      id: "zeit",
      title: "Как использовать 30 минут",
      body: (
        <>
          <p>Тридцать минут — это немного. С планом проще. Вот наше предложение:</p>
          <Steps
            items={[
              { title: "Прочитать и выбрать (3 минуты)", text: "Прочитайте оба задания. Возьмите то, к которому идеи приходят быстрее." },
              { title: "Заметки (5 минут)", text: "Запишите по каждому пункту два-три ключевых слова. Решите: официально или неофициально?" },
              { title: "Письмо (17 минут)", text: "Напишите письмо в порядке пунктов. Используйте фразы выше." },
              { title: "Проверка (5 минут)", text: "Все четыре пункта есть? Обращение и прощание? Глаголы на правильном месте?" },
            ]}
          />
        </>
      ),
    },
  ],
  faq: [
    { q: "Сколько слов нужно написать в DTZ?", a: "Точного числа слов нет. Важно, чтобы вы написали что-то по всем четырём пунктам." },
    { q: "Письмо или e-mail: в чём разница?", a: "Структура почти одинаковая. У e-mail есть тема. Отправитель, адрес и дата в e-mail не нужны." },
    { q: "Можно писать пункты в другом порядке?", a: "В telc порядок можно выбрать самому. Но проще всего порядок задания. Так вы не забудете ни один пункт." },
    { q: "Что будет, если я не раскрою тему?", a: "Тогда вы получите очень мало баллов или вообще ни одного. В DTZ тогда по всем четырём критериям ставят 0 баллов. Поэтому прочитайте задание два раза." },
  ],
  cta: { title: "Напишите своё первое экзаменационное письмо", text: "В бесплатном тесте вы пишете письмо в формате DTZ и получаете отзыв по критериям DTZ.", href: "/ru/gratis-test/dtz/schreiben", button: "Начать бесплатный тест" },
}
