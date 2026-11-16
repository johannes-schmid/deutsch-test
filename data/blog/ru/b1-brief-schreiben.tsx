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
  title: "Письмо на экзамене B1: задание, образцы и фразы (DTZ, telc)",
  crumb: "Письмо на экзамене B1",
  description: "Как написать письмо на экзамене B1: задание, структура за шесть шагов и два образца с пояснениями. Для DTZ и telc B1, с критериями оценки.",
  h1: "Письмо на экзамене B1 (Brief schreiben): задание, структура и образцы",
  lead: "На DTZ и telc B1 вы пишете письмо или e-mail. Здесь вы увидите задание, структуру и два образца. А ещё фразы, которые подходят почти всегда.",
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
      title: "Задание: что вы пишете на экзамене B1",
      kurz: "В DTZ и telc B1 вы пишете за 30 минут письмо или e-mail по четырём пунктам. Точного числа слов нет.",
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
        </>
      ),
    },
    {
      id: "bewertung",
      title: "Оценка: на что смотрят экзаменаторы",
      kurz: "Ответить на все четыре пункта важнее всего. Забытый пункт стоит больше, чем грамматическая ошибка.",
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
            <Link href="/ru/blog/kak-sdat-dtz">Как сдать DTZ: как устроен результат</Link>.
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
      title: "Структура: письмо B1 за шесть шагов",
      kurz: "Тема, обращение, вступление, четыре пункта, заключение, прощание. Всегда в этом порядке, тогда вы ничего не забудете.",
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
        </>
      ),
    },
    {
      id: "beispiel",
      title: "Образцы: два письма B1 с пояснениями",
      kurz: "Два образца: формальный e-mail, как на DTZ, и ответ другу, как на telc B1. Каждая строка объяснена.",
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
            title="Образец 1 (DTZ): e-mail руководительнице курса"
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
            <strong>Второй образец</strong> неформальный, как часто бывает на telc B1. Это задание мы тоже написали сами. Ваш друг Йонас
            скоро переезжает и спрашивает, поможете ли вы. Ответьте ему.
          </p>
          <ul>
            <li>wann du Zeit hast (когда у вас есть время)</li>
            <li>wie du helfen kannst (как вы можете помочь)</li>
            <li>wer noch helfen könnte (кто ещё мог бы помочь)</li>
            <li>was ihr danach machen könnt (что вы можете сделать потом)</li>
          </ul>
          <LetterSample
            l="ru"
            title="Образец 2 (telc B1): ответ другу"
            lines={[
              { text: "Lieber Jonas,", mark: 1 },
              { text: "danke für deine E-Mail! Schön, dass du eine neue Wohnung gefunden hast.", mark: 2 },
              { text: "Natürlich helfe ich dir. Am Samstag habe ich den ganzen Tag Zeit, am Sonntag nur am Vormittag.", mark: 3 },
              { text: "Ich kann Kartons tragen und die Möbel aufbauen. Außerdem bringe ich mein Werkzeug mit." },
              { text: "Frag doch auch Malik. Er hat ein großes Auto, damit geht es schneller." },
              { text: "Nach dem Umzug können wir zusammen Pizza bestellen. Was meinst du?" },
              { text: "Viele Grüße", mark: 4 },
              { text: "Samir", join: true },
            ]}
            notes={[
              { n: 1, text: "Неформальное обращение по имени. Вы пишете „du“, а не „Sie“." },
              { n: 2, text: "Сначала вы реагируете на e-mail друга." },
              { n: 3, text: "Четыре пункта, по одному-два предложения на каждый. „Außerdem“ (кроме того) и „damit“ (с ним) связывают предложения." },
              { n: 4, text: "Неформальное прощание и только ваше имя." },
            ]}
          />
          <p>
            Теперь ваша очередь: напишите письмо в <Link href="/ru/besplatnyj-test/dtz/pismo">тесте DTZ Schreiben</Link> или в 
            <Link href="/ru/besplatnyj-test/telc-b1/pismo">тесте telc B1 Schreiben</Link>.
          </p>
        </>
      ),
    },
    {
      id: "saetze",
      title: "Фразы для вашего письма, формальные и неформальные",
      kurz: "Выучите по одной фразе для обращения, вступления, просьбы, извинения, предложения, заключения и прощания, официально и неофициально.",
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
      title: "Типичные ошибки в письме B1",
      kurz: "Самые частые ошибки: не хватает пункта, меняется тон, каждое предложение начинается с «Ich». Оставьте пять минут на проверку.",
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
            На telc вы теряете баллы, если почти все предложения начинаются с „Ich“ или „Wir“ (указания telc по оценке).
            Поэтому меняйте начало предложений.
          </p>
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
  cta: { title: "Напишите своё первое экзаменационное письмо", text: "В бесплатном тесте вы пишете письмо в формате DTZ и получаете отзыв по критериям DTZ.", href: "/ru/besplatnyj-test/dtz/pismo", button: "Начать бесплатный тест" },
}
