-- What each payment bought, stored at the time of purchase (lib/pricing.ts offers, lib/billing/grants.ts).
-- Access reads these snapshots, so a later price change or a catalogue switch never alters what someone already owns.
-- plan_id keeps holding the offer id ('1m', '3m'; renewals before this migration say 'renewal').

alter table public.payments
  add column catalogue text,
  add column grants jsonb,
  add column term_months integer check (term_months > 0),
  -- What the subscription charges after the first term; NULL = a one-off offer without renewal.
  add column renewal_cents integer check (renewal_cents > 0);

-- Every payment so far is the Prüfungspass of 2026-10-24: every skill and exam, renewing monthly at 19.95.
update public.payments set
  catalogue = 'pass-2026-10',
  grants = '{"skills": ["hoeren", "lesen", "schreiben", "sprechen"], "exams": "*", "simulation": true}'::jsonb,
  term_months = case when kind = 'first' and plan_id = '3m' then 3 else 1 end,
  renewal_cents = 1995
where grants is null;

alter table public.payments
  alter column catalogue set not null,
  alter column grants set not null,
  alter column term_months set not null;
