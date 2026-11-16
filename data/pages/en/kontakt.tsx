import type { ContactPage } from "@/lib/pages/types"

export const page: ContactPage = {
  title: "Contact",
  description: "Questions, a mistake in a task or problems with your test? Send us an email.",
  crumb: "Contact",
  h1: "Contact",
  lead: "Do you have a question or did you find a mistake? Write to us. You can write in German or English.",
  emailLabel: "Email",
  body: (
    <>
      <h2>So we can help you quickly</h2>
      <ul>
        <li><strong>Mistake in a task?</strong> Tell us which test and which task. A screenshot helps.</li>
        <li><strong>Problem with your result?</strong> Give us the email address you used for the test.</li>
        <li><strong>Delete your data?</strong> Write to us. We delete your data and confirm it to you.</li>
      </ul>
      <p>We answer as quickly as we can.</p>
      <p>
        Only your exam centre or the BAMF can answer questions about your real exam, for example about dates or
        costs. We are not connected to them.
      </p>
    </>
  ),
}
