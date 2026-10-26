-- Discover Lanka account and trip data. Safe to apply once to a new Supabase project.
create extension if not exists pgcrypto;

do $$ begin
  create type public.app_role as enum ('user', 'admin');
exception when duplicate_object then null;
end $$;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role public.app_role not null default 'user',
  created_at timestamptz not null default now()
);

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.profiles
    where id = (select auth.uid()) and role = 'admin'
  );
$$;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id) values (new.id) on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

create table if not exists public.favorites (
  user_id uuid not null references auth.users(id) on delete cascade,
  destination_id text not null,
  created_at timestamptz not null default now(),
  primary key (user_id, destination_id)
);

create table if not exists public.trips (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null default 'My Sri Lanka trip',
  start_date date,
  end_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint trip_dates_valid check (start_date is null or end_date is null or end_date >= start_date)
);

create table if not exists public.trip_destinations (
  trip_id uuid not null references public.trips(id) on delete cascade,
  destination_id text not null,
  position integer not null default 0,
  created_at timestamptz not null default now(),
  primary key (trip_id, destination_id)
);

alter table public.profiles enable row level security;
alter table public.favorites enable row level security;
alter table public.trips enable row level security;
alter table public.trip_destinations enable row level security;

-- Users can read their own role. Admins can inspect profiles. Role writes are
-- intentionally unavailable through the public client; promote admins in SQL.
drop policy if exists "profiles_read_self_or_admin" on public.profiles;
create policy "profiles_read_self_or_admin" on public.profiles
  for select to authenticated using (id = (select auth.uid()) or (select public.is_admin()));
revoke all on public.profiles from anon, authenticated;
grant select on public.profiles to authenticated;

drop policy if exists "favorites_manage_own" on public.favorites;
create policy "favorites_manage_own" on public.favorites
  for all to authenticated using (user_id = (select auth.uid()) or (select public.is_admin()))
  with check (user_id = (select auth.uid()) or (select public.is_admin()));
grant select, insert, update, delete on public.favorites to authenticated;

drop policy if exists "trips_manage_own" on public.trips;
create policy "trips_manage_own" on public.trips
  for all to authenticated using (user_id = (select auth.uid()) or (select public.is_admin()))
  with check (user_id = (select auth.uid()) or (select public.is_admin()));
grant select, insert, update, delete on public.trips to authenticated;

drop policy if exists "trip_destinations_manage_own" on public.trip_destinations;
create policy "trip_destinations_manage_own" on public.trip_destinations
  for all to authenticated
  using (
    exists (select 1 from public.trips t where t.id = trip_id and t.user_id = (select auth.uid()))
    or (select public.is_admin())
  )
  with check (
    exists (select 1 from public.trips t where t.id = trip_id and t.user_id = (select auth.uid()))
    or (select public.is_admin())
  );
grant select, insert, update, delete on public.trip_destinations to authenticated;

-- Function permissions are explicit. The role is only derived from profiles.
revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated;
