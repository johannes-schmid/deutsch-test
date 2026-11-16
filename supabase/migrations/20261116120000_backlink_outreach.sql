-- Backlink outreach (Hannes, 2026-11-16): every request, follow-up and outcome for a backlink candidate on
-- /admin/seo?tab=backlinks. Append-only; the state (asked, follow-up due, replied, ...) follows from the rows
-- (lib/admin/backlink-outreach-model.ts). The candidates themselves stay in seo-agent/backlink-prospects.json.
-- Server writes only (secret key, behind requireAdmin()); RLS on with no policy.

create table public.backlink_outreach (
  id uuid primary key default gen_random_uuid(),
  domain text not null,
  kind text not null check (kind in ('sent', 'follow_up', 'replied', 'listed', 'declined', 'note')),
  -- email = sent through Resend from the admin; form = pasted into the site's contact form; manual = marked by hand.
  channel text check (channel in ('email', 'form', 'manual')),
  to_email text,
  subject text,
  body text,
  -- Our Message-ID on the first email, so the follow-up can thread with In-Reply-To.
  message_id text,
  resend_id text,
  sent_by text not null,
  created_at timestamptz not null default now()
);

create index backlink_outreach_domain_idx on public.backlink_outreach (domain, created_at);

-- One first email and one follow-up per site, whatever a double click or a second tab does.
create unique index backlink_outreach_one_sent on public.backlink_outreach (domain) where kind = 'sent';
create unique index backlink_outreach_one_follow_up on public.backlink_outreach (domain) where kind = 'follow_up';

alter table public.backlink_outreach enable row level security;
