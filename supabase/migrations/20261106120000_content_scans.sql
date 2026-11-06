-- Weekly content ideas (Hannes, 2026-11-06): a Vercel cron pulls community questions (Reddit, Google "People also ask",
-- gutefrage.net) through Apify, Claude turns them into article / adjustment / tool suggestions, and /admin/blog shows them.
-- Server writes only (secret key); no client policy on any of the three tables.

-- One row per ISO week. The 20:00 cron starts the Apify runs, the 22:00 cron collects and ranks them.
create table public.content_scans (
  id uuid primary key default gen_random_uuid(),
  week text not null unique,
  status text not null default 'running' check (status in ('running', 'ranking', 'done', 'error')),
  -- [{ source, runId, datasetId }] as returned by Apify when the run was started.
  apify_runs jsonb not null default '[]'::jsonb,
  started_at timestamptz not null default now(),
  finished_at timestamptz,
  error text,
  -- { questions: { reddit: n, google: n, gutefrage: n }, suggestions: n }; a missing source means "unknown", never zero.
  stats jsonb not null default '{}'::jsonb
);

-- One row per question seen; `key` is the normalised url/title, so the same thread never comes back a week later.
create table public.content_questions (
  id uuid primary key default gen_random_uuid(),
  scan_id uuid not null references public.content_scans (id) on delete cascade,
  source text not null check (source in ('reddit', 'google_paa', 'google_related', 'gutefrage')),
  url text,
  title text not null,
  body text,
  score int not null default 0,
  lang text,
  asked_at timestamptz,
  key text not null unique,
  created_at timestamptz not null default now()
);

create index content_questions_scan_idx on public.content_questions (scan_id);

-- What Claude proposed from a scan; Hannes decides on /admin/blog. Rows are never deleted, only dismissed.
create table public.content_suggestions (
  id uuid primary key default gen_random_uuid(),
  scan_id uuid not null references public.content_scans (id) on delete cascade,
  kind text not null check (kind in ('article', 'adjust', 'tool')),
  title text not null,
  slug text,
  target_path text,
  why text not null,
  brief text not null,
  -- [{ question_id, url, quote }]
  evidence jsonb not null default '[]'::jsonb,
  status text not null default 'open' check (status in ('open', 'planned', 'done', 'dismissed')),
  created_at timestamptz not null default now(),
  decided_at timestamptz
);

create index content_suggestions_status_idx on public.content_suggestions (status, created_at desc);

alter table public.content_scans enable row level security;
alter table public.content_questions enable row level security;
alter table public.content_suggestions enable row level security;
