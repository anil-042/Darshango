-- Drop table if exists to start fresh
drop table if exists public.meetings;

-- Create meetings table with Correct Foreign Key
create table public.meetings (
  id uuid default gen_random_uuid() primary key,
  host_id uuid references public.users(id) on delete set null, -- Changed from auth.users to public.users
  host_name text,
  meeting_with text not null,
  meeting_id text not null,
  timestamp timestamptz default timezone('utc'::text, now()),
  created_at timestamptz default timezone('utc'::text, now())
);

-- Add index
create index meetings_host_id_idx on public.meetings(host_id);
create index meetings_created_at_idx on public.meetings(created_at desc);

-- RLS Policies
alter table public.meetings enable row level security;

-- Allow all authenticated users to read/insert
create policy "Enable all access for authenticated users" on public.meetings
  for all using (true) with check (true);
