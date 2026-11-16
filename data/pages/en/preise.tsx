import type { PricePage } from "@/lib/pages/types"

export const page: PricePage = {
  title: "Prices: the exam pass for all parts",
  description: "One exam pass for Listening, Reading, Writing and Speaking. Then monthly, cancel any time. Prices incl. VAT. The free test costs nothing.",
  crumb: "Prices",
  h1: "One pass",
  h1Muted: "for your whole exam.",
  lead: "On exam day you take all parts. That is why the exam pass gives you everything. After that it renews every month. You can cancel any time.",
  vatNote: "All prices in euros, including VAT. After the first term, the pass renews every month at the price for 1 month. You can cancel any time, effective at the end of the paid period.",
  faq: (
    <>
      <h2>Frequently asked questions about prices</h2>
      <h3>Does the pass renew?</h3>
      <p>Yes. After 1 or 3 months it renews every month at the price for 1 month. You can cancel any time with one click in your account. You keep practising until the end of the paid period.</p>
      <h3>Why no single parts?</h3>
      <p>On exam day you take all parts. So you need all of them. One pass is simpler and cheaper.</p>
      <h3>Is this the official exam?</h3>
      <p>
        No. You practise with mock exams in the format of the exam. You take the real exam at an exam centre.
        We are not connected to the BAMF, telc or g.a.s.t.
      </p>
    </>
  ),
  skills: {
    title: "Prices: only the parts you need",
    description: "Choose one or more exam parts. You get all four for the price of three. Cancel any time. Prices incl. VAT. The free test costs nothing.",
    h1: "Only the parts",
    h1Muted: "you need.",
    lead: "Practise exactly what you are missing: one part, two or more. You get all four for the price of three. The pass renews every month. You can cancel any time.",
    vatNote: "All prices in euros, including VAT. The pass renews every month at the same price. You can cancel any time, effective at the end of the paid period.",
    faq: (
      <>
        <h2>Frequently asked questions about prices</h2>
        <h3>What do I get with single parts?</h3>
        <p>All mock exams for the parts you choose, in every exam on the site. The exam simulation with all four parts is only in the pass for all four.</p>
        <h3>Can I add parts later?</h3>
        <p>Yes, in your account. You pay the difference for the rest of your month. After that you pay the new monthly price.</p>
        <h3>Does the pass renew?</h3>
        <p>Yes, every month at the same price. You can cancel any time with one click in your account. You keep practising until the end of the paid period.</p>
        <h3>Is this the official exam?</h3>
        <p>
          No. You practise with mock exams in the format of the exam. You take the real exam at an exam centre.
          We are not connected to the BAMF, telc or g.a.s.t.
        </p>
      </>
    ),
  },
  cta: { h2: "Test first, then decide", text: "Take the free test first. Then you know which part you are still missing." },
}
