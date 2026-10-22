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
  locale: "uk",
  title: "Іспит B1, письмо: лист і e-mail із прикладом",
  crumb: "Іспит B1: письмо",
  description: "Як написати лист на іспиті B1: структура, корисні фрази та приклад. Для DTZ і telc Deutsch B1, за справжніми критеріями оцінювання.",
  h1: "Іспит B1, письмо (Schreiben): як написати вдалий лист",
  lead: "На DTZ і telc B1 ви пишете лист або e-mail. Тут ви вивчите структуру й корисні фрази. А ще побачите цілий приклад.",
  cover: {
    ...de.cover,
    label: "Лист із чотирма позначеними пунктами",
    art: (
      <div className="nz-app flex flex-col gap-4 rounded-[24px] p-6 text-[15px]">
        <div className="flex items-center gap-2 text-v-muted">
          <PenLine className="size-4" strokeWidth={1.75} aria-hidden="true" /> 30 хв
        </div>
        <p className="font-semibold">Sehr geehrte Frau Kaya,</p>
        <div className="flex flex-col gap-2" aria-hidden="true">
          <span className="h-2 w-full rounded-full bg-v-soft" />
          <span className="h-2 w-[86%] rounded-full bg-v-soft" />
          <span className="h-2 w-[64%] rounded-full bg-v-soft" />
        </div>
        <ul className="grid grid-cols-2 gap-2 text-[13.5px]">
          {["Причина", "Нова дата", "Оплата", "Відповідь"].map((p) => (
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
    title: "Завдання на DTZ",
    rows: [
      { k: "Час", v: "30 хвилин" },
      { k: "Завдання", v: "обрати A або B, лист або e-mail" },
      { k: "Зміст", v: "4 пункти, плюс звертання і прощання" },
      { k: "Обсяг", v: "без фіксованої кількості слів" },
    ],
  },
  sections: [
    {
      id: "aufgabe",
      title: "Що ви пишете на іспиті",
      body: (
        <>
          <p>
            На DTZ і telc Deutsch B1 ви пишете <strong>один текст за 30 хвилин</strong>. Ви отримуєте коротку ситуацію
            і чотири пункти. Про кожен пункт ви щось пишете. На Goethe- та ÖSD-Zertifikat інакше: там ви пишете
            три коротші тексти.
          </p>
          <Compare
            l="uk"
            items={[
              {
                mark: <ExamMark brand="dtz" />,
                title: "DTZ",
                rows: [
                  { k: "Завдання", v: "обрати завдання A або B" },
                  { k: "Текст", v: "лист або e-mail, напівофіційний або офіційний" },
                  { k: "Пункти", v: "4, плюс звертання і прощання" },
                  { k: "Обсяг", v: "без фіксованої кількості слів" },
                ],
              },
              {
                mark: <ExamMark brand="telc" />,
                title: "telc Deutsch B1",
                rows: [
                  { k: "Завдання", v: "відповісти на 1 e-mail" },
                  { k: "Текст", v: "неофіційний або напівофіційний" },
                  { k: "Пункти", v: "4 ключові пункти (Leitpunkte)" },
                  { k: "Обсяг", v: "без фіксованої кількості слів" },
                ],
              },
            ]}
          />
          <p>
            Ця стаття показує лист для DTZ і telc B1. Але поради щодо структури допоможуть вам і на Goethe та ÖSD.
          </p>
        </>
      ),
    },
    {
      id: "bewertung",
      title: "На що зважають екзаменатори",
      body: (
        <>
          <p>Екзаменатори читають ваш текст за чіткими критеріями. На DTZ їх чотири:</p>
          <ol>
            <li><strong>Виконання завдання (Aufgabenbewältigung):</strong> чи написали ви щось про всі пункти?</li>
            <li><strong>Комунікативне оформлення (Kommunikative Gestaltung):</strong> чи добре побудований текст? Чи підходять звертання і тон?</li>
            <li><strong>Правильність (Korrektheit):</strong> наскільки добрі граматика й орфографія?</li>
            <li><strong>Словниковий запас (Wortschatz):</strong> чи вживаєте ви доречні слова?</li>
          </ol>
          <FactBox l="uk" source={G3} checked="10/2026">
            Якщо текст DTZ не відповідає завданню, за всіма чотирма критеріями ставлять 0 балів.
          </FactBox>
          <p>
            На telc Deutsch B1 критеріїв три: Aufgabenbewältigung, Kommunikative Gestaltung і Formale Richtigkeit.
            Для виконання завдання там важить, скільки з чотирьох ключових пунктів ви доречно розкрили.
          </p>
          <p>
            Скільки балів потрібно на DTZ для B1, читайте у статті{" "}
            <Link href="/uk/blog/dtz-bestehen">Скласти DTZ: як працює результат</Link>.
          </p>
          <Note kind="tipp" title="Найважливіше — спочатку" l="uk">
            <p>
              Забутий пункт коштує більше, ніж граматична помилка. Краще пишіть прості речення про всі чотири пункти, ніж
              гарні речення лише про три.
            </p>
          </Note>
        </>
      ),
    },
    {
      id: "aufbau",
      title: "Структура в шість кроків",
      body: (
        <>
          <p>Хороший екзаменаційний лист завжди має ті самі частини. Якщо ви їх знаєте, на іспиті не доведеться довго думати.</p>
          <Steps
            items={[
              { title: "Тема (Betreff)", text: "Для e-mail: коротка тема, наприклад «Abmeldung vom Kurs am Samstag»." },
              { title: "Звертання (Anrede)", text: "Офіційно: «Sehr geehrte Frau Kaya,». Якщо ви не знаєте імені: «Sehr geehrte Damen und Herren,»." },
              { title: "Вступ (Einleitung)", text: "Одне речення про те, чому ви пишете: «ich schreibe Ihnen, weil …»." },
              { title: "Чотири пункти", text: "Про кожен пункт два-три речення. Найкраще в порядку завдання." },
              { title: "Завершення (Schluss)", text: "Прохання або подяка: «Ich freue mich auf Ihre Antwort.»" },
              { title: "Прощання (Gruß)", text: "Офіційно: «Mit freundlichen Grüßen» і ваше ім’я." },
            ]}
          />
          <Note kind="info" l="uk">
            <p>
              Відправника, адресу й дату в e-mail писати не потрібно. Так сказано в настановах telc з оцінювання.
            </p>
          </Note>
        </>
      ),
    },
    {
      id: "beispiel",
      title: "Приклад із поясненням",
      body: (
        <>
          <p>
            Це завдання ми написали самі. Воно побудоване так само, як завдання на DTZ. <strong>Ситуація:</strong>{" "}
            ви записалися на курс першої допомоги у Volkshochschule (народному університеті). У суботу ви не можете прийти. Напишіть
            керівниці курсу, пані Каї (Frau Kaya).
          </p>
          <ul>
            <li>Grund, warum du nicht kommen kannst (причина, чому ви не можете прийти)</li>
            <li>nach einem neuen Termin fragen (запитати про нову дату)</li>
            <li>Kursgebühr (оплата за курс)</li>
            <li>um eine Antwort bitten (попросити відповісти)</li>
          </ul>
          <LetterSample
            l="uk"
            title="Приклад: e-mail керівниці курсу"
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
              { n: 1, text: "Коротка тема. Так пані Кая одразу знає, про що йдеться." },
              { n: 2, text: "Офіційне звертання з іменем, після нього кома. Наступне речення починається з малої літери." },
              { n: 3, text: "Вступ: про що йдеться? Достатньо одного-двох речень." },
              { n: 4, text: "Пункт 1, причина. Словом «weil» (бо) ви з’єднуєте два речення. Це показує рівень B1." },
              { n: 5, text: "Пункт 2, нова дата. Запитання і конкретна пропозиція." },
              { n: 6, text: "Пункт 3, оплата. Тут є прохання з альтернативою: «Wenn das nicht geht …» (якщо це неможливо …)." },
              { n: 7, text: "Пункт 4 і завершення: ввічливе прохання й подяка." },
              { n: 8, text: "Офіційне прощання без коми, потім ваше ім’я." },
            ]}
          />
          <p>
            У листі приблизно 100 слів. Фіксованої кількості слів на DTZ немає. Важливо ось що: на кожен пункт є чітка
            відповідь, а речення пов’язані між собою.
          </p>
        </>
      ),
    },
    {
      id: "saetze",
      title: "Фрази, які підходять майже завжди",
      body: (
        <>
          <p>
            Вивчіть ці фрази напам’ять. Тоді на іспиті у вас буде більше часу на зміст. Офіційно ви пишете до установ,
            орендодавців або вчителів. Неофіційно — друзям.
          </p>
          <DataTable
            head={["Для чого", "Офіційно (Sie)", "Неофіційно (du)"]}
            rows={[
              ["Звертання", "Sehr geehrte Frau …, / Sehr geehrter Herr …,", "Liebe Sara, / Lieber Jonas,"],
              ["Вступ", "ich schreibe Ihnen, weil …", "danke für deine Nachricht!"],
              ["Прохання", "Könnten Sie mir bitte … ?", "Kannst du mir bitte … ?"],
              ["Вибачення", "Leider kann ich nicht …, weil …", "Tut mir leid, aber ich kann nicht …"],
              ["Пропозиція", "Wäre es möglich, dass …?", "Wie wäre es mit …?"],
              ["Завершення", "Ich freue mich auf Ihre Antwort.", "Schreib mir bald!"],
              ["Прощання", "Mit freundlichen Grüßen", "Viele Grüße / Liebe Grüße"],
            ]}
          />
          <QuizCard
            l="uk"
            prompt="Ви пишете своїй орендодавиці, Frau Weber. Яке прощання підходить наприкінці?"
            options={[
              { key: "a", label: "Tschüss" },
              { key: "b", label: "Liebe Grüße" },
              { key: "c", label: "Mit freundlichen Grüßen" },
            ]}
            correct="c"
            explain="Орендодавиці ви пишете офіційно, тобто на «Sie». До цього підходить «Mit freundlichen Grüßen». «Liebe Grüße» пишуть друзям."
          />
        </>
      ),
    },
    {
      id: "fehler",
      title: "Типові помилки та як їх уникнути",
      body: (
        <>
          <DoDont
            l="uk"
            dont={[
              "Відповісти лише на три з чотирьох пунктів.",
              "«Hallo Frau Kaya» в офіційному листі.",
              "Кожне речення починається з «Ich».",
              "Посеред листа перейти з «Sie» на «du».",
              "Наприкінці не мати часу, щоб перечитати.",
            ]}
            doThis={[
              "Позначити кожен пункт, перш ніж здати роботу.",
              "«Sehr geehrte Frau Kaya,» і «Mit freundlichen Grüßen».",
              "З’єднувати речення: weil, deshalb, aber, wenn, dann.",
              "Один раз вирішити: офіційно чи неофіційно, і дотримуватися цього.",
              "П’ять хвилин наприкінці — лише на перевірку.",
            ]}
          />
          <p>
            На telc за критерієм Kommunikative Gestaltung ви не отримаєте повного балу, якщо майже всі речення починаються з «Ich» або
            «Wir». Так сказано в настановах telc з оцінювання. Це добра причина змінювати початок речень.
          </p>
        </>
      ),
    },
    {
      id: "zeit",
      title: "Як використати 30 хвилин",
      body: (
        <>
          <p>Тридцять хвилин — це небагато. З планом легше. Ось наша пропозиція:</p>
          <Steps
            items={[
              { title: "Прочитати й обрати (3 хвилини)", text: "Прочитайте обидва завдання. Оберіть те, до якого швидше з’являються ідеї." },
              { title: "Нотатки (5 хвилин)", text: "Запишіть до кожного пункту два-три ключові слова. Вирішіть: офіційно чи неофіційно?" },
              { title: "Письмо (17 хвилин)", text: "Пишіть лист у порядку пунктів. Використовуйте фрази, наведені вище." },
              { title: "Перевірка (5 хвилин)", text: "Чи є всі чотири пункти? Звертання і прощання? Дієслова на правильному місці?" },
            ]}
          />
        </>
      ),
    },
  ],
  faq: [
    { q: "Скільки слів треба написати на DTZ?", a: "Фіксованої кількості слів немає. Важливо, щоб ви щось написали про всі чотири пункти." },
    { q: "Лист чи e-mail: у чому різниця?", a: "Структура майже однакова. E-mail має тему. Відправник, адреса й дата в e-mail не потрібні." },
    { q: "Чи можна писати пункти в іншому порядку?", a: "На telc порядок можна обрати самостійно. Але найпростіше — у порядку завдання. Так ви не забудете жодного пункту." },
    { q: "Що буде, якщо я не розкрию тему?", a: "Тоді ви отримаєте дуже мало балів або взагалі жодного. На DTZ тоді ставлять 0 балів за всіма чотирма критеріями. Тому прочитайте завдання двічі." },
  ],
  cta: { title: "Напишіть свій перший екзаменаційний лист", text: "У безкоштовному тесті ви пишете лист у форматі DTZ і отримуєте відгук за критеріями DTZ.", href: "/uk/gratis-test/dtz/schreiben", button: "Почати безкоштовний тест" },
}
