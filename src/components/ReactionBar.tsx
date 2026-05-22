'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { ReactionCount } from '@/types';

const EMOJIS = ['❤️', '🌸', '✨', '🥹', '💌'];

function getSessionId(): string {
  let id = localStorage.getItem('lovewall_session');
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem('lovewall_session', id);
  }
  return id;
}

export default function ReactionBar({
  messageId,
  initialCounts,
}: {
  messageId: string;
  initialCounts: ReactionCount[];
}) {
  const [counts, setCounts] = useState<Record<string, number>>(() => {
    const map: Record<string, number> = {};
    initialCounts.forEach(({ emoji, count }) => { map[emoji] = count; });
    return map;
  });
  const [reacted, setReacted] = useState<Set<string>>(new Set());
  const supabase = createClient();

  useEffect(() => {
    const sessionId = getSessionId();
    supabase
      .from('reactions')
      .select('emoji')
      .eq('message_id', messageId)
      .eq('session_id', sessionId)
      .then(({ data }) => {
        if (data) setReacted(new Set(data.map((r: { emoji: string }) => r.emoji)));
      });
  }, [messageId]);

  async function toggle(emoji: string) {
    const sessionId = getSessionId();
    if (reacted.has(emoji)) {
      await supabase
        .from('reactions')
        .delete()
        .eq('message_id', messageId)
        .eq('emoji', emoji)
        .eq('session_id', sessionId);
      setReacted((s) => { const n = new Set(s); n.delete(emoji); return n; });
      setCounts((c) => ({ ...c, [emoji]: Math.max(0, (c[emoji] ?? 0) - 1) }));
    } else {
      await supabase.from('reactions').insert({ message_id: messageId, emoji, session_id: sessionId });
      setReacted((s) => new Set([...s, emoji]));
      setCounts((c) => ({ ...c, [emoji]: (c[emoji] ?? 0) + 1 }));
    }
  }

  return (
    <div className="flex flex-wrap gap-1.5">
      {EMOJIS.map((emoji) => {
        const count = counts[emoji] ?? 0;
        const active = reacted.has(emoji);
        return (
          <button
            key={emoji}
            onClick={() => toggle(emoji)}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold transition active:scale-95
              ${active
                ? 'bg-[#f43f5e] text-white shadow-sm'
                : 'bg-white/70 text-[#6b7280] hover:bg-white hover:text-[#f43f5e] border border-white/50'
              }`}
          >
            <span>{emoji}</span>
            {count > 0 && <span>{count}</span>}
          </button>
        );
      })}
    </div>
  );
}
