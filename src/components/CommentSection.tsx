'use client';

import { useState } from 'react';
import { postComment } from '@/app/message/[id]/actions';

interface Comment {
  id: string;
  author_name: string;
  content: string;
  created_at: string;
}

const MAX = 300;

export default function CommentSection({
  messageId,
  initialComments,
  isSignedIn,
}: {
  messageId: string;
  initialComments: Comment[];
  isSignedIn: boolean;
}) {
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim()) return;
    setLoading(true);
    setError('');

    const result = await postComment(messageId, text);
    if (result.error) {
      setError(result.error);
    } else {
      setComments((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          author_name: 'You',
          content: text.trim(),
          created_at: new Date().toISOString(),
        },
      ]);
      setText('');
    }
    setLoading(false);
  }

  return (
    <div className="mt-8 pt-6 border-t border-white/60">
      <h3 className="text-sm font-semibold text-[#374151] mb-4">
        Comments {comments.length > 0 && <span className="text-[#9ca3af] font-normal">({comments.length})</span>}
      </h3>

      {/* Comment list */}
      {comments.length > 0 ? (
        <ul className="space-y-3 mb-5">
          {comments.map((c) => (
            <li key={c.id} className="bg-white/60 rounded-xl px-4 py-3">
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-xs font-semibold text-[#1a1a2e]">{c.author_name}</span>
                <span className="text-xs text-[#9ca3af]">
                  {new Date(c.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                </span>
              </div>
              <p className="text-sm text-[#374151] leading-relaxed">{c.content}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-[#9ca3af] mb-5">No comments yet — be the first!</p>
      )}

      {/* Comment input */}
      {isSignedIn ? (
        <form onSubmit={submit} className="space-y-2">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value.slice(0, MAX))}
            rows={2}
            placeholder="Leave a kind reply..."
            className="w-full border border-white/70 bg-white/60 rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#f43f5e]/30 focus:border-[#f43f5e] resize-none"
          />
          <div className="flex items-center justify-between">
            <span className={`text-xs ${text.length >= MAX * 0.9 ? 'text-[#f43f5e]' : 'text-[#9ca3af]'}`}>
              {text.length}/{MAX}
            </span>
            <button
              type="submit"
              disabled={loading || !text.trim()}
              className="bg-[#f43f5e] text-white text-xs font-bold px-4 py-1.5 rounded-full hover:bg-[#e11d48] transition active:scale-95 disabled:opacity-50"
            >
              {loading ? '...' : 'Post'}
            </button>
          </div>
          {error && <p className="text-xs text-red-500">{error}</p>}
        </form>
      ) : (
        <a
          href="/login"
          className="text-sm text-[#f43f5e] font-semibold hover:underline"
        >
          Sign in to leave a comment →
        </a>
      )}
    </div>
  );
}
