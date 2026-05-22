'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null);
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  async function signOut() {
    await supabase.auth.signOut();
    window.location.href = '/';
  }

  return (
    <nav className="sticky top-0 z-50 bg-[#fff9f9]/90 backdrop-blur-md border-b border-[#f1d4d4]">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-[#f43f5e] tracking-tight">
          💌 LoveWall
        </Link>
        <div className="flex items-center gap-3">
          {user ? (
            <>
              <Link
                href="/post"
                className="bg-[#f43f5e] text-white text-sm font-semibold px-4 py-1.5 rounded-full hover:bg-[#e11d48] transition active:scale-95"
              >
                + Leave a Note
              </Link>
              <button
                onClick={signOut}
                className="text-sm text-[#9ca3af] hover:text-[#f43f5e] transition"
              >
                Sign out
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="bg-[#f43f5e] text-white text-sm font-semibold px-4 py-1.5 rounded-full hover:bg-[#e11d48] transition active:scale-95"
            >
              Sign in to post
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
