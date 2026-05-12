-- user_profiles: stores public profile data for customer accounts

create table if not exists public.user_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null,
  email text not null default '',
  name text not null default '',
  nationality text not null default '',
  phone text not null default '',
  birthday date,
  interests text[] not null default '{}',
  profile_complete boolean not null default false
);

drop trigger if exists user_profiles_updated_at on public.user_profiles;
create trigger user_profiles_updated_at
  before update on public.user_profiles
  for each row execute function public.update_updated_at();

create index if not exists idx_user_profiles_nationality on public.user_profiles(nationality);
create index if not exists idx_user_profiles_created_at on public.user_profiles(created_at desc);
create index if not exists idx_user_profiles_complete on public.user_profiles(profile_complete);

alter table public.user_profiles enable row level security;

-- Users can fully manage their own profile
drop policy if exists "Users can manage own profile" on public.user_profiles;
create policy "Users can manage own profile"
  on public.user_profiles for all
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Admin users (in admin_users table) can read all profiles
drop policy if exists "Admins can read all profiles" on public.user_profiles;
create policy "Admins can read all profiles"
  on public.user_profiles for select
  using (
    exists (
      select 1 from public.admin_users
      where auth_user_id = auth.uid()
    )
  );
