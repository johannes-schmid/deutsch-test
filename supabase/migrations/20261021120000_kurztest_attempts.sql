-- Free-test (Kurztest) attempts: submission, lead (email) and cached grade in one row.
-- RLS on with no policies: only the server (secret key) reads or writes.

create table public.kurztest_attempts (
  id uuid primary key,
  exam text not null,
  skill text not null check (skill in ('lesen', 'hoeren', 'schreiben', 'sprechen')),
  level text not null default 'offen',
  answers jsonb,
  task text,
  text text,
  recorded int,
  utm jsonb,
  started_at text,
  finished_at timestamptz not null default now(),
  email text,
  marketing boolean,
  unlocked_at timestamptz,
  grade jsonb,
  graded_at timestamptz,
  ip_hash text
);

alter table public.kurztest_attempts enable row level security;

create index kurztest_attempts_unlocked_at_idx on public.kurztest_attempts (unlocked_at desc) where email is not null;
create index kurztest_attempts_graded_at_idx on public.kurztest_attempts (graded_at) where graded_at is not null;
