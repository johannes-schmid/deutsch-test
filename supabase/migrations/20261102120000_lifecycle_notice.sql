-- Lifecycle emails go to every account by default (§ 7 Abs. 3 UWG after EuGH C-654/23; Hannes, 2026-11-02).
-- Proof of the objection notice shown under the sign-up button: when, and which wording (NOTICE_VERSION in lib/lifecycle/prefs.ts).
-- NULL = the account signed up before the notice existed. consent_at stays as the record of an earlier opt-in.
alter table public.lifecycle_prefs add column notice_at timestamptz, add column notice_version text;
alter table public.lifecycle_prefs add constraint lifecycle_prefs_notice_check check ((notice_at is null) = (notice_version is null));
