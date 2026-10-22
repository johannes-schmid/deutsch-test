-- Hören plays as one continuous track per set (research/dtz-blueprint.md §2.1): { src, duration, cues[] }.
alter table public.mt_sets add column track jsonb;
