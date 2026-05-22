'use server';

import { createClient } from '@/lib/supabase/server';
import { censor } from '@/lib/profanity';
import { revalidatePath } from 'next/cache';

export async function postComment(
  messageId: string,
  content: string
): Promise<{ error?: string }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Sign in to leave a comment.' };

  const trimmed = content.trim();
  if (!trimmed || trimmed.length > 300) return { error: 'Comment must be 1–300 characters.' };

  const authorName = (user.user_metadata?.display_name as string) ?? user.email?.split('@')[0] ?? 'Someone';

  const { error } = await supabase.from('comments').insert({
    message_id: messageId,
    author_id: user.id,
    author_name: authorName,
    content: censor(trimmed),
  });

  if (error) return { error: error.message };
  revalidatePath(`/message/${messageId}`);
  return {};
}
