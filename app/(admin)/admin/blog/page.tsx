import { Suspense } from "react"
import { notFound } from "next/navigation"
import { ChevronDown } from "lucide-react"
import { AdminPage, PanelSkeleton, Section } from "@/components/admin/admin-ui"
import { AllIdeas, ScanStatus, WeekIdeas } from "@/components/admin/blog-ideas"
import { BlogPosts } from "@/components/admin/blog-posts"
import { requireAdmin } from "@/lib/admin/guard"
import { loadBlogCockpit } from "@/lib/admin/blog"

export const metadata = { title: "Blog" }

/**
 * Blog: Hannes's workbench for the guides (English, like /admin/seo). Two questions: how is each post doing, and
 * what do people ask that we don't answer yet. Posts stay TSX in the repo and are reviewed by hand (CLAUDE.md
 * §4): every button here copies a prompt for Claude Code, which drafts a PR; nothing on this page edits a post.
 * The ideas come from the Friday community scan (lib/content-ideas/, Reddit + Google + gutefrage.net via Apify).
 */
export default function BlogAdminPage() {
  return (
    <AdminPage title="Blog" description="Every guide with its Google numbers and translations, and what people asked this week that the site should answer. Each button copies a prompt for Claude Code; the post itself changes by PR after your review.">
      <Suspense fallback={<PanelSkeleton rows={5} />}>
        <Cockpit />
      </Suspense>
    </AdminPage>
  )
}

async function Cockpit() {
  if (!(await requireAdmin())) notFound()
  const data = await loadBlogCockpit()
  const open = data.suggestions.filter((s) => s.status === "open").length

  return (
    <>
      <Section title="Posts" aside={<span className="text-[13px] text-v-muted">{data.liveGsc ? "Google: live, last 28 days" : "Google: unknown (no GSC key on this server)"}</span>} note="Click a post for its sections, queries and the prompts: improve, fix the snippet, translate what is missing.">
        <BlogPosts posts={data.posts} suggestions={data.suggestions} />
      </Section>

      <Section title="This week's ideas" aside={open ? <span className="v-num text-[13px] text-v-muted">{open} open</span> : null}>
        <ScanStatus scan={data.scan} canScan={data.canScan} config={data.config} />
        <WeekIdeas suggestions={data.suggestions} week={data.scan?.week ?? null} />
      </Section>

      <details className="group flex flex-col gap-3">
        <summary className="flex w-fit cursor-pointer list-none items-center gap-2 rounded-full text-[18px] font-semibold tracking-[-0.01em] outline-none focus-visible:ring-2 focus-visible:ring-v-ink focus-visible:ring-offset-2 [&::-webkit-details-marker]:hidden">
          All ideas <span className="v-num text-[13px] font-normal text-v-muted">{data.suggestions.length}</span>
          <ChevronDown className="size-4 text-v-muted transition-transform duration-200 ease-out group-open:rotate-180" aria-hidden="true" />
        </summary>
        <div className="mt-3">
          <AllIdeas suggestions={data.suggestions} />
        </div>
      </details>
    </>
  )
}
