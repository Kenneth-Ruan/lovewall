alter table public.messages
  add column if not exists is_sticky boolean default false not null,
  add column if not exists sticky_until timestamptz,
  add column if not exists premium_style text check (premium_style in ('gold', 'glow'));
