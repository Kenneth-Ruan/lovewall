import type { Metadata } from 'next';
import { Geist } from 'next/font/google';
import Script from 'next/script';
import './globals.css';
import Navbar from '@/components/Navbar';

const geist = Geist({ variable: '--font-geist-sans', subsets: ['latin'] });

const BASE = 'https://www.lovewall.space';

export const metadata: Metadata = {
  metadataBase: new URL(BASE),
  title: { default: 'LoveWall — The Internet\'s Digital Love Note Wall', template: '%s | LoveWall' },
  description: 'LoveWall is a free digital message wall where anyone can leave love notes, affirmations, and heartfelt messages. A living time capsule of the internet\'s kindness.',
  keywords: [
    'love wall', 'message wall', 'digital love notes', 'internet message wall',
    'online affirmation wall', 'time capsule', 'anonymous love notes',
    'heartfelt messages', 'community wall', 'wall of love', 'love notes online',
  ],
  alternates: { canonical: BASE },
  openGraph: {
    type: 'website',
    siteName: 'LoveWall',
    url: BASE,
    title: 'LoveWall — The Internet\'s Digital Love Note Wall',
    description: 'A free digital message wall for love notes, affirmations, and kind words. A time capsule of the internet\'s heart.',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'LoveWall' }],
  },
  twitter: { card: 'summary_large_image', title: 'LoveWall', description: 'The internet\'s love note wall.' },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'LoveWall',
  url: BASE,
  description: 'A free digital message wall where anyone can leave love notes, affirmations, and heartfelt messages.',
  potentialAction: {
    '@type': 'SearchAction',
    target: `${BASE}/?q={search_term_string}`,
    'query-input': 'required name=search_term_string',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geist.variable} h-full`}>
      <body className="min-h-full flex flex-col bg-[#fff9f9]">
        <Script
          id="json-ld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-SGYZLLGS96" strategy="afterInteractive" />
        <Script id="gtag-init" strategy="afterInteractive">{`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-SGYZLLGS96');
        `}</Script>
        <Navbar />
        <main className="flex-1">{children}</main>
        <footer className="border-t border-[#f1d4d4] py-6 text-center text-sm text-[#9ca3af]">
          <div className="flex justify-center gap-6 mb-2">
            <a href="/about" className="hover:text-[#f43f5e] transition">About</a>
          </div>
          Made with ❤️ — LoveWall
        </footer>
      </body>
    </html>
  );
}
