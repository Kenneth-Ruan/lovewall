'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import type { CardColor } from '@/types';

const COLORS: { id: CardColor; label: string; bg: string; ring: string }[] = [
  { id: 'rose',     label: '🌹 Rose',     bg: 'bg-[#fff1f2]', ring: 'ring-rose-400' },
  { id: 'lavender', label: '💜 Lavender', bg: 'bg-[#f5f3ff]', ring: 'ring-violet-400' },
  { id: 'sky',      label: '💙 Sky',      bg: 'bg-[#f0f9ff]', ring: 'ring-sky-400' },
  { id: 'mint',     label: '💚 Mint',     bg: 'bg-[#f0fdf4]', ring: 'ring-emerald-400' },
  { id: 'peach',    label: '🍑 Peach',    bg: 'bg-[#fff7ed]', ring: 'ring-orange-400' },
  { id: 'cream',    label: '🌼 Cream',    bg: 'bg-[#fefce8]', ring: 'ring-yellow-400' },
];

const MAX_CONTENT = 500;
const MAX_ALIAS = 40;

export default function PostForm({ userId }: { userId: string }) {
  const [content, setContent] = useState('');
  const [alias, setAlias] = useState('');
  const [color, setColor] = useState<CardColor>('rose');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const supabase = createClient();
  const router = useRouter();

  const displayAlias = alias.trim() || 'A secret admirer';

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!content.trim()) return;
    setLoading(true);
    setError('');

    const { error } = await supabase.from('messages').insert({
      content: content.trim(),
      color,
      author_id: userId,
      author_name: displayAlias,
      is_anonymous: !alias.trim(),
    });

    if (error) { setError(error.message); setLoading(false); return; }
    router.push('/');
    router.refresh();
  }

  return (
    <form onSubmit={submit} className="bg-white border border-[#f1d4d4] rounded-2xl p-6 shadow-sm space-y-5">
      {/* Color picker */}
      <div>
        <label className="block text-sm font-medium text-[#374151] mb-2">Card color</label>
        <div className="flex flex-wrap gap-2">
          {COLORS.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setColor(c.id)}
              className={`${c.bg} px-3 py-1.5 rounded-full text-xs font-semibold border transition
                ${color === c.id ? `ring-2 ${c.ring} border-transparent` : 'border-gray-200 hover:border-gray-300'}`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Message */}
      <div>
        <label className="block text-sm font-medium text-[#374151] mb-1">Your message</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value.slice(0, MAX_CONTENT))}
          rows={6}
          required
          placeholder="Write something from the heart..."
          className="w-full border border-[#f1d4d4] rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#f43f5e]/30 focus:border-[#f43f5e] resize-none"
        />
        <p className={`text-xs mt-1 text-right ${content.length >= MAX_CONTENT * 0.9 ? 'text-[#f43f5e]' : 'text-[#9ca3af]'}`}>
          {content.length}/{MAX_CONTENT}
        </p>
      </div>

      {/* Alias */}
      <div>
        <label className="block text-sm font-medium text-[#374151] mb-1">Sign as</label>
        <input
          type="text"
          value={alias}
          onChange={(e) => setAlias(e.target.value.slice(0, MAX_ALIAS))}
          placeholder="A secret admirer"
          className="w-full border border-[#f1d4d4] rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#f43f5e]/30 focus:border-[#f43f5e]"
        />
        <p className="text-xs text-[#9ca3af] mt-1">Leave blank to stay anonymous</p>
      </div>

      {/* Preview */}
      {content && (
        <div className={`rounded-xl p-4 text-sm text-[#1a1a2e] border ${
          color === 'rose'     ? 'bg-[#fff1f2] border-rose-200'    :
          color === 'lavender' ? 'bg-[#f5f3ff] border-violet-200'  :
          color === 'sky'      ? 'bg-[#f0f9ff] border-sky-200'     :
          color === 'mint'     ? 'bg-[#f0fdf4] border-emerald-200' :
          color === 'peach'    ? 'bg-[#fff7ed] border-orange-200'  :
                                 'bg-[#fefce8] border-yellow-200'
        }`}>
          <p className="text-xs text-[#9ca3af] mb-2">Preview ✨</p>
          <p className="whitespace-pre-wrap leading-relaxed">{content}</p>
          <p className="text-xs text-[#9ca3af] mt-2">— {displayAlias}</p>
        </div>
      )}

      {error && <p className="text-sm text-red-500 bg-red-50 rounded-xl px-3 py-2">{error}</p>}

      <button
        type="submit"
        disabled={loading || !content.trim()}
        className="w-full bg-[#f43f5e] text-white font-bold py-2.5 rounded-xl hover:bg-[#e11d48] transition active:scale-95 disabled:opacity-50"
      >
        {loading ? 'Posting...' : '💌 Post to the wall'}
      </button>
    </form>
  );
}
