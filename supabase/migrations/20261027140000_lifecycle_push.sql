-- Browser notifications run the same lifecycle sequence as email (Hannes, 2026-10-27): one moment, sent on every channel
-- the learner turned on. The email log becomes the moment log; `channels` records where each moment went.
alter table public.lifecycle_emails rename to lifecycle_messages;
alter table public.lifecycle_messages add column channels text[] not null default '{}';
alter table public.lifecycle_messages rename constraint lifecycle_emails_kind_check to lifecycle_messages_kind_check;
alter table public.lifecycle_messages rename constraint lifecycle_emails_variant_check to lifecycle_messages_variant_check;
alter policy "lifecycle_emails: read own rows" on public.lifecycle_messages rename to "lifecycle_messages: read own rows";

-- One row per browser that allowed notifications. Only the server writes; the endpoint keys never reach another user.
create table public.push_subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  endpoint text not null unique,
  p256dh text not null,
  auth text not null,
  created_at timestamptz not null default now()
);

create index push_subscriptions_user_idx on public.push_subscriptions (user_id);

alter table public.push_subscriptions enable row level security;
