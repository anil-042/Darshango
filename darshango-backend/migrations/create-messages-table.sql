-- Create messages table
drop table if exists public.messages;

create table public.messages (
  id uuid default gen_random_uuid() primary key,
  project_id uuid not null, -- Can be linked to projects table if desired, but kept loose for now or add FK
  sender_id uuid references public.users(id) on delete set null,
  sender_name text,
  content text not null,
  created_at timestamptz default timezone('utc'::text, now())
);

-- Add indexes
create index messages_project_id_idx on public.messages(project_id);
create index messages_created_at_idx on public.messages(created_at asc);

-- RLS Policies
alter table public.messages enable row level security;

-- Allow all authenticated users to read/insert
create policy "Enable all access for authenticated users" on public.messages
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
