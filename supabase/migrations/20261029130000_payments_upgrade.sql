-- An upgrade (one skill → all four, lib/billing/process.ts): a one-off payment that grants the rest of the running
-- period and moves the subscription to the new price.
alter table public.payments drop constraint payments_kind_check;
alter table public.payments add constraint payments_kind_check check (kind in ('first', 'renewal', 'upgrade'));
