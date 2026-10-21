-- Admin allowlist: a Google-signed-in user whose email is listed here may open /admin.
-- A signed-in user can read only their own row, so "am I an admin?" is answered under RLS.

create table public.admin_users (
  email text primary key check (email = lower(email)),
  created_at timestamptz not null default now()
);

alter table public.admin_users enable row level security;

create policy "admin_users: read own row" on public.admin_users
  for select to authenticated
  using (email = lower(auth.jwt() ->> 'email'));

insert into public.admin_users (email) values ('schmid.johannes90@gmail.com');

-- Account signups per ISO week (Monday, Europe/Berlin), newest first, empty weeks included.
-- Reads auth.users, so only the server (secret key) may call it.
create function public.admin_signups_per_week()
returns table (week date, signups bigint)
language sql
stable
security definer
set search_path = ''
as $$
  with weeks as (
    select generate_series(
      coalesce(date_trunc('week', min(created_at at time zone 'Europe/Berlin')), date_trunc('week', now() at time zone 'Europe/Berlin')),
      date_trunc('week', now() at time zone 'Europe/Berlin'),
      interval '1 week'
    )::date as week
    from auth.users
  )
  select w.week, count(u.id)
  from weeks w
  left join auth.users u on date_trunc('week', u.created_at at time zone 'Europe/Berlin')::date = w.week
  group by w.week
  order by w.week desc
$$;

revoke execute on function public.admin_signups_per_week() from public, anon, authenticated;
grant execute on function public.admin_signups_per_week() to service_role;
