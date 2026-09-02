-- MasterKraft staff admin centre: who counts as staff.
--
-- Membership is a row rather than a JWT claim, so revoking access takes effect
-- on the next request instead of when a token expires.

create table if not exists public.staff_members (
  user_id    uuid primary key references auth.users (id) on delete cascade,
  full_name  text,
  role       text not null default 'staff' check (role in ('staff', 'admin')),
  created_at timestamptz not null default now()
);

alter table public.staff_members enable row level security;

-- Security definer so policies on OTHER tables can call it without those
-- tables' policies needing to read staff_members themselves.
create or replace function public.is_masterkraft_staff()
returns boolean
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select exists (
    select 1 from public.staff_members s where s.user_id = auth.uid()
  );
$$;

revoke all on function public.is_masterkraft_staff() from public;
grant execute on function public.is_masterkraft_staff() to authenticated;

-- A staff member can see the staff list; nobody else can see anything.
create policy staff_read_self_and_peers on public.staff_members
  for select to authenticated
  using (public.is_masterkraft_staff());

-- No insert/update/delete policy on purpose: staff are added deliberately,
-- from the SQL editor or a service-role script, never from the app.
