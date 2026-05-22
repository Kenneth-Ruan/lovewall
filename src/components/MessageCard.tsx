import Link from 'next/link';
import type { Message } from '@/types';
import ReactionBar from './ReactionBar';

const COLOR_MAP: Record<string, string> = {
  rose:     'bg-[#fff1f2] border-rose-200',
  lavender: 'bg-[#f5f3ff] border-violet-200',
  sky:      'bg-[#f0f9ff] border-sky-200',
  mint:     'bg-[#f0fdf4] border-emerald-200',
  peach:    'bg-[#fff7ed] border-orange-200',
  cream:    'bg-[#fefce8] border-yellow-200',
};

const HEART_MAP: Record<string, string> = {
  rose:     '🌹',
  lavender: '💜',
  sky:      '💙',
  mint:     '💚',
  peach:    '🍑',
  cream:    '🌼',
};

export default function MessageCard({ message }: { message: Message }) {
  const colorClass = COLOR_MAP[message.color] ?? COLOR_MAP.rose;
  const heart = HEART_MAP[message.color] ?? '❤️';
  const displayName = message.is_anonymous ? 'A secret admirer' : message.author_name;
  const date = new Date(message.created_at).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  });

  return (
    <div className={`masonry-item rounded-2xl border p-5 shadow-sm hover:shadow-md transition-shadow ${colorClass}`}>
      <div className="text-xs text-[#9ca3af] mb-3 flex items-center gap-1.5">
        <span>{heart}</span>
        <span className="font-medium text-[#6b7280]">{displayName}</span>
        <span className="ml-auto">{date}</span>
      </div>
      <Link href={`/message/${message.id}`}>
        <p className="text-[#1a1a2e] leading-relaxed text-sm whitespace-pre-wrap hover:opacity-80 transition-opacity">
          {message.content}
        </p>
      </Link>
      <div className="mt-4">
        <ReactionBar messageId={message.id} initialCounts={message.reaction_counts ?? []} />
      </div>
    </div>
  );
}
