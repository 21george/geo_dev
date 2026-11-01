-- Private client enquiries. Run in Supabase SQL Editor.
create extension if not exists pgcrypto;

create table if not exists public.inquiries (
  id uuid primary key default gen_random_uuid(),
  kind text not null check (kind in ('call','message')),
  name text not null,
  email text not null,
  company text not null default '',
  message text not null default '',
  requested_date date,
  requested_time time without time zone,
  requested_timezone text,
  status text not null default 'new' check (status in ('new','pending','confirmed','declined','completed','archived')),
  email_status text not null default 'pending' check (email_status in ('pending','sent','failed')),
  consent_at timestamptz not null,
  created_at timestamptz not null default now(),
  constraint call_requires_datetime check (kind <> 'call' or (requested_date is not null and requested_time is not null)),
  constraint message_has_text check (kind <> 'message' or length(trim(message)) >= 10)
);

create index if not exists inquiries_created_at_idx on public.inquiries (created_at desc);
create index if not exists inquiries_status_idx on public.inquiries (status, created_at desc);

alter table public.inquiries enable row level security;
-- No anon or authenticated policies: public visitors never read or write this table directly.
revoke all on public.inquiries from anon, authenticated;
grant select, insert, update on public.inquiries to service_role;
-- A server-side Supabase secret or legacy service-role key is required for inserts.
