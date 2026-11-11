-- When a learner first stood at the halfway stop of an attempt (Hannes, 2026-11-11). `paused` is cleared once they pay,
-- so /admin/funnel lost every buyer; this timestamp is written once and stays. Server writes only, like the rest of
-- mt_attempts. Attempts paused before this migration get the time of their pause.
alter table public.mt_attempts add column if not exists paywall_at timestamptz;
update public.mt_attempts set paywall_at = (paused->>'at')::timestamptz where paused ? 'at' and paywall_at is null;
