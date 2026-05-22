import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import PostForm from '@/components/PostForm';

export const metadata = { title: 'Leave a Note' };

export default async function PostPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const displayName = (user.user_metadata?.display_name as string) ?? user.email?.split('@')[0] ?? 'Anonymous';

  return (
    <div className="max-w-lg mx-auto px-4 py-12">
      <div className="text-center mb-8">
        <div className="text-4xl mb-2">✍️</div>
        <h1 className="text-2xl font-extrabold text-[#1a1a2e]">Leave a Love Note</h1>
        <p className="text-[#9ca3af] text-sm mt-1">Your words might make someone&apos;s day 💌</p>
      </div>
      <PostForm userId={user.id} displayName={displayName} />
    </div>
  );
}
