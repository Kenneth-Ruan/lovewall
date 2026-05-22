-- Drop and recreate view so new columns (allow_comments, is_sticky, sticky_until, premium_style)
-- are included — CREATE OR REPLACE can't insert columns into existing positions.
drop view if exists public.messages_with_reactions;
create view public.messages_with_reactions as
select
  m.id,
  m.content,
  m.color,
  m.author_id,
  m.author_name,
  m.is_anonymous,
  m.allow_comments,
  m.is_sticky,
  m.sticky_until,
  m.premium_style,
  m.created_at,
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
