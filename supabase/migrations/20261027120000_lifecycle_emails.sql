-- Lifecycle emails (Hannes, 2026-10-27): at most five per learner, only with marketing consent (§ 7 Abs. 2 Nr. 3 UWG).
-- Only the server (secret key) writes; a signed-in user reads their own rows. Rules: lib/lifecycle/rules.ts.

-- One row per learner, written by the onboarding card and /dashboard/konto.
create table public.lifecycle_prefs (
  user_id uuid primary key references auth.users (id) on delete cascade,
  exam text not null,
  -- Berlin calendar day of the exam; NULL = "Noch kein Termin".
  exam_date date,
  -- Consent to the emails, and the exact wording shown (CONSENT_VERSION in lib/lifecycle/prefs.ts). NULL = no consent.
  consent_at timestamptz,
  consent_version text,
  unsubscribed_at timestamptz,
  -- Secret for the one-click unsubscribe link; never shown to anyone but the recipient.
  unsubscribe_token uuid not null unique default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check ((consent_at is null) = (consent_version is null))
);

-- One row per sent email; the unique key is what makes every kind go out at most once.
create table public.lifecycle_emails (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  kind text not null check (kind in ('willkommen', 'zahlung', 'stand', 'endspurt', 'nach_pruefung')),
  variant text check (variant in ('a', 'b', 'c')),
  resend_id text,
  sent_at timestamptz not null default now(),
  unique (user_id, kind)
);

create index lifecycle_prefs_consent_idx on public.lifecycle_prefs (user_id) where consent_at is not null and unsubscribed_at is null;

alter table public.lifecycle_prefs enable row level security;
alter table public.lifecycle_emails enable row level security;

create policy "lifecycle_prefs: read own row" on public.lifecycle_prefs
  for select to authenticated using (user_id = auth.uid());

create policy "lifecycle_emails: read own rows" on public.lifecycle_emails
  for select to authenticated using (user_id = auth.uid());
