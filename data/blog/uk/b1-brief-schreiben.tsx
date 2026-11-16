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
  title: "Лист на іспиті B1: завдання, зразки та фрази (DTZ, telc)",
  crumb: "Лист на іспиті B1",
  description: "Як написати лист на іспиті B1: завдання, структура за шість кроків і два зразки з поясненнями. Для DTZ і telc B1, з критеріями оцінювання.",
  h1: "Лист на іспиті B1 (Brief schreiben): завдання, структура і зразки",
  lead: "На DTZ і telc B1 ви пишете лист або e-mail. Тут ви побачите завдання, структуру і два зразки. А ще фрази, які підходять майже завжди.",
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
      title: "Завдання: що ви пишете на іспиті B1",
      kurz: "На DTZ і telc B1 ви за 30 хвилин пишете лист або e-mail за чотирма пунктами. Фіксованої кількості слів немає.",
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
        </>
      ),
    },
    {
      id: "bewertung",
      title: "Оцінювання: на що звертають увагу екзаменатори",
      kurz: "Найбільше важить відповідь на всі чотири пункти. Пропущений пункт коштує більше, ніж граматична помилка.",
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
            <Link href="/uk/blog/yak-sklasty-dtz">Скласти DTZ: як працює результат</Link>.
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
      title: "Структура: лист B1 за шість кроків",
      kurz: "Тема, звертання, вступ, чотири пункти, завершення, прощання. Завжди в цьому порядку, тоді ви нічого не забудете.",
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
        </>
      ),
    },
    {
      id: "beispiel",
      title: "Зразки: два листи B1 з поясненнями",
      kurz: "Два зразки: формальний e-mail, як на DTZ, і відповідь другові, як на telc B1. Кожен рядок пояснено.",
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
            title="Зразок 1 (DTZ): e-mail керівниці курсу"
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
            <strong>Другий зразок</strong> неформальний, як часто буває на telc B1. Це завдання ми теж написали самі. Ваш друг Йонас
            скоро переїжджає і питає, чи ви допоможете. Дайте йому відповідь.
          </p>
          <ul>
            <li>wann du Zeit hast (коли ви маєте час)</li>
            <li>wie du helfen kannst (як ви можете допомогти)</li>
            <li>wer noch helfen könnte (хто ще міг би допомогти)</li>
            <li>was ihr danach machen könnt (що ви можете зробити потім)</li>
          </ul>
          <LetterSample
            l="uk"
            title="Зразок 2 (telc B1): відповідь другові"
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
              { n: 1, text: "Неформальне звертання на ім’я. Ви пишете „du“, а не „Sie“." },
              { n: 2, text: "Спочатку ви реагуєте на e-mail друга." },
              { n: 3, text: "Чотири пункти, по одному-два речення на кожен. „Außerdem“ (крім того) і „damit“ (з ним) поєднують речення." },
              { n: 4, text: "Неформальне прощання і лише ваше ім’я." },
            ]}
          />
          <p>
            Тепер ваша черга: напишіть лист у <Link href="/uk/bezkoshtovnyi-test/dtz/pysmo">тесті DTZ Schreiben</Link> або в 
            <Link href="/uk/bezkoshtovnyi-test/telc-b1/pysmo">тесті telc B1 Schreiben</Link>.
          </p>
        </>
      ),
    },
    {
      id: "saetze",
      title: "Фрази для вашого листа, формальні й неформальні",
      kurz: "Вивчіть по одній фразі для звертання, вступу, прохання, вибачення, пропозиції, завершення і прощання, офіційно й неофіційно.",
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
      title: "Типові помилки в листі B1",
      kurz: "Найчастіші помилки: бракує пункту, змінюється тон, кожне речення починається з «Ich». Залиште п’ять хвилин на перевірку.",
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
            На telc ви втрачаєте бали, якщо майже всі речення починаються з „Ich“ або „Wir“ (вказівки telc щодо оцінювання).
            Тому змінюйте початок речень.
          </p>
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
  cta: { title: "Напишіть свій перший екзаменаційний лист", text: "У безкоштовному тесті ви пишете лист у форматі DTZ і отримуєте відгук за критеріями DTZ.", href: "/uk/bezkoshtovnyi-test/dtz/pysmo", button: "Почати безкоштовний тест" },
}
