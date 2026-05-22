import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'About LoveWall — The Internet\'s Digital Love Note Wall',
  description: 'LoveWall is a free digital message wall where people leave love notes, affirmations, and heartfelt messages for the internet to read. A time capsule of human kindness.',
  keywords: [
    'love wall', 'message wall', 'digital love notes', 'internet message wall',
    'online affirmation wall', 'time capsule', 'anonymous love notes',
    'heartfelt messages', 'community wall', 'wall of love',
    'digital time capsule', 'internet kindness', 'love notes online',
    'message board', 'virtual love wall',
  ].join(', '),
  openGraph: {
    title: 'About LoveWall — The Internet\'s Digital Love Note Wall',
    description: 'A free message wall where anyone can leave love notes, affirmations, and kind words. A living time capsule of the internet\'s heart.',
    type: 'website',
  },
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-12">
      <h2 className="text-2xl font-bold text-[#f43f5e] mb-4 pb-2 border-b border-[#f1d4d4]">{title}</h2>
      <div className="space-y-4 text-[#374151] leading-relaxed">{children}</div>
    </section>
  );
}

export default function AboutPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      {/* Hero */}
      <div className="text-center mb-14">
        <div className="text-5xl mb-4">💌</div>
        <h1 className="text-4xl font-extrabold text-[#1a1a2e] mb-4 leading-tight">
          The Internet&apos;s Love Wall
        </h1>
        <p className="text-[#6b7280] text-lg max-w-lg mx-auto">
          A free, open digital message wall where anyone can leave a love note,
          an affirmation, or a kind word — for the world to read.
        </p>
      </div>

      <Section title="What is LoveWall?">
        <p>
          LoveWall is a <strong>digital love wall</strong> — a public message board on the internet
          where people from all over the world leave heartfelt notes, affirmations, dedications,
          and words of encouragement. Think of it as a virtual bulletin board covered in sticky
          notes, each one a small act of kindness posted for strangers to find.
        </p>
        <p>
          Unlike social media, there are no followers, no algorithms, and no performance.
          Just people leaving genuine messages on a shared wall — anonymous if they choose,
          signed if they&apos;re brave enough.
        </p>
      </Section>

      <Section title="A Digital Time Capsule">
        <p>
          Every note left on LoveWall is a snapshot of a human moment — a feeling, a memory,
          a wish. Together, they form a <strong>living digital time capsule</strong> of the
          internet&apos;s kindness. Years from now, people will be able to scroll back through
          this wall and read what strangers felt moved to say.
        </p>
        <p>
          Leave a message for someone you love. Leave one for a stranger who might need it.
          Leave one for your future self. Every note is preserved and discoverable — a small
          monument to the fact that you were here, and you had something worth saying.
        </p>
        <p>
          The internet is often loud and harsh. LoveWall is our answer to that —
          a quiet corner of the web dedicated to warmth.
        </p>
      </Section>

      <Section title="For Everyone, From Everywhere">
        <p>
          LoveWall is free and open to anyone with an internet connection. You don&apos;t need
          to know anyone on the wall to enjoy it. Browse the <strong>message wall</strong>,
          react to notes that move you, and when you&apos;re ready — leave one of your own.
        </p>
        <p>
          Signing up takes under a minute: just an email and password. You can post under
          your name, a nickname, or stay completely anonymous as <em>&quot;A secret admirer.&quot;</em>
          Your identity is yours to share or keep.
        </p>
      </Section>

      <Section title="How It Works">
        <ul className="space-y-3">
          {[
            ['📖 Browse freely', 'Anyone can read the love wall — no account needed.'],
            ['❤️ React to notes', 'Five emoji reactions: ❤️ 🌸 ✨ 🥹 💌 — no login required.'],
            ['✍️ Leave a note', 'Sign up, pick a card color, write your message, sign it or stay anonymous.'],
            ['🔗 Share a note', 'Every message has its own URL — share one that meant something to you.'],
            ['🕊️ Keep it kind', 'We automatically filter inappropriate language to keep the wall warm and safe.'],
          ].map(([title, desc]) => (
            <li key={title as string} className="flex gap-3">
              <span className="shrink-0 font-semibold text-[#1a1a2e]">{title}</span>
              <span className="text-[#6b7280]">— {desc}</span>
            </li>
          ))}
        </ul>
      </Section>

      <Section title="Why We Built This">
        <p>
          We believe the internet can be a place of genuine human connection — not just
          outrage, ads, and noise. LoveWall started as a simple question: what if there was
          a corner of the web that was just&hellip; nice?
        </p>
        <p>
          A public message wall where people left real feelings. An online space that felt
          more like a corkboard in a coffee shop than a social media feed. A place where
          a stranger&apos;s words could make your day.
        </p>
        <p>
          That&apos;s LoveWall. We&apos;re glad you found it.
        </p>
      </Section>

      {/* CTA */}
      <div className="text-center mt-8 p-8 bg-[#fff1f2] rounded-2xl border border-rose-200">
        <p className="text-[#1a1a2e] font-semibold mb-4 text-lg">
          Ready to leave your mark on the wall?
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="bg-white border border-[#f1d4d4] text-[#f43f5e] font-bold px-6 py-2.5 rounded-full hover:bg-[#fff1f2] transition"
          >
            Browse the wall
          </Link>
          <Link
            href="/login"
            className="bg-[#f43f5e] text-white font-bold px-6 py-2.5 rounded-full hover:bg-[#e11d48] transition active:scale-95"
          >
            💌 Leave a note
          </Link>
        </div>
      </div>
    </div>
  );
}
