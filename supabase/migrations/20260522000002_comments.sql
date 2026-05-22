create table public.comments (
  id uuid primary key default gen_random_uuid(),
  message_id uuid references public.messages(id) on delete cascade not null,
  author_id uuid references auth.users(id) on delete cascade not null,
  author_name text not null,
  content text not null check (char_length(content) <= 300),
  created_at timestamptz default now() not null
);

alter table public.comments enable row level security;

create policy "comments_select" on public.comments for select using (true);
create policy "comments_insert" on public.comments for insert to authenticated
  with check (auth.uid() = author_id);
create policy "comments_delete" on public.comments for delete to authenticated
  using (auth.uid() = author_id);
