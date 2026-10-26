-- Reviews, destination corrections, advisories, and shareable itineraries.
create extension if not exists pgcrypto;

alter table public.trips
  add column if not exists is_public boolean not null default false,
  add column if not exists share_token text unique default encode(gen_random_bytes(12), 'hex'),
  add column if not exists description text;

alter table public.trip_destinations
  add column if not exists day_number integer not null default 1,
  add column if not exists notes text;

drop policy if exists "public_shared_trips_read" on public.trips;
create policy "public_shared_trips_read" on public.trips
  for select to anon, authenticated using (is_public = true);
drop policy if exists "public_shared_trip_destinations_read" on public.trip_destinations;
create policy "public_shared_trip_destinations_read" on public.trip_destinations
  for select to anon, authenticated using (
    exists (select 1 from public.trips t where t.id = trip_id and t.is_public = true)
  );
grant select on public.trips, public.trip_destinations to anon;

create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  destination_id text not null,
  rating integer not null check (rating between 1 and 5),
  comment text not null check (char_length(comment) between 10 and 2000),
  status text not null default 'pending' check (status in ('pending','published','rejected')),
  created_at timestamptz not null default now()
);
alter table public.reviews enable row level security;
drop policy if exists "published_reviews_read" on public.reviews;
create policy "published_reviews_read" on public.reviews for select to anon, authenticated
  using (status = 'published' or user_id = (select auth.uid()) or (select public.is_admin()));
drop policy if exists "reviews_submit_own" on public.reviews;
create policy "reviews_submit_own" on public.reviews for insert to authenticated
  with check (user_id = (select auth.uid()) and status = 'pending');
drop policy if exists "reviews_admin_manage" on public.reviews;
create policy "reviews_admin_manage" on public.reviews for update to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));
grant select, insert on public.reviews to anon, authenticated;
grant update on public.reviews to authenticated;

create table if not exists public.destination_submissions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  destination_id text,
  destination_name text not null,
  message text not null check (char_length(message) between 10 and 2000),
  contact_email text,
  status text not null default 'pending' check (status in ('pending','reviewed','rejected')),
  created_at timestamptz not null default now()
);
alter table public.destination_submissions enable row level security;
drop policy if exists "destination_submissions_insert" on public.destination_submissions;
create policy "destination_submissions_insert" on public.destination_submissions
  for insert to anon, authenticated with check (user_id is null or user_id = (select auth.uid()));
drop policy if exists "destination_submissions_admin_read" on public.destination_submissions;
create policy "destination_submissions_admin_read" on public.destination_submissions
  for select to authenticated using ((select public.is_admin()));
drop policy if exists "destination_submissions_admin_update" on public.destination_submissions;
create policy "destination_submissions_admin_update" on public.destination_submissions
  for update to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));
grant insert on public.destination_submissions to anon, authenticated;
grant select, update on public.destination_submissions to authenticated;

create table if not exists public.travel_advisories (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  region text not null default 'Sri Lanka',
  category text not null default 'General',
  body text not null,
  source_url text,
  starts_at timestamptz not null default now(),
  ends_at timestamptz,
  created_at timestamptz not null default now()
);
alter table public.travel_advisories enable row level security;
drop policy if exists "active_advisories_read" on public.travel_advisories;
create policy "active_advisories_read" on public.travel_advisories for select to anon, authenticated
  using (starts_at <= now() and (ends_at is null or ends_at >= now()));
drop policy if exists "advisories_admin_manage" on public.travel_advisories;
create policy "advisories_admin_manage" on public.travel_advisories for all to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));
grant select on public.travel_advisories to anon, authenticated;
grant insert, update, delete on public.travel_advisories to authenticated;
