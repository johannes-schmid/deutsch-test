-- Why the learner needs the exam, asked in the onboarding after the free test (lib/lifecycle/onboarding.ts › GOALS).
-- NULL = not answered (skipped, or an account from before 2026-11-20).
alter table public.lifecycle_prefs
  add column goal text check (goal in ('einbuergerung', 'aufenthalt', 'integrationskurs', 'arbeit', 'andere'));
