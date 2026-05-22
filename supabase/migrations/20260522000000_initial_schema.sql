-- Enable UUID extension
create extension if not exists "pgcrypto";

-- Messages table
create table public.messages (
  id uuid primary key default gen_random_uuid(),
  content text not null check (char_length(content) <= 1000),
  color text not null default 'rose' check (color in ('rose', 'lavender', 'sky', 'mint', 'peach', 'cream')),
  author_id uuid references auth.users(id) on delete cascade not null,
  author_name text not null,
  is_anonymous boolean default false not null,
  created_at timestamptz default now() not null
);

-- Reactions table (no auth required — uses session_id for dedup)
create table public.reactions (
  id uuid primary key default gen_random_uuid(),
  message_id uuid references public.messages(id) on delete cascade not null,
  emoji text not null check (emoji in ('❤️', '🌸', '✨', '🥹', '💌')),
  session_id text not null,
  created_at timestamptz default now() not null,
  unique(message_id, emoji, session_id)
);

-- RLS
alter table public.messages enable row level security;
alter table public.reactions enable row level security;

-- Messages: anyone can read, auth users can insert their own
create policy "messages_select" on public.messages for select using (true);
create policy "messages_insert" on public.messages for insert to authenticated with check (auth.uid() = author_id);
create policy "messages_delete" on public.messages for delete to authenticated using (auth.uid() = author_id);

-- Reactions: anyone can read and insert (session-scoped)
create policy "reactions_select" on public.reactions for select using (true);
create policy "reactions_insert" on public.reactions for insert with check (true);
create policy "reactions_delete" on public.reactions for delete using (true);

-- View: messages with reaction counts
create or replace view public.messages_with_reactions as
select
  m.*,
  coalesce(
    json_agg(
      json_build_object('emoji', r.emoji, 'count', r.cnt)
      order by r.cnt desc
    ) filter (where r.emoji is not null),
    '[]'
  ) as reaction_counts
from public.messages m
left join (
  select message_id, emoji, count(*) as cnt
  from public.reactions
  group by message_id, emoji
) r on r.message_id = m.id
group by m.id;
