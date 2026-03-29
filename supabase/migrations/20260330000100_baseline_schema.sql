-- MUGOONG baseline schema
-- Safe to apply to an existing hosted project that was initially set up manually.

create extension if not exists "uuid-ossp";

create or replace function public.update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create table if not exists public.listings (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null,
  slug text unique not null,
  category text not null,
  subcategory text not null,
  city text not null,
  title text not null,
  description text not null default '',
  content text not null default '',
  image_url text not null default '',
  gallery text[] default '{}',
  price numeric(10,2) not null default 0,
  currency text not null default 'USD',
  rating numeric(2,1) not null default 0,
  review_count integer not null default 0,
  tags text[] default '{}',
  featured boolean not null default false,
  published boolean not null default false,
  menu_items jsonb default '[]',
  address text not null default '',
  phone text not null default '',
  operating_hours text not null default '',
  notes text not null default '',
  author_id uuid references auth.users(id)
);

alter table if exists public.listings add column if not exists created_at timestamptz default now() not null;
alter table if exists public.listings add column if not exists updated_at timestamptz default now() not null;
alter table if exists public.listings add column if not exists slug text;
alter table if exists public.listings add column if not exists category text;
alter table if exists public.listings add column if not exists subcategory text;
alter table if exists public.listings add column if not exists city text;
alter table if exists public.listings add column if not exists title text;
alter table if exists public.listings add column if not exists description text not null default '';
alter table if exists public.listings add column if not exists content text not null default '';
alter table if exists public.listings add column if not exists image_url text not null default '';
alter table if exists public.listings add column if not exists gallery text[] default '{}';
alter table if exists public.listings add column if not exists price numeric(10,2) not null default 0;
alter table if exists public.listings add column if not exists currency text not null default 'USD';
alter table if exists public.listings add column if not exists rating numeric(2,1) not null default 0;
alter table if exists public.listings add column if not exists review_count integer not null default 0;
alter table if exists public.listings add column if not exists tags text[] default '{}';
alter table if exists public.listings add column if not exists featured boolean not null default false;
alter table if exists public.listings add column if not exists published boolean not null default false;
alter table if exists public.listings add column if not exists menu_items jsonb default '[]';
alter table if exists public.listings add column if not exists address text not null default '';
alter table if exists public.listings add column if not exists phone text not null default '';
alter table if exists public.listings add column if not exists operating_hours text not null default '';
alter table if exists public.listings add column if not exists notes text not null default '';
alter table if exists public.listings add column if not exists author_id uuid references auth.users(id);

create unique index if not exists idx_listings_slug on public.listings(slug);
create index if not exists idx_listings_category on public.listings(category);
create index if not exists idx_listings_subcategory on public.listings(subcategory);
create index if not exists idx_listings_city on public.listings(city);
create index if not exists idx_listings_published on public.listings(published);
create index if not exists idx_listings_featured on public.listings(featured);

drop trigger if exists listings_updated_at on public.listings;
create trigger listings_updated_at
before update on public.listings
for each row execute function public.update_updated_at();

create table if not exists public.bookings (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null,
  listing_id uuid references public.listings(id) on delete set null,
  listing_title text not null,
  customer_name text not null,
  customer_email text not null,
  customer_phone text not null default '',
  booking_date date not null,
  booking_time time not null,
  guests integer not null default 1,
  total_price numeric(10,2) not null default 0,
  currency text not null default 'USD',
  status text not null default 'pending' check (status in ('pending', 'confirmed', 'cancelled', 'completed')),
  notes text not null default '',
  admin_notes text not null default ''
);

alter table if exists public.bookings add column if not exists created_at timestamptz default now() not null;
alter table if exists public.bookings add column if not exists updated_at timestamptz default now() not null;
alter table if exists public.bookings add column if not exists listing_id uuid references public.listings(id) on delete set null;
alter table if exists public.bookings add column if not exists listing_title text;
alter table if exists public.bookings add column if not exists customer_name text;
alter table if exists public.bookings add column if not exists customer_email text;
alter table if exists public.bookings add column if not exists customer_phone text not null default '';
alter table if exists public.bookings add column if not exists booking_date date;
alter table if exists public.bookings add column if not exists booking_time time;
alter table if exists public.bookings add column if not exists guests integer not null default 1;
alter table if exists public.bookings add column if not exists total_price numeric(10,2) not null default 0;
alter table if exists public.bookings add column if not exists currency text not null default 'USD';
alter table if exists public.bookings add column if not exists status text not null default 'pending';
alter table if exists public.bookings add column if not exists notes text not null default '';
alter table if exists public.bookings add column if not exists admin_notes text not null default '';

create index if not exists idx_bookings_status on public.bookings(status);
create index if not exists idx_bookings_date on public.bookings(booking_date);
create index if not exists idx_bookings_listing on public.bookings(listing_id);

drop trigger if exists bookings_updated_at on public.bookings;
create trigger bookings_updated_at
before update on public.bookings
for each row execute function public.update_updated_at();

create table if not exists public.admin_users (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamptz default now() not null,
  email text unique not null,
  name text not null,
  role text not null default 'editor' check (role in ('admin', 'editor')),
  auth_user_id uuid references auth.users(id)
);

alter table if exists public.admin_users add column if not exists created_at timestamptz default now() not null;
alter table if exists public.admin_users add column if not exists email text;
alter table if exists public.admin_users add column if not exists name text;
alter table if exists public.admin_users add column if not exists role text not null default 'editor';
alter table if exists public.admin_users add column if not exists auth_user_id uuid references auth.users(id);

alter table public.listings enable row level security;
alter table public.bookings enable row level security;
alter table public.admin_users enable row level security;

drop policy if exists "Public can read published listings" on public.listings;
create policy "Public can read published listings"
  on public.listings for select
  using (published = true);

drop policy if exists "Authenticated users can manage listings" on public.listings;
create policy "Authenticated users can manage listings"
  on public.listings for all
  using (auth.role() = 'authenticated');

drop policy if exists "Anyone can create bookings" on public.bookings;
create policy "Anyone can create bookings"
  on public.bookings for insert
  with check (true);

drop policy if exists "Authenticated users can manage bookings" on public.bookings;
create policy "Authenticated users can manage bookings"
  on public.bookings for all
  using (auth.role() = 'authenticated');

drop policy if exists "Authenticated can read admin users" on public.admin_users;
create policy "Authenticated can read admin users"
  on public.admin_users for select
  using (auth.role() = 'authenticated');

insert into storage.buckets (id, name, public)
values ('listings', 'listings', true)
on conflict (id) do update set
  name = excluded.name,
  public = excluded.public;

drop policy if exists "Public can view listing images" on storage.objects;
create policy "Public can view listing images"
  on storage.objects for select
  using (bucket_id = 'listings');

drop policy if exists "Authenticated can upload listing images" on storage.objects;
create policy "Authenticated can upload listing images"
  on storage.objects for insert
  with check (bucket_id = 'listings' and auth.role() = 'authenticated');

drop policy if exists "Authenticated can update listing images" on storage.objects;
create policy "Authenticated can update listing images"
  on storage.objects for update
  using (bucket_id = 'listings' and auth.role() = 'authenticated');

drop policy if exists "Authenticated can delete listing images" on storage.objects;
create policy "Authenticated can delete listing images"
  on storage.objects for delete
  using (bucket_id = 'listings' and auth.role() = 'authenticated');
