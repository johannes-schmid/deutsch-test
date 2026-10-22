-- Modelltests: 10 full mock exams per exam and skill (number 1..10), plus a backlog (number 0) that never publishes.
-- Format rules live in lib/exam/blueprint.ts (`full`) and the validator, not here, so there is one source of truth.
--
-- Content tables have RLS on and NO client policies: the server reads them with the secret key and strips the
-- scoring key (is_correct, script, model answers) before anything reaches the browser.
-- Attempts are readable by their owner; all writes go through server code that checks the session first.

create table public.mt_sets (
  id uuid primary key default gen_random_uuid(),
  exam text not null,
  skill text not null check (skill in ('hoeren', 'lesen', 'schreiben', 'sprechen')),
  number int not null check (number between 0 and 10),
  title text,
  is_free boolean not null default false,
  duration_seconds int,
  published boolean not null default false,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  unique (exam, skill, number),
  constraint mt_sets_backlog_never_public check (number > 0 or (not published and not is_free))
);

-- One text or clip with its items (Lesen/Hören). `display` is what the browser may see; `key` is server-only.
create table public.mt_stimuli (
  id uuid primary key default gen_random_uuid(),
  set_id uuid not null references public.mt_sets (id) on delete cascade,
  teil int not null check (teil between 1 and 9),
  sort_order int not null default 0,
  kind text not null check (kind in ('text', 'audio')),
  text_type text,
  display jsonb not null default '{}',
  key jsonb not null default '{}',
  audio_path text,
  audio_seconds numeric,
  review_status text not null default 'draft' check (review_status in ('draft', 'reviewed')),
  reviewed_at timestamptz,
  generated jsonb,
  created_at timestamptz not null default now(),
  unique (set_id, teil, sort_order),
  constraint mt_stimuli_audio_has_path check (kind <> 'audio' or audio_path is not null or review_status = 'draft')
);

-- One scored item (n = exam item number) or a solved example (example = true, n = 0).
create table public.mt_questions (
  id uuid primary key default gen_random_uuid(),
  stimulus_id uuid not null references public.mt_stimuli (id) on delete cascade,
  set_id uuid not null references public.mt_sets (id) on delete cascade,
  n int not null check (n >= 0),
  example boolean not null default false,
  format text not null check (format in ('choice', 'picture', 'rf', 'jn', 'match', 'gap')),
  prompt text,
  explanation text,
  evidence jsonb,
  created_at timestamptz not null default now(),
  constraint mt_questions_example_is_zero check (example = (n = 0))
);

create unique index mt_questions_item_number on public.mt_questions (set_id, n) where not example;
create unique index mt_questions_example_per_stimulus on public.mt_questions (stimulus_id) where example;
create index mt_questions_stimulus on public.mt_questions (stimulus_id);

-- set_id always follows the stimulus; the app never writes it.
create function public.mt_questions_sync_set()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  select s.set_id into new.set_id from public.mt_stimuli s where s.id = new.stimulus_id;
  return new;
end
$$;

create trigger mt_questions_sync_set before insert or update of stimulus_id on public.mt_questions
  for each row execute function public.mt_questions_sync_set();

-- Options are reconciled by label, never deleted and re-inserted (past answers point at labels).
-- Matching items carry only the letters (+ 'x'); the ad texts live in the stimulus display.
create table public.mt_options (
  id uuid primary key default gen_random_uuid(),
  question_id uuid not null references public.mt_questions (id) on delete cascade,
  label text not null,
  sort_order int not null default 0,
  body text,
  picto text,
  image_path text,
  is_correct boolean not null default false,
  unique (question_id, label)
);

create unique index mt_options_one_correct on public.mt_options (question_id) where is_correct;

-- Schreiben tasks and Sprechen Teile. `display`: task cards, photos, turn plan. `key`: model answers, partner and
-- examiner script, picture brief, follow-up question bank.
create table public.mt_open_tasks (
  id uuid primary key default gen_random_uuid(),
  set_id uuid not null references public.mt_sets (id) on delete cascade,
  teil int not null check (teil between 1 and 9),
  sort_order int not null default 0,
  kind text not null check (kind in ('schreiben', 'sprechen')),
  display jsonb not null default '{}',
  key jsonb not null default '{}',
  review_status text not null default 'draft' check (review_status in ('draft', 'reviewed')),
  reviewed_at timestamptz,
  generated jsonb,
  created_at timestamptz not null default now(),
  unique (set_id, teil, sort_order)
);

alter table public.mt_sets enable row level security;
alter table public.mt_stimuli enable row level security;
alter table public.mt_questions enable row level security;
alter table public.mt_options enable row level security;
alter table public.mt_open_tasks enable row level security;

