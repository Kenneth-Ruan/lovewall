import type { Metadata } from 'next';
import { Geist } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';

const geist = Geist({ variable: '--font-geist-sans', subsets: ['latin'] });

export const metadata: Metadata = {
  title: { default: 'LoveWall — Share Your Love Notes', template: '%s | LoveWall' },
  description: 'A beautiful digital love wall where people share heartfelt messages, affirmations, and love notes. Read, react, and leave your own.',
  keywords: ['love wall', 'love notes', 'digital messages', 'heartfelt', 'affirmations', 'community'],
  openGraph: {
    type: 'website',
    siteName: 'LoveWall',
    title: 'LoveWall — Share Your Love Notes',
    description: 'A beautiful digital love wall where people share heartfelt messages, affirmations, and love notes.',
  },
  twitter: { card: 'summary_large_image' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geist.variable} h-full`}>
      <body className="min-h-full flex flex-col bg-[#fff9f9]">
        <Navbar />
        <main className="flex-1">{children}</main>
        <footer className="border-t border-[#f1d4d4] py-6 text-center text-sm text-[#9ca3af]">
          Made with ❤️ — LoveWall
        </footer>
      </body>
    </html>
  );
}
