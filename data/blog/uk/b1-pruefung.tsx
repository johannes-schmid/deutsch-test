import Link from "next/link"
import { Compare, DataTable, ExamStrip, FactBox, Note } from "@/components/design/article"
import { QuizCard } from "@/components/design/article-interactive"
import type { BlogPost } from "@/lib/blog/types"
import { b1Pruefung as de } from "@/data/blog/b1-pruefung"
import { ExamMark } from "@/components/design/variants/nachtzug-icons"

const G1 = { name: "g.a.s.t.: Der DTZ auf einen Blick", url: "https://www.gast.de/de/forschung-entwicklung/entwicklung/auftraege/deutsch-test-fuer-zuwanderer-dtz/der-dtz-auf-einen-blick" }
const TELC = { name: "telc: Übungstest 1 Zertifikat Deutsch / telc Deutsch B1", url: "https://shop.telc.net/media/catalog/product/file/telc_deutsch_b1_zd_uebungstest_1.pdf" }
const GOETHE = { name: "Goethe-Institut: Durchführungsbestimmungen B1 (Stand 1.9.2025)", url: "https://www.goethe.de/pro/relaunch/prf/de/Durchfuehrungsbestimmungen_B1.pdf" }
const OESD = { name: "ÖSD: Durchführungsbestimmungen Zertifikat B1 (Stand 10/2023)", url: "https://www.osd.at/wp-content/uploads/2023/09/ZB1-Durchfuhrungsbestimmungen_10_2023.pdf" }
const INTV = { name: "§ 17 IntV", url: "https://www.gesetze-im-internet.de/intv/__17.html" }
const STAG = { name: "§ 10 StAG", url: "https://www.gesetze-im-internet.de/stag/__10.html" }
const BAMF = { name: "BAMF: Anerkannte B1-Sprachnachweise (Stand 07/2023)", url: "https://www.bamf.de/SharedDocs/Anlagen/DE/Integration/SprachnachweiseZertifikate/nachweis-b1-zertifkat.pdf?__blob=publicationFile&v=6" }
const GER = { name: "Europarat: Gemeinsamer europäischer Referenzrahmen, Globalskala", url: "https://www.coe.int/en/web/common-european-framework-reference-languages/table-1-cefr-3.3-common-reference-levels-global-scale" }

