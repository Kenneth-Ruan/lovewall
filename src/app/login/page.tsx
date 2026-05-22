'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const supabase = createClient();
  const router = useRouter();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (mode === 'login') {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) { setError(error.message); setLoading(false); return; }
      router.push('/');
      router.refresh();
    } else {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { display_name: displayName } },
      });
      if (error) { setError(error.message); setLoading(false); return; }
      setSent(true);
    }
    setLoading(false);
  }

  if (sent) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <div className="text-5xl mb-4">💌</div>
          <h2 className="text-2xl font-bold text-[#1a1a2e] mb-2">Check your email!</h2>
          <p className="text-[#6b7280]">We sent a confirmation link to <strong>{email}</strong>. Click it to activate your account.</p>
          <Link href="/" className="mt-6 inline-block text-[#f43f5e] font-semibold hover:underline">← Back to the wall</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="text-4xl mb-2">💌</div>
          <h1 className="text-2xl font-extrabold text-[#1a1a2e]">
            {mode === 'login' ? 'Welcome back' : 'Join LoveWall'}
          </h1>
          <p className="text-[#9ca3af] text-sm mt-1">
            {mode === 'login' ? 'Sign in to leave your note' : 'Create an account to share love'}
          </p>
        </div>

        <form onSubmit={submit} className="bg-white border border-[#f1d4d4] rounded-2xl p-6 shadow-sm space-y-4">
          {mode === 'register' && (
            <div>
              <label className="block text-sm font-medium text-[#374151] mb-1">Display name</label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                required
                placeholder="How should we call you?"
                className="w-full border border-[#f1d4d4] rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#f43f5e]/30 focus:border-[#f43f5e]"
              />
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-[#374151] mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
              className="w-full border border-[#f1d4d4] rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#f43f5e]/30 focus:border-[#f43f5e]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#374151] mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              placeholder="••••••••"
              className="w-full border border-[#f1d4d4] rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#f43f5e]/30 focus:border-[#f43f5e]"
            />
          </div>

          {error && <p className="text-sm text-red-500 bg-red-50 rounded-xl px-3 py-2">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#f43f5e] text-white font-bold py-2.5 rounded-xl hover:bg-[#e11d48] transition active:scale-95 disabled:opacity-60"
          >
            {loading ? '...' : mode === 'login' ? 'Sign in' : 'Create account'}
          </button>
        </form>

        <p className="text-center text-sm text-[#9ca3af] mt-4">
          {mode === 'login' ? (
            <>No account? <button onClick={() => setMode('register')} className="text-[#f43f5e] font-semibold hover:underline">Sign up</button></>
          ) : (
            <>Already have one? <button onClick={() => setMode('login')} className="text-[#f43f5e] font-semibold hover:underline">Sign in</button></>
          )}
        </p>
      </div>
    </div>
  );
}
