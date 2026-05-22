import type { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import MessageCard from '@/components/MessageCard';
import Link from 'next/link';
import type { Message } from '@/types';

export const metadata: Metadata = {
  title: 'LoveWall — Share Your Love Notes',
  description: 'A beautiful digital love wall. Read heartfelt messages from around the world, react, and leave your own.',
};

export const revalidate = 60;

export default async function HomePage() {
  const supabase = await createClient();

  const { data: raw } = await supabase
    .from('messages_with_reactions')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(60);

  const now = Date.now();
  const messages = (raw ?? []).sort((a, b) => {
    const aSticky = a.is_sticky && a.sticky_until && new Date(a.sticky_until).getTime() > now;
    const bSticky = b.is_sticky && b.sticky_until && new Date(b.sticky_until).getTime() > now;
    if (aSticky && !bSticky) return -1;
    if (!aSticky && bSticky) return 1;
    return 0;
  });

  const { data: { user } } = await supabase.auth.getUser();

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Hero */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-extrabold text-[#1a1a2e] mb-3">
          💌 The Love Wall
        </h1>
        <p className="text-[#6b7280] text-lg max-w-md mx-auto">
          A place to leave love notes, affirmations, and warm words for the world.
        </p>
        {!user ? (
          <Link
            href="/login"
            className="mt-5 inline-block bg-[#f43f5e] text-white font-bold px-6 py-2.5 rounded-full hover:bg-[#e11d48] transition active:scale-95"
          >
            Sign in to leave a note →
          </Link>
        ) : (
          <Link
            href="/post"
            className="mt-5 inline-block bg-[#f43f5e] text-white font-bold px-6 py-2.5 rounded-full hover:bg-[#e11d48] transition active:scale-95"
          >
            + Leave a note
          </Link>
        )}
      </div>

      {/* Masonry grid */}
      {messages && messages.length > 0 ? (
        <div className="masonry-grid">
          {(messages as Message[]).map((msg) => (
            <MessageCard key={msg.id} message={msg} />
          ))}
        </div>
      ) : (
        <div className="text-center py-24 text-[#9ca3af]">
          <div className="text-5xl mb-4">💌</div>
          <p className="text-lg font-medium">No notes yet — be the first!</p>
          <Link href="/login" className="mt-4 inline-block text-[#f43f5e] font-semibold hover:underline">
            Leave a love note →
          </Link>
        </div>
      )}
    </div>
  );
}
