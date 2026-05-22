'use server';

import { createClient } from '@/lib/supabase/server';
import { censor } from '@/lib/profanity';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

const DAILY_LIMIT = 10;

export async function submitMessage(params: {
  content: string;
  color: string;
  alias: string;
  allowComments: boolean;
}): Promise<{ error?: string }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'You must be signed in to post.' };

  // Rate limit: max DAILY_LIMIT posts per calendar day
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);
  const { count } = await supabase
    .from('messages')
    .select('*', { count: 'exact', head: true })
    .eq('author_id', user.id)
    .gte('created_at', startOfDay.toISOString());

  if ((count ?? 0) >= DAILY_LIMIT) {
    return { error: `You've reached today's limit of ${DAILY_LIMIT} notes. Come back tomorrow! 💌` };
  }

  const alias = params.alias.trim().slice(0, 40);
  const content = censor(params.content.trim());

  const { error } = await supabase.from('messages').insert({
    content,
    color: params.color,
    author_id: user.id,
    author_name: alias || 'A secret admirer',
    is_anonymous: !alias,
    allow_comments: params.allowComments,
  });

  if (error) return { error: error.message };

  revalidatePath('/');
  redirect('/');
}
