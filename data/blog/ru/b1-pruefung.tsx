import Link from "next/link"
import { Compare, DataTable, ExamStrip, FactBox, Note } from "@/components/design/article"
import { QuizCard } from "@/components/design/article-interactive"
import { ExamMark } from "@/components/design/variants/nachtzug-icons"
import type { BlogPost } from "@/lib/blog/types"
import { b1Pruefung as de } from "@/data/blog/b1-pruefung"

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
  locale: "ru",
  title: "Экзамен B1: DTZ, telc, Goethe или ÖSD — сравнение",
  crumb: "Экзамен B1",
  description: "Какой экзамен B1 вам подходит? DTZ, telc Deutsch B1, Goethe- и ÖSD-Zertifikat B1: структура, длительность, результат и натурализация.",
  h1: "Экзамен B1: какой вам подходит?",
  lead: "Есть несколько экзаменов B1. Они похожи, но отличаются. Здесь вы найдёте сравнение четырёх главных.",
  cover: {
    ...de.cover,
    label: "Четыре экзамена B1: DTZ, telc, Goethe и ÖSD",
  },
  summary: {
    title: "Коротко",
    rows: [
      { k: "DTZ", v: "результат B1, A2 или ниже A2" },
      { k: "telc Deutsch B1", v: "сдал (bestanden) от 60 % в письменной и 60 % в устной части" },
      { k: "Goethe и ÖSD B1", v: "4 модуля, каждый сдан от 60 из 100 баллов" },
      { k: "Натурализация", v: "один экзамен B1; спросите в своём ведомстве, какой" },
    ],
  },
  sections: [
    {
      id: "was-ist-b1",
      title: "B1 — это уровень, а не экзамен",
      body: (
        <>
          <p>
            B1 — это уровень в <strong>Общеевропейских компетенциях владения иностранным языком</strong> (GER). Уровни идут от A1
            до C2. С B1 вы понимаете главное, когда человек ясно говорит на знакомые темы. Вы можете рассказать о своей
            повседневной жизни и написать короткий текст.
          </p>
          <p>
            Этот уровень проверяют многие экзамены. Все они измеряют B1, но по-разному. Части, время и результат у них не
            одинаковые. Поэтому стоит сравнить их до регистрации.
          </p>
          <Note kind="info" l="ru">
            <p>
              Описание уровней составил Совет Европы. Его можно найти в{" "}
              <a href={GER.url} rel="noopener">шкале уровней (Globalskala)</a>.
            </p>
          </Note>
        </>
      ),
    },
    {
      id: "ueberblick",
      title: "Четыре экзамена B1: обзор",
      body: (
        <>
          <p>
            В Германии большинство людей сдаёт один из этих четырёх экзаменов. У всех есть четыре части: аудирование (Hören),
            чтение (Lesen), письмо (Schreiben) и говорение (Sprechen). Говорение везде сдают вдвоём.
          </p>
          <Compare
            l="ru"
            highlight={0}
            items={[
              {
                mark: <ExamMark brand="dtz" />,
                title: "DTZ",
                sub: "Deutsch-Test für Zuwanderer",
                rows: [
                  { k: "Для кого", v: "интеграционный курс (Integrationskurs)" },
                  { k: "Длительность", v: "100 мин. письменно, ок. 16 мин. говорение" },
                  { k: "Результат", v: "B1, A2 или ниже A2" },
                ],
                href: "/ru/gratis-test/dtz",
                link: "Бесплатный тест DTZ",
              },
              {
                mark: <ExamMark brand="telc" />,
                title: "telc Deutsch B1",
                sub: "Zertifikat Deutsch",
                rows: [
                  { k: "Для кого", v: "взрослые" },
                  { k: "Длительность", v: "150 мин. письменно, ок. 15 мин. говорение" },
                  { k: "Результат", v: "сдал от 60 % в письменной и 60 % в устной части" },
                ],
                href: "/ru/gratis-test/telc-b1",
                link: "Бесплатный тест telc B1",
              },
              {
                mark: <ExamMark brand="goethe" />,
                title: "Goethe-Zertifikat B1",
                sub: "Goethe-Institut",
                rows: [
                  { k: "Для кого", v: "взрослые и подростки" },
                  { k: "Длительность", v: "ок. 165 мин. письменно, ок. 15 мин. говорение" },
                  { k: "Результат", v: "каждый модуль сдан от 60 из 100 баллов" },
                ],
                href: "/ru/gratis-test/goethe-b1",
                link: "Бесплатный тест Goethe B1",
              },
              {
                mark: <ExamMark brand="oesd" />,
                title: "ÖSD Zertifikat B1",
                sub: "Österreichisches Sprachdiplom",
                rows: [
                  { k: "Для кого", v: "взрослые и подростки" },
                  { k: "Длительность", v: "как Goethe B1" },
                  { k: "Результат", v: "каждый модуль сдан от 60 из 100 баллов" },
                ],
                href: "/ru/gratis-test/oesd-b1",
                link: "Бесплатный тест ÖSD B1",
              },
            ]}
          />
          <p>
            Мы не связаны ни с одной из этих организаций. Названия мы используем только для того, чтобы вы могли различать
            экзамены.
          </p>
        </>
      ),
    },
    {
      id: "dauer",
      title: "Сколько длятся экзамены",
      body: (
        <>
          <p>
            Экзамены разной длины. Самый короткий — DTZ. Самые длинные — Goethe- и ÖSD-Zertifikat, потому что там вы пишете три
            текста. Полосы показывают, сколько времени у каждой части.
          </p>
          <ExamStrip
            l="ru"
            title="Четыре экзамена на одной шкале времени"
            intro="Длина полосы — это время. Каждый цвет — одна часть экзамена."
            exams={[
              {
                name: "DTZ",
                parts: [
                  { part: "hoeren", label: "Аудирование", minutes: 25, approx: true, note: "слушать один раз" },
                  { part: "lesen", label: "Чтение", minutes: 45, note: "5 частей" },
                  { part: "schreiben", label: "Письмо", minutes: 30, note: "1 письмо" },
                  { part: "sprechen", label: "Говорение", minutes: 16, approx: true, note: "без подготовки" },
                ],
              },
              {
                name: "telc Deutsch B1",
                parts: [
                  { part: "lesen", label: "Чтение", minutes: 90, note: "со Sprachbausteine" },
                  { part: "hoeren", label: "Аудирование", minutes: 30, approx: true, note: "3 части" },
                  { part: "schreiben", label: "Письмо", minutes: 30, note: "1 e-mail" },
                  { part: "sprechen", label: "Говорение", minutes: 15, approx: true, note: "+ 20 мин. подготовки" },
                ],
              },
              {
                name: "Goethe- и ÖSD-Zertifikat B1",
                parts: [
                  { part: "lesen", label: "Чтение", minutes: 65, note: "5 частей" },
                  { part: "hoeren", label: "Аудирование", minutes: 40, approx: true, note: "4 части" },
                  { part: "schreiben", label: "Письмо", minutes: 60, note: "3 текста" },
                  { part: "sprechen", label: "Говорение", minutes: 15, approx: true, note: "+ 15 мин. подготовки" },
                ],
              },
            ]}
            source={<>Источники: <a href={G1.url} rel="noopener">g.a.s.t.</a> · <a href={TELC.url} rel="noopener">telc</a> · <a href={GOETHE.url} rel="noopener">Goethe-Institut</a> · <a href={OESD.url} rel="noopener">ÖSD</a></>}
          />
          <p>
            В DTZ каждый текст звучит только один раз. На говорение нет времени для подготовки. В telc, Goethe и ÖSD перед
            говорением вам дают время на заметки.
          </p>
          <QuizCard
            l="ru"
            prompt="На каком экзамене каждый аудиотекст звучит только один раз?"
            options={[
              { key: "a", label: "telc Deutsch B1" },
              { key: "b", label: "DTZ" },
              { key: "c", label: "Goethe-Zertifikat B1" },
            ]}
            correct="b"
            explain="В DTZ все тексты звучат один раз. В telc B1 и Goethe B1 некоторые тексты вы слышите дважды."
          />
        </>
      ),
    },
    {
      id: "ergebnis",
      title: "Сдал или уровень: главное отличие",
      body: (
        <>
          <p>
            В telc, Goethe и ÖSD результат простой: <strong>сдал (bestanden)</strong> или <strong>не сдал (nicht bestanden)</strong>.
            Для этого нужно не меньше 60 процентов баллов.
          </p>
          <p>
            DTZ устроен по-другому. Он проверяет сразу два уровня: A2 и B1. В конце вы получаете уровень: B1, A2 или ниже A2.
            Результата «не сдал» нет. С A2 вы тоже получаете сертификат.
          </p>
          <FactBox l="ru" source={INTV} checked="10/2026">
            По закону DTZ — это «шкалированный языковой тест» (skalierter Sprachtest) для уровней от A2 до B1.
          </FactBox>
          <p>
            Как именно получается результат DTZ, мы объясняем в статье{" "}
            <Link href="/ru/blog/dtz-bestehen">Как сдать DTZ: как устроен результат</Link>.
          </p>
        </>
      ),
    },
    {
      id: "wiederholen",
      title: "Можно ли пересдать одну часть?",
      body: (
        <>
          <p>Это зависит от экзамена:</p>
          <ul>
            <li>
              <strong>Goethe и ÖSD:</strong> четыре части называются модулями. Каждый модуль можно сдать и пересдать отдельно.
            </li>
            <li>
              <strong>telc Deutsch B1:</strong> есть письменная и устная часть. Если вы не сдали только одну из них, можно
              пересдать только её.
            </li>
            <li>
              <strong>DTZ:</strong> вы всегда сдаёте весь экзамен. Прежние результаты не засчитываются.
            </li>
          </ul>
          <Note l="ru" kind="tipp" title="Если письмо — ваша слабая часть">
            <p>
              В Goethe-Zertifikat письмо можно тренировать и пересдавать отдельно. Но сначала уточните, принимает ли ваше ведомство
              или работодатель отдельные модули.
            </p>
          </Note>
        </>
      ),
    },
    {
      id: "einbuergerung",
      title: "Какой экзамен B1 подходит для натурализации?",
      body: (
        <>
          <p>
            Для натурализации (Einbürgerung) нужен немецкий на уровне B1. Закон не называет конкретный экзамен. Он говорит только:
            вы должны выполнить требования языкового экзамена уровня B1.
          </p>
          <FactBox l="ru" source={STAG} checked="10/2026">
            Для натурализации засчитывается языковой экзамен уровня B1 по Общеевропейским компетенциям владения иностранным языком.
          </FactBox>
          <p>
            У BAMF есть список сертификатов B1. В нём, например, DTZ с B1, telc Deutsch B1, Goethe-Zertifikat B1 и ÖSD
            Zertifikat B1. Но этот <a href={BAMF.url} rel="noopener">список</a> относится к интеграционному курсу, а не к
            натурализации.
          </p>
          <Note l="ru" kind="wichtig" title="Сначала спросите в своём ведомстве">
            <p>
              О натурализации решает ваш орган по натурализации (Einbürgerungsbehörde). Спросите там до регистрации, какой
              сертификат они принимают. Их ответ обязателен, наш — нет.
            </p>
          </Note>
          <p>
            Подробнее читайте на нашей странице <Link href="/ru/b1-einbuergerung">B1 для натурализации</Link>.
          </p>
        </>
      ),
    },
    {
      id: "welche-passt",
      title: "Какой экзамен подходит вам?",
      body: (
        <>
          <p>Эта таблица помогает получить первое представление. Она не заменяет консультацию.</p>
          <DataTable
            head={["Ваша ситуация", "Часто подходит", "Почему"]}
            rows={[
              ["Вы на интеграционном курсе", "DTZ", "Курс заканчивается экзаменом DTZ. Вы регистрируетесь через свой экзаменационный центр."],
              ["Вам нужен B1 для натурализации", "DTZ, telc, Goethe или ÖSD", "Спросите в своём ведомстве, какой сертификат они принимают."],
              ["Одна часть слабая, остальное хорошо", "Goethe или ÖSD", "Можно сдать один модуль отдельно."],
              ["Вы хотите короткий экзамен", "DTZ", "Письменная часть длится 100 минут без перерыва."],
            ]}
          />
        </>
      ),
    },
    {
      id: "vorbereiten",
      title: "Как правильно готовиться",
      body: (
        <>
          <p>Неважно, какой экзамен: тренируйте именно тот формат, который будете сдавать.</p>
          <ul>
            <li><strong>Тренируйтесь со временем.</strong> У каждого экзамена есть точное время для каждой части. Поставьте таймер.</li>
            <li><strong>Слушайте столько раз, сколько на экзамене.</strong> В DTZ каждый текст звучит только один раз. Тренируйтесь так же.</li>
            <li><strong>Пишите по всем пунктам.</strong> Пропущенный пункт стоит много баллов. Как это сделать, показывает наша статья <Link href="/ru/blog/b1-brief-schreiben">Экзамен B1: письмо</Link>.</li>
            <li><strong>Говорите вдвоём.</strong> На всех четырёх экзаменах говорение — это разговор. Тренируйтесь с другим человеком.</li>
          </ul>
        </>
      ),
    },
  ],
  faq: [
    { q: "DTZ — это экзамен B1?", a: "И да, и нет. DTZ проверяет A2 и B1 одновременно. Вы получаете B1, A2 или ниже A2. С B1 в общем результате у вас есть сертификат B1." },
    { q: "telc B1 — это то же самое, что DTZ?", a: "Нет. telc Deutsch B1 называют также Zertifikat Deutsch. У него другие части, другое время и результат «сдал» или «не сдал»." },
    { q: "Goethe B1 и ÖSD B1 одинаковые?", a: "Задания, время и баллы одинаковые. Экзамен разрабатывали вместе. Отличия есть только в организации, например в общем сертификате." },
    { q: "Какой экзамен B1 самый лёгкий?", a: "Ни один не легче, все проверяют B1. Выберите экзамен, который требует ваше ведомство или ваш курс. И тренируйте именно этот формат." },
  ],
  cta: { title: "Какой экзамен вы сдаёте?", text: "Пройдите бесплатный тест в формате вашего экзамена. Вы сразу увидите свой уровень.", href: "/ru/gratis-test", button: "Начать бесплатный тест" },
}
