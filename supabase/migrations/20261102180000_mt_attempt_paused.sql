-- Modelltest 1 without a pass stops after the free half (Hannes, 2026-11-02). The answers so far wait here until the
-- learner pays and goes on; NULL = not paused. Written by the server only (no client policy, like the rest of mt_attempts).
alter table public.mt_attempts add column if not exists paused jsonb;