-- Attempts. attempt_no counts per user and set; `result` holds the band or points, `conversation` the Sprechen
-- turns as played (including generated examiner and partner lines).
create table public.mt_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  set_id uuid not null references public.mt_sets (id) on delete restrict,
  exam text not null,
  skill text not null,
  number int not null,
  attempt_no int not null default 0,
  mode text not null default 'exam' check (mode in ('exam', 'practice')),
  started_at timestamptz not null default now(),
  completed_at timestamptz,
  score numeric,
  max_score numeric,
  result jsonb,
  conversation jsonb,
  graded_at timestamptz,
  grade_error text,
  unique (user_id, set_id, attempt_no)
);

create index mt_attempts_user on public.mt_attempts (user_id, exam, skill);

create function public.mt_attempts_number()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  select coalesce(max(a.attempt_no), 0) + 1 into new.attempt_no
  from public.mt_attempts a where a.user_id = new.user_id and a.set_id = new.set_id;
  return new;
end
$$;

create trigger mt_attempts_number before insert on public.mt_attempts
  for each row execute function public.mt_attempts_number();

create table public.mt_answers (
  id uuid primary key default gen_random_uuid(),
  attempt_id uuid not null references public.mt_attempts (id) on delete cascade,
  question_id uuid not null references public.mt_questions (id) on delete restrict,
  chosen text,
  correct boolean not null,
  answered_at timestamptz not null default now(),
  unique (attempt_id, question_id)
);

-- One per Schreiben text or Sprechen candidate turn. audio_path is a path in the private bucket, never a URL.
create table public.mt_submissions (
  id uuid primary key default gen_random_uuid(),
  attempt_id uuid not null references public.mt_attempts (id) on delete cascade,
  task_id uuid not null references public.mt_open_tasks (id) on delete restrict,
  turn int not null default 0,
  text text,
  audio_path text,
  audio_seconds numeric,
  transcript text,
  speech_signals jsonb,
  rubric_version text,
  -- TODO(hannes): Datenschutz text before any recording is used to train or evaluate models. Opt-in only.
  training_consent boolean not null default false,
  created_at timestamptz not null default now(),
  unique (attempt_id, task_id, turn)
);

alter table public.mt_attempts enable row level security;
alter table public.mt_answers enable row level security;
alter table public.mt_submissions enable row level security;

create policy "mt_attempts: read own" on public.mt_attempts
  for select to authenticated using (user_id = (select auth.uid()));

create policy "mt_answers: read own" on public.mt_answers
  for select to authenticated
  using (exists (select 1 from public.mt_attempts a where a.id = attempt_id and a.user_id = (select auth.uid())));

create policy "mt_submissions: read own" on public.mt_submissions
  for select to authenticated
  using (exists (select 1 from public.mt_attempts a where a.id = attempt_id and a.user_id = (select auth.uid())));

-- Publish gate: a set publishes only when it has content and every stimulus and task is reviewed.
-- Format checks against the blueprint run in code (validator, full mode) before this.
create function public.mt_publish_issues(p_set uuid)
returns table (issue text)
language sql
stable
security definer
set search_path = ''
as $$
  select 'backlog set never publishes' from public.mt_sets where id = p_set and number = 0
  union all
  select 'set is empty' where not exists (select 1 from public.mt_stimuli where set_id = p_set)
    and not exists (select 1 from public.mt_open_tasks where set_id = p_set)
  union all
  select format('Teil %s stimulus %s is not reviewed', teil, sort_order) from public.mt_stimuli
    where set_id = p_set and review_status <> 'reviewed'
  union all
  select format('Teil %s task %s is not reviewed', teil, sort_order) from public.mt_open_tasks
    where set_id = p_set and review_status <> 'reviewed'
  union all
  select format('audio stimulus Teil %s/%s has no audio', teil, sort_order) from public.mt_stimuli
    where set_id = p_set and kind = 'audio' and audio_path is null
  union all
  select format('item %s has %s correct options', q.n, count(o.id) filter (where o.is_correct))
    from public.mt_questions q left join public.mt_options o on o.question_id = q.id
    where q.set_id = p_set group by q.id, q.n having count(o.id) filter (where o.is_correct) <> 1
$$;

revoke execute on function public.mt_publish_issues(uuid) from public, anon, authenticated;
grant execute on function public.mt_publish_issues(uuid) to service_role;

-- Storage. exam-audio / exam-images: public read, written only by scripts with the secret key.
-- sprechen-recordings: private; a signed-in user may upload and read files under their own user id folder.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types) values
  ('exam-audio', 'exam-audio', true, 20971520, array['audio/mpeg']),
  ('exam-images', 'exam-images', true, 5242880, array['image/webp', 'image/avif']),
  ('sprechen-recordings', 'sprechen-recordings', false, 26214400, array['audio/webm', 'audio/ogg', 'audio/mp4', 'audio/wav'])
on conflict (id) do nothing;

create policy "sprechen-recordings: upload own" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'sprechen-recordings' and (storage.foldername(name))[1] = (select auth.uid())::text);

create policy "sprechen-recordings: read own" on storage.objects
  for select to authenticated
  using (bucket_id = 'sprechen-recordings' and (storage.foldername(name))[1] = (select auth.uid())::text);
