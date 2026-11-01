-- Run this in the Supabase SQL editor. Public read, authenticated admin write.
create table if not exists public.projects (
 id bigint generated always as identity primary key,
 sort_order integer not null default 0,
 title text not null,
 summary text not null default '',
 client text not null default '',
 year text not null default '',
 services text not null default '',
 tech text not null default '',
 description text not null default '',
 brand text not null default '',
 agency text not null default '',
 url text not null default '',
 images text[] not null default '{}',
 dark boolean not null default false,
 created_at timestamptz not null default now()
);
create table if not exists public.testimonials (
 id bigint generated always as identity primary key,
 sort_order integer not null default 0,
 initials text not null default '',
 quote text not null,
 name text not null,
 role text not null default '',
 company text not null default '',
 created_at timestamptz not null default now()
);
alter table public.projects enable row level security;
alter table public.testimonials enable row level security;
create policy "Public can view projects" on public.projects for select to anon, authenticated using (true);
create policy "Public can view testimonials" on public.testimonials for select to anon, authenticated using (true);
-- No public insert/update/delete policies; manage through the SQL editor or secure backend.