export const b1Pruefung: BlogPost = {
  ...de,
  locale: "uk",
  title: "Іспит B1: DTZ, telc, Goethe чи ÖSD — порівняння",
  crumb: "Іспит B1",
  description: "Який іспит B1 вам підходить? DTZ, telc Deutsch B1, Goethe- та ÖSD-Zertifikat B1 у порівнянні: структура, тривалість, результат і натуралізація.",
  h1: "Іспит B1: який вам підходить?",
  lead: "Є кілька іспитів B1. Вони схожі, але відрізняються. Тут ви побачите порівняння чотирьох найважливіших.",
  cover: { ...de.cover, label: "Чотири іспити B1: DTZ, telc, Goethe та ÖSD" },
  summary: {
    title: "Коротко",
    rows: [
      { k: "DTZ", v: "результат B1, A2 або нижче A2" },
      { k: "telc Deutsch B1", v: "склав (bestanden) від 60 % у письмовій і 60 % в усній частині" },
      { k: "Goethe і ÖSD B1", v: "4 модулі, кожен склав від 60 зі 100 балів" },
      { k: "Натуралізація", v: "один іспит B1; запитайте у своєму відомстві, який саме" },
    ],
  },
  sections: [
    {
      id: "was-ist-b1",
      title: "B1 — це рівень, а не іспит",
      body: (
        <>
          <p>
            B1 — це рівень у <strong>Загальноєвропейських рекомендаціях з мовної освіти</strong> (GER). Рівні йдуть від A1 до C2.
            З B1 ви розумієте головне, коли хтось чітко говорить на знайомі теми. Ви можете розповісти про свої
            будні й написати короткі тексти.
          </p>
          <p>
            Цей рівень перевіряють багато іспитів. Усі вони вимірюють B1, але по-різному. Частини, час і
            результат не однакові. Тому варто подивитися на них, перш ніж реєструватися.
          </p>
          <Note kind="info" l="uk">
            <p>
              Опис рівнів складено Радою Європи. Ви знайдете його в{" "}
              <a href={GER.url} rel="noopener">Рекомендаціях (глобальна шкала)</a>.
            </p>
          </Note>
        </>
      ),
    },
    {
      id: "ueberblick",
      title: "Чотири іспити B1: огляд",
      body: (
        <>
          <p>
            У Німеччині більшість людей складає один із цих чотирьох іспитів. В усіх є чотири частини: аудіювання (Hören),
            читання (Lesen), письмо (Schreiben) і говоріння (Sprechen). Говоріння в усіх — це іспит удвох.
          </p>
          <Compare
            l="uk"
            highlight={0}
            items={[
              {
                mark: <ExamMark brand="dtz" />,
                title: "DTZ",
                sub: "Deutsch-Test für Zuwanderer",
                rows: [
                  { k: "Для кого", v: "інтеграційний курс (Integrationskurs)" },
                  { k: "Тривалість", v: "100 хв письмово, бл. 16 хв говоріння" },
                  { k: "Результат", v: "B1, A2 або нижче A2" },
                ],
                href: "/uk/gratis-test/dtz",
                link: "Пройти DTZ безкоштовно",
              },
              {
                mark: <ExamMark brand="telc" />,
                title: "telc Deutsch B1",
                sub: "Zertifikat Deutsch",
                rows: [
                  { k: "Для кого", v: "дорослі" },
                  { k: "Тривалість", v: "150 хв письмово, бл. 15 хв говоріння" },
                  { k: "Результат", v: "склав від 60 % у письмовій і 60 % в усній частині" },
                ],
                href: "/uk/gratis-test/telc-b1",
                link: "Пройти telc B1 безкоштовно",
              },
              {
                mark: <ExamMark brand="goethe" />,
                title: "Goethe-Zertifikat B1",
                sub: "Goethe-Institut",
                rows: [
                  { k: "Для кого", v: "дорослі та підлітки" },
                  { k: "Тривалість", v: "бл. 165 хв письмово, бл. 15 хв говоріння" },
                  { k: "Результат", v: "кожен модуль склав від 60 зі 100 балів" },
                ],
                href: "/uk/gratis-test/goethe-b1",
                link: "Пройти Goethe B1 безкоштовно",
              },
              {
                mark: <ExamMark brand="oesd" />,
                title: "ÖSD Zertifikat B1",
                sub: "Österreichisches Sprachdiplom",
                rows: [
                  { k: "Для кого", v: "дорослі та підлітки" },
                  { k: "Тривалість", v: "як Goethe B1" },
                  { k: "Результат", v: "кожен модуль склав від 60 зі 100 балів" },
                ],
                href: "/uk/gratis-test/oesd-b1",
                link: "Пройти ÖSD B1 безкоштовно",
              },
            ]}
          />
          <p>
            Ми не пов’язані з жодним із цих організаторів. Назви ми використовуємо лише для того, щоб ви могли розрізнити
            іспити.
          </p>
        </>
      ),
    },
    {
      id: "dauer",
      title: "Скільки тривають іспити",
      body: (
        <>
          <p>
            Іспити мають різну тривалість. Найкоротший — DTZ. Найдовші — Goethe- та ÖSD-Zertifikat, бо там ви
            пишете три тексти. Смуги показують, скільки часу має кожна частина.
          </p>
          <ExamStrip
            l="uk"
            title="Чотири іспити на одній шкалі часу"
            intro="Довжина смуги — це час. Кожен колір — це частина іспиту."
            exams={[
              {
                name: "DTZ",
                parts: [
                  { part: "hoeren", label: "Аудіювання", minutes: 25, approx: true, note: "слухаєте один раз" },
                  { part: "lesen", label: "Читання", minutes: 45, note: "5 частин" },
                  { part: "schreiben", label: "Письмо", minutes: 30, note: "1 лист" },
                  { part: "sprechen", label: "Говоріння", minutes: 16, approx: true, note: "без підготовки" },
                ],
              },
              {
                name: "telc Deutsch B1",
                parts: [
                  { part: "lesen", label: "Читання", minutes: 90, note: "із Sprachbausteine" },
                  { part: "hoeren", label: "Аудіювання", minutes: 30, approx: true, note: "3 частини" },
                  { part: "schreiben", label: "Письмо", minutes: 30, note: "1 e-mail" },
                  { part: "sprechen", label: "Говоріння", minutes: 15, approx: true, note: "+ 20 хв підготовки" },
                ],
              },
              {
                name: "Goethe- та ÖSD-Zertifikat B1",
                parts: [
                  { part: "lesen", label: "Читання", minutes: 65, note: "5 частин" },
                  { part: "hoeren", label: "Аудіювання", minutes: 40, approx: true, note: "4 частини" },
                  { part: "schreiben", label: "Письмо", minutes: 60, note: "3 тексти" },
                  { part: "sprechen", label: "Говоріння", minutes: 15, approx: true, note: "+ 15 хв підготовки" },
                ],
              },
            ]}
            source={<>Джерела: <a href={G1.url} rel="noopener">g.a.s.t.</a> · <a href={TELC.url} rel="noopener">telc</a> · <a href={GOETHE.url} rel="noopener">Goethe-Institut</a> · <a href={OESD.url} rel="noopener">ÖSD</a></>}
          />
          <p>
            На DTZ ви слухаєте кожен текст лише один раз. Для говоріння немає часу на підготовку. На telc, Goethe та ÖSD
            перед говорінням ви отримуєте час для нотаток.
          </p>
          <QuizCard
            l="uk"
            prompt="На якому іспиті ви слухаєте кожен аудіотекст лише один раз?"
            options={[
              { key: "a", label: "telc Deutsch B1" },
              { key: "b", label: "DTZ" },
              { key: "c", label: "Goethe-Zertifikat B1" },
            ]}
            correct="b"
            explain="На DTZ усі тексти звучать один раз. На telc B1 і Goethe B1 деякі тексти ви слухаєте двічі."
          />
        </>
      ),
    },
    {
      id: "ergebnis",
      title: "Склав чи рівень: найбільша різниця",
      body: (
        <>
          <p>
            На telc, Goethe та ÖSD результат чіткий: <strong>склав (bestanden)</strong> або <strong>не склав (nicht bestanden)</strong>.
            Для цього потрібно щонайменше 60 відсотків балів.
          </p>
          <p>
            DTZ працює інакше. Він перевіряє два рівні одночасно: A2 і B1. Наприкінці ви отримуєте рівень: B1, A2 або
            нижче A2. «Не склав» тут немає. Навіть з A2 ви отримуєте сертифікат.
          </p>
          <FactBox l="uk" source={INTV} checked="10/2026">
            За законом DTZ — це «шкалований мовний тест» (skalierter Sprachtest) для рівнів від A2 до B1.
          </FactBox>
          <p>
            Як саме формується результат DTZ, ми пояснюємо у статті{" "}
            <Link href="/uk/blog/dtz-bestehen">Скласти DTZ: як працює результат</Link>.
          </p>
        </>
      ),
    },
    {
      id: "wiederholen",
      title: "Перескласти одну частину: чи можна?",
      body: (
        <>
          <p>Це залежить від іспиту:</p>
          <ul>
            <li>
              <strong>Goethe і ÖSD:</strong> чотири частини називаються модулями. Кожен модуль можна скласти окремо й окремо
              перескласти.
            </li>
            <li>
              <strong>telc Deutsch B1:</strong> є письмова та усна частина. Якщо ви не склали лише одну з них, її можна
              перескласти окремо.
            </li>
            <li>
              <strong>DTZ:</strong> ви завжди складаєте весь іспит. Попередні результати не зараховуються.
            </li>
          </ul>
          <Note kind="tipp" title="Якщо письмо — ваша слабка частина" l="uk">
            <p>
              На Goethe-Zertifikat письмо можна тренувати окремо й окремо перескласти. Але спершу перевірте, чи ваше відомство
              або роботодавець приймає окремі модулі.
            </p>
          </Note>
        </>
      ),
    },
    {
      id: "einbuergerung",
      title: "Який іспит B1 зараховують для натуралізації?",
      body: (
        <>
          <p>
            Для натуралізації (громадянства) потрібна німецька на рівні B1. Закон не називає конкретного іспиту. Він каже лише:
            ви маєте відповідати вимогам мовного іспиту рівня B1.
          </p>
          <FactBox l="uk" source={STAG} checked="10/2026">
            Для натуралізації зараховується мовний іспит рівня B1 за Загальноєвропейськими рекомендаціями з мовної освіти.
          </FactBox>
          <p>
            BAMF має список сертифікатів B1. У ньому є, наприклад, DTZ з B1, telc Deutsch B1,
            Goethe-Zertifikat B1 і ÖSD Zertifikat B1. Але цей <a href={BAMF.url} rel="noopener">список</a> стосується
            інтеграційного курсу, а не натуралізації.
          </p>
          <Note kind="wichtig" title="Спершу запитайте у своєму відомстві" l="uk">
            <p>
              Про натуралізацію вирішує ваш орган з натуралізації (Einbürgerungsbehörde). Перед реєстрацією запитайте там, який
              сертифікат вони приймають. Їхня відповідь обов’язкова, наша — ні.
            </p>
          </Note>
          <p>
            Більше про це читайте на нашій сторінці <Link href="/uk/b1-einbuergerung">B1 для натуралізації</Link>.
          </p>
        </>
      ),
    },
    {
      id: "welche-passt",
      title: "Який іспит підходить вам?",
      body: (
        <>
          <p>Ця таблиця допоможе отримати перше уявлення. Вона не замінює консультацію.</p>
          <DataTable
            head={["Ваша ситуація", "Часто підходить", "Чому"]}
            rows={[
              ["Ви на інтеграційному курсі", "DTZ", "Курс закінчується іспитом DTZ. Ви реєструєтеся через свій екзаменаційний центр."],
              ["Вам потрібен B1 для натуралізації", "DTZ, telc, Goethe або ÖSD", "Запитайте у своєму відомстві, який сертифікат вони приймають."],
              ["Одна частина слабка, решта добре", "Goethe або ÖSD", "Можна скласти один модуль окремо."],
              ["Ви хочете короткий іспит", "DTZ", "Письмова частина триває 100 хвилин без перерви."],
            ]}
          />
        </>
      ),
    },
    {
      id: "vorbereiten",
      title: "Як правильно підготуватися",
      body: (
        <>
          <p>Неважливо, який іспит: тренуйте саме той формат, який складатимете.</p>
          <ul>
            <li><strong>Тренуйтеся з часом.</strong> Кожен іспит має фіксований час на кожну частину. Поставте собі таймер.</li>
            <li><strong>Слухайте стільки разів, скільки на іспиті.</strong> На DTZ ви слухаєте кожен текст лише один раз. Тренуйтеся так само.</li>
            <li><strong>Пишіть про всі пункти.</strong> Пропущений пункт коштує багато балів. Як це зробити, показує наша стаття <Link href="/uk/blog/b1-brief-schreiben">Іспит B1: письмо</Link>.</li>
            <li><strong>Говоріть удвох.</strong> Говоріння на всіх чотирьох іспитах — це розмова. Тренуйтеся з іншою людиною.</li>
          </ul>
        </>
      ),
    },
  ],
  faq: [
    { q: "DTZ — це іспит B1?", a: "І так, і ні. DTZ перевіряє A2 і B1 одночасно. Ви отримуєте B1, A2 або нижче A2. Якщо загальний результат B1, у вас сертифікат B1." },
    { q: "telc B1 — це те саме, що DTZ?", a: "Ні. telc Deutsch B1 також називається Zertifikat Deutsch. У нього інші частини, інший час і результат «склав» або «не склав»." },
    { q: "Goethe B1 і ÖSD B1 однакові?", a: "Завдання, час і бали однакові. Іспит розробили спільно. Різниця є лише в адмініструванні, наприклад щодо загального сертифіката." },
    { q: "Який іспит B1 найлегший?", a: "Жоден не легший, усі перевіряють B1. Оберіть іспит, якого вимагає ваше відомство або курс. Потім тренуйте саме цей формат." },
  ],
  cta: { title: "Який іспит ви складаєте?", text: "Пройдіть безкоштовний тест у форматі свого іспиту. Ви одразу побачите, де ви зараз.", href: "/uk/gratis-test", button: "Почати безкоштовний тест" },
}
