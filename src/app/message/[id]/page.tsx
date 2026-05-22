import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import ReactionBar from '@/components/ReactionBar';
import LocalTimestamp from '@/components/LocalTimestamp';
import CommentSection from '@/components/CommentSection';
import BoostPanel from '@/components/BoostPanel';
import type { Message } from '@/types';

const COLOR_BG: Record<string, string> = {
  rose:     'bg-[#fff1f2] border-rose-200',
  lavender: 'bg-[#f5f3ff] border-violet-200',
  sky:      'bg-[#f0f9ff] border-sky-200',
  mint:     'bg-[#f0fdf4] border-emerald-200',
  peach:    'bg-[#fff7ed] border-orange-200',
  cream:    'bg-[#fefce8] border-yellow-200',
};

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase.from('messages').select('content, author_name, is_anonymous').eq('id', id).single();
  if (!data) return { title: 'Note not found' };

  const author = data.is_anonymous ? 'A secret admirer' : data.author_name;
  const snippet = data.content.slice(0, 120) + (data.content.length > 120 ? '…' : '');

  return {
    title: `A note from ${author}`,
    description: snippet,
    openGraph: {
      title: `A love note from ${author} 💌`,
      description: snippet,
      type: 'article',
    },
  };
}

export default async function MessagePage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<Record<string, string>> }) {
  const { id } = await params;
  const { boost_success: boostSuccess } = await searchParams;
  const supabase = await createClient();

  const { data: message } = await supabase
    .from('messages_with_reactions')
    .select('*')
    .eq('id', id)
    .single();

  if (!message) notFound();

  const [{ data: comments }, { data: { user } }] = await Promise.all([
    supabase.from('comments').select('*').eq('message_id', id).order('created_at', { ascending: true }),
    supabase.auth.getUser(),
  ]);

  const msg = message as Message;
  const isOwner = !!user && user.id === msg.author_id;
  const paymentsEnabled = !!process.env.STRIPE_SECRET_KEY;
  const colorClass = COLOR_BG[msg.color] ?? COLOR_BG.rose;
  const displayName = msg.is_anonymous ? 'A secret admirer' : msg.author_name;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: `A love note from ${displayName}`,
    author: { '@type': 'Person', name: displayName },
    datePublished: msg.created_at,
    publisher: { '@type': 'Organization', name: 'LoveWall', url: 'https://www.lovewall.space' },
    mainEntityOfPage: `https://www.lovewall.space/message/${msg.id}`,
  };

  return (
    <div className="max-w-lg mx-auto px-4 py-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Link href="/" className="inline-flex items-center gap-1 text-sm text-[#9ca3af] hover:text-[#f43f5e] transition mb-8">
        ← Back to the wall
      </Link>

      {boostSuccess && (
        <div className="mb-4 bg-green-50 border border-green-200 rounded-xl px-4 py-3 text-sm text-green-700 font-medium">
          🎉 Boost activated! {boostSuccess === 'sticky' ? 'Your note is now pinned to the top of the wall for 24 hours.' : 'Your note now has a special style.'}
        </div>
      )}

      <article className={`rounded-2xl border p-8 shadow-sm ${colorClass}`}>
        <header className="mb-6">
          <p className="text-sm text-[#9ca3af]">
            <LocalTimestamp iso={msg.created_at} />
          </p>
          <p className="text-lg font-semibold text-[#1a1a2e] mt-1">From: {displayName}</p>
        </header>

        <p className="text-[#1a1a2e] leading-relaxed text-base whitespace-pre-wrap">
          {msg.content}
        </p>

        <div className="mt-8 pt-5 border-t border-white/50">
          <p className="text-xs text-[#9ca3af] mb-3">React to this note</p>
          <ReactionBar messageId={msg.id} initialCounts={msg.reaction_counts ?? []} />
        </div>

        {msg.allow_comments && (
          <CommentSection
            messageId={msg.id}
            initialComments={comments ?? []}
            isSignedIn={!!user}
          />
        )}

        {isOwner && (
          <BoostPanel
            messageId={msg.id}
            stickyUntil={msg.sticky_until}
            premiumStyle={msg.premium_style}
            paymentsEnabled={paymentsEnabled}
          />
        )}
      </article>

      <div className="text-center mt-10">
        <p className="text-[#9ca3af] text-sm mb-3">Want to leave your own note?</p>
        <Link
          href="/post"
          className="inline-block bg-[#f43f5e] text-white font-bold px-6 py-2.5 rounded-full hover:bg-[#e11d48] transition active:scale-95"
        >
          💌 Write a love note
        </Link>
      </div>
    </div>
  );
}
