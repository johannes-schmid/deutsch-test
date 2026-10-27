-- Consent can now come from the sign-up checkbox, before the learner has picked an exam: NULL = no exam chosen yet.
alter table public.lifecycle_prefs alter column exam drop not null;
