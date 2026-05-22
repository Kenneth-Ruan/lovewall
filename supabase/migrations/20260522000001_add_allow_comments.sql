alter table public.messages
  add column if not exists allow_comments boolean default false not null;
