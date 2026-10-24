-- Prüfungspass payments (Mollie). Only the server (secret key) writes; a signed-in user reads their own rows.
-- Access is never stored on the user: lib/entitlements.ts derives it from the paid, unrevoked periods below.

create table public.mollie_customers (
  user_id uuid primary key references auth.users (id) on delete cascade,
  customer_id text not null unique,
  -- The subscription that renews the pass monthly; Mollie stays the source of truth for whether it is still live.
  subscription_id text,
  canceled_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- One row per Mollie payment: the first payment of a plan and every monthly renewal.
create table public.payments (
  id uuid primary key default gen_random_uuid(),
  mollie_payment_id text not null unique,
  user_id uuid references auth.users (id) on delete set null,
  plan_id text not null,
  kind text not null check (kind in ('first', 'renewal')),
  amount_cents integer not null check (amount_cents > 0),
  status text not null default 'open',
  -- Set once when the payment is paid: the period it bought.
  period_starts_at timestamptz,
  period_ends_at timestamptz,
  paid_at timestamptz,
  -- Country Mollie detected at checkout: the VAT rate for the OSS return (DE 19 %, AT 20 %). NULL = not detected.
  country text,
  -- Chargeback or full refund: the period no longer grants access.
  revoked_at timestamptz,
  -- The subscription this first payment started (NULL on renewals and until it exists).
  subscription_id text,
  -- Consent to start at once and to lose the withdrawal right (§ 356 Abs. 5 BGB), given at checkout.
  consent_at timestamptz,
  activation_email_sent boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index payments_user_paid_idx on public.payments (user_id, period_ends_at desc) where status = 'paid' and revoked_at is null;
create index payments_open_idx on public.payments (created_at) where status in ('open', 'pending', 'authorized');

alter table public.mollie_customers enable row level security;
alter table public.payments enable row level security;

create policy "mollie_customers: read own row" on public.mollie_customers
  for select to authenticated using (user_id = auth.uid());

create policy "payments: read own rows" on public.payments
  for select to authenticated using (user_id = auth.uid());
