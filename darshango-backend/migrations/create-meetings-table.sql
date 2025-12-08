-- Create meetings table
create table if not exists public.meetings (
  id uuid default gen_random_uuid() primary key,
  host_id uuid references auth.users(id) on delete set null,
  host_name text,
  meeting_with text not null,
  meeting_id text not null,
  timestamp timestamptz default timezone('utc'::text, now()),
  created_at timestamptz default timezone('utc'::text, now())
);

-- Add index
create index if not exists meetings_host_id_idx on public.meetings(host_id);
create index if not exists meetings_created_at_idx on public.meetings(created_at desc);

-- RLS Policies (Optional but recommended)
alter table public.meetings enable row level security;

-- Allow all authenticated users to read/insert for this MVP
create policy "Enable all access for authenticated users" on public.meetings
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
